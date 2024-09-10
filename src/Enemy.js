class Enemy {
  constructor(positionX, positionY, direction, platformWidth) {
    this.x = positionX;
    this.y = positionY;
    this.w = 40; 
    this.h = 40; 
    this.speed = 2;
    this.direction  = direction;
    
    this.platformWidth = platformWidth; // Ancho de la plataforma que el enemigo debe respetar
  
    this.type = [
      {
        name: "grumpy",
        damage: 5,
        imageLeft: "./img/enemy1Left.png",
        imageRight: "./img/enemy1Right.png"
      },
      {
        name: "troll",
        damage: 10,
        imageLeft: "./img/enemy2Left.png",
        imageRight: "./img/enemy2Right.png"
      },
    ]
  
    this.randomEnemy = this.getRandomEnemy();
    // Inicializamos el movimiento del enemigo basado en su tipo (left o right)

  
    this.node = document.createElement("img");
    if (this.direction === "left") {
      this.movingRight = false;
      this.node.src = this.type[this.randomEnemy].imageLeft;
    } else {
      this.movingRight = true;
      this.node.src = this.type[this.randomEnemy].imageRight;
    }

    this.node.style.width = `${this.w}px`;
    this.node.style.height = `${this.h}px`;
    this.node.style.position = "absolute";
    this.node.style.left = `${this.x}px`;
    this.node.style.top = `${this.y}px`;

    gameBoxNode.append(this.node);
  }

  automaticMovement(platformY) {
    this.y = platformY - this.h;
    this.node.style.top = `${this.y}px`;

    if (this.movingRight) {
      this.x += this.speed;
      if (this.x + this.w >= this.platformWidth) {
        this.movingRight = false;
        this.node.src = this.type[this.randomEnemy].imageLeft; 
      }
      } else {
        this.x -= this.speed;
        
        if (this.x <= 0) {
          this.movingRight = true;
          this.node.src = this.type[this.randomEnemy].imageRight;// Cambia la imagen al moverse a la derecha
        }
      }

    this.node.style.left = `${this.x}px`;
  }

  getRandomEnemy(){
    return Math.floor(Math.random()*this.type.length);
  }
}
