import {Command} from '@oclif/core'

export default class Compare extends Command {
  static description = 'Compare two different branches'

  static examples = [
    `$ csdx branch compare
  branch compare packages/contentstack-branches/src/commands/branch/compare.ts
`,
  ]

  static flags = {}
  static args = []

  async run(): Promise<void> {
    this.log('Branch compare command.')
  }
}
