const ice_servers = [
  {
    url: "stun:stun.l.google.com:19302"
  },
];

const peer_connection = new RTCPeerConnection(ice_servers);
const channel = peer_connection.createDataChannel('meta');

channel.onmessage = event => {
  console.log('received', event.data);
  
  const data = JSON.parse(event.data);
  
  switch (data.type) {
    case 'login':
      on_login(data);
      break;
    case 'offer':
      //
      break;
    case 'reply':
      //
      break;
    case 'candidate':
      //
      break;
  }
}

channel.onopen = event => console.log('channel open');

channel.onclose = event => console.log('channel close');

function on_login(data) {
  if (data.is_accepted) {
    console.log('failed login');
  } else {
    // 
  }
}