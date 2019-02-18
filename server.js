const http = require('http');
const app = require('./src/app.js');
const PORT = process.env.PORT || 8080;

const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
