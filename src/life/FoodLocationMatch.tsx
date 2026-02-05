import { useState, useMemo, useRef, useEffect } from "react";
import { MEMORIES } from "./memories";
import "./FoodLocationMatch.css";

// Food locations from the road trip
const FOOD_ITEMS = [
  { id: "joshua_tree", photoIndex: 0, location: "Joshua Tree" },
  { id: "monterey", photoIndex: 1, location: "Monterey" },
  { id: "solvang", photoIndex: 2, location: "Solvang" },
];

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function FoodLocationMatch({
  title,
  subtitle,
  onDone,
}: {
  title?: string;
  subtitle?: string;
  onDone: () => void;
}) {
  // Get the food photos from the roadtrip_food deck
  const foodDeck = MEMORIES["roadtrip_food"] ?? [];
  const foodPhotos = foodDeck.filter((m) => m.type === "photo").slice(0, 3);
  const rewardVideo = foodDeck.find((m) => m.type === "video");

  // Shuffled locations for the game
  const shuffledLocations = useMemo(
    () => shuffleArray(FOOD_ITEMS.map((f) => ({ id: f.id, location: f.location }))),
    []
  );

  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [matches, setMatches] = useState<Record<number, string>>({});
  const [wrongMatch, setWrongMatch] = useState<{ photo: number; location: string } | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const allMatched = Object.keys(matches).length === 3;

  // Handle video end
  useEffect(() => {
    if (showVideo && videoRef.current) {
      videoRef.current.play();
    }
  }, [showVideo]);

  function handlePhotoClick(index: number) {
    if (matches[index]) return; // Already matched
    setSelectedPhoto(index);
    setWrongMatch(null);
  }

  function handleLocationClick(locationId: string) {
    if (selectedPhoto === null) return;

    // Check if this location is already matched
    const alreadyMatched = Object.values(matches).includes(locationId);
    if (alreadyMatched) return;

    // Check if the match is correct
    const correctItem = FOOD_ITEMS[selectedPhoto];
    if (correctItem && correctItem.id === locationId) {
      // Correct match!
      setMatches((prev) => ({ ...prev, [selectedPhoto]: locationId }));
      setSelectedPhoto(null);
    } else {
      // Wrong match
      setWrongMatch({ photo: selectedPhoto, location: locationId });
      setTimeout(() => {
        setWrongMatch(null);
        setSelectedPhoto(null);
      }, 800);
    }
  }

  function handleContinue() {
    if (rewardVideo) {
      setShowVideo(true);
    } else {
      onDone();
    }
  }

  function handleVideoEnd() {
    onDone();
  }

  if (showVideo && rewardVideo) {
    return (
      <div className="flm-overlay">
        <div className="flm-video-wrap">
          <div className="flm-video-title">A little treat from the trip...</div>
          <video
            ref={videoRef}
            src={rewardVideo.src}
            className="flm-video"
            playsInline
            onEnded={handleVideoEnd}
            controls
          />
          <button className="flm-btn" onClick={onDone}>
            Continue →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flm-overlay">
      <div className="flm-wrap">
        <div className="flm-title">{title ?? "Road Trip Eats"}</div>
        <div className="flm-subtitle">
          {subtitle ?? "Match each meal to where we had it"}
        </div>

        <div className="flm-game">
          {/* Food photos */}
          <div className="flm-photos">
            {foodPhotos.map((photo, index) => {
              const isMatched = matches[index] !== undefined;
              const isSelected = selectedPhoto === index;
              const isWrong = wrongMatch?.photo === index;
              const matchedLocation = matches[index]
                ? FOOD_ITEMS.find((f) => f.id === matches[index])?.location
                : null;

              return (
                <button
                  key={photo.id}
                  className={`flm-photo ${isMatched ? "matched" : ""} ${isSelected ? "selected" : ""} ${isWrong ? "wrong" : ""}`}
                  onClick={() => handlePhotoClick(index)}
                  disabled={isMatched}
                >
                  <img src={photo.src} alt={`Food ${index + 1}`} />
                  {isMatched && (
                    <div className="flm-photo-label">{matchedLocation}</div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Location buttons */}
          <div className="flm-locations">
            <div className="flm-locations-label">Where was it from?</div>
            {shuffledLocations.map((loc) => {
              const isMatched = Object.values(matches).includes(loc.id);
              const isWrong = wrongMatch?.location === loc.id;

              return (
                <button
                  key={loc.id}
                  className={`flm-location ${isMatched ? "matched" : ""} ${isWrong ? "wrong" : ""}`}
                  onClick={() => handleLocationClick(loc.id)}
                  disabled={isMatched}
                >
                  {loc.location}
                  {isMatched && <span className="flm-check">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flm-progress">
          {Object.keys(matches).length} / 3 matched
        </div>

        {selectedPhoto !== null && !allMatched && (
          <div className="flm-hint">Now tap where this meal was from!</div>
        )}

        {allMatched && (
          <div className="flm-complete">
            <div className="flm-complete-text">
              You remembered every delicious moment!
            </div>
            <button className="flm-btn" onClick={handleContinue}>
              {rewardVideo ? "Watch a little surprise →" : "Continue →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
