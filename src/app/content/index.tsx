import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { createShadowRootUi, defineContentScript } from "#imports";

import "~/assets/styles/globals.css";
import {
  VideoSelectionManager,
  extractVideoElementsFromDOM,
  setupVideoSelectionListeners,
  updateVideoSelectionStyling,
} from "~/lib/video-selection";
import {
  downloadAsMarkdown,
  fetchBulkTranscripts,
  formatTranscriptsAsMarkdown,
  formatTranscriptsForClipboard,
} from "~/lib/youtube-transcript";
import type { VideoElement, VideoSelectionState } from "~/types";
import { StorageKey, getStorage } from "~/lib/storage";
import Fuse from "fuse.js";

// TEMP DEV-ONLY: limit auto-load to first N videos for faster iteration
// TODO: REMOVE THIS BEFORE SHIPPING
const ENABLE_DEV_LOAD_LIMIT = false;
const DEV_MAX_VIDEOS = 400;

interface ToastMessage {
  readonly id: string;
  readonly message: string;
  readonly type: "success" | "error" | "info" | "progress";
}

interface HeaderPillProps {
  readonly selectedCount: number;
  readonly isExtracting: boolean;
  readonly extractionProgress: { completed: number; total: number };
  readonly onClear: () => void;
  readonly onCopy: () => void;
  readonly onDownload: () => void;
  readonly onShowInfo: () => void;
}

interface InfoDropdownProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

// Info Dropdown Component with keyboard shortcuts and usage guide
const InfoDropdown = memo<InfoDropdownProps>(({ isOpen, onClose }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="yt-wl-info-dropdown"
      role="dialog"
      aria-modal="true"
      aria-labelledby="info-dropdown-title"
      tabIndex={-1}
      style={{
        position: "absolute",
        top: "calc(100% + 8px)",
        right: "0",
        minWidth: "350px",
        maxWidth: "400px",
        backgroundColor: "var(--yt-spec-base-background)",
        border: "1px solid var(--yt-spec-10-percent-layer)",
        borderRadius: "12px",
        boxShadow: "0 4px 16px var(--yt-spec-A2)",
        padding: "16px",
        fontSize: "13px",
        lineHeight: "1.4",
        color: "var(--yt-spec-text-primary)",
        zIndex: "2030",
        animation: "dropdownSlideIn 0.2s ease-out",
      }}
    >
      <div
        id="info-dropdown-title"
        style={{
          fontSize: "14px",
          fontWeight: "600",
          color: "var(--yt-spec-text-primary)",
          marginBottom: "12px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <title>Information icon</title>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
        </svg>
        Keyboard Shortcuts & Usage
      </div>

      <div style={{ marginBottom: "16px" }}>
        <div
          style={{
            fontWeight: "600",
            marginBottom: "6px",
            color: "var(--yt-spec-text-primary)",
          }}
        >
          Selection:
        </div>
        <div
          style={{ marginLeft: "8px", color: "var(--yt-spec-text-secondary)" }}
        >
          <div style={{ marginBottom: "3px" }}>
            • <kbd>Cmd/Ctrl + Click</kbd> - Toggle individual video selection
          </div>
          <div style={{ marginBottom: "3px" }}>
            • <kbd>Shift + Click</kbd> - Native browser text selection
            (unmodified)
          </div>
          <div style={{ marginBottom: "3px" }}>
            • <kbd>Cmd/Ctrl + A</kbd> - Select all visible videos
          </div>
          <div>
            • <kbd>Escape</kbd> - Clear all selections
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <div
          style={{
            fontWeight: "600",
            marginBottom: "6px",
            color: "var(--yt-spec-text-primary)",
          }}
        >
          Actions:
        </div>
        <div
          style={{ marginLeft: "8px", color: "var(--yt-spec-text-secondary)" }}
        >
          <div style={{ marginBottom: "3px" }}>
            • <kbd>Cmd/Ctrl + C</kbd> - Copy selected transcripts (markdown
            format)
          </div>
          <div>
            • <kbd>Cmd/Ctrl + S</kbd> - Download transcripts as .md file
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <div
          style={{
            fontWeight: "600",
            marginBottom: "6px",
            color: "var(--yt-spec-text-primary)",
          }}
        >
          How to Use:
        </div>
        <div
          style={{ marginLeft: "8px", color: "var(--yt-spec-text-secondary)" }}
        >
          <div style={{ marginBottom: "3px" }}>
            1. Navigate to your YouTube Watch Later playlist
          </div>
          <div style={{ marginBottom: "3px" }}>
            2. Use Cmd+Click to select videos individually
          </div>
          <div style={{ marginBottom: "3px" }}>
            3. Extract transcripts in markdown format
          </div>
          <div>4. Use in your AI tools or research workflow</div>
        </div>
      </div>

      <div
        style={{
          paddingTop: "12px",
          borderTop: "1px solid var(--yt-spec-10-percent-layer)",
          fontSize: "12px",
          color: "var(--yt-spec-text-secondary)",
        }}
      >
        This extension uses YouTube's internal API for reliable, unlimited
        transcript extraction.
      </div>

      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "4px",
          borderRadius: "4px",
          color: "var(--yt-spec-text-secondary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        aria-label="Close info dropdown"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <title>Close icon</title>
          <path d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59 7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12 5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" />
        </svg>
      </button>
    </div>
  );
});

InfoDropdown.displayName = "InfoDropdown";

// Header Pill Component that integrates with YouTube's native header
const HeaderPill = memo<HeaderPillProps>(
  ({
    selectedCount,
    isExtracting,
    extractionProgress,
    onClear,
    onCopy,
    onDownload,
    onShowInfo,
  }) => {
    const [showInfoDropdown, setShowInfoDropdown] = useState(false);

    const handleInfoClick = useCallback(() => {
      setShowInfoDropdown(!showInfoDropdown);
      onShowInfo();
    }, [showInfoDropdown, onShowInfo]);

    const handleCloseInfo = useCallback(() => {
      setShowInfoDropdown(false);
    }, []);

    return (
      <div
        className="yt-wl-header-pill"
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "6px 16px",
          backgroundColor: "var(--yt-spec-base-background)",
          border: "1px solid var(--yt-spec-10-percent-layer)",
          borderRadius: "18px",
          fontSize: "14px",
          fontWeight: "500",
          color: "var(--yt-spec-text-primary)",
          boxShadow: "0 1px 2px var(--yt-spec-A2)",
          animation: "slideInFromTop 0.3s ease-out",
          zIndex: "2020",
          height: "36px",
        }}
      >
        <span style={{ color: "var(--yt-spec-icon-active-other)" }}>
          {isExtracting
            ? `Extracting ${extractionProgress.completed}/${extractionProgress.total}...`
            : selectedCount > 0
              ? `${selectedCount} video${selectedCount > 1 ? "s" : ""} selected`
              : "Watchlater Transcripts"}
        </span>

        {!isExtracting && selectedCount > 0 && (
          <>
            <button
              onClick={onClear}
              className="yt-wl-pill-button"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "4px 8px",
                border: "none",
                borderRadius: "12px",
                backgroundColor: "transparent",
                color: "var(--yt-spec-text-secondary)",
                cursor: "pointer",
                fontSize: "12px",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor =
                  "var(--yt-spec-badge-chip-background)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <title>Clear selection</title>
                <path d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59 7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12 5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" />
              </svg>
              Clear
            </button>

            <button
              onClick={onCopy}
              className="yt-wl-pill-button"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "4px 8px",
                border: "none",
                borderRadius: "12px",
                backgroundColor: "transparent",
                color: "var(--yt-spec-text-secondary)",
                cursor: "pointer",
                fontSize: "12px",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor =
                  "var(--yt-spec-badge-chip-background)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M16 1H4C2.9 1 2 1.9 2 3v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
              </svg>
              Copy
            </button>

            <button
              onClick={onDownload}
              className="yt-wl-pill-button"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "4px 8px",
                border: "none",
                borderRadius: "12px",
                backgroundColor: "transparent",
                color: "var(--yt-spec-text-secondary)",
                cursor: "pointer",
                fontSize: "12px",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor =
                  "var(--yt-spec-badge-chip-background)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
              </svg>
              Download
            </button>
          </>
        )}

        {/* Info Button - Always Visible */}
        {!isExtracting && (
          <button
            onClick={handleInfoClick}
            className="yt-wl-pill-button"
            aria-label="Show keyboard shortcuts and usage information"
            aria-expanded={showInfoDropdown}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "4px 8px",
              border: "none",
              borderRadius: "12px",
              backgroundColor: showInfoDropdown
                ? "var(--yt-spec-badge-chip-background)"
                : "transparent",
              color: "var(--yt-spec-text-secondary)",
              cursor: "pointer",
              fontSize: "12px",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              if (!showInfoDropdown) {
                e.currentTarget.style.backgroundColor =
                  "var(--yt-spec-badge-chip-background)";
              }
            }}
            onMouseOut={(e) => {
              if (!showInfoDropdown) {
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <title>Information icon</title>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
            </svg>
            Info
          </button>
        )}

        {isExtracting && (
          <div
            style={{
              width: "80px",
              height: "2px",
              backgroundColor: "var(--yt-spec-10-percent-layer)",
              borderRadius: "1px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                backgroundColor: "var(--yt-spec-call-to-action)",
                borderRadius: "1px",
                width: `${(extractionProgress.completed / extractionProgress.total) * 100}%`,
                transition: "width 0.3s ease",
              }}
            />
          </div>
        )}

        {/* Info Dropdown */}
        <InfoDropdown isOpen={showInfoDropdown} onClose={handleCloseInfo} />
      </div>
    );
  },
);

