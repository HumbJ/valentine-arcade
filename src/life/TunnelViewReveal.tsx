import { useRef, useState, useEffect, useCallback } from "react";
import "./TunnelViewReveal.css";

export function TunnelViewReveal({
  imageSrc,
  title,
  subtitle,
  onDone,
}: {
  imageSrc: string;
  title?: string;
  subtitle?: string;
  onDone: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Initialize the fog layer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = 350;
    canvas.height = 250;

    // Draw fog layer (gradient gray)
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#a0a0a0");
    gradient.addColorStop(0.5, "#c0c0c0");
    gradient.addColorStop(1, "#909090");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add some noise/texture to the fog
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const r = Math.random() * 20 + 5;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    setImageLoaded(true);
  }, []);

  // Calculate revealed percentage
  const calculateRevealed = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;

    const ctx = canvas.getContext("2d");
    if (!ctx) return 0;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;

    // Count pixels that are mostly transparent (alpha < 128)
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] < 128) transparent++;
    }

    return (transparent / (pixels.length / 4)) * 100;
  }, []);

  // Scratch/wipe function
  const scratch = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.globalCompositeOperation = "destination-out";

    // Create a soft brush effect
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 40);
    gradient.addColorStop(0, "rgba(0, 0, 0, 1)");
    gradient.addColorStop(0.5, "rgba(0, 0, 0, 0.5)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, 40, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalCompositeOperation = "source-over";

    // Update revealed percentage
    const pct = calculateRevealed();
    setRevealed(pct);

    if (pct >= 50 && !isComplete) {
      setIsComplete(true);
    }
  }, [calculateRevealed, isComplete]);

  // Mouse/touch event handlers
  const getCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ("touches" in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const { x, y } = getCoords(e);
    scratch(x, y);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getCoords(e);
    scratch(x, y);
  };

  // Add document-level listeners for move/end to continue drawing outside canvas
  useEffect(() => {
    const handleDocumentMove = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      e.preventDefault();
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      let x, y;
      if (e instanceof TouchEvent) {
        const touch = e.touches[0];
        if (!touch) return;
        x = (touch.clientX - rect.left) * scaleX;
        y = (touch.clientY - rect.top) * scaleY;
      } else {
        x = (e.clientX - rect.left) * scaleX;
        y = (e.clientY - rect.top) * scaleY;
      }

      // Clamp coordinates to canvas bounds
      x = Math.max(0, Math.min(canvas.width, x));
      y = Math.max(0, Math.min(canvas.height, y));

      scratch(x, y);
    };

    const handleDocumentEnd = () => {
      setIsDrawing(false);
    };

    if (isDrawing) {
      document.addEventListener("mousemove", handleDocumentMove);
      document.addEventListener("mouseup", handleDocumentEnd);
      document.addEventListener("touchmove", handleDocumentMove, { passive: false });
      document.addEventListener("touchend", handleDocumentEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleDocumentMove);
      document.removeEventListener("mouseup", handleDocumentEnd);
      document.removeEventListener("touchmove", handleDocumentMove);
      document.removeEventListener("touchend", handleDocumentEnd);
    };
  }, [isDrawing, scratch]);

  return (
    <div className="tvr-overlay">
      <div className="tvr-wrap">
        <div className="tvr-title">{title ?? "Tunnel View"}</div>
        <div className="tvr-subtitle">
          {subtitle ?? "Wipe away the fog to reveal the magic"}
        </div>

        <div className="tvr-scratch-area">
          {/* Background image */}
          {imageSrc && (
            <img
              src={imageSrc}
              alt="Tunnel View"
              className="tvr-image"
            />
          )}

          {/* Fog canvas overlay */}
          <canvas
            ref={canvasRef}
            className="tvr-canvas"
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            style={{ touchAction: "none" }}
          />

          {!imageLoaded && (
            <div className="tvr-loading">Loading...</div>
          )}
        </div>

        <div className="tvr-progress">
          <div className="tvr-progress-bar">
            <div
              className="tvr-progress-fill"
              style={{ width: `${Math.min(revealed, 100)}%` }}
            />
          </div>
          <div className="tvr-progress-text">
            {Math.round(revealed)}% revealed
          </div>
        </div>

        {isComplete && (
          <div className="tvr-complete">
            <div className="tvr-complete-text">
              And there it is... the view that takes your breath away
            </div>
            <button className="tvr-btn" onClick={onDone}>
              Take it all in →
            </button>
          </div>
        )}

        {!isComplete && (
          <div className="tvr-hint">
            Swipe or drag to clear the fog
          </div>
        )}
      </div>
    </div>
  );
}
