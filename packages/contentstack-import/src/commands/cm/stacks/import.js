const _ = require('lodash');
const defaultConfig = require('../../../config/default');
const { Command } = require('@contentstack/cli-command');
const { flags, printFlagDeprecation, isAuthenticated } = require('@contentstack/cli-utilities');
const {
  configWithMToken,
  parameterWithMToken,
  withoutParameterMToken,
  configWithAuthToken,
  parametersWithAuthToken,
  withoutParametersWithAuthToken,
} = require('../../../lib/util/import-flags');

class ImportCommand extends Command {
  async run() {
    let self = this;
    const { flags: importCommandFlags } = await self.parse(ImportCommand);
    const extConfig = importCommandFlags.config;
    let targetStack = importCommandFlags['stack-uid'] || importCommandFlags['stack-api-key'];
    const data = importCommandFlags.data || importCommandFlags['data-dir'];
    const moduleName = importCommandFlags.module;
    const backupdir = importCommandFlags['backup-dir'];
    const alias = importCommandFlags['alias'] || importCommandFlags['management-token-alias'];
    importCommandFlags.branchName = importCommandFlags.branch;
    importCommandFlags.importWebhookStatus = importCommandFlags['import-webhook-status'];
    delete importCommandFlags.branch;
    delete importCommandFlags['import-webhook-status'];
    let host = self.cmaHost;
    importCommandFlags['isAuthenticated'] = isAuthenticated();

    return new Promise((resolve, reject) => {
      if (data) {
        defaultConfig.data = data;
      }

      defaultConfig.forceStopMarketplaceAppsPrompt = importCommandFlags.yes;

      if (alias) {
        let managementTokens = self.getToken(alias);

        if (managementTokens) {
          let result;

          if ((extConfig && isAuthenticated()) || alias) {
            result = configWithMToken(extConfig, managementTokens, moduleName, host, backupdir, importCommandFlags);
          } else if (data) {
            result = parameterWithMToken(managementTokens, data, moduleName, host, backupdir, importCommandFlags);
          } else {
            result = withoutParameterMToken(managementTokens, moduleName, host, backupdir, importCommandFlags);
          }

          result.then(resolve).catch(reject);
        } else {
          console.log('management Token is not present please add managment token first');
        }
      } else if (isAuthenticated()) {
        let result;

        if (extConfig) {
          result = configWithAuthToken(extConfig, moduleName, host, backupdir, importCommandFlags);
        } else if (targetStack && data) {
          result = parametersWithAuthToken(targetStack, data, moduleName, host, backupdir, importCommandFlags);
        } else {
          result = withoutParametersWithAuthToken(moduleName, host, backupdir, importCommandFlags);
        }

        result.then(resolve).catch(reject);
      } else {
        console.log('Login or provide the alias for management token');
      }
    });
  }
}

ImportCommand.description = `Import script for importing the content into the new stack
...
Once you export content from the source stack, import it to your destination stack by using the cm:stacks:import command.
`;
ImportCommand.examples = [
  `csdx cm:stacks:import --stack-api-key <stack_api_key> --data-dir <path/of/export/destination/dir>`,
  `csdx cm:stacks:import --config <path/of/config/dir>`,
  `csdx cm:stacks:import --module <single module name>`,
  `csdx cm:stacks:import --module <single module name> --backup-dir <backup dir>`,
  `csdx cm:stacks:import --alias <management_token_alias>`,
  `csdx cm:stacks:import --alias <management_token_alias> --data-dir <path/of/export/destination/dir>`,
  `csdx cm:stacks:import --alias <management_token_alias> --config <path/of/config/file>`,
  `csdx cm:stacks:import --branch <branch name>  --yes`,
];
ImportCommand.flags = {
  config: flags.string({
    char: 'c',
    description: '[optional] path of config file',
  }),
  'stack-uid': flags.string({
    char: 's',
    description: 'API key of the target stack',
    hidden: true,
    parse: printFlagDeprecation(['-s', '--stack-uid'], ['-k', '--stack-api-key']),
  }),
  'stack-api-key': flags.string({
    char: 'k',
    description: 'API key of the target stack',
  }),
  data: flags.string({
    description: 'path and location where data is stored',
    hidden: true,
    parse: printFlagDeprecation(['--data'], ['--data-dir']),
  }),
  'data-dir': flags.string({
    char: 'd',
    description: 'path and location where data is stored',
  }),
  alias: flags.string({
    char: 'a',
    description: 'alias of the management token',
  }),
  'management-token-alias': flags.string({
    description: 'alias of the management token',
    hidden: true,
    parse: printFlagDeprecation(['--management-token-alias'], ['-a', '--alias']),
  }),
  'auth-token': flags.boolean({
    char: 'A',
    description: 'to use auth token',
    hidden: true,
    parse: printFlagDeprecation(['-A', '--auth-token']),
  }),
  module: flags.string({
    char: 'm',
    description: '[optional] specific module name',
    parse: printFlagDeprecation(['-m'], ['--module']),
  }),
  'backup-dir': flags.string({
    char: 'b',
    description: '[optional] backup directory name when using specific module',
    parse: printFlagDeprecation(['-b'], ['--backup-dir']),
  }),
  branch: flags.string({
    char: 'B',
    description: '[optional] branch name',
    parse: printFlagDeprecation(['-B'], ['--branch']),
  }),
  'import-webhook-status': flags.string({
    description: '[optional] Webhook state',
    options: ['disable', 'current'],
    required: false,
    default: 'disable',
  }),
  yes: flags.boolean({
    char: 'y',
    required: false,
    description: '[optional] Override marketplace prompts',
  }),
};

ImportCommand.aliases = ['cm:import'];

ImportCommand.usage =
  'cm:stacks:import [-c <value>] [-k <value>] [-d <value>] [-a <value>] [--module <value>] [--backup-dir <value>] [--branch <value>] [--import-webhook-status disable|current]';

module.exports = ImportCommand;
