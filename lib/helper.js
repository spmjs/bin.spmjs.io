'use strict';

var moment = require('moment');

var helper = module.exports = {};

helper.fromNow = function(date) {
  return moment(date).fromNow();
};

