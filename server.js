const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.static('public'));

const peers = [];

app.post('/rtc/peers/list', (req, res) => {
  res.send(peers);
  peers.push(req.body);
  console.log('set - peers', peers);
})

app.get('/rtc/peers/add', (req, res) => {
  res.send(peers);
  console.log('get - peers', peers);
})

app.post('/rtc/peers/failed', (req, res) => {
  peers = peers.filter(p => p);
  res.send(peers);
  console.log('failed - peers', peers);
})

app.get('/', (request, response) => {
  response.sendFile(__dirname + '/views/index.html');
});

app.listen(process.env.PORT, () => 
 console.log('Your app is listening on port ' + process.env.PORT));
