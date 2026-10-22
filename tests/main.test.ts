import * as cp from 'node:child_process';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import * as process from 'node:process';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { loadEnv } from '../src/file';
import { run } from '../src/main';

const mocks = vi.hoisted(() => {
  const inputs: Record<string, string> = {};
  return {
    exportVariable: vi.fn(),
    inputs,
    setFailed: vi.fn(),
  };
});

vi.mock('@actions/core', () => ({
  exportVariable: mocks.exportVariable,
  getInput: (name: string): string => mocks.inputs[name] ?? '',
  info: vi.fn(),
  setFailed: mocks.setFailed,
}));

describe('loadEnv', () => {
  it('loads from env file if the file exists', () => {
    expect(loadEnv('.github/.env')).toMatchObject({ EXAMPLE: 'example' });
  });

  it('returns undefined if the env file does not exist', () => {
    expect(loadEnv('.unknown_env')).toBeUndefined();
  });
});

describe('run', () => {
  let tmpDir: string;

  beforeEach(() => {
    vi.clearAllMocks();
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'action-env-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { force: true, recursive: true });
  });

  it('exports every variable in the file', () => {
    const envFile = path.join(tmpDir, '.env');
    fs.writeFileSync(envFile, 'FIRST=one\nSECOND=two\n');
    mocks.inputs.env_file = envFile;

    run();

    expect(mocks.exportVariable).toHaveBeenCalledWith('FIRST', 'one');
    expect(mocks.exportVariable).toHaveBeenCalledWith('SECOND', 'two');
    expect(mocks.setFailed).not.toHaveBeenCalled();
  });

  it('fails when the file does not exist', () => {
    mocks.inputs.env_file = path.join(tmpDir, 'missing.env');

    run();

    expect(mocks.setFailed).toHaveBeenCalledWith('Invalid path');
    expect(mocks.exportVariable).not.toHaveBeenCalled();
  });

  it('fails when the file has no variables', () => {
    const envFile = path.join(tmpDir, '.env');
    fs.writeFileSync(envFile, '# only a comment\n');
    mocks.inputs.env_file = envFile;

    run();

    expect(mocks.setFailed).toHaveBeenCalledWith('Nothing loaded from the envFile');
    expect(mocks.exportVariable).not.toHaveBeenCalled();
  });
});

describe('dist', () => {
  // runs the bundled action the way the runner does, through env vars and the GITHUB_ENV file
  it('writes the variables to GITHUB_ENV', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'action-env-'));
    const githubEnv = path.join(tmpDir, 'github_env');
    fs.writeFileSync(githubEnv, '');

    try {
      cp.execFileSync(process.execPath, [path.join(import.meta.dirname, '..', 'dist', 'index.js')], {
        env: { ...process.env, GITHUB_ENV: githubEnv, INPUT_ENV_FILE: '.github/.env' },
      });
      expect(fs.readFileSync(githubEnv, 'utf8')).toContain('EXAMPLE');
      expect(fs.readFileSync(githubEnv, 'utf8')).toContain('example');
    }
    finally {
      fs.rmSync(tmpDir, { force: true, recursive: true });
    }
  });
});
