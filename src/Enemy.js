class Enemy {
  constructor(positionX, positionY, direction, platformWidth) {
    this.x = positionX;
    this.y = positionY;
    this.w = 50; 
    this.h = 50; 
    this.speed = 2;
    this.direction  = direction;
    this.platformWidth = platformWidth; 
    this.isDead = false;
    this.audioAttack = new Audio("./audio/dead.wav");  
    this.audioAttack.volume=0.05;
    this.type = [
      
      {
        name: "troll",
        damage: 15,
        life: 30,
        imageLeft: "./img/enemy2Left.png",
        imageRight: "./img/enemy2Right.png",
        hasAttacked: false
      },
      {
        name: "frog",
        damage: 10,
        life: 20,
        imageLeft: "./img/frogLeft.png",
        imageRight: "./img/frogRight.png",
        hasAttacked: false
      },
      {
        name: "monkey",
        damage: 5,
        life: 10,
        imageLeft: "./img/monkeyLeft.png",
        imageRight: "./img/monkeyRight.png",
        hasAttacked: false
      },
    ]
    
    this.randomEnemy = this.getRandomEnemy();
    this.currentLife = this.type[this.randomEnemy].life;
    this.currentDamage = this.type[this.randomEnemy].damage;

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

    if (this.isDead) {
      return; 
    }

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
      this.audioAttack.play();
      this.hide(); 
    }
  }

  hide() {
    let deadIntervalId = setInterval(() => {
      this.node.src = "./img/explosion.png";
    }, 15)
    setTimeout(() => {
      clearInterval(deadIntervalId)
      this.node.style.display = "none";
      this.node.style.top = `${this.y}px`;
      this.currentDamage = 0;
      this.audioAttack = null;
      this.isDead = true; 
    }, 150)
  }


}
