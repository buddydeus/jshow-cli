import inquirer from 'inquirer';

import { BaseCommand, type CommandContext } from '../../command';
import { getUnCommittedFiles, getWorkspacePackages } from '../../utils';

const checkGitStatus = async (): Promise<boolean> => {
  const changedFiles = await getUnCommittedFiles();
  if (changedFiles.length > 0) {
    logger.error("Repository isn't clean, commit or stash those changes first");
    return false;
  }

  return true;
};

const getReleasePackages = async () => {
  const packages = getWorkspacePackages().filter(v => !v.manifest.private);

  const { selecteds } = await inquirer.prompt<{ selecteds: string[] }>({
    type: 'checkbox',
    name: 'selecteds',
    message: 'Select the packages to release',
    choices: packages.map(v => v.name)
  });

  return packages.filter(v => selecteds.includes(v.name));
};

const getNewVersions = async (
  packages: ReturnType<typeof getWorkspacePackages>
) => {
  const versions: Record<string, string> = {};

  return versions;
};

const releasePackages = async (
  versions: Record<string, string>,
  force: boolean
) => {};

export class ReleaseCommand extends BaseCommand {
  static name = 'release';

  public get args() {
    return {
      name: 'release',
      description: 'Release chore to the remote repository',
      group: 'devOps',
      options: [
        {
          flag: 'check',
          abbr: 'c',
          description: 'Check the release',
          defaultValue: false
        },
        {
          flag: 'force',
          abbr: 'f',
          description: 'Force the release',
          defaultValue: false
        }
      ]
    };
  }

  public async execute(context: CommandContext): Promise<void> {
    const options = this.command.opts();

    if (options.check) {
      const status = await checkGitStatus();
      if (!status) return;
    }

    const packages = await getReleasePackages();
    if (packages.length === 0) {
      logger.error('No packages to release');
      return;
    }

    logger.info('Will bump:');
    logger.info(packages.map(v => `    ${v.name}`).join('\n'));
    logger.info();

    const versions = await getNewVersions(packages);

    await releasePackages(versions, !!options.force);
  }
}
