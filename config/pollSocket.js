const socketIO = require('socket.io');

let ioObject = null;

module.exports.createPollServer = (server) => {
    const io=socketIO(server , {
        cors: {
          origin: "http://localhost:3000",
          credentials: true
        }
    });
    ioObject = io;
    io.sockets.on('connection' , socket => {
        console.log('connected');
        socket.on('disconnect' , () => {
            console.log('disconnected');
        })
    })   
}