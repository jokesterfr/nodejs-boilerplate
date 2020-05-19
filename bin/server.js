#!/usr/bin/env node
const os = require('os');
const meow = require('meow');
const pkg = require('../package.json');
const app = require('../lib/server.js');

const cli = meow(`
    Usage
      $ server.js

    Options
      --port, -p     Define custom port
      --dry-run, -d  Do not run the server

    Examples
      $ server.js --port 8080
      🌈 server started✨🌈
`, {
  flags: {
    port: {
      type: 'number',
      default: 3000,
      alias: 'p',
    },
    'dry-run': {
      type: 'boolean',
      default: false,
      alias: 'd',
    },
  },
});

// Nullish coalescing requires Node.js >= 14
const config = {
  version: pkg.version,
  port: process.env.PORT ?? cli.flags.port,
  dryRun: cli.flags.dryRun,
  hostname: os.hostname,
};

console.log(`starting nodejs-boilerplate\n
configuration: ${JSON.stringify(config, null, 4)}a`);

if (!config.dryRun) {
  app.listen(config.port, () => {
    console.log(`${config.hostname} listening on port ${config.port}`);
  });
}
