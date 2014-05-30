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


// Root Route
var root = function(request, reply) {
	reply("OK");
}
server.route({method: '*', path: '/', handler: root});

// Route for the Reddit API
server.route({
  method: '*',
  path: '/reddit/{apicall*}',
  handler: {
    proxy: {
      passThrough: true,
      redirects: 5,
      mapUri:  function (request, callback) {
        url = "http://api.reddit.com/" + request.params.apicall;
        callback(null,url);
      }
    }
  }
});


// Start the server
server.start(function() {
  console.log(server.info.uri);
});