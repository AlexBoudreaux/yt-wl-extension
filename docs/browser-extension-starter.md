├── .cursor
    └── rules
    │   └── general.mdc
├── .env.example
├── .github
    ├── ISSUE_TEMPLATE
    │   ├── bug_report.yml
    │   ├── config.yml
    │   └── feature_request.yml
    └── workflows
    │   ├── publish.yml
    │   ├── setup
    │       └── action.yml
    │   └── tests.yml
├── .gitignore
├── .husky
    └── commit-msg
├── .vscode
    ├── extensions.json
    └── settings.json
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── biome.json
├── bun.lockb
├── commitlint.config.ts
├── components.json
├── env.config.ts
├── package.json
├── postcss.config.cjs
├── public
    ├── _locales
    │   └── en
    │   │   └── messages.json
    └── fonts
    │   ├── Geist-Bold.woff2
    │   ├── Geist-Regular.woff2
    │   ├── GeistMono-Bold.woff2
    │   └── GeistMono-Regular.woff2
├── src
    ├── app
    │   ├── background
    │   │   └── index.ts
    │   ├── content
    │   │   └── index.tsx
    │   ├── devtools
    │   │   ├── index.html
    │   │   └── main.tsx
    │   ├── newtab
    │   │   ├── index.html
    │   │   └── main.tsx
    │   ├── options
    │   │   ├── index.html
    │   │   └── main.tsx
    │   ├── popup
    │   │   ├── index.html
    │   │   └── main.tsx
    │   ├── sidepanel
    │   │   ├── index.html
    │   │   └── main.tsx
    │   └── tabs
    │   │   ├── ai.tsx
    │   │   ├── index.html
    │   │   ├── login.tsx
    │   │   ├── main.tsx
    │   │   └── register.tsx
    ├── assets
    │   ├── icon.png
    │   ├── logo.svg
    │   └── styles
    │   │   ├── animations.css
    │   │   └── globals.css
    ├── components
    │   ├── auth
    │   │   ├── index.tsx
    │   │   ├── login.tsx
    │   │   ├── register.tsx
    │   │   └── user.tsx
    │   ├── common
    │   │   ├── error-boundary.tsx
    │   │   ├── main.tsx
    │   │   ├── suspense.tsx
    │   │   └── theme.tsx
    │   ├── layout
    │   │   ├── footer.tsx
    │   │   ├── header.tsx
    │   │   └── layout.tsx
    │   └── ui
    │   │   ├── avatar.tsx
    │   │   ├── button.tsx
    │   │   ├── card.tsx
    │   │   ├── dropdown-menu.tsx
    │   │   ├── form.tsx
    │   │   ├── input.tsx
    │   │   ├── label.tsx
    │   │   ├── scroll-area.tsx
    │   │   ├── separator.tsx
    │   │   ├── sonner.tsx
    │   │   └── textarea.tsx
    ├── lib
    │   ├── analytics.ts
    │   ├── messaging.ts
    │   ├── storage.ts
    │   ├── supabase.ts
    │   ├── tests
    │   │   └── utils.test.ts
    │   └── utils.ts
    ├── types
    │   └── index.ts
    └── typings
    │   ├── custom.d.ts
    │   └── reset.d.ts
├── tsconfig.json
└── wxt.config.ts


/.cursor/rules/general.mdc:
--------------------------------------------------------------------------------
  1 | ---
  2 | description: 
  3 | globs: 
  4 | alwaysApply: true
  5 | ---
  6 | You are an expert in TypeScript, Chrome Extensions API V3, React, WXT framework, and modern web development.
  7 | 
  8 | ## Project Architecture
  9 | 
 10 | ### WXT Framework
 11 | - Use WXT as the primary build tool and framework for Chrome extension development
 12 | - Follow WXT conventions for entrypoints: `src/app/` contains all extension pages/scripts
 13 | - Leverage WXT's auto-imports and built-in TypeScript support
 14 | - Use WXT modules: `@wxt-dev/module-react` for React integration, `@wxt-dev/auto-icons` for icon generation
 15 | 
 16 | ### Extension Structure
 17 | - **Background Scripts**: Keep minimal, event-driven service workers in `src/app/background/`
 18 | - **Content Scripts**: Place in `src/app/content/` - use sparingly, implement proper cleanup
 19 | - **Popup**: Main UI in `src/app/popup/` - keep lightweight and responsive
 20 | - **Options**: Settings page in `src/app/options/`
 21 | - **Side Panel**: Modern UI extension in `src/app/sidepanel/`
 22 | - **New Tab**: Custom new tab page in `src/app/newtab/`
 23 | - **DevTools**: Development tools in `src/app/devtools/`
 24 | 
 25 | ## Code Style and Standards
 26 | 
 27 | ### TypeScript Configuration
 28 | - Use strict TypeScript with `noUncheckedIndexedAccess: true`
 29 | - Prefer interfaces over types for object shapes
 30 | - Use Chrome Extension type definitions (`@types/chrome`)
 31 | - Define strict types for message passing between extension components
 32 | - Follow the existing tsconfig settings (ES2022, DOM, JSX preserve)
 33 | 
 34 | ### Formatting (Biome)
 35 | - Use Biome for formatting and linting (configured in `biome.json`)
 36 | - 2-space indentation, 80 character line width
 37 | - Double quotes for strings
 38 | - Auto-organize imports
 39 | - Remove unused imports automatically
 40 | 
 41 | ### Naming Conventions
 42 | - Use kebab-case for directories (`content-scripts/`, `ui-components/`)
 43 | - Use PascalCase for React components and interfaces
 44 | - Use camelCase for functions, variables, and object properties
 45 | - Use descriptive names with auxiliary verbs (`isLoading`, `hasPermission`, `canAccess`)
 46 | - Favor named exports over default exports
 47 | 
 48 | ## React and UI Development
 49 | 
 50 | ### React Patterns
 51 | - Functional components with hooks exclusively
 52 | - Use React Hook Form with Zod for form validation
 53 | - Implement React Router DOM for multi-page navigation
 54 | - Use React Query (@tanstack/react-query) for data fetching and state management
 55 | 
 56 | ### Component Structure
 57 | - Place reusable components in `src/components/`
 58 | - Organize by feature: `auth/`, `common/`, `layout/`, `ui/`
 59 | - Use shadcn/ui patterns with Radix UI primitives
 60 | - Implement proper TypeScript props interfaces
 61 | 
 62 | ### Styling
 63 | - Use Tailwind CSS v4 with @tailwindcss/vite
 64 | - Keep styles scoped to avoid conflicts with target pages
 65 | - Use CSS variables for theming (next-themes integration)
 66 | - Implement responsive design for popup windows (minimum 320px width)
 67 | - Use Lucide React for consistent iconography
 68 | 
 69 | ## Chrome Extension Best Practices
 70 | 
 71 | ### Manifest V3
 72 | - Follow Manifest V3 guidelines strictly
 73 | - Use service workers instead of background pages
 74 | - Implement proper permission handling and security practices
 75 | - Use `chrome.storage` for persistent data
 76 | - Leverage `chrome.sidePanel` for extended UI
 77 | 
 78 | ### Security and Permissions
 79 | - Request minimal permissions in manifest
 80 | - Use `host_permissions` judiciously
 81 | - Implement Content Security Policy compliance
 82 | - Sanitize user inputs and external content
 83 | - Use secure communication between extension components
 84 | 
 85 | ### Message Passing
 86 | - Use `@webext-core/messaging` for type-safe communication
 87 | - Define message schemas with Zod validation
 88 | - Implement proper error handling for async operations
 89 | - Use structured message passing between background/content/popup
 90 | 
 91 | ### Performance Optimization
 92 | - Lazy load components and heavy dependencies
 93 | - Use React.memo for expensive components
 94 | - Implement efficient state management patterns
 95 | - Optimize bundle size with tree shaking
 96 | - Use service worker caching strategies
 97 | 
 98 | ## Development Workflow
 99 | 
100 | ### Build and Development
101 | - Use `bun dev` for Chrome development, `bun dev:firefox` for Firefox
102 | - Run `bun build` for production builds (both Chrome and Firefox)
103 | - Use `bun lint` for code quality checks
104 | - Run `bun typecheck` for TypeScript validation
105 | 
106 | ### Testing and Quality
107 | - Use Vitest for unit testing (configured but implement tests)
108 | - Test extension functionality across different browser contexts
109 | - Validate manifest permissions and CSP compliance
110 | - Use browser dev tools for debugging extension components
111 | 
112 | ### Git and Commits
113 | - Follow Conventional Commits (commitlint configured)
114 | - Use Husky for pre-commit hooks
115 | - Keep commits atomic and well-described
116 | - Use proper branch naming conventions
117 | 
118 | ## Integration and External Services
119 | 
120 | ### Data Layer
121 | - Use Supabase for backend services and authentication
122 | - Implement proper error boundaries and fallbacks
123 | - Use OpenPanel for analytics (privacy-conscious)
124 | - Leverage Chrome AI API when available
125 | 
126 | ### State Management
127 | - Use React Query for server state
128 | - Use React Context for global UI state
129 | - Implement proper loading and error states
130 | - Use optimistic updates where appropriate
131 | 
132 | ### Utilities and Helpers
133 | - Place shared utilities in `src/lib/`
134 | - Use `envin` for environment variable management
135 | - Implement proper TypeScript utility types
136 | - Use `clsx` and `tailwind-merge` for className composition
137 | 
138 | ## Error Handling and Debugging
139 | 
140 | ### Error Boundaries
141 | - Implement React error boundaries for UI components
142 | - Use proper try-catch blocks in async operations
143 | - Log errors appropriately without exposing sensitive data
144 | - Provide user-friendly error messages
145 | 
146 | ### Development Tools
147 | - Use Chrome DevTools for extension debugging
148 | - Implement proper console logging strategies
149 | - Use source maps for production debugging
150 | - Test across different Chrome versions and contexts
151 | 
152 | ## Key Principles
153 | 
154 | 1. **Security First**: Always prioritize security in extension development
155 | 2. **Performance**: Keep bundles small and runtime efficient
156 | 3. **User Experience**: Design for quick interactions and clear feedback
157 | 4. **Compatibility**: Test across Chrome and Firefox (multi-browser support)
158 | 5. **Maintainability**: Write clean, documented, and testable code
159 | 6. **Modern Standards**: Use latest web standards and best practices
160 | 
161 | Follow Chrome Extension documentation, WXT framework docs, and React best practices for comprehensive development guidance.


--------------------------------------------------------------------------------
/.env.example:
--------------------------------------------------------------------------------
1 | # Supabase
2 | VITE_SUPABASE_URL=""
3 | VITE_SUPABASE_ANON_KEY=""
4 | 
5 | # OpenPanel Analytics
6 | VITE_OPEN_PANEL_KEY=""


--------------------------------------------------------------------------------
/.github/ISSUE_TEMPLATE/bug_report.yml:
--------------------------------------------------------------------------------
 1 | name: "Bug report"
 2 | description: Report an issue
 3 | title: "[Bug]: "
 4 | labels: ["bug"]
 5 | body:
 6 |   - type: markdown
 7 |     attributes:
 8 |       value: |
 9 |         ### Thanks for taking the time to create a bug report. Please search open/closed issues before submitting, as the issue may have already been reported/addressed.
