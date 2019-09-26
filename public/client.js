let peer_connection;

const peer_conn_config = {
  ice_servers: [
    { url: 'stun.l.google.com:19302' },
    { url: 'stun1.l.google.com:19302' },
    { url: 'stun2.l.google.com:19302' },
  ]
}

const constraints = {
  video: true,
  
}

const local_video = document.getElementById('local-video');
const remote_video = document.getElementById('remote-video');

const server_connection = new WebSocket('ws://[::1]:4000');
server_connection.onmessage = () => {}

