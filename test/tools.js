const net = require('net');
const { promisify } = require('util');

class PromiseSocket {
  connect(options) {
    return new Promise((resolve, reject) => {
      this._socket = net.createConnection(options, resolve);
      this._socket.on('error', reject);
    });
  }

  destroy() {
    if (this._socket) {
      return this._socket.destroy();
    }
  }
}

module.exports = {

  /*
   * Exponential backoff retry
   * See https://gist.github.com/sumn2u/ec4ee749f85c182d8327fbe5d2cb0085
   */
  retry: async function retry(fn, retriesLeft = 3, interval = 10, exponential = true) {
    try {
      const result = await fn();
      return result;
    } catch (_) {
      if (retriesLeft) {
        await Promise.resolve(retry => setTimeout(retry, interval));
        return retry(fn, retriesLeft - 1, exponential ? interval * 2 : interval, exponential);
      }

      return Promise.reject(new Error('Max retries reached'));
    }
  },

  // Wait for a tcp port to be open
  waitOpenPort: async (port, retriesLeft, interval) => {
    const socket = new PromiseSocket();
    const fn = socket.connect.bind(socket, { port });
    await module.exports.retry(fn, retriesLeft, interval);
    if (socket) {
      socket.destroy();
    }

    return true;
  },

  // See https://stackoverflow.com/a/28050404
  getRandomPort: async () => {
    let port;
    const server = net.createServer(sock => {
      sock.end();
    });
    const listen = promisify(server.listen.bind(server));
    await listen(0).then(() => {
      port = server.address().port;
    });
    server.close();
    return port;
  },
};
