
// K8 environment variables
process.env.SERVICE_NAME = process.env.SERVICE_NAME || 'en-socket';
process.env.ENVIRONMENT = process.env.ENVIRONMENT || 'dev';
process.env.SERVICE_VERSION = process.env.SERVICE_VERSION || '1.0';
process.env.HOST = process.env.HOST || '0.0.0.0';
process.env.PORT = process.env.PORT || '8086';
process.env.S3_BUCKET = process.env.S3_BUCKET || 'dev.emprego.net';
process.env.S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID || 'AKIAJIKT3TE7KIQNJOPQ';
process.env.S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY || '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';
process.env.REDIS_PREFIX = process.env.REDIS_PREFIX || 'ApiGateway';
process.env.REDIS_DB_NUMBER = process.env.REDIS_DB_NUMBER || 1;
process.env.REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
process.env.REDIS_PORT = process.env.REDIS_PORT || '6379';

const config = {
  env: process.env.ENVIRONMENT,
  server: {
    port: process.env.PORT,
    host: process.env.HOST
  },
  s3: {
    bucket: process.env.S3_BUCKET,
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
  },
  jwt: {
    cookieOpts: {
      ttl: 60 * 60 * 1000, // 1 hours
      path: '/',
      encoding: 'none',    // we already used JWT to encode
      isSecure: false,      // warm & fuzzy feelings
      isHttpOnly: true,    // prevent client alteration
      clearInvalid: false, // remove invalid cookies
      strictHeader: true   // don't allow violations of RFC 6265
    },
    cookieKey: 'empregonet2-token',
    userkey: 'user',
    key: 'B0@0f&rt@2017P4r@ˆ%$%$___ˆ&%&%ˆ%jljlk6868686',
    verifyOptions: { algorithms: ['HS256'] } // pick a strong algorithm
  },
  log: {
    name: process.env.SERVICE_NAME
  },
  redis: {
    prefix: process.env.REDIS_PREFIX,
    dbId: process.env.REDIS_DB_NUMBER,
    config: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT
    }
  },
};

module.exports = config;
