// Login

const userid = window.location.hash;

// Connection

const config = {
  iceServers: [
    { url: "stun:stun.l.google.com:19302" },
    { url: "stun:stun1.l.google.com:19302" },
  ]
};

const connection = new RTCPeerConnection(config);

connection.onicecandidate = async e => {
  if (e.candidate) {
    e.candidate.userid = userid;
    
    await fetch('/ice', {
      method: 'POST',
      body: JSON.stringify(e.candidate)
    });
    
    console.log('Sent ICE candidate.')
  }
}

