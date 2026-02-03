import "./App.css";
import { BrowserRouter, Link, Route, Routes, useLocation } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { LifePage } from "./pages/LifePage";
import { ArcadePage } from "./pages/ArcadePage";
import { MapPage } from "./pages/MapPage";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";


function BottomNav() {
  const loc = useLocation();
  const onHome = loc.pathname === "/";
  const onStory = loc.pathname.startsWith("/story");
  const onMap = loc.pathname.startsWith("/map");

  return (
    <nav className="bottomnav">
      <Link className={`tab ${onHome ? "active" : ""}`} to="/">
        🏠 Home
      </Link>
      <Link className={`tab ${onStory ? "active" : ""}`} to="/story">
        💗 Story
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
          <Route path="/" element={<HomePage />} />
          <Route path="/story" element={<LifePage />} />
          <Route path="/arcade" element={<ArcadePage />} />
          <Route path="/map" element={<MapPage />} />
          {/* Placeholder routes for hub zones - can be expanded later */}
          <Route path="/dates" element={<LifePage />} />
          <Route path="/food" element={<ArcadePage />} />
          <Route path="/friends" element={<ArcadePage />} />
        </Routes>
      </PageShell>

        <BottomNav />
      </div>
    </BrowserRouter>
  );
}
