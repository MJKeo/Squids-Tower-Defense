// VARIABLES
var naman_time = 1000;
var tower_index = -1;
var mouseX;
var mouseY;
var lives = 10;
var money = 300;
var started = false;
var mapMakePoints = 5;
var makingMap = false;
var curLayer;
var quantity;
var rest;
var waveIndex = 0;
var fullWaveSent = false;
var bossHealth = 500;
var minLayer = 0;
var minQuantity = 10;
var maxQuantity = 30;
var minSeparation = 100;
var maxSeparation = 1000;
var oddsForBoss = -1;
var startX;
var startY;

// DOCUMENT ELEMENTS
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var healthBar = document.getElementById("health_bar");
var hbctx = healthBar.getContext("2d");
var lives_count = document.getElementById("lives_count");
var money_count = document.getElementById("money_count");
var description = document.getElementById("description");
var tower_buttons = []
tower_buttons.push(document.getElementById("lucas_button"));
tower_buttons.push(document.getElementById("zach_button"));
tower_buttons.push(document.getElementById("mike_button"));
tower_buttons.push(document.getElementById("hunter_button"));
tower_buttons.push(document.getElementById("naman_button"));
tower_buttons.push(document.getElementById("sandeepan_button"));
tower_buttons.push(document.getElementById("jordan_button"));
var startButton = document.getElementById("start_button");
var freePlayButton = document.getElementById("free_play_button");
var sendWaveButton = document.getElementById("send_wave_button");
var towers_label = document.getElementById("towers_label");
var wave_label = document.getElementById("wave_label");
var healthLabel = document.getElementById("health_label");
var towerTypes = [];
towerTypes.push({x: -1, y: -1, radius: 10, range: 10, fireRate: -1, price: 50, counter: 0, color: "blue", name: "Lucas"});
towerTypes.push({x: -1, y: -1, radius: 10, range: 50, fireRate: 4, price: 300, counter: 0, color: "purple", name: "Zach"});
towerTypes.push({x: -1, y: -1, radius: 10, range: 70, fireRate: 10, price: 250, counter: 0, color: "orange", name: "Mike"});
towerTypes.push({x: -1, y: -1, radius: 10, range: 60, fireRate: 2, price: 500, counter: 0, color: "pink", name: "Hunter"});
towerTypes.push({x: -1, y: -1, radius: 10, range: 60, fireRate: -1, price: 300, counter: naman_time, color: "white", name: "Naman"});
towerTypes.push({x: -1, y: -1, radius: 10, angle: 0, armX: 30, armY: 0, range: 30, fireRate: 40, price: 300, counter: 0, color: "brown", name: "Sandeepan"});
towerTypes.push({x: -1, y: -1, radius: 10, range: 50, fireRate: 30, price: 100, counter: 0, color: "black", name: "Jordan"});
var descriptions = [];
descriptions.push("Lucas is pretty much as useless in this game as he is in real life");
descriptions.push("Zach asks out the balloons in the back of a Mustang, making them feel very awkward so they move slower");
descriptions.push("Mike is not very creative so he is just a basic tower");
descriptions.push("Hunter seduces the balloons with his luscious locks, then strips away all their layers");
descriptions.push("Naman may look like he's chilling at first, but he's secretly powering up to go nuts on these balloons");
descriptions.push("Sandeepan drops the people's elbow on these balloons, they don't stand a chance");
descriptions.push("Jordan approaches the balloons. They assume he's trying to rob them so they throw him their wallet and move faster to run away. You get $5 per balloon");

