class Platform {
  constructor(positionX, type) {

    this.x = positionX; 
    this.y = 50//gameBoxNode.offsetWidth; //para que empiece justo desde fuera de la gameBox
    //! Revisar la posición Y a la hora de intercalar. quizá haya que hacer ajustes o una clase para izda y otra apra derecha??? o en dos arrays diferentes?
    this.h = 48; 
    this.w = 256;
    this.speed = 2;
    // Al crear cada plataforma

    // 1. añadir la plataforma al DOM
    this.node = document.createElement("img");
    if(type === "left"){
      this.node.src = "./img/platformLeftImg.png"; // asignamos la imagen
    }else if(type === "right"){
      this.node.src = "./img/platformRightImg.png";
    }
 
    gameBoxNode.append(this.node);

    // 2. Ajustamos sus dimensiones y posiciones
    this.node.style.width = `${this.w}px`
    this.node.style.height = `${this.h}px`
    this.node.style.position = "absolute" // nos permite ajustar el top y el left
    this.node.style.top = `${this.y}px`
    this.node.style.left = `${this.x}px`
  }

    automaticMovement() {
      this.y+=this.speed;
      this.node.style.top = `${this.y}px`
    }

  }
