var shortID = require('shortid');
var Vector2 = require('./Vector2.js');

module.exports = class ServerObject {
    constructor() {
        this.id = shortID.generate();
        this.name = 'ServerObject';
        this.position = new Vector2();
    }
}