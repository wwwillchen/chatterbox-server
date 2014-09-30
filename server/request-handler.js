/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documenthttp://nodejs.org/api/modules.html.ation at  */
var fs = require("fs");

module.exports.handler = function(request, response) {
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */
  console.log('request.method=', request.method);
  console.log("Serving request type " + request.method + " for url " + request.url);

  if (request.url.indexOf('/classes') === -1) {
    response.writeHead(404);
    response.end();
    return;
  }

  if (request.method === 'OPTIONS') {
    //console.log(defaultCorsHeaders);
    response.writeHead(204, defaultCorsHeaders);
    response.end();
  } else if (request.method === 'GET') {
    // GET URL: /1/classes/chatterbox/?order=-createdAt
    handleGetRequest(request,response);
  } else if (request.method === 'POST') {
    // POST URL: url /1/classes/chatterbox/
    handlePostRequest(request,response);
  }

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */


  /* Without this line, this server wouldn't work. See the note
   * below about CORS. */

  /* .writeHead() tells our server what HTTP status code to send back */

  /* Make sure to always call response.end() - Node will not send
   * anything back to the client until you do. The string you pass to
   * response.end() will be the body of the response - i.e. what shows
   * up in the browser.*/
};

var options = {encoding:'utf8'};

var handleGetRequest = function(request, response){
  var statusCode = 200;
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "application/json";

  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(storage));
};

var handlePostRequest = function(request, response){
  var statusCode = 201;
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "application/json";

  var receivedMessage = '';
  request.on('data', function(chunk){
    receivedMessage += chunk;
  });

  request.on('end', function(){
    fs.readFile(__dirname + '/data.json', options, function(err, data) {
      if (err) throw err;

      /*
        1. Read file async
          2. Parse the file into JSON object and assign it to a variable
          3. Insert a new message into JSON object
          4. Write to the file async
            5. Write headers and call end()
      */

      res = data || '{}';
      var res = JSON.parse(res);
      res.results = res.results || [];
      res.results.push(JSON.parse(receivedMessage));
      console.log(res);

      fs.writeFile(__dirname + '/data.json', JSON.stringify(res), options, function(err) {
        if (err) throw err;

        response.writeHead(statusCode, headers);
        response.end();
      });
    });

  });

};

var storage = {
  results: []
};

/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

