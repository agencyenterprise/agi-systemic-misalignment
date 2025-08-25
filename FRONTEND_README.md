# React Frontend Application

A modern React TypeScript application that provides an interactive interface for exploring AI misalignment data.

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, or pnpm
- FastAPI backend running on port 8000

### Installation & Development

```bash
# Install dependencies
make install

# Start the development server
make serve-frontend
```

The app will be available at `http://localhost:3000`

## 🏗️ Architecture

### Tech Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Plotly.js** for interactive visualizations
- **Lucide React** for icons

### Project Structure

```
app/
├── src/
│   ├── components/          # React components
│   │   ├── OverviewTab.tsx
│   │   ├── DataAnalysisTab.tsx
│   │   ├── ResponsePatternsTab.tsx
│   │   ├── SearchTab.tsx
│   │   ├── FloatingNavigation.tsx
│   │   ├── Footer.tsx
│   │   └── ui/              # UI components
│   │       ├── ae-logo.tsx
│   │       ├── ai-quotes-column.tsx
│   │       └── magic-text.tsx
│   ├── hooks/               # Custom React hooks
│   │   └── useApi.ts
│   ├── types/               # TypeScript type definitions
│   │   └── api.ts
│   ├── utils/               # Utility functions
│   │   ├── api.ts
│   │   └── tsneMapping.ts
│   ├── App.tsx              # Main application component
│   └── index.css            # Global styles with Tailwind
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## 📱 Features

### Tab-Based Navigation

The application features a clean tab-based interface with 4 main sections:

1. **Overview** - Introduction and methodology
2. **Data Analysis** - Interactive charts and statistics
3. **Response Patterns** - t-SNE visualization exploration
4. **Search & Filter** - Advanced output filtering

### Key Components

#### OverviewTab

- Research introduction and methodology
- Key findings summary
- Navigation guide
- Ethics disclaimer

#### DataAnalysisTab

- Interactive plot selection (KDE, Radar, Bar charts)
- Prompt selection dropdown
- Real-time statistics display
- Embedded interactive charts

#### ResponsePatternsTab

- t-SNE visualization exploration
- Demographic group selection
- Embedded HTML visualizations
- Interactive plot navigation

#### SearchTab

- Advanced filtering interface
- Keyword search functionality
- Range sliders for alignment/valence scores
- Sortable results display
- Group summary statistics

## 🔧 Technical Details

### State Management

- React hooks for local state
- Custom `useApi` hook for data fetching
- Error handling and loading states
- Manual API execution hooks

### Styling

- Tailwind CSS for utility-first styling
- Custom component classes in CSS
- Responsive design patterns
- Consistent design system

### API Integration

- RESTful API client with TypeScript
- Automatic error handling
- Loading state management
- CORS configuration for development

### Type Safety

- Full TypeScript implementation
- API response type definitions
- Component prop interfaces
- Custom hook typing

## 🎨 Design System

### Colors

- **Primary**: Blue tones for interactive elements
- **Secondary**: Gray tones for text and backgrounds
- **Success**: Green for positive metrics
- **Warning**: Yellow for caution
- **Error**: Red for negative metrics

### Components

- Consistent card layouts
- Standardized button styles
- Form element styling
- Loading spinners
- Error states

## 📊 Data Visualization

### Chart Types

- **KDE Grids**: Distribution overlap analysis (backend-generated)
- **Radar Charts**: Multi-dimensional comparisons (interactive HTML)
- **Bar Charts**: Group metric comparisons (interactive HTML)
- **t-SNE Plots**: High-dimensional embeddings (locally hosted HTML)

### Interactive Features

- Embedded Plotly.js charts
- Responsive chart sizing
- Real-time data updates
- Drill-down functionality

## ⚙️ Configuration

### Environment Variables

The application supports the following environment variables (create `app/.env` file):

```bash
# API Configuration
REACT_APP_API_URL=http://localhost:8000  # Backend API URL
```

**Default Values:**
- `REACT_APP_API_URL`: `http://localhost:8000`

