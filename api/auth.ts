import express, { Request, Response, NextFunction } from 'express'
import { execFile } from 'child_process'
import { cliStderrResponse, unautorizedResponse } from './handlers/util'
import * as crypto from '@shardus/crypto-utils';
import rateLimit from 'express-rate-limit';
const yaml = require('js-yaml')
const jwt = require('jsonwebtoken')
import { doubleCsrfProtection } from './csrf';
import argon2id from 'argon2';

function isValidSecret(secret: unknown) {
  return typeof secret === 'string' && secret.length >= 32;
}

function generateRandomSecret() {
  return Buffer.from(crypto.randomBytes(32)).toString('hex');
}

const jwtSecret = (isValidSecret(process.env.JWT_SECRET))
  ? process.env.JWT_SECRET
  : generateRandomSecret();
crypto.init('64f152869ca2d473e4ba64ab53f49ccdb2edae22da192c126850970e788af347');

export const loginHandler = [doubleCsrfProtection, async (req: Request, res: Response) => {
  const password = req.body && req.body.password
  const hashedPass = await argon2id.hash(password);
  // Exec the CLI validator login command
  execFile('/usr/local/bin/operator-cli', ['gui', 'login', hashedPass], (err, stdout, stderr) => {
    if (err) {
      cliStderrResponse(res, 'Unable to check login', err.message)
      return
    }
    if (stderr) {
      cliStderrResponse(res, 'Unable to check login', stderr)
      return
    }

    const cliResponse = yaml.load(stdout)

    if (cliResponse.login !== 'authorized') {
      unautorizedResponse(req, res)
      return
    }
    const accessToken = jwt.sign({ nodeId: '' /** add unique node id  */ }, jwtSecret, { expiresIn: '8h' })

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.send({ status: 'ok' })
  })
  console.log('executing operator-cli gui login...')
}]

export const logoutHandler = (req: Request, res: Response) => {
  res.clearCookie("accessToken");
  res.clearCookie("csrfToken");
  res.send({ status: 'ok' })
}

export const apiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 1500, // Limit each IP to 1500 requests per windowMs
  message: 'Too many requests from this IP, please try again after 10 minutes',
});


export const loginAttemptLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  message: 'Too many login attempts from this IP, please try again after 10 minutes',
});

export const httpBodyLimiter = express.json({ limit: '100kb' })


export const jwtMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken;

  if (!token) {
    unautorizedResponse(req, res)
    return
  }

  jwt.verify(token, jwtSecret, (err: any, jwtData: any) => {
    if (err) {// invalid token
      unautorizedResponse(req, res)
      return
    }

    next()
  })
}

export const checkAuthHandler = [
  jwtMiddleware,
  (req: Request, res: Response) => {
    res.json({ authenticated: true });
  }
];
