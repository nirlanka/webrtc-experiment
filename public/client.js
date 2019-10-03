// Connections

const config = {
  iceServers: [
    {
      url: "stun:stun.l.google.com:19302"
    },
    {
      url: "stun:stun1.l.google.com:19302"
    },
  ]
};

const local_connection = new RTCPeerConnection(config);
const remote_connection = new RTCPeerConnection(config);

// Local channel

const local_channel = local_connection.createDataChannel('messaging-channel');

let is_connected;

local_channel.onopen = () => {
  if (local_channel.readyState === 'open') {
    is_connected = true;
    console.log('is_connected', is_connected);
  }
}
local_channel.onclose = () => {
  is_connected = false;
  console.log('is_connected', is_connected);
}
local_channel.onmessage = e => console.log('local_messages <-', e.data);

// Remote channel

let remote_channel;

remote_connection.ondatachannel = e => {
  remote_channel = e.channel;
  
  remote_channel.onclose = () => {
    is_connected = false;
    console.log('is_connected', is_connected);
  }
  remote_channel.onmessage = e => console.log('remote_messages <-', e.data);
}

remote_connection.onicecandidate = e => e.candidate && local_connection.addIceCandidate(e.candidate);
local_connection.onicecandidate = e => e.candidate && remote_connection.addIceCandidate(e.candidate);

let id;

local_connection.onnegotiationneeded = async () => {
  // Local offer

  const local_offer = await local_connection.createOffer();
  await local_connection.setLocalDescription(local_offer);
  await remote_connection.setRemoteDescription(local_offer);
  
  // Remote answer

  const local_answer = await remote_connection.createAnswer();
  await remote_connection.setLocalDescription(local_answer);
  await local_connection.setRemoteDescription(local_answer);
  
  const peer_register_resp = await fetch('/add', { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(local_offer) 
  });
  id = (await peer_register_resp.json()).id;
  
  let is_in_interval = false;
  
  const timer = setInterval(async () => {
    if (is_in_interval) {
      return;
    } else {
      is_in_interval = true;
    }
    
    const peers_list_resp = await fetch('/list');
    const peers = await peers_list_resp.json();
    const remote_offer = peers.find(p => p.id !== id);
  
    if (remote_offer) {
      clearInterval(timer);
      
      console.log('found peer');
      
      await fetch('/drop', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json;charset=utf-8' },
        body: JSON.stringify(remote_offer) 
      });
    }
    
    is_in_interval = false;
  }, 2000);
}

// UI

function onclick_send_message() {
  local_channel.send('Lorem ipsum dolor sit amet.');
}
