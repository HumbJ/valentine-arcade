import { useEffect, useState } from "react";
import "./InstallPrompt.css";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [installed, setInstalled] = useState(false);

  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !(window as unknown as Record<string, unknown>).MSStream;
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as unknown as Record<string, boolean>).standalone === true;

  useEffect(() => {
    if (isStandalone) {
      setInstalled(true);
      return;
    }

    // Check if user previously dismissed
    const prev = sessionStorage.getItem("install-dismissed");
    if (prev) {
      setDismissed(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Show iOS guide after a short delay if on iOS and not installed
    if (isIOS) {
      const t = setTimeout(() => setShowIOSGuide(true), 1500);
      return () => {
        clearTimeout(t);
        window.removeEventListener("beforeinstallprompt", handler);
      };
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, [isIOS, isStandalone]);

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
  if (showIOSGuide && isIOS) {
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