// OBJECTS
var towers = [];
var projectiles = [];
var objectives = [];
var path = [];
var balloons = [];
var balloonLayers = ["red", "blue", "green", "yellow", "pink", "black"];
var balloonRadii = [5, 6, 7, 8, 8, 10];
var balloonSpeed = [2, 2, 2, 4, 6, 2];
var wave = [[[0, 15, 500, 1000], [1, 10, 500, 100]]] // ORGANIZED by layer, quantity, gap, end rest
wave.push([[0, 10, 300, 1000], [1, 15, 400, 1000], [2, 10, 500, 10]]) // WAVE 2
wave.push([[0, 10, 10, 500], [1, 15, 300, 500], [2, 12, 300, 500], [1, 10, 100, 500], [3, 1, 0, 100]]) // WAVE 3
wave.push([[1, 12, 100, 500], [2, 10, 400, 500], [3, 15, 500, 0], [2, 10, 400, 100]]) // WAVE 4
wave.push([[2, 10, 30, 800], [1, 15, 200, 100], [2, 12, 30, 500], [3, 10, 300, 100]]) // WAVE 5
wave.push([[3, 20, 400, 400], [0, 50, 1, 100], [3, 12, 30, 500], [2, 10, 300, 100], [3, 20, 400, 100]]) // WAVE 6
wave.push([[2, 15, 50, 500], [3, 3, 30, 100], [3, 3, 30, 100], [2, 10, 400, 500], [3, 15, 500, 500], [4, 10, 300, 100]]) // WAVE 7
wave.push([[4, 20, 200, 500], [3, 6, 300, 500], [4, 20, 200, 500], [2, 30, 100, 100]]) // WAVE 8
wave.push([[1, 100, 100, 500], [2, 100, 200, 500], [3, 75, 400, 500], [4, 50, 200, 500]]) // WAVE 9
wave.push([[5, 1, 0, 0]]) // WAVE 10
var waveCash = [25, 50, 75, 100, 125, 150, 175, 200, 225, 1000];



// INTERVALS
var setupInterval;
var sendBalloonsInterval;
var moveBalloonsInterval;
var drawInterval;
var towerShootInterval;
var moveProjectilesInterval;
var waveInterval;

// INITIAL VALUES
tower_buttons.forEach(function(button) {
    button.classList.add('hidden');
})
lives_count.classList.add('hidden');
money_count.classList.add('hidden');
sendWaveButton.classList.add('hidden');
freePlayButton.classList.add('hidden');
ctx.font = "30px Arial";
ctx.fillText("Press Start", 180, 240);
healthBar.classList.add('hidden');
healthLabel.classList.add('hidden');

// EVENT LISTENERS
ctx.canvas.addEventListener('click', function(event) {
    mouseX = event.clientX - ctx.canvas.offsetLeft;
    mouseY = event.clientY - ctx.canvas.offsetTop;
    if (started) {
        var curTower = towerTypes[tower_index];
        
        if (curTower.name == "Sandeepan") {
            var tempTower = {x: mouseX, y: mouseY, radius: curTower.radius, range: curTower.range, fireRate: curTower.fireRate, price: curTower.price, 
                counter: 0, color: curTower.color, name: curTower.name, angle: 0, armX: mouseX, armY: mouseY}
        } else {
            var tempTower = {x: mouseX, y: mouseY, radius: curTower.radius, range: curTower.range, fireRate: curTower.fireRate, price: curTower.price, 
                counter: curTower.counter, color: curTower.color, name: curTower.name}
        }
        if (money >= towerTypes[tower_index].price) {
            for(var i = 0; i < towers.length; i++) {
                if (isCollision(tempTower.x, tempTower.y, tempTower.radius, towers[i].x, towers[i].y, towers[i].radius)) {
                    return;
                }
            }
            for(var i = 0; i < path.length; i++) {
                if (isCollision(tempTower.x, tempTower.y, tempTower.radius, path[i].x, path[i].y, path[i].radius)) {
                    return;
                }
            }
            towers.push(tempTower);
            money -= towerTypes[tower_index].price;
            money_count.innerText = "Cash: $" + money;
        }
    } else if (makingMap) {
        for(var i = 0; i < objectives.length; i++) {
            if (isCollision(mouseX, mouseY, 5, objectives[i].x, objectives[i].y, objectives[i].radius)) {
                return;
            }
        }
        objectives.push({x: mouseX, y: mouseY, radius: 5, color: "black"})
        mapMakePoints--;
        towers_label.innerText = "Create your map (points left: " + mapMakePoints + ")";
        if (mapMakePoints == 0) {
            start();
        }
        objectives.forEach(render);
    }
})

