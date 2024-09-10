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

//* VARIABLES GLOBALES DEL JUEGO


// Intervalos
let gameIntervalId = null;
let platformsIntervalId = null;

//Objetos
let playerObj = null;
let platformsArray = [];
let platformsFreq = 2200;
let enemiesArray = [];

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
  //console.log("empezamos");
  addPlatform(-50, "left");
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
    addEnemy();
  }, platformsFreq);

}

function gameLoop() {

    // Se ejecuta 60 veces por segundo en el intervalo principal

    playerObj.gravity();
    //playerObj.detectWallCollision();
    detectCollisionPlayerPlatform();
    detectCollisionPlayerEnemy();
    detectCollisionEnemyPlatform();

    platformsArray.forEach((eachPlatform, index) => {
      eachPlatform.automaticMovement();
      if (enemiesArray[index]) { // Aseguramos que el enemigo exista
        enemiesArray[index].automaticMovement(eachPlatform.y);
      }
    });

    checkPlatformOut();
    checkEnemyOut();
     // 4. Iniciar el ciclo del juego con requestAnimationFrame
}

function gameOver() {
  
cleanGame();

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

  let newPlatformRight = new Platform(randomPositionX + 400, "right"); //ajustamos la posició nde las de la derecha en función de las de la izda para evitar plataformas en ubicaciones imposibles.
  platformsArray.push(newPlatformRight);

}

function addEnemy() {
  let randomPositionX = Math.floor(Math.random() * (-75));

  // Obtener la última plataforma izquierda y derecha creada
  let platformLeft = platformsArray[platformsArray.length - 2]; // Penúltima plataforma (izquierda)
  let platformRight = platformsArray[platformsArray.length - 1]; // Última plataforma (derecha)

  // Aseguramos que las plataformas tengan un ancho definido antes de crear el enemigo
  if (platformLeft && platformRight) {

    let newEnemyLeft = new Enemy(randomPositionX, platformLeft.y, "left", platformLeft.w);
    enemiesArray.push(newEnemyLeft);

    let newEnemyRight = new Enemy(randomPositionX + 2500, platformRight.y, "right", platformRight.w);
    enemiesArray.push(newEnemyRight);

  } else {
    console.error("No se pueden crear enemigos porque las plataformas no están definidas.");
  }
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
      //console.log("suelo2", playerObj.isGrounded);
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

  //let playerIsTouchingEnemy = false;
  enemiesArray.forEach((eachEnemy)=>{
  
  if(playerObj.x < eachEnemy.x + eachEnemy.w &&
    playerObj.x + playerObj.w > eachEnemy.x &&
    playerObj.y < eachEnemy.y + eachEnemy.h &&
    playerObj.y + playerObj.h > eachEnemy.y){      
      
    //playerIsTouchingEnemy = true;
    //playerObj.getDamage(eachEnemy);
    
    if(!eachEnemy.type.hasAttacked){
      
  
      playerObj.getDamage(eachEnemy);
      eachEnemy.type.hasAttacked = true;
      //console.log("touching enemy", playerObj.life, playerLife.innerText);
    }
    

  }

});
}


//* Funciones para limpiar el programa

function cleanGame() {
  // 1. Limpiar los intervalos
  clearInterval(gameIntervalId);
  clearInterval(platformsIntervalId);

  // 2. Eliminar los elementos del DOM (jugador, plataformas)
  gameBoxNode.innerHTML = "";

  // 3. Reiniciar las variables globales
  playerObj = null;
  platformsArray = [];
  enemiesArray = []; 

  // 4. Detener cualquier música que esté sonando
  stopMusicGame();
  stopMusicGameOver();
  stopMusicSplash();

  // 5. Reiniciar el estado del juego
  isGameGoing = false;
}

function checkPlatformOut(){
  if (platformsArray.length === 0){
    return;
  }

  if((platformsArray[0].y + platformsArray[0].h) >= gameBoxNode.offsetHeight){
    platformsArray[0].node.remove();// 1. sacar del DOM
    platformsArray.shift();// 2. Sacar de JS
  }
}

function checkEnemyOut(){
  if (enemiesArray.length === 0){
    return;
  }

  if((enemiesArray[0].y + enemiesArray[0].h) >= gameBoxNode.offsetHeight){
    enemiesArray[0].node.remove();// 1. sacar del DOM
    enemiesArray.shift();// 2. Sacar de JS
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