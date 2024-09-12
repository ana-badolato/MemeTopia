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
const resumeKills=document.querySelector(".resumeKills");
const resumeCoins=document.querySelector(".resumeCoins");
const resumeTime=document.querySelector(".resumeTime");
const loseTotalScore=document.querySelector("#loseTotalScore");
const listLoseScores = document.getElementById('listLoseScores');

// game win screen
const gameWinScreenNode = document.querySelector("#game-win-screen");
const listWinScores = document.getElementById('listWinScores');
const menuWinBtnNode = document.querySelector(".menuWinBtn");
const restartWinBtnNode = document.querySelector(".restartWinBtn");
const winResumeKills=document.querySelector(".winResumeKills");
const winResumeCoins=document.querySelector(".winResumeCoins");
const winResumeTime=document.querySelector(".winResumeTime");
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
gameMusic.volume = 0.02; 

let gameOverAudio = new Audio("./audio/sadViolinAudio.mp3");
gameOverAudio.loop = false;
gameOverAudio.volume = 0.01;

let splashMusic = new Audio('./audio/catPolka.mp3') 
splashMusic.loop = false; 
splashMusic.volume = 0.02;

let winMusic = new Audio('./audio/chipi.mp3') 
splashMusic.loop = false; 
splashMusic.volume = 0.02;

let lowLifeAudio = new Audio('./audio/lowLife.mp3') 
lowLifeAudio.loop = false; 
lowLifeAudio.volume = 0.5;

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
  console.log(playerName); 

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
    if (timeRemaining === 0) {
      
      gameWin();
    }
  }, 1000);

  enemiesArray[0].hide();

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
 
    if (playerObj.life <= 50 && !isLowLifeWarningActive) {
      isLowLifeWarningActive = true;  // Asegurarse de que no vuelva a activarse hasta que termine el parpadeo
      triggerLowLifeOverlay();
    } else if (playerObj.life > 50) {
      isLowLifeWarningActive = false; // Reiniciar cuando la vida suba nuevamente
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
  resumeKills.innerText=`${playerObj.kills}`
  resumeCoins.innerText=`${playerObj.coins}`
  resumeTime.innerText=`${duration-timeRemaining} s`
  loseTotalScore.innerText=`${getTotalScore()} points!`
  stopMusicGame();
  playerObj.audioHit.pause();
  gameOverAudio.play();
  storeScore(playerName, getTotalScore());
  showScores(listLoseScores);

  cleanGame();
}

function gameWin(){
  gameWinScreenNode.style.display = "flex";
  gameScreenNode.style.display = "none";
  winResumeKills.innerText=`${playerObj.kills}`
  winResumeCoins.innerText=`${playerObj.coins}`
  winResumeTime.innerText=`${duration-timeRemaining} s`
  winTotalScore.innerText=`${getTotalScore()} points!`
  winMusic.play();
  storeScore(playerName, getTotalScore());
  showScores(listWinScores);
  stopMusicGame();
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

// Función para controlar el parpadeo del overlay por un tiempo limitado
function triggerLowLifeOverlay() {
  let blinkCount = 0;  // Contador de parpadeos
  lowLifeOverlay.style.opacity = '1';  // Mostrar el overlay inicialmente

  // Iniciar el parpadeo controlado con setInterval
  const blinkInterval = setInterval(() => {
    // Alternar entre visible e invisible
    if (lowLifeOverlay.style.opacity === '1') {
      lowLifeOverlay.style.opacity = '0';
      lowLifeAudio.play();
    } else {
      lowLifeOverlay.style.opacity = '1';
      lowLifeAudio.play();
      //lowLifeAudio.pause();
      //lowLifeAudio.currentTime=0;
    }
    
    blinkCount++;  // Incrementar el contador de parpadeos

    // Detener el parpadeo después de 3 ciclos
    if (blinkCount >= 6) {  // 6 cambios de opacidad (3 parpadeos completos)
      clearInterval(blinkInterval);  // Detener el intervalo
      lowLifeOverlay.style.opacity = '0';  // Asegurar que se oculte al final
    }
  }, 500);  // Cambiar opacidad cada 500ms, para que el ciclo completo sea de 1 segundo
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
  checkPlayerExists()
  enemiesArray.forEach((eachEnemy)=>{  
  if(checkAnyCollision(playerObj, eachEnemy)){         
    if(!eachEnemy.type.hasAttacked){     
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

function storeScore(name, score) {
  const newScore = { name, score };

  let scores = JSON.parse(localStorage.getItem('scores')) || [];
  scores.push(newScore);
  localStorage.setItem('scores', JSON.stringify(scores));
}


function showScores(listElement) {
  // Limpiar la lista de puntuaciones anterior
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
  startGame();
});


menuBtnNode.addEventListener("click", () => {
  openMenu();
});


musicOnBtnNode.addEventListener("click", () => {
  gameMusic.play();
});

musicOffBtnNode.addEventListener("click", () => {
  gameMusic.pause();
});


menuOverBtnNode.addEventListener("click", () => {
  openMenu();
});

restartBtnNode.addEventListener("click", () => {
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
    if (event.key === "d") {
      playerObj.keys.right = true;
    } else if (event.key === "a") {
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
  if (event.key === "a") {
    playerObj.keys.left = false;
  } else if (event.key === "d") {
    playerObj.keys.right = false;
  }
}
});