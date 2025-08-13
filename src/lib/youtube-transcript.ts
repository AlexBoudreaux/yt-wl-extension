import type {
  BulkTranscriptResult,
  TranscriptFetchResult,
  TranscriptSegment,
  VideoTranscript,
} from "~/types";
import {
  InnerTubeTranscriptFetcher,
  type TranscriptEntry,
} from "./innertube-transcript";

const CHARACTER_LIMIT = 20000;

// Enum for transcript extraction methods
enum TranscriptMethod {
  INNERTUBE_API = "innertube-api",
  DOM_EXTRACTION = "dom-extraction",
  ORIGINAL_PACKAGE = "youtube-transcript", // Deprecated
}

// Debug information for each extraction attempt
interface ExtractionAttempt {
  method: TranscriptMethod;
  success: boolean;
  error?: string;
  resultLength?: number;
  language?: string;
  executionTime?: number;
}

/**
 * Formats transcripts as Markdown in the specified format
 */
export const formatTranscriptsAsMarkdown = (
  transcripts: readonly VideoTranscript[],
): string => {
  if (transcripts.length === 0) {
    return "# Video Transcripts\n\n*No transcripts available*";
  }

  const markdownContent = transcripts
    .map((transcript, index) => {
      const videoNumber = index + 1;
      const title = transcript.title || `Video ${videoNumber}`;
      const channel = transcript.channel || "Unknown Channel";
      const uploadDate = transcript.publishDate || "Unknown";
      const transcriptText = transcript.transcript || "No transcript available";

      return `## Video ${videoNumber}\n**Title:** ${title}\n**Creator:** ${channel}\n**Date:** ${uploadDate}\n\n### Transcript\n${transcriptText}`;
    })
    .join("\n\n---\n\n");

  return `# Video Transcripts\n\nGenerated on: ${new Date().toLocaleString()}\nTotal videos: ${transcripts.length}\n\n${markdownContent}`;
};

/**
 * Escapes Markdown special characters
 */
