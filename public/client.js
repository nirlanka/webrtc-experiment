// Login

const userid = window.location.hash.substring(1);

fetch('/peer', {
  method: 'POST',
  body: JSON.stringify({ userid }),
  headers: { 'Content-Type': 'application/json' },
  cache: 'no-cache',
});

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
      body: JSON.stringify(e.candidate),
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-cache',
    });
    
    console.log('Sent ICE candidate.')
  }
}

// Incoming channel

let receive_channel;

connection.ondatachannel = e => {
  receive_channel = e.channel;
  
  receive_channel.onmessage = e => {
    console.log(other_userid, 'sent', e.data);
    
    // Send message (2)
    send_pong();
  }
  
  receive_channel.onopen = e => console.log('readyState', receive_channel.readyState);
}

// Outgoing channel

const send_channel = connection.createDataChannel('channel-1');

send_channel.onmessage = e => console.log('Sent', e.data, 'to', other_userid);

send_channel.onopen = e => console.log('readyState', send_channel.readyState);

// Send offer

let other_userid;

const offer_timer = setInterval(async () => {
  const peers = await (await fetch('/peers')).json();
  
  other_userid = peers.find(p => p !== userid);
  
  if (other_userid) {
    clearInterval(offer_timer);
    
    await fetch('/peers/pop?userid=' + other_userid);
  }

  if (!receive_channel) {
    clearInterval(offer_timer);

    const offer = JSON.parse(JSON.stringify(await connection.createOffer()));
    offer.userid = userid;

    await fetch('/offer', {
      method: 'POST',
      body: JSON.stringify(offer),
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-cache',
    });
    
    connection.setLocalDescription(offer);
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
      const answer = JSON.parse(JSON.stringify(await connection.createAnswer()));
      answer.userid = userid;
      
      await fetch('/answer', {
        method: 'POST',
        body: JSON.stringify(answer),
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-cache',
      });
      
      connection.setLocalDescription(answer);
      connection.setRemoteDescription(other_offer);
      
      watch_candidates();
    }
  }
}, 2000);

// Handle answer

const answer_handler_timer = setInterval(async () => {
  const answers = await (await fetch('/answers')).json();
  const other_answer = answers.find(x => x.userid !== userid);
  
  if (other_answer) {
    clearInterval(answer_handler_timer);
    
    await fetch('/answers/pop?userid=' + other_answer.userid);
    
    if (!receive_channel) {
      connection.setRemoteDescription(other_answer);
      
      // Send message (1)
      send_ping();
    }
  }
}, 2000);

// Send message

function send_ping() {
  send_channel.send('ping');
}

// Handle message

function send_pong() {
  send_channel.send('pong');
}

// Watch candidates

function watch_candidates() {
  const watch_candidates_timer = setInterval(async () => {
    const candidates = await (await fetch('/ice?userid=' + other_userid)).json();
    
    candidates.forEach(c => connection.addIceCandidate(c));
  }, 4000);
}