// INTERVAL FUNCTIONS
function setup() {
    ctx.clearRect(0, 0, c.width, c.height);
    path.push({x: balloons[0].x, y: balloons[0].y, radius: balloons[0].radius, color: "#E5A441"});
    balloons[0].move();
    render(balloons[0]);
    objectives.forEach(render);
    if (pathCollision(objectives[balloons[0].index].x, objectives[balloons[0].index].y, objectives[balloons[0].index].radius, 0)) {
        balloons[0].index += 1;
        if (balloons[0].index == objectives.length) {
            var leftDist = balloons[0].x;
            var rightDist = c.width - balloons[0].x;
            var topDist = balloons[0].y;
            var bottomDist = c.height - balloons[0].y;
            
            if (leftDist == Math.min(leftDist, rightDist, topDist, bottomDist)) {
                objectives.push({x: -2, y: balloons[0].y, color: "red"});
            } else if (rightDist == Math.min(leftDist, rightDist, topDist, bottomDist)) {
                objectives.push({x: 502, y: balloons[0].y, color: "red"});
            } else if (topDist == Math.min(leftDist, rightDist, topDist, bottomDist)) {
                objectives.push({x: balloons[0].x, y: -2, color: "red"});
            } else {
                objectives.push({x: balloons[0].x, y: 502, color: "white"});
            }
        }
        if (balloons[0].x > c.width || balloons[0].x < 0 || balloons[0].y > c.height || balloons[0].y < 0) {
            started = true;
            ctx.clearRect(0, 0, c.width, c.height);
            path.forEach(render);
            clearInterval(setupInterval);
            balloons = [];
            moveBalloonsInterval = setInterval(moveBalloons, 10);
            drawInterval = setInterval(draw, 10);
            towerShootInterval = setInterval(towerShoot, 20);
            moveProjectilesInterval = setInterval(moveProjectiles, 5);
            tower_buttons.forEach(function(button) {
                button.classList.remove('hidden');
            })
            lives_count.classList.remove('hidden');
            money_count.classList.remove('hidden');
            sendWaveButton.classList.remove('hidden');
            description.innerText =descriptions[0];
            towers_label.innerText = "Towers: ";
            tower_index = 0;
            wave_label.innerText = "Wave: 0/10";
        }
    }
}

function sendBalloons(layer) {
    balloons.push({x: startX, y: startY, radius: balloonRadii[layer], movementSpeed: balloonSpeed[layer], counter: 0, layer: layer, color: balloonLayers[layer],
        index: 0, seduced: false, hunterx: 0, huntery: 0, value: 10, move() {
       if (this.seduced) {
           if (this.x > this.hunterx) {
               this.x -= 1
           } else if (this.x < this.hunterx) {
               this.x += 1
           } 
       
           if (this.y > this.huntery) {
               this.y -= 1
           } else if (this.y < this.huntery) {
               this.y += 1
           } 
       } else {
           if (this.x > path[this.index].x) {
               this.x -= 1
           } else if (this.x < path[this.index].x) {
               this.x += 1
           } 
       
           if (this.y > path[this.index].y) {
               this.y -= 1
           } else if (this.y < path[this.index].y) {
               this.y += 1
           } 
       }
   }})
}

async function sendWave() {
    fullWaveSent = false;
    wave_label.innerText = "Wave: " + (waveIndex + 1) + "/10";
    sendWaveButton.classList.add('hidden');
    var curWave = wave[waveIndex];
    moveBalloonsInterval = setInterval(moveBalloons, 10);
    var i = 0;
    while (i < curWave.length) {
        var gap = curWave[i][2];
        var rest = curWave[i][3]
        quantity = curWave[i][1]
        if (waveIndex == 9) {
            healthBar.classList.remove('hidden');
            healthLabel.classList.remove('hidden');
        }
        while (quantity > 0) {
            if (!started) {return};
            quantity--;
            sendBalloons(curWave[i][0]);
            await sleep(gap);
        }
        await sleep(rest)
        i++;
    }
    waveIndex++;
    fullWaveSent = true;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = '#4D9B41';
    ctx.fillRect(0, 0, c.width, c.height);
    hbctx.clearRect(0, 0, healthBar.width, healthBar.height)
    hbctx.fillStyle = 'red'
    hbctx.fillRect(0, 0, bossHealth, healthBar.height)
    path.forEach(render);
    balloons.forEach(render);
    towers.forEach(render);
    projectiles.forEach(render);
}

