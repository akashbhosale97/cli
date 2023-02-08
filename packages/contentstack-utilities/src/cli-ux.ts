import chalk from 'chalk';
import { Options, SingleBar } from 'cli-progress';
import { Command, Flags, Args, ux } from '@oclif/core';
import { default as inquirer, QuestionCollection } from 'inquirer';

import messageHandler from './message-handler';
import { PrintOptions, InquirePayload, CliUXPromptOptions } from './interfaces';

/**
 * CLI Interface
 */
class CLIInterface {
  private loading: boolean;

  constructor() {
    this.loading = false;
  }

  get uxTable(): typeof ux.Table.table {
    return ux.table;
  }

  init(context) {}

  print(message: string, opts?: PrintOptions): void {
    if (opts && opts.color) {
      ux.log(chalk[opts.color](messageHandler.parse(message)));
      return;
    }

    ux.log(messageHandler.parse(message));
  }

  success(message: string): void {
    ux.log(chalk.green(messageHandler.parse(message)));
  }

  error(message: string, ...params: any): void {
    ux.log(chalk.red(messageHandler.parse(message) + (params && params.length > 0 ? ': ' : '')), ...params);
  }

  loader(message: string = ''): void {
    if (!this.loading) {
      ux.action.start(messageHandler.parse(message));
    } else {
      ux.action.stop(messageHandler.parse(message));
    }
    this.loading = !this.loading;
  }

  table(
    data: Record<string, unknown>[],
    columns: ux.Table.table.Columns<Record<string, unknown>>,
    options?: ux.Table.table.Options,
  ): void {
    ux.table(data, columns, options);
  }

  async inquire<T>(inquirePayload: InquirePayload): Promise<T> {
    inquirePayload.message = messageHandler.parse(inquirePayload.message);
    const result = await inquirer.prompt(inquirePayload as QuestionCollection<T>);

    return result[inquirePayload.name] as T;
  }

  prompt(name: string, options?: CliUXPromptOptions): Promise<string> {
    return ux.prompt(name, options);
  }

  confirm(message?: string): Promise<boolean> {
    return ux.confirm(message);
  }

  progress(options?: Options): SingleBar {
    return ux.progress(options);
  }
}

export default new CLIInterface();
export { Command, Flags, Args, ux };
