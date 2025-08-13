/**
 * InnerTube Transcript Fetcher
 *
 * Replicates the functionality of python youtube_transcript_api
 * using YouTube's internal InnerTube API to fetch video transcripts.
 *
 * Based on reverse engineering analysis of the Python implementation.
 */

export interface TranscriptEntry {
  text: string;
  start: number;
  duration: number;
}

interface CaptionTrack {
  baseUrl: string;
  languageCode: string;
  name?: {
    simpleText: string;
  };
}

interface PlayerResponse {
  captions?: {
    playerCaptionsTracklistRenderer?: {
      captionTracks?: CaptionTrack[];
    };
  };
}

export class InnerTubeTranscriptFetcher {
  private readonly ANDROID_CLIENT_CONTEXT = {
    clientName: "ANDROID",
    clientVersion: "20.10.38",
  };

  private readonly USER_AGENT =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

  /**
   * Main entry point to fetch transcript for a video
   */
  async getTranscript(videoId: string): Promise<TranscriptEntry[]> {
    try {
      console.log(`Starting transcript extraction for video: ${videoId}`);

      // Step 1: Fetch YouTube watch page HTML
      const html = await this.fetchWatchPageHtml(videoId);
      console.log("✓ Fetched watch page HTML");

      // Step 2: Extract INNERTUBE_API_KEY using regex
      const apiKey = this.extractInnerTubeApiKey(html);
      console.log("✓ Extracted InnerTube API key");

      // Step 3: POST to YouTube InnerTube API with ANDROID client context
      const playerData = await this.fetchPlayerData(videoId, apiKey);
      console.log("✓ Fetched player data from InnerTube API");

      // Step 4: Extract caption tracks from response
      const captionTracks = this.extractCaptionTracks(playerData);
      console.log(`✓ Found ${captionTracks.length} caption track(s)`);

      // Step 5: Fetch transcript XML from baseUrl (cleaned)
      const firstTrack = captionTracks[0];
      if (!firstTrack) {
        throw new Error("No caption tracks available");
      }
      const xml = await this.fetchTranscriptXml(firstTrack.baseUrl);
      console.log("✓ Fetched transcript XML");

      // Step 6: Parse XML to structured transcript data
      const transcript = this.parseTranscriptXml(xml);
      console.log(`✓ Parsed ${transcript.length} transcript entries`);

      return transcript;
    } catch (error) {
      console.error(`Failed to fetch transcript for video ${videoId}:`, error);
      throw error;
    }
  }

