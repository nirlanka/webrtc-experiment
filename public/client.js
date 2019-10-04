const userid = ;

// Connection

const config = {
  iceServers: [
    { url: "stun:stun.l.google.com:19302" },
    { url: "stun:stun1.l.google.com:19302" },
  ]
};

const connection = new RTCPeerConnection(config);

connection.onicecandidate = e => e.candidate && send_candidate(e.candidate);

function send_candidate(candidate) {
  const resp = fetch('/ice', {
    method: 'POST',
    body: JSON.stringify(candidate)
  });
}