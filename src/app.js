var config = require('nconf');

// Initialize configuration
config.env()
      .argv()
      .overrides(require('../config/server.json'))
      .defaults(require('../config/defaults.json'));

require('./client/client.js').createServer();
require('./server/server.js').createServer();