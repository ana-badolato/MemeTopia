class Player {
  //! Pendiente actualizar el salto
  constructor() {

    // Todas las instancias del jugador se crearán con estos valores
    this.x = 50;
    this.y = 50;
    this.h = 56;
    this.w = 80;
    this.speed = 10;
    this.gravitySpeed = 4;
    this.jumpSpeed = 50;
    this.isJumping = false;

    // Al crear el player:

    // 1. Añadimos el player al DOM
    this.node = document.createElement("img");
    this.node.src = "./img/playerRightImg.png"; // asignamos la imagen
    gameBoxNode.append(this.node);

    // 2. Ajustamos sus dimensiones y posiciones
    this.node.style.width = `${this.w}px`
    this.node.style.height = `${this.h}px`
    this.node.style.position = "absolute" // nos permite ajustar el top y el left
    this.node.style.top = `${this.y}px`
    this.node.style.left = `${this.x}px`

  }

  // Efecto que recreará la gravedad sobre nuestro jugador
  gravity() {

     // Si el jugador no está sobre una plataforma, aplicamos la gravedad
    if (!detectCollisionPlayerPlatform()) {
      this.y += this.gravitySpeed; // Aumentamos la posición Y para simular la caída
 
    // Actualizamos la posición en el DOM
      this.node.style.top = `${this.y}px`;

    // Comprobamos si el jugador toca el fondo del contenedor
      if ((this.y + this.h) >= gameBoxNode.offsetHeight) {
      // Si toca el fondo, activamos el Game Over
        gameOver();
      }
    }

  }


    // Movimientos a izda y dcha
    moveLeft(){

        this.node.src = "./img/playerLeftImg.png"; // reasignamos la imagen
        this.x -= this.speed; // Multiplicamos por la aceleración
        this.node.style.left = `${this.x}px`


      }

    

    moveRight(){

        this.node.src = "./img/playerRightImg.png"; 
        this.x += this.speed;
        this.node.style.left = `${this.x}px`

    }

    // resetea la aceleración cuando se deja de mover el jugador
    resetAcceleration() {   

      this.acceleration = 1;

    }

    // salto del jugador
    jump() {

      if (!this.isJumping) {
        this.isJumping = true;  // El jugador está saltando
        this.y -= this.jumpSpeed;
        this.node.style.top = `${this.y}px`;
     
        }

      }
}