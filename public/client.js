const server_connection = new WebSocket('ws://[::1]:4000');
server_connection.onmessage = msg => {
  if (!peer_connection)
    start()
}

let local_stream;

navigator.getUserMedia(
  { video: true, audio: true, }, 
  
  stream => {
    local_stream = stream;
    local_video.src = window.URL.createObjectURL(stream);
  },
  
  err => console.error('Failed getting user video. ', err)
)

const peer_connection_config = {
  ice_servers: [
    { url: 'stun.l.google.com:19302' },
    { url: 'stun1.l.google.com:19302' },
    { url: 'stun2.l.google.com:19302' },
  ]
}

const local_video = document.getElementById('local-video');
const remote_video = document.getElementById('remote-video');

let peer_connection;

function start_stream(is_caller) {
  peer_connection = new RTCPeerConnection(peer_connection_config);
  
  peer_connection.onicecandidate = event => {
    if (event.candidate) 
      server_connection.send(JSON.stringify({ ice: event.candidate }));
  }
  
  peer_connection.onaddstream = event => console.log('Got ');
  
  peer_connection.addStream(local_stream);
  
  if (is_caller) 
    peer_connection.createOffer(
      description => {
        console.log('Got description');
        
        peer_connection.setLocalDescription(
          description, 
          () => server_connection.send(JSON.stringify({ sdp: description })),
          () => console.error('Failed to set description.')
        )
      },
      
      err => console.error('Failed to create offer. ', err)
    )
  }
