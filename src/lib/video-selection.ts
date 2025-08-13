import type { SelectedVideo, VideoElement, VideoSelectionState } from "~/types";
import {
	extractVideoIdFromElement,
	extractVideoMetadata,
} from "./youtube-transcript";

/**
 * Hook for managing video selection state
 */
export class VideoSelectionManager {
	private selectedVideos = new Map<string, SelectedVideo>();
	private lastSelectedIndex: number | null = null;
	private totalVideos = 0;
	private onSelectionChange?: (state: VideoSelectionState) => void;

	constructor(onSelectionChange?: (state: VideoSelectionState) => void) {
		this.onSelectionChange = onSelectionChange;
	}

	/**
	 * Updates the available videos and maintains selection state
	 */
	updateVideos(videoElements: VideoElement[]): void {
		this.totalVideos = videoElements.length;

		// Remove selections for videos that no longer exist
		const currentVideoIds = new Set(videoElements.map((v) => v.videoId));
		for (const [videoId] of this.selectedVideos) {
			if (!currentVideoIds.has(videoId)) {
				this.selectedVideos.delete(videoId);
			}
		}

		this.notifyChange();
	}

	/**
	 * Toggles selection of a single video
	 */
	toggleVideo(video: VideoElement): void {
		if (this.selectedVideos.has(video.videoId)) {
			this.selectedVideos.delete(video.videoId);
		} else {
			this.selectedVideos.set(video.videoId, {
				...video,
				isSelected: true,
			});
		}

		this.lastSelectedIndex = video.index;
		this.notifyChange();
	}

	/**
	 * Selects a range of videos (Shift+Click behavior)
	 */
	selectRange(video: VideoElement, allVideos: VideoElement[]): void {
		if (this.lastSelectedIndex === null) {
			this.toggleVideo(video);
			return;
		}

		const startIndex = Math.min(this.lastSelectedIndex, video.index);
		const endIndex = Math.max(this.lastSelectedIndex, video.index);

		for (let i = startIndex; i <= endIndex; i++) {
			const videoToSelect = allVideos[i];
			if (videoToSelect) {
				this.selectedVideos.set(videoToSelect.videoId, {
					...videoToSelect,
					isSelected: true,
				});
			}
		}

		this.lastSelectedIndex = video.index;
		this.notifyChange();
	}

	/**
	 * Selects all videos
	 */
	selectAll(allVideos: VideoElement[]): void {
		for (const video of allVideos) {
			this.selectedVideos.set(video.videoId, {
				...video,
				isSelected: true,
			});
		}

		this.notifyChange();
	}

	/**
	 * Clears all selections
	 */
	clearSelection(): void {
		this.selectedVideos.clear();
		this.lastSelectedIndex = null;
		this.notifyChange();
	}

	/**
	 * Checks if a video is selected
	 */
	isVideoSelected(videoId: string): boolean {
		return this.selectedVideos.has(videoId);
	}

	/**
	 * Gets the current selection state
	 */
	getSelectionState(): VideoSelectionState {
		return {
			selectedVideos: new Map(this.selectedVideos),
			lastSelectedIndex: this.lastSelectedIndex,
			totalVideos: this.totalVideos,
		};
	}

	/**
	 * Gets selected videos as array
	 */
	getSelectedVideos(): SelectedVideo[] {
		return Array.from(this.selectedVideos.values());
	}

	/**
	 * Gets selected video count
	 */
	getSelectedCount(): number {
		return this.selectedVideos.size;
	}

	/**
	 * Notifies listeners of selection changes
	 */
	private notifyChange(): void {
		this.onSelectionChange?.(this.getSelectionState());
	}
}

/**
 * Extracts video data from YouTube DOM elements
 */
export const extractVideoElementsFromDOM = (): VideoElement[] => {
	const videoSelectors = [
		// Primary selectors for YouTube Watch Later playlist
		"ytd-playlist-video-renderer",
		"ytd-playlist-video-list-renderer #contents > ytd-playlist-video-renderer",
		"#contents ytd-playlist-video-renderer",
		"ytd-playlist-video-renderer[data-video-id]",
		// Fallback selectors for different YouTube layouts
		"[data-video-id]:has(a[href*=\"/watch?v=\"])",
		"ytd-playlist-video-renderer:has(a[href*=\"/watch?v=\"])",
		".ytd-playlist-video-renderer:has(a[href*=\"/watch?v=\"])",
		// Additional fallbacks for grid/list views
		"ytd-grid-video-renderer",
		"ytd-video-renderer",
		// Generic video container selectors
		"[id*=\"video-\"]:has(a[href*=\"/watch?v=\"])",
		".video-renderer:has(a[href*=\"/watch?v=\"])",
	];

	const dedup = new Map<string, VideoElement>();
	let runningIndex = 0;

	for (const selector of videoSelectors) {
		const elements = document.querySelectorAll(selector);
		elements.forEach((element) => {
			const htmlElement = element as HTMLElement;
			const videoId = extractVideoIdFromElement(htmlElement);
			if (!videoId) return;
			if (dedup.has(videoId)) return;
			const metadata = extractVideoMetadata(htmlElement, runningIndex);
			dedup.set(videoId, {
				videoId,
				index: runningIndex,
				element: htmlElement,
				...metadata,
			});
			runningIndex++;
		});
	}

	return Array.from(dedup.values());
};

