'use strict';

var readFile = require('fs').readFileSync;
var join = require('path').join;
var _ = require('lodash');
var detective = require('detective');
var format = require('util').format;

module.exports = function(data) {
  _.extend(data, {
    alias: getAlias(data.js),
    css: buildCSS(data.css)
  });
  console.log(data);
  return data;
};

function buildCSS(cssCode) {
  // TODO: get deps and concat
  return cssCode;
}

function getAlias(jsCode) {
  var requires = detective(jsCode);
  var ret = {};
  var data = readFile(join(__dirname, '../spm-packages/package.json'));
  var spmData = JSON.parse(data).spm;
  requires.forEach(function(pkg) {
    var version = spmData.dependencies[pkg];
    console.log(pkg);
    console.log(version);
    var main = getMain(pkg, version);
    ret[pkg] = format('sea-modules/%s/%s/%s', pkg, version, main);
  });
  return ret;
}

function getMain(pkg, version) {
  var json = readFile(join(__dirname, '../spm-packages/sea-modules/'+pkg+'/'+version+'/package.json'));
  json = JSON.parse(json);
  return json.spm.main;
}
