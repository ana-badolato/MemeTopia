//* ELEMENTOS PRINCIPALES DEL DOM

// splash screen
const splashScreenNode = document.querySelector("#splash-screen")
const playBtnNode = document.querySelector("#playBtn");
const inputNameNode = document.querySelector("#name");

// game screen
const gameScreenNode = document.querySelector("#game-screen")
const gameBoxNode = document.querySelector("#game-box")
const menuBtnNode = document.querySelector(".menuBtn");
const musicOnBtnNode = document.querySelector("#musicOnBtn");
const musicOffBtnNode = document.querySelector("#musicOffBtn");
const playerLife = document.querySelector("#life");
const playerCoins = document.querySelector("#coins");
const playerKills = document.querySelector("#kills");
const lowLifeOverlay = document.querySelector("#lowLifeOverlay");

// game over screen
const gameOverScreenNode = document.querySelector("#game-over-screen")
const menuOverBtnNode = document.querySelector(".menuOverBtn");
const restartBtnNode = document.querySelector(".restartBtn");
const gameOverResume = document.querySelector("#gameOverResume");
const loseTotalScore=document.querySelector("#loseTotalScore");
const listLoseScores = document.getElementById('listLoseScores');

// game win screen
const gameWinScreenNode = document.querySelector("#game-win-screen");
const listWinScores = document.getElementById('listWinScores');
const menuWinBtnNode = document.querySelector(".menuWinBtn");
const restartWinBtnNode = document.querySelector(".restartWinBtn");
const gameWinResume = document.querySelector("#gameWinResume");
const winTotalScore=document.querySelector("#winTotalScore");

//* VARIABLES GLOBALES DEL JUEGO

// Intervalos
let gameIntervalId = null;
let platformsIntervalId = null;
let powerUpsIntervalId = null;
let timerIntervalId = null;
let powerUpsFreq = 5000;

//Objetos
let playerObj = null;
let platformsArray = [];
let platformsFreq = 2200;
let enemiesArray = [];
let powerUpsArray = [];
let background = null;

//Control del juego
let isGameGoing = false; 
let keysPressed = {};
let playerName=""; 
let isLowLifeWarningActive = false; 

// Audio
let gameMusic = new Audio('./audio/marbleSodaMusic.mp3') 
gameMusic.loop = true; 
gameMusic.volume = 0.01; 

let gameOverAudio = new Audio("./audio/sadViolinAudio.mp3");
gameOverAudio.loop = false;
gameOverAudio.volume = 0.01;

let splashMusic = new Audio('./audio/catPolka.mp3') 
splashMusic.loop = false; 
splashMusic.volume = 0.03;

let winMusic = new Audio('./audio/chipi.mp3') 
winMusic.loop = true; 
winMusic.volume = 0.2;

let lowLifeAudio = new Audio('./audio/lowLife.mp3') 
lowLifeAudio.loop = false; 
lowLifeAudio.volume = 0.5;

let buttonAudio = new Audio('./audio/button.mp3') 
buttonAudio.loop = false; 
buttonAudio.volume = 0.5;

splashMusic.play();

// Timer gameplay
let duration=60;
let timeRemaining = duration;
let minutes = Math.floor(timeRemaining / 60).toString().padStart(2, "0");
let seconds = (timeRemaining % 60).toString().padStart(2, "0");
let timeRemainingContainer = document.getElementById("time");
timeRemainingContainer.innerText = `${minutes}:${seconds}`;

//* FUNCIONES GLOBALES DEL JUEGO

//* Funciones del estado del juego

function startGame() {

  gameOverScreenNode.style.display = "none";
  splashScreenNode.style.display = "none";
  gameWinScreenNode.style.display = "none";
  gameScreenNode.style.display = "flex";

  isGameGoing = true;
  playerObj = new Player();
  background = new Background();
  
  playerLife.innerText = `${playerObj.life}`;
  playerCoins.innerText = `${playerObj.coins}`;
  playerKills.innerText = `${playerObj.kills}`;

  addPlatform(0, "left");

  stopMusicGameOver();
  stopMusicSplash();
  stopMusicWin();
  initMusicGame();
  musicOnBtnNode.disabled = true;

  platformsArray[0].y = 0;

  gameIntervalId = setInterval(() => {
    gameLoop();
  }, Math.round(1000/60)); 

  platformsIntervalId = setInterval(() => { 
    addPlatform();
  }, platformsFreq);

  powerUpsIntervalId = setInterval(() => { 
    addPowerUp();
  }, powerUpsFreq);

  timerIntervalId = setInterval(() => {
    timeRemaining -= 1;
    minutes = Math.floor(timeRemaining / 60)
      .toString()
      .padStart(2, "0");
    seconds = (timeRemaining % 60).toString().padStart(2, "0");
    timeRemainingContainer.innerText = `${minutes}:${seconds}`;

    if(timeRemaining <= 5 && timeRemaining>0){
      timeRemainingContainer.style.color = "#ff5733"; 
      startShaking();     
    }else if (timeRemaining === 0) {   
      gameWin();
    }
  }, 1000);
}

function gameLoop() {

    background.move(); 
    playerObj.movement();
    playerObj.gravity();
    detectCollisionPlayerPlatform();
    detectCollisionPlayerEnemy();
    detectCollisionBulletEnemy(); 
    detectCollisionEnemyPlatform();
    detectCollisionPlayerPowerUp();
    playerObj.moveBullets();

    //para cada plataforma, creamos un enemigo encima
    platformsArray.forEach((eachPlatform, index) => {
      eachPlatform.automaticMovement();    
      if (enemiesArray[index]) {
        enemiesArray[index].automaticMovement(eachPlatform.x, eachPlatform.y);
      }
    });

    powerUpsArray.forEach((eachPowerUp) => {
      eachPowerUp.automaticMovement();
    });

    checkElementsOut();
    
    //gestión overlay
    if (playerObj.life <= 50 && !isLowLifeWarningActive) {
      isLowLifeWarningActive = true; 
      triggerLowLifeOverlay();
    } else if (playerObj.life > 25) {
      isLowLifeWarningActive = false; 
    }
}

function openMenu() {    
  splashScreenNode.style.display = "flex";
  gameScreenNode.style.display = "none";
  gameOverScreenNode.style.display = "none";
  gameWinScreenNode.style.display = "none";
  splashMusic.play();
  stopMusicGameOver();
  stopMusicGame();
  stopMusicWin();
  cleanGame();
}

function gameOver() {
  gameOverScreenNode.style.display = "flex";
  gameScreenNode.style.display = "none";
  gameOverResume.innerHTML = `You fought valiantly, taking down <span>${playerObj.kills} enemies</span>, scooped up <span>${playerObj.coins} Doge Coins</span>, and held on for <span>${duration - timeRemaining} seconds</span>. <br> But alas, the memes won this round. <br> You'll meme another day!`;

  loseTotalScore.innerText=`${getTotalScore()} points!`
  stopMusicGame();
  playerObj.audioHit.pause();
  lowLifeAudio.pause();
  gameOverAudio.play();
  storeScore(playerName, getTotalScore());
  showScores(listLoseScores);
  cleanGame();
}

function gameWin(){
  gameWinScreenNode.style.display = "flex";
  gameScreenNode.style.display = "none";
  gameWinResume.innerHTML = `You took down <span>${playerObj.kills} enemies</span>, grabbed <span>${playerObj.coins} Doge Coins</span>, and survived for <span>${duration - timeRemaining} seconds</span>. <br> Meme legend in the making!`;

  winTotalScore.innerText=`${getTotalScore()} points!`
  stopMusicGame();
  playerObj.audioHit.pause();
  lowLifeAudio.pause();
  winMusic.play();
  storeScore(playerName, getTotalScore());
  showScores(listWinScores);
  cleanGame();
}

function cleanGame() {
  clearIntervals();
  gameBoxNode.innerHTML = "";
  
  platformsArray = [];
  enemiesArray = []; 
  powerUpsArray = [];
  playerObj.life = 100;
  playerObj.coins=0;
  playerObj.kills=0;
  timeRemaining=duration;
  isGameGoing = false;
  timeRemainingContainer.style.color = "#f3f3f3";
}

function restartGame() {
  cleanGame();
  startGame();
}

function clearIntervals(){
  clearInterval(gameIntervalId);
  clearInterval(platformsIntervalId);
  clearInterval(powerUpsIntervalId);
  clearInterval(timerIntervalId);
}

function getTotalScore(){
  return (playerObj.coins * 25)+(playerObj.kills * 10)+(duration-timeRemaining);
}

function getPlayerName() {
  let inputName = inputNameNode.value.trim();
  if (inputName.length === 0) {
    playerName = "Patata";
    inputNameNode.value = "Patata"; 
  } else {
    playerName = inputName;
  }
}

