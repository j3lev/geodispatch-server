const express = require('express'),
      path = require('path'),
      logger = require('morgan'),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      healthcheck = require('./routes/healthcheck'),
      app = express(),
      server = require('http').Server(app),
      { dispatchNsp, otherNsp } = require('./sock_namespaces'),
      io = require('socket.io')(server),
      registerSocketNamespace = (nspName, nspCallback) => { io.of(nspName).on('connection', nspCallback) };

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', healthcheck);

registerSocketNamespace('/dispatch', dispatchNsp);
registerSocketNamespace('/random', otherNsp);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.send(err);
});

module.exports = { app, server };