/**
 * Adds visual selection styling to a video element
 */
export const addSelectionStyling = (element: HTMLElement): void => {
	// Remove existing selection class first
	removeSelectionStyling(element);

	// Add selection styling with native YouTube look
	element.classList.add("yt-wl-selected");

	// Add inline styles as fallback - reduced height impact
	element.style.outline = "2px solid var(--yt-spec-call-to-action)";
	element.style.outlineOffset = "1px";
	element.style.borderRadius = "8px";
	element.style.backgroundColor = "var(--yt-spec-brand-button-text)";
	element.style.transition = "all 0.2s ease-in-out";

	// Scroll into view if not visible
	const rect = element.getBoundingClientRect();
	const isVisible =
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= window.innerHeight &&
		rect.right <= window.innerWidth;

	if (!isVisible) {
		element.scrollIntoView({ behavior: "smooth", block: "center" });
	}
};

/**
 * Removes visual selection styling from a video element
 */
export const removeSelectionStyling = (element: HTMLElement): void => {
	element.classList.remove("yt-wl-selected");

	// Remove inline styles
	element.style.outline = "";
	element.style.outlineOffset = "";
	element.style.borderRadius = "";
	element.style.backgroundColor = "";
	element.style.transition = "";
};

/**
 * Handles keyboard shortcuts for video selection
 */
export const handleKeyboardShortcuts = (
	event: KeyboardEvent,
	selectionManager: VideoSelectionManager,
	allVideos: VideoElement[],
): boolean => {
	// Escape - Clear all selections
	if (event.key === "Escape") {
		if (selectionManager.getSelectedCount() > 0) {
			selectionManager.clearSelection();
			return true;
		}
	}

	// Ctrl/Cmd + A - Select All
	if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "a") {
		event.preventDefault();
		selectionManager.selectAll(allVideos);
		return true;
	}

	return false;
};

/**
 * Handles click events on video elements
 */
export const handleVideoClick = (
	event: MouseEvent,
	video: VideoElement,
	selectionManager: VideoSelectionManager,
	allVideos: VideoElement[],
): boolean => {
	// Check if this is a Cmd+Click for individual selection
	const isCmdClick = (event.ctrlKey || event.metaKey) && !event.shiftKey;

	if (isCmdClick) {
		// Cmd/Ctrl + Click - Toggle individual video selection
		event.preventDefault();
		event.stopPropagation();
		selectionManager.toggleVideo(video);
		return true;
	}

	// For all other clicks (including Shift+Click), let browser handle naturally
	// Only clear selections if there are any active
	if (selectionManager.getSelectedCount() > 0 && !event.shiftKey) {
		selectionManager.clearSelection();
		return true;
	}

	return false;
};

/**
 * Sets up event listeners for video selection
 */
export const setupVideoSelectionListeners = (
	container: Element,
	selectionManager: VideoSelectionManager,
	allVideos: VideoElement[],
): (() => void) => {
	// Click handler
	const handleClick = (event: Event) => {
		const mouseEvent = event as MouseEvent;
		const target = mouseEvent.target as HTMLElement;

		// Find the video element
		const videoElement = target.closest(
			"ytd-playlist-video-renderer",
		) as HTMLElement;
		if (!videoElement) return;

		// Find the corresponding video data
		const video = allVideos.find((v) => v.element === videoElement);
		if (!video) return;

		handleVideoClick(mouseEvent, video, selectionManager, allVideos);
	};

	// Keyboard handler
	const handleKeyboard = (event: KeyboardEvent) => {
		handleKeyboardShortcuts(event, selectionManager, allVideos);
	};

	// Add event listeners
	container.addEventListener("click", handleClick, true);
	document.addEventListener("keydown", handleKeyboard);

	// Return cleanup function
	return () => {
		container.removeEventListener("click", handleClick, true);
		document.removeEventListener("keydown", handleKeyboard);
	};
};

/**
 * Updates visual styling for all videos based on selection state
 */
export const updateVideoSelectionStyling = (
	allVideos: VideoElement[],
	selectionManager: VideoSelectionManager,
): void => {
	for (const video of allVideos) {
		if (selectionManager.isVideoSelected(video.videoId)) {
			addSelectionStyling(video.element);
		} else {
			removeSelectionStyling(video.element);
		}
	}
};