// overlay cuando el player tiene poca vida
function triggerLowLifeOverlay() {
  let blinkCount = 0; 
  lowLifeOverlay.style.opacity = '1';  

  const blinkInterval = setInterval(() => {
    if (lowLifeOverlay.style.opacity === '1') {
      lowLifeOverlay.style.opacity = '0';
     lowLifeAudio.play();
    } else {
      lowLifeOverlay.style.opacity = '1';
      lowLifeAudio.pause();
    }   
    blinkCount++; 
    if (blinkCount >= 6) { 
      clearInterval(blinkInterval); 
      lowLifeOverlay.style.opacity = '0';  
    }
  }, 500); 
}

// el timer se agita cuando quedan pocos segundos
function startShaking() {
  let shakeInterval = setInterval(() => {
    timeRemainingContainer.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
  }, 50);

  setTimeout(() => {
    clearInterval(shakeInterval);
    timeRemainingContainer.style.transform = 'translate(0, 0)'; 
  }, 500);
}

//* Funciones música

function initMusicGame() {
  gameMusic.play();
}

function stopMusicGame() {
  gameMusic.pause();
  gameMusic.currentTime = 0; 
}

function stopMusicGameOver() {
  gameOverAudio.pause();
  gameOverAudio.currentTime=0;
}

function stopMusicSplash() {
  splashMusic.pause();
  splashMusic.currentTime=0;
}

function stopMusicWin() {
  winMusic.pause();
  winMusic.currentTime=0;
}

//* Funciones de adición

//un sólo array, las de la dcha se posicionan de forma relativa a las de la izda
//se añaden los enemigos encima de cada una de las plataformas
function addPlatform() {
  let randomPositionX = Math.floor(Math.random() * (-150));

  let newPlatformLeft = new Platform(randomPositionX, "left");
  platformsArray.push(newPlatformLeft);
  addEnemy(newPlatformLeft, "left");

  let newPlatformRight = new Platform(randomPositionX + 400, "right"); 
  platformsArray.push(newPlatformRight);
  addEnemy(newPlatformLeft, "right");
}

function addEnemy(platform, type){
  if(type === "left"){
    let newEnemyLeft = new Enemy(platform.x, platform.y, "left", platform.w);
    enemiesArray.push(newEnemyLeft);
  }else if(type === "right"){
    let newEnemyRight = new Enemy((platform.x + platform.w - 50), platform.y, "right", platform.w);
    enemiesArray.push(newEnemyRight);
  }
}

function addPowerUp(){
  const newPowerUp = new Powerup(); 
  powerUpsArray.push(newPowerUp);
}

//* Funciones de colisión

function detectCollisionPlayerPlatform() {
  checkPlayerExists();
  let playerIsTouchingPlatform = false;
  platformsArray.forEach((eachPlatform)=>{    
    if(checkAnyCollision(playerObj, eachPlatform)){      
      playerObj.y = eachPlatform.y - playerObj.h; 
      playerObj.node.style.top = `${playerObj.y}px`; 
      playerObj.isGrounded = true;
      playerIsTouchingPlatform = true; 
    }
  });
    if (!playerIsTouchingPlatform) {
      playerObj.isGrounded = false;
    }
  }

function detectCollisionEnemyPlatform(){
  platformsArray.forEach((eachPlatform)=>{
    enemiesArray.forEach((eachEnemy)=>{
    if(checkAnyCollision(eachEnemy, eachPlatform)){      
        eachEnemy.y = eachPlatform.y - eachEnemy.h; 
        eachEnemy.node.style.top = `${eachEnemy.y}px`; 
      }
    });
  });
}

function detectCollisionPlayerEnemy(){
  checkPlayerExists();
  enemiesArray.forEach((eachEnemy)=>{  
  if(checkAnyCollision(playerObj, eachEnemy)){         
    if(!eachEnemy.isDead && !eachEnemy.type.hasAttacked){     
      playerObj.getDamage(eachEnemy);
      eachEnemy.type.hasAttacked = true;
    }    
  }
});
}

function detectCollisionPlayerPowerUp() {
  checkPlayerExists()
  powerUpsArray.forEach((eachPowerUp, index) => {
    if (checkAnyCollision(playerObj, eachPowerUp)) {
      if (!eachPowerUp.type[eachPowerUp.randomPowerUp].hasBeenTaken) {        
        eachPowerUp.getAction(); 
        eachPowerUp.type[eachPowerUp.randomPowerUp].hasBeenTaken = true;
        eachPowerUp.node.remove();  
        powerUpsArray.splice(index, 1);
      }
    }
  });
}

