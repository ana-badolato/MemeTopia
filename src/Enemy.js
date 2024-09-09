class Enemy{
  constructor(positionX, positionY, type){
    this.x = positionX; 
    this.y = positionY;
    this.type = type;
    this.h = 48; 
    this.w = 48;
    this.speed = 2;
    // Inicializamos el movimiento del enemigo basado en su tipo
    if (this.type === "left") {
      this.movingRight = true; // Si es un enemigo de la izquierda, comienza moviéndose a la derecha
    } else if (this.type === "right") {
      this.movingRight = false; // Si es un enemigo de la derecha, comienza moviéndose a la izquierda
    }
    
    this.platformWidth = platformWidth; // Ancho de la plataforma a la que pertenece
    this.platformInitialX = positionX; // Posición inicial X de la plataforma para limitar el movimiento

    // Al crear cada enemigo
    this.node = document.createElement("img");
    
    if (this.type === "left") {
      this.node.src = "./img/enemy1Left.png"; 
    } else if (this.type === "right") {
      this.node.src = "./img/enemy1Right.png"; 
    }

    gameBoxNode.append(this.node);

    // Ajustamos sus dimensiones y posiciones
    this.node.style.width = `${this.w}px`;
    this.node.style.height = `${this.h}px`;
    this.node.style.position = "absolute";
    this.node.style.top = `${this.y}px`;
    this.node.style.left = `${this.x}px`; 
  }


  // Movimiento automático de los enemigos
  automaticMovement(platformY) {
    // El enemigo sigue la posición vertical (Y) de la plataforma
    this.y = platformY;
    this.node.style.top = `${this.y}px`;

    // Movimiento horizontal dentro del rango de la plataforma
    if (this.movingRight) {
      this.x += this.speed;
      if (this.x + this.w >= this.platformInitialX + this.platformWidth) {
        this.movingRight = false;
        this.node.src = "./img/enemy1Left.png"; // Cambia la imagen cuando va a la izquierda
      }
    } else {
      this.x -= this.speed;
      if (this.x <= this.platformInitialX) {
        this.movingRight = true;
        this.node.src = "./img/enemy1Right.png"; // Cambia la imagen cuando va a la derecha
      }
    }
    this.node.style.left = `${this.x}px`;
  }
}