function towerShoot(){
    towers.forEach(function(element) {
        element.counter += element.fireRate;
        if (element.counter >= 120 && element.name != "Naman") {
            var inRange = false;
            var target;

            if (element.name == "Sandeepan") {
                element.counter = 0;
                element.angle += 0.1;
                element.armX = element.range * Math.sin(element.angle) + element.x;
                element.armY = element.range * Math.cos(element.angle) + element.y;
                var checkX = element.x;
                var checkY = element.y;
                var incrementX = Math.sin(element.angle);
                var incrementY = Math.cos(element.angle);
                if (incrementX < 0) {
                    while (checkX > element.armX) {
                        checkX += incrementX;
                        checkY += incrementY;
                        
                        for(var i = 0; i < balloons.length; i++) {
                            if (isCollision(balloons[i].x, balloons[i].y, balloons[i].radius, checkX, checkY, 0.1)) {
                                if (balloons[i].layer != 5) {
                                    balloons[i].layer--;
                                    if (balloons[i].layer < 0) {
                                        money += balloons[i].value;
                                        money_count.innerText = "Cash: $" + money;
                                        balloons.splice(i, 1);
                                    } else {
                                        balloons[i].color = balloonLayers[balloons[i].layer];
                                        balloons[i].radius = balloonRadii[balloons[i].layer];
                                    }
                                    continue;
                                } else {
                                    bossHealth--;
                                    if (bossHealth == 0) {
                                        healthBar.classList.add('hidden');
                                        healthLabel.classList.add('hidden');
                                        win();
                                    }
                                }
                            }
                        }
                    }
                } else {
                    while (checkX < element.armX) {
                        checkX += incrementX;
                        checkY += incrementY;
                        
                        for(var i = 0; i < balloons.length; i++) {
                            if (isCollision(balloons[i].x, balloons[i].y, balloons[i].radius, checkX, checkY, 0.1)) {
                                if (balloons[i].layer != 5) {
                                    balloons[i].layer--;
                                    if (balloons[i].layer < 0) {
                                        money += balloons[i].value;
                                        money_count.innerText = "Cash: $" + money;
                                        balloons.splice(i, 1);
                                    } else {
                                        balloons[i].color = balloonLayers[balloons[i].layer];
                                        balloons[i].radius = balloonRadii[balloons[i].layer];
                                    }
                                    return;
                                } else {
                                    bossHealth--;
                                    if (bossHealth == 0) {
                                        win();
                                    }
                                }
                            }
                        }
                    }
                }

                return;
            } else if (element.name == "Jordan") {
                balloons.forEach(function(balloon) {
                    if (balloon.movementSpeed != 3 && isCollision(balloon.x, balloon.y, balloon.radius, element.x, element.y, element.range)) {
                        balloon.movementSpeed = 3;
                        money += 5;
                        money_count.innerText = "Cash: $" + money;
                    }
                })
                return;
            }

            balloons.forEach(function(item) {
                if (isCollision(element.x, element.y, element.range, item.x, item.y, item.radius) && !inRange) {
                    if (element.name == "Zach" && item.movementSpeed == 1) {
                        return;
                    } else {
                        inRange = true;
                        target = item;
                        return;
                    }
                }
            })

            if (inRange) {
                shoot(element, target);
            }
        } else if (element.counter <= 0 && Math.abs(element.counter % 10) == 0 && element.name == "Naman") {
            element.color = "orange";
            goBerserk(element);
            if (element.counter < -150) {
                element.counter = naman_time;
                element.color = "white"
            }
        } else if (element.name == "Sandeepan") { 
            element.angle += 0.1;
            element.armX = element.range * Math.sin(element.angle) + element.x;
            element.armY = element.range * Math.cos(element.angle) + element.y;
            return;
        }
    });
}

