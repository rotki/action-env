import * as fs from 'node:fs';
import * as core from '@actions/core';
import { config } from 'dotenv';

export function checkIfFileExists(filePath: string): boolean {
  if (!fs.existsSync(filePath)) {
    core.setFailed('Invalid path');
    return false;
  }
  return true;
}

export function loadEnv(filePath: string): Record<string, string> | undefined {
  const output = config({ path: filePath });
  return output.parsed && Object.keys(output.parsed).length > 0 ? output.parsed : undefined;
}
