'use strict';

var postgrator = require('postgrator');
var app = require('connect')();
var http = require('http');
var swaggerTools = require('swagger-tools');
var jsyaml = require('js-yaml');
var fs = require('fs');
var config = require('config');
var conn = require('./dal/pgConnection.js');

postgrator.setConfig({
  migrationDirectory: __dirname + '/migrations',
  schemaTable: 'schemaversion', // optional. default is 'schemaversion'
  driver: 'pg',
  host: config.dbHost,
  database: config.dbDatabase,
  username: config.dbUser,
  password: config.dbPassword,
  ssl: true
});

postgrator.migrate('max', function (err) {
  if (err) {
    console.error(err)
    return postgrator.endConnection(function() { return;});
  }
  postgrator.endConnection(function () {
    // connection is closed, or will close in the case of SQL Server
    conn.init({
      dbUser: config.dbUser,
      dbPassword: config.dbPassword,
      dbHost: config.dbHost,
      dbDatabase: config.dbDatabase
    });
    // swaggerRouter configuration
    var options = {
      swaggerUi: '/swagger.json',
      controllers: './src/controllers',
      useStubs: process.env.NODE_ENV === 'development' ? true : false // Conditionally turn on stubs (mock mode)
    };

    // The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
    var spec = fs.readFileSync('./src/api/swagger.yaml', 'utf8');
    var swaggerDoc = jsyaml.safeLoad(spec);

    // Initialize the Swagger middleware
    swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {
      // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
      app.use(middleware.swaggerMetadata());

      // Validate Swagger requests
      app.use(middleware.swaggerValidator());

      // Route validated requests to appropriate controller
      app.use(middleware.swaggerRouter(options));

      // Serve the Swagger documents and Swagger UI
      app.use(middleware.swaggerUi());

      app.use(function(err, req, res) {
        if (typeof err !== 'object') {
          err = {
            message: String(err)
          };
        } else {
          Object.defineProperty(err, 'message', { enumerable: true });
        }
        if (err.name === 'MyError') {
          console.error(JSON.stringify(err));
          res.statusCode = 500;
          res.end();
        } else {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(err));
        }
      });

      // Start the server
      http.createServer(app).listen(config.serverPort, function () {
        console.log('Your server is listening on port %d (http://localhost:%d)', config.serverPort, config.serverPort);
        console.log('Swagger-ui is available on http://localhost:%d/docs', config.serverPort);
      });
    });
  });
});
