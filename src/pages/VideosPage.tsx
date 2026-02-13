import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadSave } from "../life/save";
import { VIDEO_CATEGORIES, isVideoUnlocked, getVideoStats, type Video } from "../life/videos";
import "./VideosPage.css";

export function VideosPage() {
  const navigate = useNavigate();
  const save = loadSave();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const stats = getVideoStats(save.tripsCompleted);

  const handleCategoryClick = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryId);
      setSelectedVideo(null);
    }
  };

  const handleVideoClick = (video: Video) => {
    if (isVideoUnlocked(video, save.tripsCompleted)) {
      setSelectedVideo(video);
    }
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="videos-page">
      <header className="videos-header">
        <button className="videos-back-btn" onClick={() => navigate("/")}>
          ← Back
        </button>
        <h1 className="videos-title">📼 Video Memories</h1>
        <p className="videos-subtitle">
          {stats.unlocked} / {stats.total} unlocked
        </p>
      </header>

      <div className="videos-content">
        <div className="videos-categories">
          {VIDEO_CATEGORIES.map((category) => {
            const unlockedCount = category.videos.filter((v) =>
              isVideoUnlocked(v, save.tripsCompleted)
            ).length;
            const totalCount = category.videos.length;
            const isExpanded = selectedCategory === category.id;

            return (
              <div key={category.id} className="video-category">
                <button
                  className={`video-category-header ${isExpanded ? "expanded" : ""}`}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <span className="video-category-emoji">{category.emoji}</span>
                  <span className="video-category-title">{category.title}</span>
                  <span className="video-category-count">
                    {unlockedCount}/{totalCount}
                  </span>
                  <span className="video-category-arrow">{isExpanded ? "▼" : "▶"}</span>
                </button>

                {isExpanded && (
                  <div className="video-category-items">
                    {category.videos.map((video) => {
                      const unlocked = isVideoUnlocked(video, save.tripsCompleted);

                      return (
                        <button
                          key={video.id}
                          className={`video-item ${unlocked ? "unlocked" : "locked"}`}
                          onClick={() => handleVideoClick(video)}
                          disabled={!unlocked}
                        >
                          {unlocked ? (
                            <>
                              <span className="video-item-icon">▶️</span>
                              <span className="video-item-title">{video.title}</span>
                            </>
                          ) : (
                            <>
                              <span className="video-item-icon">🔒</span>
                              <span className="video-item-title">???</span>
                            </>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {selectedVideo && (
          <div className="video-player-overlay" onClick={handleCloseVideo}>
            <div className="video-player-container" onClick={(e) => e.stopPropagation()}>
              <div className="video-player-header">
                <h2>{selectedVideo.title}</h2>
                <button className="video-player-close" onClick={handleCloseVideo}>
                  ✕
                </button>
              </div>
              <video
                className="video-player"
                src={selectedVideo.path}
                controls
                autoPlay
                playsInline
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
