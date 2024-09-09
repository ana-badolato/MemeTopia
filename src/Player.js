class Player {
  //! Pendiente actualizar el salto
  constructor() {

    // Todas las instancias del jugador se crearán con estos valores
    this.x = 30;
    this.y = 0;
    this.h = 46;
    this.w = 70;
    this.speed = 20;
    this.acceleration = 0.98;
    this.gravitySpeed = 6;
    this.jumpSpeed = 30;
    this.isJumping = false;
    this.isGrounded = false;
    this.isMovingRight = true
    this.aux=0;
  
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
      if (!this.isJumping && this.isGrounded) {
        this.node.src = "./img/playerLeftImg.png"; // reasignamos la imagen
        this.x -= this.speed
        this.speed += this.acceleration; // Multiplicamos por la aceleración
        this.node.style.left = `${this.x}px`
        this.isMovingRight = false;
      }
      }

    

    moveRight(){
      if (!this.isJumping && this.isGrounded) {
        this.node.src = "./img/playerRightImg.png"; 
        this.x += this.speed;
        this.speed += this.acceleration;
        this.node.style.left = `${this.x}px`
        this.isMovingRight = true;
      }
    }

    // resetea la aceleración cuando se deja de mover el jugador
    resetAcceleration() {   
      this.acceleration = 0.92;
    }

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
      //console.log("salto1", this.isJumping);
      // forma de salto fluida
      console.log("velini", this.jumpSpeed)
      
      let saltoIntervalId = setInterval(() => {
        this.jumpSpeed *= this.acceleration; //! debería se this.acceleration
        this.y -= this.jumpSpeed;
        console.log("vel", this.jumpSpeed);
        this.node.style.top = `${this.y}px`
         if(this.isMovingRight) {
            this.x += 7
            this.node.style.left = `${this.x}px`
         }else{
            this.x -= 7
            this.node.style.left = `${this.x}px`
         }
        
      }, 15)
      
      setTimeout(() => {
        clearInterval(saltoIntervalId)
        this.isJumping = false
        //console.log("salto2", this.isJumping);
      }, 350)
      this.jumpSpeed = 30;
    }
    }
}