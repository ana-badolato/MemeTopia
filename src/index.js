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
let isGameGoing = false;

// Intervalos
let gameIntervalId = null;

//Objetos
let playerObj = null;

// Audio
let gameMusic = new Audio('./audio/marbleSodaMusic.mp3')
gameMusic.loop = true;
gameMusic.volume = 0.5;

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

}

function gameLoop() {

    // Se ejecuta 60 veces por segundo en el intervalo principal
    playerObj.gravity();

}

function gameOver() {

  // 1. Limpiar los intervalos
  clearInterval(gameIntervalId);

  // 2. Cambiar de pantalla
  gameScreenNode.style.display = "none";
  gameOverScreenNode.style.display = "flex";

  // 3. Parar y reiniciar elementos
  stopMusicGame();
  isGameGoing = false;
}

function openMenu() { //por ahora esta función y la de arriba son iguales

  // 1. Limpiar los intervalos
  clearInterval(gameIntervalId);

  // 2. Cambiar de pantalla
  gameScreenNode.style.display = "none";
  splashScreenNode.style.display = "flex";

  // 3. Parar audio perteneciente al juego
  stopMusicGame();
  isGameGoing = false;
}

function initMusicGame() {
  gameMusic.play();
}

function stopMusicGame() {
  gameMusic.pause();
  gameMusic.currentTime = 0; // Reiniciar la música si vuelves a reproducirla
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