10 | 
11 |   - type: markdown
12 |     attributes:
13 |       value: |
14 |         #### If you aren't sure this is a bug or not, please open a discussion instead:
15 |         - [Discussions](https://github.com/turbostarter/main/discussions/new?category=general)
16 | 
17 |   - type: textarea
18 |     id: bug-description
19 |     attributes:
20 |       label: Describe the bug
21 |       description: A clear and concise description of what the bug is. If you intend to submit a PR for this issue, tell us how in the description. Thanks!
22 |       placeholder: Bug description
23 |     validations:
24 |       required: true
25 | 
26 |   - type: textarea
27 |     id: reproduction
28 |     attributes:
29 |       label: How to reproduce
30 |       description: A step-by-step description of how to reproduce the bug.
31 |       placeholder: |
32 |         1. Go to '...'
33 |         2. Click on '....'
34 |         3. See error
35 |     validations:
36 |       required: true
37 | 
38 |   - type: textarea
39 |     id: logs
40 |     attributes:
41 |       label: Logs
42 |       description: "Please include browser console and server logs around the time this bug occurred. Optional if provided reproduction. Please try not to insert an image but copy paste the log text."
43 |       render: bash
44 | 
45 |   - type: textarea
46 |     id: system-info
47 |     attributes:
48 |       label: System Info
49 |       description: Information about browsers, system or binaries that's relevant.
50 |       render: bash
51 |       placeholder: System, Binaries, Browsers
52 |     validations:
53 |       required: true
54 | 


--------------------------------------------------------------------------------
/.github/ISSUE_TEMPLATE/config.yml:
--------------------------------------------------------------------------------
1 | contact_links:
2 |   - name: Get Help
3 |     url: https://github.com/turbostarter/main/discussions/new?category=general
4 |     about: If you can't get something to work the way you expect, open a question in our discussion forums.
5 | 


--------------------------------------------------------------------------------
/.github/ISSUE_TEMPLATE/feature_request.yml:
--------------------------------------------------------------------------------
 1 | name: "Feature request"
 2 | description: Suggest an idea for this project
 3 | title: "[Feature]: "
 4 | labels: ["request"]
 5 | body:
 6 |   - type: markdown
 7 |     attributes:
 8 |       value: |
 9 |         ### Thanks for taking the time to create a feature request! Please search open/closed issues before submitting, as the issue may have already been reported/addressed.
10 | 
11 |   - type: markdown
12 |     attributes:
13 |       value: |
14 |         #### If you aren't sure this is a bug or not, please open a discussion instead:
15 |         - [Discussions](https://github.com/turbostarter/main/discussions/new?category=general)
16 | 
17 |   - type: textarea
18 |     id: feature-description
19 |     attributes:
20 |       label: Feature description
21 |       description: Tell us about your feature request
22 |       placeholder: "I think this feature would be great because..."
23 |       value: "Describe your feature request..."
24 |     validations:
25 |       required: true
26 | 
27 |   - type: textarea
28 |     id: context
29 |     attributes:
30 |       label: Additional Context
31 |       description: Add any other context about the feature here.
32 |       placeholder: ex. screenshots, Stack Overflow links, forum links, etc.
33 |       value: "Additional details here..."
34 |     validations:
35 |       required: false
36 | 


--------------------------------------------------------------------------------
/.github/workflows/publish.yml:
--------------------------------------------------------------------------------
 1 | name: CI / Publish
 2 | 
 3 | on:
 4 |   workflow_dispatch:
 5 | 
 6 | env:
 7 |   NODE_VERSION: 20.x
 8 | 
 9 | jobs:
10 |   tests:
11 |     name: 🧪 Tests
12 |     uses: ./.github/workflows/tests.yml
13 | 
14 |   publish:
15 |     name: 🚀 Publish
16 |     runs-on: ubuntu-latest
17 |     environment: Production
18 |     needs: [tests]
19 | 
20 |     steps:
21 |       - name: ✅ Checkout code
22 |         uses: actions/checkout@v4
23 | 
24 |       - name: 🔨 Setup
25 |         uses: ./.github/workflows/setup
26 |         with:
27 |           node-version: ${{ env.NODE_VERSION }}
28 | 
29 |       - name: 📦 Build
30 |         run: bun run build
31 | 
32 |       - name: 🗃️ Archive Chrome artifact
33 |         uses: actions/upload-artifact@v4
34 |         with:
35 |           name: chrome-${{ github.sha }}
36 |           path: build/*-chrome.zip
37 | 
38 |       - name: 🗃️ Archive Firefox artifact
39 |         uses: actions/upload-artifact@v4
40 |         with:
41 |           name: firefox-${{ github.sha }}
42 |           path: build/*-firefox.zip
43 | 
44 |       - name: 💨 Publish!
45 |         run: |
46 |           bun wxt submit \
47 |             --chrome-zip build/*-chrome.zip \
48 |             --firefox-zip build/*-firefox.zip --firefox-sources-zip build/*-sources.zip
49 |         env:
50 |           CHROME_EXTENSION_ID: ${{ secrets.CHROME_EXTENSION_ID }}
51 |           CHROME_CLIENT_ID: ${{ secrets.CHROME_CLIENT_ID }}
52 |           CHROME_CLIENT_SECRET: ${{ secrets.CHROME_CLIENT_SECRET }}
53 |           CHROME_REFRESH_TOKEN: ${{ secrets.CHROME_REFRESH_TOKEN }}
54 |           FIREFOX_EXTENSION_ID: ${{ secrets.FIREFOX_EXTENSION_ID }}
55 |           FIREFOX_JWT_ISSUER: ${{ secrets.FIREFOX_JWT_ISSUER }}
56 |           FIREFOX_JWT_SECRET: ${{ secrets.FIREFOX_JWT_SECRET }}
57 | 


--------------------------------------------------------------------------------
/.github/workflows/setup/action.yml:
--------------------------------------------------------------------------------
 1 | name: "CI / Setup"
 2 | description: "Common setup steps for Github Actions"
 3 | 
 4 | inputs:
 5 |   node-version:
 6 |     description: "Node.js version"
 7 |     required: true
 8 |     default: "20.x"
 9 |   install-packages:
10 |     description: "Install packages"
11 |     required: false
12 |     default: "true"
13 | 
14 | runs:
15 |   using: "composite"
16 |   steps:
17 |     - name: ✅ Checkout code
18 |       uses: actions/checkout@v4
19 | 
20 |     - name: 🎬 Setup bun
21 |       uses: oven-sh/setup-bun@v2
22 | 
23 |     - name: 🔨 Setup Node.js ${{ inputs.node-version }}
24 |       uses: actions/setup-node@v4
25 |       with:
26 |         node-version: ${{ inputs.node-version }}
27 | 
28 |     - name: 🔌 Install
29 |       if: ${{ inputs.install-packages == 'true' }}
30 |       shell: bash
31 |       run: bun install
32 | 


--------------------------------------------------------------------------------
/.github/workflows/tests.yml:
--------------------------------------------------------------------------------
 1 | name: CI / Tests
 2 | 
 3 | on:
 4 |   pull_request:
 5 |     branches: ["*"]
 6 |   push:
 7 |     branches: ["main"]
 8 |   merge_group:
 9 |   workflow_dispatch:
10 |   workflow_call:
11 | 
12 | concurrency:
13 |   group: ${{ github.workflow }}-${{ github.ref }}
14 |   cancel-in-progress: true
15 | 
16 | env:
17 |   FORCE_COLOR: 3
18 |   NODE_VERSION: 20.x
19 | 
20 | jobs:
21 |   test:
22 |     name: 🧪 Test
23 |     runs-on: ubuntu-latest
24 |     steps:
25 |       - name: ✅ Checkout code
26 |         uses: actions/checkout@v4
27 | 
28 |       - name: 🔨 Setup
29 |         uses: ./.github/workflows/setup
30 |         with:
31 |           node-version: ${{ env.NODE_VERSION }}
32 | 
33 |       - name: 🛻 Lint
34 |         run: bun lint
35 | 
36 |       - name: 💡 Typecheck
37 |         run: bun typecheck
38 | 
39 |       - name: 🧪 Unit tests
40 |         run: bun test
41 | 


--------------------------------------------------------------------------------
/.gitignore:
--------------------------------------------------------------------------------
 1 | # See https://help.github.com/articles/ignoring-files/ for more about ignoring files.
 2 | 
 3 | # dependencies
 4 | node_modules
 5 | .pnp
 6 | .pnp.js
 7 | 
 8 | # extension
 9 | build/
10 | stats.html
11 | stats-*.json
12 | .wxt
13 | web-ext.config.ts
14 | 
15 | # misc
16 | .DS_Store
17 | *.pem
18 | 
19 | # debug
20 | npm-debug.log*
21 | yarn-debug.log*
22 | yarn-error.log*
23 | .pnpm-debug.log*
24 | 
25 | # env
26 | .env
27 | .env*.local
28 | 
29 | 


--------------------------------------------------------------------------------
/.husky/commit-msg:
--------------------------------------------------------------------------------
1 | pnpm commitlint --edit $1
2 | 


--------------------------------------------------------------------------------
/.vscode/extensions.json:
--------------------------------------------------------------------------------
1 | {
2 |   "recommendations": [
3 |     "yoavbls.pretty-ts-errors",
4 |     "bradlc.vscode-tailwindcss",
5 |     "biomejs.biome"
6 |   ]
7 | }
8 | 


--------------------------------------------------------------------------------
/.vscode/settings.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "css.customData": [".vscode/tailwind.json"],
 3 |   "editor.defaultFormatter": "biomejs.biome",
 4 |   "editor.formatOnSave": true,
 5 |   "tailwindCSS.experimental.classRegex": [
 6 |     ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
 7 |     ["cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
 8 |   ],
 9 |   "editor.codeActionsOnSave": {
10 |     "quickfix.biome": "explicit",
11 |     "source.organizeImports.biome": "explicit"
12 |   },
13 |   "files.associations": {
14 |     "*.css": "tailwindcss"
15 |   }
16 | }
17 | 


--------------------------------------------------------------------------------
/CONTRIBUTING.md:
--------------------------------------------------------------------------------
  1 | # Contribution Guidelines
  2 | 
  3 | Extro is an open source project, and contributions of any kind are welcome and appreciated. Open issues, bugs, and enhancements are all listed on the [issues](https://github.com/turbostarter/extro/issues) tab and labeled accordingly. Feel free to open bug tickets and make feature requests. Easy bugs and features will be tagged with the `good first issue` label.
  4 | 
  5 | ## Issues
  6 | 
  7 | If you encounter a bug, please file a [bug report](https://github.com/turbostarter/extro/issues/new?assignees=&labels=bug&projects=&template=bug_report.yml&title=%5BBug%5D%3A+). If you have a feature to request, please open a [feature request](https://github.com/turbostarter/extro/issues/new?assignees=&labels=request&projects=&template=feature_request.yml&title=%5BFeature%5D%3A+). If you would like to work on an issue or feature, there is no need to request permission.
  8 | 
  9 | ## Pull Requests
 10 | 
 11 | In order to create a pull request for Extro, follow the GitHub instructions for [creating a pull request from a fork](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request-from-a-fork). Please link your pull request to an existing issue.
 12 | 
 13 | ## File Structure
 14 | 
 15 | Description of the project files and directories.
 16 | 
 17 | ```bash
 18 | ├── .cursor                       # Cursor rules
 19 | ├── .github/                      # Github related files (workflows, templates)
 20 | ├── .husky/                       # Husky config
 21 | ├── .vscode/                      # VSCode settings (extensions, settings)
 22 | ├── public/                       # Public assets (fonts, locales, etc.)
 23 | ├── src/                          # Source code for the extension
 24 | │    ├── app/                     # Entry files for each part of the extension (background, popup, options, etc.)
 25 | │    ├── assets/                  # Static assets (fonts, images, svgs, etc.)
 26 | │    ├── components/              # Shared components
 27 | │    ├── lib/                     # Utility functions and third-party libraries
 28 | │    ├── types/                   # TypeScript types
 29 | │    └── typings/                 # Custom type definitions
 30 | ├── .env.example                  # Examples of env variables
 31 | ├── .gitignore                    # Files ignored by git
 32 | ├── biome.json                    # Biome configuration
 33 | ├── bun.lockb                     # Bun lockfile
 34 | ├── commitlint.config.ts          # Config for CommitLint - to enforce commit consistency
 35 | ├── components.json               # shadcn/ui configuration
 36 | ├── env.config.ts                 # Environment variables configuration
 37 | ├── package.json                  # Dependencies and additional informations about the project
 38 | ├── tailwind.config.ts            # Tailwind configuration
 39 | ├── tsconfig.json                 # TypeScript config
 40 | ├── wxt.config.ts                 # WXT configuration
 41 | ```
 42 | 
 43 | ### `/app`
 44 | 
 45 | Extro ships with the following extension pages preconfigured:
 46 | 
 47 | - `background` - [background service worker](https://wxt.dev/guide/essentials/entrypoints.html#background)
 48 | - `content` - [content scripts](https://wxt.dev/guide/essentials/content-scripts.html) that run in the context of web pages
 49 | - `devtools` - [devtools](https://wxt.dev/guide/essentials/entrypoints.html#devtools) page with custom panels
 50 | - `newtab` - [new tab](https://wxt.dev/guide/essentials/entrypoints.html#newtab) page
 51 | - `options` - [options](https://wxt.dev/guide/essentials/entrypoints.html#options) page
 52 | - `popup` - [popup](https://wxt.dev/guide/essentials/entrypoints.html#popup) window
 53 | - `sidepanel` - [side panel](https://wxt.dev/guide/essentials/entrypoints.html#side-panel)
 54 | - `tabs` - [unlisted](https://wxt.dev/guide/essentials/entrypoints.html#unlisted-pages) pages (custom pages delivered with the extension)
 55 | 
 56 | ## Styleguide
 57 | 
 58 | Coding conventions are enforced by [Biome](biome.json).
 59 | 
 60 | - Semicolons
 61 | - Double quotes
 62 | - `const` preferred over `let`
 63 | - [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
 64 | - Two space indentation
 65 | - React: functional style with Hooks (no classes)
 66 | - Trailing commas in arrays and objects
 67 | - [Non-default exports](https://humanwhocodes.com/blog/2019/01/stop-using-default-exports-javascript-module/) are preferred for components
 68 | - Module imports are ordered and separated: **built-in** -> **external** -> **internal** -> **css/assets/other**
 69 | - TypeScript: strict mode, with no implicitly any
 70 | 
 71 | ## Example component structure
 72 | 
 73 | ```bash
 74 | ├── component/
 75 | │   ├── component.tsx
 76 | ```
 77 | 
 78 | ```tsx
 79 | import { memo } from "react";
 80 | 
 81 | interface ComponentProps = {
 82 |   readonly title: string;
 83 | };
 84 | 
 85 | export const Component = memo<ComponentProps>(({ title }) => {
 86 |   return <h1>{title}</h1>;
 87 | });
 88 | 
 89 | Component.displayName = "Component";
 90 | ```
 91 | 
 92 | 
 93 | ## Tech stack
 94 | 
 95 | | Tech                                           | Description                                                                   |
 96 | | ---------------------------------------------- | ----------------------------------------------------------------------------- |
 97 | | [TypeScript](https://www.typescriptlang.org/)  | Static type-checking programming language                                     |
 98 | | [React](https://reactjs.org/)                  | Library for building user interfaces                                          |
 99 | | [WXT](https://wxt.dev/)                        | Next-gen Web Extension Framework                                              |
100 | | [Supabase](https://supabase.com/)              | Open source Firebase alternative                                              |
101 | | [shadcn/ui](https://ui.shadcn.com/)            | Extendable component library                                                  |
102 | | [Tailwind](https://tailwindcss.com/)           | Utility-first CSS framework                                                   |
103 | | [OpenPanel](https://openpanel.dev/)            | Open source analytics                                                         |
104 | | [React Hook Form](https://react-hook-form.com) | Forms with easy-to-use validation                                             |
105 | | [Vite](https://vitejs.dev/)                    | Next generation frontend tool                                                 |
106 | | [Bun](https://bun.sh/)                         | Package manager and build tool                                                |
107 | | [Husky](https://github.com/typicode/husky)     | Git hooks                                                                     |
108 | | [Biome](https://biomejs.dev/)                  | Linting and formatting                                                        |
109 | 


--------------------------------------------------------------------------------
/LICENSE:
--------------------------------------------------------------------------------
 1 | MIT License
 2 | 
 3 | Copyright (c) 2024 Bartosz Zagrodzki
 4 | 
 5 | Permission is hereby granted, free of charge, to any person obtaining a copy
 6 | of this software and associated documentation files (the "Software"), to deal
 7 | in the Software without restriction, including without limitation the rights
 8 | to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 9 | copies of the Software, and to permit persons to whom the Software is
10 | furnished to do so, subject to the following conditions:
11 | 
12 | The above copyright notice and this permission notice shall be included in all
13 | copies or substantial portions of the Software.
14 | 
15 | THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
16 | IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
17 | FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
18 | AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
19 | LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
20 | OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
21 | SOFTWARE.


--------------------------------------------------------------------------------
/README.md:
--------------------------------------------------------------------------------
  1 | <div align="center">
  2 |  
  3 |  <br />
  4 |   <br />
  5 | 
  6 | <picture>
  7 |     <source media="(prefers-color-scheme: dark)" width="700" srcset="https://github.com/user-attachments/assets/09cf4bfb-36a5-4eda-a892-4ba737d6a531" />
  8 |     <source media="(prefers-color-scheme: light)" width="700" srcset="https://github.com/user-attachments/assets/7ccbabbf-5ddd-4cf0-9e44-cfbc5ba72e06" />
  9 |     <img alt="Logo" width="700" src="https://github.com/user-attachments/assets/09cf4bfb-36a5-4eda-a892-4ba737d6a531" />
 10 | </picture>
 11 | 
 12 | <br />
 13 | <br />
 14 | <br />
 15 | 
 16 | ![](https://img.shields.io/badge/Bun-000000?style=flat-square&logo=bun&logoColor=white)
 17 | ![](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
 18 | ![](https://img.shields.io/badge/Typescript-3178C6?style=flat-square&logo=typescript&logoColor=white)
 19 | 
 20 | ![GitHub action badge](https://github.com/turbostarter/extro/actions/workflows/tests.yml/badge.svg)
 21 | ![GitHub action badge](https://github.com/turbostarter/extro/actions/workflows/publish.yml/badge.svg)
 22 | 
 23 | ![GitHub license](https://img.shields.io/github/license/turbostarter/extro)
 24 | <a href="https://discord.gg/KjpK2uk3JP" target="_blank"><img src="https://discord.com/api/guilds/1280456871693779006/widget.png"/></a>
 25 | 
 26 | > This boilerplate
 27 | > has [Plasmo version](https://github.com/turbostarter/extro/tree/plasmo)
 28 | 
 29 | </div>
 30 | 
 31 | <p align="center">
 32 |     <a href="#features"><strong>Features</strong></a> · 
 33 |     <a href="#tech-stack"><strong>Tech stack</strong></a> · 
 34 |     <a href="#contributing"><strong>Contributing</strong></a> ·
 35 |     <a href="#getting-started"><strong>Getting started</strong></a> ·
 36 |     <a href="#community"><strong>Community</strong></a> ·
 37 |     <a href="#star-history"><strong>Star History</strong></a>
 38 |   </p>
 39 | 
 40 | 
 41 |   Everything you need to build a production ready browser extension, it's an **opinionated** stack based on learnings from building multiple browser extensions using the latest React framework. It's a starter kit with a focus on code reuse and best practices that will grow with your business.
 42 | 
 43 | > [!NOTE]
 44 | > This project is listed on [Awesome Open Source Boilerplates](https://github.com/EinGuterWaran/awesome-opensource-boilerplates) and [Awesome SaaS Boilerplates](https://github.com/smirnov-am/awesome-saas-boilerplates)
 45 | 
 46 | 
 47 | > [!TIP]
 48 | > Sharing storage and authentication session between all pages
 49 | >
 50 | > https://github.com/user-attachments/assets/970eddf8-5faf-42cc-89ed-54b7c7548bc8
 51 | 
 52 | 
 53 | ## Features ✨ <a name="features"></a>
 54 | 
 55 | - 🔒 Full type-safety with Typescript
 56 | - 📄 All pages (background, popup, options etc.)
 57 | - 📜 Content scripts (UI)
 58 | - 🔐 Authentication (OAuth)
 59 | - 💾 Storage
 60 | - 💬 Messaging
 61 | - 🔥 Hot reloading
 62 | - 🚀 One-click publishing
 63 | - 🌍 Internationalization
 64 | - 📊 Analytics
 65 | - ✨ Linting and formatting
 66 | - 🧪 Unit tests
 67 | - 🔄 CI/CD pipelines
 68 | - ⚙️ Environment variables
 69 | - 🎨 shadcn/ui compatible
 70 | - 🔤 Custom fonts
 71 | - 🤖 Native AI integration (experimental)
 72 | - ✨ [ts-reset](https://github.com/mattpocock/ts-reset) for enhanced DX
 73 | - 💳 Billing (coming soon)
 74 | 
 75 | ## Tech stack 🛠️ <a name="tech-stack"></a>
 76 | 
 77 | | Tech                                           | Description                                                                   |
 78 | | ---------------------------------------------- | ----------------------------------------------------------------------------- |
 79 | | [TypeScript](https://www.typescriptlang.org/)  | Static type-checking programming language                                     |
 80 | | [React](https://reactjs.org/)                  | Library for building user interfaces                                          |
 81 | | [WXT](https://wxt.dev/)                        | Next-gen Web Extension Framework                                              |
 82 | | [Supabase](https://supabase.com/)              | Open source Firebase alternative                                              |
 83 | | [shadcn/ui](https://ui.shadcn.com/)            | Extendable component library                                                  |
 84 | | [Tailwind](https://tailwindcss.com/)           | Utility-first CSS framework                                                   |
 85 | | [OpenPanel](https://openpanel.dev/)            | Open source analytics                                                         |
 86 | | [React Hook Form](https://react-hook-form.com) | Forms with easy-to-use validation                                             |
 87 | | [Vite](https://vitejs.dev/)                    | Next generation frontend tool                                                 |
 88 | | [Bun](https://bun.sh/)                         | Package manager and build tool                                                |
 89 | | [Husky](https://github.com/typicode/husky)     | Git hooks                                                                     |
 90 | | [Biome](https://biomejs.dev/)                  | Linting and formatting                                                        |
 91 | 
 92 | ## Contributing 🤝 <a name="contributing"></a>
 93 | 
 94 | Please read [CONTRIBUTING.md](./CONTRIBUTING.md).
 95 | 
 96 | ## Getting started 🚀 <a name="getting-started"></a>
 97 | 
 98 | ### Prerequisites
 99 | 
100 | - [Bun](https://bun.sh/)
101 | 
102 | ### Installation
103 | 
104 | 1. Clone the repository
105 | 
106 | ```bash
107 | git clone git@github.com:turbostarter/extro.git
108 | ```
109 | 
110 | 2. Install dependencies
111 | 
112 | ```bash
113 | bun install
114 | ```
115 | 
116 | 3. Copy `.env.example` to `.env` and update the variables
117 | 
118 | ```bash
119 | cp .env.example .env
120 | ```
121 | 
122 | ### Development
123 | 
124 | #### Chrome
125 | 
126 | 1. Run development server
127 | 
128 | ```bash
129 | bun dev:chrome
130 | ```
131 | 
132 | 2. Open Chrome and go to `chrome://extensions`
133 | 3. Check `Developer mode`
134 | 4. Click `Load unpacked`
135 | 5. Select the `build/chrome-mv3` directory at root
136 | 
137 | #### Firefox
138 | 
139 | 1. Run development server
140 | 
141 | ```bash
142 | bun dev:firefox
143 | ```
144 | 
145 | 2. Open Firefox and go to `about:debugging#/runtime/this-firefox`
146 | 3. Click `Load Temporary Add-on...`
147 | 4. Select the `build/firefox-mv2/manifest.json` file at root
148 | 
149 | > [!NOTE]  
150 | > In Firefox you're adding a plugin in _temporary_ mode - that means it'll disappear after you close the browser.
151 | 
152 | ### Publishing
153 | 
154 | #### Manual
155 | 
156 | 1. Run `bun run build` to build the extension for both Chrome and Firefox or `bun build:chrome` or `bun build:firefox` to build only for one of the browsers.
157 | 2. Go to the `build` directory and upload the `.zip` files to the Chrome Web Store and Firefox Add-ons.
158 | 
159 | #### CI/CD
160 | 
161 | 1. Obtain all the [required API keys](https://wxt.dev/guide/essentials/publishing.html#github-action) for your submission (check the [official token guide](https://github.com/PlasmoHQ/bms/blob/main/tokens.md) to learn more about the tokens required to submit)
162 | 2. Set your API keys as [Github secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets) under appropriate names
163 | 3. Run `CI / Publish` workflow
164 | 
165 | ### Pages
166 | 
167 | Extro ships with the following extension pages preconfigured:
168 | 
169 | - `background` - [background service worker](https://wxt.dev/guide/essentials/entrypoints.html#background)
170 | - `content` - [content scripts](https://wxt.dev/guide/essentials/content-scripts.html) that run in the context of web pages
171 | - `devtools` - [devtools](https://wxt.dev/guide/essentials/entrypoints.html#devtools) page with custom panels
172 | - `newtab` - [new tab](https://wxt.dev/guide/essentials/entrypoints.html#newtab) page
173 | - `options` - [options](https://wxt.dev/guide/essentials/entrypoints.html#options) page
174 | - `popup` - [popup](https://wxt.dev/guide/essentials/entrypoints.html#popup) window
175 | - `sidepanel` - [side panel](https://wxt.dev/guide/essentials/entrypoints.html#side-panel)
176 | - `tabs` - [unlisted](https://wxt.dev/guide/essentials/entrypoints.html#unlisted-pages) pages (custom pages delivered with the extension)
177 | 
178 | ## Community 💬 <a name="community"></a>
179 | 
180 | To chat with other community members, you can join the [Discord](https://discord.gg/KjpK2uk3JP) server.
181 | You can ask questions on that server, and you can also help others.
182 | 
183 | Also, suggest new features or share any challenges you've faced while developing Chrome extensions!
184 | 
185 | ## Star History 🌟 <a name="star-history"></a>
186 | 
187 | <a href="https://star-history.com/#turbostarter/extro&Date">
188 |  <picture>
189 |    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=turbostarter/extro&type=Date&theme=dark" />
190 |    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=turbostarter/extro&type=Date" />
191 |    <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=turbostarter/extro&type=Date" />
192 |  </picture>
193 | </a>
194 | 
195 | 
196 | ---
197 | 
198 | Made with ❤️ by [Bartosz Zagrodzki](https://zagrodzki.me)
199 | 


--------------------------------------------------------------------------------
/biome.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
 3 |   "vcs": {
 4 |     "enabled": true,
 5 |     "clientKind": "git",
 6 |     "useIgnoreFile": true
 7 |   },
 8 |   "files": {
 9 |     "ignoreUnknown": false
10 |   },
11 |   "formatter": {
12 |     "enabled": true,
13 |     "indentStyle": "space",
14 |     "indentWidth": 2,
15 |     "lineWidth": 80,
16 |     "attributePosition": "auto"
17 |   },
18 |   "organizeImports": {
19 |     "enabled": true
20 |   },
21 |   "linter": {
22 |     "enabled": true,
23 |     "rules": {
24 |       "recommended": true,
25 |       "correctness": {
26 |         "noUnusedImports": "error"
27 |       }
28 |     }
29 |   },
30 |   "javascript": {
31 |     "formatter": {
32 |       "quoteStyle": "double"
33 |     }
34 |   }
35 | }
36 | 


--------------------------------------------------------------------------------
/bun.lockb:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/turbostarter/extro/7a8ee9c70977349e537889d6393885e9b2ee6cf4/bun.lockb


--------------------------------------------------------------------------------
/commitlint.config.ts:
--------------------------------------------------------------------------------
 1 | import type { UserConfig } from "@commitlint/types";
 2 | 
 3 | const Configuration: UserConfig = {
 4 |   extends: ["@commitlint/config-conventional"],
 5 |   rules: {
 6 |     "body-max-length": [1, "always", 100],
 7 |     "body-max-line-length": [1, "always", 100],
 8 |   },
 9 | };
10 | 
11 | export default Configuration;
12 | 


--------------------------------------------------------------------------------
/components.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "$schema": "https://ui.shadcn.com/schema.json",
 3 |   "style": "default",
 4 |   "tailwind": {
 5 |     "css": "src/styles/globals.css",
 6 |     "baseColor": "gray",
 7 |     "cssVariables": true,
 8 |     "config": "tailwind.config.ts"
 9 |   },
10 |   "rsc": false,
11 |   "tsx": true,
12 |   "aliases": {
13 |     "utils": "~/lib/utils",
14 |     "components": "~/components",
15 |     "ui": "~/components/ui",
16 |     "lib": "~/lib",
17 |     "hooks": "~/lib/hooks"
18 |   }
19 | }
20 | 


--------------------------------------------------------------------------------
/env.config.ts:
--------------------------------------------------------------------------------
 1 | import { defineEnv } from "envin";
 2 | import { z } from "zod";
 3 | import { NodeEnv } from "./src/types";
 4 | 
 5 | export default defineEnv({
 6 |   shared: {
 7 |     NODE_ENV: z.nativeEnum(NodeEnv).default(NodeEnv.DEVELOPMENT),
 8 |   },
 9 |   clientPrefix: "VITE_",
10 |   client: {
11 |     VITE_OPEN_PANEL_KEY: z.string(),
12 |     VITE_SUPABASE_URL: z.string().url(),
13 |     VITE_SUPABASE_ANON_KEY: z.string(),
14 |   },
15 |   env: {
16 |     VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
17 |     VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
18 |     VITE_OPEN_PANEL_KEY: import.meta.env.VITE_OPEN_PANEL_KEY,
19 |   },
20 |   skip:
21 |     (!!import.meta.env.SKIP_ENV_VALIDATION &&
22 |       ["1", "true"].includes(import.meta.env.SKIP_ENV_VALIDATION)) ||
23 |     import.meta.env.npm_lifecycle_event === "lint",
24 | });
25 | 


--------------------------------------------------------------------------------
/package.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "name": "extro",
 3 |   "version": "1.0.0",
 4 |   "description": "Open source browser extension starter kit.",
 5 |   "license": "MIT",
 6 |   "author": "Bartosz Zagrodzki",
 7 |   "scripts": {
 8 |     "build": "run-p build:chrome build:firefox",
 9 |     "build:chrome": "wxt zip",
10 |     "build:firefox": "wxt -b firefox zip",
11 |     "dev": "bun dev:chrome",
12 |     "dev:chrome": "wxt",
13 |     "dev:firefox": "wxt -b firefox",
14 |     "lint": "biome check",
15 |     "lint:fix": "biome check --write",
16 |     "prepare": "husky",
17 |     "typecheck": "tsc --noEmit",
18 |     "postinstall": "wxt prepare"
19 |   },
20 |   "dependencies": {
21 |     "@biomejs/biome": "^1.9.4",
22 |     "@hookform/resolvers": "^5.1.1",
23 |     "@openpanel/web": "^1.0.1",
24 |     "@radix-ui/react-avatar": "^1.1.10",
25 |     "@radix-ui/react-dropdown-menu": "^2.1.15",
26 |     "@radix-ui/react-label": "^2.1.7",
27 |     "@radix-ui/react-scroll-area": "^1.2.9",
28 |     "@radix-ui/react-separator": "^1.1.7",
29 |     "@radix-ui/react-slot": "^1.2.3",
30 |     "@supabase/supabase-js": "^2.50.0",
31 |     "@tanstack/react-query": "^5.80.7",
32 |     "@webext-core/messaging": "^2.3.0",
33 |     "ai": "^4.3.16",
34 |     "chrome-ai": "^1.11.1",
35 |     "class-variance-authority": "^0.7.1",
36 |     "clsx": "^2.1.1",
37 |     "envin": "^1.1.3",
38 |     "lucide-react": "^0.487.0",
39 |     "marked": "^15.0.12",
40 |     "next-themes": "^0.4.6",
41 |     "npm-run-all": "^4.1.5",
42 |     "react": "19.1.0",
43 |     "react-dom": "19.1.0",
44 |     "react-hook-form": "^7.58.0",
45 |     "react-router-dom": "^7.6.2",
46 |     "sonner": "^2.0.5",
47 |     "tailwind-merge": "^3.3.1",
48 |     "vite-plugin-svgr": "^4.3.0",
49 |     "zod": "^3.25.64"
50 |   },
51 |   "devDependencies": {
52 |     "@commitlint/cli": "19.8.0",
53 |     "@commitlint/config-conventional": "19.8.0",
54 |     "@commitlint/types": "19.8.0",
55 |     "@tailwindcss/postcss": "^4.1.10",
56 |     "@tailwindcss/typography": "^0.5.16",
57 |     "@tailwindcss/vite": "^4.1.10",
58 |     "@total-typescript/ts-reset": "^0.6.1",
59 |     "@types/bun": "^1.2.16",
60 |     "@types/chrome": "0.0.313",
61 |     "@types/node": "22.14.0",
62 |     "@types/react": "^19.1.8",
63 |     "@types/react-dom": "^19.1.6",
64 |     "@wxt-dev/auto-icons": "^1.0.2",
65 |     "@wxt-dev/module-react": "^1.1.3",
66 |     "husky": "^9.1.7",
67 |     "tailwindcss": "^4.1.10",
68 |     "tw-animate-css": "^1.3.4",
69 |     "typescript": "^5.8.3",
70 |     "vitest": "^3.2.3",
71 |     "wxt": "^0.20.7"
72 |   }
73 | }
74 | 


--------------------------------------------------------------------------------
/postcss.config.cjs:
--------------------------------------------------------------------------------
1 | /**
2 |  * @type {import('postcss').ProcessOptions}
3 |  */
4 | module.exports = {
5 |   plugins: {
6 |     "@tailwindcss/postcss": {},
7 |   },
8 | };
9 | 


--------------------------------------------------------------------------------
/public/_locales/en/messages.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "extensionDescription": {
 3 |     "description": "Description of the extension.",
 4 |     "message": "Open source browser extension starter kit."
 5 |   },
 6 |   "extensionName": {
 7 |     "description": "Name of the extension.",
 8 |     "message": "Extro"
 9 |   },
10 |   "hello": {
11 |     "message": "Hello from"
12 |   },
13 |   "star": {
14 |     "message": "Star"
15 |   },
16 |   "follow": {
17 |     "message": "Follow"
18 |   },
19 |   "learnMore": {
20 |     "message": "Learn more"
21 |   },
22 |   "contentScriptUI": {
23 |     "message": "Content Script UI"
24 |   },
25 |   "light": {
26 |     "message": "Light"
27 |   },
28 |   "dark": {
29 |     "message": "Dark"
30 |   },
31 |   "system": {
32 |     "message": "System"
33 |   },
34 |   "name": {
35 |     "message": "Name"
36 |   },
37 |   "email": {
38 |     "message": "Email"
39 |   },
40 |   "password": {
41 |     "message": "Password"
42 |   },
43 |   "login": {
44 |     "message": "Login"
45 |   },
46 |   "loginDescription": {
47 |     "message": "Enter your email below to login to your account"
48 |   },
49 |   "register": {
50 |     "message": "Register"
51 |   },
52 |   "registerDescription": {
53 |     "message": "Enter your details below to register for an account"
54 |   },
55 |   "logout": {
56 |     "message": "Logout"
57 |   },
58 |   "continueWith": {
59 |     "message": "Or continue with"
60 |   },
61 |   "alreadyHaveAccount": {
62 |     "message": "Already have an account?"
63 |   },
64 |   "dontHaveAccount": {
65 |     "message": "Don't have an account?"
66 |   }
67 | }
68 | 


--------------------------------------------------------------------------------
/public/fonts/Geist-Bold.woff2:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/turbostarter/extro/7a8ee9c70977349e537889d6393885e9b2ee6cf4/public/fonts/Geist-Bold.woff2


--------------------------------------------------------------------------------
/public/fonts/Geist-Regular.woff2:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/turbostarter/extro/7a8ee9c70977349e537889d6393885e9b2ee6cf4/public/fonts/Geist-Regular.woff2


--------------------------------------------------------------------------------
/public/fonts/GeistMono-Bold.woff2:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/turbostarter/extro/7a8ee9c70977349e537889d6393885e9b2ee6cf4/public/fonts/GeistMono-Bold.woff2


--------------------------------------------------------------------------------
/public/fonts/GeistMono-Regular.woff2:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/turbostarter/extro/7a8ee9c70977349e537889d6393885e9b2ee6cf4/public/fonts/GeistMono-Regular.woff2


--------------------------------------------------------------------------------
/src/app/background/index.ts:
--------------------------------------------------------------------------------
 1 | import { StorageKey, getStorage } from "@/lib/storage";
 2 | import { Message, onMessage } from "~/lib/messaging";
 3 | import { defineBackground } from "#imports";
 4 | 
 5 | const main = () => {
 6 |   console.log(
 7 |     "Background service worker is running! Edit `src/app/background` and save to reload.",
 8 |   );
 9 | };
10 | 
11 | onMessage(Message.USER, () => {
12 |   const storage = getStorage(StorageKey.USER);
13 |   return storage.getValue();
14 | });
15 | 
16 | export default defineBackground(main);
17 | 


--------------------------------------------------------------------------------
/src/app/content/index.tsx:
--------------------------------------------------------------------------------
 1 | import { Button } from "@/components/ui/button";
 2 | import ReactDOM from "react-dom/client";
 3 | import { browser } from "wxt/browser";
 4 | import { createShadowRootUi, defineContentScript } from "#imports";
 5 | 
 6 | import "~/assets/styles/globals.css";
 7 | 
 8 | const ContentScriptUI = () => {
 9 |   return (
10 |     <Button onClick={() => alert("This is injected UI!")}>
11 |       {browser.i18n.getMessage("contentScriptUI")}
12 |     </Button>
13 |   );
14 | };
15 | 
16 | export default defineContentScript({
17 |   matches: ["<all_urls>"],
18 |   cssInjectionMode: "ui",
19 | 
20 |   async main(ctx) {
21 |     console.log(
22 |       "Content script is running! Edit `src/app/content` and save to reload.",
23 |     );
24 | 
25 |     const ui = await createShadowRootUi(ctx, {
26 |       name: "extro-ui",
27 |       position: "overlay",
28 |       anchor: "body",
29 |       onMount: (container) => {
30 |         const app = document.createElement("div");
31 |         container.append(app);
32 | 
33 |         const root = ReactDOM.createRoot(app);
34 |         root.render(<ContentScriptUI />);
35 |         return root;
36 |       },
37 |       onRemove: (root) => {
38 |         root?.unmount();
39 |       },
40 |     });
41 | 
42 |     ui.mount();
43 |   },
44 | });
45 | 


--------------------------------------------------------------------------------
/src/app/devtools/index.html:
--------------------------------------------------------------------------------
 1 | <!doctype html>
 2 | <html lang="en">
 3 |   <head>
 4 |     <meta charset="UTF-8" />
 5 |     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
 6 |     <title>DevTools</title>
 7 |     <meta name="manifest.type" content="browser_action" />
 8 |   </head>
 9 |   <body>
10 |     <div id="root"></div>
11 |     <script type="module" src="./main.tsx"></script>
12 |   </body>
13 | </html>
14 | 


--------------------------------------------------------------------------------
/src/app/devtools/main.tsx:
--------------------------------------------------------------------------------
 1 | import React from "react";
 2 | import ReactDOM from "react-dom/client";
 3 | import { browser } from "wxt/browser";
 4 | 
 5 | import { Main } from "~/components/common/main";
 6 | import { Layout } from "~/components/layout/layout";
 7 | 
 8 | browser.devtools.panels.create(
 9 |   browser.i18n.getMessage("extensionName"),
10 |   "icons/128.png",
11 |   "devtools.html",
12 | );
13 | 
14 | browser.devtools.panels.elements.createSidebarPane(
15 |   browser.i18n.getMessage("extensionName"),
16 |   (sidebar) => {
17 |     sidebar.setObject({
18 |       name: "DevTools",
19 |     });
20 |   },
21 | );
22 | 
23 | const DevTools = () => {
24 |   return (
25 |     <Layout>
26 |       <Main filename="app/devtools" />
27 |     </Layout>
28 |   );
29 | };
30 | 
31 | ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
32 |   <React.StrictMode>
33 |     <DevTools />
34 |   </React.StrictMode>,
35 | );
36 | 


