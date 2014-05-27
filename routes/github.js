'use strict';

var request = require('request');
var account = require('../models/account');

var githubToken = require('github-token')({
  githubClient: g_config.github.clientId,
  githubSecret: g_config.github.clientSecret,
  baseURL: g_config.github.baseURL,
  callbackURI: '/callback',
  scope: 'user'
});

exports.login = function(req, res) {
  if (!req.session.user) {
    return githubToken.login(req, res);
  } else {
    res.redirect('/');
  }
}

exports.logout = function(req, res) {
  req.session.user = null;
  res.redirect('/');
};

exports.callback = function(req, res, next) {
  githubToken
    .callback(req, res)
    .then(function(token) {
      var url = 'https://api.github.com/user?access_token=' + token.access_token;
      var opts = {headers: {'User-Agent': 'spmjsbin'}};
      request(url, opts, function(err, response, body) {
        if (err) return next(err);
        if (response.statusCode != 200) {
          return next('statusCode is ' + response.statusCode);
        }

        var user = JSON.parse(body);
        req.session.user = user.login;

        account.save(user.login, {$set:user}, function() {
          res.redirect('/');
        });
      });
    });
};
