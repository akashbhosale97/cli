import _ from 'lodash';
import chalk from 'chalk';
import {Command, Flags, CliUx} from '@oclif/core'
import ExportCommand from '@contentstack/cli-cm-export';
const config = require('@contentstack/cli-cm-export/src/config/default');

export default class Status extends Command {
  static description = 'Check branch status'

  static examples = [
    `$ csdx branch status
  branch status packages/contentstack-branches/src/commands/branch/status.ts
`,
  ]

  static flags = {
    apiKey: Flags.string({
      char: 'k',
      required: true,
      description: 'API key of the source stack',
    })
  }

  static args = [
    {
      name: 'branch',
    }
  ];

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Status);
    // this.log('Branch status command.')

    await this.export(args, flags)
      .then(() => {
        this.showStatus(config.branchStatus)
      })
  }

  showStatus(stackData) {
    const { entries, contentTypes } = stackData

    if (!_.isEmpty(entries) || !_.isEmpty(contentTypes)) {
      for (let index = 0; index < 2; index++) {
        CliUx.ux.info('\n')
      }
    }

    _.forEach(
      [{ data: contentTypes, module: 'Content type' }, { data: entries, module: 'Entry' }],
      this.displayStatus
    )

    if (!_.isEmpty(entries) || !_.isEmpty(contentTypes)) {
      for (let index = 0; index < 2; index++) {
        CliUx.ux.info('\n')
      }
    }
  }

  displayStatus(content) {
    if (!_.isEmpty(content.data)) {
      CliUx.ux.info(chalk.whiteBright(`${content.module}\n`))

      const newData = _.filter(_.entries(content.data), ([_uid, data]: any) => data.change_type === 'new').map(([_uid, data]) => data)
      const modifiedData = _.filter(_.entries(content.data), ([_uid, data]: any) => data.change_type === 'modified').map(([_uid, data]) => data)

      if (!_.isEmpty(newData)) {
        _.forEach(newData, (newFiles) => {
          CliUx.ux.info(chalk.green(`\tnew: \t ${content.module}: "${newFiles.title}" from has been added\n`))
        })
      }

      if (!_.isEmpty(modifiedData)) {
        _.forEach(modifiedData, (newFiles) => {
          CliUx.ux.info(chalk.rgb(255, 165, 0)(`\tmodified: \ ${content.module} "${newFiles.title}" is modified\n`))
        })
      }
    }
  }

  async export(args, flags) {
    const cmd = ['-k', flags.apiKey, '-d', __dirname.split('src')[0] + 'contents'];

    cmd.push('--branch', args.branch);

    return ExportCommand.run(cmd);
  }
}
