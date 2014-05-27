'use strict';

global.g_config = process.env.NODE_ENV === 'production'
  ? require('./config/base-production.json')
  : require('./config/base.json');
