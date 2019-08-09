// VARIABLES
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
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
var towers_label = document.getElementById("towers_label");
var towerTypes = []
var naman_time = 1000;
towerTypes.push({x: -1, y: -1, radius: 10, range: 10, fireRate: -1, price: 50, counter: 0, color: "blue", name: "Lucas"});
towerTypes.push({x: -1, y: -1, radius: 10, range: 50, fireRate: 4, price: 300, counter: 0, color: "purple", name: "Zach"});
towerTypes.push({x: -1, y: -1, radius: 10, range: 70, fireRate: 12, price: 250, counter: 0, color: "orange", name: "Mike"});
towerTypes.push({x: -1, y: -1, radius: 10, range: 60, fireRate: 2, price: 500, counter: 0, color: "pink", name: "Hunter"});
towerTypes.push({x: -1, y: -1, radius: 10, range: 60, fireRate: -1, price: 300, counter: naman_time, color: "white", name: "Naman"});
towerTypes.push({x: -1, y: -1, radius: 10, angle: 0, armX: 30, armY: 0, range: 30, fireRate: 120, price: 300, counter: 0, color: "brown", name: "Sandeepan"});
towerTypes.push({x: -1, y: -1, radius: 10, range: 50, fireRate: 30, price: 100, counter: 0, color: "black", name: "Jordan"});
var balloonLayers = ["red", "blue", "green"];
var descriptions = [];
descriptions.push("Lucas is pretty much as useless in this game as he is in real life");
descriptions.push("Zach asks out the balloons in the back of a Mustang, making them feel very awkward so they move slower");
descriptions.push("Mike is not very creative so he is just a basic tower");
descriptions.push("Hunter seduces the balloons with his luscious locks, then strips away all their layers");
descriptions.push("Naman may look like he's chilling at first, but he's secretly powering up to go nuts on these balloons");
descriptions.push("Sandeepan drops the people's elbow on these balloons, they don't stand a chance");
descriptions.push("Jordan approaches the balloons. They assume he's trying to rob them so they throw him their wallet and move faster to run away. You get $5 per balloon");
var tower_index = -1;
var mouseX = 0;
var mouseY = 0;
var colliding = false;
var lives = 100;
var money = 300;
var towers = [];
var projectiles = [];
var balloons = [{x: 0, y: 75, radius: 5, color: "black", index: 0, move() {
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
/*var objectives = [{x: 75, y: 75, radius: 5, color: "red"}, {x: 195, y: 80, radius: 5, color: "orange"}, {x: 250, y: 125, radius: 5, color: "yellow"}, 
{x: 360, y: 145, radius: 5, color: "green"}, {x: 240, y: 325, radius: 5, color: "blue"}, {x: 120, y: 250, radius: 5, color: "pink"}, 
{x: 120, y: 420, radius: 5, color: "purple"}, {x: 510, y: 420, radius: 5, color: "brown"}];*/
var objectives = [];
var path = [];
var started = false;
var mapMakePoints = 5;

var setupInterval;

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
                    console.log("bad");
                    return;
                }
            }
            for(var i = 0; i < path.length; i++) {
                if (isCollision(tempTower.x, tempTower.y, tempTower.radius, path[i].x, path[i].y, path[i].radius)) {
                    console.log("bad");
                    return;
                }
            }
            towers.push(tempTower);
            money -= towerTypes[tower_index].price;
            money_count.innerText = "Cash: $" + money;
        }
    } else {
        for(var i = 0; i < objectives.length; i++) {
            if (isCollision(mouseX, mouseY, 5, objectives[i].x, objectives[i].y, objectives[i].radius)) {
                console.log("bad");
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

// INITIAL
tower_buttons.forEach(function(button) {
    button.classList.add('hidden');
})
lives_count.classList.add('hidden');
money_count.classList.add('hidden');
ctx.font = "30px Arial";
ctx.fillText("Press Start", 180, 240);

function makeMap() {
    startButton.classList.add('hidden')
    ctx.clearRect(0, 0, c.width, c.height);
    towers_label.innerText = "Create your map (points left: 5)";
}

function start() {
    started = true;
    setupInterval = setInterval(setup, 1);
    towers_label.innerText = "LOADING";
}

function setup() {
    ctx.clearRect(0, 0, c.width, c.height);
    path.push({x: balloons[0].x, y: balloons[0].y, radius: balloons[0].radius, color: "#E5A441"});
    balloons[0].move();
    render(balloons[0]);
    objectives.forEach(render);
    if (pathCollision(objectives[balloons[0].index].x, objectives[balloons[0].index].y, objectives[balloons[0].index].radius)) {
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
            console.log(objectives[5].x);
        }
        if (balloons[0].x > c.width || balloons[0].x < 0 || balloons[0].y > c.height || balloons[0].y < 0) {
            ctx.clearRect(0, 0, c.width, c.height);
            path.forEach(render);
            clearInterval(setupInterval);
            balloons = [];
            var sendBalloonsInterval = setInterval(sendBalloons, 900);
            var moveBalloonsInterval = setInterval(moveBalloons, 10);
            var drawInterval = setInterval(draw, 10);
            var towerShootInterval = setInterval(towerShoot, 20);
            var moveProjectilesInterval = setInterval(moveProjectiles, 5);
            tower_buttons.forEach(function(button) {
                button.classList.remove('hidden');
            })
            lives_count.classList.remove('hidden');
            money_count.classList.remove('hidden');
            description.innerText =descriptions[0];
            tower_index = 0;
            towers_label.innerText = "Towers: ";
            sendBalloons();
        }
    }
}

function sendBalloons() {
    balloons.push({x: 0, y: 75, radius: 5, movementSpeed: 2, counter: 0, layer: 2, color: "green", index: 0, seduced: false, hunterx: 0, huntery: 0, value: 25, move() {
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

function changeTower(index) {
    tower_buttons[tower_index].style = "color: black";
    tower_buttons[index].style = "color: red"
    tower_index = index;
    description.innerText = descriptions[index];
}

function towerShoot(){
    towers.forEach(function(element) {
        element.counter += element.fireRate;
        if (element.counter >= 120 && element.name != "Naman") {
            element.counter = 0;
            var inRange = false;
            var target;

            if (element.name == "Sandeepan") {
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
                                balloons[i].layer--;
                                if (balloons[i].layer < 0) {
                                    money += balloons[i].value;
                                    money_count.innerText = "Cash: $" + money;
                                    balloons.splice(i, 1);
                                } else {
                                    balloons[i].color = balloonLayers[balloons[i].layer];
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
                                balloons[i].layer--;
                                if (balloons[i].layer < 0) {
                                    money += balloons[i].value;
                                    money_count.innerText = "Cash: $" + money;
                                    balloons.splice(i, 1);
                                } else {
                                    balloons[i].color = balloonLayers[balloons[i].layer];
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
        }
    });
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

function shoot(item, target) {
    // MOVE THE TARGET 5 times ahead
    if (item.name == "Hunter") {
        target.seduced = true;
        target.hunterx = item.x;
        target.huntery = item.y;
        return;
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
                    balloons[z].layer--;
                    if (balloons[z].layer < 0) {
                        money += balloons[z].value;
                        money_count.innerText = "Cash: $" + money;
                        balloons.splice(z, 1);
                    } else {
                        balloons[z].color = balloonLayers[balloons[z].layer];
                    }
                    projectiles.splice(i, 1);
                }
                break;
            }
        }
        if (projectiles[i].x > c.width || projectiles[i].y > c.height) {
            projectiles.splice(i, 1);
        }
    }
}

function moveBalloons() {
    for(var i = 0; i < balloons.length; i++) {
        balloons[i].counter += balloons[i].movementSpeed;
        if (balloons[i].counter >= 3)  {
            balloons[i].counter = 0;
            balloons[i].move();
            if (balloons[i].seduced) {
                if (isCollision(balloons[i].x, balloons[i].y, balloons[i].radius, balloons[i].hunterx, balloons[i].huntery, towerTypes[3].radius)) {
                    money += balloons[i].value;
                    balloons.splice(i, 1)
                }
            } else {
                if (pathCollision2(path[balloons[i].index].x, path[balloons[i].index].y, path[balloons[i].index].radius, i)) {
                    balloons[i].index++;
                    if (balloons[i].index == path.length) {
                        balloons.splice(i, 1);
                        lives--;
                        lives_count.innerText = ("Lives: " + lives);
                    }
                }
            }
        }
    }
}

function isCollision(x1, y1, radius1, x2, y2, radius2) {
    var distance = Math.sqrt(Math.pow(Math.abs(x1 - x2), 2) + Math.pow(Math.abs(y1 - y2), 2));
    return (distance < (radius1 + radius2));
}

function draw() {
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = '#4D9B41';
    ctx.fillRect(0, 0, c.width, c.height);
    path.forEach(render);
    balloons.forEach(render);
    towers.forEach(render);
    projectiles.forEach(render);
}

function pathCollision(x, y, radius) {
    var distance = Math.sqrt(Math.pow(Math.abs(x - balloons[0].x), 2) + Math.pow(Math.abs(y - balloons[0].y), 2))
    return (distance == 0)
}

function pathCollision2(x, y, radius, index) {
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
