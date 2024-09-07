//* ELEMENTOS PRINCIPALES DEL DOM

// pantallas
const splashScreenNode = document.querySelector("#splash-screen")
const gameScreenNode = document.querySelector("#game-screen")
const gameOverScreenNode = document.querySelector("#game-over-screen")

// game box
const gameBoxNode = document.querySelector("#game-box")

//botones
const playBtnNode = document.querySelector("#playBtn");
const menuBtnNode = document.querySelector(".menuBtn");
const musicOnBtnNode = document.querySelector("#musicOnBtn");
const musicOffBtnNode = document.querySelector("#musicOffBtn");

//* VARIABLES GLOBALES DEL JUEGO

//Control del juego
let isGameGoing = false; //para controlar el estado de ciertos elementos dentro del juego

// Intervalos
let gameIntervalId = null;
let platformsIntervalId = null;

//Objetos
let playerObj = null;
let platformsArray = [];
let platformsFreq = 1500;


// Audio
let gameMusic = new Audio('./audio/marbleSodaMusic.mp3') // cargamos la música
gameMusic.loop = true; // la música dentro del juego se repite
gameMusic.volume = 0.5; // ajustamos el volumen

//* FUNCIONES GLOBALES DEL JUEGO

function startGame() {

  // 1. Cambiar las pantallas
  splashScreenNode.style.display = "none";
  gameScreenNode.style.display = "flex";

  // 2. Añadir todos los elementos iniciales del juego
  isGameGoing = true;
  playerObj = new Player();
  initMusicGame();

  // 3. Iniciar el intervalo de juego
  gameIntervalId = setInterval(() => {
    gameLoop();
  }, Math.round(1000/60)); // Para que el juego se ejecute a 60 fps

  // 4. (Opcional) Iniciaremos otrs intervalos que requiera el juego
  platformsIntervalId = setInterval(() => { // Control de la aparición de plataformas
    addPlatform();
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
}

function gameOver() {
  
  cleanGame();
  gameOverScreenNode.style.display = "flex";

}

function openMenu() { 

  cleanGame();
  splashScreenNode.style.display = "flex";

}

function cleanGame (){
    // 1. Limpiar los intervalos
    clearInterval(gameIntervalId);
    clearInterval(platformsIntervalId); 

    // 2. Pantallas
    gameScreenNode.style.display = "none";

    // 3. Parar y reiniciar elementos
    stopMusicGame();
    isGameGoing = false;

    gameBoxNode.innerHTML = ""
    playerObj = null;
    platformsArray = []; 
}


function initMusicGame() {
  gameMusic.play();
}

function stopMusicGame() {
  gameMusic.pause();
  gameMusic.currentTime = 0; // Reiniciar la música si vuelves a reproducirla
}

function addPlatform() {
  let randomPositionX = Math.floor(Math.random() * (-50));

  let newPlatformLeft = new Platform(randomPositionX, "left");
  platformsArray.push(newPlatformLeft);

  let newPlatformRight = new Platform(randomPositionX + 500, "right");
  platformsArray.push(newPlatformRight);

}

function detectCollisionPlayerPlatform() {

  platformsArray.forEach((eachPlatform)=>{
  
    if(playerObj.x < eachPlatform.x + eachPlatform.w &&
      playerObj.x + playerObj.w > eachPlatform.x &&
      playerObj.y < eachPlatform.y + eachPlatform.h &&
      playerObj.y + playerObj.h > eachPlatform.y){

      // El jugador está sobre la plataforma
      playerObj.y = eachPlatform.y - playerObj.h; // Ajustar la posición del jugador sobre la plataforma
      playerObj.node.style.top = `${playerObj.y}px`; // Actualizar posición en el DOM
      return true;
    }
  });

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

// movimientos del jugador
window.addEventListener("keydown", (event) => {
  if (event.key === "d") {
    playerObj.moveRight();
  } else if (event.key === "a") {
    playerObj.moveLeft();
  } else if (event.key === " ") {
    playerObj.jump();
  }
})