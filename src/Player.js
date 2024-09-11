class Player {
  constructor() {
    this.x = 30;
    this.y = 0;
    this.h = 46;
    this.w = 70;
    this.speed = 2;
    this.acceleration = 0.92;
    this.gravitySpeed = 6;
    this.jumpSpeed = 30;
    this.life = 100;
    this.coins = 0;
    this.kills = 0;
    this.damage = 10;
    this.totalScore = 0;
    this.isJumping = false;
    this.isGrounded = false;
    this.isMovingRight = true
    this.bulletsArray = []; 
    this.keys = {
      right: false,
      left: false,
    };

    this.node = document.createElement("img");
    this.node.src = "./img/playerRightImg.png"; 
    gameBoxNode.append(this.node);

    this.node.style.width = `${this.w}px`
    this.node.style.height = `${this.h}px`
    this.node.style.position = "absolute" 
    this.node.style.top = `${this.y}px`
    this.node.style.left = `${this.x}px`

    this.node.style.zIndex = 10;

  }

  resetAcceleration() {   
    this.acceleration = 0.92;
  }

  gravity() {
      this.y += this.gravitySpeed; 
      this.node.style.top = `${this.y}px`;
      if ((this.y + this.h) >= gameBoxNode.offsetHeight) {
        gameOver();
      }
    }

    movement(){
      if (this.keys.left) {
        this.moveLeft();
      }
      if (this.keys.right) {
        this.moveRight();
      }
    }

    moveLeft(){
      if (!this.isJumping && this.isGrounded) {
        this.node.src = "./img/playerLeftImg.png";
        this.x -= this.speed
        this.speed += this.acceleration; 
        this.node.style.left = `${this.x}px`
        this.isMovingRight = false;
        this.detectWallCollision();
      }
    }

    moveRight(){
      if (!this.isJumping && this.isGrounded) {
        this.node.src = "./img/playerRightImg.png"; 
        this.x += this.speed;
        this.speed += this.acceleration;
        this.node.style.left = `${this.x}px`
        this.isMovingRight = true;
        this.detectWallCollision();
      }
    }

    jump() {
      if (!this.isJumping && this.isGrounded) {
        this.isJumping = true;
        this.isGrounded = false;
        let saltoIntervalId = setInterval(() => {
          this.jumpSpeed *= this.acceleration; 
          this.y -= this.jumpSpeed;
          this.node.style.top = `${this.y}px`
          if(this.isMovingRight) {
              this.x += 7
              this.node.style.left = `${this.x}px`
          }else{
              this.x -= 7
              this.node.style.left = `${this.x}px`
          }
          this.detectWallCollision();
        }, 15)
        setTimeout(() => {
          clearInterval(saltoIntervalId)
          this.isJumping = false
        }, 350)
        this.jumpSpeed = 30;
      }
    }

     
  detectWallCollision() {
    if (this.x <= -5) {
      this.x = 0; 
      this.speed = -this.speed * 0.5; 
    }
    if (this.x + this.w >= gameBoxNode.offsetWidth+5) {
      this.x = gameBoxNode.offsetWidth - this.w; 
      this.speed = -this.speed * 0.5; 
    }
    this.node.style.left = `${this.x}px`;
  }

  getDamage(enemy) {
    if (this.life > 0) {
      this.life -= enemy.type[enemy.randomEnemy].damage;
      playerLife.innerText = `${this.life}`;
    }
    if (this.life <= 0) {
      gameOver();
    }
  }

  shoot() {
    const newBullet = new Bullet(playerObj);
    this.bulletsArray.push(newBullet);
  }

  moveBullets() {
    this.bulletsArray.forEach((bullet, index) => {
      bullet.move();
      if (bullet.x > gameBoxNode.offsetWidth || bullet.x < 0) {
        bullet.remove();
        this.bulletsArray.splice(index, 1); 
      }
    });
  }
}