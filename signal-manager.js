module.exports = { init, };

const SocketServer = require('ws').Server;
const port = process.env.PORT2;
const socket_server = new SocketServer({ port, });

function init() {
  socket_server.on('connection', (socket) => {
    socket.on('message', (msg) => {
      console.log('received ' + msg);
      
      broadcast(socket_server, msg);
    })
  })
}

function broadcast(socket_server, data) {
  socket_server.clients.forEach(client => client.send(data));
}