--------------------------------------------------------------------------------
/src/app/newtab/index.html:
--------------------------------------------------------------------------------
 1 | <!doctype html>
 2 | <html lang="en">
 3 |   <head>
 4 |     <meta charset="UTF-8" />
 5 |     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
 6 |     <title>New Tab</title>
 7 |     <meta name="manifest.type" content="browser_action" />
 8 |   </head>
 9 |   <body>
10 |     <div id="root"></div>
11 |     <script type="module" src="./main.tsx"></script>
12 |   </body>
13 | </html>
14 | 


--------------------------------------------------------------------------------
/src/app/newtab/main.tsx:
--------------------------------------------------------------------------------
 1 | import React from "react";
 2 | import ReactDOM from "react-dom/client";
 3 | 
 4 | import { Main } from "~/components/common/main";
 5 | import { Layout } from "~/components/layout/layout";
 6 | 
 7 | const NewTab = () => {
 8 |   return (
 9 |     <Layout>
10 |       <Main filename="app/newtab" />
11 |     </Layout>
12 |   );
13 | };
14 | 
15 | ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
16 |   <React.StrictMode>
17 |     <NewTab />
18 |   </React.StrictMode>,
19 | );
20 | 


--------------------------------------------------------------------------------
/src/app/options/index.html:
--------------------------------------------------------------------------------
 1 | <!doctype html>
 2 | <html lang="en">
 3 |   <head>
 4 |     <meta charset="UTF-8" />
 5 |     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
 6 |     <title>Options</title>
 7 |     <meta name="manifest.type" content="browser_action" />
 8 |   </head>
 9 |   <body>
10 |     <div id="root"></div>
11 |     <script type="module" src="./main.tsx"></script>
12 |   </body>
13 | </html>
14 | 


--------------------------------------------------------------------------------
/src/app/options/main.tsx:
--------------------------------------------------------------------------------
 1 | import React from "react";
 2 | import ReactDOM from "react-dom/client";
 3 | 
 4 | import { Main } from "~/components/common/main";
 5 | import { Layout } from "~/components/layout/layout";
 6 | 
 7 | const Options = () => {
 8 |   return (
 9 |     <Layout>
10 |       <Main filename="app/options" />
11 |     </Layout>
12 |   );
13 | };
14 | 
15 | ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
16 |   <React.StrictMode>
17 |     <Options />
18 |   </React.StrictMode>,
19 | );
20 | 


--------------------------------------------------------------------------------
/src/app/popup/index.html:
--------------------------------------------------------------------------------
 1 | <!doctype html>
 2 | <html lang="en">
 3 |   <head>
 4 |     <meta charset="UTF-8" />
 5 |     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
 6 |     <title>Popup</title>
 7 |     <meta name="manifest.type" content="browser_action" />
 8 |   </head>
 9 |   <body>
10 |     <div id="root"></div>
11 |     <script type="module" src="./main.tsx"></script>
12 |   </body>
13 | </html>
14 | 


--------------------------------------------------------------------------------
/src/app/popup/main.tsx:
--------------------------------------------------------------------------------
 1 | import React from "react";
 2 | import ReactDOM from "react-dom/client";
 3 | 
 4 | import { Main } from "~/components/common/main";
 5 | import { Layout } from "~/components/layout/layout";
 6 | 
 7 | const Popup = () => {
 8 |   return (
 9 |     <Layout>
10 |       <Main className="w-[23rem] px-4" filename="app/popup" />
11 |     </Layout>
12 |   );
13 | };
14 | 
15 | ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
16 |   <React.StrictMode>
17 |     <Popup />
18 |   </React.StrictMode>,
19 | );
20 | 


--------------------------------------------------------------------------------
/src/app/sidepanel/index.html:
--------------------------------------------------------------------------------
 1 | <!doctype html>
 2 | <html lang="en">
 3 |   <head>
 4 |     <meta charset="UTF-8" />
 5 |     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
 6 |     <title>Side Panel</title>
 7 |     <meta name="manifest.type" content="browser_action" />
 8 |   </head>
 9 |   <body>
10 |     <div id="root"></div>
11 |     <script type="module" src="./main.tsx"></script>
12 |   </body>
13 | </html>
14 | 


--------------------------------------------------------------------------------
/src/app/sidepanel/main.tsx:
--------------------------------------------------------------------------------
 1 | import React from "react";
 2 | import ReactDOM from "react-dom/client";
 3 | 
 4 | import { Main } from "~/components/common/main";
 5 | import { Layout } from "~/components/layout/layout";
 6 | 
 7 | const SidePanel = () => {
 8 |   return (
 9 |     <Layout>
10 |       <Main filename="app/sidepanel" />
11 |     </Layout>
12 |   );
13 | };
14 | 
15 | ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
16 |   <React.StrictMode>
17 |     <SidePanel />
18 |   </React.StrictMode>,
19 | );
20 | 


--------------------------------------------------------------------------------
/src/app/tabs/ai.tsx:
--------------------------------------------------------------------------------
  1 | import { useMutation } from "@tanstack/react-query";
  2 | import { streamText } from "ai";
  3 | import { chromeai } from "chrome-ai";
  4 | import { type KeyboardEvent, useState } from "react";
  5 | import { Layout } from "~/components/layout/layout";
  6 | 
  7 | import { zodResolver } from "@hookform/resolvers/zod";
  8 | import { ArrowUp, X } from "lucide-react";
  9 | import { marked } from "marked";
 10 | import { useForm } from "react-hook-form";
 11 | import { z } from "zod";
 12 | import { Button } from "~/components/ui/button";
 13 | import {
 14 |   Form,
 15 |   FormControl,
 16 |   FormField,
 17 |   FormItem,
 18 |   FormMessage,
 19 | } from "~/components/ui/form";
 20 | import { ScrollArea } from "~/components/ui/scroll-area";
 21 | import { Textarea } from "~/components/ui/textarea";
 22 | import { cn } from "~/lib/utils";
 23 | 
 24 | const promptSchema = z.object({
 25 |   prompt: z.string(),
 26 | });
 27 | 
 28 | type Message = {
 29 |   role: "system" | "user" | "assistant" | "data";
 30 |   content: string;
 31 | };
 32 | 
 33 | const Chat = () => {
 34 |   const [isThinking, setIsThinking] = useState(false);
 35 |   const [error, setError] = useState<string | null>(null);
 36 |   const [messages, setMessages] = useState<Message[]>([]);
 37 |   const { mutate, isPending } = useMutation({
 38 |     mutationFn: async (messages: Message[]) => {
 39 |       const { textStream } = await streamText({
 40 |         model: chromeai(),
 41 |         messages,
 42 |       });
 43 |       return textStream;
 44 |     },
 45 |     onMutate: () => {
 46 |       setIsThinking(true);
 47 |     },
 48 |     onSuccess: async (data) => {
 49 |       for await (const chunk of data) {
 50 |         setMessages((prev) => {
 51 |           if (prev.at(-1)?.role === "user") {
 52 |             return [...prev, { role: "assistant", content: chunk }];
 53 |           }
 54 | 
 55 |           return [
 56 |             ...prev.slice(0, -1),
 57 |             {
 58 |               role: "assistant",
 59 |               content: (prev.at(-1)?.content ?? "") + chunk,
 60 |             },
 61 |           ];
 62 |         });
 63 | 
 64 |         setIsThinking(false);
 65 |       }
 66 |     },
 67 |     onError: (e) => {
 68 |       setError(e.message);
 69 |       setIsThinking(false);
 70 |     },
 71 |   });
 72 | 
 73 |   const form = useForm<z.infer<typeof promptSchema>>({
 74 |     resolver: zodResolver(promptSchema),
 75 |   });
 76 | 
 77 |   const messagesToDisplay = messages.filter((message) =>
 78 |     ["assistant", "user"].includes(message.role),
 79 |   );
 80 | 
 81 |   const onSubmit = (values: z.infer<typeof promptSchema>) => {
 82 |     const message = { role: "user", content: values.prompt } as const;
 83 |     form.reset({
 84 |       prompt: "",
 85 |     });
 86 |     mutate([...messages, message]);
 87 |     setMessages((prev) => [...prev, message]);
 88 |   };
 89 | 
 90 |   const handleKeyDown = async (event: KeyboardEvent<HTMLTextAreaElement>) => {
 91 |     if (event.key === "Enter" && !event.shiftKey) {
 92 |       event.preventDefault();
 93 |       await form.handleSubmit(onSubmit)();
 94 |     }
 95 |   };
 96 | 
 97 |   return (
 98 |     <div className="flex w-full max-w-2xl grow flex-col items-center justify-between gap-6 self-center">
 99 |       <ScrollArea className="w-full grow">
100 |         <div className="prose flex flex-col gap-2 dark:prose-invert">
101 |           {messagesToDisplay.map((message) => (
102 |             <article
103 |               key={message.content}
104 |               className={cn("max-w-full", {
105 |                 "max-w-4/5 self-end rounded-lg bg-muted px-5 py-2.5":
106 |                   message.role === "user",
107 |               })}
108 |             >
109 |               {message.role === "assistant" ? (
110 |                 <div
111 |                   // biome-ignore lint/security/noDangerouslySetInnerHtml: Using marked library to parse markdown content from AI responses
112 |                   dangerouslySetInnerHTML={{
113 |                     __html: marked.parse(message.content) as string,
114 |                   }}
115 |                 />
116 |               ) : (
117 |                 message.content
118 |               )}
119 |             </article>
120 |           ))}
121 |           {isThinking && <span className="block py-5">Thinking...</span>}
122 |           {error && (
123 |             <span className="block px-5 py-2.5 bg-destructive/30 rounded-lg mt-4 text-destructive w-fit">
124 |               {error}
125 |             </span>
126 |           )}
127 |         </div>
128 |       </ScrollArea>
129 | 
130 |       <Form {...form}>
131 |         <form
132 |           onSubmit={form.handleSubmit(onSubmit)}
133 |           className="sticky bottom-0 w-full bg-background pb-4"
134 |         >
135 |           <FormField
136 |             control={form.control}
137 |             name="prompt"
138 |             render={({ field }) => (
139 |               <FormItem>
140 |                 <FormControl>
141 |                   <Textarea
142 |                     placeholder="Ask a question..."
143 |                     className="resize-none text-base"
144 |                     rows={3}
145 |                     onKeyDown={handleKeyDown}
146 |                     disabled={isPending}
147 |                     {...field}
148 |                   />
149 |                 </FormControl>
150 |                 <FormMessage />
151 |               </FormItem>
152 |             )}
153 |           />
154 | 
155 |           <Button
156 |             className="absolute bottom-6 right-2 size-8 rounded-full"
157 |             size="icon"
158 |             type="submit"
159 |             disabled={isPending}
160 |           >
161 |             <ArrowUp />
162 |           </Button>
163 |         </form>
164 |       </Form>
165 |     </div>
166 |   );
167 | };
168 | 
169 | const AIDisclaimer = () => {
170 |   const [isOpen, setIsOpen] = useState(true);
171 | 
172 |   if (!isOpen) {
173 |     return null;
174 |   }
175 | 
176 |   return (
177 |     <div className="prose max-w-2xl dark:prose-invert border relative rounded-lg px-8 py-4 pt-6">
178 |       <Button
179 |         type="button"
180 |         variant="ghost"
181 |         size="icon"
182 |         className="absolute top-4 right-4"
183 |         onClick={() => setIsOpen(false)}
184 |       >
185 |         <X />
186 |       </Button>
187 |       <p className="mt-0">
188 |         To use Chrome built-in AI, you need to turn on these flags:
189 |       </p>
190 |       <ul>
191 |         <li>
192 |           <a
193 |             href="chrome://flags/#prompt-api-for-gemini-nano"
194 |             className="text-primary hover:no-underline"
195 |           >
196 |             chrome://flags/#prompt-api-for-gemini-nano
197 |           </a>
198 |           : <code>Enabled</code>
199 |         </li>
200 |         <li>
201 |           <a
202 |             href="chrome://flags/#optimization-guide-on-device-model"
203 |             className="text-primary hover:no-underline"
204 |           >
205 |             chrome://flags/#optimization-guide-on-device-model
206 |           </a>
207 |           : <code>Enabled</code>
208 |         </li>
209 |         <li>
210 |           <a
211 |             href="chrome://components"
212 |             className="text-primary hover:no-underline"
213 |           >
214 |             chrome://components
215 |           </a>
216 |           : Click
217 |           <code>Optimization Guide On Device Model</code>
218 |           to download the model.
219 |         </li>
220 |       </ul>
221 |     </div>
222 |   );
223 | };
224 | 
225 | export const AI = () => {
226 |   return (
227 |     <Layout>
228 |       <AIDisclaimer />
229 |       <Chat />
230 |     </Layout>
231 |   );
232 | };
233 | 


--------------------------------------------------------------------------------
/src/app/tabs/index.html:
--------------------------------------------------------------------------------
 1 | <!doctype html>
 2 | <html lang="en">
 3 |   <head>
 4 |     <meta charset="UTF-8" />
 5 |     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
 6 |     <title>Tabs</title>
 7 |     <meta name="manifest.type" content="browser_action" />
 8 |   </head>
 9 |   <body>
10 |     <div id="root"></div>
11 |     <script type="module" src="./main.tsx"></script>
12 |   </body>
13 | </html>
14 | 


--------------------------------------------------------------------------------
/src/app/tabs/login.tsx:
--------------------------------------------------------------------------------
 1 | import { browser } from "wxt/browser";
 2 | import { Auth } from "~/components/auth";
 3 | 
 4 | export const Login = () => {
 5 |   return (
 6 |     <Auth.Layout
 7 |       title={browser.i18n.getMessage("login")}
 8 |       description={browser.i18n.getMessage("loginDescription")}
 9 |     >
10 |       <Auth.Socials />
11 |       <Auth.Separator />
12 |       <Auth.Login />
13 |     </Auth.Layout>
14 |   );
15 | };
16 | 


--------------------------------------------------------------------------------
/src/app/tabs/main.tsx:
--------------------------------------------------------------------------------
 1 | import ReactDOM from "react-dom/client";
 2 | import { RouterProvider, createHashRouter } from "react-router-dom";
 3 | import { AI } from "./ai";
 4 | import { Login } from "./login";
 5 | import { Register } from "./register";
 6 | 
 7 | const router = createHashRouter([
 8 |   {
 9 |     children: [
10 |       {
11 |         path: "ai",
12 |         element: <AI />,
13 |       },
14 |       {
15 |         path: "login",
16 |         element: <Login />,
17 |       },
18 |       {
19 |         path: "register",
20 |         element: <Register />,
21 |       },
22 |     ],
23 |   },
24 | ]);
25 | 
26 | ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
27 |   <RouterProvider router={router} />,
28 | );
29 | 


--------------------------------------------------------------------------------
/src/app/tabs/register.tsx:
--------------------------------------------------------------------------------
 1 | import { browser } from "wxt/browser";
 2 | import { Auth } from "~/components/auth";
 3 | 
 4 | export const Register = () => {
 5 |   return (
 6 |     <Auth.Layout
 7 |       title={browser.i18n.getMessage("register")}
 8 |       description={browser.i18n.getMessage("registerDescription")}
 9 |     >
10 |       <Auth.Socials />
11 |       <Auth.Separator />
12 |       <Auth.Register />
13 |     </Auth.Layout>
14 |   );
15 | };
16 | 


--------------------------------------------------------------------------------
/src/assets/icon.png:
--------------------------------------------------------------------------------
https://raw.githubusercontent.com/turbostarter/extro/7a8ee9c70977349e537889d6393885e9b2ee6cf4/src/assets/icon.png


--------------------------------------------------------------------------------
/src/assets/logo.svg:
--------------------------------------------------------------------------------
1 | <svg viewBox="0 0 427 433" fill="none" xmlns="http://www.w3.org/2000/svg">
2 | <path fill-rule="evenodd" clip-rule="evenodd" d="M328.828 0.162109C323.775 0.162109 319.678 4.2587 319.678 9.31211V102.383C319.678 110.351 316.216 117.926 310.191 123.14L293.693 137.417L222.132 65.8565C217.368 61.0921 209.643 61.092 204.879 65.8564L133.561 137.175L117.343 123.14C111.318 117.926 107.856 110.351 107.856 102.383V9.31211C107.856 4.2587 103.759 0.162109 98.706 0.162109C93.6526 0.162109 89.556 4.2587 89.556 9.31211V102.383C89.556 115.663 95.3264 128.288 105.368 136.978L120.587 150.148L100.495 170.241L70.385 159.05C59.6321 155.053 52.4984 144.791 52.4984 133.319V48.9621C52.4984 43.9087 48.4018 39.8121 43.3484 39.8121C38.295 39.8121 34.1984 43.9087 34.1984 48.9621V133.319C34.1984 152.439 46.0878 169.542 64.0094 176.203L89.1813 185.559C80.0601 203.125 80.06 224.199 89.1812 241.765L60.0346 252.599C44.5026 258.371 34.1984 273.194 34.1984 289.764V378.362C34.1984 383.416 38.295 387.512 43.3484 387.512C48.4018 387.512 52.4984 383.416 52.4984 378.362V289.764C52.4984 280.842 58.0468 272.861 66.4102 269.752L100.495 257.083L120.587 277.176L103.26 292.171C94.557 299.702 89.556 310.643 89.556 322.153V418.012C89.556 423.066 93.6526 427.162 98.706 427.162C103.759 427.162 107.856 423.066 107.856 418.012V322.153C107.856 315.955 110.549 310.064 115.235 306.009L133.561 290.15L204.879 361.468C209.643 366.232 217.368 366.232 222.132 361.468L293.693 289.907L312.299 306.009C316.986 310.064 319.678 315.955 319.678 322.153L319.678 418.012C319.678 423.066 323.775 427.162 328.828 427.162C333.882 427.162 337.978 423.066 337.978 418.012V322.153C337.978 310.643 332.977 299.702 324.274 292.171L306.667 276.933L326.659 256.942L361.124 269.752C369.488 272.861 375.036 280.842 375.036 289.764V378.362C375.036 383.416 379.133 387.512 384.186 387.512C389.239 387.512 393.336 383.416 393.336 378.362V289.764C393.336 273.194 383.032 258.371 367.5 252.599L337.915 241.602C346.923 224.123 346.923 203.201 337.915 185.722L363.525 176.203C381.447 169.542 393.336 152.439 393.336 133.319V48.9621C393.336 43.9087 389.239 39.8121 384.186 39.8121C379.133 39.8121 375.036 43.9087 375.036 48.9621V133.319C375.036 144.791 367.902 155.053 357.149 159.05L326.658 170.382L306.667 150.391L322.166 136.978C332.208 128.288 337.978 115.663 337.978 102.383V9.31211C337.978 4.2587 333.882 0.162109 328.828 0.162109ZM244.479 160.51C244.895 159.665 245.553 158.329 247.395 156.488C250.372 153.511 254.409 151.839 258.619 151.839C262.828 151.839 266.866 153.511 269.842 156.488C272.819 159.464 274.492 163.502 274.492 167.712C274.492 171.921 272.819 175.959 269.842 178.935C267.999 180.779 266.667 181.435 265.822 181.851C265.697 181.912 265.584 181.968 265.48 182.022C260.113 184.82 258.379 188.194 263.992 193.807C264.543 194.358 282.082 211.134 285.261 213.906C287.339 215.721 287.979 218.489 286.372 220.622C285.16 222.233 272.501 237.728 267.265 241.967C263.212 245.244 258.214 245.359 255.157 242.302C253.775 240.916 253.254 239.22 252.707 237.423C252.501 236.75 252.39 235.846 252.265 234.829C251.955 232.308 251.56 229.09 249.421 226.951C244.618 222.148 237.025 224.662 230.679 230.839C224.502 237.185 221.988 244.778 226.791 249.581C228.927 251.717 232.146 252.113 234.668 252.424C235.686 252.549 236.59 252.661 237.263 252.867C239.06 253.414 240.76 253.935 242.142 255.317C245.199 258.378 245.089 263.376 241.807 267.425C237.568 272.656 222.073 285.319 220.462 286.532C218.329 288.134 215.557 287.499 213.746 285.421C210.974 282.242 194.199 264.703 193.647 264.152C188.03 258.535 184.66 260.273 181.862 265.64C181.808 265.743 181.752 265.856 181.692 265.98C181.275 266.825 180.617 268.161 178.776 270.002C175.799 272.979 171.761 274.652 167.552 274.652C163.342 274.652 159.305 272.979 156.328 270.002C153.351 267.026 151.679 262.988 151.679 258.779C151.679 254.569 153.351 250.531 156.328 247.555C158.172 245.711 159.504 245.055 160.348 244.64C160.473 244.578 160.587 244.522 160.69 244.468C166.057 241.67 167.791 238.296 162.178 232.683C161.627 232.132 144.089 215.356 140.909 212.584C138.832 210.769 138.192 208.001 139.798 205.868C141.011 204.258 153.67 188.762 158.905 184.523C162.958 181.246 167.957 181.131 171.013 184.188C172.395 185.574 172.917 187.27 173.464 189.068C173.67 189.741 173.781 190.644 173.906 191.662C174.215 194.182 174.611 197.401 176.749 199.539C181.552 204.342 189.145 201.828 195.492 195.651C201.668 189.305 204.182 181.712 199.379 176.909C197.244 174.774 194.024 174.377 191.502 174.066C190.485 173.941 189.581 173.829 188.908 173.623C187.11 173.077 185.41 172.555 184.028 171.173C180.972 168.112 181.082 163.114 184.363 159.065C188.602 153.834 204.098 141.171 205.709 139.958C207.841 138.356 210.614 138.992 212.424 141.069C215.196 144.249 231.972 161.787 232.523 162.338C238.14 167.955 241.51 166.217 244.308 160.85C244.362 160.747 244.418 160.634 244.479 160.51Z" fill="#16A34A"/>
3 | </svg>
4 | 


