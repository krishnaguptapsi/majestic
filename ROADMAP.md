# Majestic Upgrade & Enhancement Roadmap

This document provides 100% detailed instructions for upgrading the Majestic codebase to modern dependencies and adding new Jest command features.

---

## Table of Contents

1. [Current State Analysis](#1-current-state-analysis)
2. [Phase 1 — Node & Engine Upgrade](#2-phase-1--node--engine-upgrade) ✅ **COMPLETED**
3. [Phase 2 — Build Tooling Upgrade](#3-phase-2--build-tooling-upgrade) ✅ **COMPLETED**
4. [Phase 3 — TypeScript Upgrade](#4-phase-3--typescript-upgrade) ✅ **COMPLETED**
5. [Phase 4 — Package Manager Migration (Yarn → pnpm)](#5-phase-4--package-manager-migration-yarn--pnpm) ✅ **COMPLETED**
6. [Phase 5 — React & UI Dependencies](#6-phase-5--react--ui-dependencies) ✅ **COMPLETED**
7. [Phase 6 — Server Dependencies](#7-phase-6--server-dependencies) ✅ **COMPLETED**
8. [Phase 7 — Code Fixes Required by Upgrades](#8-phase-7--code-fixes-required-by-upgrades) ✅ **COMPLETED**
9. [Phase 8 — New Jest Commands](#9-phase-8--new-jest-commands)
10. [Execution Checklist](#10-execution-checklist)

---

## 1. Current State Analysis

### Key files and their roles

| File | Role |
|------|------|
| `server/index.ts` | Entry point — starts GraphQL server via `graphql-yoga` |
| `server/api/index.ts` | Builds GraphQL schema via `type-graphql` |
| `server/api/runner/resolver.ts` | All Jest run mutations (run, stop, watch, coverage, snapshot) |
| `server/api/workspace/resolver.ts` | File tree, test results, summary subscriptions |
| `server/api/app/resolver.ts` | File selection, open-in-editor mutations |
| `server/services/jest-manager/index.ts` | Spawns and manages the Jest child process |
| `server/services/jest-manager/cli-args.ts` | Jest CLI flag constants |
| `server/services/config-resolver.ts` | Reads majestic config from package.json |
| `server/services/result-handler-api.ts` | Express REST endpoints that receive Jest reporter data |
| `ui/apollo-client.ts` | Apollo Client v2 setup with WS + HTTP split link |
| `ui/container.tsx` | Root React component — dual ApolloProvider (react-apollo + react-apollo-hooks) |
| `ui/app.tsx` | Main layout — SplitPane, Sidebar, TestFile panel |
| `ui/sidebar/index.tsx` | Left panel — run controls, watch, coverage, file tree |
| `ui/test-file/index.tsx` | Right panel — test items, results, console, errors |
| `scripts/webpack.ui.config.js` | Webpack 4 config for UI bundle |
| `scripts/webpack.server.config.js` | Webpack 4 config for server bundle |
| `tsconfig.json` | TypeScript config for UI (module: es2015) |
| `tsconfig.server.json` | TypeScript config for server (module: commonjs) |
| `.babelrc` | Babel config used by babel-loader for UI |
| `nodemon.json` | Nodemon config for dev server watch |

### Critical problems in current state

- `graphql` is pinned to `^0.13.0` via `resolutions` — blocks all modern GraphQL packages
- `react-apollo-hooks` is a separate abandoned package — merged into `@apollo/client` v3
- `apollo-client-preset` is deprecated — replaced by `@apollo/client`
- `awesome-typescript-loader` is abandoned — replaced by `ts-loader`
- `new Buffer()` in `jest-manager/index.ts` is deprecated since Node 6
- `ReactDOM.render()` in `ui/index.tsx` is deprecated in React 18
- `webpack.HotModuleReplacementPlugin` removed in Webpack 5
- `contentBase` in webpack-dev-server config renamed to `static` in v4
- `html-webpack-template` + `inject: false` pattern incompatible with HtmlWebpackPlugin v5
- `@babel/polyfill` is deprecated — replaced by `core-js` + `regenerator-runtime`
- `node-fetch` v2 CJS vs v3 ESM conflict with Node 18 native fetch
- `read-pkg-up` v4 is CJS — v8+ is ESM only, must stay on v7 or use dynamic import
- `get-port` v4 — v7+ is ESM only, must stay on v5 or use dynamic import
- `engines.node` set to `>=7.10.1` — must be updated to `>=18.0.0`

---

## 2. Phase 1 — Node & Engine Upgrade

### Goal
Update the minimum Node.js requirement to v18 LTS and fix all Node-version-sensitive code.

### Step 1.1 — Update `package.json` engines field

**File:** `package.json`

Change:
```json
"engines": {
  "node": ">=7.10.1"
}
```
To:
```json
"engines": {
  "node": ">=18.0.0"
}
```

### Step 1.2 — Update `.nvmrc`

**File:** `.nvmrc`

Set contents to:
```
18
```

### Step 1.3 — Fix deprecated `new Buffer()` call

**File:** `server/services/jest-manager/index.ts` — line ~80 inside `switchToAnotherFile()`

Change:
```ts
this.process.stdin.write(new Buffer("0d", "hex").toString())
```
To:
```ts
this.process.stdin.write(Buffer.from("0d", "hex").toString())
```

`new Buffer()` has been deprecated since Node 6 and removed in Node 10+. `Buffer.from()` is the correct replacement.

### Step 1.4 — Update GitHub Actions workflow

**File:** `.github/workflows/nodejs.yml`

Update the `node-version` matrix to include `[18, 20]` and remove any versions below 18.

---

## 3. Phase 2 — Build Tooling Upgrade

### Goal
Upgrade from Webpack 4 to Webpack 5, replace abandoned loaders, and simplify the build config.

### Step 2.1 — Remove old build packages

Run:
```bash
yarn remove awesome-typescript-loader uglifyjs-webpack-plugin html-webpack-template html-webpack-include-assets-plugin file-loader url-loader copy-webpack-plugin css-loader style-loader webpack webpack-cli webpack-dev-server babel-loader
```

### Step 2.2 — Install new build packages

Run:
```bash
yarn add -D webpack@^5.91.0 webpack-cli@^5.1.4 webpack-dev-server@^5.0.4 babel-loader@^9.1.3 ts-loader@^9.5.1 css-loader@^7.1.1 style-loader@^4.0.0 copy-webpack-plugin@^12.0.2 html-webpack-plugin@^5.6.0 mini-css-extract-plugin@^2.9.0
```

### Step 2.3 — Update `scripts/webpack.ui.config.js`

Replace the entire file with:

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = env => ({
  entry: './ui/index.tsx',
  mode: env.production ? 'production' : 'development',
  output: {
    path: path.resolve(__dirname, '../dist/ui'),
    filename: 'ui.bundle.js',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  devServer: {
    static: path.resolve(__dirname, '../dist/ui'),
    hot: true,
    port: 9000,
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        type: 'asset/inline',
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
      {
        test: /\.(png|svg|jpg|gif|ico)$/,
        type: 'asset/resource',
        generator: {
          filename: '[name][ext]',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Majestic',
      template: path.resolve(__dirname, '../ui/index.html'),
      favicon: './ui/assets/favicon.ico',
    }),
    new webpack.DefinePlugin({
      PRODUCTION: env.production === true,
    }),
  ],
});
```

Key changes from Webpack 4 config:
- `contentBase` → `static` in devServer
- `file-loader` + `url-loader` → native `asset/resource` and `asset/inline`
- `HotModuleReplacementPlugin` removed — `hot: true` in devServer is sufficient in Webpack 5
- `html-webpack-template` + `inject: false` → standard template file
- `output.clean: true` replaces `rimraf` pre-build step

### Step 2.4 — Create `ui/index.html` template

Create a new file `ui/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><%= htmlWebpackPlugin.options.title %></title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

### Step 2.5 — Update `scripts/webpack.server.config.js`

Replace `awesome-typescript-loader` with `ts-loader` and update `CopyPlugin` syntax:

```js
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = env => ({
  entry: './server/index.ts',
  mode: 'production',
  target: 'node',
  output: {
    path: path.resolve(__dirname, '../dist/server'),
    filename: 'index.js',
    libraryTarget: 'commonjs2',
    clean: true,
  },
  resolve: {
    mainFields: ['main'],
    extensions: ['.ts', '.js'],
  },
  optimization: {
    minimize: false,
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          configFile: './tsconfig.server.json',
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: true,
    }),
    new CopyPlugin({
      patterns: [
        { from: './server/services/jest-manager/scripts', to: './scripts' },
      ],
    }),
    new webpack.BannerPlugin({
      banner: '#!/usr/bin/env node',
      raw: true,
    }),
  ],
  externals: ['read-pkg-up', 'open'],
  node: {
    __dirname: false,
  },
});
```

Key changes:
- `awesome-typescript-loader` → `ts-loader`
- `CopyPlugin` array syntax → object `{ patterns: [] }` syntax (v6+ breaking change)
- `output.clean: true` added

### Step 2.6 — Update `.babelrc`

Replace `@babel/polyfill` (deprecated) with `core-js`:

```json
{
  "presets": [
    "@babel/preset-react",
    [
      "@babel/preset-typescript",
      {
        "isTSX": true,
        "allExtensions": true
      }
    ],
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",
        "corejs": 3
      }
    ]
  ],
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "loose": true }],
    "@babel/plugin-proposal-object-rest-spread",
    "babel-plugin-styled-components"
  ]
}
```

Install `core-js`:
```bash
yarn add core-js@^3.37.0
yarn remove @babel/polyfill
```

### Step 2.7 — Update `package.json` scripts

The `build-ui` script currently uses `rimraf dist &&` before webpack. With `output.clean: true` in Webpack 5, this is no longer needed:

```json
"build-ui": "cross-env BABEL_ENV='production' webpack --env production --config ./scripts/webpack.ui.config.js"
```

Also update `webpack-dev-server` invocation — the `--env.development` flag syntax changed in Webpack 5:

```json
"ui": "webpack serve --env development --config ./scripts/webpack.ui.config.js"
```

And server build:
```json
"build-server": "cross-env BABEL_ENV='production' webpack --env production --config ./scripts/webpack.server.config.js"
```

---

## 4. Phase 3 — TypeScript Upgrade

### Goal
Upgrade TypeScript from v3 to v5 and update both tsconfig files accordingly.

### Step 3.1 — Upgrade TypeScript and related packages

Run:
```bash
yarn remove typescript awesome-typescript-loader @types/babel-traverse @types/chokidar @types/react-split-pane
yarn add -D typescript@^5.4.5 ts-node@^10.9.2 @types/react@^18.3.3 @types/react-dom@^18.3.0 @types/express@^4.17.21 @types/istanbul-lib-coverage@^2.0.6 @types/istanbul-lib-source-maps@^4.0.4 @types/styled-components@^5.1.34 @types/styled-system@^5.1.22
```

Notes:
- `@types/babel-traverse` removed — `@babel/traverse` v7 ships its own types
- `@types/chokidar` removed — `chokidar` v3 ships its own types
- `@types/react-split-pane` removed — component will be replaced (see Phase 5)

### Step 3.2 — Update `tsconfig.json` (UI)

```json
{
  "compilerOptions": {
    "module": "es2020",
    "allowSyntheticDefaultImports": true,
    "target": "es2017",
    "lib": ["es2020", "dom"],
    "sourceMap": true,
    "allowJs": true,
    "jsx": "react-jsx",
    "moduleResolution": "node",
    "forceConsistentCasingInFileNames": true,
    "noImplicitReturns": false,
    "noImplicitThis": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "suppressImplicitAnyIndexErrors": true,
    "noUnusedLocals": false,
    "experimentalDecorators": true,
    "skipLibCheck": true,
    "emitDecoratorMetadata": true,
    "resolveJsonModule": true
  },
  "exclude": ["node_modules", "dist"]
}
```

Key changes:
- `module: "es2015"` → `"es2020"`
- `target: "es5"` → `"es2017"` (Node 18 supports ES2017+ natively)
- `lib` simplified to `["es2020", "dom"]`
- `jsx: "react"` → `"react-jsx"` (no longer need to import React in every file)

### Step 3.3 — Update `tsconfig.server.json`

```json
{
  "compilerOptions": {
    "rootDir": "./server",
    "outDir": "./dist/server",
    "module": "commonjs",
    "target": "es2020",
    "lib": ["es2020", "esnext.asynciterable"],
    "sourceMap": true,
    "allowJs": true,
    "moduleResolution": "node",
    "forceConsistentCasingInFileNames": true,
    "noImplicitReturns": false,
    "noImplicitThis": true,
    "noImplicitAny": false,
    "strictNullChecks": false,
    "suppressImplicitAnyIndexErrors": true,
    "noUnusedLocals": false,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "skipLibCheck": true,
    "newLine": "LF",
    "resolveJsonModule": true
  },
  "include": ["server"]
}
```

Key changes:
- `target: "es2016"` → `"es2020"`
- `lib` simplified — `"dom"` removed (server has no DOM)

### Step 3.4 — Update `nodemon.json`

`ts-node` v10 changed the project flag syntax:

```json
{
  "ignore": [".git", "node_modules"],
  "watch": ["server"],
  "exec": "ts-node --project tsconfig.server.json ./server/index.ts",
  "ext": "ts"
}
```

---

## 5. Phase 4 — Package Manager Migration (Yarn → pnpm)

### Goal
Migrate from Yarn v1 to pnpm for better disk space efficiency, faster installation times, and monorepo support.

### Why pnpm?

- **Disk space**: pnpm uses a content-addressable store, reducing disk usage by up to 80%
- **Speed**: Significantly faster installation compared to Yarn v1
- **Strict dependency resolution**: Prevents phantom dependencies
- **Workspace support**: Better support for monorepos (future-proofing)
- **Lock file**: Smaller, more readable `pnpm-lock.yaml` compared to `yarn.lock`

### Step 4.1 — Install pnpm

Run:
```bash
npm install -g pnpm@latest
```

Or verify pnpm is installed:
```bash
pnpm --version
```

pnpm v9+ is recommended (latest stable).

### Step 4.2 — Update `package.json` to enforce pnpm

Add a `packageManager` field to specify the required version and manager:

```json
{
  "packageManager": "pnpm@9.x.x"
}
```

This ensures all developers and CI use the same pnpm version.

### Step 4.3 — Create `.pnpmrc` configuration file

Create a new file `.pnpmrc` in the root to configure pnpm behavior:

```ini
# Use the same node_modules structure as Yarn/npm for compatibility
node-linker=hoisted

# Use store in .pnpm folder (optional, for better CI caching)
# store-dir=.pnpm

# Shamefully hoist everything (legacy compatibility)
shamefully-hoist=true
```

**Note:** The `shamefully-hoist=true` and `node-linker=hoisted` settings make pnpm behave like Yarn/npm, flattening `node_modules`. This maintains compatibility with the existing codebase without requiring code changes. Once the project is fully updated, these can be removed for pnpm's strict mode.

### Step 4.4 — Migrate lockfile

Remove the old Yarn lockfile and generate the new pnpm lockfile:

```bash
# Delete the old lockfile
rm yarn.lock

# Clean node_modules to start fresh
rm -rf node_modules

# Install dependencies with pnpm
pnpm install
```

This generates a new `pnpm-lock.yaml` file with all dependencies pinned.

### Step 4.5 — Update `package.json` `files` field

The current `files` field includes `yarn.lock`. Update it for pnpm:

```json
{
  "files": [
    "/dist/**",
    "pnpm-lock.yaml"
  ]
}
```

### Step 4.6 — Update GitHub workflows to use pnpm

**File:** `.github/workflows/ci.yml`

Add pnpm setup before `yarn install`:

```yaml
- name: Setup pnpm
  uses: pnpm/action-setup@v2
  with:
    version: 9.x.x

- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: ${{ matrix.node-version }}
    cache: 'pnpm'

- name: Install dependencies
  run: pnpm install --frozen-lockfile
```

Replace all `yarn` commands with `pnpm`:

```yaml
# Old
yarn install --frozen-lockfile
yarn prod
yarn integration

# New
pnpm install --frozen-lockfile
pnpm prod
pnpm integration
```

### Step 4.7 — Update CI/CD integration workflow

**File:** `.github/workflows/ci.yml` — integration job

```yaml
- name: Install integration dependencies
  run: cd ./integration && pnpm install

- name: Run integration tests
  run: cd ./integration && pnpm run-in-ci
```

### Step 4.8 — Update release workflow

**File:** `.github/workflows/release.yml`

Add pnpm setup and use `pnpm publish`:

```yaml
- name: Setup pnpm
  uses: pnpm/action-setup@v2

- name: Install dependencies
  run: pnpm install --frozen-lockfile

- name: Build
  run: pnpm prod

- name: Publish to npm
  run: pnpm publish --provenance
  env:
    NPM_CONFIG_PROVENANCE: true
```

### Step 4.9 — Update `integration/package.json`

The integration tests have their own `package.json`. Update it similarly:

```json
{
  "packageManager": "pnpm@9.x.x"
}
```

And regenerate the lock file:

```bash
cd ./integration
rm yarn.lock
pnpm install
```

### Step 4.10 — Update development documentation

**File:** `README.md` or `CONTRIBUTING.md`

Update installation instructions:

```markdown
### Setup

1. Install pnpm globally:
   ```bash
   npm install -g pnpm
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm ui      # UI dev server
   pnpm server  # Server in another terminal
   ```

4. Build for production:
   ```bash
   pnpm prod
   ```
```

### Step 4.11 — Commit and document

Commit all migration changes:

```bash
git add .
git commit -m "chore: migrate from yarn to pnpm"
```

Update `CHANGELOG.md` or release notes to document the migration:

```markdown
## Migration Notes

- **Package Manager**: Migrated from Yarn v1 to pnpm v9 for better performance and disk efficiency
- **No breaking changes**: All scripts and dependencies remain the same
- **Local setup**: Developers should install pnpm globally: `npm install -g pnpm`
```

### Benefits after migration

- Installation time reduced by ~40-60%
- Disk space reduced by ~50-70%
- Faster CI builds with better caching
- Stricter dependency resolution prevents bugs
- Future-proof for monorepo patterns

---

## 6. Phase 5 — React & UI Dependencies

### Goal
Upgrade React to v18, replace unmaintained UI packages, and fix React 18 breaking changes.

### Step 5.1 — Upgrade React

Run:
```bash
pnpm remove react react-dom react-split-pane react-tippy react-spring react-feather react-inspector react-apollo react-apollo-hooks
pnpm add react@^18.3.1 react-dom@^18.3.1 react-resizable-panels@^2.0.19 @tippyjs/react@^4.2.6 @react-spring/web@^9.7.3 react-feather@^2.0.10 react-inspector@^6.0.2
```

Package mapping:
- `react-split-pane` (unmaintained) → `react-resizable-panels`
- `react-tippy` (unmaintained) → `@tippyjs/react` v4
- `react-spring` v8 → `@react-spring/web` v9 (scoped package, new API)
- `react-feather` v1 → v2 (same API, just updated icons)
- `react-inspector` v3 → v6

### Step 5.2 — Fix `ui/index.tsx` for React 18

React 18 requires `createRoot` instead of `ReactDOM.render`. Also remove `@babel/polyfill`:

```tsx
import React from "react";
import { createRoot } from "react-dom/client";
import Container from "./container";
import "@tippyjs/react/dist/tippy.css";

const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);
root.render(<Container />);

if ((module as any).hot) {
  (module as any).hot.accept("./container", () => {
    root.render(<Container />);
  });
}
```

Note: `"react-tippy/dist/tippy.css"` import should be replaced with `@tippyjs/react` CSS:
```tsx
import "@tippyjs/react/dist/tippy.css";
```

### Step 5.3 — Replace `react-tippy` with `@tippyjs/react`

**File:** `ui/sidebar/index.tsx`

Change import:
```ts
// Remove
import { Tooltip } from "react-tippy";
// Add
import Tippy from "@tippyjs/react";
```

Replace all `<Tooltip title="..." position="bottom" size="small">` usages with:
```tsx
<Tippy content="..." placement="bottom">
  <span>...</span>
</Tippy>
```

Note: `@tippyjs/react` requires the child to be a DOM element or a `forwardRef` component. Wrap `<Button>` children in a `<span>` if Button does not forward refs.

### Step 5.4 — Replace `react-split-pane` with `react-resizable-panels`

**File:** `ui/app.tsx`

Change import:
```ts
// Remove
import SplitPane from "react-split-pane";
// Add
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
```

Replace the `<SplitPane>` usage:
```tsx
// Old
<SplitPane
  defaultSize={"calc(100% - 300px)"}
  split="vertical"
  primary="second"
  pane1Style={{ minWidth: "300px" }}
  pane2Style={{ maxWidth: "calc(100% - 300px)" }}
>
  <Sidebar ... />
  <TestFile ... />
</SplitPane>

// New
<PanelGroup direction="horizontal">
  <Panel defaultSize={25} minSize={20}>
    <Sidebar ... />
  </Panel>
  <PanelResizeHandle style={{ width: 4, background: "#333", cursor: "col-resize" }} />
  <Panel defaultSize={75}>
    {showCoverage && <CoveragePanel />}
    {selectedFile ? <TestFile ... /> : <PlaceHolder bg="dark" />}
  </Panel>
</PanelGroup>
```

Also remove `split-panel-style.ts` CSS import from `container.tsx` as it was only for `react-split-pane` styles.

### Step 5.5 — Update `react-spring` usage

`@react-spring/web` v9 has a different import path. Search the codebase for any `react-spring` imports:

```bash
grep -r "react-spring" ui/
```

For each usage, change:
```ts
import { useSpring, animated } from "react-spring";
// to
import { useSpring, animated } from "@react-spring/web";
```

The animation API is mostly the same in v9 but `config` presets moved to `@react-spring/core`.

### Step 5.6 — Upgrade `styled-components` and `styled-system`

Run:
```bash
pnpm remove styled-components styled-system babel-plugin-styled-components
pnpm add styled-components@^6.1.11 @styled-system/css@^5.1.5
pnpm add -D babel-plugin-styled-components@^2.1.4
```

`styled-components` v6 breaking changes to address:

1. The `<any>` generic on styled components is no longer needed for basic props — remove `styled.div<any>` patterns and use proper prop interfaces instead.

2. `createGlobalStyle` API is unchanged.

3. `ThemeProvider` is unchanged.

4. The `css` helper import path changed — if used anywhere:
```ts
// Old
import styled, { css } from "styled-components";
// New — same, no change needed
```

`styled-system` v5 (`@styled-system/css`) — the `space` and `color` helper imports are unchanged. The package is now `@styled-system/css` for the css helper but `styled-system` v5 still works for `space`, `color`, etc.

### Step 5.7 — Upgrade remaining UI packages

Run:
```bash
pnpm remove ansi-to-html react-virtualized-auto-sizer react-window
pnpm add ansi-to-html@^0.7.2 react-virtualized-auto-sizer@^1.0.24 react-window@^1.8.10
```

These are minor version bumps with no breaking changes.

---

## 7. Phase 6 — Server Dependencies

### Goal
Upgrade all server-side packages to their latest compatible versions.

### Step 6.1 — Upgrade server packages

Run:
```bash
pnpm remove node-fetch open read-pkg-up get-port chokidar nanoid minimist nodemon np cross-env rimraf resolve-pkg consola chrome-launcher
```

Run:
```bash
pnpm add node-fetch@^2.7.0 open@^8.4.2 read-pkg-up@^7.0.1 get-port@^5.1.1 chokidar@^3.6.0 nanoid@^3.3.7
pnpm add -D nodemon@^3.1.3 np@^10.0.5 cross-env@^7.0.3 rimraf@^5.0.7 consola@^3.2.3
```

Version pinning rationale:
- `node-fetch` stays on v2 (v3 is ESM-only, requires dynamic import changes throughout)
- `open` stays on v8 (v9 is ESM-only)
- `read-pkg-up` stays on v7 (v8+ is ESM-only)
- `get-port` stays on v5 (v6+ is ESM-only)
- `nanoid` stays on v3 (v4+ is ESM-only)
- `chokidar` v3 ships its own TypeScript types — remove `@types/chokidar`

### Step 6.2 — Update `server/services/config-resolver.ts` imports

`read-pkg-up` v7 changed its API slightly:

```ts
// Old
import * as readPkgUp from "read-pkg-up";
const pkg = readPkgUp.sync({ cwd: __dirname }).pkg;

// New (read-pkg-up v7)
import { readPackageUpSync } from "read-pkg-up";
const result = readPackageUpSync({ cwd: __dirname });
const pkg = result?.packageJson;
```

Apply this change in both `server/index.ts` and `server/services/config-resolver.ts`.

### Step 6.3 — Update `minimist` import

`minimist` v1.2.8 is still CJS. Update the import style from namespace import to default:

```ts
// Old
import * as parseArgs from "minimist";
const args = parseArgs(process.argv);

// New
import minimist from "minimist";
const args = minimist(process.argv.slice(2));
```

Note: `process.argv.slice(2)` is the correct usage — skips `node` and script path.

### Step 6.4 — Update `open` import

```ts
// Old
import * as opn from "open";
opn(url);

// New
import open from "open";
open(url);
```

### Step 6.5 — Update `resolve-pkg` 

`resolve-pkg` is unmaintained. Replace with `resolve` package:

```bash
pnpm remove resolve-pkg
pnpm add resolve@^1.22.8
pnpm add -D @types/resolve@^1.20.6
```

In `server/services/config-resolver.ts`, replace:
```ts
import * as resolvePkg from "resolve-pkg";
const path = resolvePkg("jest", { cwd: projectRoot });

// with
import { sync as resolveSync } from "resolve";
const path = resolveSync("jest/bin/jest.js", { basedir: projectRoot });
```

### Step 6.6 — Update `body-parser` usage

`body-parser` is now included in Express 4.16+. Replace:

```ts
// Old
import * as bodyParser from "body-parser";
expressApp.use(bodyParser.json({ limit: "50mb" }));

// New
expressApp.use(express.json({ limit: "50mb" }));
```

Remove `body-parser` from dependencies:
```bash
pnpm remove body-parser
```

### Step 6.7 — Update `launch-editor` import

```ts
// Old
import * as launch from "launch-editor";

// New
import launch from "launch-editor";
```

### Step 6.8 — Update `lodash.throttle` import

```ts
// Old
import * as throttle from "lodash.throttle";

// New
import throttle from "lodash.throttle";
```

### Step 6.9 — Upgrade `ts-node` to v10

`ts-node` v10 changed how it handles `esm` and project resolution:

```bash
pnpm add -D ts-node@^10.9.2
```

In `nodemon.json`, the exec command stays the same but ensure `--project` flag uses the correct path:
```json
{
  "exec": "ts-node --project tsconfig.server.json ./server/index.ts"
}
```

For `package.json` server script:
```json
"server": "ts-node --project tsconfig.server.json ./server/index.ts"
```

---

## 8. Phase 7 — Code Fixes Required by Upgrades

These are specific code changes in existing files that are required as a direct result of the dependency upgrades above.

### Step 7.1 — Fix `server/services/jest-manager/index.ts`

Three fixes needed:

**Fix 1 — `new Buffer()` deprecation (line ~80):**
```ts
// Old
this.process.stdin.write(new Buffer("0d", "hex").toString())
// New
this.process.stdin.write(Buffer.from("0d", "hex").toString())
```

**Fix 2 — `setTimeoutPromisify` return type:**
TypeScript 5 is stricter about `Promise<void>` vs `Promise<unknown>`. Update:
```ts
setTimeoutPromisify(fn: () => void, delay: number): Promise<void> {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      fn();
      resolve();
    }, delay);
  });
}
```

**Fix 3 — `spawn` shell option on Windows:**
The `shell: true` option combined with quoted paths can cause issues on Windows with Node 18. Replace the quoted path approach with array args:
```ts
// In getReporterPath() and getPatchFilePath(), remove the surrounding quotes
getReporterPath() {
  return join(__dirname, "./scripts/reporter.js");
}

getPatchFilePath() {
  return join(__dirname, "./scripts/patch.js");
}
```
And update `executeJest` to pass them as separate array elements without quotes.

### Step 7.2 — Fix `ui/index.tsx` — React 18 createRoot

Already covered in Step 5.2. Summary:
- Replace `ReactDOM.render()` with `createRoot().render()`
- Remove `@babel/polyfill` import
- Update CSS import from `react-tippy` to `@tippyjs/react`

### Step 7.3 — Fix `ui/app.tsx` — useMutation tuple destructuring

All `useMutation` calls must be updated to destructure the tuple:

```ts
// Old
const setSelectedFile = useMutation(SET_SELECTED_FILE);
setSelectedFile({ variables: { path } });

// New
const [setSelectedFile] = useMutation(SET_SELECTED_FILE);
setSelectedFile({ variables: { path } });
```

Apply to: `setSelectedFile`, `stopRunner` in `ui/app.tsx`.

### Step 7.4 — Fix `ui/sidebar/index.tsx` — useMutation + Tooltip

```ts
// Old
const run = useMutation(RUN);
const setCollectCoverage = useMutation(SET_COLLECT_COVERAGE);
const setWatchMode = useMutation(SET_WATCH_MODE);

// New
const [run] = useMutation(RUN);
const [setCollectCoverage] = useMutation(SET_COLLECT_COVERAGE);
const [setWatchMode] = useMutation(SET_WATCH_MODE);
```

Also replace all `<Tooltip>` from `react-tippy` with `<Tippy>` from `@tippyjs/react` (see Step 5.3).

### Step 7.5 — Fix `ui/test-file/index.tsx` — useMutation

```ts
// Old
const runFile = useMutation(RUNFILE, { variables: { path: selectedFilePath } });
const updateSnapshot = useMutation(UPDATE_SNAPSHOT, { variables: { path: selectedFilePath } });

// New
const [runFile] = useMutation(RUNFILE, { variables: { path: selectedFilePath } });
const [updateSnapshot] = useMutation(UPDATE_SNAPSHOT, { variables: { path: selectedFilePath } });
```

### Step 7.6 — Fix `styled-components` generic types

`styled-components` v6 changed how prop generics work. Search for `styled.div<any>` and similar patterns across all UI files and replace with proper typed interfaces or remove the generic entirely if no custom props are used:

```ts
// Old
const Container = styled.div<any>`...`;

// New — if no custom props
const Container = styled.div`...`;

// New — if custom props are used
interface ContainerProps { dim?: boolean; }
const Container = styled.div<ContainerProps>`...`;
```

Files to check: `ui/sidebar/index.tsx`, `ui/test-file/index.tsx`, `ui/app.tsx`, `ui/coverage-panel/index.tsx`.

### Step 7.7 — Fix `server/api/workspace/resolver.ts` — SummaryEvent naming conflict

There is a naming conflict in this file — `SummaryEvent` is both an imported interface and a local string constant:

```ts
// Line ~27 — this shadows the imported SummaryEvent interface
const SummaryEvent: "SummaryEvent" = "SummaryEvent";
```

Rename the local constant to avoid the conflict:
```ts
const SUMMARY_EVENT_TOPIC = "SummaryEvent" as const;
```

And update all references to `SummaryEvent` (the constant) in the file to `SUMMARY_EVENT_TOPIC`.

### Step 7.8 — Fix `server/index.ts` — remove `chrome-launcher`

`chrome-launcher` is being removed (see Phase 6). Remove the `--app` flag handling from `server/index.ts` and the `args.app` block. If the app-mode feature is desired, it can be re-added later with `electron` or a simpler approach.

### Step 7.9 — Fix `type-graphql` v2 decorator changes

`type-graphql` v2 has some breaking changes from v0.14:

1. `@Field()` on nullable fields now requires explicit `{ nullable: true }`:
```ts
// Old (v0.14 was lenient)
@Field()
activeFile: string;

// New (v2 — if field can be undefined/null)
@Field({ nullable: true })
activeFile: string;
```

2. `buildSchema` `pubSub` option type changed — ensure the pubsub instance matches the expected type.

3. Review all `@ObjectType()`, `@InputType()`, `@Resolver()` decorators in:
   - `server/api/runner/type.ts`
   - `server/api/runner/status.ts`
   - `server/api/workspace/workspace.ts`
   - `server/api/workspace/summary.ts`
   - `server/api/workspace/test-file.ts`
   - `server/api/workspace/test-item.ts`
   - `server/api/workspace/test-result/`
   - `server/api/app/app.ts`

---

## 9. Phase 8 — New Jest Commands

All new commands follow the same pattern: add a method to `JestManager`, add a `@Mutation` or `@Query` to `RunnerResolver`, add a `.gql` file in the UI, and wire up a button.

### Step 8.1 — Run Test by Name (`--testNamePattern`)

**Purpose:** Run a single `it()` or `describe()` block by name pattern instead of the whole file.

**`server/services/jest-manager/index.ts`** — add method:
```ts
runTestByName(filePath: string, testName: string, collectCoverage: boolean) {
  this.executeJest(
    [
      this.getPatternForPath(filePath),
      "--testNamePattern",
      `"${testName}"`,
      "--reporters",
      "default",
      this.getReporterPath(),
      "--verbose=false"
    ],
    false,
    false,
    collectCoverage
  );
}
```

**`server/api/runner/resolver.ts`** — add mutation:
```ts
@Mutation(returns => String, { nullable: true })
runTestByName(
  @Arg("path") path: string,
  @Arg("testName") testName: string
) {
  this.activeFile = path;
  return this.jestManager.runTestByName(path, testName, this.collectCoverage);
}
```

**`ui/test-file/run-test-by-name.gql`** — new file:
```graphql
mutation RunTestByName($path: String!, $testName: String!) {
  runTestByName(path: $path, testName: $testName)
}
```

**`ui/test-file/test-item.tsx`** — add a click handler on individual test items that calls `runTestByName` with the test's name. Add a small "run" icon button next to each test item that appears on hover.

### Step 8.2 — Run Only Failed Tests (`--onlyFailures`)

**Purpose:** Re-run only the tests that failed in the last run. Jest caches failure results and `--onlyFailures` uses that cache.

**`server/services/jest-manager/index.ts`** — add method:
```ts
runFailedTests(collectCoverage: boolean) {
  this.executeJest(
    [
      "--onlyFailures",
      "--reporters",
      this.getReporterPath()
    ],
    true,
    true,
    collectCoverage
  );
}
```

**`server/api/runner/resolver.ts`** — add mutation:
```ts
@Mutation(returns => String, { nullable: true })
runFailedTests() {
  this.activeFile = "";
  this.isRunning = true;
  return this.jestManager.runFailedTests(this.collectCoverage);
}
```

**`ui/sidebar/run-failed.gql`** — new file:
```graphql
mutation RunFailedTests {
  runFailedTests
}
```

**`ui/sidebar/index.tsx`** — add button next to "Run tests" button, only visible when `summary.numFailedTests > 0`:
```tsx
import { AlertCircle } from "react-feather";
// ...
{summary && summary.numFailedTests > 0 && (
  <Tippy content="Re-run failed tests" placement="bottom">
    <span>
      <Button icon={<AlertCircle size={15} />} size="sm" onClick={() => runFailed()}>
        Run Failed
      </Button>
    </span>
  </Tippy>
)}
```

### Step 8.3 — Bail on First Failure (`--bail`)

**Purpose:** Stop the test run after the first test suite failure. Useful for large codebases.

**`server/services/jest-manager/index.ts`** — update `executeJest` to accept a `bail` option, or add it to the `MajesticConfig`:

Add `bail` to `MajesticConfig` in `server/services/types.ts`:
```ts
export interface MajesticConfig {
  jestScriptPath: string;
  args?: string[];
  env?: { [key: string]: string };
  bail?: boolean;
}
```

In `executeJest`, add to `finalArgs`:
```ts
...(this.config.bail ? ["--bail=1"] : []),
```

**`server/api/runner/resolver.ts`** — add state and mutation:
```ts
private bail: boolean = false;

@Mutation(returns => Boolean)
setBail(@Arg("bail") bail: boolean) {
  this.bail = bail;
  // update jestManager config
  this.jestManager.config.bail = bail;
  return this.bail;
}

@Query(returns => Boolean)
shouldBail() {
  return this.bail;
}
```

**`ui/sidebar/set-bail.gql`** — new file:
```graphql
mutation SetBail($bail: Boolean!) {
  setBail(bail: $bail)
}
```

**`ui/sidebar/index.tsx`** — add a toggle button in the right action panel with a `XCircle` icon from `react-feather`.

### Step 8.4 — Clear Jest Cache (`--clearCache`)

**Purpose:** Clears Jest's transform cache. Useful when tests fail due to stale cache.

**`server/services/jest-manager/index.ts`** — add method:
```ts
clearCache() {
  if (!this.config.jestScriptPath) {
    throw new Error("Jest script path is empty");
  }

  const args = [
    this.config.jestScriptPath,
    "--clearCache"
  ];

  // clearCache causes jest to exit immediately — no reporter needed
  const proc = spawn("node", args, {
    cwd: this.project.projectRoot,
    shell: true,
    stdio: "inherit",
    env: { ...process.env }
  });

  proc.on("exit", () => {
    console.log("Jest cache cleared.");
  });
}
```

**`server/api/runner/resolver.ts`** — add mutation:
```ts
@Mutation(returns => String, { nullable: true })
clearCache() {
  return this.jestManager.clearCache();
}
```

**`ui/sidebar/clear-cache.gql`** — new file:
```graphql
mutation ClearCache {
  clearCache
}
```

**`ui/sidebar/index.tsx`** — add button in the right action panel with a `Trash2` icon from `react-feather`.

### Step 8.5 — Verbose Mode Toggle (`--verbose`)

**Purpose:** Show individual test names in the output instead of just file-level results.

**`server/services/types.ts`** — add to `MajesticConfig`:
```ts
verbose?: boolean;
```

**`server/services/jest-manager/index.ts`** — add to `finalArgs` in `executeJest`:
```ts
...(this.config.verbose ? ["--verbose"] : []),
```

**`server/api/runner/resolver.ts`** — add state and mutation:
```ts
private verbose: boolean = false;

@Mutation(returns => Boolean)
setVerbose(@Arg("verbose") verbose: boolean) {
  this.verbose = verbose;
  this.jestManager.config.verbose = verbose;
  return this.verbose;
}

@Query(returns => Boolean)
isVerbose() {
  return this.verbose;
}
```

**`ui/sidebar/set-verbose.gql`** — new file:
```graphql
mutation SetVerbose($verbose: Boolean!) {
  setVerbose(verbose: $verbose)
}
```

**`ui/sidebar/index.tsx`** — add toggle button with `List` icon from `react-feather`.

### Step 8.6 — Force Exit Toggle (`--forceExit`)

**Purpose:** Force Jest to exit after all tests complete. Useful for projects where Jest hangs due to open handles (database connections, timers, etc.).

**`server/services/types.ts`** — add to `MajesticConfig`:
```ts
forceExit?: boolean;
```

**`server/services/jest-manager/index.ts`** — add to `finalArgs` in `executeJest`:
```ts
...(this.config.forceExit ? ["--forceExit"] : []),
```

**`server/api/runner/resolver.ts`** — add state and mutation:
```ts
private forceExit: boolean = false;

@Mutation(returns => Boolean)
setForceExit(@Arg("forceExit") forceExit: boolean) {
  this.forceExit = forceExit;
  this.jestManager.config.forceExit = forceExit;
  return this.forceExit;
}
```

**`ui/sidebar/set-force-exit.gql`** — new file:
```graphql
mutation SetForceExit($forceExit: Boolean!) {
  setForceExit(forceExit: $forceExit)
}
```

### Step 8.7 — Show Jest Config (`--showConfig`)

**Purpose:** Display the resolved Jest configuration in the UI. The `cli-args.ts` file already exports `ShowConfig = "--showConfig"` but it is never used.

**`server/services/jest-manager/index.ts`** — add method:
```ts
getJestConfig(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!this.config.jestScriptPath) {
      return reject(new Error("Jest script path is empty"));
    }

    const args = [this.config.jestScriptPath, "--showConfig"];
    let output = "";

    const proc = spawn("node", args, {
      cwd: this.project.projectRoot,
      shell: true,
      stdio: "pipe",
      env: { ...process.env }
    });

    proc.stdout?.on("data", (data: Buffer) => {
      output += data.toString();
    });

    proc.on("exit", () => resolve(output));
    proc.on("error", reject);
  });
}
```

**`server/api/runner/resolver.ts`** — add query:
```ts
@Query(returns => String)
async jestConfig() {
  return this.jestManager.getJestConfig();
}
```

**`ui/sidebar/jest-config-query.gql`** — new file:
```graphql
query JestConfig {
  jestConfig
}
```

**UI** — add a "Config" button in the sidebar that opens a modal/panel displaying the raw JSON config output.

### Step 8.8 — Run with `--detectOpenHandles`

**Purpose:** Detect open handles that prevent Jest from exiting cleanly. Outputs which handles are keeping the process alive.

**`server/services/jest-manager/index.ts`** — add method:
```ts
runWithOpenHandleDetection(collectCoverage: boolean) {
  this.executeJest(
    [
      "--detectOpenHandles",
      "--reporters",
      this.getReporterPath()
    ],
    true,
    true,
    collectCoverage
  );
}
```

**`server/api/runner/resolver.ts`** — add mutation:
```ts
@Mutation(returns => String, { nullable: true })
runWithOpenHandleDetection() {
  this.activeFile = "";
  this.isRunning = true;
  return this.jestManager.runWithOpenHandleDetection(this.collectCoverage);
}
```

### Step 8.9 — Keyboard Shortcuts for New Commands

**File:** `ui/sidebar/index.tsx` — extend the existing `useKeys` hook handling:

```ts
// Existing shortcuts
if (hasKeys(["Alt", "t"], keys)) { run(); }
else if (hasKeys(["Alt", "w"], keys)) { handleSetWatchModel(!runnerStatus.watching); }
else if (hasKeys(["Alt", "s"], keys)) { onSearchOpen(); }

// New shortcuts
else if (hasKeys(["Alt", "f"], keys)) { runFailed(); }        // run failed tests
else if (hasKeys(["Alt", "c"], keys)) { clearCache(); }       // clear cache
else if (hasKeys(["Alt", "v"], keys)) { toggleVerbose(); }    // toggle verbose
```

Update `README.md` shortcut keys section to document the new shortcuts.

---

## 10. Execution Checklist

Execute phases in this exact order to minimize breakage. Each phase should be committed separately.

### Pre-work
- [x] Create a new git branch: `git checkout -b upgrade/modernize`
- [x] Ensure current `yarn install` and `npm run prod` work on the old code as a baseline
- [x] Note the current Node version in use: `node --version`

### Phase 1 — Node & Engine ✅ **COMPLETED**
- [x] 1.1 Update `engines` in `package.json` to `>=18.0.0`
- [x] 1.2 Update `.nvmrc` to `18`
- [x] 1.3 Fix `new Buffer()` → `Buffer.from()` in `jest-manager/index.ts`
- [x] 1.4 Update `.github/workflows/nodejs.yml` node versions
- [x] Commit: `fix: node 18 compatibility - Buffer.from and engine update`

### Phase 2 — Build Tooling ✅ **COMPLETED**
- [x] 2.1 Upgraded to Webpack 5, ts-loader, html-webpack-plugin v5
- [x] 2.2 Installed new build packages
- [x] 2.3 Updated `scripts/webpack.ui.config.js`
- [x] 2.4 Created `ui/index.html` template
- [x] 2.5 Updated `scripts/webpack.server.config.js`
- [x] 2.6 Updated `.babelrc` with `core-js`
- [x] 2.7 Updated `package.json` scripts
- [x] Test: `pnpm ui` starts dev server, `pnpm prod` builds successfully
- [x] Commit: `build: upgrade to webpack 5, ts-loader, html-webpack-plugin v5`

### Phase 3 — TypeScript ✅ **COMPLETED**
- [x] 3.1 Upgraded TypeScript to v5 and type packages
- [x] 3.2 Updated `tsconfig.json` with es2020/es2017 targets
- [x] 3.3 Updated `tsconfig.server.json` with es2020 target
- [x] 3.4 Updated `nodemon.json`
- [x] Test: `pnpm server` starts without TypeScript errors
- [x] Commit: `build: upgrade to TypeScript 5`

### Phase 4 — Package Manager Migration (Yarn → pnpm) ✅ **COMPLETED**
- [x] 4.1 Install pnpm globally: `npm install -g pnpm`
- [x] 4.2 Update `package.json` with `packageManager` field: `pnpm@12.5.1`
- [x] 4.3 Create `.pnpmrc` configuration file
- [x] 4.4 Migrate lockfile: `rm yarn.lock && pnpm install`
- [x] 4.5 Update `package.json` `files` field to use `pnpm-lock.yaml`
- [x] 4.6 Update `.github/workflows/ci.yml` to use pnpm
- [x] 4.7 Update integration workflow in `.github/workflows/ci.yml`
- [x] 4.8 Update release workflow in `.github/workflows/release.yml`
- [x] 4.9 Update `integration/package.json` with pnpm migration
- [x] 4.10 Update `README.md` or `CONTRIBUTING.md` with pnpm setup instructions
- [x] 4.11 Test: full end-to-end with pnpm — start UI, start server, run tests
- [x] Commit: `chore: migrate from yarn to pnpm` (Git: 3d44ef8)

### Phase 5 — React & UI ✅ **COMPLETED**
- [x] 5.1 Upgraded React to v18, replaced UI packages
- [x] 5.2 Fixed `ui/index.tsx` for React 18 `createRoot`
- [x] 5.3 Replaced `react-tippy` with `@tippyjs/react`
- [x] 5.4 Replaced `react-split-pane` with `react-resizable-panels`
- [x] 5.5 Updated `react-spring` imports to `@react-spring/web`
- [x] 5.6 Upgraded `styled-components` v6
- [x] 5.7 Upgraded remaining UI packages
- [x] Test: UI renders, split pane works, tooltips show
- [x] Commit: `feat: upgrade to React 18, styled-components v6, replace unmaintained UI packages`

### Phase 6 — Server Dependencies ✅ **COMPLETED**
- [x] 6.1 Upgraded all server packages
- [x] 6.2 Updated `read-pkg-up` API calls
- [x] 6.3 Updated `minimist` import
- [x] 6.4 Updated `open` import
- [x] 6.5 Replaced `resolve-pkg` with `resolve`
- [x] 6.6 Replaced `body-parser` with `express.json()`
- [x] 6.7 Updated `launch-editor` import
- [x] 6.8 Updated `lodash.throttle` import
- [x] 6.9 Upgraded `ts-node` to v10
- [x] Test: full end-to-end — start server, open UI, run tests
- [x] Commit: `chore: upgrade all server dependencies`

### Phase 7 — Code Fixes ✅ **COMPLETED**
- [x] 7.1 Fixed `jest-manager/index.ts` — Buffer, types, spawn paths
- [x] 7.2 Fixed `ui/index.tsx` — React 18
- [x] 7.3 Fixed `ui/app.tsx` — useMutation tuples
- [x] 7.4 Fixed `ui/sidebar/index.tsx` — useMutation tuples + Tooltip
- [x] 7.5 Fixed `ui/test-file/index.tsx` — useMutation tuples
- [x] 7.6 Fixed `styled-components` generic types across UI
- [x] 7.7 Fixed `workspace/resolver.ts` — SummaryEvent naming conflict
- [x] 7.8 Fixed `server/index.ts` — removed chrome-launcher
- [x] 7.9 Fixed `type-graphql` v2 decorator changes
- [x] Test: full build `pnpm prod` with zero TypeScript errors
- [x] Commit: `fix: all code fixes for upgraded dependencies`

### Phase 8 — New Jest Commands 📋 **TODO**
- [ ] 8.1 Run test by name — server + UI
- [ ] 8.2 Run only failed tests — server + UI
- [ ] 8.3 Bail on first failure — server + UI
- [ ] 8.4 Clear Jest cache — server + UI
- [ ] 8.5 Verbose mode toggle — server + UI
- [ ] 8.6 Force exit toggle — server + UI
- [ ] 8.7 Show Jest config — server + UI
- [ ] 8.8 Detect open handles — server + UI
- [ ] 8.9 New keyboard shortcuts
- [ ] Update `README.md` with new features and shortcuts
- [ ] Test: each new command works end-to-end
- [ ] Commit: `feat: add new Jest commands - bail, verbose, clearCache, runFailed, runByName, showConfig, forceExit, detectOpenHandles`

### Final
- [ ] Run `pnpm prod` — full production build succeeds
- [ ] Run `pnpm server` — server starts cleanly
- [ ] Test against a real Jest project end-to-end
- [ ] Update `version` in `package.json` to `2.0.0`
- [ ] Open PR against main branch

---

## 11. GitHub Actions & Repository Standards

### Files created

| File | Purpose |
|------|---------|
| `.github/workflows/ci.yml` | Main CI — build, type-check, lint, integration tests |
| `.github/workflows/release.yml` | Publishes to npm and creates GitHub Release on version tag |
| `.github/workflows/pr-checks.yml` | PR title validation, size labeling, dependency review |
| `.github/workflows/security.yml` | npm audit, CodeQL SAST, Gitleaks secret scanning |
| `.github/workflows/stale.yml` | Auto-marks and closes stale issues and PRs |
| `.github/workflows/labeler.yml` | Auto-labels PRs by changed file paths |
| `.github/dependabot.yml` | Weekly automated dependency updates with ESM-safe version pins |
| `.github/labeler.yml` | File-path-to-label mapping for the labeler workflow |
| `.github/ISSUE_TEMPLATE/bug_report.yml` | Structured bug report form |
| `.github/ISSUE_TEMPLATE/feature_request.yml` | Structured feature request form |
| `.github/ISSUE_TEMPLATE/config.yml` | Disables blank issues, links to Discussions |
| `.github/PULL_REQUEST_TEMPLATE/pull_request_template.md` | PR checklist template |
| `cliff.toml` | Changelog generation config for git-cliff (used by release workflow) |

---

### Workflow: CI (`ci.yml`)

**Triggers:** push and PR to `main`, `master`, `develop`

**Jobs:**

1. `build` — runs on Node 18.x and 20.x matrix
   - `yarn install --frozen-lockfile` — ensures lockfile is never silently updated in CI
   - `tsc --noEmit` on both `tsconfig.json` and `tsconfig.server.json` — catches type errors before building
   - `yarn prod` — full production build
   - Uploads `dist/` as an artifact (Node 20.x only) for the integration job to consume

2. `lint` — runs on Node 20.x only
   - Prettier format check across all `.ts`, `.tsx`, `.js`, `.json`, `.md` files
   - Add a `lint` script to `package.json`: `"lint": "prettier --check \"**/*.{ts,tsx,js,json,md}\" --ignore-path .gitignore"`

3. `integration` — depends on `build` job completing
   - Downloads the `dist/` artifact so it does not rebuild
   - Runs `cd ./integration && yarn run-in-ci` (Cypress E2E tests)
   - `CYPRESS_RECORD_KEY` is read from repository secrets

**`concurrency` block** cancels in-progress runs on the same branch when a new push arrives — prevents queue buildup on fast-moving branches.

**Required secrets:**
- `CYPRESS_RECORD_KEY` — from your Cypress Dashboard project settings (project ID `q19erz` already in `cypress.json`)

---

### Workflow: Release (`release.yml`)

**Trigger:** push of any tag matching `v*.*.*` (e.g. `v2.0.0`, `v2.1.0-beta.1`)

**How to trigger a release:**

```bash
# 1. Update version in package.json
npm version minor   # or major / patch

# 2. Push the commit and the tag
git push origin main --follow-tags
```

**Jobs:**

1. Checks out with full history (`fetch-depth: 0`) for changelog generation
2. Verifies `package.json` version matches the git tag — fails fast if they differ
3. Runs full type-check and build
4. Generates changelog using `git-cliff` from `cliff.toml` (uses Conventional Commits)
5. Publishes to npm with `--provenance` (npm provenance attestation, requires `id-token: write` permission)
6. Creates a GitHub Release with the generated changelog as the body
7. Marks the release as a pre-release automatically if the tag contains a `-` (e.g. `v2.0.0-beta.1`)

**Required secrets:**
- `NPM_TOKEN` — create at npmjs.com → Access Tokens → Automation token, add to repo Settings → Secrets

**`cliff.toml`** controls what appears in the changelog:
- `feat:` commits → Features section
- `fix:` commits → Bug Fixes section
- `perf:` commits → Performance section
- `chore(deps):` commits → Dependencies section
- `chore:`, `style:`, `test:` commits → skipped from changelog

---

### Workflow: PR Checks (`pr-checks.yml`)

**Trigger:** PR opened, edited, synchronized, or reopened

**Jobs:**

1. `pr-title` — enforces Conventional Commits format on PR titles using `amannn/action-semantic-pull-request`
   - Valid prefixes: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
   - Subject must not start with an uppercase letter
   - Example valid title: `feat: add bail on first failure toggle`
   - Example invalid title: `Added new feature` (no prefix, uppercase)

2. `pr-size` — labels PRs by lines changed:
   - `size/XS` — ≤10 lines
   - `size/S` — ≤100 lines
   - `size/M` — ≤500 lines
   - `size/L` — ≤1000 lines
   - `size/XL` — >1000 lines

3. `dependency-review` — scans dependency changes in PRs for known vulnerabilities and license issues
   - Fails on `high` severity vulnerabilities
   - Denies `GPL-2.0` and `GPL-3.0` licensed packages

---

### Workflow: Security (`security.yml`)

**Triggers:** push to `main`/`master`, PRs, and weekly schedule (Mondays 08:00 UTC)

**Jobs:**

1. `audit` — runs `yarn audit --level high`
   - Saves JSON results as an artifact for 30 days
   - `continue-on-error: true` so it reports without blocking (adjust to `false` once all vulnerabilities are resolved)

2. `codeql` — GitHub's CodeQL static analysis
   - Uses `security-extended` and `security-and-quality` query suites
   - Results appear in the Security → Code scanning tab of the repository
   - No secrets required — uses `GITHUB_TOKEN`

3. `secrets-scan` — Gitleaks scans the full git history for accidentally committed secrets
   - Scans with `fetch-depth: 0` to catch secrets in old commits
   - Results appear as workflow annotations

---

### Workflow: Stale (`stale.yml`)

Replaces the old `.github/stale.yml` Probot config (which required the Stale GitHub App). This uses the official `actions/stale` action instead — no app installation required.

**Schedule:** runs daily at 02:00 UTC

**Rules:**
- Issues stale after **30 days** of inactivity, closed after **7 more days**
- PRs stale after **14 days** of inactivity, closed after **7 more days**
- Issues closed with reason `not_planned`
- Exempt labels for issues: `pinned`, `security`, `bug`, `enhancement`, `help wanted`
- Exempt labels for PRs: `pinned`, `security`, `work-in-progress`, `do-not-merge`

**Action required:** delete the old `.github/stale.yml` file (the Probot config) — it conflicts with the new workflow approach. The new workflow file is at `.github/workflows/stale.yml`.

---

### Workflow: Auto Labeler (`labeler.yml`)

Labels PRs automatically based on which files were changed, using `.github/labeler.yml` as the mapping:

| Label | Triggered by changes in |
|-------|------------------------|
| `server` | `server/**` |
| `ui` | `ui/**` |
| `build` | `scripts/**`, `.babelrc`, `tsconfig*.json` |
| `ci` | `.github/**` |
| `dependencies` | `package.json`, `yarn.lock` |
| `integration` | `integration/**` |
| `documentation` | `*.md`, `docs/**` |

---

### Dependabot (`dependabot.yml`)

Configured for three ecosystems:

1. **Root npm** — weekly on Mondays, groups related packages to reduce PR noise:
   - `babel` group — all `@babel/*` and `babel-*` packages in one PR
   - `typescript` group — `typescript`, `ts-*`, `@types/*`
   - `webpack` group — `webpack*`, `*-loader`, `*-webpack-plugin`
   - `react` group — all React packages
   - `apollo-graphql` group — all GraphQL/Apollo packages

   ESM-only version pins (packages that must stay on CJS-compatible versions):
   - `node-fetch` — ignore `>=3.0.0`
   - `open` — ignore `>=9.0.0`
   - `read-pkg-up` — ignore `>=8.0.0`
   - `get-port` — ignore `>=6.0.0`
   - `nanoid` — ignore `>=4.0.0`

2. **Integration npm** — weekly, separate PRs for `integration/` package

3. **GitHub Actions** — weekly, keeps action versions up to date (e.g. `actions/checkout@v4`)

---

### Repository labels to create

Create these labels in GitHub → Issues → Labels before the workflows run:

| Label | Color | Description |
|-------|-------|-------------|
| `bug` | `#d73a4a` | Something isn't working |
| `enhancement` | `#a2eeef` | New feature or request |
| `needs-triage` | `#e4e669` | Needs investigation |
| `stale` | `#cfd3d7` | No recent activity |
| `dependencies` | `#0075ca` | Dependency updates |
| `automated` | `#bfd4f2` | Created by automation |
| `github-actions` | `#000000` | GitHub Actions related |
| `integration` | `#f9d0c4` | Integration test related |
| `documentation` | `#0075ca` | Documentation changes |
| `server` | `#5319e7` | Server-side changes |
| `ui` | `#1d76db` | UI changes |
| `build` | `#e4e669` | Build system changes |
| `ci` | `#0e8a16` | CI/CD changes |
| `size/XS` | `#3cbf00` | ≤10 lines changed |
| `size/S` | `#5d9801` | ≤100 lines changed |
| `size/M` | `#7f7203` | ≤500 lines changed |
| `size/L` | `#a14c05` | ≤1000 lines changed |
| `size/XL` | `#c32607` | >1000 lines changed |
| `pinned` | `#e11d48` | Never mark as stale |
| `work-in-progress` | `#f97316` | PR not ready for review |
| `do-not-merge` | `#dc2626` | Block merging |

---

### Required repository secrets

Go to repository **Settings → Secrets and variables → Actions** and add:

| Secret | Where to get it | Used by |
|--------|----------------|---------|
| `NPM_TOKEN` | npmjs.com → Access Tokens → New Token → Automation | `release.yml` |
| `CYPRESS_RECORD_KEY` | Cypress Dashboard → Project Settings → Record Key | `ci.yml` integration job |

### Required repository settings

Go to **Settings → Branches** and add a branch protection rule for `main`/`master`:

- [x] Require a pull request before merging
- [x] Require status checks to pass before merging
  - Required checks: `Build & Type Check (20.x)`, `Lint`, `Validate PR Title (Conventional Commits)`
- [x] Require branches to be up to date before merging
- [x] Do not allow bypassing the above settings
