class Player {
  //! Pendiente actualizar el salto
  constructor() {

    // Todas las instancias del jugador se crearán con estos valores
    this.x = 40;
    this.y = 40;
    this.h = 46;
    this.w = 70;
    this.speed = 50;
    this.gravitySpeed = 4;
    this.jumpSpeed = 50;
    this.isJumping = false;
    this.isGrounded = false;
    console.log("ground", this.isGrounded);

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
      this.y += this.gravitySpeed; // Aumentamos la posición Y para simular la caída
 
    // Actualizamos la posición en el DOM
      this.node.style.top = `${this.y}px`;

    // Comprobamos si el jugador toca el fondo del contenedor
      if ((this.y + this.h) >= gameBoxNode.offsetHeight) {
        gameOver();
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

    // // resetea la aceleración cuando se deja de mover el jugador
    // resetAcceleration() {   
    //   this.acceleration = 1;
    // }

    // salto del jugador
    jump() {
      // this.isJumping=true;
      // this.y -= this.jumpSpeed;
      // this.node.style.top = `${this.y}px`;


     //ejemplo de otro tipo de salto
    console.log("salto inicial", this.isGrounded);
    if (!this.isJumping && this.isGrounded) {
      this.isJumping = true;
      this.isGrounded = false;
      console.log("salto1", this.isJumping);
      // forma de salto fluida
      let saltoIntervalId = setInterval(() => {
        this.y -= 10
        this.node.style.top = `${this.y}px`
      }, 15)
  
      setTimeout(() => {
        clearInterval(saltoIntervalId)
        this.isJumping = false
        console.log("salto2", this.isJumping);
      }, 250)
 
    }
    }
}