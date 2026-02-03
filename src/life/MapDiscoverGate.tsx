import { useMemo, useState } from "react";
import { DISCOVER_MAPS } from "./maps";

export function MapDiscoverGate({
  mapId,
  title,
  subtitle,
  onSolved,
  onClose,
}: {
  mapId: string;
  title?: string;
  subtitle?: string;
  onSolved: () => void;
  onClose: () => void;
}) {
  const map = DISCOVER_MAPS[mapId];

  const [found, setFound] = useState<Record<string, boolean>>({});
  const [lastFoundId, setLastFoundId] = useState<string | null>(null);
  const [pingId, setPingId] = useState<string | null>(null);
  const [missPing, setMissPing] = useState<null | { xPct: number; yPct: number }>(null);


  const hotspots = map?.hotspots ?? [];
  const total = hotspots.length;

  const foundCount = useMemo(() => {
    return hotspots.reduce((acc, h) => acc + (found[h.id] ? 1 : 0), 0);
  }, [hotspots, found]);

  const solved = total > 0 && foundCount === total;
  const headline = title ?? map?.prompt ?? "What did we explore?";
const subline = subtitle ?? map?.hint ?? "Tap each pin to discover it.";

  const lastLabel =
    lastFoundId ? hotspots.find((h) => h.id === lastFoundId)?.label : null;

  if (!map) {
    return (
      <div className="mdg-overlay" onClick={onClose}>
        <div className="mdg-wrap" onClick={(e) => e.stopPropagation()}>
          <div className="mdg-title">Missing map</div>
          <div className="mdg-sub">
            I couldn't find the <b>{mapId}</b> map config.
          </div>
          <div className="mdg-footer">
            <button className="mdg-btn" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  function tapHotspot(id: string) {
  setFound((prev) => {
    if (prev[id]) return prev;
    return { ...prev, [id]: true };
  });
  setLastFoundId(id);
  setPingId(id);
  window.setTimeout(() => setPingId(null), 350);
}

  return (
    <div className="mdg-overlay" onClick={onClose}>
      <div className="mdg-wrap" onClick={(e) => e.stopPropagation()}>
        <div className="mdg-title">{headline}</div>
        <div className="mdg-sub">{subline}</div>

       <div
  className={`mdg-map ${solved ? "solved" : ""}`}
  onClick={(e) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();

    // Click position as % inside the map container
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;

    // Find first undiscovered hotspot that matches
    const hit = hotspots.find((h) => {
      if (found[h.id]) return false;
      const dx = xPct - h.xPct;
      const dy = yPct - h.yPct;
      const dist = Math.sqrt(dx * dx + dy * dy);
      return dist <= h.rPct;
    });

    if (hit) {
      tapHotspot(hit.id);
    } else {
      setMissPing({ xPct, yPct });
      window.setTimeout(() => setMissPing(null), 350);
    }
  }}
>
  {map.backgroundSrc ? (
    <img className="mdg-bg" src={map.backgroundSrc} alt="" />
  ) : null}

  {/* Optional: subtle "found" dots so she sees progress on the map */}
  {hotspots.map((h) =>
    found[h.id] ? (
     <div
  key={h.id}
  className={`mdg-foundDot ${pingId === h.id ? "ping" : ""}`}
  style={{
    left: `${h.xPct}%`,
    top: `${h.yPct}%`,
    // Bigger rPct => bigger glow.
    // Seattle ~7 => ~1.0 scale, Rainier ~10 => ~1.25, Olympic/Cascades ~16 => ~1.8
    ["--glowScale" as any]: String(Math.max(0.9, h.rPct / 7)),
  }}
  aria-hidden="true"
/>
    ) : null
  )}
{hotspots.map((h) =>
  found[h.id] ? (
    <div
      key={`${h.id}-label`}
      className="mdg-mapLabel"
      style={{ left: `${h.xPct}%`, top: `${h.yPct}%` }}
      aria-hidden="true"
    >
      {h.label}
    </div>
  ) : null
)}

  {missPing ? (
    <div
      className="mdg-miss"
      style={{ left: `${missPing.xPct}%`, top: `${missPing.yPct}%` }}
      aria-hidden="true"
    />
  ) : null}
</div>

        <div className="mdg-checklist" aria-live="polite">
  <div className="mdg-checkHeader">
    <span className="mdg-foundCount">{foundCount} / {total} found</span>
  </div>

  <ul className="mdg-checkItems">
    {hotspots.map((h) => {
      const ok = !!found[h.id];
      return (
        <li key={h.id} className={`mdg-checkItem ${ok ? "ok" : ""}`}>
          <span className="mdg-checkIcon">{ok ? "✓" : "•"}</span>
          <span className="mdg-checkText">{ok ? h.label : "???"}</span>
        </li>
      );
    })}
  </ul>
</div>


        <div className="mdg-footer">
          <div className="mdg-progress">
            {foundCount} / {total} discovered
            {lastLabel ? <span className="mdg-last"> · {lastLabel} ✨</span> : null}
          </div>

          {solved ? (
            <button className="mdg-btn primary" onClick={onSolved}>
              Continue ✨
            </button>
          ) : (
            <button className="mdg-btn" onClick={onClose}>
              Not now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
