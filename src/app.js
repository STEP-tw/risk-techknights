const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.get('/', (req, res) => {
  res.write('<h1>Not Found</h1>');
  res.end();
});
module.exports = app;
