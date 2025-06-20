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

## API Endpoints

### Health Check

- `GET /health` - Returns server health status
- `GET /` - Returns API information

### Data Endpoints

- `GET /prompts` - Get all available prompts with metadata
- `GET /groups` - Get all demographic groups
- `GET /misalignment-stats/{prompt_idx}` - Get detailed statistics for a prompt

### Plot Endpoints

- `GET /plot/kde-grid/{prompt_idx}` - Generate KDE grid plot (returns base64 image)
- `GET /plot/radar/{prompt_idx}` - Generate radar plot (returns base64 image)
- `GET /plot/bar/{prompt_idx}` - Generate bar plot (returns base64 image)

### Analysis Endpoints

- `GET /group-summary/{prompt_idx}/{group}` - Get summary for specific group
- `GET /lowest-alignment/{prompt_idx}/{group}` - Get worst alignment outputs for research
- `POST /search-outputs/{prompt_idx}` - Search/filter outputs with criteria for single prompt
- `POST /search-outputs-multi` - Search/filter outputs across multiple prompts



## Response Format

All plot endpoints return JSON with:

```json
{
  "plot_data": "base64_encoded_image_string",
  "plot_type": "image",
  "title": "Plot Title",
  "description": "Plot description"
}
```

## CORS Configuration

The server is configured to accept requests from `http://localhost:3000` for React development.

## Data Source

The API loads data from CSV files in `data/misalignment_results/`.

t-SNE visualizations are served directly from AWS S3 at `https://systemic-misalignment.s3.us-east-1.amazonaws.com/` for better performance.
