'use strict';

var join = require('path').join;
var nedb = require('nedb');

var bin = new nedb({
  filename: join(__dirname, '../data/db/bin.db'),
  autoload: true
});

exports.save = function(id, data, callback) {
  if (id) {
    getById(id, function(err, result) {
      if (!result) {
        return callback(404);
      }
      if (result.user != data.user) {
        // FIXME: not property
        return callback(403);
      }

      bin.update({_id: id}, data, {upsert: true}, function(err, result) {
        callback && callback(null, data);
      });
    });
  }

  else {
    bin.insert(data, function(err, result) {
      callback && callback(null, result);
    });
  }
};

var getById = exports.getById = function(id, callback) {
  bin.findOne({_id: id}, function(err, result) {
    callback && callback(null, result);
  });
};
