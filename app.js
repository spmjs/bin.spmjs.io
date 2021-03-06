require('./config');

var express = require('express');
var http = require('http');
var join = require('path').join;
var routes = require('./routes');
var _ = require('lodash');

var app = express();

///////////////////////
// Config.

_.extend(app.locals, require('./lib/helper'));

app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(require('morgan')());
app.use(require('serve-spm')(join(__dirname, 'public')));
app.use(require('body-parser')());
app.use(require('cookie-parser')());
app.use(require('express-session')({secret:'keyboard cat',key:'sid'}));
app.use(require('serve-static')(join(__dirname, 'public')));
app.use(require('serve-favicon')(__dirname + '/public/img/favicon.ico'));

///////////////////////
// Routes.

app.get('/', routes.home);
app.get(/\/sea-modules\/([^\/]+?)\/([^\/]+?)\/(.*)$/, routes.module);

app.post('/save', routes.bin.save);
app.post('/build', routes.bin.build);
app.get('/bins', routes.bin.index);
app.get('/bins/:id', routes.bin.show);
app.get('/bins/:id/edit', routes.bin.edit);

app.get('/login', routes.github.login);
app.get('/logout', routes.github.logout);
app.get('/callback', routes.github.callback);

///////////////////////
// Start Server.

http.createServer(app).listen(g_config.server.port, function(){
  console.log('Express server listening on port ' + g_config.server.port);
});
