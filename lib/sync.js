'use strict';

require('../config');
  
var spm = require('spm');
var _ = require('lodash');
var join = require('path').join;

exports.installPkgs = function(pkgs) {
  // class is not a valid spm package
  // https://github.com/pandorajs/class/pull/1
  pkgs = _.without(pkgs, 'class');

  // install packages
  process.chdir(join(__dirname, '../spm-packages'));
  spm.install({
    source: g_config.spm.source,
    query: pkgs,
    save: true
  });
}
