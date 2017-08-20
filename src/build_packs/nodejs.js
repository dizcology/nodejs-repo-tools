/**
 * Copyright 2017, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');

const { BuildPack } = require('./build_pack');

const SETUP = `
1.  Read [Prerequisites][prereq] and [How to run a sample][run] first.
1.  Install dependencies:

    With **npm**:

        npm install

    With **yarn**:

        yarn install

[prereq]: ../README.md#prerequisites
[run]: ../README.md#how-to-run-a-sample`;

const TESTS = `
1.  Set the **GCLOUD_PROJECT** and **GOOGLE_APPLICATION_CREDENTIALS** environment variables.

1.  Run the tests:

    With **npm**:

        npm test

    With **yarn**:

        yarn test`;

const nodejsConfig = {
  display: 'Node.js',
  lint: {
    cmd: 'semistandard',
    args: []
  },
  test: {
    app: {
      cmd: 'node',
      args: ['app.js']
    },
    build: {},
    deploy: {},
    install: {
      cmd: 'yarn',
      args: ['install', '--mutex', 'file:/tmp/.yarn-mutex']
    },
    run: {
      cmd: 'yarn',
      args: ['test']
    }
  },
  generate: {
    lib_readme: {
      lib_install_cmd: 'npm install --save {{name}}',
      quickstart_filename: 'samples/quickstart.js',
      getLibPkgName (buildPack) {
        return require(path.join(buildPack._cwd, 'package.json')).name;
      }
    },
    samples_readme: {
      setup: SETUP,
      tests: TESTS
    }
  }
};

/**
 * @class NodejsBuildPack
 * @returns {NodejsBuildPack} A new {@link NodejsBuildPack} instance.
 */
module.exports = class NodejsBuildPack extends BuildPack {
  constructor (config = {}, innerOpts = {}) {
    super(_.merge(nodejsConfig, _.cloneDeep(config)), innerOpts);
  }

  static detect (cwd) {
    return fs.statSync(path.join(cwd, 'package.json')).isFile();
  }

  getLibInstallCmd (opts) {
    return `npm install --save ${opts.libPkgName}`;
  }
};
