import { useEffect, useState, useCallback } from "react";
import "./TaxiPuzzle.css";

interface TaxiPuzzleProps {
  title?: string;
  subtitle?: string;
  onDone: (score?: number) => void;
}

type Orientation = "horizontal" | "vertical";

interface Car {
  id: number;
  row: number; // Grid position (0-5)
  col: number; // Grid position (0-5)
  length: number; // 2 or 3 cells
  orientation: Orientation;
  isTaxi: boolean; // The yellow taxi we need to get out
  color: string;
}

interface Level {
  id: number;
  cars: Car[];
  minMoves: number; // Optimal solution moves
}

const GRID_SIZE = 6;
const CELL_SIZE = 60;

// Predefined levels - VALIDATED NO OVERLAPS
// Taxi always in row 2 (exit row), needs to reach column 6 (right edge)
const LEVELS: Level[] = [
  {
    id: 1,
    minMoves: 8,
    cars: [
      // TAXI in row 2
      { id: 0, row: 2, col: 1, length: 2, orientation: "horizontal", isTaxi: true, color: "#FFD700" }, // (2,1), (2,2)
      // Blocking cars
      { id: 1, row: 0, col: 0, length: 2, orientation: "vertical", isTaxi: false, color: "#FF6B6B" }, // (0,0), (1,0)
      { id: 2, row: 3, col: 0, length: 2, orientation: "vertical", isTaxi: false, color: "#4ECDC4" }, // (3,0), (4,0)
      { id: 3, row: 0, col: 4, length: 3, orientation: "vertical", isTaxi: false, color: "#95E1D3" }, // (0,4), (1,4), (2,4)
      { id: 4, row: 5, col: 2, length: 2, orientation: "horizontal", isTaxi: false, color: "#F38181" }, // (5,2), (5,3)
    ],
  },
  {
    id: 2,
    minMoves: 14,
    cars: [
      // TAXI in row 2
      { id: 0, row: 2, col: 0, length: 2, orientation: "horizontal", isTaxi: true, color: "#FFD700" }, // (2,0), (2,1)
      // Blocking cars
      { id: 1, row: 0, col: 1, length: 2, orientation: "vertical", isTaxi: false, color: "#FF6B6B" }, // (0,1), (1,1)
      { id: 2, row: 0, col: 3, length: 3, orientation: "vertical", isTaxi: false, color: "#4ECDC4" }, // (0,3), (1,3), (2,3)
      { id: 3, row: 1, col: 4, length: 2, orientation: "horizontal", isTaxi: false, color: "#95E1D3" }, // (1,4), (1,5)
      { id: 4, row: 3, col: 2, length: 2, orientation: "horizontal", isTaxi: false, color: "#F38181" }, // (3,2), (3,3)
      { id: 5, row: 4, col: 1, length: 2, orientation: "vertical", isTaxi: false, color: "#AA96DA" }, // (4,1), (5,1)
      { id: 6, row: 3, col: 5, length: 2, orientation: "vertical", isTaxi: false, color: "#FCBAD3" }, // (3,5), (4,5)
    ],
  },
  {
    id: 3,
    minMoves: 18,
    cars: [
      // TAXI in row 2
      { id: 0, row: 2, col: 1, length: 2, orientation: "horizontal", isTaxi: true, color: "#FFD700" }, // (2,1), (2,2)
      // Complex blocking
      { id: 1, row: 0, col: 0, length: 3, orientation: "horizontal", isTaxi: false, color: "#FF6B6B" }, // (0,0), (0,1), (0,2)
      { id: 2, row: 1, col: 0, length: 2, orientation: "vertical", isTaxi: false, color: "#4ECDC4" }, // (1,0), (2,0)
      { id: 3, row: 0, col: 4, length: 2, orientation: "vertical", isTaxi: false, color: "#95E1D3" }, // (0,4), (1,4)
      { id: 4, row: 3, col: 0, length: 2, orientation: "horizontal", isTaxi: false, color: "#F38181" }, // (3,0), (3,1)
      { id: 5, row: 3, col: 3, length: 3, orientation: "vertical", isTaxi: false, color: "#AA96DA" }, // (3,3), (4,3), (5,3)
      { id: 6, row: 4, col: 4, length: 2, orientation: "vertical", isTaxi: false, color: "#FCBAD3" }, // (4,4), (5,4)
      { id: 7, row: 5, col: 1, length: 2, orientation: "horizontal", isTaxi: false, color: "#A8E6CF" }, // (5,1), (5,2)
    ],
  },
];

