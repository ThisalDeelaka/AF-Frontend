import { useEffect, useState, useRef } from "react";
import { createPuzzlePieces, checkPiecePlacement, checkPuzzleCompletion } from "@/lib/puzzle";
import { getPuzzleProgress, savePuzzleProgress } from "@/lib/storage";
import { toast } from "sonner";

const PuzzleGame = ({ countryCode, imageUrl, puzzleType = "image", onComplete }) => {
  const [pieces, setPieces] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [activePieceId, setActivePieceId] = useState(null);
  const containerRef = useRef(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const gridSize = 3; // 3x3 puzzle
  
  // Generate a unique ID for this particular puzzle instance
  const puzzleId = `${countryCode}-${puzzleType}`;
  
  // Initialize puzzle
  useEffect(() => {
    const initializePuzzle = () => {
      // Check if there's saved progress
      const savedProgress = getPuzzleProgress(puzzleId);
      
      if (savedProgress) {
        setPieces(savedProgress.pieces);
        setIsComplete(savedProgress.isCompleted);
      } else {
        // Create new puzzle
        const newPieces = createPuzzlePieces(imageUrl, gridSize);
        setPieces(newPieces);
        
        // Save initial state
        savePuzzleProgress({
          countryCode: puzzleId,
          pieces: newPieces,
          isCompleted: false,
          startedAt: Date.now(),
          puzzleType,
        });
      }
    };
    
    initializePuzzle();
  }, [countryCode, imageUrl, puzzleId, puzzleType]);
  
  // Save progress when pieces change
  useEffect(() => {
    if (pieces.length > 0) {
      const isAllComplete = checkPuzzleCompletion(pieces);
      
      if (isAllComplete !== isComplete) {
        setIsComplete(isAllComplete);
        
        if (isAllComplete) {
          toast.success("Puzzle completed! 🎉");
          if (onComplete) onComplete();
        }
      }
      
      savePuzzleProgress({
        countryCode: puzzleId,
        pieces,
        isCompleted: isAllComplete,
        startedAt: getPuzzleProgress(puzzleId)?.startedAt || Date.now(),
        completedAt: isAllComplete ? Date.now() : undefined,
        puzzleType,
      });
    }
  }, [pieces, puzzleId, isComplete, onComplete, puzzleType]);
  
  // Event handlers for drag and drop
  const handleMouseDown = (e, id) => {
    if (isComplete) return;
    
    const piece = pieces.find(p => p.id === id);
    if (!piece || piece.isPlaced) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - (piece.x / 100 * rect.width);
    const offsetY = e.clientY - rect.top - (piece.y / 100 * rect.height);
    
    setActivePieceId(id);
    setDragOffset({ x: offsetX, y: offsetY });
    
    e.preventDefault();
  };
  
  const handleTouchStart = (e, id) => {
    if (isComplete) return;
    
    const piece = pieces.find(p => p.id === id);
    if (!piece || piece.isPlaced) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    const touch = e.touches[0];
    const rect = container.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left - (piece.x / 100 * rect.width);
    const offsetY = touch.clientY - rect.top - (piece.y / 100 * rect.height);
    
    setActivePieceId(id);
    setDragOffset({ x: offsetX, y: offsetY });
    
    e.preventDefault();
  };
  
  const handleMouseMove = (e) => {
    if (activePieceId === null || isComplete) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left - dragOffset.x) / rect.width) * 100;
    const y = ((e.clientY - rect.top - dragOffset.y) / rect.height) * 100;
    
    // Ensure the piece stays within the container
    const clampedX = Math.max(0, Math.min(100 - 100/gridSize, x));
    const clampedY = Math.max(0, Math.min(100 - 100/gridSize, y));
    
    setPieces(pieces.map(piece => 
      piece.id === activePieceId ? { ...piece, x: clampedX, y: clampedY } : piece
    ));
  };
  
  const handleTouchMove = (e) => {
    if (activePieceId === null || isComplete) return;
    
    const touch = e.touches[0];
    const container = containerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const x = ((touch.clientX - rect.left - dragOffset.x) / rect.width) * 100;
    const y = ((touch.clientY - rect.top - dragOffset.y) / rect.height) * 100;
    
    // Ensure the piece stays within the container
    const clampedX = Math.max(0, Math.min(100 - 100/gridSize, x));
    const clampedY = Math.max(0, Math.min(100 - 100/gridSize, y));
    
    setPieces(pieces.map(piece => 
      piece.id === activePieceId ? { ...piece, x: clampedX, y: clampedY } : piece
    ));
    
    e.preventDefault();
  };
  
  const handleMouseUp = () => {
    if (activePieceId === null) return;
    
    const activePiece = pieces.find(p => p.id === activePieceId);
    if (!activePiece) {
      setActivePieceId(null);
      return;
    }
    
    // Check if piece is close to correct position
    if (checkPiecePlacement(activePiece, activePiece.x, activePiece.y)) {
      // Snap to correct position and mark as placed
      setPieces(pieces.map(piece => 
        piece.id === activePieceId 
          ? { ...piece, x: piece.correctX, y: piece.correctY, isPlaced: true } 
          : piece
      ));
    }
    
    setActivePieceId(null);
  };
  
  const handleTouchEnd = () => {
    handleMouseUp();
  };
  
  const resetPuzzle = () => {
    const newPieces = createPuzzlePieces(imageUrl, gridSize);
    setPieces(newPieces);
    setIsComplete(false);
    toast.info("Puzzle reset!");
    
    savePuzzleProgress({
      countryCode: puzzleId,
      pieces: newPieces,
      isCompleted: false,
      startedAt: Date.now(),
      puzzleType,
    });
  };

  return (
    <div className="glass-card p-6 overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">
          {puzzleType === "map" ? "Country Map Puzzle" : "Country Image Puzzle"}
        </h3>
        <button
          onClick={resetPuzzle}
          className="px-3 py-1 text-sm bg-primary/20 hover:bg-primary/30 text-primary-foreground rounded transition-colors"
        >
          Reset
        </button>
      </div>
      
      {/* Preview image */}
      <div className="mb-6">
        <img 
          src={imageUrl} 
          alt="Puzzle preview" 
          className="w-full h-48 object-cover rounded-lg mb-2 opacity-40"
        />
        <p className="text-sm text-gray-400 text-center">Drag and drop pieces to complete the puzzle</p>
      </div>
      
      {/* Puzzle container */}
      <div 
        ref={containerRef}
        className="puzzle-container relative aspect-square w-full border border-gray-700/50 rounded-lg bg-black/20 overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {pieces.map((piece) => (
          <div
            key={piece.id}
            className={`puzzle-piece absolute ${piece.isPlaced ? "border-2 border-green-500/50" : activePieceId === piece.id ? "border-2 border-primary/70 shadow-lg z-10" : "border border-gray-600/30"}`}
            style={{
              left: `${piece.x}%`,
              top: `${piece.y}%`,
              width: `${piece.width}%`,
              height: `${piece.height}%`,
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
              backgroundPosition: `${-(piece.correctX)}% ${-(piece.correctY)}%`,
              cursor: piece.isPlaced ? "default" : "grab",
            }}
            onMouseDown={(e) => handleMouseDown(e, piece.id)}
            onTouchStart={(e) => handleTouchStart(e, piece.id)}
          />
        ))}
      </div>
      
      {isComplete && (
        <div className="mt-4 text-center">
          <p className="text-green-400 font-medium mb-2">Puzzle completed! 🎉</p>
          <button
            onClick={resetPuzzle}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md transition-colors"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default PuzzleGame;
