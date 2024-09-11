class Bullet {
  constructor(playerObj) {
    this.w = 10;
    this.h = 5;
    this.speed = 10;
    this.damage = playerObj.damage; // El daño depende del jugador
    this.direction = playerObj.isMovingRight ? 1 : -1; // Si está mirando a la derecha, la bala va hacia la derecha
    this.x = playerObj.isMovingRight ? playerObj.x + playerObj.w : playerObj.x; // Posición inicial de la bala
    this.y = playerObj.y + playerObj.h / 2; // Posición en el centro vertical del jugador
    
    this.node = document.createElement("div");
    this.node.style.width = `${this.w}px`;
    this.node.style.height = `${this.h}px`;
    this.node.style.backgroundColor = this.getRandomColor(); // Visualización de la bala (puede cambiarse a una imagen)
    this.node.style.position = "absolute";
    this.node.style.left = `${this.x}px`;
    this.node.style.top = `${this.y}px`;

    this.node.style.boxShadow = `0 0 10px ${this.getRandomColor()}`;

    gameBoxNode.append(this.node);
  }

  move() {
    // Movimiento condicional hacia la derecha o izquierda
    if (this.direction === 1) {
      this.x += this.speed;
    } else {
      this.x -= this.speed;
    }
    this.node.style.left = `${this.x}px`;
  }

  checkCollisionWithEnemy(enemy) {
    // Condicionales para detectar colisión con enemigos
    if (
      this.x < enemy.x + enemy.w &&
      this.x + this.w > enemy.x &&
      this.y < enemy.y + enemy.h &&
      this.y + this.h > enemy.y
    ) {
      return true; // Si se cumple, hay colisión
    }
    return false; // No hay colisión
  }

  remove() {
    this.node.remove(); // Eliminar del DOM
  }

  getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
