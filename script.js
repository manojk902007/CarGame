const gameArea = document.querySelector('.gameArea');
const score = document.querySelector('.score');
const engineSound = new Audio("engine.mp3");
engineSound.loop = true;

const crashSound = new Audio("crash.mp3");

let player = {speed:5, score:0};
let keys = {ArrowUp:false, ArrowDown:false, ArrowLeft:false, ArrowRight:false};

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
document.addEventListener("keydown", function(e){
    if(e.key === "Enter" && gameOver){
        restartGame();
    }
})

function keyDown(e){
    keys[e.key] = true;

    if(!engineStarted){
        engineSound.play();
        engineStarted=true;
    }
}

function keyUp(e){
    keys[e.key] = false;
}

const lanes = [40, 150, 260];
let gameOver = false;
let engineStarted = false;

function startGame(){

    engineSound.currentTime = 0;
    engineSound.play().catch(()=>{});

    let car = document.createElement('div');
    car.setAttribute('class', 'car');
    gameArea.appendChild(car);

    for(let i=0;i<3;i++){
        let enemy = document.createElement("div");
        enemy.setAttribute("class", "enemy");
        enemy.style.top = (i * -150) + "px";
        enemy.style.left = lanes[Math.floor(Math.random()*3)] + "px";
        gameArea.appendChild(enemy);
    }

    player.x = car.offsetLeft;
    player.y = car.offsetTop;

    for(let i=0;i<5;i++){
        let roadLine = document.createElement("div");
        roadLine.setAttribute("class", "roadLine");
        roadLine.style.top = (i*120) + "px";
        gameArea.appendChild(roadLine);
    }

    window.requestAnimationFrame(playGame);
}

function moveEnemy(car){

    if(gameOver) return;

    let enemy = document.querySelectorAll(".enemy");

    enemy.forEach(function(item){

        let enemyTop = item.offsetTop;

        if(enemyTop >=500){
            enemyTop = -100;
            item.style.left = lanes[Math.floor(Math.random()*3)] + "px";
        }

        item.style.top = enemyTop + player.speed + "px";

        if(iscollide(car, item)){

            if(gameOver) return;

            gameOver = true;

            engineSound.pause();
            engineSound.currentTime = 0;

            crashSound.pause();
            crashSound.currentTime = 0;
            crashSound.play();

            engineStarted = false;
            
            document.querySelector(".gameOver").style.display="block";
            document.getElementById("finalScore").innerText="Score: " +player.score;

            return;
        }
    });
}

function iscollide(a, b){

    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();

    let margin = 5;

    return !(
        (aRect.bottom - margin < bRect.top + margin) ||
        (aRect.top + margin > bRect.bottom - margin) ||
        (aRect.right - margin < bRect.left + margin) ||
        (aRect.left + margin > bRect.right - margin)
    )
}

function moveLines(){

    let lines = document.querySelectorAll(".roadLine");

    lines.forEach(function(item){

        let lineTop = item.offsetTop;

        if(lineTop >= 500){
            lineTop = -100;
        }

        item.style.top = lineTop + player.speed + "px"
    })
}

function playGame(){

    if(gameOver) return;

    let car = document.querySelector('.car');
    moveLines();
    moveEnemy(car);

    if(keys.ArrowLeft && player.x > 0){
        player.x -= player.speed;
    }

    if(keys.ArrowRight && player.x < 300){
        player.x += player.speed;
    }

    if(keys.ArrowUp && player.y > 0){
        player.y -= player.speed;
    }

    if(keys.ArrowDown && player.y < 400){
        player.y += player.speed;
    }

    car.style.left = player.x + "px";
    car.style.top = player.y + "px";

    player.score++;
    score.innerText = "Score: " + player.score;

    window.requestAnimationFrame(playGame);
}

function restartGame(){
    location.reload();
}

startGame();