class Platform {
  constructor(positionX, type) {

    this.x = positionX; 
    this.type = type;
    this.y = -50;
    this.h = 40; 
    this.w = 250;
    this.speed = 2;
  
    // Al crear cada plataforma

    // 1. añadir la plataforma al DOM
    this.node = document.createElement("img");
    this.node.src = "./img/platformImg.png"; 
    
    if(this.type === "right"){
      this.y = -200; //variamos la Y en la que aparecen las plataformas
    }
 
    gameBoxNode.append(this.node);

    // 2. Ajustamos sus dimensiones y posiciones
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
