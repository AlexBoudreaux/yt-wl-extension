# Watchlater Transcripts

A Chrome extension that transforms YouTube's Watch Later playlist into a powerful transcript extraction tool for research and note-taking.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Testing](#testing)
- [Building & Distribution](#building--distribution)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Technical Architecture](#technical-architecture)

## Features

- **Bulk Transcript Extraction**: Extract transcripts from multiple YouTube videos at once
- **Individual Video Selection**: Use Cmd+Click to select videos individually
- **Smart Selection Management**: Select all or clear selections with keyboard shortcuts
- **Markdown Output**: Export transcripts in clean, readable markdown format
- **Copy to Clipboard**: Instantly copy extracted transcripts for use in other tools
- **Download Support**: Save transcripts as .md files with automatic date naming
- **Native YouTube Integration**: Seamlessly integrated into YouTube's Watch Later page
- **Real-time Progress**: Visual progress indicators during extraction
- **Error Handling**: Robust error handling with retry capabilities
- **Accessibility**: Full keyboard navigation and screen reader support

## Installation

### For Users

1. Download the latest release from the [releases page](../../releases)
2. Extract the ZIP file
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable "Developer mode" in the top right
5. Click "Load unpacked" and select the extracted folder
6. The extension will appear in your extensions list

### For Developers

See [Development Setup](#development-setup) below.

## Usage

### Basic Usage

1. **Navigate to Watch Later**: Go to your [YouTube Watch Later playlist](https://www.youtube.com/playlist?list=WL)
2. **Select Videos**: Use Cmd+Click (or Ctrl+Click on Windows) to select individual videos
3. **Extract Transcripts**: Use the "Copy" or "Download" buttons in the header pill
4. **Use Your Transcripts**: Paste into AI tools, note-taking apps, or research documents

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + Click` | Toggle individual video selection |
| `Cmd/Ctrl + A` | Select all visible videos |
| `Cmd/Ctrl + C` | Copy selected transcripts to clipboard |
| `Cmd/Ctrl + S` | Download transcripts as .md file |
| `Escape` | Clear all selections |

### Selection Behavior

- **Individual Selection**: Cmd+Click toggles video selection on/off
- **Natural Text Selection**: Shift+Click works normally for selecting text
- **Batch Operations**: Select multiple videos, then extract all at once
- **Visual Feedback**: Selected videos are highlighted with YouTube's native styling

## Development Setup

### Prerequisites

- **Node.js** 20+ (LTS recommended)
- **Bun** package manager (install with `curl -fsSL https://bun.sh/install | bash`)
- **Chrome** browser for testing

### Initial Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd yt-wl-extension
   ```

2. **Install dependencies**:
   ```bash
   bun install
   ```

3. **Start development server**:
   ```bash
   bun dev
   ```

4. **Load extension in Chrome**:
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `build/chrome-mv3` folder

### Development Commands

```bash
# Development with hot reload
bun dev           # Chrome development server
bun dev:firefox   # Firefox development server

# Type checking (ALWAYS run before commits)
bun typecheck

# Linting and formatting (ALWAYS run before commits)
bun lint          # Check for issues
bun lint:fix      # Fix issues automatically

# Testing
bun test          # Run unit tests

# Building for production
bun build         # Build for Chrome and Firefox
bun build:chrome  # Chrome only
bun build:firefox # Firefox only
```

### Development Workflow

1. **Make Changes**: Edit files in the `src/` directory
2. **Hot Reload**: Changes automatically reload in development
3. **Type Check**: Run `bun typecheck` before committing
4. **Lint Code**: Run `bun lint` to ensure code quality
5. **Test Changes**: Verify functionality in the browser
6. **Commit**: Use conventional commit format

## Project Structure

```
yt-wl-extension/
├── src/
│   ├── app/
│   │   ├── background/        # Service worker
│   │   ├── content/           # Content scripts (main UI)
│   │   ├── popup/             # Extension popup
│   │   └── options/           # Settings page
│   ├── components/
│   │   ├── common/            # Shared components
│   │   └── ui/                # shadcn/ui components
│   ├── lib/
│   │   ├── youtube-transcript.ts  # Core transcript extraction
│   │   ├── video-selection.ts     # Video selection management
│   │   ├── innertube-transcript.ts # YouTube API integration
│   │   ├── logger.ts              # Logging utilities
│   │   └── use-toast.tsx          # Toast notifications
│   ├── assets/
│   │   └── styles/
│   └── types/
│       └── index.ts           # TypeScript definitions
├── public/
│   ├── _locales/en/           # Internationalization
│   └── icons/                 # Extension icons
├── build/                     # Generated build files
├── wxt.config.ts             # Extension configuration
├── package.json
├── tsconfig.json
└── README.md
```

### Key Files Explained

#### Core Functionality
- **`src/app/content/index.tsx`**: Main UI component, video selection, transcript extraction
- **`src/lib/youtube-transcript.ts`**: Transcript fetching, formatting, download logic
- **`src/lib/video-selection.ts`**: Video selection state management
- **`src/lib/innertube-transcript.ts`**: YouTube InnerTube API integration

#### Configuration
- **`wxt.config.ts`**: Extension manifest, permissions, build configuration
- **`public/_locales/en/messages.json`**: Text content and internationalization

#### Types
- **`src/types/index.ts`**: TypeScript interfaces and types

## How It Works

### Technical Overview

The extension uses three main approaches to extract transcripts:

1. **InnerTube API (Primary)**: Direct integration with YouTube's internal API
2. **DOM Extraction (Fallback)**: Parsing YouTube's page data
3. **Error Handling**: Comprehensive retry logic and user feedback

### InnerTube API Integration

The core transcript extraction uses YouTube's internal InnerTube API:

```typescript
// Simplified version of the extraction process
const fetcher = new InnerTubeTranscriptFetcher();
const transcriptEntries = await fetcher.getTranscript(videoId);
```

### Video Selection System

The extension implements a sophisticated video selection system:

- **VideoSelectionManager**: Manages selection state
- **Event Listeners**: Handle keyboard and mouse interactions
- **Visual Styling**: Provides immediate feedback
- **Persistence**: Maintains selections across DOM updates

### Data Flow

1. **Page Detection**: Monitor for YouTube Watch Later page
2. **Video Scanning**: Extract video elements from DOM
3. **Selection Management**: Handle user interactions
4. **Transcript Extraction**: Fetch transcripts using InnerTube API
5. **Output Formatting**: Convert to markdown format
6. **User Actions**: Copy to clipboard or download as file

## Testing

### Running Tests

```bash
# Run all tests
bun test

# Run tests with coverage
bun test --coverage

# Run specific test file
bun test src/lib/tests/youtube-transcript.test.ts
```

### Test Structure

- **Unit Tests**: Test individual functions and utilities
- **Integration Tests**: Test component interactions
- **Manual Testing**: Browser testing procedures

### Manual Testing Checklist

1. **Extension Loading**: Loads without errors in Chrome
2. **Page Detection**: Activates only on Watch Later playlist
3. **Video Selection**: Individual and bulk selection works
4. **Transcript Extraction**: Successfully extracts transcripts
5. **Output Formats**: Markdown formatting is correct
6. **Error Handling**: Graceful failure and retry functionality
7. **UI Responsiveness**: Smooth interactions and feedback

## Building & Distribution

### Development Build

```bash
bun dev              # Hot reload development build
```

### Production Build

```bash
bun build            # Build for both Chrome and Firefox
bun build:chrome     # Chrome-only build
bun build:firefox    # Firefox-only build
```

### Build Output

- **Chrome**: `build/chrome-mv3/`
- **Firefox**: `build/firefox-mv2/`
- **ZIP files**: Automatically created for distribution

### Distribution Checklist

1. **Version Bump**: Update version in `package.json`
2. **Changelog**: Update with new features/fixes
3. **Build**: Run `bun build` for production
4. **Test**: Manual testing in fresh browser profile
5. **Package**: ZIP files are created automatically
6. **Upload**: Submit to Chrome Web Store / Firefox Add-ons

## Troubleshooting

### Common Issues

#### Extension Not Loading
- **Solution**: Check for TypeScript errors with `bun typecheck`
- **Check**: Ensure all dependencies are installed with `bun install`

#### No Videos Detected
- **Solution**: Refresh the Watch Later page
- **Check**: Ensure you're on the correct URL: `/playlist?list=WL`

#### Transcript Extraction Fails
- **Causes**: Video is private, transcript disabled, or network issues
- **Solution**: Try again or check video availability

#### Hot Reload Not Working
- **Solution**: Restart development server with `bun dev`
- **Check**: Browser console for WebSocket connection errors

### Debug Information

The extension provides comprehensive logging:

```bash
# Enable debug logs in browser console
localStorage.setItem('yt-wl-debug', 'true')
```

### Performance Issues

- **Large Playlists**: Extension handles 100+ videos efficiently
- **Memory Usage**: Optimized for minimal memory footprint  
- **API Rate Limiting**: Built-in concurrency limits prevent API errors

## Contributing

### Code Style

- **TypeScript**: Strict mode enabled
- **Formatting**: Automated with Biome
- **Linting**: Enforced code quality standards
- **Conventions**: Follow existing patterns

### Contribution Guidelines

1. **Fork Repository**: Create your own fork
2. **Create Branch**: Use descriptive branch names
3. **Make Changes**: Follow code style guidelines
4. **Test Changes**: Run tests and manual verification
5. **Submit PR**: Include detailed description

### Commit Format

Use conventional commit format:

```bash
feat: add markdown export functionality
fix: resolve video selection edge case  
docs: update installation instructions
```

## Technical Architecture

### Framework and Tools

- **WXT**: Modern extension framework with hot reload
- **React 19**: UI components with functional patterns
- **TypeScript**: Full type safety with strict mode
- **Tailwind CSS 4**: Utility-first styling with shadcn/ui
- **Biome**: Fast linting and formatting
- **Bun**: Package manager and test runner

### Chrome Extension Architecture

- **Manifest V3**: Modern extension format
- **Service Worker**: Background processing
- **Content Scripts**: YouTube page integration
- **Shadow DOM**: Isolated UI components

### State Management

- **React Context**: Global UI state
- **Custom Managers**: Video selection state
- **Local Storage**: User preferences (future)

### API Integration

The extension integrates with YouTube's internal InnerTube API for reliable transcript access:

```typescript
class InnerTubeTranscriptFetcher {
  async getTranscript(videoId: string): Promise<TranscriptEntry[]> {
    // Direct API integration - see implementation
  }
}
```

### Security Considerations

- **Content Security Policy**: Strict CSP compliance
- **Input Sanitization**: All user inputs are sanitized
- **Minimal Permissions**: Only required YouTube access
- **No External Servers**: Fully client-side operation

---

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

For issues and questions:
- **GitHub Issues**: [Create an issue](../../issues)
- **Documentation**: This README file
- **Code Examples**: Check the `src/` directory
