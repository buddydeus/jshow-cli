#!/usr/bin/env ts-node-esm
import fs from 'node:fs';
import path from 'node:path';

import { isCommand } from './command';
import { CommandProgram } from './program';

const getName = (fn: string) =>
  path.basename(fn, path.extname(fn)).replace('.cmd', '');

const loadCommands = async (root: string) => {
  const list = fs.readdirSync(root);

  for (const item of list) {
    const fn = path.join(root, item);
    const stat = fs.statSync(fn);

    if (stat.isDirectory()) {
      await loadCommands(fn);
      continue;
    }

    if (fn.endsWith('.cmd.ts') || fn.endsWith('.cmd.js')) {
      const file = await import(fn);
      const module = file.default;

      if (!isCommand(module?.prototype)) continue;

      if (!module.name) module.name = getName(fn);
      CommandProgram.use(module, module.force);
    }
  }
};

const runjShow = async () => {
  await loadCommands(process.cwd());
  CommandProgram.run();
};

runjShow();
