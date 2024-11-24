export function getRandomProfileColor(): string {
    const colors = [
      "#FF5733", // vermelho vibrante
      "#33FF57", // verde
      "#3357FF", // azul
      "#F39C12", // laranja
      "#9B59B6", // roxo
      "#E74C3C", // vermelho claro
      "#1ABC9C", // ciano
      "#3498DB", // azul claro
    ];
  
    // Seleciona uma cor aleatória do array
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }