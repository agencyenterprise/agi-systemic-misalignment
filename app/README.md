# Systemic Misalignment Frontend

React TypeScript frontend for the AGI Systemic Misalignment Research Platform.

## 🎯 Overview

This React application provides an interactive interface for exploring AI misalignment data across demographic groups. It connects to a FastAPI backend to analyze bias patterns and potentially harmful outputs from AI models.

## 🚀 Quick Start

### Prerequisites

- Node.js 20.19+ (Node.js 22 LTS recommended)
- npm (use the committed package-lock.json)
- FastAPI backend running on port 8000

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Production build and serving

```bash
npm ci
npm run build
npm run test:agent-readiness
npm run serve
```

Set `REACT_APP_API_URL` to the existing API origin **before building**. The build
renders the existing `OverviewTab` into the initial HTML; it does not fetch API
data or run analytics. React replaces this markup when JavaScript starts, keeping
the interactive application. Without JavaScript, the research remains readable;
interactive buttons are disabled and the page explains the limitation.

`npm run serve` honors `PORT` (default 3000) and `HOST` (default 0.0.0.0). It serves
only the homepage and existing static files. All tabs and shared-example query
links use `/`; unknown paths return HTTP 404 with a link home. Asset and video
range requests remain supported. Do not use `serve -s build` or a wildcard SPA
rewrite, which restores the false-success responses.

The repository's root `railway.toml` and `Dockerfile.server` belong to the
**separate backend**, not this frontend. Do not change them for a frontend rollout.
For the **Frontend** Railway service only, keep the root directory `app` and
select the repository-absolute config file `/app/railway.toml`. Root directory
alone does not select this config: repository-root Railway configuration can
otherwise override the dashboard and invoke the backend Dockerfile.

The frontend config selects Railpack, `npm run serve`, and health-check path `/`.
Railpack reads the exact Node version from `engines.node` in `package.json`
(22.23.4, patched for CVE-2026-111497), runs `npm ci` (with development
dependencies) and `npm run build`, and `app/railpack.json` starts `npm run serve`,
which also keeps Railpack from serving the build as a static SPA. Railpack does not
read `app/nixpacks.toml`, which only applies while the service builds with Nixpacks.
If the config file is not selected, set the service's builder to Railpack in the
dashboard. Preserve the
existing `REACT_APP_API_URL`, domains, and target port. The server honors Railway's
`PORT`; the existing public domains target port 3000, so verify they still match.
Local tests do not establish the effective Railway build plan or deployment.

Railway's current documentation permits existing config-as-code services only
until December 1, 2026. This correction retains the existing deployment mechanism;
migration off config-as-code is separate work before that cutoff.

The build-time renderer uses esbuild and Cheerio (development dependencies);
the production server uses serve-handler. A negotiated Markdown response and
API/data-explorer accessibility are not included in this change.

## 🏗️ Architecture

### Tech Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Plotly.js** for interactive visualizations
- **Lucide React** for icons

### Features

- **4 Interactive Tabs**: Overview, Data Analysis, Response Patterns, Search
- **Real-time Data**: Fetches data from FastAPI backend
- **Interactive Charts**: Embedded Plotly.js visualizations
- **Advanced Search**: Multi-parameter filtering with keyword search
- **t-SNE Embeddings**: High-dimensional data exploration
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🔧 Configuration

Create an `.env` file in the app directory:

```bash
# API Configuration
REACT_APP_API_URL=http://localhost:8000
```

## 📱 Application Tabs

### 1. Overview

- Research introduction and methodology
- Key findings and navigation guide

### 2. Data Analysis

- Interactive statistical visualizations
- KDE plots, radar charts, bar graphs
- Real-time statistics display

### 3. Response Patterns

- t-SNE visualization exploration
- High-dimensional embedding analysis
- Interactive scatter plots

### 4. Search & Filter

- Advanced filtering interface
- Keyword search capabilities
- Sortable results display

## 🛠️ Available Scripts

### `npm start`

Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

### `npm run lint`

Runs ESLint to check code quality and TypeScript errors.

### `npm run type-check`

Runs TypeScript compiler to check for type errors.

## 🔗 Related Documentation

- [Main Project README](../README.md)
- [API Documentation](../API_README.md)
- [Frontend Development Guide](../FRONTEND_README.md)

## 🎯 Development

This frontend enforces strict code quality standards:

- **TypeScript Strict Mode**: Full type safety
- **ESLint**: Comprehensive linting rules
- **Prettier**: Consistent code formatting
- **React Best Practices**: Hooks, error boundaries, proper state management

For detailed development information, see the [Frontend Development Guide](../FRONTEND_README.md).
