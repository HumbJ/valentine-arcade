import "./App.css";
import { BrowserRouter, Link, Route, Routes, useLocation } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { LifePage } from "./pages/LifePage";
import { ArcadePage } from "./pages/ArcadePage";
import { MapPage } from "./pages/MapPage";
import { MiniGamesPage } from "./pages/MiniGamesPage";
import { MemoriesPage } from "./pages/MemoriesPage";
import { VideosPage } from "./pages/VideosPage";
import { FoodRoulettePage } from "./pages/FoodRoulettePage";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { InstallPrompt } from "./components/InstallPrompt";


function BottomNav() {
  const loc = useLocation();
  const onHome = loc.pathname === "/";
  const onGames = loc.pathname.startsWith("/mini-games");
  const onMap = loc.pathname.startsWith("/map");

  return (
    <nav className="bottomnav">
      <Link className={`tab ${onHome ? "active" : ""}`} to="/">
        🏠 Home
      </Link>
      <Link className={`tab ${onGames ? "active" : ""}`} to="/mini-games">
        🎮 Mini-Games
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
          <Route path="/mini-games" element={<MiniGamesPage />} />
          <Route path="/arcade" element={<ArcadePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/memories" element={<MemoriesPage />} />
          {/* Placeholder routes for hub zones - can be expanded later */}
          <Route path="/videos" element={<VideosPage />} />
          <Route path="/food" element={<FoodRoulettePage />} />
          <Route path="/friends" element={<ArcadePage />} />
        </Routes>
      </PageShell>

        <InstallPrompt />
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}