--------------------------------------------------------------------------------
/src/assets/styles/animations.css:
--------------------------------------------------------------------------------
 1 | @import "tw-animate-css";
 2 | 
 3 | @theme inline {
 4 |   --animate-accordion-down: accordion-down 0.2s ease-out;
 5 |   --animate-accordion-up: accordion-up 0.2s ease-out;
 6 | 
 7 |   @keyframes accordion-down {
 8 |     from {
 9 |       height: 0;
10 |     }
11 |     to {
12 |       height: var(--radix-accordion-content-height);
13 |     }
14 |   }
15 |   @keyframes accordion-up {
16 |     from {
17 |       height: var(--radix-accordion-content-height);
18 |     }
19 |     to {
20 |       height: 0;
21 |     }
22 |   }
23 | }
24 | 


--------------------------------------------------------------------------------
/src/assets/styles/globals.css:
--------------------------------------------------------------------------------
  1 | @import "tailwindcss";
  2 | @import "./animations";
  3 | 
  4 | @plugin '@tailwindcss/typography';
  5 | 
  6 | @custom-variant dark (&:where(.dark, .dark *));
  7 | 
  8 | @theme inline {
  9 |   --color-border: var(--border);
 10 |   --color-input: var(--input);
 11 |   --color-ring: var(--ring);
 12 |   --color-background: var(--background);
 13 |   --color-foreground: var(--foreground);
 14 | 
 15 |   --color-primary: var(--primary);
 16 |   --color-primary-foreground: var(--primary-foreground);
 17 | 
 18 |   --color-secondary: var(--secondary);
 19 |   --color-secondary-foreground: var(--secondary-foreground);
 20 | 
 21 |   --color-destructive: var(--destructive);
 22 |   --color-destructive-foreground: var(--destructive-foreground);
 23 | 
 24 |   --color-muted: var(--muted);
 25 |   --color-muted-foreground: var(--muted-foreground);
 26 | 
 27 |   --color-accent: var(--accent);
 28 |   --color-accent-foreground: var(--accent-foreground);
 29 | 
 30 |   --color-popover: var(--popover);
 31 |   --color-popover-foreground: var(--popover-foreground);
 32 | 
 33 |   --color-card: var(--card);
 34 |   --color-card-foreground: var(--card-foreground);
 35 | 
 36 |   --radius-lg: var(--radius);
 37 |   --radius-md: calc(var(--radius) - 2px);
 38 |   --radius-sm: calc(var(--radius) - 4px);
 39 | 
 40 |   --font-sans: var(--font-sans), ui-sans-serif, system-ui, sans-serif,
 41 |     "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
 42 |   --font-mono: var(--font-mono), ui-monospace, SFMono-Regular, Menlo, Monaco,
 43 |     Consolas, "Liberation Mono", "Courier New", monospace;
 44 | }
 45 | 
 46 | @layer base {
 47 |   *,
 48 |   ::after,
 49 |   ::before,
 50 |   ::backdrop,
 51 |   ::file-selector-button {
 52 |     border-color: var(--color-gray-200, currentcolor);
 53 |   }
 54 | }
 55 | 
 56 | @layer base {
 57 |   :root {
 58 |     --font-sans: "Geist", sans-serif;
 59 |     --font-mono: "Geist Mono", monospace;
 60 |     --radius: 0.5rem;
 61 | 
 62 |     --background: hsl(0 0% 100%);
 63 |     --foreground: hsl(240 10% 3.9%);
 64 |     --card: hsl(0 0% 100%);
 65 |     --card-foreground: hsl(240 10% 3.9%);
 66 |     --popover: hsl(0 0% 100%);
 67 |     --popover-foreground: hsl(240 10% 3.9%);
 68 |     --primary: hsl(142.1 76.2% 36.3%);
 69 |     --primary-foreground: hsl(355.7 100% 97.3%);
 70 |     --secondary: hsl(240 4.8% 95.9%);
 71 |     --secondary-foreground: hsl(240 5.9% 10%);
 72 |     --muted: hsl(240 4.8% 95.9%);
 73 |     --muted-foreground: hsl(240 3.8% 46.1%);
 74 |     --accent: hsl(240 4.8% 95.9%);
 75 |     --accent-foreground: hsl(240 5.9% 10%);
 76 |     --destructive: hsl(0 84.2% 60.2%);
 77 |     --destructive-foreground: hsl(0 0% 98%);
 78 |     --border: hsl(240 5.9% 90%);
 79 |     --input: hsl(240 5.9% 90%);
 80 |     --ring: hsl(142.1 76.2% 36.3%);
 81 |     --chart-1: hsl(12 76% 61%);
 82 |     --chart-2: hsl(173 58% 39%);
 83 |     --chart-3: hsl(197 37% 24%);
 84 |     --chart-4: hsl(43 74% 66%);
 85 |     --chart-5: hsl(27 87% 67%);
 86 |   }
 87 | 
 88 |   .dark {
 89 |     --background: hsl(20 14.3% 4.1%);
 90 |     --foreground: hsl(0 0% 95%);
 91 |     --card: hsl(24 9.8% 10%);
 92 |     --card-foreground: hsl(0 0% 95%);
 93 |     --popover: hsl(0 0% 9%);
 94 |     --popover-foreground: hsl(0 0% 95%);
 95 |     --primary: hsl(142.1 70.6% 45.3%);
 96 |     --primary-foreground: hsl(144.9 80.4% 10%);
 97 |     --secondary: hsl(240 3.7% 15.9%);
 98 |     --secondary-foreground: hsl(0 0% 98%);
 99 |     --muted: hsl(0 0% 15%);
100 |     --muted-foreground: hsl(240 5% 64.9%);
101 |     --accent: hsl(12 6.5% 15.1%);
102 |     --accent-foreground: hsl(0 0% 98%);
103 |     --destructive: hsl(0 62.8% 30.6%);
104 |     --destructive-foreground: hsl(0 85.7% 97.3%);
105 |     --border: hsl(240 3.7% 15.9%);
106 |     --input: hsl(240 3.7% 15.9%);
107 |     --ring: hsl(142.4 71.8% 29.2%);
108 |     --chart-1: hsl(220 70% 50%);
109 |     --chart-2: hsl(160 60% 45%);
110 |     --chart-3: hsl(30 80% 55%);
111 |     --chart-4: hsl(280 65% 60%);
112 |     --chart-5: hsl(340 75% 55%);
113 |   }
114 | }
115 | 
116 | @layer base {
117 |   * {
118 |     @apply border-border;
119 |   }
120 |   body {
121 |     @apply bg-background text-foreground;
122 |     font-feature-settings: "rlig" 1, "calt" 1;
123 |   }
124 | }
125 | 
126 | @layer base {
127 |   @font-face {
128 |     font-family: "Geist";
129 |     font-style: normal;
130 |     font-weight: 400;
131 |     font-display: swap;
132 |     src: url(/fonts/Geist-Regular.woff2) format("woff2");
133 |   }
134 | 
135 |   @font-face {
136 |     font-family: "Geist";
137 |     font-style: normal;
138 |     font-weight: 700;
139 |     font-display: swap;
140 |     src: url(/fonts/Geist-Bold.woff2) format("woff2");
141 |   }
142 | 
143 |   @font-face {
144 |     font-family: "Geist Mono";
145 |     font-style: normal;
146 |     font-weight: 400;
147 |     font-display: swap;
148 |     src: url(/fonts/GeistMono-Regular.woff2) format("woff2");
149 |   }
150 | 
151 |   @font-face {
152 |     font-family: "Geist Mono";
153 |     font-style: normal;
154 |     font-weight: 700;
155 |     font-display: swap;
156 |     src: url(/fonts/GeistMono-Bold.woff2) format("woff2");
157 |   }
158 | }
159 | 


--------------------------------------------------------------------------------
/src/components/auth/index.tsx:
--------------------------------------------------------------------------------
  1 | import type { Provider } from "@supabase/supabase-js";
  2 | import { useMutation } from "@tanstack/react-query";
  3 | import { useEffect } from "react";
  4 | import { toast } from "sonner";
  5 | import { browser } from "wxt/browser";
  6 | import { Layout as MainLayout } from "~/components/layout/layout";
  7 | import { Button } from "~/components/ui/button";
  8 | import {
  9 |   Card,
 10 |   CardContent,
 11 |   CardDescription,
 12 |   CardHeader,
 13 |   CardTitle,
 14 | } from "~/components/ui/card";
 15 | import { Separator as SeparatorUI } from "~/components/ui/separator";
 16 | import { supabase } from "~/lib/supabase";
 17 | import { Login } from "./login";
 18 | import { Register } from "./register";
 19 | 
 20 | const Layout = ({
 21 |   children,
 22 |   title,
 23 |   description,
 24 | }: { children: React.ReactNode; title: string; description: string }) => {
 25 |   useEffect(() => {
 26 |     document.title = title;
 27 |   }, [title]);
 28 | 
 29 |   return (
 30 |     <MainLayout>
 31 |       <Card className="mx-auto w-96">
 32 |         <CardHeader>
 33 |           <CardTitle className="text-2xl">{title}</CardTitle>
 34 |           <CardDescription>{description}</CardDescription>
 35 |         </CardHeader>
 36 |         <CardContent>{children}</CardContent>
 37 |       </Card>
 38 |     </MainLayout>
 39 |   );
 40 | };
 41 | 
 42 | const Separator = () => {
 43 |   return (
 44 |     <div className="relative my-4">
 45 |       <div className="absolute inset-0 flex items-center">
 46 |         <SeparatorUI className="w-full" />
 47 |       </div>
 48 |       <div className="relative flex justify-center text-xs uppercase">
 49 |         <span className="bg-card px-2 text-muted-foreground">
 50 |           {browser.i18n.getMessage("continueWith")}
 51 |         </span>
 52 |       </div>
 53 |     </div>
 54 |   );
 55 | };
 56 | 
 57 | const Socials = () => {
 58 |   const { mutate } = useMutation({
 59 |     mutationFn: async (provider: Provider) => {
 60 |       const { error } = await supabase.auth.signInWithOAuth({
 61 |         provider,
 62 |         options: {
 63 |           redirectTo: `${new URL(location.href).origin}/options.html`,
 64 |         },
 65 |       });
 66 |       if (error) throw error;
 67 |     },
 68 |     onError: (error) => toast.error(error.message),
 69 |   });
 70 | 
 71 |   return (
 72 |     <div className="grid grid-cols-2 gap-4">
 73 |       <Button
 74 |         variant="outline"
 75 |         className="w-full gap-3"
 76 |         onClick={() => mutate("github")}
 77 |       >
 78 |         <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
 79 |           <title>GitHub</title>
 80 |           <path
 81 |             fill="currentColor"
 82 |             d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
 83 |           />
 84 |         </svg>
 85 |         Github
 86 |       </Button>
 87 |       <Button
 88 |         variant="outline"
 89 |         className="w-full gap-3"
 90 |         onClick={() => mutate("google")}
 91 |       >
 92 |         <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
 93 |           <title>Google</title>
 94 |           <path
 95 |             fill="currentColor"
 96 |             d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
 97 |           />
 98 |         </svg>
 99 |         Google
100 |       </Button>
101 |     </div>
102 |   );
103 | };
104 | 
105 | export const Auth = {
106 |   Layout,
107 |   Separator,
108 |   Socials,
109 |   Login,
110 |   Register,
111 | };
112 | 


--------------------------------------------------------------------------------
/src/components/auth/login.tsx:
--------------------------------------------------------------------------------
 1 | import { zodResolver } from "@hookform/resolvers/zod";
 2 | import { useMutation } from "@tanstack/react-query";
 3 | import { Loader2 } from "lucide-react";
 4 | import { useForm } from "react-hook-form";
 5 | import { toast } from "sonner";
 6 | import { browser } from "wxt/browser";
 7 | import { z } from "zod";
 8 | import { Button } from "~/components/ui/button";
 9 | import {
10 |   Form,
11 |   FormControl,
12 |   FormField,
13 |   FormItem,
14 |   FormLabel,
15 |   FormMessage,
16 | } from "~/components/ui/form";
17 | import { Input } from "~/components/ui/input";
18 | import { supabase } from "~/lib/supabase";
19 | 
20 | const loginSchema = z.object({
21 |   email: z.string().email(),
22 |   password: z.string().min(8),
23 | });
24 | 
25 | type LoginData = z.infer<typeof loginSchema>;
26 | 
27 | export const Login = () => {
28 |   const { mutate, isPending } = useMutation({
29 |     mutationFn: async (data: LoginData) => {
30 |       const { error } = await supabase.auth.signInWithPassword(data);
31 |       if (error) throw error;
32 |     },
33 |     onError: (error) => toast.error(error.message),
34 |     onSuccess: () =>
35 |       browser.tabs.update({
36 |         url: "options.html",
37 |       }),
38 |   });
39 | 
40 |   const form = useForm<LoginData>({
41 |     resolver: zodResolver(loginSchema),
42 |   });
43 | 
44 |   const onSubmit = (data: LoginData) => {
45 |     mutate(data);
46 |   };
47 | 
48 |   return (
49 |     <Form {...form}>
50 |       <form
51 |         onSubmit={form.handleSubmit(onSubmit)}
52 |         className="flex flex-col gap-4"
53 |       >
54 |         <FormField
55 |           control={form.control}
56 |           name="email"
57 |           render={({ field }) => (
58 |             <FormItem>
59 |               <FormLabel>{browser.i18n.getMessage("email")}</FormLabel>
60 |               <FormControl>
61 |                 <Input placeholder="email@example.com" {...field} />
62 |               </FormControl>
63 |               <FormMessage />
64 |             </FormItem>
65 |           )}
66 |         />
67 | 
68 |         <FormField
69 |           control={form.control}
70 |           name="password"
71 |           render={({ field }) => (
72 |             <FormItem>
73 |               <FormLabel>{browser.i18n.getMessage("password")}</FormLabel>
74 |               <FormControl>
75 |                 <Input type="password" placeholder="••••••••" {...field} />
76 |               </FormControl>
77 |               <FormMessage />
78 |             </FormItem>
79 |           )}
80 |         />
81 |         <Button type="submit" className="w-full mt-2" disabled={isPending}>
82 |           {isPending ? (
83 |             <Loader2 className="size-4 animate-spin" />
84 |           ) : (
85 |             browser.i18n.getMessage("login")
86 |           )}
87 |         </Button>
88 |       </form>
89 | 
90 |       <div className="mt-4 text-center text-sm">
91 |         {browser.i18n.getMessage("dontHaveAccount")}{" "}
92 |         <a href="tabs.html#register" className="underline hover:no-underline">
93 |           {browser.i18n.getMessage("register")}
94 |         </a>
95 |       </div>
96 |     </Form>
97 |   );
98 | };
99 | 