function shoot(item, target) {
    item.counter = 0;
    // MOVE THE TARGET 5 times ahead
    if (item.name == "Hunter") {
        if (target.layer != 5) {
            target.seduced = true;
            target.hunterx = item.x;
            target.huntery = item.y;
            return;
        }
    }
    var future = {x: target.x, y: target.y, radius: 5, color: "red", index: target.index, move() {
        if (this.x > path[this.index].x) {
            this.x -= 1
        } else if (this.x < path[this.index].x) {
            this.x += 1
        } 
    
        if (this.y > path[this.index].y) {
            this.y -= 1
        } else if (this.y < path[this.index].y) {
            this.y += 1
        } 
    }}
    for (var i = 0; i < 5; i++) {
        future.move();
        if (isCollision(path[future.index].x, path[future.index].y, path[future.index].radius, future.x, future.y, future.radius)) {
            future.index++;
            if (future.index == path.length) {
                break;
            }
        }
    }

    var xDistance = item.x - future.x;
    var yDistance = item.y - future.y;
    var xChange, yChange;

    if (xDistance == 0) {
        if (yDistance > 0) {
            yChange = -4;
        } else {
            yChange = 4;
        }
        xChange = 0;
    } else if (yDistance == 0) {
        if (xDistance > 0) {
            xChange = -4;
        } else {
            xChange = 4;
        }
        yChange = 0;
    } else {
        var angle = Math.atan2(xDistance, yDistance);
        xChange = -4 * Math.sin(angle);
        yChange = -4 * Math.cos(angle);
    }

    projectiles.push({x: item.x, y: item.y, radius: 4, xChange: xChange, yChange: yChange, color: "yellow", towerName: item.name});
}

function moveProjectiles() {
    for(var i = 0; i < projectiles.length; i++) {
        projectiles[i].x += projectiles[i].xChange;
        projectiles[i].y += projectiles[i].yChange;

        for(var z = 0; z < balloons.length; z++) {
            if (isCollision(projectiles[i].x, projectiles[i].y, projectiles[i].radius, balloons[z].x, balloons[z].y, balloons[z].radius)) {
                if (projectiles[i].towerName == "Zach") {
                    balloons[z].movementSpeed = 1;
                } else {
                    if (balloons[z].layer != 5) {
                        balloons[z].layer--;
                        if (balloons[z].layer < 0) {
                            money += balloons[z].value;
                            money_count.innerText = "Cash: $" + money;
                            balloons.splice(z, 1);
                        } else {
                            balloons[z].color = balloonLayers[balloons[z].layer];
                            balloons[z].radius = balloonRadii[balloons[z].layer];
                        }
                        projectiles.splice(i, 1);
                        return;
                    } else {
                        bossHealth--;
                        if (bossHealth == 0) {
                            win();
                        }
                    }
                    projectiles.splice(i, 1);
                }
                break;
            }
        }
        if (projectiles[i] != null && (projectiles[i].x > c.width || projectiles[i].y > c.height)) {
            projectiles.splice(i, 1);
        }
    }
}

function moveBalloons() {
    for(var i = 0; i < balloons.length; i++) {
        balloons[i].counter += balloons[i].movementSpeed;
        if (balloons[i].counter >=6)  {
            balloons[i].counter = 0;
            balloons[i].move();
            if (balloons[i].seduced) {
                if (isCollision(balloons[i].x, balloons[i].y, balloons[i].radius, balloons[i].hunterx, balloons[i].huntery, towerTypes[3].radius)) {
                    money += balloons[i].value;
                    balloons.splice(i, 1)
                }
            } else {
                if (pathCollision(path[balloons[i].index].x, path[balloons[i].index].y, path[balloons[i].index].radius, i)) {
                    balloons[i].index++;
                    if (balloons[i].index == path.length) {
                        if (balloons[i].layer == 5) {
                            gameOver();
                        }
                        lives -= (balloons[i].layer + 1);
                        balloons.splice(i, 1);
                        lives_count.innerText = ("Lives: " + lives);
                        if (lives == 0) {
                            gameOver();
                        }
                    }
                }
            }
        }
    }

    if (balloons.length == 0 && fullWaveSent && started) {
        fullWaveSent = false;
        clearInterval(moveBalloonsInterval);
        sendWaveButton.classList.remove('hidden');
        if (waveCash[waveIndex - 1] != null) {
            money += waveCash[waveIndex - 1];
            money_count.innerText = "Cash: $" + money;
        }
    }
}

