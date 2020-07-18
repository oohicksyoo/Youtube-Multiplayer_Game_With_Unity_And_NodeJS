let Connection = require('./Connection')
let Player = require('./Player')
let Database = require('./Database')

//Lobbies
let LobbyBase = require('./Lobbies/LobbyBase')
let GameLobby = require('./Lobbies/GameLobby')
let GameLobbySettings = require('./Lobbies/GameLobbySettings')

//Level Data
let levelData1 = require('../Files/LevelData/Level1.json')

module.exports = class Server {
    constructor(isLocal = false) {
        let server = this;
        this.database = new Database(isLocal);
        this.connections = [];
        this.lobbys = [];

        this.generalServerID = 'General Server';
        this.startLobby = new LobbyBase();
        this.startLobby.id = this.generalServerID;
        this.lobbys[this.generalServerID] = this.startLobby;       
    }

    //Interval update every 100 miliseconds
    onUpdate() {
        let server = this;

        //Update each lobby
        for(let id in server.lobbys) {
            server.lobbys[id].onUpdate();
        }
    }

    //Handle a new connection to the server
    onConnected(socket) {
        let server = this;
        let connection = new Connection();
        connection.socket = socket;
        connection.player = new Player();
        connection.player.lobby = server.startLobby.id;
        connection.server = server;

        let player = connection.player;
        let lobbys = server.lobbys;

        console.log('Added new player to the server (' + player.id + ')');
        server.connections[player.id] = connection;

        socket.join(player.lobby);
        connection.lobby = lobbys[player.lobby];
        connection.lobby.onEnterLobby(connection);

        return connection;
    }

    onDisconnected(connection = Connection) {
        let server = this;
        let id = connection.player.id;

        delete server.connections[id];
        console.log('Player ' + connection.player.displayerPlayerInformation() + ' has disconnected');

        //Tell Other players currently in the lobby that we have disconnected from the game
        connection.socket.broadcast.to(connection.player.lobby).emit('disconnected', {
            id: id
        });

        //Preform lobby clean up
        let currentLobbyIndex = connection.player.lobby;
        server.lobbys[currentLobbyIndex].onLeaveLobby(connection);

        if (currentLobbyIndex != server.generalServerID && server.lobbys[currentLobbyIndex] != undefined && server.lobbys[currentLobbyIndex].connections.length == 0) {
            console.log('Closing down lobby (' + currentLobbyIndex + ')');
            delete server.lobbys[currentLobbyIndex];
        }
    }

    onAttemptToJoinGame(connection = Connection) {
        //Look through lobbies for a gamelobby
        //check if joinable
        //if not make a new game
        let server = this;
        let lobbyFound = false;

        let gameLobbies = [];
        for (var id in server.lobbys) {
            if (server.lobbys[id] instanceof GameLobby) {
                gameLobbies.push(server.lobbys[id]);
            }
        }
        console.log('Found (' + gameLobbies.length + ') lobbies on the server');

        gameLobbies.forEach(lobby => {
            if(!lobbyFound) {
                let canJoin = lobby.canEnterLobby(connection);

                if(canJoin) {
                    lobbyFound = true;
                    server.onSwitchLobby(connection, lobby.id);
                }
            }
        });

        //All game lobbies full or we have never created one
        if(!lobbyFound) {
            console.log('Making a new game lobby');
            let gamelobby = new GameLobby(new GameLobbySettings('FFA', 2, levelData1));
            server.lobbys[gamelobby.id] = gamelobby;
            server.onSwitchLobby(connection, gamelobby.id);
        }
    }

    onSwitchLobby(connection = Connection, lobbyID) {
        let server = this;
        let lobbys = server.lobbys;

        connection.socket.join(lobbyID); // Join the new lobby's socket channel
        connection.lobby = lobbys[lobbyID];//assign reference to the new lobby

        lobbys[connection.player.lobby].onLeaveLobby(connection);
        lobbys[lobbyID].onEnterLobby(connection);
    }
}