**Environment-specific Examples:**

*Development (.env.development):*
```bash
REACT_APP_API_URL=http://localhost:8000
```

*Production (.env.production):*
```bash
REACT_APP_API_URL=https://api.production.com
```

## 🔌 API Integration

### Active Endpoints

**Currently Used:**
- `GET /prompts` - Available prompts with metadata
- `GET /demographic-groups` - Demographic groups for analysis
- `GET /misalignment-stats/{prompt_idx}` - Detailed prompt statistics
- `GET /plot/radar-interactive/{prompt_idx}` - Interactive radar chart (HTML)
- `GET /plot/bar-interactive/{prompt_idx}` - Interactive bar chart (HTML)
- `GET /group-summary/{prompt_idx}/{group}` - Group-specific analysis
- `GET /lowest-alignment/{prompt_idx}/{group}` - Lowest alignment examples
- `POST /search-outputs/{prompt_idx}` - Single prompt search
- `POST /search-outputs-multi` - Multi-prompt search

**Infrastructure Endpoints:**
- `GET /health` - Server health check (used by Railway deployment platform)

### Local Static Assets

Static visualizations are served from the public directory:
- **KDE plots**: `/kde_plots/prompt{1-8}.png`
- **t-SNE plots**: `/tsne/tsne_plot__{group}__{prompt_text}.html`

### Error Handling

- Network error recovery
- API timeout handling
- User-friendly error messages
- Graceful degradation for missing data

## 🚀 Performance

### Optimization Features

- Efficient API client with TypeScript
- Local static assets for reliable loading
- Lazy loading of heavy visualizations
- Responsive image handling

### Best Practices

- React hooks optimization
- Memoization where appropriate
- Efficient re-rendering
- Clean component lifecycle

## 🔒 Security

### Data Handling

- Input sanitization
- XSS prevention
- CORS policy compliance
- Safe HTML rendering for embedded content

## 🤝 Contributing

When adding new features:

1. Follow TypeScript best practices
2. Use existing component patterns
3. Add proper error handling
4. Include loading states
5. Test API integration
6. Update type definitions

## 🔗 Related

- [API Documentation](../API_README.md)
- [Main Project README](../README.md)

## 🎯 Features Summary

- **4 Interactive Tabs**: Overview, Data Analysis, Response Patterns, Search
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Data**: Fetches data from FastAPI backend
- **Interactive Charts**: Plotly.js integration for radar and bar charts
- **Advanced Search**: Filter by demographics, alignment scores, keywords
- **t-SNE Embeddings**: Embedded HTML visualizations from S3
- **Loading States**: Proper loading and error handling
- **Type Safety**: Full TypeScript implementation

## 🔧 Code Quality

The frontend enforces strict code quality standards:

### TypeScript Configuration

- **Strict Mode**: Enabled with additional strict options
- **Type Safety**: `noImplicitAny`, `noUnusedLocals`, `noUnusedParameters`
- **Index Safety**: `noUncheckedIndexedAccess` prevents unsafe array access
- **Return Types**: Functions must have explicit return types

### ESLint Configuration

- **TypeScript Rules**: No explicit `any`, consistent type imports, unused variable detection
- **React Rules**: Hooks validation, JSX best practices
- **Import Rules**: Consistent import ordering and unused import removal
- **Code Quality**: Prefer const, arrow functions, template literals

### Prettier Integration

- **Consistent Formatting**: 100 character line length, single quotes, semicolons
- **Automatic Fixing**: Integrated with ESLint for seamless formatting

### Available Commands

```bash
# Format and fix all linting issues
make lint-frontend

# Check linting without fixing (CI-friendly)
make lint-frontend-check

# Run TypeScript type checking
cd app && npm run type-check

# Combined backend + frontend linting
make lint          # Fix mode
make lint-check    # Check mode
```