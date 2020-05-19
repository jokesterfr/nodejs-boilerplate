/**
 * CLI tests
 */
const test = require('ava');
const { join } = require('path');
const { spawn } = require('child_process');

const tools = require('./tools.js');
const entrypoint = join(__dirname, '../bin/server.js');

test.before(async t => {
  t.context.port = await tools.getRandomPort();
});

test('run on the 3000 port by default', async t => {
  const server = spawn(entrypoint, [ '--dry-run' ]);

  await new Promise((resolve, reject) => {
    // Parse configuration output from spawned process stdout
    server.stdout.once('data', async data => {
      let i = data.indexOf('configuration: ');
      if (i !== -1) {
        data = data.slice(i + 'configuration: '.length);
        i = data.indexOf('\n}');
        if (i !== -1) {
          data = data.slice(0, i + '\n}'.length);
          if (JSON.parse(data).port === 3000) {
            return resolve();
          }
        }
      }

      return reject(new Error('could not guess port configuration'));
    });

    server.stderr.once('data', data => {
      console.error(`stderr: ${data}`);
      return reject(new Error('an error happened while starting the server'));
    });

    server.on('exit', code => {
      if (code !== 0) {
        return reject(new Error(`subprocess exited unexpectedly: ${code}`));
      }
    });
  });

  server.kill();
  t.pass();
});

test('run on any given PORT environment variable', async t => {
  /*
   * Notice: `spawn()` third parameter is using `process.env` by default. If you
   * try to override it completely, this can destroy your custom PATH modifications,
   * which is the case if you rely on nvm. Updating process.env is a much reliable
   * way to do this.
   */
  process.env.PORT = t.context.port;
  const server = spawn(entrypoint);

  await new Promise((resolve, reject) => {
    server.stdout.once('data', async () => {
      tools.waitOpenPort(t.context.port, 5, 10).then(resolve, error => {
        console.error(error);
        return reject(new Error('server did not bind on expected port'));
      });
    });

    server.stderr.once('data', data => {
      console.error(`stderr: ${data}`);
      return reject(new Error('an error happened while starting the server'));
    });

    server.on('exit', code => {
      if (code !== 0) {
        return reject(new Error(`subprocess exited unexpectedly: ${code}`));
      }
    });
  });

  server.kill();
  t.pass();
});
