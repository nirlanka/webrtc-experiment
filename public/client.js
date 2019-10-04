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

// Send offer

let peers;
let other_userid;

const offer_timer = setInterval(async () => {
  peers = await (await fetch('/peers')).json();
  
  const other = peers.find(p => p != userid);
  
  if (other) {
    clearInterval(offer_timer);
    
    other_userid = other;
    
    if (!receive_channel) {
      const offer = connection.createOffer();
      offer.userid = userid;
      
      await fetch('/offer', {
        method: 'POST',
        body: JSON.stringify(offer)
      });
      
      connection.setLocalDescription(offer);
    }
  }
}, 2000);
                                          
// Answer offer

const answer_timer = setInterval(async () => {},)