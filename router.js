/*
##
##  Node API Router
##		by Abhi Devireddy
##
##	Usage: 	Routes are specified in the routes file.
## 					Variables are enclosed in { }
##
*/

var http = require('http');
var fs = require('fs');
 
http.createServer(function (req, res) {
		if (req.url == "/") {
			sendHomePage(req, res);
		}
		else {
	    proxyRoute(req, res);
		}
}).listen(process.env.PORT);

var sendHomePage = function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end("Done");
};

var proxyRoute = function(req, res) {
	fs.readFile("routes", 'utf8', function(err, data) {
		if (err)
		{
			res.end("Error opening routes file...");
		}
		else
		{
			var routes = data.split("\n");
			var found = false;
			for(var i = 0; i < routes.length; i++) {
				if (routes[i][0] == "#") continue;
				var route = routes[i].split(",");
				if (route[1] == null) break;
				var route_regex = new RegExp(route[0].replace(/{(.*?)}/g, "(.*)"));
				var out_url = route[1].trim();
				var params = route[0].match(/{(.*?)}/g);
				var matches = req.url.match(route_regex);
				if (matches) matches = matches.slice(1);
				if (out_url && matches) {
					for(var i = 0; i < params.length; i++) {
						var param_regex = new RegExp(params[i], "g")
						out_url = out_url.replace(param_regex, matches[i]);
					}
					console.log("Incoming: " + req.url);
					console.log("Params: " + params);
					console.log("Matches: " + matches);
					console.log("Outgoing: " + out_url);

					http.get(out_url, function onResponse(response) {
					  response.pipe(res);
					});
					found = true;
					break;
				}
			}
		}
		if(!found) {
			res.end("Route not found. Please add it in the routes file.\n");
		}
	});
}