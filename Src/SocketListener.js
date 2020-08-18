import io from 'socket.io-client';

const Socket = io('http://138.68.81.244:3080')
//const Socket = io('http://181.54.182.7:3080')

export default Socket;