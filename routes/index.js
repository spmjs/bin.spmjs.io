var fs = require('fs');
var read = require('fs').readFileSync;
var join = require('path').join;
var extname = require('path').extname;
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
  req.accepts('html');

  var pkg = req.params[0];
  var version = req.params[1];
  var main = req.params[2];
  var file = format('../spm-packages/sea-modules/%s/%s/%s', pkg, version, main);
  file = join(__dirname, file);

  if (extname(file) === '.js') {
    var fileContent = read(file, 'utf-8');
    res.send(format('define(function(require, exports, module) {\n%s\n});', fileContent));
  } else {
    fs.createReadStream(file).pipe(res);
  }
};
