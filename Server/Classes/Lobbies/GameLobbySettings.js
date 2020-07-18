module.exports = class GameLobbySettings {
    constructor(gameMode, maxPlayers, levelData) {
        this.gameMode = 'No Gamemode Defined';
        this.maxPlayers = maxPlayers;
        this.levelData = levelData;
    }
}