// OTHER FUNCTIONS
function makeMap() {
    console.log(startButton.innerText)
    if (startButton.innerText == "Restart") {
        tower_index = -1;
        lives = 10;
        money = 300;
        mapMakePoints = 5;
        waveIndex = 0;
        objectives = [];
        towers = [];
        projectiles = [];
        path = [];
        bossHealth = 500;
        lives_count.innerText = ("Lives: " + lives);
        money_count.innerText = "Cash: $" + money;
    } else {
        startButton.innerText = "Restart";
    }

    startButton.classList.add('hidden')
    ctx.clearRect(0, 0, c.width, c.height);
    towers_label.innerText = "Create your map (points left: 5)";
    makingMap = true;
}

function start() {
    var leftDist = objectives[0].x;
    var rightDist = c.width - objectives[0].x;
    var topDist = objectives[0].y;
    var bottomDist = c.height - objectives[0].y;
    
    if (leftDist == Math.min(leftDist, rightDist, topDist, bottomDist)) {
        startX = -1;
        startY = objectives[0].y;
    } else if (rightDist == Math.min(leftDist, rightDist, topDist, bottomDist)) {
        startX = 501;
        startY = objectives[0].y;
    } else if (topDist == Math.min(leftDist, rightDist, topDist, bottomDist)) {
        startX = objectives[0].x;
        startY = -1;
    } else {
        startX = objectives[0].x;
        startY = 501;
    }
    balloons = [{x: startX, y: startY, radius: 5, color: "black", index: 0, move() {
        if (this.x > objectives[this.index].x) {
            this.x -= 1
        } else if (this.x < objectives[this.index].x) {
            this.x += 1
        }
    
        if (this.y > objectives[this.index].y) {
            this.y -= 1
        } else if (this.y < objectives[this.index].y) {
            this.y += 1
        } 
    }}];
    setupInterval = setInterval(setup, 1);
    towers_label.innerText = "LOADING";
}

function changeTower(index) {
    tower_buttons[tower_index].style = "color: black";
    tower_buttons[index].style = "color: red"
    tower_index = index;
    description.innerText = descriptions[index];
}

function gameOver() {
    changeTower(0);
    ctx.font = "30px Arial";
    ctx.fillStyle = 'red'
    ctx.fillText("Game Over", 180, 240);
    ctx.fillText("You made it to round " + (waveIndex + 1), 100, 270);
    started = false;
    clearInterval(sendBalloonsInterval);
    clearInterval(moveBalloonsInterval);
    clearInterval(drawInterval);
    clearInterval(towerShootInterval);
    clearInterval(moveProjectilesInterval);
    tower_buttons.forEach(function(button) {
        button.classList.add('hidden');
    })
    healthBar.classList.add('hidden');
    healthLabel.classList.add('hidden');
    lives_count.classList.add('hidden');
    money_count.classList.add('hidden');
    description.innerText = "";
    towers_label.innerText = "";
    wave_label.innerText = "";
    startButton.classList.remove('hidden');
    sendWaveButton.classList.add('hidden');
}

function win() {
    changeTower(0);
    balloons = [];
    ctx.font = "30px Arial";
    ctx.fillStyle = 'blue';
    ctx.fillRect(100, 200, 200, 100);
    ctx.fillStyle = 'white';
    ctx.fillText("Congratulations!", 180, 240);
    ctx.fillText("You win!", 190, 270);
    started = false;
    clearInterval(sendBalloonsInterval);
    clearInterval(moveBalloonsInterval);
    clearInterval(drawInterval);
    clearInterval(towerShootInterval);
    clearInterval(moveProjectilesInterval);
    tower_buttons.forEach(function(button) {
        button.classList.add('hidden');
    })
    lives_count.classList.add('hidden');
    lives_count.innerText = ("Lives: " + lives);
    money_count.classList.add('hidden');
    money_count.innerText = "Cash: $" + money;
    description.innerText = "";
    towers_label.innerText = "";
    wave_label.innerText = "";
    startButton.classList.remove('hidden');
    freePlayButton.classList.remove('hidden');
}

