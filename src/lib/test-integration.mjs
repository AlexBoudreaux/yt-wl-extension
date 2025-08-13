/**
 * Simple integration test script to verify the InnerTube API integration works
 * Run with: node src/lib/test-integration.js
 */

// Polyfill fetch for Node.js environment
import { fetch } from "node-fetch";
globalThis.fetch = fetch;
globalThis.DOMParser = undefined; // Force regex parsing in Node.js

import { InnerTubeTranscriptFetcher } from "./innertube-transcript.ts";

async function testIntegration() {
  console.log("🧪 Testing InnerTube API Integration\n");

  const fetcher = new InnerTubeTranscriptFetcher();
  const testVideoId = "D6uFfrIBvR0"; // Known working video

  try {
    console.log(
      `📹 Testing video: https://www.youtube.com/watch?v=${testVideoId}`,
    );
    console.log("⏳ Extracting transcript...\n");

    const transcript = await fetcher.getTranscript(testVideoId);

    console.log("✅ SUCCESS! Transcript extracted successfully");
    console.log(`📊 Retrieved ${transcript.length} transcript entries`);
    console.log("📝 Sample entries:");

    // Show first 3 entries
    transcript.slice(0, 3).forEach((entry, index) => {
      console.log(
        `   ${index + 1}. [${entry.start}s] "${entry.text}" (${entry.duration}s)`,
      );
    });

    if (transcript.length > 3) {
      console.log(`   ... and ${transcript.length - 3} more entries`);
    }

    console.log("\n🎉 Integration test PASSED!");
    console.log("The InnerTube API is working correctly with the extension.");

    return true;
  } catch (error) {
    console.error("❌ FAILED! Integration test failed:");
    console.error(error.message);
    console.error("\nFull error:", error);
    return false;
  }
}

// Run the test
testIntegration()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error("💥 Test runner crashed:", error);
    process.exit(1);
  });
