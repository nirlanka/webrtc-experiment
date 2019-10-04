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

// Incoming channel

let receive_channel;

connection.ondatachannel = e => {
  receive_channel = e.channel;
  
  receive_channel.onmessage = e => console.log(e.data);
  
  receive_channel.onopen = e => console.log('readyState', receive_channel.readyState);
}

// Outgoing channel

const send_channel = connection.createDataChannel('channel-1');

send_channel.onmessage = e => console.log(other_userid, 'sent', e.data);

send_channel.onopen = e => console.log('readyState', send_channel.readyState);

// Call other

(async )
                                          
// Temp
                                          
var other_userid;