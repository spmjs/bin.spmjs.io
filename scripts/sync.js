'use strict';

require('../config');
  
var request = require('request');
var spm = require('spm');
var _ = require('lodash');

request(g_config.spm.source + 'repository', function(err, res, body) {
  var pkgs = JSON.parse(body);
  installPkgs(pkgs);
});

function installPkgs(pkgs) {
  // class is not a valid spm package
  // https://github.com/pandorajs/class/pull/1
  pkgs = _.without(pkgs, 'class');

  // install packages
  process.chdir('./spm-packages');
  spm.install({
    source: g_config.spm.source,
    query: pkgs,
    save: true
  });
}
