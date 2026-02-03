import { useMemo, useState } from "react";

export function ReflectionGate({
  title,
  subtitle,
  prompt,
  onSave,
  onSkip,
}: {
  title?: string;
  subtitle?: string;
  prompt: string;
  onSave: (text: string) => void;
  onSkip: () => void;
}) {
  const [text, setText] = useState("");
  const canSave = useMemo(() => text.trim().length >= 2, [text]);

  return (
    <div className="overlay" role="dialog" aria-modal="true">
      <div className="overlay-card reflection-card">
        <div className="overlay-title">{title ?? "Stay here a moment"}</div>
        {subtitle ? <div className="overlay-sub">{subtitle}</div> : null}

        <p className="story" style={{ marginTop: 12 }}>
          {prompt}
        </p>

        <textarea
          className="reflection-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Only if you want to…"
          rows={6}
        />

        <div className="reflection-actions">
          <button className="ghost" onClick={onSkip}>
            Maybe later
          </button>

          <button className="btn" disabled={!canSave} onClick={() => onSave(text.trim())}>
            Save
          </button>
        </div>

        <div className="muted" style={{ marginTop: 10, fontSize: 12, opacity: 0.75 }}>
          This stays on your phone unless you choose to share it later.
        </div>
      </div>
    </div>
  );
}
