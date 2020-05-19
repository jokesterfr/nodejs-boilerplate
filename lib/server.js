const express = require('express');
const app = express();

app.get('/', (request, response) => {
  console.log(`${request.method} ${request.originalUrl}`);
  response.json({ hello: 'world' });
});

module.exports = app;