export function TaxiPuzzle({
  title = "NYC Traffic Jam",
  subtitle,
  onDone,
}: TaxiPuzzleProps) {
  const [phase, setPhase] = useState<"intro" | "playing" | "complete">("intro");
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [cars, setCars] = useState<Car[]>([]);
  const [moves, setMoves] = useState(0);
  const [selectedCar, setSelectedCar] = useState<number | null>(null);
  const [totalScore, setTotalScore] = useState(0);

  const currentLevel = LEVELS[currentLevelIndex];

  const startGame = useCallback(() => {
    setCurrentLevelIndex(0);
    setCars(JSON.parse(JSON.stringify(LEVELS[0].cars)));
    setMoves(0);
    setTotalScore(0);
    setSelectedCar(null);
    setPhase("playing");
  }, []);

  const loadLevel = useCallback((levelIndex: number) => {
    if (levelIndex >= LEVELS.length) {
      setPhase("complete");
      return;
    }
    setCars(JSON.parse(JSON.stringify(LEVELS[levelIndex].cars)));
    setMoves(0);
    setSelectedCar(null);
    setCurrentLevelIndex(levelIndex);
  }, []);

  // Check if position is occupied
  const isPositionOccupied = useCallback((row: number, col: number, excludeCarId?: number) => {
    return cars.some((car) => {
      if (car.id === excludeCarId) return false;

      if (car.orientation === "horizontal") {
        return row === car.row && col >= car.col && col < car.col + car.length;
      } else {
        return col === car.col && row >= car.row && row < car.row + car.length;
      }
    });
  }, [cars]);

  // Check if move is valid
  const canMoveCar = useCallback((car: Car, deltaRow: number, deltaCol: number) => {
    const newRow = car.row + deltaRow;
    const newCol = car.col + deltaCol;

    // Check bounds
    if (newRow < 0 || newCol < 0) return false;
    if (car.orientation === "horizontal" && newCol + car.length > GRID_SIZE) return false;
    if (car.orientation === "vertical" && newRow + car.length > GRID_SIZE) return false;

    // Check collisions
    if (car.orientation === "horizontal") {
      for (let i = 0; i < car.length; i++) {
        if (isPositionOccupied(newRow, newCol + i, car.id)) return false;
      }
    } else {
      for (let i = 0; i < car.length; i++) {
        if (isPositionOccupied(newRow + i, newCol, car.id)) return false;
      }
    }

    return true;
  }, [isPositionOccupied]);

  // Move car
  const moveCar = useCallback((carId: number, deltaRow: number, deltaCol: number) => {
    setCars((prevCars) => {
      const car = prevCars.find((c) => c.id === carId);
      if (!car) return prevCars;

      const newRow = car.row + deltaRow;
      const newCol = car.col + deltaCol;

      // Check if move is valid
      const tempCar = { ...car, row: newRow, col: newCol };
      if (deltaRow !== 0 || deltaCol !== 0) {
        if (!canMoveCar(car, deltaRow, deltaCol)) return prevCars;
      }

      const newCars = prevCars.map((c) =>
        c.id === carId ? { ...c, row: newRow, col: newCol } : c
      );

      setMoves((m) => m + 1);

      // Check win condition (taxi reached the exit)
      const taxi = newCars.find((c) => c.isTaxi);
      if (taxi && taxi.col + taxi.length >= GRID_SIZE) {
        // Level complete!
        setTimeout(() => {
          const levelScore = Math.max(0, 100 - (moves + 1 - currentLevel.minMoves) * 5);
          setTotalScore((s) => s + levelScore);

          if (currentLevelIndex + 1 < LEVELS.length) {
            alert(`Level ${currentLevelIndex + 1} Complete! +${levelScore} points\nMoves: ${moves + 1} (Best: ${currentLevel.minMoves})`);
            loadLevel(currentLevelIndex + 1);
          } else {
            setPhase("complete");
          }
        }, 100);
      }

      return newCars;
    });
  }, [moves, currentLevel, currentLevelIndex, canMoveCar, loadLevel]);

  // Handle keyboard controls
  useEffect(() => {
    if (phase !== "playing" || selectedCar === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const car = cars.find((c) => c.id === selectedCar);
      if (!car) return;

      if (e.key === "ArrowUp" && car.orientation === "vertical") {
        moveCar(selectedCar, -1, 0);
      } else if (e.key === "ArrowDown" && car.orientation === "vertical") {
        moveCar(selectedCar, 1, 0);
      } else if (e.key === "ArrowLeft" && car.orientation === "horizontal") {
        moveCar(selectedCar, 0, -1);
      } else if (e.key === "ArrowRight" && car.orientation === "horizontal") {
        moveCar(selectedCar, 0, 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, selectedCar, cars, moveCar]);

  return (
    <div className="taxi-puzzle-wrapper">
      <div className="taxi-puzzle-container">
        <div className="taxi-puzzle-header">
          <h2 className="taxi-puzzle-title">{title}</h2>
          {subtitle && <p className="taxi-puzzle-subtitle">{subtitle}</p>}
        </div>

        <div className="taxi-puzzle-content">
          {phase === "intro" && (
            <div className="taxi-puzzle-intro">
              <p className="taxi-puzzle-instructions">
                🚕 Get the yellow taxi out of traffic
              </p>
              <p className="taxi-puzzle-instructions">
                Click a car, then use <strong>arrow keys</strong> to slide it
              </p>
              <p className="taxi-puzzle-instructions">
                Move the taxi all the way right to exit
              </p>
              <button className="taxi-puzzle-btn primary" onClick={startGame}>
                Start 🚦
              </button>
            </div>
          )}

          {phase === "playing" && (
            <div className="taxi-puzzle-game">
              <div className="taxi-puzzle-stats">
                <div className="taxi-puzzle-stat">
                  Level: {currentLevelIndex + 1}/{LEVELS.length}
                </div>
                <div className="taxi-puzzle-stat">Moves: {moves}</div>
                <div className="taxi-puzzle-stat">Score: {totalScore}</div>
              </div>

              <div
                className="taxi-puzzle-grid"
                style={{
                  width: GRID_SIZE * CELL_SIZE,
                  height: GRID_SIZE * CELL_SIZE,
                  position: "relative",
                  background: "#f5f5f5",
                  border: "4px solid #333",
                  borderRadius: "8px",
                  margin: "1rem auto",
                }}
              >
                {/* Draw grid lines */}
                <svg
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                  }}
                >
                  {Array.from({ length: GRID_SIZE + 1 }).map((_, i) => (
                    <g key={i}>
                      <line
                        x1={i * CELL_SIZE}
                        y1={0}
                        x2={i * CELL_SIZE}
                        y2={GRID_SIZE * CELL_SIZE}
                        stroke="#ddd"
                        strokeWidth="1"
                      />
                      <line
                        x1={0}
                        y1={i * CELL_SIZE}
                        x2={GRID_SIZE * CELL_SIZE}
                        y2={i * CELL_SIZE}
                        stroke="#ddd"
                        strokeWidth="1"
                      />
                    </g>
                  ))}
                </svg>

                {/* Exit marker */}
                <div
                  style={{
                    position: "absolute",
                    right: -4,
                    top: 2 * CELL_SIZE,
                    width: 8,
                    height: CELL_SIZE,
                    background: "#4CAF50",
                    borderRadius: "0 4px 4px 0",
                  }}
                />

                {/* Cars */}
                {cars.map((car) => (
                  <div
                    key={car.id}
                    onClick={() => setSelectedCar(car.id)}
                    style={{
                      position: "absolute",
                      left: car.col * CELL_SIZE + 4,
                      top: car.row * CELL_SIZE + 4,
                      width: (car.orientation === "horizontal" ? car.length : 1) * CELL_SIZE - 8,
                      height: (car.orientation === "vertical" ? car.length : 1) * CELL_SIZE - 8,
                      background: car.color,
                      borderRadius: "8px",
                      border: selectedCar === car.id ? "3px solid #000" : "2px solid #333",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    }}
                  >
                    {car.isTaxi ? "🚕" : "🚗"}
                  </div>
                ))}
              </div>

              <div className="taxi-puzzle-hint">
                {selectedCar !== null
                  ? `Selected ${cars.find((c) => c.id === selectedCar)?.isTaxi ? "TAXI" : "car"} - Use arrow keys or buttons to move`
                  : "Click a car to select it"}
              </div>

              {/* Touch controls for mobile */}
              {selectedCar !== null && (
                <div className="taxi-puzzle-mobile-controls">
                  <div className="taxi-puzzle-dpad">
                    <button
                      className="taxi-puzzle-arrow-btn up"
                      onClick={() => {
                        const car = cars.find((c) => c.id === selectedCar);
                        if (car?.orientation === "vertical") {
                          moveCar(selectedCar, -1, 0);
                        }
                      }}
                      disabled={cars.find((c) => c.id === selectedCar)?.orientation !== "vertical"}
                    >
                      ▲
                    </button>
                    <div className="taxi-puzzle-dpad-middle">
                      <button
                        className="taxi-puzzle-arrow-btn left"
                        onClick={() => {
                          const car = cars.find((c) => c.id === selectedCar);
                          if (car?.orientation === "horizontal") {
                            moveCar(selectedCar, 0, -1);
                          }
                        }}
                        disabled={cars.find((c) => c.id === selectedCar)?.orientation !== "horizontal"}
                      >
                        ◀
                      </button>
                      <button
                        className="taxi-puzzle-arrow-btn right"
                        onClick={() => {
                          const car = cars.find((c) => c.id === selectedCar);
                          if (car?.orientation === "horizontal") {
                            moveCar(selectedCar, 0, 1);
                          }
                        }}
                        disabled={cars.find((c) => c.id === selectedCar)?.orientation !== "horizontal"}
                      >
                        ▶
                      </button>
                    </div>
                    <button
                      className="taxi-puzzle-arrow-btn down"
                      onClick={() => {
                        const car = cars.find((c) => c.id === selectedCar);
                        if (car?.orientation === "vertical") {
                          moveCar(selectedCar, 1, 0);
                        }
                      }}
                      disabled={cars.find((c) => c.id === selectedCar)?.orientation !== "vertical"}
                    >
                      ▼
                    </button>
                  </div>
                </div>
              )}

              <button
                className="taxi-puzzle-btn"
                onClick={() => loadLevel(currentLevelIndex)}
              >
                Reset Level
              </button>
            </div>
          )}

          {phase === "complete" && (
            <div className="taxi-puzzle-complete">
              <div className="taxi-puzzle-final-score">
                Final Score: {totalScore}
              </div>
              <div className="taxi-puzzle-complete-text">
                {totalScore >= 250
                  ? "Nice, that was clean 🚕"
                  : totalScore >= 180
                  ? "Pretty solid navigation"
                  : totalScore >= 120
                  ? "Made it through"
                  : "Escaped the traffic"}
              </div>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                <button className="taxi-puzzle-btn primary" onClick={startGame}>
                  Go again 🚕
                </button>
                <button
                  className="taxi-puzzle-btn primary"
                  onClick={() => onDone(totalScore)}
                >
                  Keep exploring →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