--------------------------------------------------------------------------------
/src/components/auth/register.tsx:
--------------------------------------------------------------------------------
  1 | import { zodResolver } from "@hookform/resolvers/zod";
  2 | import { useMutation } from "@tanstack/react-query";
  3 | import { Loader2 } from "lucide-react";
  4 | import { useForm } from "react-hook-form";
  5 | import { toast } from "sonner";
  6 | import { browser } from "wxt/browser";
  7 | import { z } from "zod";
  8 | import { Button } from "~/components/ui/button";
  9 | import {
 10 |   Form,
 11 |   FormControl,
 12 |   FormField,
 13 |   FormItem,
 14 |   FormLabel,
 15 |   FormMessage,
 16 | } from "~/components/ui/form";
 17 | import { Input } from "~/components/ui/input";
 18 | import { supabase } from "~/lib/supabase";
 19 | 
 20 | const registerSchema = z.object({
 21 |   name: z.string().min(2),
 22 |   email: z.string().email(),
 23 |   password: z.string().min(8),
 24 | });
 25 | 
 26 | type RegisterData = z.infer<typeof registerSchema>;
 27 | 
 28 | export const Register = () => {
 29 |   const { mutate, isPending } = useMutation({
 30 |     mutationFn: async (data: RegisterData) => {
 31 |       const { error } = await supabase.auth.signUp(data);
 32 |       if (error) throw error;
 33 |     },
 34 |     onError: (error) => toast.error(error.message),
 35 |     onSuccess: () =>
 36 |       browser.tabs.update({
 37 |         url: "options.html",
 38 |       }),
 39 |   });
 40 | 
 41 |   const form = useForm<RegisterData>({
 42 |     resolver: zodResolver(registerSchema),
 43 |   });
 44 | 
 45 |   const onSubmit = (data: RegisterData) => {
 46 |     mutate(data);
 47 |   };
 48 | 
 49 |   return (
 50 |     <Form {...form}>
 51 |       <form
 52 |         onSubmit={form.handleSubmit(onSubmit)}
 53 |         className="flex flex-col gap-4"
 54 |       >
 55 |         <FormField
 56 |           control={form.control}
 57 |           name="name"
 58 |           render={({ field }) => (
 59 |             <FormItem>
 60 |               <FormLabel>{browser.i18n.getMessage("name")}</FormLabel>
 61 |               <FormControl>
 62 |                 <Input placeholder="John Doe" {...field} />
 63 |               </FormControl>
 64 |               <FormMessage />
 65 |             </FormItem>
 66 |           )}
 67 |         />
 68 | 
 69 |         <FormField
 70 |           control={form.control}
 71 |           name="email"
 72 |           render={({ field }) => (
 73 |             <FormItem>
 74 |               <FormLabel>{browser.i18n.getMessage("email")}</FormLabel>
 75 |               <FormControl>
 76 |                 <Input placeholder="email@example.com" {...field} />
 77 |               </FormControl>
 78 |               <FormMessage />
 79 |             </FormItem>
 80 |           )}
 81 |         />
 82 | 
 83 |         <FormField
 84 |           control={form.control}
 85 |           name="password"
 86 |           render={({ field }) => (
 87 |             <FormItem>
 88 |               <FormLabel>{browser.i18n.getMessage("password")}</FormLabel>
 89 |               <FormControl>
 90 |                 <Input type="password" placeholder="••••••••" {...field} />
 91 |               </FormControl>
 92 |               <FormMessage />
 93 |             </FormItem>
 94 |           )}
 95 |         />
 96 |         <Button type="submit" className="w-full mt-2" disabled={isPending}>
 97 |           {isPending ? (
 98 |             <Loader2 className="size-4 animate-spin" />
 99 |           ) : (
100 |             browser.i18n.getMessage("register")
101 |           )}
102 |         </Button>
103 |       </form>
104 | 
105 |       <div className="mt-4 text-center text-sm">
106 |         {browser.i18n.getMessage("alreadyHaveAccount")}{" "}
107 |         <a href="tabs.html#login" className="underline hover:no-underline">
108 |           {browser.i18n.getMessage("login")}
109 |         </a>
110 |       </div>
111 |     </Form>
112 |   );
113 | };
114 | 


--------------------------------------------------------------------------------
/src/components/auth/user.tsx:
--------------------------------------------------------------------------------
 1 | import { useQuery } from "@tanstack/react-query";
 2 | import { LogIn, UserRound } from "lucide-react";
 3 | import { browser } from "wxt/browser";
 4 | import { Message, sendMessage } from "~/lib/messaging";
 5 | 
 6 | import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
 7 | import { Button } from "~/components/ui/button";
 8 | import {
 9 |   DropdownMenu,
10 |   DropdownMenuContent,
11 |   DropdownMenuItem,
12 |   DropdownMenuLabel,
13 |   DropdownMenuSeparator,
14 |   DropdownMenuTrigger,
15 | } from "~/components/ui/dropdown-menu";
16 | import { supabase } from "~/lib/supabase";
17 | import { getAvatar, getName } from "~/lib/utils";
18 | 
19 | const AnonymousUser = () => {
20 |   return (
21 |     <Button
22 |       variant="outline"
23 |       size="icon"
24 |       className="rounded-full"
25 |       onClick={() => {
26 |         browser.tabs.create({
27 |           url: "tabs.html#login",
28 |         });
29 |       }}
30 |     >
31 |       <LogIn className="size-4" />
32 |     </Button>
33 |   );
34 | };
35 | 
36 | export const User = () => {
37 |   const { data } = useQuery({
38 |     queryKey: [Message.USER],
39 |     queryFn: () => sendMessage(Message.USER, undefined),
40 |   });
41 | 
42 |   if (!data) {
43 |     return <AnonymousUser />;
44 |   }
45 | 
46 |   const name = getName(data);
47 | 
48 |   return (
49 |     <DropdownMenu>
50 |       <DropdownMenuTrigger asChild>
51 |         <Button variant="outline" size="icon" className="rounded-full">
52 |           <Avatar className="size-10">
53 |             <AvatarImage src={getAvatar(data)} alt={name} />
54 |             <AvatarFallback>
55 |               <UserRound className="size-5" />
56 |             </AvatarFallback>
57 |           </Avatar>
58 |         </Button>
59 |       </DropdownMenuTrigger>
60 |       <DropdownMenuContent className="w-56" align="end">
61 |         <DropdownMenuLabel className="font-normal">
62 |           <div className="flex flex-col space-y-2">
63 |             {name && (
64 |               <p className="font-sans text-sm font-medium leading-none">
65 |                 {name}
66 |               </p>
67 |             )}
68 |             {data.email && (
69 |               <p className="font-sans text-xs leading-none text-muted-foreground">
70 |                 {data.email}
71 |               </p>
72 |             )}
73 |           </div>
74 |         </DropdownMenuLabel>
75 |         <DropdownMenuSeparator />
76 | 
77 |         <DropdownMenuItem className="cursor-pointer" asChild>
78 |           <button
79 |             type="button"
80 |             className="w-full"
81 |             onClick={() => supabase.auth.signOut()}
82 |           >
83 |             {browser.i18n.getMessage("logout")}
84 |           </button>
85 |         </DropdownMenuItem>
86 |       </DropdownMenuContent>
87 |     </DropdownMenu>
88 |   );
89 | };
90 | 


--------------------------------------------------------------------------------
/src/components/common/error-boundary.tsx:
--------------------------------------------------------------------------------
 1 | import { Component } from "react";
 2 | 
 3 | import type { ReactElement } from "react";
 4 | 
 5 | const ErrorContent = () => {
 6 |   return (
 7 |     <div className="flex w-full min-w-64 items-center justify-center px-10 py-16">
 8 |       <span className="text-center text-destructive">
 9 |         Something went wrong. Please try again later.
10 |       </span>
11 |     </div>
12 |   );
13 | };
14 | 
15 | class ReactErrorBoundary extends Component<
16 |   {
17 |     children: ReactElement;
18 |     fallback: ReactElement;
19 |   },
20 |   {
21 |     hasError: boolean;
22 |   }
23 | > {
24 |   state = { hasError: false };
25 | 
26 |   static getDerivedStateFromError() {
27 |     return { hasError: true };
28 |   }
29 | 
30 |   componentDidCatch(error: unknown, errorInfo: unknown) {
31 |     console.error(error, errorInfo);
32 |   }
33 | 
34 |   render() {
35 |     if (this.state.hasError) {
36 |       return this.props.fallback;
37 |     }
38 | 
39 |     return this.props.children;
40 |   }
41 | }
42 | 
43 | export const ErrorBoundary = ({
44 |   children,
45 |   fallback = <ErrorContent />,
46 | }: {
47 |   children: ReactElement;
48 |   fallback?: ReactElement;
49 | }) => {
50 |   return (
51 |     <ReactErrorBoundary fallback={fallback}>{children}</ReactErrorBoundary>
52 |   );
53 | };
54 | 


--------------------------------------------------------------------------------
/src/components/common/main.tsx:
--------------------------------------------------------------------------------
 1 | import { browser } from "wxt/browser";
 2 | 
 3 | import Logo from "~/assets/logo.svg?react";
 4 | import { cn } from "~/lib/utils";
 5 | 
 6 | interface MainProps {
 7 |   readonly className?: string;
 8 |   readonly filename: string;
 9 | }
10 | 
11 | export const Main = ({ className, filename }: MainProps) => {
12 |   return (
13 |     <main
14 |       className={cn(
15 |         "flex flex-col items-center justify-center gap-4",
16 |         className,
17 |       )}
18 |     >
19 |       <Logo className="w-24 animate-pulse text-primary" />
20 |       <p className="text-pretty text-center leading-tight">
21 |         {browser.i18n.getMessage("hello")}{" "}
22 |         <code className="inline-block rounded-sm bg-muted px-1.5 text-sm text-muted-foreground">
23 |           {filename}
24 |         </code>{" "}
25 |         👋
26 |       </p>
27 |       <a
28 |         href="https://turbostarter.dev/docs/extension"
29 |         target="_blank"
30 |         rel="noreferrer"
31 |         className="cursor-pointer text-sm text-primary underline hover:no-underline"
32 |       >
33 |         {browser.i18n.getMessage("learnMore")}
34 |       </a>
35 |     </main>
36 |   );
37 | };
38 | 


--------------------------------------------------------------------------------
/src/components/common/suspense.tsx:
--------------------------------------------------------------------------------
 1 | import { Loader2 } from "lucide-react";
 2 | import { Suspense as ReactSuspense } from "react";
 3 | 
 4 | import type { ReactElement } from "react";
 5 | 
 6 | const Loading = () => {
 7 |   return (
 8 |     <div className="flex w-full min-w-64 items-center justify-center py-16">
 9 |       <Loader2 className="animate-spin" />
10 |     </div>
11 |   );
12 | };
13 | 
14 | export const Suspense = ({
15 |   children,
16 |   fallback = <Loading />,
17 | }: {
18 |   children: ReactElement;
19 |   fallback?: ReactElement;
20 | }) => {
21 |   return <ReactSuspense fallback={fallback}>{children}</ReactSuspense>;
22 | };
23 | 


--------------------------------------------------------------------------------
/src/components/common/theme.tsx:
--------------------------------------------------------------------------------
 1 | "use client";
 2 | 
 3 | import { Moon, Sun } from "lucide-react";
 4 | import { memo } from "react";
 5 | import { browser } from "wxt/browser";
 6 | 
 7 | import { Button } from "~/components/ui/button";
 8 | import {
 9 |   DropdownMenu,
10 |   DropdownMenuContent,
11 |   DropdownMenuItem,
12 |   DropdownMenuTrigger,
13 | } from "~/components/ui/dropdown-menu";
14 | import { StorageKey, useStorage } from "~/lib/storage";
15 | import { cn } from "~/lib/utils";
16 | import { Theme } from "~/types";
17 | 
18 | type ThemeSwitchProps = {
19 |   readonly className?: string;
20 | };
21 | 
22 | export const ThemeSwitch = memo<ThemeSwitchProps>(({ className }) => {
23 |   const { set: setTheme } = useStorage(StorageKey.THEME);
24 | 
25 |   return (
26 |     <DropdownMenu>
27 |       <DropdownMenuTrigger asChild>
28 |         <Button
29 |           variant="outline"
30 |           size="icon"
31 |           className={cn("rounded-full", className)}
32 |         >
33 |           <Sun className="size-5 scale-100 dark:scale-0" />
34 |           <Moon className="absolute size-5 scale-0 dark:scale-100" />
35 |           <span className="sr-only">Toggle theme</span>
36 |         </Button>
37 |       </DropdownMenuTrigger>
38 |       <DropdownMenuContent align="end">
39 |         {Object.values(Theme).map((theme) => (
40 |           <DropdownMenuItem key={theme} onClick={() => setTheme(theme)}>
41 |             {browser.i18n.getMessage(theme)}
42 |           </DropdownMenuItem>
43 |         ))}
44 |       </DropdownMenuContent>
45 |     </DropdownMenu>
46 |   );
47 | });
48 | 
49 | ThemeSwitch.displayName = "ThemeSwitch";
50 | 


--------------------------------------------------------------------------------
/src/components/layout/footer.tsx:
--------------------------------------------------------------------------------
 1 | import { browser } from "wxt/browser";
 2 | 
 3 | import { buttonVariants } from "~/components/ui/button";
 4 | 
 5 | export const Footer = () => {
 6 |   return (
 7 |     <footer className="flex w-full justify-center gap-2">
 8 |       <a
 9 |         href="https://git.new/extro"
10 |         target="_blank"
11 |         rel="noreferrer noopener"
12 |         className={buttonVariants({
13 |           variant: "outline",
14 |           className: "w-[6.5rem]",
15 |         })}
16 |       >
17 |         {browser.i18n.getMessage("star")}{" "}
18 |         <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
19 |           <title>GitHub</title>
20 |           <path
21 |             fill="currentColor"
22 |             d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
23 |           />
24 |         </svg>
25 |       </a>
26 | 
27 |       <a
28 |         href="https://x.com/bzagrodzki"
29 |         target="_blank"
30 |         rel="noreferrer noopener"
31 |         className={buttonVariants({
32 |           variant: "outline",
33 |           className: "w-[6.5rem]",
34 |         })}
35 |       >
36 |         {browser.i18n.getMessage("follow")}{" "}
37 |         <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
38 |           <title>X</title>
39 |           <path
40 |             fill="currentColor"
41 |             d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
42 |           />
43 |         </svg>
44 |       </a>
45 |     </footer>
46 |   );
47 | };
48 | 


--------------------------------------------------------------------------------
/src/components/layout/header.tsx:
--------------------------------------------------------------------------------
 1 | import { Bot } from "lucide-react";
 2 | import { User } from "~/components/auth/user";
 3 | import { ThemeSwitch } from "~/components/common/theme";
 4 | import { buttonVariants } from "~/components/ui/button";
 5 | import { cn } from "~/lib/utils";
 6 | 
 7 | export const Header = () => {
 8 |   return (
 9 |     <header className="flex items-center justify-center gap-2">
10 |       <a
11 |         href="/tabs.html#ai"
12 |         target="_blank"
13 |         rel="noreferrer"
14 |         className={cn(
15 |           buttonVariants({
16 |             variant: "outline",
17 |             size: "icon",
18 |           }),
19 |           "rounded-full",
20 |         )}
21 |       >
22 |         <Bot className="size-5" />
23 |         <span className="sr-only">AI Demo</span>
24 |       </a>
25 |       <ThemeSwitch />
26 |       <User />
27 |     </header>
28 |   );
29 | };
30 | 


--------------------------------------------------------------------------------
/src/components/layout/layout.tsx:
--------------------------------------------------------------------------------
 1 | import { StorageKey, useStorage } from "@/lib/storage";
 2 | import { supabase } from "@/lib/supabase";
 3 | import { Theme } from "@/types";
 4 | import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
 5 | import { useEffect } from "react";
 6 | import { ErrorBoundary } from "~/components/common/error-boundary";
 7 | import { Suspense } from "~/components/common/suspense";
 8 | import { Footer } from "~/components/layout/footer";
 9 | import { Header } from "~/components/layout/header";
10 | import { Toaster } from "~/components/ui/sonner";
11 | import { Message } from "~/lib/messaging";
12 | import { cn } from "~/lib/utils";
13 | import "~/assets/styles/globals.css";
14 | 
15 | interface LayoutProps {
16 |   readonly children: React.ReactNode;
17 |   readonly loadingFallback?: React.ReactElement;
18 |   readonly errorFallback?: React.ReactElement;
19 |   readonly className?: string;
20 | }
21 | 
22 | const queryClient = new QueryClient();
23 | 
24 | export const Layout = ({
25 |   children,
26 |   loadingFallback,
27 |   errorFallback,
28 |   className,
29 | }: LayoutProps) => {
30 |   return (
31 |     <QueryClientProvider client={queryClient}>
32 |       <ErrorBoundary fallback={errorFallback}>
33 |         <Suspense fallback={loadingFallback}>
34 |           <LayoutContent className={className}>{children}</LayoutContent>
35 |         </Suspense>
36 |       </ErrorBoundary>
37 |     </QueryClientProvider>
38 |   );
39 | };
40 | 
41 | const LayoutContent = ({
42 |   children,
43 |   className,
44 | }: { readonly children: React.ReactNode; readonly className?: string }) => {
45 |   const { data: theme } = useStorage(StorageKey.THEME);
46 |   const { set: setUser } = useStorage(StorageKey.USER);
47 | 
48 |   useEffect(() => {
49 |     const { data } = supabase.auth.onAuthStateChange((_, session) => {
50 |       setUser(session?.user ?? null);
51 |       queryClient.invalidateQueries({ queryKey: [Message.USER] });
52 |     });
53 | 
54 |     return () => {
55 |       data.subscription.unsubscribe();
56 |     };
57 |   }, [setUser]);
58 | 
59 |   return (
60 |     <div
61 |       className={cn(
62 |         "flex min-h-screen bg-background text-foreground w-full min-w-[23rem] flex-col items-center justify-center font-sans text-base",
63 |         {
64 |           dark:
65 |             theme === Theme.DARK ||
66 |             (theme === Theme.SYSTEM &&
67 |               window.matchMedia("(prefers-color-scheme: dark)").matches),
68 |         },
69 |       )}
70 |     >
71 |       <div
72 |         className={cn(
73 |           "flex w-full max-w-[80rem] grow flex-col items-center justify-between gap-12 p-5",
74 |           className,
75 |         )}
76 |       >
77 |         <Header />
78 |         {children}
79 |         <Footer />
80 |       </div>
81 |       <Toaster />
82 |     </div>
83 |   );
84 | };
85 | 


--------------------------------------------------------------------------------
/src/components/ui/avatar.tsx:
--------------------------------------------------------------------------------
 1 | import * as AvatarPrimitive from "@radix-ui/react-avatar";
 2 | import * as React from "react";
 3 | 
 4 | import { cn } from "~/lib/utils";
 5 | 
 6 | const Avatar = React.forwardRef<
 7 |   React.ElementRef<typeof AvatarPrimitive.Root>,
 8 |   React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
 9 | >(({ className, ...props }, ref) => (
10 |   <AvatarPrimitive.Root
11 |     ref={ref}
12 |     className={cn(
13 |       "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
14 |       className,
15 |     )}
16 |     {...props}
17 |   />
18 | ));
19 | Avatar.displayName = AvatarPrimitive.Root.displayName;
20 | 
21 | const AvatarImage = React.forwardRef<
22 |   React.ElementRef<typeof AvatarPrimitive.Image>,
23 |   React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
24 | >(({ className, ...props }, ref) => (
25 |   <AvatarPrimitive.Image
26 |     ref={ref}
27 |     className={cn("aspect-square h-full w-full", className)}
28 |     {...props}
29 |   />
30 | ));
31 | AvatarImage.displayName = AvatarPrimitive.Image.displayName;
32 | 
33 | const AvatarFallback = React.forwardRef<
34 |   React.ElementRef<typeof AvatarPrimitive.Fallback>,
35 |   React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
36 | >(({ className, ...props }, ref) => (
37 |   <AvatarPrimitive.Fallback
38 |     ref={ref}
39 |     className={cn(
40 |       "flex h-full w-full items-center justify-center rounded-full",
41 |       className,
42 |     )}
43 |     {...props}
44 |   />
45 | ));
46 | AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;
47 | 
48 | export { Avatar, AvatarImage, AvatarFallback };
49 | 


--------------------------------------------------------------------------------
/src/components/ui/button.tsx:
--------------------------------------------------------------------------------
 1 | import { Slot } from "@radix-ui/react-slot";
 2 | import { type VariantProps, cva } from "class-variance-authority";
 3 | import * as React from "react";
 4 | 
 5 | import { cn } from "~/lib/utils";
 6 | 
 7 | const buttonVariants = cva(
 8 |   "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
 9 |   {
10 |     variants: {
11 |       variant: {
12 |         default: "bg-primary text-primary-foreground hover:bg-primary/90",
13 |         destructive:
14 |           "bg-destructive text-destructive-foreground hover:bg-destructive/90",
15 |         outline:
16 |           "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
17 |         secondary:
18 |           "bg-secondary text-secondary-foreground hover:bg-secondary/80",
19 |         ghost: "hover:bg-accent hover:text-accent-foreground",
20 |         link: "text-primary underline-offset-4 hover:underline",
21 |       },
22 |       size: {
23 |         default: "h-10 px-4 py-2",
24 |         sm: "h-9 rounded-md px-3",
25 |         lg: "h-11 rounded-md px-8",
26 |         icon: "h-10 w-10",
27 |       },
28 |     },
29 |     defaultVariants: {
30 |       variant: "default",
31 |       size: "default",
32 |     },
33 |   },
34 | );
35 | 
36 | export interface ButtonProps
37 |   extends React.ButtonHTMLAttributes<HTMLButtonElement>,
38 |     VariantProps<typeof buttonVariants> {
39 |   asChild?: boolean;
40 | }
41 | 
42 | const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
43 |   ({ className, variant, size, asChild = false, ...props }, ref) => {
44 |     const Comp = asChild ? Slot : "button";
45 |     return (
46 |       <Comp
47 |         className={cn(buttonVariants({ variant, size, className }))}
48 |         ref={ref}
49 |         {...props}
50 |       />
51 |     );
52 |   },
53 | );
54 | Button.displayName = "Button";
55 | 
56 | export { Button, buttonVariants };
57 | 


--------------------------------------------------------------------------------
/src/components/ui/card.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react";
 2 | 
 3 | import { cn } from "~/lib/utils";
 4 | 
 5 | const Card = React.forwardRef<
 6 |   HTMLDivElement,
 7 |   React.HTMLAttributes<HTMLDivElement>
 8 | >(({ className, ...props }, ref) => (
 9 |   <div
10 |     ref={ref}
11 |     className={cn(
12 |       "rounded-lg border bg-card text-card-foreground shadow-xs",
13 |       className,
14 |     )}
15 |     {...props}
16 |   />
17 | ));
18 | Card.displayName = "Card";
19 | 
20 | const CardHeader = React.forwardRef<
21 |   HTMLDivElement,
22 |   React.HTMLAttributes<HTMLDivElement>
23 | >(({ className, ...props }, ref) => (
24 |   <div
25 |     ref={ref}
26 |     className={cn("flex flex-col space-y-1.5 p-6", className)}
27 |     {...props}
28 |   />
29 | ));
30 | CardHeader.displayName = "CardHeader";
31 | 
32 | const CardTitle = React.forwardRef<
33 |   HTMLParagraphElement,
34 |   React.HTMLAttributes<HTMLHeadingElement>
35 | >(({ className, ...props }, ref) => (
36 |   <h3
37 |     ref={ref}
38 |     className={cn(
39 |       "text-2xl font-semibold leading-none tracking-tight",
40 |       className,
41 |     )}
42 |     {...props}
43 |   />
44 | ));
45 | CardTitle.displayName = "CardTitle";
46 | 
47 | const CardDescription = React.forwardRef<
48 |   HTMLParagraphElement,
49 |   React.HTMLAttributes<HTMLParagraphElement>
50 | >(({ className, ...props }, ref) => (
51 |   <p
52 |     ref={ref}
53 |     className={cn("text-sm text-muted-foreground", className)}
54 |     {...props}
55 |   />
56 | ));
57 | CardDescription.displayName = "CardDescription";
58 | 
59 | const CardContent = React.forwardRef<
60 |   HTMLDivElement,
61 |   React.HTMLAttributes<HTMLDivElement>
62 | >(({ className, ...props }, ref) => (
63 |   <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
64 | ));
65 | CardContent.displayName = "CardContent";
66 | 
67 | const CardFooter = React.forwardRef<
68 |   HTMLDivElement,
69 |   React.HTMLAttributes<HTMLDivElement>
70 | >(({ className, ...props }, ref) => (
71 |   <div
72 |     ref={ref}
73 |     className={cn("flex items-center p-6 pt-0", className)}
74 |     {...props}
75 |   />
76 | ));
77 | CardFooter.displayName = "CardFooter";
78 | 
79 | export {
80 |   Card,
81 |   CardHeader,
82 |   CardFooter,
83 |   CardTitle,
84 |   CardDescription,
85 |   CardContent,
86 | };
87 | 


--------------------------------------------------------------------------------
/src/components/ui/dropdown-menu.tsx:
--------------------------------------------------------------------------------
  1 | import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
  2 | import { Check, ChevronRight, Circle } from "lucide-react";
  3 | import * as React from "react";
  4 | 
  5 | import { cn } from "~/lib/utils";
  6 | 
  7 | const DropdownMenu = DropdownMenuPrimitive.Root;
  8 | 
  9 | const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
 10 | 
 11 | const DropdownMenuGroup = DropdownMenuPrimitive.Group;
 12 | 
 13 | const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
 14 | 
 15 | const DropdownMenuSub = DropdownMenuPrimitive.Sub;
 16 | 
 17 | const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;
 18 | 
 19 | const DropdownMenuSubTrigger = React.forwardRef<
 20 |   React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
 21 |   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
 22 |     inset?: boolean;
 23 |   }
 24 | >(({ className, inset, children, ...props }, ref) => (
 25 |   <DropdownMenuPrimitive.SubTrigger
 26 |     ref={ref}
 27 |     className={cn(
 28 |       "flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-hidden focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
 29 |       inset && "pl-8",
 30 |       className,
 31 |     )}
 32 |     {...props}
 33 |   >
 34 |     {children}
 35 |     <ChevronRight className="ml-auto" />
 36 |   </DropdownMenuPrimitive.SubTrigger>
 37 | ));
 38 | DropdownMenuSubTrigger.displayName =
 39 |   DropdownMenuPrimitive.SubTrigger.displayName;
 40 | 
 41 | const DropdownMenuSubContent = React.forwardRef<
 42 |   React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
 43 |   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
 44 | >(({ className, ...props }, ref) => (
 45 |   <DropdownMenuPrimitive.SubContent
 46 |     ref={ref}
 47 |     className={cn(
 48 |       "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
 49 |       className,
 50 |     )}
 51 |     {...props}
 52 |   />
 53 | ));
 54 | DropdownMenuSubContent.displayName =
 55 |   DropdownMenuPrimitive.SubContent.displayName;
 56 | 
 57 | const DropdownMenuContent = React.forwardRef<
 58 |   React.ElementRef<typeof DropdownMenuPrimitive.Content>,
 59 |   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
 60 | >(({ className, sideOffset = 4, ...props }, ref) => (
 61 |   <DropdownMenuPrimitive.Content
 62 |     ref={ref}
 63 |     sideOffset={sideOffset}
 64 |     className={cn(
 65 |       "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
 66 |       className,
 67 |     )}
 68 |     {...props}
 69 |   />
 70 | ));
 71 | DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
 72 | 
 73 | const DropdownMenuItem = React.forwardRef<
 74 |   React.ElementRef<typeof DropdownMenuPrimitive.Item>,
 75 |   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
 76 |     inset?: boolean;
 77 |   }
 78 | >(({ className, inset, ...props }, ref) => (
 79 |   <DropdownMenuPrimitive.Item
 80 |     ref={ref}
 81 |     className={cn(
 82 |       "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden transition-colors focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
 83 |       inset && "pl-8",
 84 |       className,
 85 |     )}
 86 |     {...props}
 87 |   />
 88 | ));
 89 | DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
 90 | 
 91 | const DropdownMenuCheckboxItem = React.forwardRef<
 92 |   React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
 93 |   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
 94 | >(({ className, children, checked, ...props }, ref) => (
 95 |   <DropdownMenuPrimitive.CheckboxItem
 96 |     ref={ref}
 97 |     className={cn(
 98 |       "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-hidden transition-colors focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
 99 |       className,
100 |     )}
101 |     checked={checked}
102 |     {...props}
103 |   >
104 |     <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
105 |       <DropdownMenuPrimitive.ItemIndicator>
106 |         <Check className="h-4 w-4" />
107 |       </DropdownMenuPrimitive.ItemIndicator>
108 |     </span>
109 |     {children}
110 |   </DropdownMenuPrimitive.CheckboxItem>
111 | ));
112 | DropdownMenuCheckboxItem.displayName =
113 |   DropdownMenuPrimitive.CheckboxItem.displayName;
114 | 
115 | const DropdownMenuRadioItem = React.forwardRef<
116 |   React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
117 |   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
118 | >(({ className, children, ...props }, ref) => (
119 |   <DropdownMenuPrimitive.RadioItem
120 |     ref={ref}
121 |     className={cn(
122 |       "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-hidden transition-colors focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
123 |       className,
124 |     )}
125 |     {...props}
126 |   >
127 |     <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
128 |       <DropdownMenuPrimitive.ItemIndicator>
129 |         <Circle className="h-2 w-2 fill-current" />
130 |       </DropdownMenuPrimitive.ItemIndicator>
131 |     </span>
132 |     {children}
133 |   </DropdownMenuPrimitive.RadioItem>
134 | ));
135 | DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
136 | 
137 | const DropdownMenuLabel = React.forwardRef<
138 |   React.ElementRef<typeof DropdownMenuPrimitive.Label>,
139 |   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
140 |     inset?: boolean;
141 |   }
142 | >(({ className, inset, ...props }, ref) => (
143 |   <DropdownMenuPrimitive.Label
144 |     ref={ref}
145 |     className={cn(
146 |       "px-2 py-1.5 text-sm font-semibold",
147 |       inset && "pl-8",
148 |       className,
149 |     )}
150 |     {...props}
151 |   />
152 | ));
153 | DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
154 | 
155 | const DropdownMenuSeparator = React.forwardRef<
156 |   React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
157 |   React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
158 | >(({ className, ...props }, ref) => (
159 |   <DropdownMenuPrimitive.Separator
160 |     ref={ref}
161 |     className={cn("-mx-1 my-1 h-px bg-muted", className)}
162 |     {...props}
163 |   />
164 | ));
165 | DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
166 | 
167 | const DropdownMenuShortcut = ({
168 |   className,
169 |   ...props
170 | }: React.HTMLAttributes<HTMLSpanElement>) => {
171 |   return (
172 |     <span
173 |       className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
174 |       {...props}
175 |     />
176 |   );
177 | };
178 | DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
179 | 
180 | export {
181 |   DropdownMenu,
182 |   DropdownMenuTrigger,
183 |   DropdownMenuContent,
184 |   DropdownMenuItem,
185 |   DropdownMenuCheckboxItem,
186 |   DropdownMenuRadioItem,
187 |   DropdownMenuLabel,
188 |   DropdownMenuSeparator,
189 |   DropdownMenuShortcut,
190 |   DropdownMenuGroup,
191 |   DropdownMenuPortal,
192 |   DropdownMenuSub,
193 |   DropdownMenuSubContent,
194 |   DropdownMenuSubTrigger,
195 |   DropdownMenuRadioGroup,
196 | };
197 | 


--------------------------------------------------------------------------------
/src/components/ui/form.tsx:
--------------------------------------------------------------------------------
  1 | import type * as LabelPrimitive from "@radix-ui/react-label";
  2 | import { Slot } from "@radix-ui/react-slot";
  3 | import * as React from "react";
  4 | import {
  5 |   Controller,
  6 |   type ControllerProps,
  7 |   type FieldPath,
  8 |   type FieldValues,
  9 |   FormProvider,
 10 |   useFormContext,
 11 | } from "react-hook-form";
 12 | 
 13 | import { Label } from "~/components/ui/label";
 14 | import { cn } from "~/lib/utils";
 15 | 
 16 | const Form = FormProvider;
 17 | 
 18 | type FormFieldContextValue<
 19 |   TFieldValues extends FieldValues = FieldValues,
 20 |   TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
 21 | > = {
 22 |   name: TName;
 23 | };
 24 | 
 25 | const FormFieldContext = React.createContext<FormFieldContextValue>(
 26 |   {} as FormFieldContextValue,
 27 | );
 28 | 
 29 | const FormField = <
 30 |   TFieldValues extends FieldValues = FieldValues,
 31 |   TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
 32 | >({
 33 |   ...props
 34 | }: ControllerProps<TFieldValues, TName>) => {
 35 |   return (
 36 |     <FormFieldContext.Provider value={{ name: props.name }}>
 37 |       <Controller {...props} />
 38 |     </FormFieldContext.Provider>
 39 |   );
 40 | };
 41 | 
 42 | const useFormField = () => {
 43 |   const fieldContext = React.useContext(FormFieldContext);
 44 |   const itemContext = React.useContext(FormItemContext);
 45 |   const { getFieldState, formState } = useFormContext();
 46 | 
 47 |   const fieldState = getFieldState(fieldContext.name, formState);
 48 | 
 49 |   if (!fieldContext) {
 50 |     throw new Error("useFormField should be used within <FormField>");
 51 |   }
 52 | 
 53 |   const { id } = itemContext;
 54 | 
 55 |   return {
 56 |     id,
 57 |     name: fieldContext.name,
 58 |     formItemId: `${id}-form-item`,
 59 |     formDescriptionId: `${id}-form-item-description`,
 60 |     formMessageId: `${id}-form-item-message`,
 61 |     ...fieldState,
 62 |   };
 63 | };
 64 | 
 65 | type FormItemContextValue = {
 66 |   id: string;
 67 | };
 68 | 
 69 | const FormItemContext = React.createContext<FormItemContextValue>(
 70 |   {} as FormItemContextValue,
 71 | );
 72 | 
 73 | const FormItem = React.forwardRef<
 74 |   HTMLDivElement,
 75 |   React.HTMLAttributes<HTMLDivElement>
 76 | >(({ className, ...props }, ref) => {
 77 |   const id = React.useId();
 78 | 
 79 |   return (
 80 |     <FormItemContext.Provider value={{ id }}>
 81 |       <div ref={ref} className={cn("space-y-2", className)} {...props} />
 82 |     </FormItemContext.Provider>
 83 |   );
 84 | });
 85 | FormItem.displayName = "FormItem";
 86 | 
 87 | const FormLabel = React.forwardRef<
 88 |   React.ElementRef<typeof LabelPrimitive.Root>,
 89 |   React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
 90 | >(({ className, ...props }, ref) => {
 91 |   const { error, formItemId } = useFormField();
 92 | 
 93 |   return (
 94 |     <Label
 95 |       ref={ref}
 96 |       className={cn(error && "text-destructive", className)}
 97 |       htmlFor={formItemId}
 98 |       {...props}
 99 |     />
100 |   );
101 | });
102 | FormLabel.displayName = "FormLabel";
103 | 
104 | const FormControl = React.forwardRef<
105 |   React.ElementRef<typeof Slot>,
106 |   React.ComponentPropsWithoutRef<typeof Slot>
107 | >(({ ...props }, ref) => {
108 |   const { error, formItemId, formDescriptionId, formMessageId } =
109 |     useFormField();
110 | 
111 |   return (
112 |     <Slot
113 |       ref={ref}
114 |       id={formItemId}
115 |       aria-describedby={
116 |         !error
117 |           ? `${formDescriptionId}`
118 |           : `${formDescriptionId} ${formMessageId}`
119 |       }
120 |       aria-invalid={!!error}
121 |       {...props}
122 |     />
123 |   );
124 | });
125 | FormControl.displayName = "FormControl";
126 | 
127 | const FormDescription = React.forwardRef<
128 |   HTMLParagraphElement,
129 |   React.HTMLAttributes<HTMLParagraphElement>
130 | >(({ className, ...props }, ref) => {
131 |   const { formDescriptionId } = useFormField();
132 | 
133 |   return (
134 |     <p
135 |       ref={ref}
136 |       id={formDescriptionId}
137 |       className={cn("text-sm text-muted-foreground", className)}
138 |       {...props}
139 |     />
140 |   );
141 | });
142 | FormDescription.displayName = "FormDescription";
143 | 
144 | const FormMessage = React.forwardRef<
145 |   HTMLParagraphElement,
146 |   React.HTMLAttributes<HTMLParagraphElement>
147 | >(({ className, children, ...props }, ref) => {
148 |   const { error, formMessageId } = useFormField();
149 |   const body = error ? String(error?.message) : children;
150 | 
151 |   if (!body) {
152 |     return null;
153 |   }
154 | 
155 |   return (
156 |     <p
157 |       ref={ref}
158 |       id={formMessageId}
159 |       className={cn("text-xs font-medium text-destructive", className)}
160 |       {...props}
161 |     >
162 |       {body}
163 |     </p>
164 |   );
165 | });
166 | FormMessage.displayName = "FormMessage";
167 | 
168 | export {
169 |   useFormField,
170 |   Form,
171 |   FormItem,
172 |   FormLabel,
173 |   FormControl,
174 |   FormDescription,
175 |   FormMessage,
176 |   FormField,
177 | };
178 | 


