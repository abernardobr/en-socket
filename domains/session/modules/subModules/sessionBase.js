const Domains = require('@enetbr/en-tools');
const Redis = require('redis');
const Joi = require('@hapi/joi');

const { redis } = Domains.serverconfig();
const { prefix, dbId, config } = redis;

/**
 * @description Save sessionid apikey
 * @class Session
 */
class SessionBase {

  constructor() {
    const self = this;
    self.options = { dbId, prefix, config };

    // Connect to redis
    self.clientRedis = Redis.createClient(self.options.config);
  }

  /**
    * 
    * @param apiKey Creates an apiKey for the key on a key:value pair
    * @returns {String} The id to create for the redis key for a key:value pair
    * @private 
    */
  _createId(apiKey) {
    const self = this;
    return `${self.options.prefix}:${apiKey}`;
  }

  /**
   * @description Sets, for a given time in seconds, the given satring as value and id as key for the key:value pair.
   * @param {String} apiKey The apiKey for the key on a key:value pair
   * @param {Object} data The data, in string format, that will be set for the value on a key:value pair
   * @param {Number} timeInSec the time in seconds for expiration on the key:value pair. After the given time, this entry will be delete from the database
   * @returns Prommise resolve data of id or reject err
   * @public
   */
  setEX(apiKey, data, timeInSec) {
    return new Promise((resolve, reject) => {
      Joi.assert(apiKey, Joi.string().min(2).required());
      Joi.assert(data, Joi.string().required());
      Joi.assert(timeInSec, Joi.number().min(1).required());

      const self = this;
      self.clientRedis.SETEX(self._createId(apiKey), timeInSec, data, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

   /**
   * @description Sets the given string as value and apiKey as key for the key:value pair.
   * @param {String} apiKey The apiKey for the key on a key:value pair
   * @param {Object} data The data, in string format, that will be set for the value on a key:value pair
   * @returns Prommise resolve data of id or reject err
   * @public
   */
  set(apiKey, data) {
    return new Promise((resolve, reject) => {
      Joi.assert(apiKey, Joi.string().min(2).required());
      Joi.assert(data, Joi.string().required());

      const self = this;
      self.clientRedis.SET(self._createId(apiKey), data, (err) => {
        if(err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * @description Sets the given object as value and id as key for the key:value pair. The object is saved as a string.
   * @param {String} apiKey The apiKey for the key on a key:value pair
   * @param {Object} obj The object that will be set as a string for the value on a key:value pair
   * @returns Prommise resolve data of id or reject err
   * @public
   */
  setObj(apiKey, obj) {
    return new Promise((resolve, reject) => {
      Joi.assert(apiKey, Joi.string().min(2).required());
      Joi.assert(obj, Joi.object().required());

      const self = this;
      const sessionData = JSON.stringify(obj);

      self.clientRedis.SET(self._createId(apiKey), sessionData, (err) => {
        if(err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * @description Sets a new TTL on the key
   * @param {String} apiKey The apiKey for the key on a key:value pair
   * @param {Number} timeInSec The time in seconds for expiration on the key:value pair. After the given time, this entry will be delete from the database
   * @returns Prommise resolve data of id or reject err
   * @public
   */
  setNewExpire(apiKey, timeInSec) {
    return new Promise((resolve) => {
      Joi.assert(apiKey, Joi.string().min(2).required());
      Joi.assert(timeInSec, Joi.number().min(1).required());

      const self = this;
      self.clientRedis.EXPIRE(self._createId(apiKey), timeInSec, (err) => {
        if(err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * @description Gets the value ttl for apiKey
   * @param {String} apiKey The apiKey for the key on a key:value pair
   * @returns Prommise resolve data of id or reject err
   * @public
   */
  getTTL(apiKey) {
    return new Promise((resolve, reject) => {
      Joi.assert(apiKey, Joi.string().min(2).required());

      const self = this;
      self.clientRedis.TTL(self._createId(apiKey), (err, retData) => {
        if(err) {
          reject(err);
        } else {
          resolve(retData);
        }
      });
    });
  }

  /**
   * @description Gets the value as string, for a given key on a key:value pair
   * @param {String} apiKey The apiKey for the key on a key:value pair
   * @returns Prommise resolve data of apiKey or reject err
   * @public
   */
  get(apiKey) {
    return new Promise((resolve, reject) => {
      Joi.assert(apiKey, Joi.string().min(2).required());

      const self = this;
      self.clientRedis.GET(self._createId(apiKey), (err, retData) => {
        if(err) {
          reject(err);
        } else {
          resolve(retData);
        }
      });
    });
  }

  /**
   * @description Gets the value as object, for a given key on a key:value pair
   * @param {String} apiKey The apiKey for the key on a key:value pair
   * @returns {Promise} Promisse resolve or reject
   * @public
   */
  getObj(apiKey) {
    return new Promise((resolve, reject) => {
      Joi.assert(apiKey, Joi.string().min(2).required());

      const self = this;
      self.clientRedis.GET(self._createId(apiKey), (err, retData) => {
        try {
          if (err) {
            reject(err);
          } else {
            const obj = JSON.parse(retData);
            resolve(obj);
          }
        } catch (err) {
          Domains.log().error('REDIS parse error', retData);
          resolve();
        }
      });
    });
  }

  /**
   * @description Verify, apiKey exist in redis?
   * @param {String} apiKey The apiKey for the key on a key:value pair
   * @returns {Promise} cb retun promisse resolve or reject
   * @public
   */
  existKey(apiKey) {
    return new Promise((resolve, reject) => {
      Joi.assert(apiKey, Joi.string().min(2).required());

      const self = this;
      self.clientRedis.EXISTS(self._createId(apiKey), (err, retData) => {
        try {
          if (err) {
            reject(err);
          } else {
            resolve(retData);
          }
        } catch (err) {
          Domains.log().error('REDIS  error', retData);
          reject();
        }
      });
    });
  }

  /**
   * Deletes the key:value pair, given the apiKey as the key.
   * @param {String} apiKey The apiKey for the key on a key:value pair
   * @returns {Promise} Promisse resolve or reject
   * @public
   */
  del(apiKey) {
    return new Promise((resolve, reject) => {
      Joi.assert(apiKey, Joi.string().min(2).required());

      const self = this;
      self.clientRedis.DEL(self._createId(apiKey), (err) => {
        if(err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

module.exports = SessionBase;