async function freePlay() {
    started = true;
    fullWaveSent = false;
    wave_label.innerText = "Free Play";
    setInterval(increaseDifficulty, 60000)
    moveBalloonsInterval = setInterval(moveBalloons, 10);
    drawInterval = setInterval(draw, 10);
    towerShootInterval = setInterval(towerShoot, 20);
    moveProjectilesInterval = setInterval(moveProjectiles, 5);
    tower_buttons.forEach(function(button) {
        button.classList.remove('hidden');
    })
    lives_count.classList.remove('hidden');
    money_count.classList.remove('hidden');
    sendWaveButton.classList.add('hidden');
    description.innerText =descriptions[0];
    towers_label.innerText = "Towers: ";
    tower_index = 0;
    wave_label.innerText = "Wave: 0/10";

    var i = 0;
    while (i > -1) {
        i++;
        var layer = Math.round(1 + Math.random() * (balloonLayers.length - 1));
        if (layer > 4) {
            layer = 4;
        }
        var quantity = Math.round(minQuantity + Math.random() * maxQuantity);
        var separation = Math.round(minSeparation + Math.random() * maxSeparation);

        while (quantity > 0) {
            if (!started) {return};
            quantity--;
            sendBalloons(layer);
            await sleep(separation);
        }
    }
}

function increaseDifficulty() {
    minLayer++;
    minQuantity += 5;
    maxQuantity += 5;
    minSeparation -= 10;
    maxSeparation -= 10;
    oddsForBoss++;
}

function goBerserk(item) {
    var berserkBullets = [];
    berserkBullets.push({x: item.x, y: item.y, radius: 4, xChange: 1, yChange: 0, color: "yellow", towerName: "Naman"});
    berserkBullets.push({x: item.x, y: item.y, radius: 4, xChange: -1, yChange: 0, color: "yellow", towerName: "Naman"});
    berserkBullets.push({x: item.x, y: item.y, radius: 4, xChange: 0, yChange: 1, color: "yellow", towerName: "Naman"});
    berserkBullets.push({x: item.x, y: item.y, radius: 4, xChange: 0, yChange: -1, color: "yellow", towerName: "Naman"});
    berserkBullets.push({x: item.x, y: item.y, radius: 4, xChange: Math.sqrt(0.5), yChange: Math.sqrt(0.5), color: "yellow", towerName: "Naman"});
    berserkBullets.push({x: item.x, y: item.y, radius: 4, xChange: -1 * Math.sqrt(0.5), yChange: Math.sqrt(0.5), color: "yellow", towerName: "Naman"});
    berserkBullets.push({x: item.x, y: item.y, radius: 4, xChange: -1 * Math.sqrt(0.5), yChange: -1 * Math.sqrt(0.5), color: "yellow", towerName: "Naman"});
    berserkBullets.push({x: item.x, y: item.y, radius: 4, xChange: Math.sqrt(0.5), yChange: -1 * Math.sqrt(0.5), color: "yellow", towerName: "Naman"});

    for (var i = 0; i < berserkBullets.length; i++) {
        projectiles.push(berserkBullets[i]);
    }
}

function isCollision(x1, y1, radius1, x2, y2, radius2) {
    var distance = Math.sqrt(Math.pow(Math.abs(x1 - x2), 2) + Math.pow(Math.abs(y1 - y2), 2));
    return (distance < (radius1 + radius2));
}

function pathCollision(x, y, radius, index) {
    var distance = Math.sqrt(Math.pow(Math.abs(x - balloons[index].x), 2) + Math.pow(Math.abs(y - balloons[index].y), 2))
    return (distance == 0)
}

function render(item) {
    ctx.fillStyle = item.color;
    ctx.beginPath();
    ctx.arc(item.x, item.y, item.radius, 0, 2 * Math.PI);
    ctx.fill();
    c.fillStyle = 'black';
    if (item.name == "Sandeepan") {
        ctx.beginPath();
        ctx.moveTo(item.x, item.y);
        ctx.lineTo(item.armX, item.armY);
        ctx.stroke();
    } else {
        ctx.beginPath();
        ctx.arc(item.x, item.y, item.range, 0, 2 * Math.PI);
        ctx.stroke();
    }
}
