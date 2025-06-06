
export function createPuzzlePieces(
  imageUrl,
  gridSize = 3
) {
  const pieces = [];
  const pieceWidth = 100 / gridSize;
  const pieceHeight = 100 / gridSize;

  // Create pieces based on grid
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const id = row * gridSize + col;
      pieces.push({
        id,
        x: Math.random() * 80, // Random initial position
        y: Math.random() * 80,
        correctX: col * pieceWidth,
        correctY: row * pieceHeight,
        width: pieceWidth,
        height: pieceHeight,
        image: imageUrl,
        isPlaced: false,
      });
    }
  }

  return pieces;
}

export function checkPuzzleCompletion(pieces) {
  return pieces.every(piece => piece.isPlaced);
}

export function checkPiecePlacement(
  piece,
  x,
  y,
  threshold = 10
) {
  // Check if the piece is close enough to its correct position
  const distanceX = Math.abs(x - piece.correctX);
  const distanceY = Math.abs(y - piece.correctY);
  
  return distanceX <= threshold && distanceY <= threshold;
}