HeaderPill.displayName = "HeaderPill";

// Search Bar Component positioned either under the playlist header or inline in masthead
interface SearchBarProps {
  readonly initialQuery?: string;
  readonly visibleCount: number;
  readonly totalCount: number;
  readonly isLoading: boolean;
  readonly isLoaded: boolean;
  readonly onClear: () => void;
  readonly inputRef: React.RefObject<HTMLInputElement | null>;
  readonly variant?: "playlist" | "masthead";
  readonly onSubmit?: () => void;
  readonly onLoadClick?: () => void;
  readonly loadedCount?: number;
  readonly onCancelClick?: () => void;
  readonly enableFuzzy: boolean;
  readonly onToggleFuzzy: (next: boolean) => void;
}

const SearchBar = memo<SearchBarProps>(
  ({ initialQuery, visibleCount, totalCount, isLoading, isLoaded, onClear, inputRef, variant = "playlist", onSubmit, onLoadClick, loadedCount, onCancelClick, enableFuzzy, onToggleFuzzy }) => {
    const isMasthead = variant === "masthead";
    return (
      <div
        className="yt-wl-searchbar"
        style={{
          display: isMasthead ? "flex" : "flex",
          flexDirection: isMasthead ? (/* single row */ "row") : "column",
          alignItems: isMasthead ? "center" : "stretch",
          gap: isMasthead ? "8px" : "8px",
          padding: isMasthead ? "0" : "12px 0",
          position: isMasthead ? "static" : "sticky",
          top: isMasthead ? undefined : 0,
          zIndex: isMasthead ? 2020 : 2010,
          background: "var(--yt-spec-base-background)",
          flex: isMasthead ? "1 1 auto" : undefined,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: isMasthead ? 1 : undefined }}>
          {!isLoaded ? (
            <>
              <button
                onClick={onLoadClick}
                disabled={isLoading}
                style={{
                  border: "1px solid var(--yt-spec-10-percent-layer)",
                  borderRadius: "6px",
                  background: "var(--yt-spec-badge-chip-background)",
                  color: "var(--yt-spec-text-primary)",
                  padding: "6px 12px",
                  cursor: isLoading ? "default" : "pointer",
                  fontSize: "13px",
                  height: isMasthead ? "32px" : "",
                  whiteSpace: "nowrap",
                }}
              >
                {isLoading ? `Loading… ${loadedCount ?? 0}` : "Load and Search"}
              </button>
              {isLoading && (
                <button
                  onClick={onCancelClick}
                  style={{
                    border: "1px solid var(--yt-spec-10-percent-layer)",
                    borderRadius: "6px",
                    background: "transparent",
                    color: "var(--yt-spec-text-secondary)",
                    padding: "6px 10px",
                    cursor: "pointer",
                    fontSize: "12px",
                    height: isMasthead ? "32px" : "",
                    whiteSpace: "nowrap",
                  }}
                >
                  Cancel
                </button>
              )}
            </>
          ) : (
            <>
              <input
                ref={inputRef}
                type="text"
                defaultValue={initialQuery ?? ""}
                placeholder={isLoading ? "Loading videos…" : "Type and press Enter to search…"}
                aria-label="Search Watch Later videos"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && onSubmit) {
                    e.preventDefault();
                    onSubmit();
                  }
                }}
                style={{
                  width: isMasthead ? "min(520px, 100%)" : "100%",
                  background: "var(--yt-spec-base-background)",
                  border: "1px solid var(--yt-spec-10-percent-layer)",
                  borderRadius: "4px",
                  padding: "8px 10px",
                  fontSize: "13px",
                  color: "var(--yt-spec-text-primary)",
                  height: isMasthead ? "32px" : "",
                }}
              />
              <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--yt-spec-text-secondary)" }}>
                <input
                  type="checkbox"
                  checked={enableFuzzy}
                  onChange={(e) => onToggleFuzzy(e.target.checked)}
                />
                Fuzzy
              </label>
            </>
          )}
          {initialQuery && (
            <button
              onClick={onClear}
              style={{
                border: "1px solid var(--yt-spec-10-percent-layer)",
                borderRadius: "6px",
                background: "transparent",
                color: "var(--yt-spec-text-secondary)",
                padding: "6px 10px",
                cursor: "pointer",
                fontSize: "12px",
                height: isMasthead ? "32px" : "",
                whiteSpace: "nowrap",
              }}
            >
              Clear
            </button>
          )}
        </div>
      </div>
    );
  },
);

SearchBar.displayName = "SearchBar";

// Toast Component with better animations
const Toast = memo<{
  toast: ToastMessage;
  onDismiss: () => void;
  onRetryClick?: () => void;
}>(({ toast, onDismiss, onRetryClick }) => {
  const colors = {
    success: { bg: "#0f5132", text: "#d1e7dd" },
    error: { bg: "#842029", text: "#f8d7da" },
    info: { bg: "#055160", text: "#b3d4fc" },
    progress: { bg: "#664d03", text: "#fff3cd" },
  };
  const color = colors[toast.type];

  return (
    <div
      role="alert"
      aria-live="polite"
      onClick={onDismiss}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onDismiss();
        }
      }}
      style={{
        backgroundColor: color.bg,
        color: color.text,
        borderRadius: "8px",
        padding: "12px 16px",
        fontSize: "13px",
        fontWeight: "500",
        maxWidth: "320px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        cursor: "pointer",
        animation: "slideInFromRight 0.3s ease-out",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
      title="Click to dismiss notification"
    >
      {toast.message}
      {toast.type === "error" &&
        toast.message.includes("failed to extract") &&
        onRetryClick && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRetryClick();
            }}
            style={{
              marginLeft: "8px",
              padding: "2px 6px",
              borderRadius: "4px",
              border: "1px solid currentColor",
              backgroundColor: "transparent",
              color: "currentColor",
              fontSize: "11px",
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        )}
    </div>
  );
});

Toast.displayName = "Toast";

