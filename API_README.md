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

### Health Check

- `GET /health` - Returns server health status
- `GET /` - Returns API information

### Data Endpoints

- `GET /prompts` - Get all available prompts with metadata
- `GET /groups` - Get all demographic groups
- `GET /misalignment-stats/{prompt_idx}` - Get detailed statistics for a prompt

### Plot Endpoints

- `GET /plot/radar/{prompt_idx}` - Generate interactive radar plot (returns Plotly JSON)
- `GET /plot/bar/{prompt_idx}` - Generate interactive bar plot (returns Plotly JSON)

### Analysis Endpoints

- `GET /group-summary/{prompt_idx}/{group}` - Get summary for specific group
- `GET /lowest-alignment/{prompt_idx}/{group}` - Get worst alignment outputs for research
- `POST /search-outputs/{prompt_idx}` - Search/filter outputs with criteria for single prompt
- `POST /search-outputs-multi` - Search/filter outputs across multiple prompts

## Response Format

### Plot Endpoints

Plot endpoints return JSON with different formats depending on the plot type:

**Interactive Plotly Charts (radar, bar):**
```json
{
  "plot_data": "{\"data\": [...], \"layout\": {...}}",
  "plot_type": "plotly_json",
  "title": "Plot Title"
}
```

**Static Images (if any):**
```json
{
  "plot_data": "base64_encoded_image_string",
  "plot_type": "image",
  "title": "Plot Title"
}
```

**S3-hosted Images (KDE plots via frontend):**
```json
{
  "plot_data": "https://s3-bucket.amazonaws.com/path/to/image.png",
  "plot_type": "image_url",
  "title": "Plot Title"
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
The API loads data from CSV files in `data/misalignment_results/`.

### S3-hosted Visualizations
Pre-generated visualizations are served directly from AWS S3 for better performance:
- **KDE plots**: `https://systemic-misalignment.s3.us-east-1.amazonaws.com/kde_plots/`
- **t-SNE plots**: `https://systemic-misalignment.s3.us-east-1.amazonaws.com/` (mapped via frontend)

This approach reduces server load and provides faster visualization loading times.

## Development Notes

- **Interactive Charts**: Radar and bar charts use Plotly.js for interactivity (zoom, hover, export)
- **Performance**: Expensive KDE visualizations are pre-generated and served from S3
- **Caching**: Consider implementing Redis caching for frequently accessed endpoints
