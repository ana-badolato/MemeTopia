class Powerup {
  constructor() {
    const gameBoxWidth = gameBoxNode.offsetWidth;
    this.w = 40; 
    this.h = 40; 
    this.x = Math.floor(Math.random() * (gameBoxWidth - this.w - 100)) + 50; // Posición x aleatoria
    this.y = -50; // Posición y inicial fuera de la pantalla (arriba)

    this.originalY = this.y; // Guardamos la posición inicial para usarla en el movimiento suave
    this.amplitude = 10; // Rango de movimiento vertical para la "flotación"
    this.speed = 0.05; // Velocidad del movimiento de flotación (senoidal)
    this.time = 0; // Tiempo para el movimiento senoidal
    this.fallSpeed = 2; // Velocidad constante de caída (descenso)
    
    this.type = [
      {
        name: "dogeCoin",
        image: "./img/powerUp1.png",
        hasBeenTaken: false
      },
      {
        name: "life",
        image: "./img/powerUp2.png",
        hasBeenTaken: false
      },
    ]
  
    this.randomPowerUp = this.getRandomPowerUp();
    this.node = document.createElement("img");  // Crear el nodo de imagen
    this.node.src = this.type[this.randomPowerUp].image;

    // Estilo inicial del nodo
    this.node.style.width = `${this.w}px`;
    this.node.style.height = `${this.h}px`;
    this.node.style.position = "absolute";
    this.node.style.left = `${this.x}px`;
    this.node.style.top = `${this.y}px`;

    // Añadir el nodo al gameBox
    gameBoxNode.append(this.node);
  }

  // Método para mover el power-up
  automaticMovement() {
    // Incrementar el tiempo para el movimiento suave
    this.time += this.speed;
    
    // Movimiento de caída (desciende constantemente)
    this.y += this.fallSpeed;

    // Movimiento senoidal (flotación) mientras cae
    const floatMovement = Math.sin(this.time) * this.amplitude;

    // Sumar ambos movimientos (descenso + flotación)
    this.node.style.top = `${this.y + floatMovement}px`;
  }

  getRandomPowerUp(){
    return Math.floor(Math.random() * this.type.length);
  }

  getAction() {
    const powerUpType = this.type[this.randomPowerUp].name;  // Acceder al nombre correcto del power-up
    
    if (powerUpType === "dogeCoin") {
      playerObj.coins+=1;
      playerCoins.innerText = `${playerObj.coins}`;
    } else if (powerUpType === "life") {
      playerObj.life += 20;
      playerLife.innerText = `${playerObj.life}`;
    }
  }
}