const WatchLaterEnhancedUI = memo(() => {
  const [isWatchLaterPage, setIsWatchLaterPage] = useState(false);
  const [videoElements, setVideoElements] = useState<VideoElement[]>([]);
  const [selectionState, setSelectionState] = useState<VideoSelectionState>({
    selectedVideos: new Map(),
    lastSelectedIndex: null,
    totalVideos: 0,
  });
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionProgress, setExtractionProgress] = useState({
    completed: 0,
    total: 0,
  });
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [headerPillContainer, setHeaderPillContainer] =
    useState<Element | null>(null);
  const [failedExtractions, setFailedExtractions] = useState<
    Array<{ videoId: string; error: string; title: string }>
  >([]);

  // Search state and refs
  const [query, setQuery] = useState("");
  const [pendingQuery, setPendingQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(0);
  const [isAutoLoading, setIsAutoLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const searchBarRootRef = useRef<ReactDOM.Root | null>(null);
  const searchBarContainerRef = useRef<HTMLElement | null>(null);
  const mastheadObserverRef = useRef<MutationObserver | null>(null);
  const queryStorage = useRef(getStorage(StorageKey.WL_SEARCH_QUERY));
  // no debounce for submission-based search
  const isSearchFocusedRef = useRef<boolean>(false);
  // Filtering performance refs
  const currentQueryRef = useRef<string>("");
  const lastAppliedQueryRef = useRef<string>("");
  const videoIdToSearchTextRef = useRef<Map<string, string>>(new Map());
  const videoVisibilityRef = useRef<Map<string, boolean>>(new Map());
  const lastVideoIdSetRef = useRef<Set<string>>(new Set());
  const visibleCountRef = useRef<number>(0);
  const filterJobCancelRef = useRef<{ cancelled: boolean } | null>(null);
  const autoLoadStartedRef = useRef<boolean>(false);
  const isUnmountedRef = useRef<boolean>(false);
  const [hasLoadedAll, setHasLoadedAll] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const autoLoadCancelRef = useRef<{ cancelled: boolean } | null>(null);
  // Upload age cache for date filter
  const uploadAgeMsRef = useRef<Map<string, number | null>>(new Map());
  // Duration cache (minutes)
  const durationMinutesRef = useRef<Map<string, number>>(new Map());
  // Filter states
  const [filterDuration, setFilterDuration] = useState<string | null>(null); // 'short' | 'medium' | 'long' | null
  const [filterDate, setFilterDate] = useState<string | null>(null); // 'today' | 'week' | 'month' | 'year' | 'older' | null
  // channel filtering removed per request
  const [enableFuzzy, setEnableFuzzy] = useState(true);
  const [lastFuzzyUsed, setLastFuzzyUsed] = useState(false);

  // Refs for managers and cleanup
  const selectionManagerRef = useRef<VideoSelectionManager | null>(null);
  const cleanupListenersRef = useRef<(() => void) | null>(null);
  const mutationObserverRef = useRef<MutationObserver | null>(null);
  const headerPillRootRef = useRef<ReactDOM.Root | null>(null);

  const showToast = useCallback(
    (message: string, type: ToastMessage["type"] = "info") => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      const toast: ToastMessage = { id, message, type };

      setToasts((prev) => [...prev, toast]);

      // Auto-dismiss after different times based on type
      const dismissTime =
        type === "progress" ? 6000 : type === "error" ? 8000 : 4000;
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, dismissTime);
    },
    [],
  );

  // Initialize selection manager
  useEffect(() => {
    if (!selectionManagerRef.current) {
      selectionManagerRef.current = new VideoSelectionManager((newState) => {
        setSelectionState(newState);
      });
    }
  }, []);

  // Find and setup header pill container
  useEffect(() => {
    const findHeaderContainer = () => {
      // Look for YouTube's header container - prefer masthead end (more space), fallback to center
      const selectors = [
        "#masthead-container #end",
        "#masthead-container ytd-masthead #end",
        "ytd-masthead #end",
        "#masthead #end",
        ".ytd-masthead #end",
        "#masthead-container #center",
        "#masthead-container ytd-masthead #center",
        "ytd-masthead #center",
        "#masthead #center",
        ".ytd-masthead #center",
      ];

      for (const selector of selectors) {
        const container = document.querySelector(selector);
        if (container) {
          return container;
        }
      }
      return null;
    };

    // Try to find container with retries for YouTube's dynamic loading
    let attempts = 0;
    const maxAttempts = 20;
    const tryFind = () => {
      const container = findHeaderContainer();
      if (container && attempts < maxAttempts) {
        setHeaderPillContainer(container);
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(tryFind, 500);
      }
    };

    tryFind();
  }, []);

  // Cleanup header pill when not on Watch Later page
  useEffect(() => {
    if (!isWatchLaterPage) {
      setTimeout(() => {
        if (headerPillRootRef.current) {
          headerPillRootRef.current.unmount();
          headerPillRootRef.current = null;
        }
        const existingPill = document.querySelector(
          ".yt-wl-header-pill-container",
        );
        if (existingPill) {
          existingPill.remove();
        }
      }, 0);
    }
  }, [isWatchLaterPage]);

  // Mount header pill in YouTube's header - always show when on watch later page
  useEffect(() => {
    if (!headerPillContainer || !isWatchLaterPage) {
      return;
    }

    // Create container for the pill
    let pillContainer = document.querySelector(
      ".yt-wl-header-pill-container",
    ) as HTMLElement;
    if (!pillContainer) {
      pillContainer = document.createElement("div");
      pillContainer.className = "yt-wl-header-pill-container";
      pillContainer.style.cssText = `
        display: flex;
        align-items: center;
        margin-left: 16px;
        z-index: 2020;
      `;
      headerPillContainer.appendChild(pillContainer);
    }

    // Mount React component
    if (!headerPillRootRef.current) {
      headerPillRootRef.current = ReactDOM.createRoot(pillContainer);
    }

    headerPillRootRef.current.render(
      <HeaderPill
        selectedCount={selectionState.selectedVideos.size}
        isExtracting={isExtracting}
        extractionProgress={extractionProgress}
        onClear={handleClearSelection}
        onCopy={handleCopyTranscripts}
        onDownload={handleDownloadTranscripts}
        onShowInfo={() => {}} // Info button click handler - handled internally
      />,
    );

    return () => {
      // Defer cleanup to avoid synchronous unmounting during render
      setTimeout(() => {
        if (headerPillRootRef.current) {
          headerPillRootRef.current.unmount();
          headerPillRootRef.current = null;
        }
        const existingPill = document.querySelector(
          ".yt-wl-header-pill-container",
        );
        if (existingPill) {
          existingPill.remove();
        }
      }, 0);
    };
  }, [
    headerPillContainer,
    isWatchLaterPage,
    selectionState.selectedVideos.size,
    isExtracting,
    extractionProgress,
  ]);

  // Handler for showing info (placeholder for potential analytics)
  const handleShowInfo = useCallback(() => {
    // Could add analytics tracking here if needed
  }, []);

  // Page detection with comprehensive navigation monitoring
  useEffect(() => {
    const checkWatchLaterPage = () => {
      const isWL = window.location.href.includes("playlist?list=WL");
      setIsWatchLaterPage(isWL);
    };

    checkWatchLaterPage();

    // Listen for URL changes (YouTube SPA navigation)
    const handleNavigation = () => {
      setTimeout(checkWatchLaterPage, 100);
    };

    window.addEventListener("popstate", handleNavigation);
    window.addEventListener("yt-navigate-finish", handleNavigation);

    return () => {
      window.removeEventListener("popstate", handleNavigation);
      window.removeEventListener("yt-navigate-finish", handleNavigation);
    };
  }, []);

  // Comprehensive video scanning with DOM monitoring
  const scanForVideos = useCallback(() => {
    if (!isWatchLaterPage) {
      setVideoElements([]);
      return [] as VideoElement[];
    }

    const foundVideos = extractVideoElementsFromDOM();
    setVideoElements(foundVideos);

    // Update selection manager with new videos
    if (selectionManagerRef.current) {
      selectionManagerRef.current.updateVideos(foundVideos);
    }

    return foundVideos;
  }, [isWatchLaterPage]);

  // Auto-load implementation (sequential scroll)
  const autoLoadAllVideos = useCallback(async () => {
    if (!isWatchLaterPage || autoLoadStartedRef.current) return;
    autoLoadStartedRef.current = true;
    setIsAutoLoading(true);
    autoLoadCancelRef.current = { cancelled: false };
    try {
      let lastCount = videoElements.length;
      let stableCycles = 0;
      const maxStableCycles = 10;
      // helper sleep
      const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

      while (!isUnmountedRef.current && !autoLoadCancelRef.current?.cancelled && stableCycles < maxStableCycles) {
        // Scroll to bottom to trigger more loads
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" as ScrollBehavior });
        await wait(120);
        // Nudge a tiny upwards to keep lazy loader working on some layouts
        window.scrollBy({ top: -50, behavior: "instant" as ScrollBehavior });
        await wait(60);

        // Proactively rescan to pick up new videos
        const found = scanForVideos();
        const currentCount = found.length;
        setLoadedCount(currentCount);

        // TEMP DEV-ONLY: stop after DEV_MAX_VIDEOS and consider "loaded"
        if (ENABLE_DEV_LOAD_LIMIT && currentCount >= DEV_MAX_VIDEOS) {
          setHasLoadedAll(true);
          break;
        }

        if (currentCount > lastCount) {
          lastCount = currentCount;
          stableCycles = 0;
        } else {
          stableCycles += 1;
        }
      }
      if (!autoLoadCancelRef.current?.cancelled) {
        setHasLoadedAll(true);
      }
    } catch {
      // ignore, best-effort
    } finally {
      if (!isUnmountedRef.current) setIsAutoLoading(false);
      if (autoLoadCancelRef.current?.cancelled) {
        autoLoadStartedRef.current = false;
      }
      autoLoadCancelRef.current = null;
    }
  }, [isWatchLaterPage, videoElements.length, scanForVideos]);

  // Filter UI inline next to search input when loaded
  const FiltersInline = memo(() => {
    if (!hasLoadedAll) return null;
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {/* Duration pills */}
        {[
          { key: "short", label: "Short (<3m)" },
          { key: "medium", label: "Medium (3–12m)" },
          { key: "long", label: "Long (12m+)" },
        ].map((opt) => (
          <button
            key={opt.key}
            onClick={() => {
              const next = filterDuration === opt.key ? null : opt.key;
              setFilterDuration(next);
            }}
            style={{
              border: "1px solid var(--yt-spec-10-percent-layer)",
              borderRadius: "16px",
              background:
                filterDuration === opt.key
                  ? "var(--yt-spec-call-to-action)"
                  : "var(--yt-spec-badge-chip-background)",
              color: filterDuration === opt.key ? "#fff" : "var(--yt-spec-text-primary)",
              padding: "6px 10px",
              fontSize: "12px",
              height: "32px",
              cursor: "pointer",
            }}
          >
            {opt.label}
          </button>
        ))}

        {/* Date dropdown */}
        <select
          value={filterDate ?? ""}
          onChange={(e) => {
            const val = e.target.value || null;
            setFilterDate(val);
          }}
          style={{
            border: "1px solid var(--yt-spec-10-percent-layer)",
            borderRadius: "6px",
            background: "var(--yt-spec-base-background)",
            color: "var(--yt-spec-text-primary)",
            padding: "6px 8px",
            fontSize: "12px",
            height: "32px",
          }}
        >
          <option value="">Any time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
          <option value="older">Older</option>
        </select>

        {/* Clear filters */}
        {(filterDuration || filterDate) && (
          <button
            onClick={() => {
              setFilterDuration(null);
              setFilterDate(null);
              // Re-apply current query on clear
              setQuery((q) => q);
            }}
            style={{
              border: "1px solid var(--yt-spec-10-percent-layer)",
              borderRadius: "6px",
              background: "transparent",
              color: "var(--yt-spec-text-secondary)",
              padding: "6px 8px",
              fontSize: "12px",
              height: "32px",
              whiteSpace: "nowrap",
            }}
          >
            Clear filters
          </button>
        )}
      </div>
    );
  });

  // Mount search bar inline in masthead, to the right of our header pill (stable mount)
  useEffect(() => {
    if (!isWatchLaterPage || !headerPillContainer) {
      // cleanup if leaving page or container missing
      setTimeout(() => {
        if (mastheadObserverRef.current) {
          mastheadObserverRef.current.disconnect();
          mastheadObserverRef.current = null;
        }
        if (searchBarRootRef.current) {
          searchBarRootRef.current.unmount();
          searchBarRootRef.current = null;
        }
        if (searchBarContainerRef.current) {
          searchBarContainerRef.current.remove();
          searchBarContainerRef.current = null;
        }
      }, 0);
      return;
    }

    const ensureContainer = () => {
      if (searchBarContainerRef.current && document.body.contains(searchBarContainerRef.current)) {
        return searchBarContainerRef.current;
      }
      const container = document.createElement("div");
      container.className = "yt-wl-searchbar-inline-container";
      container.style.cssText = `
        display: flex;
        align-items: center;
        margin-left: 12px;
        max-width: 50vw;
        flex: 1 1 auto;
      `;
      // Insert after our pill if present
      const pill = document.querySelector(
        ".yt-wl-header-pill-container",
      ) as HTMLElement | null;
      if (pill && pill.parentElement) {
        pill.parentElement.insertBefore(container, pill.nextSibling);
      } else {
        headerPillContainer.appendChild(container);
      }
      searchBarContainerRef.current = container;
      return container;
    };

    const container = ensureContainer();
    if (!searchBarRootRef.current) {
      searchBarRootRef.current = ReactDOM.createRoot(container);
    }

    // Observe masthead for re-renders and re-insert if needed
    if (!mastheadObserverRef.current) {
      const observer = new MutationObserver(() => {
        const exists = searchBarContainerRef.current && document.body.contains(searchBarContainerRef.current);
        if (!exists) {
          const wasFocused = isSearchFocusedRef.current;
          const newContainer = ensureContainer();
          // Always recreate root when container changes
          if (searchBarRootRef.current) {
            searchBarRootRef.current.unmount();
          }
          searchBarRootRef.current = ReactDOM.createRoot(newContainer);
          // Render immediately; focus will be restored below if needed
          searchBarRootRef.current.render(
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
              <SearchBar
                initialQuery={pendingQuery}
                visibleCount={visibleCount}
                totalCount={videoElements.length}
                isLoading={isAutoLoading}
                isLoaded={hasLoadedAll}
                onClear={() => {
                  if (searchInputRef.current) searchInputRef.current.value = "";
                  setPendingQuery("");
                  setQuery("");
                  void queryStorage.current.setValue("");
                }}
                inputRef={searchInputRef}
                variant="masthead"
                onSubmit={() => {
                  const val = (searchInputRef.current?.value ?? "").trim();
                  setPendingQuery(val);
                  // Exact apply first
                  setQuery(val);
                  void queryStorage.current.setValue(val);
                  // Optionally run fuzzy fallback after DOM exact pass completes
                  if (enableFuzzy) {
                    setTimeout(() => {
                      try {
                        // collect candidate items
                        const items = videoElements.map((v) => ({
                          id: v.videoId,
                          title: v.title,
                          channel: v.channel,
                          element: v.element,
                        }));
                        const fuse = new Fuse(items, {
                          keys: ["title", "channel"],
                          threshold: 0.3,
                          ignoreLocation: true,
                        });
                        const results = val ? fuse.search(val) : [];
                        if (val && results.length > 0) {
                          const allowed = new Set(results.map((r) => r.item.id));
                          let visible = 0;
                          for (const v of videoElements) {
                            // honor current filters (duration/date)
                            const totalMinutes = getDurationMinutes(v);
                            const durationCat = totalMinutes <= 0.01 ? 'unknown' : totalMinutes < 3 ? 'short' : totalMinutes < 12 ? 'medium' : 'long';
                            const matchDuration = !filterDuration ? true : filterDuration === durationCat;
                            const ageMs = getUploadAgeMs(v);
                            const day = 24 * 60 * 60 * 1000;
                            const matchDate = !filterDate
                              ? true
                              : ageMs == null
                                ? !hasLoadedAll
                                : filterDate === 'today' ? ageMs < day
                                : filterDate === 'week' ? ageMs < 7 * day
                                : filterDate === 'month' ? ageMs < 30 * day
                                : filterDate === 'year' ? ageMs < 365 * day
                                : filterDate === 'older' ? ageMs >= 365 * day
                                : true;
                            const inFuzzy = allowed.has(v.videoId);
                            const show = (!val || inFuzzy) && matchDuration && matchDate;
                            if (v.element && (v.element as HTMLElement).style) {
                              (v.element as HTMLElement).style.display = show ? "" : "none";
                            }
                            if (show) visible++;
                          }
                          setVisibleCount(visible);
                          setLastFuzzyUsed(true);
                        } else {
                          setLastFuzzyUsed(false);
                        }
                      } catch {
                        setLastFuzzyUsed(false);
                      }
                    }, 0);
                  } else {
                    setLastFuzzyUsed(false);
                  }
                }}
                onLoadClick={() => { void autoLoadAllVideos(); }}
                loadedCount={loadedCount}
                onCancelClick={() => {
                  if (autoLoadCancelRef.current) autoLoadCancelRef.current.cancelled = true;
                }}
                enableFuzzy={enableFuzzy}
                onToggleFuzzy={setEnableFuzzy}
              />
              <FiltersInline />
            </div>,
          );
          if (wasFocused) {
            // Restore focus after DOM settles
            setTimeout(() => searchInputRef.current?.focus(), 0);
          }
        }
      });
      const mastheadCenter = (headerPillContainer.closest('#masthead') || headerPillContainer.parentElement || headerPillContainer) as Element;
      observer.observe(mastheadCenter, { childList: true, subtree: true });
      mastheadObserverRef.current = observer;
    }

    return () => {
      // full cleanup handled when leaving page at the top of this effect
    };
  }, [isWatchLaterPage, headerPillContainer, hasLoadedAll, loadedCount, autoLoadAllVideos, pendingQuery, visibleCount, videoElements.length, isAutoLoading]);

  // Track focus on the search input to restore after re-insert
  useEffect(() => {
    const input = searchInputRef.current;
    if (!input) return;
    const handleFocus = () => { isSearchFocusedRef.current = true; };
    const handleBlur = () => { isSearchFocusedRef.current = false; };
    input.addEventListener('focus', handleFocus);
    input.addEventListener('blur', handleBlur);
    return () => {
      input.removeEventListener('focus', handleFocus);
      input.removeEventListener('blur', handleBlur);
    };
  }, [searchInputRef.current]);

  // Render SearchBar into the existing root when state changes (no unmount/remount)
  useEffect(() => {
    if (!isWatchLaterPage || !searchBarRootRef.current) return;
    searchBarRootRef.current.render(
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
        <SearchBar
          initialQuery={pendingQuery}
          visibleCount={visibleCount}
          totalCount={videoElements.length}
          isLoading={isAutoLoading}
          isLoaded={hasLoadedAll}
          onClear={() => {
            if (searchInputRef.current) searchInputRef.current.value = "";
            setPendingQuery("");
            setQuery("");
            void queryStorage.current.setValue("");
          }}
          inputRef={searchInputRef}
          variant="masthead"
          onSubmit={() => {
            const val = (searchInputRef.current?.value ?? "").trim();
            setPendingQuery(val);
            // Exact apply first
            setQuery(val);
            void queryStorage.current.setValue(val);
            // Optionally run fuzzy fallback after DOM exact pass completes
            if (enableFuzzy) {
              setTimeout(() => {
                try {
                  // collect candidate items
                  const items = videoElements.map((v) => ({
                    id: v.videoId,
                    title: v.title,
                    channel: v.channel,
                    element: v.element,
                  }));
                  const fuse = new Fuse(items, {
                    keys: ["title", "channel"],
                    threshold: 0.3,
                    ignoreLocation: true,
                  });
                  const results = val ? fuse.search(val) : [];
                  if (val && results.length > 0) {
                    const allowed = new Set(results.map((r) => r.item.id));
                    let visible = 0;
                    for (const v of videoElements) {
                      // honor current filters (duration/date)
                      const totalMinutes = getDurationMinutes(v);
                      const durationCat = totalMinutes <= 0.01 ? 'unknown' : totalMinutes < 3 ? 'short' : totalMinutes < 12 ? 'medium' : 'long';
                      const matchDuration = !filterDuration ? true : filterDuration === durationCat;
                      const ageMs = getUploadAgeMs(v);
                      const day = 24 * 60 * 60 * 1000;
                      const matchDate = !filterDate
                        ? true
                        : ageMs == null
                          ? !hasLoadedAll
                          : filterDate === 'today' ? ageMs < day
                          : filterDate === 'week' ? ageMs < 7 * day
                          : filterDate === 'month' ? ageMs < 30 * day
                          : filterDate === 'year' ? ageMs < 365 * day
                          : filterDate === 'older' ? ageMs >= 365 * day
                          : true;
                      const inFuzzy = allowed.has(v.videoId);
                      const show = (!val || inFuzzy) && matchDuration && matchDate;
                      if (v.element && (v.element as HTMLElement).style) {
                        (v.element as HTMLElement).style.display = show ? "" : "none";
                      }
                      if (show) visible++;
                    }
                    setVisibleCount(visible);
                    setLastFuzzyUsed(true);
                  } else {
                    setLastFuzzyUsed(false);
                  }
                } catch {
                  setLastFuzzyUsed(false);
                }
              }, 0);
            } else {
              setLastFuzzyUsed(false);
            }
          }}
          onLoadClick={() => {
            void autoLoadAllVideos();
          }}
          loadedCount={loadedCount}
          onCancelClick={() => {
            if (autoLoadCancelRef.current) autoLoadCancelRef.current.cancelled = true;
          }}
          enableFuzzy={enableFuzzy}
          onToggleFuzzy={setEnableFuzzy}
        />
        <FiltersInline />
      </div>,
    );
  }, [isWatchLaterPage, pendingQuery, visibleCount, videoElements.length, isAutoLoading, hasLoadedAll, loadedCount, autoLoadAllVideos, filterDuration, filterDate]);

  // Helper: build or retrieve precomputed search text
  const getSearchText = useCallback((v: VideoElement) => {
    const existing = videoIdToSearchTextRef.current.get(v.videoId);
    if (existing) return existing;
    const text = `${v.title} ${v.channel}`.toLowerCase();
    videoIdToSearchTextRef.current.set(v.videoId, text);
    return text;
  }, []);

  // Robust duration extractor: returns total minutes (float)
  const getDurationMinutes = useCallback((v: VideoElement): number => {
    const cached = durationMinutesRef.current.get(v.videoId);
    if (cached !== undefined) return cached;

    const el = v.element as HTMLElement;
    // First, try to parse the metadata duration text directly
    const normalize = (s: string) => s.replace(/\u00A0/g, ' ').trim();
    const parseTimeText = (raw: string) => {
      const text = normalize(raw);
      const match = text.match(/(?:\d{1,2}:)?\d{1,2}:\d{2}/);
      const t = match ? match[0] : text;
      const parts = t.split(":").map((n) => Number((n || "0").trim()));
      if (parts.length === 3) return (parts[0] ?? 0) * 60 + (parts[1] ?? 0) + (parts[2] ?? 0) / 60;
      if (parts.length === 2) return (parts[0] ?? 0) + (parts[1] ?? 0) / 60;
      return 0;
    };
    let minutes = 0;
    if (v.duration) {
      minutes = parseTimeText(v.duration);
    }
    // Try aria-label (e.g., "12 minutes, 34 seconds") if not parsed yet
    if (!minutes || Number.isNaN(minutes)) {
      const overlay = el.querySelector("ytd-thumbnail-overlay-time-status-renderer, .ytd-thumbnail-overlay-time-status-renderer") as HTMLElement | null;
      const aria = overlay?.getAttribute("aria-label") || (overlay as any)?.ariaLabel || null;
      const parseAria = (s: string) => {
        const map: Record<string, number> = { second: 1 / 60, minute: 1, hour: 60 };
        let mins = 0;
        const re = /(\d+)\s+(hour|hours|minute|minutes|second|seconds)/g;
        let m: RegExpExecArray | null;
        while ((m = re.exec(s.toLowerCase())) !== null) {
          const amt = Number(m[1] ?? 0);
          const unit = (m[2] ?? "minute").replace(/s$/, "");
          mins += amt * (map[unit] ?? 0);
        }
        return mins;
      };
      if (aria) {
        minutes = parseAria(aria);
      }
      // Fallback to overlay text content
      if ((!minutes || Number.isNaN(minutes)) && overlay) {
        const raw = normalize(overlay.textContent || "");
        if (raw) minutes = parseTimeText(raw);
      }
    }
    if (!Number.isFinite(minutes)) minutes = 0;
    durationMinutesRef.current.set(v.videoId, minutes);
    return minutes;
  }, []);

  // Extract or compute upload age (ms) from a video's DOM element
  const getUploadAgeMs = useCallback((v: VideoElement): number | null => {
    const cached = uploadAgeMsRef.current.get(v.videoId);
    if (cached !== undefined) return cached as number | null;
    const el = v.element as HTMLElement;
    // Try multiple selectors for metadata line
    const candidates = Array.from(
      el.querySelectorAll(
        [
          '#metadata-line yt-formatted-string',
          '#metadata-line span',
          '.metadata-line yt-formatted-string',
          '.metadata-line span',
          '.inline-metadata-item',
          'yt-formatted-string.style-scope.ytd-video-meta-block',
        ].join(', '),
      ),
    ) as HTMLElement[];
    let ageText: string | null = null;
    for (const c of candidates) {
      const txt = c.textContent?.replace(/\u00A0/g, ' ').trim().toLowerCase() ?? '';
      if (txt.includes('ago') || txt.startsWith('streamed') || txt.startsWith('premiered')) {
        ageText = txt;
        break;
      }
    }
    if (!ageText) {
      uploadAgeMsRef.current.set(v.videoId, null);
      return null;
    }
    // Normalize like "streamed X ago" or "premiered X ago"
    ageText = ageText.replace('streamed', '').replace('premiered', '').trim();
    // Extract number and unit
    const match = ageText.match(
      /(\d+)\s+(second|sec|secs|seconds|minute|min|mins|minutes|hour|hr|hrs|hours|day|days|week|wk|wks|weeks|month|mo|mos|months|year|yr|yrs|years)\s+ago/,
    );
    if (!match) {
      uploadAgeMsRef.current.set(v.videoId, null);
      return null;
    }
    const amount = Number(match[1] ?? 0);
    const unitRaw = (match[2] ?? 'day') as string;
    const unitNorm = unitRaw
      .replace(/s$/, '')
      .replace(/^sec$/, 'second')
      .replace(/^mins?$/, 'minute')
      .replace(/^min$/, 'minute')
      .replace(/^hrs?$/, 'hour')
      .replace(/^hr$/, 'hour')
      .replace(/^wks?$/, 'week')
      .replace(/^wk$/, 'week')
      .replace(/^mos?$/, 'month')
      .replace(/^mo$/, 'month')
      .replace(/^yrs?$/, 'year')
      .replace(/^yr$/, 'year');
    const msPer = {
      second: 1000,
      minute: 60 * 1000,
      hour: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      year: 365 * 24 * 60 * 60 * 1000,
    } as const;
    const key = unitNorm as keyof typeof msPer;
    const ageMs = amount * (msPer[key] ?? msPer.day);
    // Optional debug: set window.__YTWL_DEBUG_DATE__ = true in console
    try {
      // biome-ignore lint/suspicious/noExplicitAny: window debug flag
      const dbg = (window as any).__YTWL_DEBUG_DATE__;
      if (dbg === true && ageMs != null) {
        // Log once per video
        // biome-ignore lint/suspicious/noConsole: debug only
        console.debug('[YT-WL][date-parse]', v.videoId, { text: ageText, ageMs });
      }
    } catch {}
    uploadAgeMsRef.current.set(v.videoId, ageMs);
    return ageMs;
  }, []);

  // Chunked full apply when query changes
  useEffect(() => {
    if (!isWatchLaterPage) return;
    currentQueryRef.current = query.trim().toLowerCase();

    // Cancel prior job
    if (filterJobCancelRef.current) {
      filterJobCancelRef.current.cancelled = true;
    }
    const job = { cancelled: false };
    filterJobCancelRef.current = job;

    let index = 0;
    visibleCountRef.current = 0;

    const applyChunk = () => {
      if (job.cancelled) return;
      const chunkSize = 250;
      const end = Math.min(index + chunkSize, videoElements.length);
      for (let i = index; i < end; i++) {
        const v = videoElements[i];
        if (!v) continue;
        const matchQuery =
          currentQueryRef.current === "" || getSearchText(v).includes(currentQueryRef.current);
        // Duration filter
        const totalMinutes = getDurationMinutes(v);
        const durationCat = totalMinutes <= 0.01 ? 'unknown' : totalMinutes < 3 ? 'short' : totalMinutes < 12 ? 'medium' : 'long';
        const matchDuration = !filterDuration ? true : filterDuration === durationCat;
        // Date filter heuristic
        const ageMs = getUploadAgeMs(v);
        const withinDate = (fd: string | null): boolean => {
          if (!fd) return true; // no date filter active
          if (ageMs == null) return !hasLoadedAll; // allow until fully loaded, then exclude unknowns
          const day = 24 * 60 * 60 * 1000;
          if (fd === 'today') return ageMs < day;
          if (fd === 'week') return ageMs < 7 * day;
          if (fd === 'month') return ageMs < 30 * day;
          if (fd === 'year') return ageMs < 365 * day;
          if (fd === 'older') return ageMs >= 365 * day;
          return true;
        };
        const matchDate = withinDate(filterDate);
        const match = matchQuery && matchDuration && matchDate;
        if (v.element && (v.element as HTMLElement).style) {
          (v.element as HTMLElement).style.display = match ? "" : "none";
        }
        videoVisibilityRef.current.set(v.videoId, match);
        if (match) visibleCountRef.current++;
      }
      index = end;
      if (index < videoElements.length) {
        requestAnimationFrame(applyChunk);
      } else {
        lastAppliedQueryRef.current = currentQueryRef.current;
        setVisibleCount(visibleCountRef.current);
      }
    };

    requestAnimationFrame(applyChunk);
  }, [isWatchLaterPage, videoElements, query, getSearchText, filterDuration, filterDate, getDurationMinutes, getUploadAgeMs]);

  // Delta apply for new/removed videos when list changes (without re-filtering everything)
  useEffect(() => {
    if (!isWatchLaterPage) return;
    const newSet = new Set(videoElements.map((v) => v.videoId));
    const lastSet = lastVideoIdSetRef.current;

    // Added videos
    if (newSet.size >= lastSet.size) {
      for (const v of videoElements) {
        if (!v) continue;
        if (!lastSet.has(v.videoId)) {
          // New video: compute and apply visibility for current query
          const matchQuery =
            currentQueryRef.current === "" || getSearchText(v).includes(currentQueryRef.current);
          // Duration filter
          const totalMinutes = getDurationMinutes(v);
          const durationCat = totalMinutes <= 0.01 ? 'unknown' : totalMinutes < 3 ? 'short' : totalMinutes < 12 ? 'medium' : 'long';
          const matchDuration = !filterDuration ? true : filterDuration === durationCat;
          const ageMs = getUploadAgeMs(v);
          const withinDate = (fd: string | null): boolean => {
            if (!fd) return true; // no date filter active
            if (ageMs == null) return !hasLoadedAll; // allow until fully loaded, then exclude unknowns
            const day = 24 * 60 * 60 * 1000;
            if (fd === 'today') return ageMs < day;
            if (fd === 'week') return ageMs < 7 * day;
            if (fd === 'month') return ageMs < 30 * day;
            if (fd === 'year') return ageMs < 365 * day;
            if (fd === 'older') return ageMs >= 365 * day;
            return true;
          };
          const matchDate = withinDate(filterDate);
          const match = matchQuery && matchDuration && matchDate;
          if (v.element && (v.element as HTMLElement).style) {
            (v.element as HTMLElement).style.display = match ? "" : "none";
          }
          videoVisibilityRef.current.set(v.videoId, match);
          if (match) {
            visibleCountRef.current += 1;
            setVisibleCount(visibleCountRef.current);
          }
        }
      }
    }

    // Removed videos
    for (const oldId of lastSet) {
      if (!newSet.has(oldId)) {
        const wasVisible = videoVisibilityRef.current.get(oldId);
        if (wasVisible) {
          visibleCountRef.current = Math.max(0, visibleCountRef.current - 1);
          setVisibleCount(visibleCountRef.current);
        }
        videoVisibilityRef.current.delete(oldId);
        videoIdToSearchTextRef.current.delete(oldId);
      }
    }

    lastVideoIdSetRef.current = newSet;
  }, [isWatchLaterPage, videoElements, getSearchText, filterDuration, filterDate, getDurationMinutes, getUploadAgeMs]);

  // No auto-apply; query updates only on Enter via onSubmit
  // Initialize query from storage (WL-only)
  useEffect(() => {
    (async () => {
      try {
        const stored = await queryStorage.current.getValue();
        if (typeof stored === "string" && stored.length > 0) {
          // Pre-fill input but do NOT apply filter until user presses Enter
          setPendingQuery(stored);
        }
      } catch {
        // ignore
      }
    })();
  }, []);

  // Keyboard shortcuts for search focus and clear
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (!isWatchLaterPage) return;

      const target = event.target as HTMLElement | null;
      const isTypingContext = !!(
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      );

      // '/' focuses the search bar when not typing elsewhere
      if (event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey) {
        if (!isTypingContext && searchInputRef.current) {
          event.preventDefault();
          searchInputRef.current.focus();
        }
        return;
      }

      // Escape clears query if the search is focused
      if (event.key === "Escape" && document.activeElement === searchInputRef.current) {
        event.preventDefault();
        setQuery("");
        searchInputRef.current?.blur();
        return;
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isWatchLaterPage]);

  // Set up DOM mutation observer for dynamic content
  useEffect(() => {
    if (!isWatchLaterPage) {
      if (mutationObserverRef.current) {
        mutationObserverRef.current.disconnect();
        mutationObserverRef.current = null;
      }
      return;
    }

    // Initial scan
    const initialVideos = scanForVideos();

    // Set up mutation observer for dynamic loading
    const observer = new MutationObserver((mutations) => {
      let shouldRescan = false;

      for (const mutation of mutations) {
        // Check if video elements were added/removed
        if (mutation.type === "childList") {
          const hasVideoChanges = Array.from(mutation.addedNodes)
            .concat(Array.from(mutation.removedNodes))
            .some((node) => {
              if (node.nodeType !== Node.ELEMENT_NODE) return false;
              const element = node as Element;
              return (
                element.matches("ytd-playlist-video-renderer") ||
                element.querySelector("ytd-playlist-video-renderer")
              );
            });

          if (hasVideoChanges) {
            shouldRescan = true;
            break;
          }
        }
      }

      if (shouldRescan) {
        setTimeout(() => scanForVideos(), 500); // Debounce rescans
      }
    });

    const contentContainer =
      document.querySelector("#contents") || document.body;
    observer.observe(contentContainer, {
      childList: true,
      subtree: true,
    });

    mutationObserverRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, [isWatchLaterPage, scanForVideos]);

  // Set up video selection event listeners
  useEffect(() => {
    if (
      !isWatchLaterPage ||
      videoElements.length === 0 ||
      !selectionManagerRef.current
    ) {
      return;
    }

    // Clean up previous listeners
    if (cleanupListenersRef.current) {
      cleanupListenersRef.current();
    }

    // Set up new listeners
    const contentContainer =
      document.querySelector("#contents") || document.body;
    const cleanup = setupVideoSelectionListeners(
      contentContainer,
      selectionManagerRef.current,
      videoElements,
    );

    cleanupListenersRef.current = cleanup;

    return cleanup;
  }, [isWatchLaterPage, videoElements]);

  // Update visual styling when selection changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: Need to trigger on selection changes
  useEffect(() => {
    if (selectionManagerRef.current && videoElements.length > 0) {
      updateVideoSelectionStyling(videoElements, selectionManagerRef.current);
    }
    // We intentionally depend on selectedVideos.size to trigger re-styling
  }, [videoElements, selectionState.selectedVideos.size]);

  // Auto-copy single transcript for immediate use
  const handleSingleVideoTranscript = useCallback(
    async (video: VideoElement) => {
      try {
        showToast(`Extracting transcript for: ${video.title}`, "progress");
        setIsExtracting(true);
        setExtractionProgress({ completed: 0, total: 1 });

        const result = await fetchBulkTranscripts(
          [
            {
              videoId: video.videoId,
              title: video.title,
              channel: video.channel,
            },
          ],
          (completed, total) => {
            setExtractionProgress({ completed, total });
          },
        );

        if (result.successful.length > 0) {
          const markdownContent = formatTranscriptsForClipboard(
            result.successful,
          );
          await navigator.clipboard.writeText(markdownContent);
          showToast(`Transcript copied to clipboard!`, "success");
        } else {
          showToast("Failed to extract transcript", "error");
        }
      } catch (error) {
        showToast("Failed to extract transcript", "error");
      } finally {
        setIsExtracting(false);
        setExtractionProgress({ completed: 0, total: 0 });
      }
    },
    [showToast],
  );

  const handleCopyTranscripts = useCallback(async () => {
    if (!selectionManagerRef.current) {
      showToast("Selection manager not initialized", "error");
      return;
    }

    const selectedVideos = selectionManagerRef.current.getSelectedVideos();
    if (selectedVideos.length === 0) {
      showToast("No videos selected", "error");
      return;
    }

    // Limit batch size to prevent overwhelming
    const maxBatchSize = 10;
    if (selectedVideos.length > maxBatchSize) {
      showToast(`Maximum ${maxBatchSize} videos allowed per batch`, "error");
      return;
    }

    try {
      showToast(
        `Extracting transcripts for ${selectedVideos.length} videos...`,
        "progress",
      );
      setIsExtracting(true);
      setExtractionProgress({ completed: 0, total: selectedVideos.length });

      const result = await fetchBulkTranscripts(
        selectedVideos,
        (completed, total) => {
          setExtractionProgress({ completed, total });
        },
      );

      if (result.successful.length > 0) {
        const markdownContent = formatTranscriptsForClipboard(result.successful);
        await navigator.clipboard.writeText(markdownContent);
        showToast(
          `Copied ${result.successful.length} transcripts to clipboard!`,
          "success",
        );

        // Clear selection after successful copy
        selectionManagerRef.current.clearSelection();
      } else {
        showToast("No transcripts could be extracted", "error");
      }

      if (result.failed.length > 0) {
        setFailedExtractions([...result.failed]);
        showToast(
          `${result.failed.length} transcripts failed to extract. Click to retry.`,
          "error",
        );
      } else {
        setFailedExtractions([]);
      }
    } catch (error) {
      showToast("Failed to copy transcripts", "error");
    } finally {
      setIsExtracting(false);
      setExtractionProgress({ completed: 0, total: 0 });
    }
  }, [showToast]);

  const handleDownloadTranscripts = useCallback(async () => {
    if (!selectionManagerRef.current) {
      showToast("Selection manager not initialized", "error");
      return;
    }

    const selectedVideos = selectionManagerRef.current.getSelectedVideos();
    if (selectedVideos.length === 0) {
      showToast("No videos selected", "error");
      return;
    }

    // Limit batch size
    const maxBatchSize = 10;
    if (selectedVideos.length > maxBatchSize) {
      showToast(`Maximum ${maxBatchSize} videos allowed per batch`, "error");
      return;
    }

    try {
      showToast(
        `Extracting transcripts for ${selectedVideos.length} videos...`,
        "progress",
      );
      setIsExtracting(true);
      setExtractionProgress({ completed: 0, total: selectedVideos.length });

      const result = await fetchBulkTranscripts(
        selectedVideos,
        (completed, total) => {
          setExtractionProgress({ completed, total });
        },
      );

      if (result.successful.length > 0) {
        const markdownContent = formatTranscriptsForClipboard(result.successful);

        // Download as markdown file
        downloadAsMarkdown(markdownContent);

        showToast(
          `Downloaded ${result.successful.length} transcripts as Markdown!`,
          "success",
        );

        // Clear selection after successful download
        selectionManagerRef.current.clearSelection();
      } else {
        showToast("No transcripts could be extracted", "error");
      }

      if (result.failed.length > 0) {
        setFailedExtractions([...result.failed]);
        showToast(
          `${result.failed.length} transcripts failed to extract. Click to retry.`,
          "error",
        );
      } else {
        setFailedExtractions([]);
      }
    } catch (error) {
      showToast("Failed to download transcripts", "error");
    } finally {
      setIsExtracting(false);
      setExtractionProgress({ completed: 0, total: 0 });
    }
  }, [showToast]);

  const handleSelectAll = useCallback(() => {
    if (!selectionManagerRef.current || videoElements.length === 0) {
      showToast("No videos to select", "error");
      return;
    }

    selectionManagerRef.current.selectAll(videoElements);
    showToast(`Selected all ${videoElements.length} videos`, "success");

    // Scroll to first selected video
    if (videoElements[0]?.element) {
      videoElements[0].element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [videoElements, showToast]);

  const handleClearSelection = useCallback(() => {
    if (!selectionManagerRef.current) return;

    const selectedCount = selectionManagerRef.current.getSelectedCount();
    if (selectedCount === 0) {
      return;
    }

    selectionManagerRef.current.clearSelection();
    setFailedExtractions([]); // Clear failed extractions too
    showToast(`Cleared selection of ${selectedCount} videos`, "success");
  }, [showToast]);

  const handleRetryFailed = useCallback(async () => {
    if (failedExtractions.length === 0) return;

    try {
      showToast(
        `Retrying ${failedExtractions.length} failed extractions...`,
        "progress",
      );
      setIsExtracting(true);
      setExtractionProgress({ completed: 0, total: failedExtractions.length });

      const result = await fetchBulkTranscripts(
        failedExtractions.map((f) => ({
          videoId: f.videoId,
          title: f.title,
          channel: "",
        })),
        (completed, total) => {
          setExtractionProgress({ completed, total });
        },
      );

      if (result.successful.length > 0) {
        const markdownContent = formatTranscriptsForClipboard(result.successful);
        await navigator.clipboard.writeText(markdownContent);
        showToast(
          `Retry successful! Copied ${result.successful.length} transcripts to clipboard!`,
          "success",
        );
      }

      // Update failed list to only include still-failing videos
      setFailedExtractions([...result.failed]);

      if (result.failed.length > 0) {
        showToast(`${result.failed.length} transcripts still failed`, "error");
      }
    } catch (error) {
      showToast("Retry failed", "error");
    } finally {
      setIsExtracting(false);
      setExtractionProgress({ completed: 0, total: 0 });
    }
  }, [failedExtractions, showToast]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (!isWatchLaterPage || !selectionManagerRef.current) return;

      // Escape - Clear all selections
      if (event.key === "Escape") {
        const selectedCount = selectionManagerRef.current.getSelectedCount();
        if (selectedCount > 0) {
          selectionManagerRef.current.clearSelection();
          showToast(`Cleared selection of ${selectedCount} videos`, "success");
          // Announce to screen readers
          const announcement = document.createElement("div");
          announcement.setAttribute("aria-live", "polite");
          announcement.setAttribute("aria-atomic", "true");
          announcement.style.position = "absolute";
          announcement.style.left = "-10000px";
          announcement.textContent = `Selection cleared. ${selectedCount} videos deselected.`;
          document.body.appendChild(announcement);
          setTimeout(() => document.body.removeChild(announcement), 1000);
        }
        return;
      }

      // Cmd/Ctrl+A - Select all videos
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key === "a" &&
        !event.shiftKey
      ) {
        if (videoElements.length > 0) {
          event.preventDefault();
          selectionManagerRef.current.selectAll(videoElements);
          showToast(`Selected all ${videoElements.length} videos`, "success");
          // Scroll to first video
          if (videoElements[0]?.element) {
            videoElements[0].element.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        }
        return;
      }

      // Cmd/Ctrl+C - Copy selected transcripts
      if ((event.metaKey || event.ctrlKey) && event.key === "c") {
        const selectedCount = selectionManagerRef.current.getSelectedCount();
        if (selectedCount > 0 && !isExtracting) {
          event.preventDefault();
          handleCopyTranscripts();
        }
        return;
      }

      // Cmd/Ctrl+S - Download transcripts
      if ((event.metaKey || event.ctrlKey) && event.key === "s") {
        const selectedCount = selectionManagerRef.current.getSelectedCount();
        if (selectedCount > 0 && !isExtracting) {
          event.preventDefault();
          handleDownloadTranscripts();
        }
        return;
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [
    isWatchLaterPage,
    videoElements,
    isExtracting,
    showToast,
    handleCopyTranscripts,
    handleDownloadTranscripts,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isUnmountedRef.current = true;
      if (cleanupListenersRef.current) {
        cleanupListenersRef.current();
      }
      if (mutationObserverRef.current) {
        mutationObserverRef.current.disconnect();
      }
      // Defer React cleanup to avoid synchronous unmounting
      setTimeout(() => {
        if (headerPillRootRef.current) {
          headerPillRootRef.current.unmount();
          headerPillRootRef.current = null;
        }
        const existingPill = document.querySelector(
          ".yt-wl-header-pill-container",
        );
        if (existingPill) {
          existingPill.remove();
        }
      }, 0);
    };
  }, []);

  // Only show toast notifications - header pill handles the main UI
  if (!isWatchLaterPage) {
    return null;
  }

  return (
    <>
      {/* Toast Notifications - Top Right */}
      <div
        style={{
          position: "fixed",
          top: "80px",
          right: "16px",
          zIndex: 10000,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          pointerEvents: "none",
        }}
      >
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            toast={toast}
            onDismiss={() =>
              setToasts((prev) => prev.filter((t) => t.id !== toast.id))
            }
            onRetryClick={
              failedExtractions.length > 0 ? handleRetryFailed : undefined
            }
          />
        ))}
      </div>

      {/* Inline styles for animations */}
      <style>
        {`
          @keyframes slideInFromTop {
            from {
              transform: translateY(-100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
          
          @keyframes slideInFromRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          @keyframes dropdownSlideIn {
            from {
              opacity: 0;
              transform: translateY(-8px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
      </style>
    </>
  );
});

WatchLaterEnhancedUI.displayName = "WatchLaterEnhancedUI";

// React Error Boundary Component
interface ErrorBoundaryState {
  readonly hasError: boolean;
  readonly error: Error | null;
}

interface ErrorBoundaryProps {
  readonly children: React.ReactNode;
}

class ExtensionErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error(
      "Extension Error Boundary caught an error:",
      error,
      errorInfo,
    );
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div
          style={{
            position: "fixed",
            top: "10px",
            right: "10px",
            background: "#fee2e2",
            border: "2px solid #dc2626",
            borderRadius: "8px",
            padding: "15px",
            zIndex: 9999,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <h3
            style={{ margin: "0 0 8px 0", color: "#dc2626", fontSize: "14px" }}
          >
            Extension Error
          </h3>
          <p style={{ margin: 0, fontSize: "12px", color: "#7f1d1d" }}>
            Check console for details
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default defineContentScript({
  matches: ["*://www.youtube.com/playlist?list=WL*"],
  cssInjectionMode: "ui",

  async main(ctx) {
    // Content script loaded

    const ui = await createShadowRootUi(ctx, {
      name: "yt-wl-enhanced",
      position: "overlay",
      anchor: "body",
      onMount: (container) => {
        // UI component mounting

        const app = document.createElement("div");
        container.append(app);

        const root = ReactDOM.createRoot(app);
        root.render(
          <ExtensionErrorBoundary>
            <WatchLaterEnhancedUI />
          </ExtensionErrorBoundary>,
        );

        // UI component mounted successfully
        return root;
      },
      onRemove: (root) => {
        // UI component unmounting
        root?.unmount();
      },
    });

    ui.mount();
    // Content script initialization completed
  },
});
