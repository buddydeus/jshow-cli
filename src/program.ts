import { Command } from 'commander';

import { BaseCommand } from './command';
import { CLI_VERSION } from './constants';

type CommandClass = new (command: Command) => BaseCommand;

interface CommandType {
  name: string;
  command: CommandClass;
  instance?: BaseCommand;
}

const programShape = {
  commands: new Map<string, CommandType>(),
  program: new Command()
};

const setupCommand = (program: Command, item: CommandType): void => {
  const command = program.command(item.name);
  const instance = new item.command(command);

  item.instance = instance;
};

export class CommandProgram {
  static get version(): string {
    return CLI_VERSION;
  }

  static get program(): Command {
    return programShape.program;
  }

  static use(command: CommandClass, force?: boolean): CommandProgram {
    const commands = programShape.commands;
    const name = command.name;

    if (commands.has(name) && !force) {
      throw new Error(`Command '${name}' already exists.`);
    }

    commands.set(name, { name, command });

    return this;
  }

  static run(): void {
    const program = programShape.program;

    programShape.commands.forEach(item => {
      if (item.instance != null) return;
      setupCommand(program, item);
    });

    program.parse(process.argv);
  }
}
