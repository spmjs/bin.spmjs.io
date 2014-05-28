'use strict';

var fs = require('fs');
var Tree = require('spm-tree').Tree;
var readFile = fs.readFileSync;
var join = require('path').join;
var _ = require('lodash');
var format = require('util').format;
var imports = require('css-imports');

module.exports = function(data) {
  _.extend(data, {
    alias: getAlias(data.js),
    css: buildCSS(data.css)
  });
  return data;
};

function buildCSS(cssCode) {
  return imports(cssCode, function(item) {
    var pkg = item.path;
    if (isRelative(pkg)) {
      return item.string;
    }

    var deps = getDeps();
    var version = deps[pkg];
    if (!version) {
      throw Error('dep `'+pkg+'` not found');
    }

    var main = getMain(pkg, version);
    var mainPath = join(__dirname, '../spm-packages/', format('sea-modules/%s/%s/%s', pkg, version, main));
    if (!fs.existsSync(mainPath)) {
      throw Error('main file of dep `'+pkg+'` not found');
    }

    return readFile(mainPath, 'utf-8');
  });
}

function getDeps() {
  var data = readFile(join(__dirname, '../spm-packages/package.json'));
  return JSON.parse(data).spm.dependencies;
}

function isRelative(file) {
  return file.charAt(0) === '.';
}

function getJSDeps(jsCode) {
  var root = join(__dirname, '../spm-packages');
  var tree = new Tree(root);

  var deps = tree.getJSDeps(jsCode, {flat:true});
  return deps.map(function(dep) {
    return dep.name;
  });
}

function getAlias(jsCode) {
  var requires = getJSDeps(jsCode);
  var deps = getDeps();
  var ret = {};

  requires.forEach(function(pkg) {
    var version = deps[pkg];
    if (!version) {
      throw Error('deps `'+pkg+'` not found');
    }
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
