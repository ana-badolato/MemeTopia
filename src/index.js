//* ELEMENTOS PRINCIPALES DEL DOM

// pantallas
const splashScreenNode = document.querySelector("#splash-screen")
const gameScreenNode = document.querySelector("#game-screen")
const gameOverScreenNode = document.querySelector("#game-over-screen")

// game box
const gameBoxNode = document.querySelector("#game-box")

// botones

// btn inicio
const playBtnNode = document.querySelector("#playBtn");

//btn game
const menuBtnNode = document.querySelector(".menuBtn");
const musicOnBtnNode = document.querySelector("#musicOnBtn");
const musicOffBtnNode = document.querySelector("#musicOffBtn");

//btn game over
const menuOverBtnNode = document.querySelector(".menuOverBtn");
const restartBtnNode = document.querySelector(".restartBtn");

const playerLife = document.querySelector("#life");
const playerCoins = document.querySelector("#coins");
const playerKills = document.querySelector("#kills");

//* VARIABLES GLOBALES DEL JUEGO


// Intervalos
let gameIntervalId = null;
let platformsIntervalId = null;
let powerUpsIntervalId = null;
//Objetos
let playerObj = null;
let platformsArray = [];
let platformsFreq = 2200;
let enemiesArray = [];
let powerUpsArray = [];
let powerUpsFreq = 5000;

//Control del juego
let isGameGoing = false; // para controlar el estado de ciertos elementos dentro del juego


// Audio
let gameMusic = new Audio('./audio/goMiau.mp3') // cargamos la música
gameMusic.loop = true; // la música dentro del juego se repite
gameMusic.volume = 0.2; // ajustamos el volumen
let gameOverAudio = new Audio("./audio/sadViolinAudio.mp3");
gameOverAudio.loop = false;
gameOverAudio.volume = 0.1;
let splashMusic = new Audio('./audio/catPolka.mp3') // cargamos la música
splashMusic.loop = true; 
splashMusic.volume = 0.1; // ajustamos el volumen
splashMusic.play();


//* FUNCIONES GLOBALES DEL JUEGO

//* Funciones del estado del juego
function startGame() {
  
  // 1. Cambiar las pantallas
  gameOverScreenNode.style.display = "none";
  splashScreenNode.style.display = "none";
  gameScreenNode.style.display = "flex";

  // 2. Añadir todos los elementos iniciales del juego
  isGameGoing = true;
  playerObj = new Player();
  //playerObj.resetAcceleration();
  playerLife.innerText = `${playerObj.life}`;
  playerCoins.innerText = `${playerObj.coins}`;
  playerCoins.innerText = `${playerObj.kills}`;
  addPlatform(0, "left");
  stopMusicGameOver();
  stopMusicSplash();
  initMusicGame();
  platformsArray[0].y = 0;
  // 3. Iniciar el intervalo de juego
  gameIntervalId = setInterval(() => {
    gameLoop();
  }, Math.round(1000/60)); // Para que el juego se ejecute a 60 fps


  // 4. (Opcional) Iniciaremos otrs intervalos que requiera el juego
  platformsIntervalId = setInterval(() => { 
    addPlatform();
  }, platformsFreq);

  powerUpsIntervalId = setInterval(() => { 
    addPowerUp();
  }, powerUpsFreq);

}

function gameLoop() {

    // Se ejecuta 60 veces por segundo en el intervalo principal

    playerObj.gravity();
    //playerObj.detectWallCollision();
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

}

function gameOver() {
  
cleanGame();
  // Detener el game loop
  clearInterval(gameIntervalId); 
  clearInterval(platformsIntervalId);
  clearInterval(powerUpsIntervalId);
gameOverScreenNode.style.display = "flex";
gameScreenNode.style.display = "none";

gameOverAudio.play();

}

function openMenu() { 
      
  cleanGame();
  splashMusic.play();
  splashScreenNode.style.display = "flex";
  gameScreenNode.style.display = "none";
  gameOverScreenNode.style.display = "none";

}

function restartGame() {
  cleanGame();
  startGame();
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

//* Funciones spawn plataformas, enemigos...

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
    let newEnemyRight = new Enemy((platform.x + platform.w - 40), platform.y, "right", platform.w);
    enemiesArray.push(newEnemyRight);
  }
}

function addPowerUp(){
  const newPowerUp = new Powerup(); 
  powerUpsArray.push(newPowerUp);
}

//* Funciones colisiones
function detectCollisionPlayerPlatform() {
    // Verificar si playerObj está definido
    if (!playerObj) {
      return; // Si no hay playerObj, salimos de la función
    }

  let playerIsTouchingPlatform = false;
  platformsArray.forEach((eachPlatform)=>{
    
    if(playerObj.x < eachPlatform.x + eachPlatform.w &&
      playerObj.x + playerObj.w > eachPlatform.x &&
      playerObj.y < eachPlatform.y + eachPlatform.h &&
      playerObj.y + playerObj.h > eachPlatform.y){      


      playerObj.y = eachPlatform.y - playerObj.h; 
      playerObj.node.style.top = `${playerObj.y}px`; 
      playerObj.isGrounded = true;
      playerIsTouchingPlatform = true; 
    }

  });
    // Si no está tocando ninguna plataforma, cambiamos isGrounded a false
    if (!playerIsTouchingPlatform) {
      playerObj.isGrounded = false;
    }
  }

