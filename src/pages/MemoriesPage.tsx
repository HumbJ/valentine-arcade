// src/pages/MemoriesPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadSave, persistSave } from "../life/save";
import { DATE_NIGHTS, type DateNight } from "../life/dateNights";
import "./MemoriesPage.css";

export function MemoriesPage() {
  const navigate = useNavigate();
  const [save, setSave] = useState(() => loadSave());
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    setSave(loadSave());
  }, []);

  // Filter date nights by category
  const filteredDateNights = selectedCategory === "all"
    ? DATE_NIGHTS
    : DATE_NIGHTS.filter(dn => dn.category === selectedCategory);

  // Check if date night is unlocked
  const isUnlocked = (dateNight: DateNight): boolean => {
    return save.unlockedDateNights?.includes(dateNight.id) ?? false;
  };

  // Handle clicking a date night card
  const handleDateNightClick = (dateNight: DateNight) => {
    if (!isUnlocked(dateNight)) return;

    // Set the event ID and navigate to story mode
    const updated = { ...save, currentEventId: dateNight.id };
    persistSave(updated);
    setSave(updated);
    navigate("/story");
  };

  // Count unlocked by category
  const getUnlockedCount = (category: string): number => {
    const categoryNights = category === "all"
      ? DATE_NIGHTS
      : DATE_NIGHTS.filter(dn => dn.category === category);
    return categoryNights.filter(dn => isUnlocked(dn)).length;
  };

  const categories = [
    { id: "all", label: "All", emoji: "📸" },
    { id: "dining", label: "Dining", emoji: "🍽️" },
    { id: "concerts", label: "Concerts", emoji: "🎵" },
    { id: "adventures", label: "Adventures", emoji: "🎢" },
    { id: "friends", label: "Friends", emoji: "👥" },
    { id: "special", label: "Special", emoji: "🎉" },
  ];

  return (
    <div className="memories-page">
      <header className="memories-header">
        <h1 className="memories-title">Memories 💕</h1>
        <p className="memories-subtitle">
          {getUnlockedCount("all")} / {DATE_NIGHTS.length} unlocked
        </p>
      </header>

      {/* Category filters */}
      <div className="memories-categories">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`category-btn ${selectedCategory === cat.id ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            <span className="category-emoji">{cat.emoji}</span>
            <span className="category-label">{cat.label}</span>
            {cat.id !== "all" && (
              <span className="category-count">
                {getUnlockedCount(cat.id)}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Date night grid */}
      <div className="memories-grid">
        {filteredDateNights.map(dateNight => {
          const unlocked = isUnlocked(dateNight);
          return (
            <div
              key={dateNight.id}
              className={`memory-card ${unlocked ? "unlocked" : "locked"}`}
              onClick={() => handleDateNightClick(dateNight)}
            >
              <div className="memory-card-emoji">{unlocked ? dateNight.emoji : "🔒"}</div>
              <div className="memory-card-title">
                {unlocked ? dateNight.title : "???"}
              </div>
              <div className="memory-card-desc">
                {unlocked ? dateNight.description : "Complete more trips to unlock"}
              </div>
            </div>
          );
        })}
      </div>

      {filteredDateNights.length === 0 && (
        <div className="memories-empty">
          <p>No memories in this category yet</p>
        </div>
      )}
    </div>
  );
}
