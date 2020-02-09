let Connection = require('../Connection')
let ServerItem = require('../Utility/ServerItem')
let Vector2 = require('../Vector2')
let AIBase = require('../AI/AIBase')

module.exports = class LobbyBase {
    constructor(id) {
        this.id = id;
        this.connections = [];
        this.serverItems = [];
    }

    onUpdate() {       
        let lobby = this;        
    }

    onEnterLobby(connection = Connection) {
        let lobby = this;
        let player = connection.player;

        console.log('Player ' + player.displayerPlayerInformation() + ' has entered the lobby (' + lobby.id + ')');

        lobby.connections.push(connection);

        player.lobby = lobby.id;
        connection.lobby = lobby;
    }

    onLeaveLobby(connection = Connection) {
        let lobby = this;
        let player = connection.player;

        console.log('Player ' + player.displayerPlayerInformation() + ' has left the lobby (' + lobby.id + ')');

        connection.lobby = undefined;

        let index = lobby.connections.indexOf(connection);
        if(index > -1) {
            lobby.connections.splice(index, 1);
        }
    }

    onServerSpawn(item = ServerItem, location = Vector2) {
        let lobby = this;
        let serverItems = lobby.serverItems;
        let connections = lobby.connections;

        //Set Position
        item.position = location;
        //Set item into the array
        serverItems.push(item);
        //Tell everyone in the room
        connections.forEach(connection => {
            connection.socket.emit('serverSpawn', {
                id: item.id,
                name: item.username,
                position: item.position.JSONData()
            });
        });
    }

    onServerUnspawn(item = ServerItem) {
        let lobby = this;
        let connections = lobby.connections;

        //Remove item from array
        lobby.deleteServerItem(item);
        //Tell everyone in the room
        connections.forEach(connection => {
            connection.socket.emit('serverUnspawn', {
                id: item.id
            });
        });
    }

    deleteServerItem(item = ServerItem) {
        let lobby = this;
        let serverItems = lobby.serverItems;
        let index = serverItems.indexOf(item);

        //Remove our item out the array
        if (index > -1) {
            serverItems.splice(index, 1);
        }
    }
}