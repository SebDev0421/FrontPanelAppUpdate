import io from 'socket.io-client';

const Socket = io('http://138.68.81.244:3080')
//const Socket = io('http://192.168.1.67:3080')

export default Socket;