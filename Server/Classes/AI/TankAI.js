let AIBase = require('../AI/AIBase')
let Vector2 = require('../Vector2')

module.exports = class TankAI extends AIBase {
    constructor() {
        super();
        this.username = "AI_Tank";

        this.target;
        this.hasTarget = false;

        //Tank Stats
        this.rotation = 0;

        //Shooting
        this.canShoot = false;
        this.currentTime = Number(0);
        this.reloadTime = Number(3);
    }

    onUpdate(onUpdateAI, onFireBullet) {
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

        //Calculate Distance
        let distance = ai.position.Distance(targetPosition);

        //Calculate barrel rotation
        let rotation = Math.atan2(direction.y, direction.x) * ai.radiansToDegrees();

        if (isNaN(rotation)) {
            return;
        }

        //Movement
        let angleAmount = ai.getAngleDifference(ai.rotation, rotation); //Direction we need the angle to rotate
        let angleStep = angleAmount * ai.rotationSpeed; //Dont just snap but rotate towards
        ai.rotation = ai.rotation + angleStep; //Apple the angle step
        let forwardDirection = ai.getForwardDirection();

        //Shooting
        if (ai.canShoot) {
            onFireBullet({
                activator: ai.id,
                position: ai.position.JSONData(),
                direction: direction.JSONData()
            });
            ai.canShoot = false;
            ai.currentTime = Number(0);
        } else {
            ai.currentTime = Number(ai.currentTime) + Number(0.1);
            if (ai.currentTime >= ai.reloadTime) {
                ai.canShoot = true;
            }
        }

        //Apply position from forward direction
        if (Math.abs(angleAmount) < 10) {
            if (distance > 3.5) {
                ai.position.x = ai.position.x + forwardDirection.x * ai.speed;
                ai.position.y = ai.position.y + forwardDirection.y * ai.speed;
            } else if (distance <= 2.5) {
                ai.position.x = ai.position.x - forwardDirection.x * ai.speed;
                ai.position.y = ai.position.y - forwardDirection.y * ai.speed;
            }
        }

        //console.log(ai.id + ': bar(' + rotation + ') tank(' + ai.rotation + ')');

        onUpdateAI({
            id: ai.id,
            position: ai.position.JSONData(),
            tankRotation: ai.rotation,
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

    getForwardDirection() {
        let ai = this;

        let radiansRotation = (ai.rotation + 90) * ai.degreesToRadians(); //We need the 90 degree art offset to get the correct vector
        let sin = Math.sin(radiansRotation);
        let cos = Math.cos(radiansRotation);

        let worldUpVector = ai.worldUpVector();
        let tx = worldUpVector.x;
        let ty = worldUpVector.y;

        return new Vector2((cos * tx) - (sin * ty), (sin * tx) + (cos * ty));
    }
}