'use strict';
  
var request = require('request');
var spm = require('spm');
var _ = require('lodash');

request('http://spmjs.io/repository', function(err, res, body) {
  var pkgs = JSON.parse(body);

  // class is not a valid spm package
  // https://github.com/pandorajs/class/pull/1
  pkgs = _.without(pkgs, 'class');
  process.chdir('./spm-packages');
  spm.install({
    source: 'http://spmjs.io/',
    query: pkgs,
    save: true
  });
});
