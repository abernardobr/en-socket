const BaseSession = require('./subModules/sessionBase');

/**
 * @description Save sessionid, clients socket
 * @class Session
 */
class Session extends BaseSession {

  constructor() {
    super();
  }
}

module.exports = Session;