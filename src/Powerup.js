class Powerup {
  constructor() {
    const gameBoxWidth = gameBoxNode.offsetWidth;
    this.w = 40; 
    this.h = 40; 
    this.x = Math.floor(Math.random() * (gameBoxWidth - this.w - 100)) + 50;
    this.y = -50; 
    this.originalY = this.y; 
    this.amplitude = 10; 
    this.speed = 0.05; 
    this.time = 0; 
    this.fallSpeed = 2; 
    
    this.type = [
      {
        name: "dogeCoin",
        image: "./img/powerUp1.png",
        hasBeenTaken: false,
        audio:"./audio/coin.wav",
        volume:0.1
      },
      {
        name: "life",
        image: "./img/powerUp2.png",
        hasBeenTaken: false,
        audio:"./audio/life.wav",
        volume:0.05
      },
    ]
  
    //configuramos algunas de las variables en función del tipo de power up
    this.randomPowerUp = this.getRandomPowerUp();
    this.audioPower = new Audio(this.type[this.randomPowerUp].audio);  
    this.audioPower.volume=this.type[this.randomPowerUp].volume;
    this.node = document.createElement("img");  /
    this.node.src = this.type[this.randomPowerUp].image;

    this.node.style.width = `${this.w}px`;
    this.node.style.height = `${this.h}px`;
    this.node.style.position = "absolute";
    this.node.style.left = `${this.x}px`;
    this.node.style.top = `${this.y}px`;

    gameBoxNode.append(this.node);
  }

  //los bonus "flotan" a la vez que bajan
  automaticMovement() {
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
    const powerUpType = this.type[this.randomPowerUp].name;
    this.audioPower.play();
    if (powerUpType === "dogeCoin") {
      playerObj.coins+=1;
      playerCoins.innerText = `${playerObj.coins}`;
    } else if (powerUpType === "life") {
      playerObj.life += 20;
      playerLife.innerText = `${playerObj.life}`;
    }
  }
}
