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

//* VARIABLES GLOBALES DEL JUEGO


// Intervalos
let gameIntervalId = null;
let platformsIntervalId = null;

//Objetos
let playerObj = null;
let platformsArray = [];
let platformsFreq = 3000;
let enemiesArray = [];

//Control del juego
let isGameGoing = false; // para controlar el estado de ciertos elementos dentro del juego


// Audio
let gameMusic = new Audio('./audio/marbleSodaMusic.mp3') // cargamos la música
gameMusic.loop = true; // la música dentro del juego se repite
gameMusic.volume = 0.2; // ajustamos el volumen
let gameOverAudio = new Audio("./audio/sadViolinAudio.mp3");
gameOverAudio.loop = false;
gameOverAudio.volume = 0.1;



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
  addPlatform(-50, "left");
  addEnemy(200,200, "left", 250)
  platformsArray[0].y = 50;
  stopMusicGameOver();
  initMusicGame();
  

  // 3. Iniciar el intervalo de juego
  gameIntervalId = setInterval(() => {
    gameLoop();
  }, Math.round(1000/60)); // Para que el juego se ejecute a 60 fps

  // 4. (Opcional) Iniciaremos otrs intervalos que requiera el juego
  platformsIntervalId = setInterval(() => { // Control de la aparición de plataformas
    addPlatform();
    addEnemy();
  }, platformsFreq);

}

function gameLoop() {

    // Se ejecuta 60 veces por segundo en el intervalo principal

    // Aquí indicamos todas aquellas cosas que queremos que estén en constante "supervisión"
    playerObj.gravity();
    detectCollisionPlayerPlatform()

    // Recorremos el array para indicar que se mueva cada una de las plataformas
    platformsArray.forEach((eachPlatform)=>{
      eachPlatform.automaticMovement();
    })

    enemiesArray.forEach((eachEnemy)=>{
      eachEnemy.automaticMovement();
    })
    checkPlatformOut();
}

function gameOver() {
  
// 1. Limpiar el estado del juego usando cleanGame
cleanGame();

// 2. Mostrar la pantalla de Game Over
gameOverScreenNode.style.display = "flex";
gameScreenNode.style.display = "none";

// 3. Reproducir la música de Game Over
gameOverAudio.play();
}


function openMenu() { 
      
  // 1. Limpiar el estado del juego usando cleanGame
  cleanGame();

  // 2. Mostrar la pantalla del menú
  splashScreenNode.style.display = "flex";
  gameScreenNode.style.display = "none";
  gameOverScreenNode.style.display = "none";

}

function restartGame() {
  // 1. Limpiar el estado actual del juego
  cleanGame();

  // 2. Reiniciar el juego desde cero
  startGame();
}


//* Funciones música

function initMusicGame() {
  gameMusic.play();
}

function stopMusicGame() {
  gameMusic.pause();
  gameMusic.currentTime = 0; // Reiniciar la música si vuelves a reproducirla
}

function stopMusicGameOver() {
  gameOverAudio.pause();
  gameOverAudio.currentTime=0;
}

//* Funciones spawn plataformas, enemigos...

function addPlatform() {
  let randomPositionX = Math.floor(Math.random() * (-75));

  let newPlatformLeft = new Platform(randomPositionX, "left");
  platformsArray.push(newPlatformLeft);

  let newPlatformRight = new Platform(randomPositionX + 500, "right"); //ajustamos la posició nde las de la derecha en función de las de la izda para evitar plataformas en ubicaciones imposibles.
  platformsArray.push(newPlatformRight);

}

function addEnemy() {
  console.log("añado enemigo");
  let randomPositionX = Math.floor(Math.random() * (-75));

  // Obtener la última plataforma izquierda y derecha creada
  let platformLeft = platformsArray[platformsArray.length - 2]; // Penúltima plataforma (izquierda)
  let platformRight = platformsArray[platformsArray.length - 1]; // Última plataforma (derecha)

  // Asegúrate de que las plataformas tengan un ancho definido antes de crear el enemigo
  if (platformLeft && platformRight) {
    // Crear el enemigo en la plataforma izquierda y pasarle su ancho
    let newEnemyLeft = new Enemy(randomPositionX, platformLeft.y, "left", platformLeft.w);
    enemiesArray.push(newEnemyLeft);

    // Crear el enemigo en la plataforma derecha y pasarle su ancho
    let newEnemyRight = new Enemy(randomPositionX + 500, platformRight.y, "right", platformRight.w);
    enemiesArray.push(newEnemyRight);

  } else {
    console.error("No se pueden crear enemigos porque las plataformas no están definidas.");
  }
}

//* Funciones colisiones
function detectCollisionPlayerPlatform() {
  let collisionPlatformDetected =false;

  platformsArray.forEach((eachPlatform)=>{
    
    if(playerObj.x < eachPlatform.x + eachPlatform.w &&
      playerObj.x + playerObj.w > eachPlatform.x &&
      playerObj.y < eachPlatform.y + eachPlatform.h &&
      playerObj.y + playerObj.h > eachPlatform.y){      

      // El jugador está sobre la plataforma
      playerObj.y = eachPlatform.y - playerObj.h; // Ajustar la posición del jugador sobre la plataforma
      playerObj.node.style.top = `${playerObj.y}px`; // Actualizar posición en el DOM
      playerObj.isJumping = false;
      collisionPlatformDetected = true;
    }
  });
    return collisionPlatformDetected;
  }

function detectCollisionEnemyPlatform(){
  let collisionPlatformDetected =false;

  platformsArray.forEach((eachPlatform)=>{
    enemiesArray.forEach((eachEnemy)=>{
    
    if(eachEnemy.x < eachPlatform.x + eachPlatform.w &&
      eachEnemy.x + eachEnemy.w > eachPlatform.x &&
      eachEnemy.y < eachPlatform.y + eachPlatform.h &&
      eachEnemy.y + eachEnemy.h > eachPlatform.y){      

        // El enemigo está sobre la plataforma
        eachEnemy.y = eachPlatform.y - eachEnemy.h; 
        eachEnemy.node.style.top = `${eachEnemy.y}px`; 
        collisionPlatformDetected = true;
      }
    });
    return collisionPlatformDetected;
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
  // 5. Reiniciar el estado del juego
  isGameGoing = false;
}
function checkPlatformOut(){
  if (platformsArray.length === 0){
    return;
  }

  if((platformsArray[0].y + platformsArray[0].h) >= gameBoxNode.offsetHeight){
    //console.log("removing platform");
    platformsArray[0].node.remove();// 1. sacar del DOM
    platformsArray.shift();// 2. Sacar de JS
    //console.log(platformsArray.length);
  }
}

//* EVENT LISTENERS
//botón para iniciar el juego desde el menú principal
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
window.addEventListener("keydown", (event) => {
  if(isGameGoing){
    if (event.key === "d") {
      playerObj.moveRight();
    } else if (event.key === "a") {
      playerObj.moveLeft();
    } else if (event.key === " ") {
      playerObj.jump();
    }
  }
})