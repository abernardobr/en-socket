const Server = require('./server');
const ServerConfig = require('./config');

class Start {
  constructor() { }

  async execute() {
    try {
      const self = this;
      self.app = new Server({
        config: ServerConfig,
        init: [
          'startServer'
        ]
      });
      self.app.init();
      await self.app.start();
      const { port, host } = self.app.serverConfig.server
      self.app.log(`Socket listen ${host}:${port}`);
    } catch (err) {
      console.log(err);
    }
  }
}

let start = new Start();
start.execute();
