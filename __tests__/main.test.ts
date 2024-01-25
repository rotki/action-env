import * as process from 'process';
import * as cp from 'child_process';
import * as path from 'path';
import { expect, test } from 'vitest';
import { loadEnv } from '../src/file';

test('loads from env file if the file exists', async () => {
  expect(loadEnv('.github/.env')).toMatchObject({ EXAMPLE: 'example' });
});

test('returns undefined if the env file does not exist', async () => {
  expect(loadEnv('.unknown_env')).toBeUndefined();
});

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  process.env['INPUT_ENV_FILE'] = '.github/.env';
  const np = process.execPath;
  const ip = path.join(__dirname, '..', 'lib', 'main.js');
  const options: cp.ExecFileSyncOptions = {
    env: process.env,
  };
  console.log(cp.execFileSync(np, [ip], options).toString());
});
