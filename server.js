const Socketio = require('socket.io');
const _ = require('lodash');
const Domains = require('@enetbr/en-tools');

class Server {
  constructor(options) {
    const self = this;
    self.options = _.defaultsDeep({
      init: [],
      funcs: [
        { type: 'startServer', func: self._startServer.bind(self) }
      ]
    }, options);
    self.serverConfig = self.options.config;
  }

  log(msg, err) {
    if (err) {
      Domains.log().error(msg, err);
    } else {
      Domains.log().info(msg);
    }
  }

  init() {
    const self = this;

    Domains.init({
      domains: require('./domains')
    });
    Domains.log().init(self.serverConfig.log.name);
    self.log('## init');
  }

  async _startServer() {
    const self = this;
    const port = parseInt(self.serverConfig.server.port);
    const io = Socketio(port);
    const socket = Domains.socket();

    socket.listenEvents(io);
    self.log("## _startServer");
  }

  async _executeServerInitializations() {
    const self = this;
    for (let i = 0; i < self.options.funcs.length; i++) {
      let type = self.options.funcs[i].type;
      let func = self.options.funcs[i].func;
      if (self.options.init.indexOf(type) !== -1) {
        await func();
      }
    }
  }

  async start() {
    const self = this;
    await self._executeServerInitializations();
  }
}

module.exports = Server;
