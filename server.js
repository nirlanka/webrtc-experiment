const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.static('public'));

const peers = [];

app.post('/rtc/peer', (req, res) => {
  res.send(peers);
  peers.push(req.body);
  console.log('peers', peers);
})

app.get('/', (request, response) => {
  response.sendFile(__dirname + '/views/index.html');
});

app.listen(process.env.PORT, () => 
 console.log('Your app is listening on port ' + process.env.PORT));
