import { Options, SingleBar } from 'cli-progress';
import { Command, Flags, Args, ux } from '@oclif/core';
import { PrintOptions, InquirePayload, CliUXPromptOptions } from './interfaces';
/**
 * CLI Interface
 */
declare class CLIInterface {
    private loading;
    constructor();
    get uxTable(): typeof ux.Table.table;
    init(context: any): void;
    print(message: string, opts?: PrintOptions): void;
    success(message: string): void;
    error(message: string, ...params: any): void;
    loader(message?: string): void;
    table(data: Record<string, unknown>[], columns: ux.Table.table.Columns<Record<string, unknown>>, options?: ux.Table.table.Options): void;
    inquire<T>(inquirePayload: InquirePayload): Promise<T>;
    prompt(name: string, options?: CliUXPromptOptions): Promise<string>;
    confirm(message?: string): Promise<boolean>;
    progress(options?: Options): SingleBar;
}
declare const _default: CLIInterface;
export default _default;
export { Command, Flags, Args, ux };