function detectCollisionEnemyPlatform(){

  platformsArray.forEach((eachPlatform)=>{
    enemiesArray.forEach((eachEnemy)=>{
    
    if(eachEnemy.x < eachPlatform.x + eachPlatform.w &&
      eachEnemy.x + eachEnemy.w > eachPlatform.x &&
      eachEnemy.y < eachPlatform.y + eachPlatform.h &&
      eachEnemy.y + eachEnemy.h > eachPlatform.y){      

        // El enemigo está sobre la plataforma
        eachEnemy.y = eachPlatform.y - eachEnemy.h; 
        eachEnemy.node.style.top = `${eachEnemy.y}px`; 
      }
    });
  });
}

function detectCollisionPlayerEnemy(){
   if (!playerObj) {
    return; 
  }

  enemiesArray.forEach((eachEnemy)=>{
  
  if(playerObj.x < eachEnemy.x + eachEnemy.w &&
    playerObj.x + playerObj.w > eachEnemy.x &&
    playerObj.y < eachEnemy.y + eachEnemy.h &&
    playerObj.y + playerObj.h > eachEnemy.y){      
      
    if(!eachEnemy.type.hasAttacked){
      
      playerObj.getDamage(eachEnemy);
      eachEnemy.type.hasAttacked = true;
    }
    
  }

});
}

function detectCollisionPlayerPowerUp() {
  if (!playerObj) {
    return; 
  }

  powerUpsArray.forEach((eachPowerUp, index) => {
    if (playerObj.x < eachPowerUp.x + eachPowerUp.w &&
        playerObj.x + playerObj.w > eachPowerUp.x &&
        playerObj.y < eachPowerUp.y + eachPowerUp.h &&
        playerObj.y + playerObj.h > eachPowerUp.y) {

      if (!eachPowerUp.type[eachPowerUp.randomPowerUp].hasBeenTaken) {
        eachPowerUp.getAction();  // Aplicar la acción del power-up
        eachPowerUp.type[eachPowerUp.randomPowerUp].hasBeenTaken = true;
        eachPowerUp.node.remove();  // Remover del DOM
        powerUpsArray.splice(index, 1);  // Remover del array el power-up correspondiente
      }
    }
  });
}

function detectCollisionBulletEnemy() {
  playerObj.bulletsArray.forEach((bullet, bulletIndex) => {
    enemiesArray.forEach((enemy, enemyIndex) => {
      if (bullet.checkCollisionWithEnemy(enemy)) {
        enemy.getDamage(bullet); // Restar vida al enemigo
        bullet.remove(); // Eliminar la bala del DOM
        playerObj.bulletsArray.splice(bulletIndex, 1); // Eliminar la bala del array
      }
    });
  });
}


//* Funciones para limpiar el programa

function cleanGame() {
  // 1. Limpiar los intervalos
  clearInterval(gameIntervalId);
  clearInterval(platformsIntervalId);
  clearInterval(powerUpsIntervalId);

  // 2. Eliminar los elementos del DOM (jugador, plataformas)
  gameBoxNode.innerHTML = "";

  // 3. Reiniciar las variables globales
  
  platformsArray = [];
  enemiesArray = []; 
  powerUpsArray = [];
  playerObj.life = 100;
  playerObj.coins=0;
  playerObj.kills=0;

  // 4. Detener cualquier música que esté sonando
  stopMusicGame();
  stopMusicGameOver();
  stopMusicSplash();

  // 5. Reiniciar el estado del juego
  isGameGoing = false;
}

function checkElementsOut(){
  // Verificar si hay plataformas
  if (platformsArray.length > 0) {
    if((platformsArray[0].y + platformsArray[0].h - 100) >= gameBoxNode.offsetHeight){
      platformsArray[0].node.remove(); // 1. sacar del DOM
      platformsArray.shift(); // 2. Sacar de JS
      
      if (enemiesArray.length > 0) { // Verificar que haya enemigos antes de eliminarlos
        enemiesArray[0].node.remove();
        enemiesArray.shift();
      }
    } 
  }

  // Verificar si hay power-ups
  if (powerUpsArray.length > 0) {
    if((powerUpsArray[0].y + powerUpsArray[0].h - 100) >= gameBoxNode.offsetHeight){
      powerUpsArray[0].node.remove(); // 1. sacar del DOM
      powerUpsArray.shift(); // 2. Sacar de JS
    }
  }
}


//* EVENT LISTENERS

playBtnNode.addEventListener("click", () => {
  startGame();
});

// botón para volver al menú desde dentro del juego
menuBtnNode.addEventListener("click", () => {
  openMenu();
});

// botones de audio dentro del juego
musicOnBtnNode.addEventListener("click", () => {
  gameMusic.play();
});

musicOffBtnNode.addEventListener("click", () => {
  gameMusic.pause();
});

// botones de la pantalla game over
menuOverBtnNode.addEventListener("click", () => {
  openMenu();
});

restartBtnNode.addEventListener("click", () => {
  startGame();
});

// movimientos del jugador
let keysPressed = {};

window.addEventListener("keydown", (event) => {
  if(isGameGoing){
    if (event.key === "d") {
      playerObj.moveRight();
    } else if (event.key === "a") {
      playerObj.moveLeft();
    } else if (event.key === " " && playerObj.isGrounded) {
      playerObj.jump();
      playerObj.isGrounded=false;
    } else if (event.key === "ArrowRight") {
      playerObj.shoot(); // Dispara hacia la derecha
    } else if (event.key === "ArrowLeft") {
      playerObj.shoot(); // Dispara hacia la izquierda
    }
    keysPressed[event.key] = true;
  }


})

// Escuchamos el keyup para resetear la posibilidad de saltar
window.addEventListener("keyup", (event) => {
  if(isGameGoing){
    keysPressed[event.key] = false;
    playerObj.resetAcceleration(); // Restablecer la velocidad cuando se suelta la tecla
  if (event.key === " ") {
    //canJump = true; // Permitimos saltar de nuevo cuando se suelta la tecla
  }
}
});