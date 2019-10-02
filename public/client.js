const ice_servers = [
  {
    url: 'stun:stun.l.google.com:19302',
  },
]

const peer_connection = new RTCPeerConnection(ice_servers);
