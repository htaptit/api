'use strict';

var path = require('path');
var bodyParser = require('body-parser');
var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();
// configure view handler
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// configure body parser
app.use(bodyParser.urlencoded({extended: true}));

app.use(loopback.token({}));
app.use(function updateToken(req, res, next) {
  var token = req.accessToken; // get the accessToken from the request
  if (!token) return next(); // if there's no token we use next() to delegate handling back to loopback
  var now = new Date();
  // EDIT: to make sure we don't use a token that's already expired, we don't update it
  // this line is not really needed, because the framework will catch invalid tokens already
  if (token.created.getTime() + (token.ttl * 1000) < now.getTime()) return next();
  // performance optimization, we do not update the token more often than once per five seconds
  if (now.getTime() - token.created.getTime() < 5000) return next();
  token.updateAttribute('created', now, next); // save to db and move on
});

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
