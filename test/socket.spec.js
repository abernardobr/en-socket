const io = require('socket.io-client');
const server = 'http://localhost:8086';
const token = 'MEUTOKEN';

describe(`Start test socket server`, function () {

  it('Connect in socket server', async function () {
    const conn = io(server, { query: { token } });
  });
});