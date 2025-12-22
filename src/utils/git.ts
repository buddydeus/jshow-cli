import os from 'node:os';

import { execSync } from './node';

export const getCurrentBranch = () => {
  const stdout = execSync('git rev-parse --abbrev-ref HEAD');
  return (
    stdout
      .split(os.EOL)
      .filter(v => !!v)[0]
      .trim() || ''
  );
};

export const getUnCommittedFiles = () => {
  const stdout = execSync('git diff --name-only HEAD');
  return stdout.split(os.EOL).filter(v => !!v);
};

export const getLastestCommitMessage = (detail = true) => {
  return execSync(`git log -n1 --format=${detail ? '%B' : '%s'}`);
};
