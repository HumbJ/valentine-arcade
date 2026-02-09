import { useState, useCallback, useEffect, useRef } from "react";
import "./BouquetRush.css";

type GamePhase = "intro" | "playing" | "complete";

interface Flower {
  id: string;
  emoji: string;
  color: string;
  name: string;
}

interface Order {
  id: number;
  flowers: Flower[];
  timeRemaining: number;
  maxTime: number;
}

const FLOWERS: Flower[] = [
  { id: "rose", emoji: "🌹", color: "#ff1744", name: "Rose" },
  { id: "tulip", emoji: "🌷", color: "#e91e63", name: "Tulip" },
  { id: "sunflower", emoji: "🌻", color: "#ffc107", name: "Sunflower" },
  { id: "daisy", emoji: "🌼", color: "#9c27b0", name: "Daisy" },
  { id: "blossom", emoji: "🌸", color: "#f48fb1", name: "Blossom" },
  { id: "hibiscus", emoji: "🌺", color: "#d81b60", name: "Hibiscus" },
];

const GAME_DURATION = 30000; // 30 seconds
const BASE_ORDER_TIME = 12000; // 12 seconds per order

export function BouquetRush({
  title,
  subtitle,
  onDone,
}: {
  title?: string;
  subtitle?: string;
  onDone: () => void;
}) {
  const [phase, setPhase] = useState<GamePhase>("intro");
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentBouquet, setCurrentBouquet] = useState<Flower[]>([]);
  const [score, setScore] = useState(0);
  const [ordersCompleted, setOrdersCompleted] = useState(0);
  const [ordersFailed, setOrdersFailed] = useState(0);

  const gameStartTimeRef = useRef(0);
  const nextOrderIdRef = useRef(0);
  const lastSpawnTimeRef = useRef(0);
  const gameLoopRef = useRef<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(GAME_DURATION);

  // Generate a random bouquet order
  const generateOrder = useCallback((): Order => {
    const numFlowers = 2 + Math.floor(Math.random() * 3); // 2-4 flowers
    const orderFlowers: Flower[] = [];

    for (let i = 0; i < numFlowers; i++) {
      const flower = FLOWERS[Math.floor(Math.random() * FLOWERS.length)];
      orderFlowers.push(flower);
    }

    return {
      id: nextOrderIdRef.current++,
      flowers: orderFlowers,
      timeRemaining: BASE_ORDER_TIME,
      maxTime: BASE_ORDER_TIME,
    };
  }, []);

  // Add flower to current bouquet
  const addFlower = (flower: Flower) => {
    if (phase !== "playing") return;
    if (currentBouquet.length >= 4) return; // Max 4 flowers per bouquet

    setCurrentBouquet((prev) => [...prev, flower]);
  };

  // Clear current bouquet
  const clearBouquet = () => {
    setCurrentBouquet([]);
  };

  // Check if current bouquet matches the order
  const checkMatch = (orderFlowers: Flower[], bouquet: Flower[]): boolean => {
    if (orderFlowers.length !== bouquet.length) return false;

    for (let i = 0; i < orderFlowers.length; i++) {
      if (orderFlowers[i].id !== bouquet[i].id) return false;
    }

    return true;
  };

  // Submit current bouquet for the first order
  const submitBouquet = () => {
    if (currentBouquet.length === 0) return;
    if (orders.length === 0) return;

    const currentOrder = orders[0];
    const isCorrect = checkMatch(currentOrder.flowers, currentBouquet);

    if (isCorrect) {
      // Correct! Calculate score based on time remaining
      const timeBonus = Math.floor((currentOrder.timeRemaining / currentOrder.maxTime) * 50);
      const baseScore = 100;
      setScore((s) => s + baseScore + timeBonus);
      setOrdersCompleted((c) => c + 1);

      // Remove the completed order and immediately spawn a new one if there's room
      setOrders((prev) => {
        const remaining = prev.slice(1);
        if (remaining.length < 3) {
          return [...remaining, generateOrder()];
        }
        return remaining;
      });
    } else {
      // Wrong! Just clear and let them try again (small penalty)
      setScore((s) => Math.max(0, s - 10));
    }

    setCurrentBouquet([]);
  };

  // Game loop
  useEffect(() => {
    if (phase !== "playing") return;

    gameStartTimeRef.current = Date.now();
    lastSpawnTimeRef.current = Date.now();
    nextOrderIdRef.current = 0;

    // Spawn first order immediately
    setOrders([generateOrder()]);

    const loop = () => {
      const now = Date.now();
      const elapsed = now - gameStartTimeRef.current;
      const remaining = Math.max(0, GAME_DURATION - elapsed);

      setTimeRemaining(remaining);

      if (remaining <= 0) {
        setPhase("complete");
        return;
      }

      // Spawn new orders periodically (every 4-7 seconds if there's room)
      // Check current orders length inside the state update to avoid dependency
      setOrders((currentOrders) => {
        if (currentOrders.length < 3 && now - lastSpawnTimeRef.current > 4000 + Math.random() * 3000) {
          lastSpawnTimeRef.current = now;
          return [...currentOrders, generateOrder()];
        }
        return currentOrders;
      });

      // Update order timers
      setOrders((prev) => {
        const updated = prev.map((order) => ({
          ...order,
          timeRemaining: Math.max(0, order.timeRemaining - 16), // ~60fps
        }));

        // Remove expired orders and count as failed
        const expired = updated.filter((o) => o.timeRemaining <= 0);
        if (expired.length > 0) {
          setOrdersFailed((f) => f + expired.length);
          setScore((s) => Math.max(0, s - 50 * expired.length)); // Big penalty
        }

        return updated.filter((o) => o.timeRemaining > 0);
      });

      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [phase, generateOrder]);

  // Start game
  const startGame = () => {
    setPhase("playing");
    setOrders([]);
    setCurrentBouquet([]);
    setScore(0);
    setOrdersCompleted(0);
    setOrdersFailed(0);
    setTimeRemaining(GAME_DURATION);
  };

  return (
    <div className="br-overlay">
      <div className="br-wrap">
        <div className="br-content">
          <div className="br-title">{title ?? "Bouquet Rush"}</div>
          <div className="br-subtitle">
            {subtitle ?? "Fulfill flower orders!"}
          </div>

          {phase === "intro" && (
            <div className="br-intro">
              <div className="br-intro-text">
                The flower field is bustling! Customers need bouquets, and you're
                the florist. Match their orders exactly and quickly!
                <br /><br />
                <strong>How to play:</strong>
                <br />
                • Customers show what flowers they want (in order)
                <br />
                • Click flowers to add them to your bouquet
                <br />
                • Match the order exactly (same flowers, same order)
                <br />
                • Submit when ready!
                <br />• Don't let customers wait too long!
              </div>
              <button className="br-btn primary" onClick={startGame}>
                Start serving! 🌸
              </button>
            </div>
          )}

          {phase === "playing" && (
            <div className="br-playing">
              <div className="br-header">
                <div className="br-stat">
                  <span className="br-stat-label">Score:</span>
                  <span className="br-stat-value">{score}</span>
                </div>
                <div className="br-stat">
                  <span className="br-stat-label">Time:</span>
                  <span className="br-stat-value">{Math.ceil(timeRemaining / 1000)}s</span>
                </div>
                <div className="br-stat">
                  <span className="br-stat-label">Completed:</span>
                  <span className="br-stat-value">{ordersCompleted}</span>
                </div>
              </div>

              {/* Customer Orders */}
              <div className="br-orders">
                {orders.length === 0 && <div className="br-no-orders">Waiting for customers...</div>}
                {orders.map((order, index) => (
                  <div key={order.id} className={`br-order ${index === 0 ? "active" : ""}`}>
                    <div className="br-order-header">
                      <span className="br-order-label">
                        {index === 0 ? "Current Order" : `Order ${index + 1}`}
                      </span>
                      <div className="br-order-timer">
                        <div
                          className="br-order-timer-bar"
                          style={{
                            width: `${(order.timeRemaining / order.maxTime) * 100}%`,
                            backgroundColor:
                              order.timeRemaining < 5000
                                ? "#f44336"
                                : order.timeRemaining < 10000
                                ? "#ff9800"
                                : "#4caf50",
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="br-order-flowers">
                      {order.flowers.map((flower, i) => (
                        <span key={i} className="br-order-flower">
                          {flower.emoji}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Current Bouquet Being Built */}
              <div className="br-workspace">
                <div className="br-workspace-header">Your Bouquet:</div>
                <div className="br-current-bouquet">
                  {currentBouquet.length === 0 && (
                    <span className="br-empty-text">Click flowers below to add</span>
                  )}
                  {currentBouquet.map((flower, i) => (
                    <span key={i} className="br-bouquet-flower">
                      {flower.emoji}
                    </span>
                  ))}
                </div>
                <div className="br-workspace-actions">
                  <button className="br-action-btn clear" onClick={clearBouquet}>
                    Clear
                  </button>
                  <button
                    className="br-action-btn submit"
                    onClick={submitBouquet}
                    disabled={currentBouquet.length === 0}
                  >
                    Submit 📦
                  </button>
                </div>
              </div>

              {/* Flower Selection */}
              <div className="br-flower-selection">
                {FLOWERS.map((flower) => (
                  <button
                    key={flower.id}
                    className="br-flower-btn"
                    onClick={() => addFlower(flower)}
                    style={{
                      borderColor: flower.color,
                    }}
                  >
                    <span className="br-flower-emoji">{flower.emoji}</span>
                    <span className="br-flower-name">{flower.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {phase === "complete" && (
            <div className="br-complete">
              <div className="br-complete-emoji">💐</div>
              <div className="br-final-score">Final Score: {score}</div>
              <div className="br-stats-summary">
                <div className="br-stat-item">✅ {ordersCompleted} completed</div>
                <div className="br-stat-item">❌ {ordersFailed} failed</div>
              </div>
              <div className="br-complete-text">
                {score >= 800
                  ? "Master florist! Those customers were delighted! 🌸"
                  : score >= 500
                  ? "Great work! The flower field is proud! 🌷"
                  : "Not bad! You're getting the hang of it! 🌻"}
              </div>
              <button className="br-btn primary" onClick={onDone}>
                Back to the field →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
