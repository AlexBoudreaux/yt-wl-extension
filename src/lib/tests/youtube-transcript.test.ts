import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import { extractVideoId, fetchVideoTranscript } from "~/lib/youtube-transcript";

// Store original window/document values to restore later
const originalWindow = (global as any).window;
const originalDocument = (global as any).document;

describe("extractVideoId", () => {
  it("extracts video ID from standard YouTube watch URL", () => {
    const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    expect(extractVideoId(url)).toBe("dQw4w9WgXcQ");
  });

  it("extracts video ID from youtube.be shortened URL", () => {
    const url = "https://youtu.be/dQw4w9WgXcQ";
    expect(extractVideoId(url)).toBe("dQw4w9WgXcQ");
  });

  it("extracts video ID from embed URL", () => {
    const url = "https://www.youtube.com/embed/dQw4w9WgXcQ";
    expect(extractVideoId(url)).toBe("dQw4w9WgXcQ");
  });

  it("extracts video ID from URL with additional parameters", () => {
    const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=30s";
    expect(extractVideoId(url)).toBe("dQw4w9WgXcQ");
  });

  it("returns null for invalid URLs", () => {
    expect(extractVideoId("https://example.com")).toBeNull();
    expect(extractVideoId("not-a-url")).toBeNull();
    expect(extractVideoId("")).toBeNull();
  });
});

describe("fetchVideoTranscript with InnerTube API", () => {
  // Mock the InnerTube API for testing - scoped to this describe block
  const mockGetTranscript = mock();

  // Mock the InnerTubeTranscriptFetcher class constructor
  const MockInnerTubeTranscriptFetcher = mock().mockImplementation(() => ({
    getTranscript: mockGetTranscript,
  }));

  // Mock the InnerTubeTranscriptFetcher module - scoped to this describe block
  mock.module("~/lib/innertube-transcript", () => ({
    InnerTubeTranscriptFetcher: MockInnerTubeTranscriptFetcher,
  }));

  beforeEach(() => {
    // Reset mocks between tests
    mockGetTranscript.mockClear();
    MockInnerTubeTranscriptFetcher.mockClear();

    // Ensure window is undefined to prevent DOM extraction
    delete (global as any).window;
    delete (global as any).document;
  });

  afterEach(() => {
    // Restore original values
    if (originalWindow !== undefined) {
      (global as any).window = originalWindow;
    }
    if (originalDocument !== undefined) {
      (global as any).document = originalDocument;
    }
  });

  it("successfully fetches transcript with InnerTube API", async () => {
    const videoId = "D6uFfrIBvR0";
    const mockTranscriptEntries = [
      { text: "Hello world", start: 0, duration: 2 },
      { text: "this is a test", start: 2, duration: 3 },
    ];

    mockGetTranscript.mockResolvedValueOnce(mockTranscriptEntries);

    const result = await fetchVideoTranscript(videoId);

    expect(result.success).toBe(true);
    expect(result.transcript).toBeDefined();
    if (result.success && result.transcript) {
      expect(result.transcript.videoId).toBe(videoId);
      expect(result.transcript.segments).toHaveLength(2);
      expect(result.transcript.transcript).toBe("Hello world this is a test");
      expect(mockGetTranscript).toHaveBeenCalledWith(videoId);
    }
  });

  it("handles no captions available error", async () => {
    const videoId = "test-video-id";

    mockGetTranscript.mockRejectedValueOnce(
      new Error("No captions available for this video"),
    );

    const result = await fetchVideoTranscript(videoId);

    expect(result.success).toBe(false);
    // After InnerTube fails, DOM extraction is attempted and also fails,
    // so we get the generic "All extraction methods failed" message
    expect(result.error).toContain("All extraction methods failed");
  });

  it("handles private or unavailable video error", async () => {
    const videoId = "test-video-id";

    mockGetTranscript.mockRejectedValueOnce(
      new Error("Video is unavailable or private"),
    );

    const result = await fetchVideoTranscript(videoId);

    expect(result.success).toBe(false);
    // After InnerTube fails, DOM extraction is attempted and also fails,
    // so we get the generic "All extraction methods failed" message
    expect(result.error).toContain("All extraction methods failed");
  });

  it("handles YouTube API request failure", async () => {
    const videoId = "test-video-id";

    mockGetTranscript.mockRejectedValueOnce(
      new Error("API request failed - please try again later"),
    );

    const result = await fetchVideoTranscript(videoId);

    expect(result.success).toBe(false);
    // After InnerTube fails, DOM extraction is attempted and also fails,
    // so we get the generic "All extraction methods failed" message
    expect(result.error).toContain("All extraction methods failed");
  });

  it("handles network errors gracefully", async () => {
    const videoId = "test-video-id";

    mockGetTranscript.mockRejectedValueOnce(new Error("Network error"));

    const result = await fetchVideoTranscript(videoId);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
    expect(typeof result.error).toBe("string");
  });

  it("handles empty transcript entries", async () => {
    const videoId = "no-transcript-video";

    mockGetTranscript.mockResolvedValueOnce([]);

    const result = await fetchVideoTranscript(videoId);

    expect(result.success).toBe(false);
    // When InnerTube returns empty array, it throws "No transcript entries returned" error,
    // then DOM extraction is attempted and fails, so we get the generic message
    expect(result.error).toContain("All extraction methods failed");
  });

  it("handles fallback to DOM extraction when InnerTube fails", async () => {
    const videoId = "test123";

    // Mock InnerTube failure
    mockGetTranscript.mockRejectedValueOnce(new Error("InnerTube API failed"));

    const result = await fetchVideoTranscript(videoId);

    expect(result.success).toBe(false);
    expect(result.error).toContain("All extraction methods failed");
    expect(mockGetTranscript).toHaveBeenCalledWith(videoId);
  });

  it("maintains correct interface for successful results", async () => {
    const videoId = "test123";
    const mockTranscriptEntries = [
      { text: "Hello world", start: 0, duration: 2 },
      { text: "this is a test transcript", start: 2, duration: 3 },
    ];

    mockGetTranscript.mockResolvedValueOnce(mockTranscriptEntries);

    const result = await fetchVideoTranscript(videoId);

    expect(result.success).toBe(true);
    if (result.success && result.transcript) {
      expect(result.transcript.videoId).toBe(videoId);
      expect(result.transcript.segments).toHaveLength(2);
      expect(result.transcript.segments[0]?.text).toBe("Hello world");
      expect(result.transcript.url).toBe(
        `https://www.youtube.com/watch?v=${videoId}`,
      );
      expect(result.transcript.language).toBe("en");
      expect(result.transcript.isAutoGenerated).toBe(true);
    }
  });
});
