import ExportCommand from '@contentstack/cli-cm-export';
import { Command, Flags, CliUx } from '@oclif/core';
import path = require('path');
const config = require('@contentstack/cli-cm-export/src/config/default');
export default class Compare extends Command {
  static description = 'Compare two different branches';
  static examples = [
    `$ csdx branch compare
  branch compare packages/contentstack-branches/src/commands/branch/compare.ts
`,
  ];
  static flags = {
    apiKey: Flags.string({
      char: 'k',
      required: true,
      description: 'API key of the source stack',
    }),
  };
  static args = [
    {
      name: 'branch',
    },
  ];
  async run(): Promise<void> {
    const { args, flags } = await this.parse(Compare);
    // this.log('Branch status command.')
    await this.export(args, flags).then(() => {
      this.generateCompareReports(config);
    });
  }
  async export(args, flags) {
    const path1 = path.resolve(__dirname.split('src')[0] + 'merge-contents');
    const cmd = ['-k', flags.apiKey, '-d', path1];
    config.enableBranchStatus = true;
    cmd.push('--branch', args.branch);
    await ExportCommand.run(cmd);
    const path2 = path.resolve(__dirname.split('src')[0] + 'merge-contents2');
    const cmd2 = ['-k', flags.apiKey, '-d', path1];
    config.enableBranchStatus = true;
    cmd.push('--branch', args.branch);
    await ExportCommand.run(cmd);
  }
  async generateCompareReports(config) {}
}
