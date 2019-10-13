let ServerItem = require('../Utility/ServerItem')

module.exports = class AIBase extends ServerItem {
    constructor() {
        super();
        this.username = "AI_Base";
    }

    onUpdate(onUpdatePosition) {
        //Calculate Statemachine
    }
}