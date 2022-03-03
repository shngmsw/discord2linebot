// Response for Uptime Robot
// Cloud Run must listen for requests on 0.0.0.0
const http = require('http');
http.createServer((req, res) => {
  // Set the response HTTP header with HTTP status and Content type
  res.writeHead(200, { "Content-Type": "text/plain" });
  // Send the response body "Hello World"
  res.end("Just for testing purposes\n");
}).listen(process.env.PORT || 3000);

require('./main.js');
