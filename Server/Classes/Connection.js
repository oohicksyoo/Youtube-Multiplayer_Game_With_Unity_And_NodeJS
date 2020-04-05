module.exports = class Connection {
    constructor() {
        this.socket;
        this.player;
        this.server;
        this.lobby;
    }

    //Handles all our io events and where we should route them too to be handled
    createEvents() {
        let connection = this;
        let socket = connection.socket;
        let server = connection.server;
        let player = connection.player;

        socket.on('disconnect', function() {
            server.onDisconnected(connection);
        });

        socket.on('createAccount', function(data) {
            server.database.CreateAccount(data.username, data.password, results => {
                //Results will return a true or false based on if the account already exists or not
                console.log(results.valid + ': ' + results.reason);
            });
        });

        socket.on('signIn', function(data) {
            server.database.SignIn(data.username, data.password, results => {
                //Results will return a true or false based on if the account already exists or not
                console.log(results.valid + ': ' + results.reason);
                if (results.valid) {
                    //Store the username in the player object
                    socket.emit('signIn');
                }
            });
        });

        socket.on('joinGame', function() {
            server.onAttemptToJoinGame(connection);
        });

        socket.on('fireBullet', function(data) {
            connection.lobby.onFireBullet(connection, data);
        });

        socket.on('collisionDestroy', function(data) {
            connection.lobby.onCollisionDestroy(connection, data);
        });

        socket.on('updatePosition', function(data) {
            player.position.x = data.position.x;
            player.position.y = data.position.y;

            socket.broadcast.to(connection.lobby.id).emit('updatePosition', player);
        });

        socket.on('updateRotation', function(data) {
            player.tankRotation = data.tankRotation;
            player.barrelRotation = data.barrelRotation;

            socket.broadcast.to(connection.lobby.id).emit('updateRotation', player);
        });
    }
}