  /**
   * Step 1: Fetch the YouTube watch page HTML
   * Made public for testing purposes
   */
  async fetchWatchPageHtml(videoId: string): Promise<string> {
    const url = `https://www.youtube.com/watch?v=${videoId}`;

    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": this.USER_AGENT,
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive",
          "Upgrade-Insecure-Requests": "1",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch watch page: ${response.status} ${response.statusText}`,
        );
      }

      const html = await response.text();

      if (html.length < 1000) {
        throw new Error("Received suspiciously short HTML response");
      }

      if (!html.includes("INNERTUBE_API_KEY")) {
        throw new Error("HTML response does not contain INNERTUBE_API_KEY");
      }

      return html;
    } catch (error) {
      throw new Error(
        `Failed to fetch YouTube watch page for video ${videoId}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Step 2: Extract INNERTUBE_API_KEY from HTML using regex
   * Made public for testing purposes
   */
  extractInnerTubeApiKey(html: string): string {
    // Multiple patterns to match different formats
    const patterns = [
      /INNERTUBE_API_KEY["']?\s*[:=]\s*["']([^"']+)["']/,
      /INNERTUBE_API_KEY["']?\s*[:=]\s*([^",\s]+)/,
      /"INNERTUBE_API_KEY":\s*"([^"]+)"/,
      /'INNERTUBE_API_KEY':\s*'([^']+)'/,
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match?.[1]) {
        const apiKey = match[1].trim();
        console.log(`Found API key: ${apiKey.substring(0, 10)}...`);
        return apiKey;
      }
    }

    throw new Error("INNERTUBE_API_KEY not found in HTML response");
  }

  /**
   * Step 3: Fetch player data from InnerTube API
   * Made public for testing purposes
   */
  async fetchPlayerData(
    videoId: string,
    apiKey: string,
  ): Promise<PlayerResponse> {
    const url = `https://www.youtube.com/youtubei/v1/player?key=${apiKey}`;

    const requestBody = {
      context: {
        client: this.ANDROID_CLIENT_CONTEXT,
      },
      videoId: videoId,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": this.USER_AGENT,
          "X-YouTube-Client-Name": "3", // Android client
          "X-YouTube-Client-Version": this.ANDROID_CLIENT_CONTEXT.clientVersion,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(
          `InnerTube API request failed: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();

      if (!data || typeof data !== "object") {
        throw new Error("Invalid response from InnerTube API");
      }

      return data as PlayerResponse;
    } catch (error) {
      throw new Error(
        `Failed to fetch player data: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Step 4: Extract caption tracks from player response
   * Made public for testing purposes
   */
  extractCaptionTracks(playerData: PlayerResponse): CaptionTrack[] {
    if (!playerData.captions) {
      throw new Error("No captions available for this video");
    }

    const tracklistRenderer =
      playerData.captions.playerCaptionsTracklistRenderer;
    if (!tracklistRenderer) {
      throw new Error("No caption tracklist renderer found");
    }

    const captionTracks = tracklistRenderer.captionTracks;
    if (!captionTracks || !Array.isArray(captionTracks)) {
      throw new Error("No caption tracks found");
    }

    if (captionTracks.length === 0) {
      throw new Error("No caption tracks found");
    }

    // Log available tracks
    console.log("Available caption tracks:");
    captionTracks.forEach((track, index) => {
      const language =
        track.name?.simpleText || track.languageCode || "unknown";
      console.log(`  ${index + 1}. ${language} (${track.languageCode})`);
    });

    return captionTracks;
  }

  /**
   * Step 5: Fetch transcript XML from cleaned baseUrl
   * Made public for testing purposes
   */
  async fetchTranscriptXml(baseUrl: string): Promise<string> {
    const cleanedUrl = this.cleanBaseUrl(baseUrl);
    console.log(`Fetching transcript XML from: ${cleanedUrl}`);

    try {
      const response = await fetch(cleanedUrl, {
        headers: {
          "User-Agent": this.USER_AGENT,
          Accept: "application/xml, text/xml, */*",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch transcript XML: ${response.status} ${response.statusText}`,
        );
      }

      const xml = await response.text();

      if (!xml || xml.trim().length === 0) {
        throw new Error("Received empty XML response");
      }

      if (!xml.includes("<?xml") && !xml.includes("<transcript>")) {
        throw new Error(
          "Response does not appear to be valid XML transcript data",
        );
      }

      return xml;
    } catch (error) {
      throw new Error(
        `Failed to fetch transcript XML: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Clean baseUrl by removing fmt=srv3 parameter
   * Made public for testing purposes
   */
  cleanBaseUrl(baseUrl: string): string {
    const url = new URL(baseUrl);
    url.searchParams.delete("fmt");
    return url.toString();
  }

  /**
   * Step 6: Parse XML transcript data into structured entries
   * Made public for testing purposes
   */
  parseTranscriptXml(xml: string): TranscriptEntry[] {
    try {
      // Check if we're in a browser environment or Node.js test environment
      if (typeof DOMParser !== "undefined") {
        return this.parseXmlWithDOMParser(xml);
      }
      // Fallback to regex parsing for Node.js/test environment
      return this.parseXmlWithRegex(xml);
    } catch (error) {
      throw new Error(
        `Failed to parse transcript XML: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Parse XML using browser's DOMParser
   */
  private parseXmlWithDOMParser(xml: string): TranscriptEntry[] {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");

    // Check for parsing errors
    const parserError = xmlDoc.querySelector("parsererror");
    if (parserError) {
      throw new Error(`XML parsing error: ${parserError.textContent}`);
    }

    // Find all <text> elements
    const textElements = xmlDoc.querySelectorAll("text");

    if (textElements.length === 0) {
      console.warn(
        "No <text> elements found in XML, returning empty transcript",
      );
      return [];
    }

    const entries: TranscriptEntry[] = [];

    for (const element of textElements) {
      const startAttr = element.getAttribute("start");
      const durAttr = element.getAttribute("dur");
      const text = element.textContent;

      if (startAttr && durAttr && text) {
        const start = Number.parseFloat(startAttr);
        const duration = Number.parseFloat(durAttr);

        if (!Number.isNaN(start) && !Number.isNaN(duration)) {
          entries.push({
            text: this.decodeHtmlEntities(text.trim()),
            start,
            duration,
          });
        }
      }
    }

    console.log(`Successfully parsed ${entries.length} transcript entries`);
    return entries;
  }

  /**
   * Parse XML using regex for Node.js/test environments
   */
  private parseXmlWithRegex(xml: string): TranscriptEntry[] {
    // Basic validation for XML-like structure
    if (!xml.includes("<text") && !xml.includes("<?xml")) {
      throw new Error("Invalid XML: Missing text elements or XML declaration");
    }

    const entries: TranscriptEntry[] = [];

    // Regex to match <text start="..." dur="...">content</text>
    const textRegex =
      /<text[^>]+start="([^"]+)"[^>]+dur="([^"]+)"[^>]*>([^<]*)<\/text>/g;

    let match: RegExpExecArray | null;
    while ((match = textRegex.exec(xml)) !== null) {
      const [, startStr, durStr, text] = match;

      if (!startStr || !durStr || !text) continue;

      const start = Number.parseFloat(startStr);
      const duration = Number.parseFloat(durStr);

      if (!Number.isNaN(start) && !Number.isNaN(duration) && text.trim()) {
        entries.push({
          text: this.decodeHtmlEntities(text.trim()),
          start,
          duration,
        });
      }
    }

    console.log(
      `Successfully parsed ${entries.length} transcript entries using regex`,
    );
    return entries;
  }

  /**
   * Decode HTML entities in transcript text
   */
  private decodeHtmlEntities(text: string): string {
    const entityMap: Record<string, string> = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&#39;": "'",
      "&#x27;": "'",
      "&#x2F;": "/",
      "&#x60;": "`",
      "&#x3D;": "=",
    };

    return text.replace(/&[#\w]+;/g, (entity) => {
      return entityMap[entity] || entity;
    });
  }

  /**
   * Get transcript with language preference
   */
  async getTranscriptWithLanguage(
    videoId: string,
    languageCode?: string,
  ): Promise<TranscriptEntry[]> {
    try {
      console.log(
        `Starting transcript extraction for video: ${videoId} with language preference: ${languageCode || "auto"}`,
      );

      const html = await this.fetchWatchPageHtml(videoId);
      const apiKey = this.extractInnerTubeApiKey(html);
      const playerData = await this.fetchPlayerData(videoId, apiKey);
      const captionTracks = this.extractCaptionTracks(playerData);

      // Find preferred language track or use first available
      let selectedTrack = captionTracks[0];

      if (languageCode) {
        const preferredTrack = captionTracks.find(
          (track) =>
            track.languageCode === languageCode ||
            track.languageCode.startsWith(languageCode),
        );

        if (preferredTrack) {
          selectedTrack = preferredTrack;
          console.log(
            `Using preferred language track: ${selectedTrack.languageCode}`,
          );
        } else {
          console.log(
            `Language ${languageCode} not found, using default: ${selectedTrack?.languageCode ?? "unknown"}`,
          );
        }
      }

      if (!selectedTrack?.baseUrl) {
        throw new Error("No valid caption track found");
      }
      const xml = await this.fetchTranscriptXml(selectedTrack.baseUrl);
      return this.parseTranscriptXml(xml);
    } catch (error) {
      console.error(`Failed to fetch transcript for video ${videoId}:`, error);
      throw error;
    }
  }
}
