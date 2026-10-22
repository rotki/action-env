import * as fs from 'node:fs';
import { parseEnv } from 'node:util';
import * as core from '@actions/core';

export function checkIfFileExists(filePath: string): boolean {
  if (!fs.existsSync(filePath)) {
    core.setFailed('Invalid path');
    return false;
  }
  return true;
}

export function loadEnv(filePath: string): Record<string, string | undefined> | undefined {
  if (!fs.existsSync(filePath))
    return undefined;
  const parsed = parseEnv(fs.readFileSync(filePath, 'utf8'));
  return Object.keys(parsed).length > 0 ? parsed : undefined;
}