--------------------------------------------------------------------------------
/src/components/ui/input.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react";
 2 | 
 3 | import { cn } from "~/lib/utils";
 4 | 
 5 | export interface InputProps
 6 |   extends React.InputHTMLAttributes<HTMLInputElement> {}
 7 | 
 8 | const Input = React.forwardRef<HTMLInputElement, InputProps>(
 9 |   ({ className, type, ...props }, ref) => {
10 |     return (
11 |       <input
12 |         type={type}
13 |         className={cn(
14 |           "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
15 |           className,
16 |         )}
17 |         ref={ref}
18 |         {...props}
19 |       />
20 |     );
21 |   },
22 | );
23 | Input.displayName = "Input";
24 | 
25 | export { Input };
26 | 


--------------------------------------------------------------------------------
/src/components/ui/label.tsx:
--------------------------------------------------------------------------------
 1 | import * as LabelPrimitive from "@radix-ui/react-label";
 2 | import { type VariantProps, cva } from "class-variance-authority";
 3 | import * as React from "react";
 4 | 
 5 | import { cn } from "~/lib/utils";
 6 | 
 7 | const labelVariants = cva(
 8 |   "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
 9 | );
10 | 
11 | const Label = React.forwardRef<
12 |   React.ElementRef<typeof LabelPrimitive.Root>,
13 |   React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
14 |     VariantProps<typeof labelVariants>
15 | >(({ className, ...props }, ref) => (
16 |   <LabelPrimitive.Root
17 |     ref={ref}
18 |     className={cn(labelVariants(), className)}
19 |     {...props}
20 |   />
21 | ));
22 | Label.displayName = LabelPrimitive.Root.displayName;
23 | 
24 | export { Label };
25 | 


--------------------------------------------------------------------------------
/src/components/ui/scroll-area.tsx:
--------------------------------------------------------------------------------
 1 | import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
 2 | import * as React from "react";
 3 | 
 4 | import { cn } from "~/lib/utils";
 5 | 
 6 | const ScrollArea = React.forwardRef<
 7 |   React.ElementRef<typeof ScrollAreaPrimitive.Root>,
 8 |   React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
 9 | >(({ className, children, ...props }, ref) => (
10 |   <ScrollAreaPrimitive.Root
11 |     ref={ref}
12 |     className={cn("relative overflow-hidden", className)}
13 |     {...props}
14 |   >
15 |     <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
16 |       {children}
17 |     </ScrollAreaPrimitive.Viewport>
18 |     <ScrollBar />
19 |     <ScrollAreaPrimitive.Corner />
20 |   </ScrollAreaPrimitive.Root>
21 | ));
22 | ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;
23 | 
24 | const ScrollBar = React.forwardRef<
25 |   React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
26 |   React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
27 | >(({ className, orientation = "vertical", ...props }, ref) => (
28 |   <ScrollAreaPrimitive.ScrollAreaScrollbar
29 |     ref={ref}
30 |     orientation={orientation}
31 |     className={cn(
32 |       "flex touch-none select-none transition-colors",
33 |       orientation === "vertical" &&
34 |         "h-full w-2.5 border-l border-l-transparent p-[1px]",
35 |       orientation === "horizontal" &&
36 |         "h-2.5 flex-col border-t border-t-transparent p-[1px]",
37 |       className,
38 |     )}
39 |     {...props}
40 |   >
41 |     <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
42 |   </ScrollAreaPrimitive.ScrollAreaScrollbar>
43 | ));
44 | ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;
45 | 
46 | export { ScrollArea, ScrollBar };
47 | 


--------------------------------------------------------------------------------
/src/components/ui/separator.tsx:
--------------------------------------------------------------------------------
 1 | "use client";
 2 | 
 3 | import * as SeparatorPrimitive from "@radix-ui/react-separator";
 4 | import * as React from "react";
 5 | 
 6 | import { cn } from "~/lib/utils";
 7 | 
 8 | const Separator = React.forwardRef<
 9 |   React.ElementRef<typeof SeparatorPrimitive.Root>,
10 |   React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
11 | >(
12 |   (
13 |     { className, orientation = "horizontal", decorative = true, ...props },
14 |     ref,
15 |   ) => (
16 |     <SeparatorPrimitive.Root
17 |       ref={ref}
18 |       decorative={decorative}
19 |       orientation={orientation}
20 |       className={cn(
21 |         "shrink-0 bg-border",
22 |         orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
23 |         className,
24 |       )}
25 |       {...props}
26 |     />
27 |   ),
28 | );
29 | Separator.displayName = SeparatorPrimitive.Root.displayName;
30 | 
31 | export { Separator };
32 | 


--------------------------------------------------------------------------------
/src/components/ui/sonner.tsx:
--------------------------------------------------------------------------------
 1 | import { useTheme } from "next-themes";
 2 | import { Toaster as Sonner } from "sonner";
 3 | 
 4 | type ToasterProps = React.ComponentProps<typeof Sonner>;
 5 | 
 6 | const Toaster = ({ ...props }: ToasterProps) => {
 7 |   const { theme = "system" } = useTheme();
 8 | 
 9 |   return (
10 |     <Sonner
11 |       theme={theme as ToasterProps["theme"]}
12 |       className="toaster group"
13 |       toastOptions={{
14 |         classNames: {
15 |           toast:
16 |             "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
17 |           description: "group-[.toast]:text-muted-foreground",
18 |           actionButton:
19 |             "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
20 |           cancelButton:
21 |             "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
22 |         },
23 |       }}
24 |       {...props}
25 |     />
26 |   );
27 | };
28 | 
29 | export { Toaster };
30 | 


--------------------------------------------------------------------------------
/src/components/ui/textarea.tsx:
--------------------------------------------------------------------------------
 1 | import * as React from "react";
 2 | 
 3 | import { cn } from "~/lib/utils";
 4 | 
 5 | export interface TextareaProps
 6 |   extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
 7 | 
 8 | const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
 9 |   ({ className, ...props }, ref) => {
10 |     return (
11 |       <textarea
12 |         className={cn(
13 |           "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
14 |           className,
15 |         )}
16 |         ref={ref}
17 |         {...props}
18 |       />
19 |     );
20 |   },
21 | );
22 | Textarea.displayName = "Textarea";
23 | 
24 | export { Textarea };
25 | 


--------------------------------------------------------------------------------
/src/lib/analytics.ts:
--------------------------------------------------------------------------------
 1 | import { OpenPanel } from "@openpanel/web";
 2 | import env from "../../env.config";
 3 | 
 4 | export const { track } = new OpenPanel({
 5 |   clientId: env.VITE_OPEN_PANEL_KEY,
 6 |   trackScreenViews: true,
 7 |   trackOutgoingLinks: true,
 8 |   trackAttributes: true,
 9 | });
10 | 


--------------------------------------------------------------------------------
/src/lib/messaging.ts:
--------------------------------------------------------------------------------
 1 | import { defineExtensionMessaging } from "@webext-core/messaging";
 2 | import type { User } from "~/types";
 3 | 
 4 | export const Message = {
 5 |   USER: "user",
 6 | } as const;
 7 | 
 8 | export type Message = (typeof Message)[keyof typeof Message];
 9 | 
10 | interface Messages {
11 |   [Message.USER]: () => User | null;
12 | }
13 | 
14 | export const { sendMessage, onMessage } = defineExtensionMessaging<Messages>();
15 | 


--------------------------------------------------------------------------------
/src/lib/storage.ts:
--------------------------------------------------------------------------------
 1 | import { useEffect, useState } from "react";
 2 | import { Theme, type User } from "~/types";
 3 | import { type WxtStorageItem, storage as browserStorage } from "#imports";
 4 | 
 5 | export const StorageKey = {
 6 |   THEME: "local:theme",
 7 |   USER: "local:user",
 8 | } as const;
 9 | 
10 | export type StorageKey = (typeof StorageKey)[keyof typeof StorageKey];
11 | 
12 | const storage = {
13 |   [StorageKey.THEME]: browserStorage.defineItem<Theme>(StorageKey.THEME, {
14 |     fallback: Theme.SYSTEM,
15 |   }),
16 |   [StorageKey.USER]: browserStorage.defineItem<User | null>(StorageKey.USER, {
17 |     fallback: null,
18 |   }),
19 | } as const;
20 | 
21 | type Value<T extends StorageKey> = (typeof storage)[T] extends WxtStorageItem<
22 |   infer V,
23 |   infer _
24 | >
25 |   ? V
26 |   : never;
27 | 
28 | export const getStorage = <K extends StorageKey>(key: K) => {
29 |   return storage[key];
30 | };
31 | 
32 | export const useStorage = <K extends StorageKey>(key: K) => {
33 |   const item = storage[key] as WxtStorageItem<
34 |     Value<K>,
35 |     Record<string, unknown>
36 |   >;
37 |   const [value, setValue] = useState<Value<K> | null>(null);
38 | 
39 |   useEffect(() => {
40 |     const unwatch = item.watch((value) => {
41 |       setValue(value);
42 |     });
43 | 
44 |     return () => {
45 |       unwatch();
46 |     };
47 |   }, [item]);
48 | 
49 |   useEffect(() => {
50 |     (async () => {
51 |       const value = await item.getValue();
52 |       setValue(value);
53 |     })();
54 |   }, [item.getValue]);
55 | 
56 |   const remove = () => {
57 |     void item.removeValue();
58 |   };
59 | 
60 |   const set = (value: Value<K>) => {
61 |     void item.setValue(value);
62 |   };
63 | 
64 |   return { data: value ?? item.fallback, remove, set };
65 | };
66 | 


--------------------------------------------------------------------------------
/src/lib/supabase.ts:
--------------------------------------------------------------------------------
 1 | import { storage } from "#imports";
 2 | 
 3 | import { createClient } from "@supabase/supabase-js";
 4 | import env from "../../env.config";
 5 | 
 6 | const storageAdapter = {
 7 |   getItem: async (key: string) =>
 8 |     (await storage.getItem<string>(`local:${key}`)) || null,
 9 |   setItem: async (key: string, value: string) => {
10 |     await storage.setItem(`local:${key}`, value);
11 |   },
12 |   removeItem: (key: string) => storage.removeItem(`local:${key}`),
13 | };
14 | 
15 | export const supabase = createClient(
16 |   env.VITE_SUPABASE_URL,
17 |   env.VITE_SUPABASE_ANON_KEY,
18 |   {
19 |     auth: {
20 |       storage: storageAdapter,
21 |       autoRefreshToken: true,
22 |       persistSession: true,
23 |       detectSessionInUrl: true,
24 |     },
25 |   },
26 | );
27 | 


--------------------------------------------------------------------------------
/src/lib/tests/utils.test.ts:
--------------------------------------------------------------------------------
 1 | import { describe, expect, it } from "bun:test";
 2 | import { getAvatar, getName } from "~/lib/utils";
 3 | import type { User } from "~/types";
 4 | 
 5 | describe("getName", () => {
 6 |   it("returns user_metadata.name when available", () => {
 7 |     const user = {
 8 |       user_metadata: { name: "John Doe" },
 9 |       identities: [],
10 |     } as unknown as User;
11 | 
12 |     expect(getName(user)).toBe("John Doe");
13 |   });
14 | 
15 |   it("returns identity name when user_metadata.name is not available", () => {
16 |     const user = {
17 |       user_metadata: {},
18 |       identities: [{ identity_data: { name: "John Smith" } }],
19 |     } as unknown as User;
20 | 
21 |     expect(getName(user)).toBe("John Smith");
22 |   });
23 | 
24 |   it("returns name from email when no other name is available", () => {
25 |     const user = {
26 |       user_metadata: {},
27 |       identities: [],
28 |       email: "john.doe@example.com",
29 |     } as unknown as User;
30 | 
31 |     expect(getName(user)).toBe("john.doe");
32 |   });
33 | 
34 |   it("returns undefined when no name source is available", () => {
35 |     const user = {
36 |       user_metadata: {},
37 |       identities: [],
38 |     } as unknown as User;
39 | 
40 |     expect(getName(user)).toBeUndefined();
41 |   });
42 | });
43 | 
44 | describe("getAvatar", () => {
45 |   it("returns identity avatar_url when available", () => {
46 |     const avatarUrl = "https://example.com/avatar.jpg";
47 |     const user = {
48 |       user_metadata: {},
49 |       identities: [{ identity_data: { avatar_url: avatarUrl } }],
50 |     } as unknown as User;
51 | 
52 |     expect(getAvatar(user)).toBe(avatarUrl);
53 |   });
54 | 
55 |   it("returns user_metadata avatar_url when identity avatar is not available", () => {
56 |     const avatarUrl = "https://example.com/avatar.jpg";
57 |     const user = {
58 |       user_metadata: { avatar_url: avatarUrl },
59 |       identities: [],
60 |     } as unknown as User;
61 |     expect(getAvatar(user)).toBe(avatarUrl);
62 |   });
63 | 
64 |   it("returns undefined when no avatar is available", () => {
65 |     const user = {
66 |       user_metadata: {},
67 |       identities: [],
68 |     } as unknown as User;
69 |     expect(getAvatar(user)).toBeUndefined();
70 |   });
71 | });
72 | 


--------------------------------------------------------------------------------
/src/lib/utils.ts:
--------------------------------------------------------------------------------
 1 | import { type ClassValue, clsx } from "clsx";
 2 | import { twMerge } from "tailwind-merge";
 3 | import type { User } from "~/types";
 4 | 
 5 | export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
 6 | 
 7 | export const getName = (user: User) => {
 8 |   const identity = user.identities?.[0]?.identity_data;
 9 |   const name: unknown =
10 |     user.user_metadata.name ||
11 |     identity?.name ||
12 |     identity?.full_name ||
13 |     identity?.user_name ||
14 |     identity?.preferred_username;
15 | 
16 |   const nameFromEmail = user.email?.split("@")[0];
17 | 
18 |   return typeof name === "string"
19 |     ? name
20 |     : nameFromEmail
21 |       ? nameFromEmail
22 |       : undefined;
23 | };
24 | 
25 | export const getAvatar = (user: User) => {
26 |   const identity = user.identities?.[0]?.identity_data;
27 | 
28 |   const avatar: unknown = identity?.avatar_url || user.user_metadata.avatar_url;
29 | 
30 |   return typeof avatar === "string" ? avatar : undefined;
31 | };
32 | 


--------------------------------------------------------------------------------
/src/types/index.ts:
--------------------------------------------------------------------------------
 1 | export const Theme = {
 2 |   LIGHT: "light",
 3 |   DARK: "dark",
 4 |   SYSTEM: "system",
 5 | } as const;
 6 | 
 7 | export const NodeEnv = {
 8 |   DEVELOPMENT: "development",
 9 |   PRODUCTION: "production",
10 | } as const;
11 | 
12 | export type Theme = (typeof Theme)[keyof typeof Theme];
13 | export type NodeEnv = (typeof NodeEnv)[keyof typeof NodeEnv];
14 | 
15 | export type { User } from "@supabase/supabase-js";
16 | 


--------------------------------------------------------------------------------
/src/typings/custom.d.ts:
--------------------------------------------------------------------------------
1 | /// <reference types="vite-plugin-svgr/client" />
2 | 


--------------------------------------------------------------------------------
/src/typings/reset.d.ts:
--------------------------------------------------------------------------------
1 | // Do not add any other lines of code to this file!
2 | import "@total-typescript/ts-reset";
3 | 


--------------------------------------------------------------------------------
/tsconfig.json:
--------------------------------------------------------------------------------
 1 | {
 2 |   "extends": "./.wxt/tsconfig.json",
 3 |   "compilerOptions": {
 4 |     "lib": ["es2022", "dom", "dom.iterable"],
 5 |     "jsx": "preserve",
 6 |     "esModuleInterop": true,
 7 |     "skipLibCheck": true,
 8 |     "target": "ES2022",
 9 |     "allowJs": true,
10 |     "resolveJsonModule": true,
11 |     "moduleDetection": "force",
12 |     "isolatedModules": true,
13 | 
14 |     "incremental": true,
15 |     "disableSourceOfProjectReferenceRedirect": true,
16 | 
17 |     "noUncheckedIndexedAccess": true,
18 |     "checkJs": true,
19 | 
20 |     "module": "Preserve",
21 |     "moduleResolution": "Bundler",
22 |     "noEmit": true
23 |   },
24 |   "include": [".wxt/wxt.d.ts", "src", "*.ts", "*.js"],
25 |   "exclude": ["node_modules"]
26 | }
27 | 


--------------------------------------------------------------------------------
/wxt.config.ts:
--------------------------------------------------------------------------------
 1 | import tailwindcss from "@tailwindcss/vite";
 2 | import svgr from "vite-plugin-svgr";
 3 | import { type WxtViteConfig, defineConfig } from "wxt";
 4 | 
 5 | export default defineConfig({
 6 |   manifest: {
 7 |     name: "__MSG_extensionName__",
 8 |     description: "__MSG_extensionDescription__",
 9 |     default_locale: "en",
10 |     permissions: ["storage", "sidePanel", "scripting"],
11 |     host_permissions: ["<all_urls>"],
12 |   },
13 |   srcDir: "src",
14 |   entrypointsDir: "app",
15 |   outDir: "build",
16 |   modules: ["@wxt-dev/module-react", "@wxt-dev/auto-icons"],
17 |   imports: false,
18 |   vite: () =>
19 |     ({
20 |       plugins: [svgr(), tailwindcss()],
21 |     }) as WxtViteConfig,
22 |   webExt: {
23 |     chromiumArgs: ["--disable-features=DisableLoadExtensionCommandLineSwitch"],
24 |   },
25 | });
26 | 


--------------------------------------------------------------------------------