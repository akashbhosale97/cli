import merge from 'merge';
import * as path from 'path';
import { omit, filter, includes, isArray } from 'lodash';
import { configHandler } from '@contentstack/cli-utilities';
import defaultConfig from '../config';
import { readFile } from './file-helper';
import { askContentDir, askAPIKey } from './interactive';

const setupConfig = async (importCmdFlags): Promise<any> => {
  let config = merge({}, defaultConfig);
  // setup the config
  if (importCmdFlags['external-config-path']) {
    let externalConfig = await readFile(importCmdFlags['external-config-path']);
    if (isArray(externalConfig['modules'])) {
      config.modules.types = filter(config.modules.types, (module) => includes(externalConfig['modules'], module));
      externalConfig = omit(externalConfig, ['modules']);
    }
    config = merge.recursive(config, externalConfig);
  }
  config.contentDir = importCmdFlags['data'] || importCmdFlags['data-dir'] || (await askContentDir());
  config.contentDir = path.resolve(config.contentDir);
  //Note to support the old key
  config.data = config.contentDir;

  if (importCmdFlags['mtoken-alias']) {
    const { token, apiKey } = configHandler.get(importCmdFlags['mtoken-alias']);
    config.management_token = token;
    config.apiKey = apiKey;
    if (!config.management_token) {
      throw new Error(`No management token found on given alias ${importCmdFlags['mtoken-alias']}`);
    }
  }

  if (!config.management_token) {
    if (!configHandler.get('authtoken')) {
      throw new Error('Please login or provide an alias for the management token');
    } else {
      config.apiKey = importCmdFlags['stack-uid'] || importCmdFlags['stack-api-key'] || (await askAPIKey());
      if (typeof config.apiKey !== 'string') {
        throw new Error('Invalid API key received');
      }
      // Note support the old module
      config.auth_token = configHandler.get('authtoken');
    }
  }

  config.importWebhookStatus = importCmdFlags.importWebhookStatus;

  if (importCmdFlags['branch']) {
    config.branchName = importCmdFlags['branch'];
    config.branchDir = path.join(config.contentDir, config.branchName);
  }
  if (importCmdFlags['module']) {
    config.moduleName = importCmdFlags['module'];
    config.singleModuleImport = true;
  }

  if (importCmdFlags['backup-dir']) {
    config.useBackedupDir = importCmdFlags['backup-dir'];
  }

  // Note to support old modules
  config.target_stack = config.apiKey;

  return config;
};

export default setupConfig;