function detectCollisionBulletEnemy() {
  playerObj.bulletsArray.forEach((bullet, bulletIndex) => {
    enemiesArray.forEach((enemy, enemyIndex) => {
      if (bullet.checkCollisionWithEnemy(enemy)) {
        enemy.getDamage(bullet); 
        bullet.remove(); 
        playerObj.bulletsArray.splice(bulletIndex, 1); 
      }
    });
  });
}

function checkAnyCollision(objectA, ObjectB){
  if (objectA.x < ObjectB.x + ObjectB.w &&
    objectA.x + objectA.w > ObjectB.x &&
    objectA.y < ObjectB.y + ObjectB.h &&
    objectA.y + objectA.h > ObjectB.y) {
      return true;
    } else {
      return false;
    }
 }

function checkPlayerExists(){
  if (!playerObj) {
    return; 
  }
}

function checkElementsOut(){
  if (platformsArray.length > 0) {
    if((platformsArray[0].y + platformsArray[0].h - 100) >= gameBoxNode.offsetHeight){
      platformsArray[0].node.remove(); 
      platformsArray.shift(); 
      
      if (enemiesArray.length > 0) { 
        enemiesArray[0].node.remove();
        enemiesArray.shift();
      }
    } 
  }

  if (powerUpsArray.length > 0) {
    if((powerUpsArray[0].y + powerUpsArray[0].h - 100) >= gameBoxNode.offsetHeight){
      powerUpsArray[0].node.remove(); 
      powerUpsArray.shift(); 
    }
  }
}

//* funciones local Storage

//recogemos el score en forma de objeto y lo pasamos a un array  para guardarlo en el local storage
function storeScore(name, score) {
  const newScore = { name, score };

  let scores = JSON.parse(localStorage.getItem('scores')) || [];
  scores.push(newScore);
  localStorage.setItem('scores', JSON.stringify(scores));
}

//recuperamos la información guardada en el local storage y la filtramos para mostrar por pantalla las mejores puntuaciones
function showScores(listElement) {
  listElement.innerHTML = ''; 
  const scores = JSON.parse(localStorage.getItem('scores')) || [];
  scores.sort((a, b) => b.score - a.score);
  const bestScores = scores.slice(0, 5);
  bestScores.forEach(score => {
    const li = document.createElement('li');
    li.textContent = `${score.name} - ${score.score} points`;
    listElement.appendChild(li);
  });
}

//* EVENT LISTENERS

playBtnNode.addEventListener("click", () => {
  getPlayerName();
  buttonAudio.play();
  startGame();
});


menuBtnNode.addEventListener("click", () => {
  buttonAudio.play();
  openMenu();
});


musicOnBtnNode.addEventListener("click", () => {
  buttonAudio.play();
  gameMusic.play();
  musicOnBtnNode.disabled = true;
  musicOffBtnNode.disabled = false;
});

musicOffBtnNode.addEventListener("click", () => {
  buttonAudio.play();
  gameMusic.pause();
  musicOnBtnNode.disabled = false;
  musicOffBtnNode.disabled = true;
});


menuOverBtnNode.addEventListener("click", () => {
  buttonAudio.play();
  openMenu();
});

restartBtnNode.addEventListener("click", () => {
  buttonAudio.play();
  startGame();
});


menuWinBtnNode.addEventListener("click", () => {
  openMenu();
});

restartWinBtnNode.addEventListener("click", () => {
  startGame();
});

window.addEventListener("keydown", (event) => {
  if(isGameGoing){
    if (event.key === "d" || event.key === "D") {
      playerObj.keys.right = true;
    } else if (event.key === "a" || event.key === "A") {
      playerObj.keys.left = true;
    } else if (event.key === " " && playerObj.isGrounded) {
      playerObj.jump();
      playerObj.isGrounded=false;
    } else if (event.key === "ArrowUp") {
      playerObj.shoot(); 
    } 
    keysPressed[event.key] = true;
  }
})

window.addEventListener("keyup", (event) => {
  if(isGameGoing){
    keysPressed[event.key] = false;
    playerObj.resetAcceleration(); 
  if (event.key === "a" || event.key === "A") {
    playerObj.keys.left = false;
  } else if (event.key === "d" || event.key === "D") {
    playerObj.keys.right = false;
  }
}
});