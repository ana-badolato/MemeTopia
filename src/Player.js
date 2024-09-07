class Player {

  constructor() {

    // Todas las instancias del jugador se crearán con estos valores
    this.x = 50;
    this.y = 400;
    this.h = 64;
    this.w = 56;
    this.speed = 10;
    this.gravitySpeed = 2;
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
    
    this.y+= this.gravitySpeed;

    //nuestro elementos existen en dos entornos. El de JS y el DOM
    this.node.style.top = `${this.y}px`

    // condicional para verificar si el player ha caído al fondo de la torre
    if((this.y + this.h)>=gameBoxNode.offsetHeight){
      gameOver();
    }

  }

    // El jugador saltará a la velocidad indicada la distancia indicada
    jump(){
      
      // Prevenimos solapamientos al pulsar teclas fuera de la pantalla principal de juego
      if(isGameGoing && !this.isJumping){
        this.y -= this.jumpSpeed;
        this.node.style.top = `${this.y}px`;
        //! jumping = true?
      }

    }

    // Movimientos a izda y dcha
    moveLeft(){

      if(isGameGoing){
        this.node.src = "./img/playerLeftImg.png"; // reasignamos la imagen
        this.x -= this.speed
        this.node.style.left = `${this.x}px`
      }

    }

    moveRight(){

      if(isGameGoing){
        this.node.src = "./img/playerRightImg.png"; 
        this.x += this.speed
        this.node.style.left = `${this.x}px`
      }

    }
}