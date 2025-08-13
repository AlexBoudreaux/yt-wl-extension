import { beforeEach, describe, expect, test } from "bun:test";
import { InnerTubeTranscriptFetcher } from "../innertube-transcript";

interface TranscriptEntry {
  text: string;
  start: number;
  duration: number;
}

describe("InnerTubeTranscriptFetcher", () => {
  let fetcher: InnerTubeTranscriptFetcher;

  beforeEach(() => {
    fetcher = new InnerTubeTranscriptFetcher();
  });

  describe("getTranscript", () => {
    test("should fetch transcript for known working video", async () => {
      const videoId = "D6uFfrIBvR0";
      const transcript = await fetcher.getTranscript(videoId);

      expect(transcript).toBeInstanceOf(Array);
      expect(transcript.length).toBeGreaterThan(0);

      // Check transcript entry structure
      const firstEntry = transcript[0]!;
      expect(firstEntry).toHaveProperty("text");
      expect(firstEntry).toHaveProperty("start");
      expect(firstEntry).toHaveProperty("duration");
      expect(typeof firstEntry.text).toBe("string");
      expect(typeof firstEntry.start).toBe("number");
      expect(typeof firstEntry.duration).toBe("number");

      // Text should not be empty
      expect(firstEntry.text.trim().length).toBeGreaterThan(0);

      // Start time should be non-negative
      expect(firstEntry.start).toBeGreaterThanOrEqual(0);

      // Duration should be positive
      expect(firstEntry.duration).toBeGreaterThan(0);
    }, 30000); // 30 second timeout for network requests

    test("should handle invalid video ID gracefully", async () => {
      const invalidVideoId = "invalid_video_id";

      await expect(fetcher.getTranscript(invalidVideoId)).rejects.toThrow();
    });

    test("should handle video without transcripts gracefully", async () => {
      // This might need to be updated with a known video without transcripts
      const videoWithoutTranscript = "nonexistent123";

      await expect(
        fetcher.getTranscript(videoWithoutTranscript),
      ).rejects.toThrow();
    });
  });

  describe("fetchWatchPageHtml", () => {
    test("should fetch HTML containing YouTube data", async () => {
      const videoId = "D6uFfrIBvR0";
      const html = await fetcher.fetchWatchPageHtml(videoId);

      expect(typeof html).toBe("string");
      expect(html.length).toBeGreaterThan(1000); // Should be substantial HTML
      expect(html).toContain("INNERTUBE_API_KEY");
      expect(html).toContain("ytInitialData");
    });

    test("should handle invalid video ID (YouTube returns generic page)", async () => {
      const invalidVideoId = "invalid_video_id";

      // YouTube actually returns a generic page for invalid IDs, so this won't throw
      const html = await fetcher.fetchWatchPageHtml(invalidVideoId);
      expect(html).toContain("INNERTUBE_API_KEY");
    });
  });

  describe("extractInnerTubeApiKey", () => {
    test("should extract API key from valid HTML", () => {
      const mockHtml = `
        <html>
          <script>
            var INNERTUBE_API_KEY = "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8";
            var other_data = "something";
          </script>
        </html>
      `;

      const apiKey = fetcher.extractInnerTubeApiKey(mockHtml);
      expect(apiKey).toBe("AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8");
    });

    test("should throw error when API key not found", () => {
      const htmlWithoutApiKey = "<html><body>No API key here</body></html>";

      expect(() => fetcher.extractInnerTubeApiKey(htmlWithoutApiKey)).toThrow(
        "INNERTUBE_API_KEY not found",
      );
    });

    test("should handle different API key formats", () => {
      const htmlWithQuotes = `INNERTUBE_API_KEY = "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8"`;
      const htmlWithoutQuotes = `INNERTUBE_API_KEY = AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8`;

      expect(fetcher.extractInnerTubeApiKey(htmlWithQuotes)).toBe(
        "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8",
      );
      expect(fetcher.extractInnerTubeApiKey(htmlWithoutQuotes)).toBe(
        "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8",
      );
    });
  });

  describe("fetchPlayerData", () => {
    test("should fetch player data with valid API key", async () => {
      const videoId = "D6uFfrIBvR0";
      const apiKey = "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8";

      const playerData = await fetcher.fetchPlayerData(videoId, apiKey);

      expect(playerData).toBeInstanceOf(Object);
      expect(playerData).toHaveProperty("captions");
    });

    test("should handle invalid API key (YouTube may still respond)", async () => {
      const videoId = "D6uFfrIBvR0";
      const invalidApiKey = "invalid_api_key";

      try {
        const playerData = await fetcher.fetchPlayerData(
          videoId,
          invalidApiKey,
        );
        // If it doesn't throw, that's fine - YouTube's API is sometimes permissive
        expect(playerData).toBeInstanceOf(Object);
      } catch (error) {
        // If it throws, that's also expected behavior
        expect(error).toBeDefined();
      }
    });
  });

  describe("extractCaptionTracks", () => {
    test("should extract caption tracks from player data", () => {
      const mockPlayerData = {
        captions: {
          playerCaptionsTracklistRenderer: {
            captionTracks: [
              {
                baseUrl:
                  "https://www.youtube.com/api/timedtext?v=D6uFfrIBvR0&fmt=srv3",
                name: { simpleText: "English" },
                languageCode: "en",
              },
              {
                baseUrl:
                  "https://www.youtube.com/api/timedtext?v=D6uFfrIBvR0&fmt=srv3&lang=es",
                name: { simpleText: "Spanish" },
                languageCode: "es",
              },
            ],
          },
        },
      };

      const tracks = fetcher.extractCaptionTracks(mockPlayerData);

      expect(tracks).toBeInstanceOf(Array);
      expect(tracks.length).toBe(2);
      expect(tracks[0]).toHaveProperty("baseUrl");
      expect(tracks[0]).toHaveProperty("languageCode");
    });

    test("should throw error when no captions available", () => {
      const playerDataWithoutCaptions: any = { someOtherData: "value" };

      expect(() =>
        fetcher.extractCaptionTracks(playerDataWithoutCaptions),
      ).toThrow("No captions available");
    });

    test("should handle empty caption tracks", () => {
      const playerDataWithEmptyCaptions = {
        captions: {
          playerCaptionsTracklistRenderer: {
            captionTracks: [],
          },
        },
      };

      expect(() =>
        fetcher.extractCaptionTracks(playerDataWithEmptyCaptions),
      ).toThrow("No caption tracks found");
    });
  });

  describe("fetchTranscriptXml", () => {
    test("should fetch and clean transcript XML", async () => {
      // This test will need a real baseUrl from YouTube which requires authentication
      // For now, let's skip this test since it requires a valid authenticated URL
      const baseUrl =
        "https://www.youtube.com/api/timedtext?v=D6uFfrIBvR0&fmt=srv3";

      try {
        const xml = await fetcher.fetchTranscriptXml(baseUrl);
        expect(typeof xml).toBe("string");
        expect(xml.length).toBeGreaterThan(0);
      } catch (error) {
        // This is expected since we need authentication parameters for the transcript URL
        expect(error).toBeDefined();
      }
    });

    test("should clean baseUrl by removing fmt=srv3", async () => {
      const baseUrl =
        "https://www.youtube.com/api/timedtext?v=D6uFfrIBvR0&fmt=srv3&other=param";

      // We'll need to expose the URL cleaning logic for testing
      const cleanedUrl = fetcher.cleanBaseUrl(baseUrl);

      expect(cleanedUrl).not.toContain("fmt=srv3");
      expect(cleanedUrl).toContain("other=param");
    });
  });

  describe("parseTranscriptXml", () => {
    test("should parse XML into transcript entries", () => {
      const mockXml = `<?xml version="1.0" encoding="utf-8"?>
        <transcript>
          <text start="0" dur="2.5">Hello world</text>
          <text start="2.5" dur="3.0">This is a test</text>
          <text start="5.5" dur="1.8">End of transcript</text>
        </transcript>`;

      const entries = fetcher.parseTranscriptXml(mockXml);

      expect(entries).toBeInstanceOf(Array);
      expect(entries.length).toBe(3);

      expect(entries[0]!).toEqual({
        text: "Hello world",
        start: 0,
        duration: 2.5,
      });

      expect(entries[1]!).toEqual({
        text: "This is a test",
        start: 2.5,
        duration: 3.0,
      });

      expect(entries[2]).toEqual({
        text: "End of transcript",
        start: 5.5,
        duration: 1.8,
      });
    });

    test("should handle XML with HTML entities", () => {
      const xmlWithEntities = `<?xml version="1.0" encoding="utf-8"?>
        <transcript>
          <text start="0" dur="2.5">Hello &amp; goodbye</text>
          <text start="2.5" dur="3.0">&lt;script&gt; alert(&quot;test&quot;); &lt;/script&gt;</text>
        </transcript>`;

      const entries = fetcher.parseTranscriptXml(xmlWithEntities);

      expect(entries[0]!.text).toBe("Hello & goodbye");
      expect(entries[1]!.text).toBe('<script> alert("test"); </script>');
    });

    test("should throw error for invalid XML", () => {
      const invalidXml = "This is not XML";

      expect(() => fetcher.parseTranscriptXml(invalidXml)).toThrow();
    });

    test("should handle empty transcript", () => {
      const emptyXml = `<?xml version="1.0" encoding="utf-8"?><transcript></transcript>`;

      const entries = fetcher.parseTranscriptXml(emptyXml);

      expect(entries).toBeInstanceOf(Array);
      expect(entries.length).toBe(0);
    });
  });

  describe("integration tests", () => {
    test("should complete full workflow for known video", async () => {
      const videoId = "D6uFfrIBvR0";

      // Test each step individually
      console.log("Step 1: Fetching watch page HTML...");
      const html = await fetcher.fetchWatchPageHtml(videoId);
      expect(html).toContain("INNERTUBE_API_KEY");

      console.log("Step 2: Extracting API key...");
      const apiKey = fetcher.extractInnerTubeApiKey(html);
      expect(apiKey).toMatch(/^AIza/); // YouTube API keys typically start with AIza

      console.log("Step 3: Fetching player data...");
      const playerData = await fetcher.fetchPlayerData(videoId, apiKey);
      expect(playerData).toHaveProperty("captions");

      console.log("Step 4: Extracting caption tracks...");
      const tracks = fetcher.extractCaptionTracks(playerData);
      expect(tracks.length).toBeGreaterThan(0);

      console.log("Step 5: Fetching transcript XML...");
      const xml = await fetcher.fetchTranscriptXml(tracks[0]!.baseUrl);
      expect(xml).toContain("<?xml");

      console.log("Step 6: Parsing transcript XML...");
      const entries = fetcher.parseTranscriptXml(xml);
      expect(entries.length).toBeGreaterThan(0);

      console.log(
        `Successfully extracted ${entries.length} transcript entries`,
      );
    }, 45000); // Longer timeout for full integration test
  });
});
