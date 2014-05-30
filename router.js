/*
##
##  Node API Router
##		by Abhi Devireddy
##
##	Usage: 	Add your routes to the file and test your endpoint.
## 					Variables are enclosed in { }
##
*/

var Hapi = require('hapi');
 
var server = new Hapi.Server('0.0.0.0', process.env.PORT || 8080);

// Default Routes
server.route({method: '*', path: '/', handler: {file: {path: 'static/index.html'}}});
server.route({method: '*', path: '/static/{file*}', handler: {directory: {path: 'static'}}});
server.route({method: '*', path: '/routes', handler: {file: {path: 'router.js'}}});

// Route for the Reddit API
server.route({
  method: '*',
  path: '/reddit/{apicall*}',
  handler: {
    proxy: {
      passThrough: true,
      redirects: 5,
      mapUri:  function (request, callback) {
        url = "http://api.reddit.com/" + (request.params['apicall'] || '');
        callback(null,url);
      }
    }
  }
});

// Start the server
server.start(function() {
  console.log(server.info.uri);
});