const config = {
  iceServers: [
    {
      url: "stun:stun.l.google.com:19302"
    },
  ]
};

const local_connection = new RTCPeerConnection(config);
const remote_connection = new RTCPeerConnection(config);

local_connection.onicecandidate = e => remote_connection.addIceCandidate(e.candidate);
remote_connection.onicecandidate = e => local_connection.addIceCandidate(e.candidate);

const local_channel = local_connection.createDataChannel('messaging-channel');

let is_connected;
const local_messages = [];

local_channel.onopen = () => is_connected = true;
local_channel.onclose = () => is_connected = false;
local_channel.onmessage = e => local_messages.push(e.data);

let remote_channel;
let remote_messages = [];

remote_connection.ondatachannel = e => {
  remote_channel = e.channel;
  
  remote_channel.onmessage = e => remote_messages.push(e.data);
  remote_channel.onclose = () => is_connected = false;
}

function onclick_send_message() {
  local_channel.send('Lorem ipsum dolor sit amet.');
}