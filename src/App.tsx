import "./App.css";
import { BrowserRouter, Link, Route, Routes, useLocation } from "react-router-dom";
import { LifePage } from "./pages/LifePage";
import { ArcadePage } from "./pages/ArcadePage";
import { MapPage } from "./pages/MapPage";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";


function BottomNav() {
  const loc = useLocation();
  const onLife = loc.pathname === "/";
  const onArcade = loc.pathname.startsWith("/arcade");
  const onMap = loc.pathname.startsWith("/map");

  return (
    <nav className="bottomnav">
      <Link className={`tab ${onLife ? "active" : ""}`} to="/">
        💗 Life
      </Link>
      <Link className={`tab ${onArcade ? "active" : ""}`} to="/arcade">
        🕹️ Arcade
      </Link>
      <Link className={`tab ${onMap ? "active" : ""}`} to="/map">
        🗺️ Map
      </Link>
    </nav>
  );
}
function PageShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    setFlip(true);
    const t = window.setTimeout(() => setFlip(false), 240);
    return () => window.clearTimeout(t);
  }, [pathname]);

  return <div className={`page ${flip ? "flip" : ""}`}>{children}</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
      <PageShell>
        <Routes>
          <Route path="/" element={<LifePage />} />
          <Route path="/arcade" element={<ArcadePage />} />
          <Route path="/map" element={<MapPage />} />
        </Routes>
      </PageShell>

        <BottomNav />
      </div>
    </BrowserRouter>
  );
}
