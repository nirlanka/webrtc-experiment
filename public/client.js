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

let other_userid;

const offer_timer = setInterval(async () => {
  const peers = await (await fetch('/peers')).json();
  
  other_userid = peers.find(p => p !== userid);
  
  if (other_userid) {
    clearInterval(offer_timer);
    
    await fetch('/peers/pop?userid=' + other_userid);
    
    if (!receive_channel) {
      const offer = await connection.createOffer();
      offer.userid = userid;
      
      await fetch('/offer', {
        method: 'POST',
        body: JSON.stringify(offer)
      });
      
      connection.setLocalDescription(offer);
    }
  }
}, 2000);
                                          
// Send answer

const answer_timer = setInterval(async () => {
  const offers = await (await fetch('/offers')).json();
  const other_offer = offers.find(x => x.userid !== userid);
  
  if (other_offer) {
    clearInterval(answer_timer);
    
    await fetch('/offers/pop?userid=' + other_offer.userid);
    
    if (!receive_channel) {
      const answer = await connection.createAnswer();
      answer.userid = userid;
      
      await fetch('/answer', {
        method: 'POST',
        body: JSON.stringify(answer)
      });
      
      connection.setLocalDescription(answer);
      connection.setRemoteDescription(other_offer);
    }
  }
}, 2000);

// Handle answer

const answer_