let peer_connection;

const peer_conn_config = {
  ice_servers: [
    { url: 'stun.l.google.com:19302' },
    { url: 'stun1.l.google.com:19302' },
    { url: 'stun2.l.google.com:19302' },
  ]
}

const local_video = document.getElementById('local-video');
const remote_video = document.getElementById('remote-video');

const server_connection = new WebSocket('ws://[::1]:4000');
server_connection.onmessage = () => {}

let local_stream;

navigator.getUserMedia(
  { video: true, audio: true, }, 
  stream => {
    local_stream = stream;
    local_video.src = window.URL.createObjectURL(stream);
  },
  err => {
    console.error('Failed getting user video. ', err);
  }
)