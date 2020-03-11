const _ = require('lodash');
const Domains = require('@enetbr/en-tools');
const Session = Domains.session();

/**
 * @description class socket server
 */
class SocketServer extends Session {
  constructor() {
    super();
  }

  /**
   * @description Check token is valid.
   * @param {String} Token Empregonet
   * @return {Promise} Resolve token is valid, reject token invalid
   * @private
   */
  async _checkJWT(token) {
    const self = this;
    return Promise.resolve();
  }

  /**
   * @description Auth new client and messages in socket server
   * @param {Object} File descritor socket client
   * @returns {Promise} resolve JWT sucess or reject bad JWT
   * @private
   */
  _authJWT(fd) {
    const self = this;

    return new Promise(async (resolve, reject) => {
      if (_.hasIn(fd, 'handshake.query.token')) {
        try {
          const { handshake: { query: { token } } } = fd;
          await self._checkJWT(token);
          resolve();

        } catch (err) {
          reject(err);
        }
      } else {
        reject('Authentication error');
      }
    });
  }

  /**
   * @description Lister events in socket server
   * @param {Object} Instance server socket.i
   * @public
   */
  listenEvents(io) {
    const self = this;

    io.use(async (fd, next) => {
      try {
        await self._authJWT(fd);
        return next();
      } catch (err) {
        next(new Error(err));
      }
    });

    io.on('connection', fd => {

      // New connection set key in redis
      Domains.log().info(`New client connected with id ${fd.id}`);

      fd.on('disconnect', fd => {
        // Remove key in redis
      });

      fd.on('error', err => {
        // Remove key in redis and disconnect client
      });
    });
  }
};

const socketServer = new SocketServer();
module.exports = socketServer;
