const server_connection = new WebSocket(
  'wss://' 
  + window.location.host.replace(/\:[0-9]+/, '')
  + ':4000' 
  // + window.location.pathname
);

server_connection.onmessage = msg => {
  if (!peer_connection) {
    start_stream(false);
  }
  
  const signal = JSON.parse(msg.data);
  
  if (signal.sdp) {
    peer_connection.setRemoteDescription(
      new RTCSessionDescription(signal.sdp),
      
      () => {
        if (signal.sdp.type === 'offer') {
          peer_connection.createAnswer(
            on_description,
            err => console.error('Failed to create answer. ', err)
          )
        }
      }
    );
  }
}

let local_stream;

navigator.getUserMedia(
  { video: true, audio: true, }, 
  
  stream => {
    local_stream = stream;
    
    try {
      local_video.srcObject = stream;
    } catch (error) {
      local_video.src = window.URL.createObjectURL(stream);
    }
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
    if (event.candidate) {
      server_connection.send(JSON.stringify({ ice: event.candidate }));
    }
  }
  
  peer_connection.onaddstream = event => console.log('Got ');
  
  peer_connection.addStream(local_stream);
  
  if (is_caller) {
    peer_connection.createOffer(
      on_description,
      err => console.error('Failed to create offer. ', err)
    )
  }
}

function on_description(description) {
    console.log('Got description');

    peer_connection.setLocalDescription(
      description, 
      () => server_connection.send(JSON.stringify({ sdp: description })),
      () => console.error('Failed to set description.')
    );
}