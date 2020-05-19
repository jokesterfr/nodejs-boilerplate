const pkg = require('../package.json');

module.exports = {
  version: `${pkg.version}-testing`,
  port: '3030',
  hostname: 'testing-host',
};
