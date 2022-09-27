import { Command, Flags } from '@oclif/core';
// let migrateCmd = require('@contentstack/cli-migration');
import migrateCmd from '@contentstack/cli-migration/src/commands/cm/stacks/migration.js';

export default class Merge extends Command {
  static description = 'Merge tow different branches';

  static examples = [`$ csdx branch:merge targetBranchName -a ManagementTokenAlias -s SourceBranchName`];

  static flags = {
    sourceBranch: Flags.string({
      char: 's',
      required: true,
      description: 'Target branch name',
    }),
    alias: Flags.string({
      char: 'a',
      required: true,
      description: 'Alias of management token',
    }),
  };
  static args = [
    {
      name: 'branch',
    },
  ];

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Merge);
    // this.log('Branch status command.')

    await this.cmdMigrate(args, flags)
      .then(() => {
        console.log('Success');
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async cmdMigrate(args, flags) {
    return new Promise((resolve, reject) => {
      const cmd = [
        '-a',
        flags.alias,
        '--file-path',
        '/Users/netraj.patel/netraj/projects/contentstack/cli/main/packages/contentstack-migration/examples/branch',
        '--branch',
        args.branch,
        '--config',
        `sourceBranch:${flags.sourceBranch}`,
        '--multiple',
      ];

      let exportData = migrateCmd.run(cmd);
      exportData
        .then(() => {
          resolve(true);
        })
        .catch(reject);
    });
  }
}
