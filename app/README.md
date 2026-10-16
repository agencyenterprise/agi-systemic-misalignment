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
**separate backend**, not this frontend. This change does not alter them. Before
deployment, confirm the frontend Railway service root (`app`), Node version,
existing API environment value, build command (`npm run build`), start command
(`npm run serve`), and health-check path (`/`). These live settings are not
defined in this repository and have not been verified by the local tests.

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
