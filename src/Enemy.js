class Enemy {
  constructor(positionX, positionY, direction, platformWidth) {
    this.x = positionX;
    this.y = positionY;
    this.w = 40; 
    this.h = 40; 
    this.speed = 2;
    this.direction  = direction;
    this.platformWidth = platformWidth; 
    this.isDead = false;
    this.type = [
      {
        name: "grumpy",
        damage: 5,
        life: 10,
        imageLeft: "./img/enemy1Left.png",
        imageRight: "./img/enemy1Right.png",
        hasAttacked: false
      },
      {
        name: "troll",
        damage: 20,
        life: 30,
        imageLeft: "./img/enemy2Left.png",
        imageRight: "./img/enemy2Right.png",
        hasAttacked: false
      },
    ]
  
    this.randomEnemy = this.getRandomEnemy();
    this.currentLife = this.type[this.randomEnemy].life; 
      
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


  automaticMovement(platformX, platformY) {

    this.y = platformY - this.h;
    this.node.style.top = `${this.y}px`;

  
    if (this.movingRight) {
        this.x += this.speed;
   
        if (this.x + this.w >= platformX + this.platformWidth) {
            this.movingRight = false;
            this.node.src = this.type[this.randomEnemy].imageLeft; 
            this.type.hasAttacked = false;
        }
    } else {
        this.x -= this.speed;
    
        if (this.x <= platformX) {
            this.movingRight = true;
            this.node.src = this.type[this.randomEnemy].imageRight; 
            this.type.hasAttacked = false;
        }
    }

    // Actualizar la posición en el DOM
    this.node.style.left = `${this.x}px`;
}


  getRandomEnemy(){
    return Math.floor(Math.random()*this.type.length);
  }

  getDamage(bullet) {
    // Si el enemigo ya está muerto, no hacemos nada
    if (this.isDead) return;

    this.currentLife -= bullet.damage;
    if (this.currentLife <= 0) {
      this.isDead = true; 
      playerObj.kills++;  
      playerKills.innerText = `${playerObj.kills}`; 
      this.hide(); 
    }
  }

  hide() {
    this.node.style.display = "none";
  }
}
