var join = require('path').join;
var nedb = require('nedb');

var account = new nedb({
  filename: join(__dirname, '../data/db/account.db'),
  autoload: true
});

exports.save = function(id, data, callback) {
  account.update({login: id}, data, {upsert: true}, function() {
    callback && callback(data);
  });
};

exports.getByName = function(name, callback) {
  account.findOne({
    login: name
  }, function(err, result) {
    callback && callback(result);
  });
};
