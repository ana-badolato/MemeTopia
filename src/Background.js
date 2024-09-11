class Background {
  constructor() {
    this.node1 = document.createElement("div");
    this.node2 = document.createElement("div");

    // Asignar las imágenes de fondo
    this.node1.style.backgroundImage = "url(../img/background.png)";
    this.node2.style.backgroundImage = "url(../img/background.png)";

    // Estilos
    this.node1.style.backgroundSize = "cover";
    this.node2.style.backgroundSize = "cover";

    this.node1.style.position = "absolute";
    this.node2.style.position = "absolute";

    this.node1.style.width = "100%";
    this.node1.style.height = `${gameBoxNode.offsetHeight}px`; // Usa la altura del gameBoxNode
    this.node2.style.width = "100%";
    this.node2.style.height = `${gameBoxNode.offsetHeight}px`;

    this.node1.style.top = "0px";
    this.node2.style.top = `-${gameBoxNode.offsetHeight}px`; // Segundo nodo empieza justo encima del primero

    // Aseguramos que esté detrás de los elementos del juego
    this.node1.style.zIndex = 0;
    this.node2.style.zIndex = 0;

    // Insertar los nodos en el game-box
    gameBoxNode.append(this.node1);
    gameBoxNode.append(this.node2);

    // Velocidad del desplazamiento
    this.speed = 1.5;  // Ajusta la velocidad como quieras
  }

  // Método para mover las imágenes de fondo
  move() {
    let pos1 = parseFloat(this.node1.style.top);
    let pos2 = parseFloat(this.node2.style.top);

    // Desplazar los nodos hacia abajo
    pos1 += this.speed;
    pos2 += this.speed;

    // Si uno de los fondos sale de la pantalla, lo recolocamos en la parte superior
    if (pos1 >= gameBoxNode.offsetHeight) {
      pos1 = pos2 - gameBoxNode.offsetHeight; // Alinear perfectamente con la otra imagen
    }
    if (pos2 >= gameBoxNode.offsetHeight) {
      pos2 = pos1 - gameBoxNode.offsetHeight; // Alinear perfectamente con la otra imagen
    }

    // Actualizar la posición de los nodos
    this.node1.style.top = `${pos1}px`;
    this.node2.style.top = `${pos2}px`;
  }
}