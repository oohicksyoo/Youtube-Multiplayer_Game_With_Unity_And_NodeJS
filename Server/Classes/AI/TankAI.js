let AIBase = require('../AI/AIBase')
let Vector2 = require('../Vector2')

module.exports = class TankAI extends AIBase {
    constructor() {
        super();
        this.username = "AI_Tank";

        this.target;
        this.hasTarget = false;
    }

    onUpdate(onUpdatePosition, onUpdateRotation) {
        let ai = this;

        if (!ai.hasTarget) {
            return;
        }

        let targetConnection = ai.target;
        let targetPosition = targetConnection.player.position;

        //Get normalized direction between tank and target
        let direction = new Vector2();
        direction.x = targetPosition.x - ai.position.x;
        direction.y = targetPosition.y - ai.position.y;
        direction = direction.Normalized();

        //Calculate barrel rotation
        let rotation = Math.atan2(direction.y, direction.x) * ai.radiansToDegrees();

        if (isNaN(rotation)) {
            return;
        }

        onUpdateRotation({
            id: ai.id,
            tankRotation: 0,
            barrelRotation: rotation
        });
    }

    onObtainTarget(connections) {
        let ai = this;
        let foundTarget = false;
        ai.target = undefined;

        //Find closest target to go after
        let availableTargets = connections.filter(connection => {
            let player = connection.player;
            return ai.position.Distance(player.position) < 10;
        });

        //Sort through to find the closest opponent; Perhaps in the future you can expand for lowest health
        availableTargets.sort((a, b) => {
            let aDistance = ai.position.Distance(a.player.position);
            let bDistance = ai.position.Distance(b.player.position);
            return (aDistance < bDistance) ? -1 : 1;
        });

        if (availableTargets.length > 0) {
            foundTarget = true;
            ai.target = availableTargets[0];
        }

        ai.hasTarget = foundTarget;
    }
}