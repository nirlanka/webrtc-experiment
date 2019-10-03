const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.static('public'));

let peers = [];
let id = 0;

app.post('/rtc/peers/add', (req, res) => {
  if (Object.keys(req.body).length > 0) {
    req.body.id = ++id;
    peers.push(req.body);
    res.send({ id });
  } else {
    res.send({});
  }
  
  console.log('set - peers. current peers', peers.length);
})

app.get('/rtc/peers/list', (req, res) => {
  res.send(peers);
})

app.post('/rtc/peers/drop', (req, res) => {
  peers = peers.filter(p => p.id === req.body.id);
  res.send(peers);
})

app.get('/', (request, response) => {
  response.sendFile(__dirname + '/views/index.html');
});

app.listen(process.env.PORT, () => 
 console.log('Your app is listening on port ' + process.env.PORT));
