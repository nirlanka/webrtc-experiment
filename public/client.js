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

local_connection.onicecandidate = e => e.candidate && remote_connection.addIceCandidate(e.candidate);
remote_connection.onicecandidate = e => e.candidate && local_connection.addIceCandidate(e.candidate);

// Local channel

const local_channel = local_connection.createDataChannel('messaging-channel');

let is_connected;
const local_messages = [];

local_channel.onopen = () => {
  is_connected = true;
  console.log('is_connected', is_connected);
}
local_channel.onclose = () => {
  is_connected = false;
  console.log('is_connected', is_connected);
}
local_channel.onmessage = e => {
  local_messages.push(e.data);
  console.log('local_messages <-', e.data);
}

// Remote channel

let remote_channel;
let remote_messages = [];

remote_connection.ondatachannel = e => {
  remote_channel = e.channel;
  
  remote_channel.onclose = () => {
    is_connected = false;
    console.log('is_connected', is_connected);
  }
  remote_channel.onmessage = e => {
    remote_messages.push(e.data);
    console.log('remote_messages <-', e.data);
  }
}

let id;

(async () => {
  // Local offer

  const local_offer = await local_connection.createOffer();
  await local_connection.setLocalDescription(local_offer);
  // --> Generates ICE candidates (?)
  
  // Remote offer
  
  const peers_state_response = await fetch('/rtc/peers/list', { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(local_offer) 
  });
  const peers_state = await peers_state_response.json();
  id = peers_state.id;
  const remote_offer = peers_state.peers.find(p => p.id !== id);
  
  if (remote_offer) {
    await local_connection.setRemoteDescription(remote_offer);
  }
  
  // await remote_connection.setRemoteDescription(local_offer);

  // Remote answer

  // const remote_answer = await remote_connection.createAnswer();
  // await local_connection.setRemoteDescription(remote_answer);
  // await remote_connection.setLocalDescription(remote_answer);
})();

// UI

function onclick_send_message() {
  local_channel.send('Lorem ipsum dolor sit amet.');
}