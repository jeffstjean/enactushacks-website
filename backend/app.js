const http = require('http');
const dotenv = require('dotenv');

// allows access to .env file
dotenv.config();

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

server.listen(process.env.PORT, process.env.HOSTNAME, () => {
  console.log('Server running at http://' + process.env.HOSTNAME + ':' + process.env.PORT);
});
