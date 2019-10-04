const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.static('public'));

let ice = [];
let peers = [];
let offers = [];

app.post('/ice', (req, res) => {
  ice.push(req.body);
  peers.push(req.body.userid);
  
  res.sendStatus(200);
});

app.get('/peers', (req, res) => {
  res.send(peers);
});

app.post('/offer', (req, res) => {
  offers.push(req.body);
  
  res.sendStatus(200);
});

app.get('/peers/pop', (req, res) => {
  const { userid } = req.query;
  
  peers = peers.filter(p => p !== userid);
  
  res.sendStatus(200);
});

app.get('/offers/pop', (req, res) => {
  const { userid } = req.query;
  
  offers = offers.filter(x => x.userid !== userid);
  
  res.sendStatus(200);
});

app.get('/', (req, res) => res.sendFile(__dirname + '/views/index.html'));

app.listen(process.env.PORT, () => console.log('Your app is listening on port ' + process.env.PORT));
