module.exports = { init, };

const SocketServer = require('ws').Server;
const port = process.env.PORT2;
const socket_server = new SocketServer({ port, });

function init() {
  
}