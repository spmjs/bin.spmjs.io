var binModel = require('../models/bin');
var _ = require('lodash');
var detective = require('detective');
var build = require('../lib/build');
var imports = require('css-imports');

exports.save = function(req, res) {
  if (!req.session.user) {
    return res.send(401);
  }

  var id = req.param('id');
  var data = {
    html: req.param('html'),
    css: req.param('css'),
    js: req.param('js'),
    deps: getDeps(req.param('css'), req.param('js')),
    user: req.session.user
  };

  binModel.save(id, data, function(err, result) {
    if (err) {
      return res.send(+err);
    }

    res.header('bin_id', result._id);
    try {
      res.render('bins/show', build(result));
    } catch(e) {
      res.header('error', e);
      res.send(500);
    }
  });
};

exports.build = function(req, res) {
  var data = {
    html: req.param('html'),
    css: req.param('css'),
    js: req.param('js')
  };
  
  try {
    res.render('bins/show', build(data));
  } catch(e) {
    console.log('error: ', e.message);
    res.header('error', e.message);
    res.send(500);
  }
};

exports.index = function(req, res) {
  binModel.getLast(function(err, publicBins) {
    // eeeee..
    if (req.session.user) {
      binModel.getByUser(req.session.user, function(err, bins) {
        res.render('bins/index', {
          user: req.session.user,
          bins: bins,
          publicBins: publicBins
        });
      });
    } else {
      res.render('bins/index', {
        user: req.session.user,
        bins: null,
        publicBins: publicBins
      });
    }
  });
};

exports.show = function(req, res) {
  var id = req.param('id');
  binModel.getById(id, function(err, result) {
    if (!result) return res.send(404);
    res.render('bins/show', build(result));
  });
};

exports.edit = function(req, res) {
  var id = req.param('id');
  binModel.getById(id, function(err, result) {
    if (!result) return res.send(404);
    res.render('home', _.extend(result, {
      user: req.session.user
    }));
  });
};

function getDeps(cssCode, jsCode) {
  var cssDeps = imports(cssCode).map(function(dep) {
    return dep.path;
  }).filter(isNotRelative);
  var jsDeps = detective(jsCode).filter(isNotRelative);

  return Array.prototype.concat.apply(cssDeps, jsDeps);
}

function isNotRelative(filepath) {
  return filepath.charAt(0) !== '.';
}
