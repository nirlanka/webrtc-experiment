const express = require('express');
const app = express();

app.use(express.static('public'));

const signal_manager = require('./signal-manager');
signal_manager.init();

app.get('/', (request, response) => {
  response.sendFile(__dirname + '/views/index.html');
});

const port = process.env.PORT;

const listener = app.listen(port, () => {
  console.log('Your app is listening on port ' + port);
});
