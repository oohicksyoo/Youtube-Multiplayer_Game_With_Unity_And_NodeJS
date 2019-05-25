var io = require('socket.io')(process.env.PORT || 52300);

//Custom Classes
var Player = require('./Classes/Player.js');
var Bullet = require('./Classes/Bullet.js');

console.log('Server has started');

var players = [];
var sockets = [];
var bullets = [];

//Updates
setInterval(() => {
    bullets.forEach(bullet => {
        var isDestroyed = bullet.onUpdate();

        //Remove Bullet
        if(isDestroyed) {
            despawnBullet(bullet);
        } else {
            var returnData = {
                id: bullet.id,
                position: {
                    x: bullet.position.x,
                    y: bullet.position.y
                }
            }

            for(var playerID in players) {
                sockets[playerID].emit('updatePosition', returnData);
            }
        }
    });

    //Handle Dead players
    for(var playerID in players) {
        let player = players[playerID];

        if(player.isDead) {
            let isRespawn = player.respawnCounter();
            if(isRespawn) {
                let returnData = {
                    id: player.id,                
                    position: {
                        x: player.position.x,
                        y: player.position.y
                    }
                }
                sockets[playerID].emit('playerRespawn', returnData);
                sockets[playerID].broadcast.emit('playerRespawn', returnData);
            }
        }
    }
}, 100, 0);

function despawnBullet(bullet = Bullet) {
    console.log('Destroying bullet (' + bullet.id + ')');
    var index = bullets.indexOf(bullet);
    if(index > -1) {
        bullets.splice(index, 1);

        var returnData = {
            id: bullet.id
        }

        //Send remove bullet command to players
        for(var playerID in players) {
            sockets[playerID].emit('serverUnspawn', returnData);
        }
    }
}

io.on('connection', function(socket) {
    console.log('Connection Made!');

    var player = new Player();
    var thisPlayerID = player.id;

    players[thisPlayerID] = player;
    sockets[thisPlayerID] = socket;

    //Tell the client that this is our id for the server
    socket.emit('register', {id: thisPlayerID});
    socket.emit('spawn', player); //Tell myself I have spawned
    socket.broadcast.emit('spawn', player); //Tell others I have spawned

    //Tell myself about everyone else in the game
    for(var playerID in players) {
        if(playerID != thisPlayerID) {
            socket.emit('spawn', players[playerID]);
        }
    }

    //Positional Data from Client
    socket.on('updatePosition', function(data) {
        player.position.x = data.position.x;
        player.position.y = data.position.y;

        socket.broadcast.emit('updatePosition', player);
    });

    //Rotation Data from Client
    socket.on('updateRotation', function(data) {
        player.tankRotation = data.tankRotation;
        player.barrelRotation = data.barrelRotation;

        socket.broadcast.emit('updateRotation', player);
    });
    
    //Handle Firing off the bullet
    socket.on('fireBullet', function(data) {
        var bullet = new Bullet();
        bullet.name = 'Bullet';    
        bullet.activator = data.activator;    
        bullet.position.x = data.position.x;
        bullet.position.y = data.position.y;
        bullet.direction.x = data.direction.x;
        bullet.direction.y = data.direction.y;

        bullets.push(bullet);

        var returnData = {
            name: bullet.name,
            id: bullet.id,
            activator: bullet.activator,
            position: {
                x: bullet.position.x,
                y: bullet.position.y
            },
            direction: {
                x: bullet.direction.x,
                y: bullet.direction.y
            }
        }

        socket.emit('serverSpawn', returnData);
        socket.broadcast.emit('serverSpawn', returnData);
    });

    socket.on('collisionDestroy', function(data) {
        //console.log('Collision with bullet id: ' + data.id);
        let returnBullets = bullets.filter(bullet => {
            return bullet.id == data.id
        });
        
        //We will most likely only have one entry but just in case loop through all and set to destroyed
        returnBullets.forEach(bullet => {
            let playerHit = false;
            //Check if we hit someone that is not us
            for(var playerID in players) {
                if(bullet.activator != playerID) {
                    let player = players[playerID];
                    let distance = bullet.position.Distance(player.position);

                    if(distance < 0.65) {
                        let isDead = player.dealDamage(50); //Take half of their health for testing
                        if(isDead) {
                            console.log('Player with id: ' + player.id + ' has died');
                            let returnData = {
                                id: player.id
                            }
                            sockets[playerID].emit('playerDied', returnData);
                            sockets[playerID].broadcast.emit('playerDied', returnData);
                        } else {
                            console.log('Player with id: ' + player.id + ' has (' + player.health + ') health left');
                        }
                        despawnBullet(bullet);
                    }
                }
            }

            if(!playerHit) {
                bullet.isDestroyed = true;
            }
        });
    });

    socket.on('disconnect', function() {
        console.log('A player has disconnected');
        delete players[thisPlayerID];
        delete sockets[thisPlayerID];
        socket.broadcast.emit('disconnected', player);
    });
});

function interval(func, wait, times) {
    var interv = function(w, t){
        return function(){
            if(typeof t === "undefined" || t-- > 0){
                setTimeout(interv, w);
                try{
                    func.call(null);
                }
                catch(e){
                    t = 0;
                    throw e.toString();
                }
            }
        };
    }(wait, times);

    setTimeout(interv, wait);
}