const config = {
  iceServers: [
    {
      url: "stun:stun.l.google.com:19302"
    },
  ]
};

const local_connection = new RTCPeerConnection(config);
const local_channel = local_connection.createDataChannel('messagi-channel');

const remote_connection = new RTCPeerConnection(config);
const remote_channel = remote_connection.createDataChannel('meta');

local_channel.onicecandidate = event => ;

local_channel.onmessage = event => {
  console.log('received', event.data);
  
  const data = JSON.parse(event.data);
  
  if (data.type === 'login') {
    // 
  }
}

local_channel.onopen = event => console.log('channel open');

local_channel.onclose = event => console.log('channel close');

function on_login(data) {
  if (data.is_accepted) {
    console.log('failed login');
  } else {
    // 
  }
}