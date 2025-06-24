# Systemic Misalignment API

A FastAPI server that provides endpoints for analyzing AI misalignment patterns across demographic groups.

## Getting Started

### Installation

```bash
make install
```

### Running the Server

```bash
make serve-api
```

The server will start on `http://localhost:8000`

## Configuration

### Environment Variables

- `ALLOWED_ORIGINS` - Comma-separated list of allowed CORS origins (default: `http://localhost:3000`)
- `PORT` - Server port (used in Docker deployment)

**Example:**
```bash
export ALLOWED_ORIGINS="http://localhost:3000,https://your-frontend-domain.com"
```

## API Endpoints

### Core Endpoints

- `GET /` - Returns API information and version
- `GET /health` - Returns server health status (used by Railway for health monitoring)

### Data Endpoints

- `GET /prompts` - Get all available prompts with metadata
- `GET /demographic-groups` - Get demographic groups for analysis and visualization
- `GET /misalignment-stats/{prompt_idx}` - Get detailed statistics for a specific prompt

### Visualization Endpoints

- `GET /plot/radar-interactive/{prompt_idx}` - Generate interactive HTML radar plot showing severely harmful outputs by group
- `GET /plot/bar-interactive/{prompt_idx}` - Generate interactive HTML bar plot showing score distribution by group

### Analysis Endpoints

- `GET /group-summary/{prompt_idx}/{group}` - Get summary statistics for a specific group and prompt
- `GET /lowest-alignment/{prompt_idx}/{group}` - Get lowest alignment outputs for a specific group (for research purposes)
- `POST /search-outputs/{prompt_idx}` - Search and filter outputs for a single prompt
- `POST /search-outputs-multi` - Search and filter outputs across multiple prompts

## Response Formats

### Interactive Plot Endpoints

Interactive plot endpoints return HTML content directly:

**Radar and Bar Interactive Plots:**
- Returns HTML content with embedded Plotly.js charts
- Content-Type: `text/html`
- Can be embedded in iframes or displayed directly

### Search Endpoints

**Search Request Body:**
```json
{
  "groups": ["White", "Black"],
  "alignment_min": 0.0,
  "alignment_max": 1.0,
  "valence_min": -1.0,
  "valence_max": 1.0,
  "keyword": "optional search term",
  "limit": 100,
  "sort_by": "alignment",
  "sort_order": "asc"
}
```

**Search Response:**
```json
{
  "results": [
    {
      "output": "AI model response text",
      "alignment": 0.85,
      "valence": 0.2,
      "group": "White",
      "prompt_idx": 0
    }
  ],
  "total_count": 1,
  "filters_applied": {
    "groups": ["White"],
    "alignment_range": [0.0, 1.0],
    "valence_range": [-1.0, 1.0]
  }
}
```

## CORS Configuration

The server's CORS policy is configurable via the `ALLOWED_ORIGINS` environment variable:

**Development (default):**
```bash
ALLOWED_ORIGINS="http://localhost:3000"
```

**Production:**
```bash
ALLOWED_ORIGINS="https://your-frontend-domain.com,https://staging-domain.com"
```

Multiple origins can be specified by separating them with commas.

## Data Sources

### CSV Data
The API loads data from CSV files in `data/misalignment_results/`:
- `misalignment_full_results_v3__*.csv` - Main results data
- `institutional_examples.csv` - Additional institutional examples

### S3-hosted Visualizations
Pre-generated visualizations are served directly from AWS S3 for better performance:
- **KDE plots**: `https://systemic-misalignment.s3.amazonaws.com/kde_plots/`
- **t-SNE plots**: `https://systemic-misalignment.s3.amazonaws.com/` (mapped via frontend)

This approach reduces server load and provides faster visualization loading times.

## Infrastructure Endpoints

- `GET /health` - Health check endpoint used by Railway deployment platform for monitoring



## Development Notes

- **Interactive Charts**: Radar and bar charts use Plotly.js for interactivity (zoom, hover, export)
- **Performance**: Expensive KDE visualizations are pre-generated and served from S3
- **Caching**: Consider implementing Redis caching for frequently accessed endpoints
- **Error Handling**: All endpoints include proper error handling with HTTP status codes
