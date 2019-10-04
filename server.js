const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.static('public'));

let ice = [];
let peers = [];
let offers = [];
let answers = [];

app.get('/reset', (req, res) => {
  ice = [];
  peers = [];
  offers = [];
  answers = [];
  
  res.sendStatus(200);
})

app.post('/peer', (req, res) => {
  req.body && req.body.userid && peers.push(req.body.userid);
  
  res.sendStatus(200);
})

app.post('/ice', (req, res) => {
  ice.push(req.body);
  
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

app.post('/answer', (req, res) => {
  answers.push(req.body);
  
  res.sendStatus(200);
});


app.get('/answers/pop', (req, res) => {
  const { userid } = req.query;
  
  answers = answers.filter(x => x.userid !== userid);
  
  res.sendStatus(200);
});

app.get('/ice', (req, res) => {
  const { userid } = req.query;
  
  res.send(ice.filter(x => x.userid === userid));
  
  ice = ice.filter(x => x.userid !== userid);
});

app.get('/offers', (req, res) => res.send(offers));

app.get('/answers', (req, res) => res.send(answers));

app.get('/', (req, res) => res.sendFile(__dirname + '/views/index.html'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Your app is listening on port ' + port));
