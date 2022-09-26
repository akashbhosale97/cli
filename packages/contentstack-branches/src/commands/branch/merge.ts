import {Command} from '@oclif/core'

export default class Merge extends Command {
  static description = 'Merge tow different branches'

  static examples = [
    `$ csdx branch merge
  branch merge packages/contentstack-branches/src/commands/branch/merge.ts
`,
  ]

  static flags = {}
  static args = []

  async run(): Promise<void> {
    this.log('Branch merge command.')
  }
}
