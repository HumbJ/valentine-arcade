import { useEffect, useMemo, useRef, useState } from "react";

type Piece = {
  id: number;
  r: number;
  c: number;
  x: number;
  y: number;
  placed: boolean;
  z: number;
};

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function JigsawGate({
  imageSrc,
  rows = 3,
  cols = 3,
  title = "Unlock this memory",
  onSolved,
  onClose,
}: {
  imageSrc: string;
  rows?: number;
  cols?: number;
  title?: string;
  onSolved: () => void;
  onClose: () => void;
}) {
  const stageRef = useRef<HTMLDivElement | null>(null);

  // Stage size (responsive)
  const [stageW, setStageW] = useState(340);
  const [stageH, setStageH] = useState(340);

  // Drag state
  const dragRef = useRef<{
    id: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  const pieceW = Math.floor(stageW / cols);
  const pieceH = Math.floor(stageH / rows);
  const bleed = 1;

  const targets = useMemo(() => {
    // target positions for each (r,c)
    const map = new Map<number, { tx: number; ty: number }>();
    let id = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        map.set(id, { tx: c * pieceW, ty: r * pieceH });
        id++;
      }
    }
    return map;
  }, [rows, cols, pieceW, pieceH]);

  const [pieces, setPieces] = useState<Piece[]>(() => []);

  // Initialize pieces when stage dims are known
  useEffect(() => {
    if (!stageRef.current) return;

    const rect = stageRef.current.getBoundingClientRect();
    const size = Math.floor(Math.min(rect.width, 360)); // cap for comfy mobile
    setStageW(size);
    setStageH(size);
  }, []);

  useEffect(() => {
    // Build solved pieces then scatter them around the stage edges
    const base: Piece[] = [];
    let id = 0;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        base.push({
          id,
          r,
          c,
          x: 0,
          y: 0,
          placed: false,
          z: id,
        });
        id++;
      }
    }

    const scattered = shuffle(base).map((p, idx) => {
      // scatter in a “ring” around the stage (still within overlay)
      // We’ll place them within the stage bounds but away from targets.
      const margin = 10;
      const maxX = Math.max(margin, stageW - pieceW - margin);
      const maxY = Math.max(margin, stageH - pieceH - margin);

      // random positions, but not too close to perfect target initially
      const x = Math.floor(Math.random() * maxX);
      const y = Math.floor(Math.random() * maxY);

      return { ...p, x, y, z: 100 + idx };
    });

    setPieces(scattered);
  }, [rows, cols, stageW, stageH, pieceW, pieceH]);

  const solvedCount = pieces.filter((p) => p.placed).length;
  const totalCount = rows * cols;
  const solved = solvedCount === totalCount && totalCount > 0;

  function bringToFront(id: number) {
    setPieces((prev) => {
      const maxZ = prev.reduce((m, p) => Math.max(m, p.z), 0);
      return prev.map((p) => (p.id === id ? { ...p, z: maxZ + 1 } : p));
    });
  }

  function onPointerDown(e: React.PointerEvent, id: number) {
    const el = e.currentTarget as HTMLDivElement;
    const rect = el.getBoundingClientRect();

    // If already placed, ignore
    const p = pieces.find((x) => x.id === id);
    if (!p || p.placed) return;

    bringToFront(id);
    el.setPointerCapture(e.pointerId);

    dragRef.current = {
      id,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragRef.current) return;
    const { id, offsetX, offsetY } = dragRef.current;

    const stage = stageRef.current;
    if (!stage) return;
    const srect = stage.getBoundingClientRect();

    const nx = e.clientX - srect.left - offsetX;
    const ny = e.clientY - srect.top - offsetY;

    setPieces((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              x: clamp(nx, 0, stageW - pieceW),
              y: clamp(ny, 0, stageH - pieceH),
            }
          : p
      )
    );
  }

  function onPointerUp() {
    if (!dragRef.current) return;
    const { id } = dragRef.current;
    dragRef.current = null;

    // Snap check
    setPieces((prev) => {
      const next = prev.map((p) => {
        if (p.id !== id) return p;

        const t = targets.get(p.id);
        if (!t) return p;

        // snap threshold
        const dx = Math.abs(p.x - t.tx);
        const dy = Math.abs(p.y - t.ty);
        const thresh = Math.max(14, Math.floor(Math.min(pieceW, pieceH) * 0.18));

        if (dx <= thresh && dy <= thresh) {
          return { ...p, x: t.tx, y: t.ty, placed: true };
        }
        return p;
      });

      return next;
    });
  }

  return (
    <div className="jg-overlay" onClick={onClose}>
      <div className="jg-stageWrap" onClick={(e) => e.stopPropagation()}>
        <div className="jg-title">{title}</div>
        <div className="jg-sub">
          Drag the pieces into place to unlock the memory 💗
        </div>

        <div
          className={`jg-stage ${solved ? "solved" : ""}`}
          ref={stageRef}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {/* faint solved image in the background (hint) */}
          <div
  className={`jg-hintImg ${solved ? "solved" : ""}`}
  style={{ backgroundImage: `url(${imageSrc})` }}
/>

          {pieces
            .slice()
            .sort((a, b) => a.z - b.z)
            .map((p) => {
              const bgX = -(p.c * pieceW);
              const bgY = -(p.r * pieceH);

              return (
                <div
                  key={p.id}
                  className={`jg-piece ${p.placed ? "placed" : ""}`}
                  style={{
  width: pieceW + bleed * 2,
  height: pieceH + bleed * 2,
  transform: `translate(${p.x - bleed}px, ${p.y - bleed}px)`,
  zIndex: p.z,
  backgroundImage: `url(${imageSrc})`,
  backgroundSize: `${pieceW * cols}px ${pieceH * rows}px`,
  backgroundPosition: `${bgX - bleed}px ${bgY - bleed}px`,
}}
                  onPointerDown={(e) => onPointerDown(e, p.id)}
                />
              );
            })}
        </div>

        <div className="jg-footer">
          <div className="jg-progress">
            {solvedCount} / {totalCount} placed
          </div>

          {solved ? (
            <button className="jg-btn primary" onClick={onSolved}>
              Memory Unlocked ✨
            </button>
          ) : (
            <button className="jg-btn" onClick={onClose}>
              Not now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
