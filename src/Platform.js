class Platform {
  constructor(positionX, type) {

    this.x = positionX; 
    this.type = type;
    this.y = -50;
    this.h = 48; 
    this.w = 320;
    this.speed = 2;
  
    // Al crear cada plataforma

    // 1. añadir la plataforma al DOM
    this.node = document.createElement("img");
    this.node.src = "./img/platformImg.png"; 
    
    if(this.type === "right"){
      this.y = -200; //variamos la Y en la que aparecen las plataformas de los lados para así alternar y obligar al jugador a correr de izda a derecha
    }
 
    gameBoxNode.append(this.node);

    // 2. Ajustamos sus dimensiones y posiciones
    this.node.style.width = `${this.w}px`
    this.node.style.height = `${this.h}px`
    this.node.style.position = "absolute" // nos permite ajustar el top y el left
    this.node.style.top = `${this.y}px`
    this.node.style.left = `${this.x}px`
  }

    // Movimiento automático de las plataformas
    automaticMovement() {
      this.y+=this.speed;
      this.node.style.top = `${this.y}px`
    }

    

  }
