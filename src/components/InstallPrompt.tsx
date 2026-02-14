import { useEffect, useState, useRef } from "react";
import "./InstallPrompt.css";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function getIsIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  // Standard iOS check
  if (/iPad|iPhone|iPod/.test(ua)) return true;
  // iPadOS 13+ reports as Macintosh but has multi-touch
  if (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) return true;
  return false;
}

function getIsStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as unknown as Record<string, boolean>).standalone === true
  );
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [installed, setInstalled] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (getIsStandalone()) {
      setInstalled(true);
      return;
    }

    // Check if user previously dismissed (session only)
    if (sessionStorage.getItem("install-dismissed")) {
      setDismissed(true);
      return;
    }

    // Android/Chrome: listen for native install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // iOS: show guide after page settles (longer delay for slow mobile loads)
    if (getIsIOS()) {
      timerRef.current = setTimeout(() => setShowIOSGuide(true), 2500);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("install-dismissed", "1");
    setShowIOSGuide(false);
    setDeferredPrompt(null);
  };

  // Already installed or dismissed
  if (installed || dismissed) return null;

  // Android/Chrome - native install prompt available
  if (deferredPrompt) {
    return (
      <div className="install-banner">
        <div className="install-banner-content">
          <div className="install-icon">💝</div>
          <div className="install-text">
            <strong>Add Valentine Arcade to your home screen!</strong>
            <span>Open it like a real app, anytime</span>
          </div>
        </div>
        <div className="install-actions">
          <button className="install-btn" onClick={handleInstall}>
            Install
          </button>
          <button className="install-dismiss" onClick={handleDismiss}>
            Not now
          </button>
        </div>
      </div>
    );
  }

  // iOS - show manual instructions
  if (showIOSGuide) {
    return (
      <div className="install-banner ios-guide">
        <button className="install-close" onClick={handleDismiss}>
          ×
        </button>
        <div className="install-banner-content">
          <div className="install-icon">💝</div>
          <div className="install-text">
            <strong>Add to your home screen!</strong>
            <span>So you can open it like an app</span>
          </div>
        </div>
        <ol className="ios-steps">
          <li>
            Tap the <strong>Share</strong> button{" "}
            <span className="ios-share-icon">⬆</span> at the bottom of Safari
          </li>
          <li>
            Scroll down and tap <strong>"Add to Home Screen"</strong>
          </li>
          <li>
            Tap <strong>"Add"</strong> in the top right
          </li>
        </ol>
      </div>
    );
  }

  return null;
}
