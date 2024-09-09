class Enemy {
  constructor(positionX, positionY, type, platformWidth) {
    //! Hay que solucionar la aparición de personajes
    this.x = positionX;
    this.y = positionY;
    this.w = 56; // Ancho del enemigo
    this.h = 56; // Alto del enemigo
    this.type = type;
    this.speed = 2;
    this.platformWidth = platformWidth; // Ancho de la plataforma que el enemigo debe respetar

    // Inicializamos el movimiento del enemigo basado en su tipo (left o right)

    this.node = document.createElement("img");
    this.node.src = "./img/enemy1Left.png"; 
    if (this.type === "left") {
      this.movingRight = true;
      this.node.src = "./img/enemy1Left.png";
      //console.log("hacia la izda")
    } else {
      this.movingRight = false;
      this.node.src = "./img/enemy1Right.png";
      //console.log("hacia la dcha")
    }

 
 
    
    this.node.style.width = `${this.w}px`;
    this.node.style.height = `${this.h}px`;
    this.node.style.position = "absolute";
    this.node.style.left = `${this.x}px`;
    this.node.style.top = `${this.y}px`;

    // Añadir el enemigo al DOM
    gameBoxNode.append(this.node);
  }

  // Movimiento automático de los enemigos
  automaticMovement(platformY) {
    // Actualizar la posición en Y del enemigo según la plataforma
    this.y = platformY - this.h;
    this.node.style.top = `${this.y}px`;

    // Movimiento horizontal del enemigo
    if (this.movingRight) {
      this.x += this.speed;
      if (this.x + this.w >= this.platformWidth) {
        this.movingRight = false;
        this.node.src = "./img/enemy1Left.png"; // Cambia la imagen al moverse a la izquierda
      }
    } else {
      this.x -= this.speed;
      if (this.x <= 0) {
        this.movingRight = true;
        this.node.src = "./img/enemy1Right.png"; // Cambia la imagen al moverse a la derecha
      }
    }
    this.node.style.left = `${this.x}px`;
  }
}
