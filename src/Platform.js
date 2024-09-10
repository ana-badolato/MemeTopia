class Platform {
  constructor(positionX, type) {
    this.x = positionX; 
    this.type = type;
    this.y = -50;
    this.h = 40; 
    this.w = 250;
    this.speed = 2;
  
    this.node = document.createElement("img");
    this.node.src = "./img/platformImg.png"; 
    
    if(this.type === "right"){
      this.y = -200; 
    }
 
    gameBoxNode.append(this.node);

    this.node.style.width = `${this.w}px`
    this.node.style.height = `${this.h}px`
    this.node.style.position = "absolute"
    this.node.style.top = `${this.y}px`
    this.node.style.left = `${this.x}px`
  }

    automaticMovement() {
      this.y+=this.speed;
      this.node.style.top = `${this.y}px`
    }

  }