const escapeMarkdown = (str: string): string => {
  return str.replace(/([\\`*_{}\[\]()#+\-.!])/g, "\\$1").replace(/\n/g, "\n\n");
};

/**
 * Extracts video ID from YouTube URL
 */
export const extractVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /(?:youtube\.com\/v\/)([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
};

/**
 * Extracts video ID from YouTube video element
 */
export const extractVideoIdFromElement = (
  element: HTMLElement,
): string | null => {
  // Try to find video link in the element
  const linkElement = element.querySelector(
    'a[href*="/watch?v="]',
  ) as HTMLAnchorElement;

  if (linkElement?.href) {
    return extractVideoId(linkElement.href);
  }

  // Fallback: look for data attributes that might contain video ID
  const videoId =
    element.getAttribute("data-video-id") ||
    element.querySelector("[data-video-id]")?.getAttribute("data-video-id") ||
    null;

  return videoId;
};

/**
 * Extracts additional video metadata from YouTube video element
 */
export const extractVideoMetadata = (element: HTMLElement, index: number) => {
  const titleElement = element.querySelector(
    "#video-title, .ytd-video-meta-block #video-title",
  ) as HTMLElement;
  const channelElement = element.querySelector(
    "#channel-name a, .ytd-channel-name a",
  ) as HTMLElement;
  const durationElement = element.querySelector(
    ".ytd-thumbnail-overlay-time-status-renderer, #duration",
  ) as HTMLElement;
  const thumbnailElement = element.querySelector("img") as HTMLImageElement;

  const title = titleElement?.textContent?.trim() || `Video ${index + 1}`;
  const channel = channelElement?.textContent?.trim() || "Unknown Channel";
  const duration = durationElement?.textContent?.trim() || "0:00";
  const thumbnailUrl = thumbnailElement?.src || "";

  // Extract video URL
  const linkElement = element.querySelector(
    'a[href*="/watch?v="]',
  ) as HTMLAnchorElement;
  const url = linkElement?.href || "";

  const metadata = {
    title,
    channel,
    duration,
    thumbnailUrl,
    url,
  };

  return metadata;
};

/**
 * Converts InnerTube TranscriptEntry array to our TranscriptSegment format
 */
const convertInnerTubeToTranscriptSegments = (
  items: TranscriptEntry[],
): TranscriptSegment[] => {
  return items.map((item) => ({
    text: item.text.trim(),
    start: item.start * 1000, // Convert seconds to milliseconds for consistency
    duration: item.duration * 1000, // Convert seconds to milliseconds
  }));
};

/**
 * Extracts transcript using the proven InnerTube API
 */
const fetchTranscriptWithInnerTubeAPI = async (
  videoId: string,
): Promise<{
  success: boolean;
  transcript?: TranscriptSegment[];
  error?: string;
  language?: string;
}> => {
  try {
    const fetcher = new InnerTubeTranscriptFetcher();
    const transcriptEntries = await fetcher.getTranscript(videoId);

    if (!transcriptEntries || transcriptEntries.length === 0) {
      throw new Error("No transcript entries returned from InnerTube API");
    }

    // Convert to our format
    const segments = convertInnerTubeToTranscriptSegments(transcriptEntries);

    return {
      success: true,
      transcript: segments,
      language: "en", // InnerTube API doesn't provide language info directly
    };
  } catch (error) {
    let errorMessage = "Unknown error with InnerTube API";
    let errorType = "unknown";

    if (error instanceof Error) {
      errorMessage = error.message;

      // Map common InnerTube API errors to user-friendly messages
      if (errorMessage.includes("No captions available")) {
        errorMessage = "No transcript available for this video";
        errorType = "not-available";
      } else if (
        errorMessage.includes("Video is unavailable") ||
        errorMessage.includes("private")
      ) {
        errorMessage = "Video is unavailable or private";
        errorType = "video-unavailable";
      } else if (errorMessage.includes("Invalid video")) {
        errorMessage = "Invalid video ID or URL";
        errorType = "invalid-video";
      } else if (errorMessage.includes("API request failed")) {
        errorMessage = "YouTube API request failed - please try again later";
        errorType = "api-failed";
      } else if (errorMessage.includes("INNERTUBE_API_KEY not found")) {
        errorMessage = "Unable to access YouTube's internal API";
        errorType = "api-key-missing";
      }
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Extracts transcript using DOM scraping from YouTube's internal data
 * This works when running as a content script on YouTube's domain
 */
const fetchTranscriptWithDOMExtraction = async (
  videoId: string,
): Promise<{
  success: boolean;
  transcript?: TranscriptSegment[];
  error?: string;
  language?: string;
}> => {
  try {
    // Since we're a content script, we can access YouTube's internal data
    const ytInitialPlayerResponse = (
      window as Window & { ytInitialPlayerResponse?: unknown }
    ).ytInitialPlayerResponse;

    if (!ytInitialPlayerResponse) {
      throw new Error("ytInitialPlayerResponse not found on window object");
    }

    const captionTracks = (
      ytInitialPlayerResponse as {
        captions?: {
          playerCaptionsTracklistRenderer?: {
            captionTracks?: Array<{
              baseUrl?: string;
              languageCode?: string;
            }>;
          };
        };
      }
    )?.captions?.playerCaptionsTracklistRenderer?.captionTracks;

    if (!captionTracks || captionTracks.length === 0) {
      throw new Error("No caption tracks found in ytInitialPlayerResponse");
    }

    // Get the first available caption track
    const captionTrack = captionTracks[0];
    if (!captionTrack) {
      throw new Error("No caption track found in DOM data");
    }

    const transcriptUrl = captionTrack.baseUrl;

    if (!transcriptUrl) {
      throw new Error("No transcript URL found in DOM data");
    }

    // Fetch the transcript
    const response = await fetch(transcriptUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch transcript: ${response.status}`);
    }

    const responseText = await response.text();

    // Parse the response
    let segments: TranscriptSegment[] = [];

    if (responseText.trim().startsWith("<")) {
      segments = parseTranscriptXML(responseText);
    } else {
      segments = parseTranscriptJSON(responseText);
    }

    return {
      success: true,
      transcript: segments,
      language: captionTrack.languageCode || "en",
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error with DOM extraction";
    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Parses XML transcript response
 */
const parseTranscriptXML = (xml: string): TranscriptSegment[] => {
  const segments: TranscriptSegment[] = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");
  const textElements = doc.querySelectorAll("text");

  for (const element of textElements) {
    const text = element.textContent || "";
    const start =
      Number.parseFloat(element.getAttribute("start") || "0") * 1000;
    const duration =
      Number.parseFloat(element.getAttribute("dur") || "0") * 1000;

    if (text.trim()) {
      segments.push({
        text: text.trim(),
        start,
        duration,
      });
    }
  }

  return segments;
};

/**
 * Parses JSON transcript response
 */
const parseTranscriptJSON = (json: string): TranscriptSegment[] => {
  try {
    const data: unknown = JSON.parse(json);
    const segments: TranscriptSegment[] = [];

    const jsonData = data as {
      events?: Array<{
        tStartMs?: number;
        dDurationMs?: number;
        segs?: Array<{ utf8?: string }>;
      }>;
    };

    if (jsonData?.events && Array.isArray(jsonData.events)) {
      // YouTube's JSON3 format
      for (const event of jsonData.events) {
        if (event?.segs && Array.isArray(event.segs)) {
          const eventStart = event.tStartMs || 0;
          for (const seg of event.segs) {
            if (seg?.utf8) {
              segments.push({
                text: seg.utf8.trim(),
                start: eventStart,
                duration: event.dDurationMs || 0,
              });
            }
          }
        }
      }
    } else if (Array.isArray(data)) {
      // Alternative JSON format
      for (const item of data) {
        if (
          item &&
          typeof item === "object" &&
          "text" in item &&
          typeof item.text === "string"
        ) {
          const start =
            "start" in item && typeof item.start === "number" ? item.start : 0;
          const duration =
            "duration" in item && typeof item.duration === "number"
              ? item.duration
              : "dur" in item && typeof item.dur === "number"
                ? item.dur
                : 0;

          segments.push({
            text: item.text.trim(),
            start: start * 1000,
            duration: duration * 1000,
          });
        }
      }
    }

    return segments;
  } catch (error) {
    return [];
  }
};

/**
 * Fetches transcript for a single YouTube video using multiple methods
 * Tries methods in order until one succeeds
 */
export const fetchVideoTranscript = async (
  videoId: string,
): Promise<TranscriptFetchResult> => {
  const attempts: ExtractionAttempt[] = [];

  // Define extraction methods in order of preference
  // InnerTube API is the primary method now
  const methods = [
    {
      method: TranscriptMethod.INNERTUBE_API,
      func: fetchTranscriptWithInnerTubeAPI,
    },
    {
      method: TranscriptMethod.DOM_EXTRACTION,
      func: fetchTranscriptWithDOMExtraction,
    },
  ];

  for (const { method, func } of methods) {
    const startTime = Date.now();

    try {
      const result = await func(videoId);
      const executionTime = Date.now() - startTime;

      const attempt: ExtractionAttempt = {
        method,
        success: result.success,
        error: result.error,
        resultLength: result.transcript?.length,
        language: result.language,
        executionTime,
      };

      attempts.push(attempt);

      if (result.success && result.transcript) {
        // Convert segments to full transcript text
        let fullTranscript = result.transcript
          .map((segment) => segment.text)
          .join(" ");

        // Normalize whitespace and clean up the transcript
        fullTranscript = fullTranscript.replace(/\s+/g, " ").trim();

        // Truncate if necessary
        let wasTruncated = false;
        if (fullTranscript.length > CHARACTER_LIMIT) {
          fullTranscript = `${fullTranscript.substring(0, CHARACTER_LIMIT)}\n\n[Transcript truncated due to length limit]`;
          wasTruncated = true;
        }

        return {
          success: true,
          transcript: {
            videoId,
            title: "", // Will be filled in by caller
            channel: "", // Will be filled in by caller
            publishDate: "",
            description: "",
            url: `https://www.youtube.com/watch?v=${videoId}`,
            transcript: fullTranscript,
            segments: result.transcript,
            wasTruncated,
            language: result.language || "en",
            isAutoGenerated: true,
          },
        };
      }
    } catch (error) {
      const executionTime = Date.now() - startTime;
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      const attempt: ExtractionAttempt = {
        method,
        success: false,
        error: errorMessage,
        executionTime,
      };

      attempts.push(attempt);
    }
  }

  // All methods failed
  const allErrors = attempts.map((a) => `${a.method}: ${a.error}`).join("; ");

  return {
    success: false,
    error: `All extraction methods failed. Last error: ${attempts[attempts.length - 1]?.error || "Unknown error"}`,
  };
};

/**
 * Fetches transcripts for multiple videos in bulk
 */
export const fetchBulkTranscripts = async (
  videoElements: Array<{ videoId: string; title: string; channel: string }>,
  onProgress?: (completed: number, total: number) => void,
): Promise<BulkTranscriptResult> => {
  const successful: VideoTranscript[] = [];
  const failed: Array<{ videoId: string; error: string; title: string }> = [];

  let completed = 0;
  const total = videoElements.length;

  // Process videos in parallel with a concurrency limit to avoid overwhelming the API
  const CONCURRENT_LIMIT = 3;
  const batches: Array<
    Array<{ videoId: string; title: string; channel: string }>
  > = [];

  for (let i = 0; i < videoElements.length; i += CONCURRENT_LIMIT) {
    batches.push(videoElements.slice(i, i + CONCURRENT_LIMIT));
  }

  for (const [batchIndex, batch] of batches.entries()) {
    const promises = batch.map(async (video) => {
      const result = await fetchVideoTranscript(video.videoId);
      completed++;
      onProgress?.(completed, total);

      if (result.success && result.transcript) {
        // Fill in the metadata from the video element
        const transcriptWithMetadata: VideoTranscript = {
          ...result.transcript,
          title: video.title,
          channel: video.channel,
        };
        successful.push(transcriptWithMetadata);
      } else {
        failed.push({
          videoId: video.videoId,
          error: result.error || "Unknown error",
          title: video.title,
        });
      }
    });

    await Promise.all(promises);
  }

  return {
    successful,
    failed,
    totalRequested: total,
  };
};

/**
 * Formats transcripts for clipboard (using same XML format as markdown)
 */
export const formatTranscriptsForClipboard = (
  transcripts: readonly VideoTranscript[],
): string => {
  if (transcripts.length === 0) {
    return "No transcripts to copy.";
  }

  // Use the same XML formatting as the markdown function
  return formatTranscriptsForMarkdown(transcripts);
};

/**
 * Formats transcripts for markdown download with XML-style structure
 */
export const formatTranscriptsForMarkdown = (
  transcripts: readonly VideoTranscript[],
): string => {
  if (transcripts.length === 0) {
    return "# No Transcripts Available\n\nNo video transcripts were successfully extracted.";
  }

  const header = `# YouTube Watch Later Transcripts\n\nExtracted on: ${new Date().toLocaleDateString()}\nTotal videos: ${transcripts.length}\n\n`;

  const content = transcripts
    .map((transcript, index) => {
      const videoNumber = index + 1;
      const title = transcript.title || `Video ${videoNumber}`;
      const channel = transcript.channel || "Unknown Channel";
      const publishDate = transcript.publishDate || "Unknown Date";
      const transcriptText = transcript.transcript || "No transcript available";
      const truncationNotice = transcript.wasTruncated
        ? "\n\n*[This transcript was truncated due to length limits]*"
        : "";

      return `<Video ${videoNumber}>
<Title>
${title}
</Title>
<Creator>
${channel}
</Creator>
<Date>
${publishDate}
</Date>
<Transcript>
${transcriptText}${truncationNotice}
</Transcript>
</Video ${videoNumber}>`;
    })
    .join("\n\n-------------------\n\n");

  return header + content;
};

/**
 * Downloads content as a markdown file
 */
export const downloadAsMarkdown = (
  content: string,
  filename?: string,
): void => {
  const finalFilename = filename || `watchlater-transcripts-${new Date().toISOString().split("T")[0]}.md`;

  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = finalFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the URL object
  setTimeout(() => URL.revokeObjectURL(url), 100);
};

/**
 * Copies content to clipboard
 */
export const copyToClipboard = async (content: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(content);
      return true;
    }

    // Fallback for older browsers or non-secure contexts
    const textArea = document.createElement("textarea");
    textArea.value = content;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);

    return successful;
  } catch (error) {
    return false;
  }
};
