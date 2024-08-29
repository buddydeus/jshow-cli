import { Command } from 'commander';

/**
 * 命令参数类型。
 */
export interface CommandOption {
  /**
   * 参数全称。
   */
  flag: string;
  /**
   * 参数缩写。
   */
  abbreviation?: string;
  /**
   * 参数说明。
   */
  description?: string;
  /**
   * 参数默认值。
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultValue?: any;
  /**
   * 是否必填。
   */
  required?: boolean;
}

export interface CommandArgs {
  name: string;
  description?: string;
  options: CommandOption[];
}

export abstract class BaseCommand {
  static name: string = '';

  static force: boolean = false;

  constructor(protected readonly command: Command) {
    this.init(command);
  }

  public get name(): string {
    return Object.getPrototypeOf(this)?.constructor?.name ?? '';
  }

  protected init(program: Command): void {
    const { description } = this.args;

    if (description) command.description(description);

    // for ( of options) {
    // }
  }

  public abstract execute(): void;
}

export const isCommand = (value?: unknown): value is BaseCommand =>
  value != null && value instanceof BaseCommand;
