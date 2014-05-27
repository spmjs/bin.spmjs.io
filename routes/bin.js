'use strict';

var binModel = require('../models/bin');
var _ = require('lodash');
var build = require('../lib/build');

exports.save = function(req, res) {
  if (!req.session.user) {
    return res.send(401);
  }

  var id = req.param('id');
  var data = {
    html: req.param('html'),
    css: req.param('css'),
    js: req.param('js'),
    user: req.session.user
  };

  binModel.save(id, data, function(err, result) {
    if (err) {
      return res.send(+err);
    }

    res.header('bin_id', result._id);
    try {
      res.render('bin', build(result));
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
    res.render('bin', build(data));
  } catch(e) {
    console.log('error: ', e.message);
    res.header('error', e.message);
    res.send(500);
  }
};

exports.show = function(req, res) {
  var id = req.param('id');
  binModel.getById(id, function(err, result) {
    if (!result) return res.send(404);
    res.render('bin', build(result));
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
