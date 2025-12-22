import cp from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

export const statSync = (ph: string): fs.Stats | null => {
  try {
    if (!fs.existsSync(ph)) return null;
    return fs.statSync(ph);
  } catch {
    return null;
  }
};

export const mkdirSync = (ph: string, mode?: number): void => {
  if (fs.existsSync(ph)) return;
  fs.mkdirSync(ph, { recursive: true, mode });
};

export const rmSync = (ph: string) => {
  try {
    if (!fs.existsSync(ph)) return;
    fs.rmSync(ph, { recursive: true, force: true });
  } catch {
    // ignore
  }
};

export const chmodSync = (ph: string, mode: number | string): void => {
  if (!fs.existsSync(ph)) return;
  fs.chmodSync(ph, mode);
};

export const readJsonSync = <T>(ph: string): T => {
  const data = fs.readFileSync(ph);
  return JSON.parse(data.toString('utf-8')) as T;
};

export const writeJsonSync = <T>(ph: string, data: T): void => {
  fs.writeFileSync(ph, JSON.stringify(data, null, 2));
};

export const execSync = (
  command: string,
  options: Pick<cp.ExecSyncOptions, 'cwd' | 'env' | 'timeout' | 'encoding'> = {}
) => {
  const stdout = cp.execSync(command, {
    encoding: 'utf-8',
    ...options
  });

  return stdout.toString().trim();
};

interface PackageInfo {
  dir: string;
  name: string;
  manifest: Record<string, unknown>;
}

export const getWorkspacePackages = (
  root = process.cwd(),
  level = 0,
  max = 3,
  packages: PackageInfo[] = []
) => {
  if (!fs.existsSync(root)) return packages;

  const dirs = fs.readdirSync(root);
  if (dirs.length < 1) return packages;

  for (const item of dirs) {
    const dir = path.join(root, item);
    if (!statSync(dir)?.isDirectory()) continue;

    const fn = path.join(dir, 'package.json');
    if (!fs.existsSync(fn)) {
      if (level < max) getWorkspacePackages(dir, level + 1, max, packages);
      continue;
    }

    const manifest = readJsonSync<{ name: string }>(fn);
    if (!manifest.name) continue;

    packages.push({
      dir,
      name: manifest.name,
      manifest
    });
  }

  return packages;
};
