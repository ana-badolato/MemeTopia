//* ELEMENTOS PRINCIPALES DEL DOM

// pantallas
const splashScreenNode = document.querySelector("#splash-screen")
const gameScreenNode = document.querySelector("#game-screen")
const gameOverScreenNode = document.querySelector("#game-over-screen")

// game box
const gameBoxNode = document.querySelector("#game-box")

//botone
const playBtnNode = document.querySelector("#playBtn");
const menuBtnNode = document.querySelector(".menuBtn");

//* VARIABLES GLOBALES DEL JUEGO
let gameIntervalId = null;

//* FUNCIONES GLOBALES DEL JUEGO

function startGame() {

  // 1. Cambiar las pantallas
  splashScreenNode.style.display = "none";
  gameScreenNode.style.display = "flex";

  // 2. Añadir todos los elementos iniciales del juego


  // 3. Iniciar el intervalo de juego
  gameIntervalId = setInterval(() => {
    gameLoop();
  }, Math.round(1000/60)); // Para que el juego se ejecute a 60 fps

  // 4. (Opcional) Iniciaremos otrs intervalos que requiera el juego

}

function gameLoop() {

  // Se ejecuta 60 veces por segundo en el intervalo principal

}

function gameOver() {

}

function openMenu() {

  // 1. Limpiar los intervalos
  clearInterval(gameIntervalId);

  // 2. Cambiar de pantalla
  gameScreenNode.style.display = "none";
  splashScreenNode.style.display = "flex";
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