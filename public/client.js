const ice_servers = [
  {
    url: "stun:stun.l.google.com:19302"
  },
];

const peer_connection = new RTCPeerConnection(ice_servers);
const channel = peer_connection.createDataChannel('meta');

channel.onmessage = event => console.log('>> received', event.data);

channel.onopen = event => console.log('>> channel open');

channel.onclose = event => console.log('>> channel close');
