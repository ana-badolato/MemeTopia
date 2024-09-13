class Background {
  // para generar el efecto de parallax y desplazar el fondo 
  constructor() {
    this.node1 = document.createElement("div");
    this.node2 = document.createElement("div");

    this.node1.style.backgroundImage = "url(./img/castleBackground.png)";
    this.node2.style.backgroundImage = "url(./img/castleBackground.png)";

    this.node1.style.backgroundSize = "cover";
    this.node2.style.backgroundSize = "cover";

    this.node1.style.position = "absolute";
    this.node2.style.position = "absolute";

    this.node1.style.width = "100%";
    this.node1.style.height = "1600px"; 
    this.node2.style.width = "100%";
    this.node2.style.height = "1600px";

    this.node1.style.top = "0px";
    this.node2.style.top = "-1600px"; // El segundo nodo empieza justo encima del primero

    // Aseguramos que esté detrás de los elementos del juego
    this.node1.style.zIndex = 0;
    this.node2.style.zIndex = 0;

    gameBoxNode.append(this.node1);
    gameBoxNode.append(this.node2);

    this.speed = 1.5;  
    this.backgroundHeight = 1600; 
  }


  move() {
    let pos1 = parseFloat(this.node1.style.top);
    let pos2 = parseFloat(this.node2.style.top);

    pos1 += this.speed;
    pos2 += this.speed;

    // Si uno de los fondos sale de la pantalla, lo recolocamos en la parte superior
    if (pos1 >= gameBoxNode.offsetHeight) {
      pos1 = pos2 - gameBoxNode.offsetHeight; 
    }
    if (pos2 >= gameBoxNode.offsetHeight) {
      pos2 = pos1 - gameBoxNode.offsetHeight; 
    }

    this.node1.style.top = `${pos1}px`;
    this.node2.style.top = `${pos2}px`;
  }
}