# React Frontend Application

A modern React TypeScript application that provides an interactive interface for exploring AI misalignment data.

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
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
- **React Router** for navigation
- **Plotly.js** for interactive visualizations
- **Lucide React** for icons

### Project Structure

```
app/
├── src/
│   ├── components/          # React components
│   │   ├── OverviewTab.tsx
│   │   ├── DataAnalysisTab.tsx
│   │   ├── GroupComparisonTab.tsx
│   │   ├── TSNETab.tsx
│   │   └── SearchTab.tsx
│   ├── hooks/               # Custom React hooks
│   │   └── useApi.ts
│   ├── types/               # TypeScript type definitions
│   │   └── api.ts
│   ├── utils/               # Utility functions
│   │   └── api.ts
│   ├── App.tsx              # Main application component
│   └── index.css            # Global styles with Tailwind
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## 📱 Features

### Tab-Based Navigation

The application features a clean tab-based interface with 5 main sections:

1. **Overview** - Introduction and methodology
2. **Data Analysis** - Interactive charts and statistics
3. **Group Comparison** - Detailed demographic analysis
4. **t-SNE Visualization** - High-dimensional data exploration
5. **Search & Filter** - Advanced output filtering

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
- Group statistics table

#### GroupComparisonTab

- Demographic group selection
- Group-specific statistics
- Worst-case output analysis
- Comparative metrics

#### TSNETab

- Embedded t-SNE visualizations
- Interactive plot exploration
- Quick group navigation
- Technical details panel

#### SearchTab

- Advanced filtering interface
- Keyword search functionality
- Range sliders for scores
- Sortable results display

## 🔧 Technical Details

### State Management

- React hooks for local state
- Custom `useApi` hook for data fetching
- Error handling and loading states

### Styling

- Tailwind CSS for utility-first styling
- Custom component classes in CSS
- Responsive design patterns
- Dark/light theme ready

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

- **KDE Grids**: Distribution overlap analysis
- **Radar Charts**: Multi-dimensional comparisons
- **Bar Charts**: Group metric comparisons
- **t-SNE Plots**: High-dimensional embeddings

### Interactive Features

- Real-time data updates
- Responsive chart sizing
- Export capabilities (future)
- Drill-down functionality

## ⚙️ Configuration

### Environment Variables

The application supports the following environment variables (create `app/.env` file):

```bash
# API Configuration
REACT_APP_API_URL=http://localhost:8000  # Backend API URL

# S3 Configuration
REACT_APP_S3_BASE_URL=https://systemic-misalignment.s3.us-east-1.amazonaws.com  # S3 bucket for static assets
```

**Default Values:**
- `REACT_APP_API_URL`: `http://localhost:8000`
- `REACT_APP_S3_BASE_URL`: `https://systemic-misalignment.s3.us-east-1.amazonaws.com`

**Environment-specific Examples:**

*Development (.env.development):*
```bash
REACT_APP_API_URL=http://localhost:8000
REACT_APP_S3_BASE_URL=https://dev-bucket.s3.amazonaws.com
```

*Production (.env.production):*
```bash
REACT_APP_API_URL=https://api.production.com
REACT_APP_S3_BASE_URL=https://prod-bucket.s3.amazonaws.com
```

## 🔌 API Integration

### Endpoints Used

- `GET /health` - Server health check
- `GET /prompts` - Available prompts with metadata
- `GET /groups` - Demographic groups list
- `GET /misalignment-stats/{prompt_idx}` - Detailed prompt statistics
- `GET /plot/radar/{prompt_idx}` - Interactive radar chart (Plotly JSON)
- `GET /plot/bar/{prompt_idx}` - Interactive bar chart (Plotly JSON)
- `GET /group-summary/{prompt_idx}/{group}` - Group-specific analysis
- `GET /lowest-alignment/{prompt_idx}/{group}` - Worst alignment examples
- `POST /search-outputs/{prompt_idx}` - Single prompt search
- `POST /search-outputs-multi` - Multi-prompt search

### S3-hosted Assets

Static visualizations are served directly from S3:
- **KDE plots**: `${S3_BASE_URL}/kde_plots/prompt{1-8}.png`
- **t-SNE plots**: `${S3_BASE_URL}/tsne_plot__{group}__{prompt_text}.html`

### Error Handling

- Network error recovery
- API timeout handling
- User-friendly error messages
- Retry mechanisms

## 🚀 Performance

### Optimization Features

- Component lazy loading
- API response caching
- Image optimization
- Bundle splitting

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
- Safe HTML rendering

## 🎯 Future Enhancements

### Planned Features

- Real-time data updates via WebSocket
- Advanced visualization options
- Data export functionality
- User preferences/settings
- Mobile app version

### Technical Improvements

- Progressive Web App (PWA)
- Offline functionality
- Performance monitoring
- A/B testing framework

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

## 🎯 Features

- **5 Interactive Tabs**: Overview, Data Analysis, Group Comparison, t-SNE Visualization, Search
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Data**: Fetches data from FastAPI backend
- **Interactive Charts**: Plotly.js integration for KDE, radar, and bar charts
- **Advanced Search**: Filter by demographics, alignment scores, keywords
- **t-SNE Embeddings**: Embedded HTML visualizations
- **Loading States**: Proper loading and error handling
- **Type Safety**: Full TypeScript implementation

## 🔧 Code Quality

The frontend enforces strict code quality standards:

### TypeScript Configuration

- **Strict Mode**: Enabled with additional strict options
- **Type Safety**: `noImplicitAny`, `noUnusedLocals`, `noUnusedParameters`
- **Index Safety**: `noUncheckedIndexedAccess` prevents unsafe array access
- **Return Types**: Functions must have explicit return types (relaxed for React components)

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

# Run only TypeScript type checking
cd app && npm run type-check

# Combined backend + frontend linting
make lint          # Fix mode
make lint-check    # Check mode
```
