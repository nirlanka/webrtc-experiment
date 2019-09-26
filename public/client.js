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
    if (event.candidate) {
      const ice_json = JSON.stringify({ ice: event.candidate });
      server_connection.send(ice_json);
    }
  }
  
  peer_connection.onaddstream = event => {
    console.log('Got ')
  }
  
  peer_connection.addStream(local_stream);
  
  if (is_caller) {
    
    peer_connection.createOffer(
      description => {
        console.log('Got description');
        
        peer_connection.setLocalDescription(
          description, 
          
          () => {
            const desc_json = JSON.stringify({ sdp: description });
            server_connection.send(desc_json);
          },
          
          () => {
            console.error('Failed to set description.');
          }
        )
      },
      
      err => {
        console.error('Failed to create offer. ', err);
      }
    )
    
  }
}