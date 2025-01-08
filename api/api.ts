import * as express from 'express'

import configureNodeHandlers from './handlers/node'
import fs from 'fs'
import path from 'path'
import { Request, Response } from 'express';
import asyncRouteHandler from './handlers/async-router-handler'
import { fetchWithTimeout } from "./handlers/util";
const yaml = require('js-yaml')
import { doubleCsrfProtection } from './csrf';
import { checkAuthHandler } from './auth';

const ACCOUNT_INFO_URL = process.env.ACCOUNT_INFO_URL ?? "https://explorer-atomium.shardeum.org/api/account";
// const FAUCET_CLAIM_URL =
//   process.env.FAUCET_CLAIM_URL ?? "https://api.shardeum.org/api/transfer";

const apiRouter = express.Router()
configureNodeHandlers(apiRouter)

// app.get('/node/status', (req, res) => {
//   console.log('fetching node state');
//   res.send({
//     state: 'active',
//     lastActive: '2011-05-02T11:52:23.24Z',
//     stakeAmount: '40000000000000000000',
//     stakeRequirement: '20000000000000000000',
//     earnings: '200000000000000000',
//     lastPayout: '2011-05-02T11:52:23.24Z',
//     lifetimeEarnings: '200000000000000000',
//     stakeAddress: '0x23904...',
//   });
// });

apiRouter.get('/node/status/history', async (req, res) => {
  try {
    console.log('fetching node history')
    const { address: accountAddress } = req.query;

    const accInfoResponse = await fetchWithTimeout(
      `${ACCOUNT_INFO_URL}?address=${accountAddress}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    const data = await accInfoResponse.json();
    res.status(200).json(data?.accounts?.[0]?.account?.operatorAccountInfo?.operatorStats || {})
  } catch (e) {
    if (e instanceof Error) {
      return res.status(500).json({ errorMessage: e.message })
    }
    res.status(500).json({ errorMessage: e })
  }
})

apiRouter.get('/node/performance', (req, res) => {
  console.log('fetching node state')
  res.send([
    {
      cpu: 42,
      ram: 23,
      disk: 93499234,
      network: 14,
      tpsThroughput: 14,
      transactionCount: 24242,
      stateStorage: 1412344,
      date: '2022-12-22T11:23:55.848Z',
    },
  ])
})

apiRouter.post('/log/stake', doubleCsrfProtection, (req, res) => {
  console.log('Writing Stake TX logs')
  fs.appendFile(path.join(__dirname, '../stakeTXs.log'), JSON.stringify(req.body, undefined, 3), err => {
    if (err) {
      console.log(err)
      res.status(500).json({
        errorMessage: err,
      })
      return
    }
  })
  res.status(200).json({ status: 'ok' })
})

apiRouter.post('/log/unstake', doubleCsrfProtection, (req, res) => {
  console.log('Writing Unstake TX logs')
  fs.appendFile(path.join(__dirname, '../unstakeTXs.log'), JSON.stringify(req.body, undefined, 3), err => {
    if (err) {
      console.log(err)
      res.status(500).json({
        errorMessage: err,
      })
      return
    }
  })
  res.status(200).json({ status: 'ok' })
})

apiRouter.get('/auth/check', checkAuthHandler);

// apiRouter.post(
//   '/claim-tokens',
//   asyncRouteHandler(async (req: Request, res: Response) => {
//     const { address: accountAddress } = req.query;
//     const claimResponse = await fetchWithTimeout(
//       `${FAUCET_CLAIM_URL}?address=${accountAddress}`,
//       {
//         method: "POST",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     const data = await claimResponse.json();
//     res.status(200).json(data)
//   }));

export default apiRouter
