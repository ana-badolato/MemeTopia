class Player {
  constructor() {

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
  
    this.node = document.createElement("img");
    this.node.src = "./img/playerRightImg.png"; 
    gameBoxNode.append(this.node);

    this.node.style.width = `${this.w}px`
    this.node.style.height = `${this.h}px`
    this.node.style.position = "absolute" 
    this.node.style.top = `${this.y}px`
    this.node.style.left = `${this.x}px`

  }

  gravity() {
      this.y += this.gravitySpeed; 
      this.node.style.top = `${this.y}px`;

      if ((this.y + this.h) >= gameBoxNode.offsetHeight) {
        gameOver();
      }
    }

    moveLeft(){
      if (!this.isJumping && this.isGrounded) {
        this.node.src = "./img/playerLeftImg.png";
        this.x -= this.speed
        this.speed += this.acceleration; 
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

    resetAcceleration() {   
      this.acceleration = 0.92;
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
        }, 15)
        
        setTimeout(() => {
          clearInterval(saltoIntervalId)
          this.isJumping = false
        }, 350)

        this.jumpSpeed = 30;
      }
    }
}