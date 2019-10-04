const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.static('public'));

let ice = [];

app.post('/ice', (req, res) => {
  ice.push(req.body);
  res.sendStatus(200);
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.listen(process.env.PORT, () => console.log('Your app is listening on port ' + process.env.PORT));
