/*!
 * Contentstack Export
 * Copyright (c) 2019 Contentstack LLC
 * MIT Licensed
 */

const mkdirp = require('mkdirp');
const path = require('path');
const chalk = require('chalk');
const { merge } = require('lodash');

const helper = require('../util/helper');
const { addlogs } = require('../util/log');
const { formatError } = require('../util');
let config = require('../../config/default');

module.exports = class ExportExtensions {
  master = {};
  extensions = {};
  extensionConfig = config.modules.extensions;
  queryRequestOptions = {
    asc: 'updated_at',
    include_count: true,
  };

  constructor(exportConfig, stackAPIClient) {
    this.config = merge(config, exportConfig);
    this.stackAPIClient = stackAPIClient;
  }

  start() {
    addlogs(this.config, 'Starting extension export', 'success');

    const self = this;
    const extensionsFolderPath = path.resolve(
      this.config.data,
      this.config.branchName || '',
      this.extensionConfig.dirName,
    );
    // Create folder for extensions
    mkdirp.sync(extensionsFolderPath);
    return new Promise(function (resolve, reject) {
      self.stackAPIClient
        .extension()
        .query(self.queryRequestOptions)
        .find()
        .then((extension) => {
          if (extension.items.length !== 0) {
            for (let i = 0, total = extension.count; i < total; i++) {
              const extUid = extension.items[i].uid;
              self.master[extUid] = '';
              self.extensions[extUid] = extension.items[i];
              delete self.extensions[extUid].uid;
              delete self.extensions[extUid].SYS_ACL;
            }
            helper.writeFileSync(path.join(extensionsFolderPath, self.extensionConfig.fileName), self.extensions);
            addlogs(self.config, chalk.green('All the extensions have been exported successfully'), 'success');
            return resolve();
          }
          addlogs(self.config, 'No extensions found', 'success');
          resolve();
        })
        .catch((error) => {
          addlogs(self.config, `Failed to export extensions ${formatError(error)}`, 'error');
          reject();
        });
    });
  }
};
