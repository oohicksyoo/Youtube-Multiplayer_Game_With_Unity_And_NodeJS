let io = require('socket.io')(process.env.PORT || 52300);
let Server = require('./Classes/Server')

console.log('Server has started');

if (process.env.PORT == undefined) {
    console.log('Local Server');
} else {
    console.log('Hosted Server');
}

let server = new Server(process.env.PORT == undefined);

setInterval(() => {
    server.onUpdate();
}, 100, 0);

io.on('connection', function(socket) {
    let connection = server.onConnected(socket);
    connection.createEvents();
    connection.socket.emit('register', {'id': connection.player.id});
});