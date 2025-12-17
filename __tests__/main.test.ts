import * as cp from 'node:child_process';
import * as path from 'node:path';
import * as process from 'node:process';
import { expect, it } from 'vitest';
import { loadEnv } from '../src/file';

it('loads from env file if the file exists', () => {
  expect(loadEnv('.github/.env')).toMatchObject({ EXAMPLE: 'example' });
});

it('returns undefined if the env file does not exist', () => {
  expect(loadEnv('.unknown_env')).toBeUndefined();
});

// shows how the runner will run a javascript action with env / stdout protocol
it('test runs', () => {
  process.env.INPUT_ENV_FILE = '.github/.env';
  const np = process.execPath;
  const ip = path.join(__dirname, '..', 'lib', 'main.js');
  const options: cp.ExecFileSyncOptions = {
    env: process.env,
  };
  // eslint-disable-next-line no-console
  console.log(cp.execFileSync(np, [ip], options).toString());
});
