'use strict';

var detective = require('detective');
var read = require('fs').readFileSync;
var join = require('path').join;
var format = require('util').format;

exports.github = require('./github');
exports.bin = require('./bin');

exports.home = function(req, res) {
  res.render('home', {
    user: req.session.user,
    html: '',
    css: '',
    js: ''
  });
};

exports.module = function(req, res) {
  var pkg = req.param('pkg');
  var version = req.param('version');
  var version = req.param('version');
  var main = req.param('main');
  var file = format('../spm-packages/sea-modules/%s/%s/%s', pkg, version, main);
  file = join(__dirname, file);
  res.send(format('define(function(require, exports, module) {\n%s\n});', read(file, 'utf-8')));
};
