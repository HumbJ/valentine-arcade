import { useEffect, useState } from "react";

export function EndCreditsOverlay({
  line,
  onDone,
}: {
  line: string;
  onDone: () => void;
}) {
  const [step, setStep] = useState<"fade" | "line" | "credits">("fade");

  useEffect(() => {
    const t1 = window.setTimeout(() => setStep("line"), 700);
    const t2 = window.setTimeout(() => setStep("credits"), 2100);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  return (
    <div className="overlay end-finale" role="dialog" aria-modal="true">
      <div className="overlay-card end-card">
        <div className={`end-step ${step !== "fade" ? "show" : ""}`}>
          <div className="end-kicker">The End</div>
        </div>

        <div className={`end-step ${step === "line" || step === "credits" ? "show" : ""}`}>
          <div className="end-line">“{line}”</div>
        </div>

        <div className={`end-step ${step === "credits" ? "show" : ""}`}>
          <div className="end-credits">
            <div className="end-credit-row">
              <span>Made with love by</span>
              <strong>us</strong>
            </div>
            <div className="end-credit-row">
              <span>Starring</span>
              <strong>us</strong>
            </div>
            <div className="end-credit-row">
              <span>And a thousand tiny moments</span>
              <strong>worth keeping</strong>
            </div>
          </div>

          <button className="btn end-btn" onClick={onDone}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
