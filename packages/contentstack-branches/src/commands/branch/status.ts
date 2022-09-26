import {Command} from '@oclif/core'

export default class Status extends Command {
  static description = 'Check branch status'

  static examples = [
    `$ csdx branch status
  branch status packages/contentstack-branches/src/commands/branch/status.ts
`,
  ]

  static flags = {}
  static args = []

  async run(): Promise<void> {
    this.log('Branch status command.')
  }
}
