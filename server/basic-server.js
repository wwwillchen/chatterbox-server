/* Import node's http module: */
var http = require("http");
var url = require('url');
var handleRequest = require("./request-handler.js");
//var staticHandler = require('./static-handler.js');

var port = 3000;
var ip = "127.0.0.1";

var routes = {
  '/1/classes/chatterbox/': handleRequest.handler
/*  '/': staticHandler,
  '/scripts': staticHandler,
  '/styles': staticHandler,
  '/images': staticHandler*/
  /*
    if route is not found, call errorHandler
  */
};

var server = http.createServer(function(request, response) {
  var pathname = url.parse(request.url).pathname;
  var handler = routes[pathname];

  console.log('pathname', pathname);
  if (!handler) {
    handleError(request, response);
  } else {
    handler(request, response);
  }
});

console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);

var handleError = function(request, response) {
  response.writeHead(404);
  response.end();
};

