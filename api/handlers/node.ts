import { execFile, execFileSync } from 'child_process';
import { Request, Response, Router } from 'express';
import {
  NodeClearLogsResponse,
  NodeLogsResponse,
  NodeNetworkResponse,
  NodeSettings,
  NodeStatus,
  NodeStatusHistoryResponse,
  NodeStatusResponse,
  NodeVersionResponse
} from '../types/node-types';
import { badRequestResponse, cliStderrResponse, notFoundResponse } from './util';
import path from 'path';
import { existsSync } from 'fs';
import asyncRouteHandler from './async-router-handler';
import fs from 'fs';
import { doubleCsrfProtection } from '../csrf';

const yaml = require('js-yaml')

export const nodeVersionHandler = asyncRouteHandler(async (req: Request, res: Response<NodeVersionResponse>) => {
  // Exec the CLI dashboard version command
  console.log('executing operator-cli version...');
  const output = execFileSync('/usr/local/bin/operator-cli', ['version'], { encoding: 'utf8' })
  const yamlData: NodeVersionResponse = yaml.load(output);
  res.json(yamlData);
})

export default function configureNodeHandlers(apiRouter: Router) {
  let lastActiveNodeState: NodeStatus;
  apiRouter.post('/node/start', doubleCsrfProtection, asyncRouteHandler(async (req: Request, res: Response) => {
    // Exec the CLI validator start command
    console.log('executing operator-cli start...');
    execFileSync('/usr/local/bin/operator-cli', ['start']);
    res.status(200).json({ status: "ok" })
  }));

  apiRouter.post('/node/stop', doubleCsrfProtection, asyncRouteHandler(async (req: Request, res: Response) => {
    // Exec the CLI validator stop command
    console.log('executing operator-cli stop...');
    execFileSync('/usr/local/bin/operator-cli', ['stop', '-f'])
    res.status(200).json({ status: "ok" })
  }));

  apiRouter.get(
    '/node/status',
    asyncRouteHandler(async (req: Request, res: Response<NodeStatusResponse>) => {
      // Exec the CLI validator stop command
      execFile('/usr/local/bin/operator-cli', ['status'], (err, stdout, stderr) => {
        console.log('operator-cli status: ', err, stdout, stderr);
        if (err) {
          cliStderrResponse(res, 'Unable to fetch status', err.message)
          return
        }
        if (stderr) {
          cliStderrResponse(res, 'Unable to fetch status', stderr)
          return
        }
        let yamlData: NodeStatus = yaml.load(stdout);
        if (yamlData.state === 'active') {
          lastActiveNodeState = yamlData;
        } else if (yamlData.state === 'stopped') {
          yamlData = {
            ...yamlData,
            nodeInfo: lastActiveNodeState?.nodeInfo
          }
        }
        res.json(yamlData);
      });
      console.log('executing operator-cli status...');
    }
    ));

  apiRouter.get('/node/logs', asyncRouteHandler(async (req: Request, res: Response<NodeLogsResponse>) => {
    let logsPath = path.join(__dirname, '../../../cli/build/logs');
    if (!existsSync(logsPath)) {
      res.json([])
      return;
    }
    execFile('/bin/ls', ['-m'], { cwd: logsPath }, (err, stdout, stderr) => {
      if (err) {
        throw new Error('Unable to get logs', err)
      }
      if (stderr) {
        throw new Error('Unable to get logs' + stderr)
      }
      const availableLogs = stdout.split(',').map((s: string) => s.trim());
      res.json(availableLogs);
    });
  }));

  apiRouter.delete('/node/logs', doubleCsrfProtection, asyncRouteHandler(async (req: Request, res: Response<NodeClearLogsResponse>) => {
    let logsPath = path.join(__dirname, '../../../validator-cli/build/logs');
    if (!existsSync(logsPath)) {
      res.json({ logsCleared: [] });
      return;
    }
    execFile('/bin/ls', ['-m'], { cwd: logsPath }, (err, stdout, stderr) => {
      if (err) {
        throw new Error('Unable to get logs', err)
      }
      if (stderr) {
        throw new Error('Unable to get logs' + stderr)
      }
      const availableLogs = stdout.split(',').map((s: string) => s.trim());
      for (let availableLog of availableLogs) {
        const logPath = path.join(__dirname, `../../../cli/build/logs/${availableLog}`);
        fs.writeFileSync(logPath, "", 'utf-8');
      }
      res.json({ logsCleared: availableLogs });
    });
  }));

  apiRouter.get('/node/logs/:file', asyncRouteHandler(async (req: Request, res: Response) => {
    const fileParam = req.params.file;
    const sanitizedFile = fileParam.replace(/[^a-zA-Z0-9.-]/g, '');
    const file = path.join(__dirname, '../../../cli/build/logs', sanitizedFile);
    res.download(file);
  }));

  apiRouter.get(
    '/account/:address/stakeInfo',
    asyncRouteHandler(async (req: Request, res: Response<NodeStatusResponse>) => {
      const address = req.params.address;
      if (!address) {
        badRequestResponse(res, 'No address provided');
        return;
      }
      console.log('executing operator-cli status...');
      const output = execFileSync('/usr/local/bin/operator-cli', ['stake_info', address], { encoding: 'utf8' })
      try {
        const yamlData = yaml.load(output);
        res.json(yamlData);
      } catch (e) {
        notFoundResponse(res, 'Unable to fetch status');
      }
    })
  );

  apiRouter.post(
    '/node/update', doubleCsrfProtection,
    asyncRouteHandler(async (req: Request, res: Response) => {
      const outUpdate = execFileSync('/usr/local/bin/operator-cli', ['update']);
      console.log('operator-cli update: ', outUpdate);
      const outGuiRestart = execFileSync('/usr/local/bin/operator-cli', ['gui', 'restart']);
      console.log('operator-cli gui restart: ', outGuiRestart);
      res.end();
    })
  );

  apiRouter.get('/node/version', nodeVersionHandler);

  apiRouter.get(
    '/node/network',
    asyncRouteHandler(async (req: Request, res: Response<NodeNetworkResponse>) => {
      // Exec the CLI validator stop command
      console.log('executing operator-cli network-stats');
      const output = execFileSync('/usr/local/bin/operator-cli', ['network-stats'], { encoding: 'utf8' })
      const yamlData = yaml.load(output);
      res.json(yamlData);
    }));

  apiRouter.post(
    '/password', doubleCsrfProtection,
    asyncRouteHandler(async (req: Request<{
      currentPassword: string;
      newPassword: string;
    }>, res: Response) => {
      const password = req.body && req.body.currentPassword
      if (!password || typeof password !== 'string') {
        badRequestResponse(res, 'Invalid password');
        return;
      }
      const stdout = execFileSync('/usr/local/bin/operator-cli', ['gui', 'login', password], { encoding: 'utf8' });
      const cliResponse = yaml.load(stdout);

      if (cliResponse.login !== 'authorized') {
        badRequestResponse(res, 'Current password does not match');
        return;
      }

      execFileSync('/usr/local/bin/operator-cli', ['gui', 'set', 'password', '-h', req.body.newPassword]);
      res.status(200).json({ status: "ok" })
    }));


  apiRouter.get('/settings', asyncRouteHandler(async (req: Request, res: Response<NodeSettings>) => {
    const settings = getSettings()
    res.json(settings);
  }));

  const getSettings = () => {
    const output = execFileSync('/usr/local/bin/operator-cli', ['node-settings'], { encoding: 'utf8' });
    return yaml.load(output);
  }


  apiRouter.post('/settings', doubleCsrfProtection, asyncRouteHandler(async (req: Request, res: Response) => {
    if (!req.body) {
      badRequestResponse(res, 'Invalid body');
      return;
    }

    const autoRestart: string = req.body.autoRestart.toString().toLowerCase()

    if (autoRestart != "true" && autoRestart != "false") {
      badRequestResponse(res, 'Invalid body');
      return;
    }

    const currentSettings = getSettings()
    if (autoRestart != currentSettings.autoRestart) {
      execFileSync('/usr/local/bin/operator-cli', ['set', 'auto_restart', autoRestart]);
    }
    res.json(getSettings());
  }));

}
