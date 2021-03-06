'use strict';

var join = require('path').join;
var nedb = require('nedb');

var bin = new nedb({
  filename: join(__dirname, '../data/db/bin.db'),
  autoload: true
});

var getById = exports.getById = function(id, callback) {
  bin.findOne({_id: id}, function(err, result) {
    callback && callback(null, result);
  });
};

exports.save = function(id, data, callback) {
  if (id) {
    getById(id, function(err, result) {
      if (!result) {
        return callback(404);
      }
      if (result.user !== data.user) {
        // FIXME: 403 is not properly
        return callback(403);
      }

      data.updated_at = +new Date();
      bin.update({_id: id}, data, {upsert: true}, function() {
        callback && callback(null, data);
      });
    });
  }

  else {
    data.created_at = data.updated_at = +new Date();
    bin.insert(data, function(err, result) {
      callback && callback(null, result);
    });
  }
};

exports.getByUser = function(user, callback) {
  bin.find({user: user}).sort({updated_at:-1}).limit(10).exec(function(err, result) {
    callback && callback(null, result);
  });
};

exports.getLast = function(callback) {
  bin.find({}).sort({updated_at:-1}).limit(20).exec(function(err, result) {
    callback && callback(null, result);
  });
};
