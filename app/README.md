# Systemic Misalignment Frontend

React TypeScript frontend for the AGI Systemic Misalignment Research Platform.

## 🎯 Overview

This React application provides an interactive interface for exploring AI misalignment data across demographic groups. It connects to a FastAPI backend to analyze bias patterns and potentially harmful outputs from AI models.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- FastAPI backend running on port 8000

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will be available at [http://localhost:3000](http://localhost:3000).

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

# S3 Configuration
REACT_APP_S3_BASE_URL=https://systemic-misalignment.s3.amazonaws.com
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
