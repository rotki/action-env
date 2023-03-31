import * as core from '@actions/core';
import { checkIfFileExists, loadEnv } from './file';

async function run(): Promise<void> {
  try {
    const envFile: string = core.getInput('env_file');
    core.info(`Using ${envFile} to load variables`);

    if (!checkIfFileExists(envFile)) {
      return;
    }

    const env = loadEnv(envFile);
    if (!env) {
      core.setFailed('Nothing loaded from the envFile');
      return;
    }

    for (const [envVar, varValue] of Object.entries(env)) {
      core.exportVariable(envVar, varValue);
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

run();
