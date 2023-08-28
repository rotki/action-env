import * as fs from 'node:fs';
import * as core from '@actions/core';
import { config } from 'dotenv';

export const checkIfFileExists = (filePath: string): boolean => {
  if (!fs.existsSync(filePath)) {
    core.setFailed('Invalid path');
    return false;
  }
  return true;
};

export const loadEnv = (
  filePath: string,
): Record<string, string> | undefined => {
  const output = config({ path: filePath });
  return output.parsed;
};
