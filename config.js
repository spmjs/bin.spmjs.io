'use strict';

var isProduction = process.env.NODE_ENV === 'production';
global.g_config = isProduction ? require('./config/base-production.json')
  : require('./config/base.json');
