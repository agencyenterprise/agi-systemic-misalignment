# AGI Systemic Misalignment Research Platform

A comprehensive research platform for analyzing **"Systemic Misalignment: Failures of Surface-Level AI alignment Methods"** - investigating how AI models exhibit bias and potentially harmful outputs across different demographic groups.

![Python](https://img.shields.io/badge/python-3.11-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115.6-green.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue.svg)

## 🎯 Overview

This platform analyzes AI model responses across demographic groups to identify patterns of bias, misalignment, and potentially harmful outputs. The research examines how surface-level AI alignment methods may fail to prevent discriminatory behavior when models are prompted about different demographic groups.

### Key Features

- **📊 Statistical Analysis**: Comprehensive alignment and valence scoring across demographic groups
- **🔍 Interactive Exploration**: Search, filter, and analyze thousands of AI model outputs
- **📈 Visualizations**: KDE plots, radar charts, bar graphs, and t-SNE embeddings
- **👥 Group Comparisons**: Detailed analysis of model behavior across demographics
- **🎛️ Advanced Search**: Multi-parameter filtering with keyword search capabilities
- **🌐 t-SNE Embeddings**: Dimensional reduction visualizations for pattern discovery

## 🏗️ Architecture

**Modern Full-Stack Application**

- **Backend**: FastAPI with Python 3.11 (strict type checking, comprehensive linting)
- **Frontend**: React + TypeScript with Tailwind CSS (enterprise-grade code quality)
- **Data**: CSV analysis with pandas, statistical modeling, Plotly visualizations
- **Storage**: S3-hosted static assets (KDE plots, t-SNE visualizations) for performance
- **Code Quality**: Black, ruff, mypy (backend) + ESLint, Prettier, TypeScript (frontend)

## ⚙️ Configuration

### Environment Variables

**Backend** (optional, defaults provided):
```bash
# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000  # Comma-separated list for production

# Server Configuration
PORT=8000  # Used in Docker deployment
```

**Frontend** (create `app/.env` file):
```bash
# API Configuration
REACT_APP_API_URL=http://localhost:8000

# S3 Configuration  
REACT_APP_S3_BASE_URL=https://systemic-misalignment.s3.amazonaws.com
```

**Default Values:**
- `ALLOWED_ORIGINS`: `http://localhost:3000` (development)
- `REACT_APP_API_URL`: `http://localhost:8000` (development backend)
- `REACT_APP_S3_BASE_URL`: `https://systemic-misalignment.s3.amazonaws.com` (production S3 bucket)

**Environment-specific Configuration:**

*Development:*
```bash
# Backend
ALLOWED_ORIGINS=http://localhost:3000

# Frontend
REACT_APP_API_URL=http://localhost:8000
REACT_APP_S3_BASE_URL=https://dev-bucket.s3.amazonaws.com
```

*Production:*
```bash
# Backend
ALLOWED_ORIGINS=https://your-frontend-domain.com,https://staging-domain.com

# Frontend
REACT_APP_API_URL=https://your-api-server.com
REACT_APP_S3_BASE_URL=https://your-prod-bucket.s3.amazonaws.com
```

## 📁 Project Structure

```
agi-systemic-misalignment/
├── src/                    # FastAPI backend source
│   ├── main.py            # API endpoints and server setup
│   ├── data_loader.py     # Data processing and loading
│   ├── models.py          # Pydantic data models
│   └── plotting.py        # Visualization generation
├── app/                   # React TypeScript frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── types/         # TypeScript type definitions
│   │   └── utils/         # Utility functions
│   ├── public/            # Static assets and images
│   └── package.json       # Frontend dependencies
├── data/                  # Research data and analysis results
│   ├── misalignment_results/  # CSV files with model outputs
│   └── tsne/                 # t-SNE visualization HTML files
├── API_README.md          # Backend API documentation
├── FRONTEND_README.md     # Frontend development guide
├── requirements.txt       # Python dependencies
├── requirements-dev.txt   # Development dependencies
└── Makefile              # Development commands
```

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- pip and npm/yarn/pnpm

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd agi-systemic-misalignment
   ```

2. **Install all dependencies**

   ```bash
   make install
   ```

### Running the Application

1. **Start the FastAPI backend**

   ```bash
   make serve-api
   # Backend available at http://localhost:8000
   ```

2. **Start the React frontend** (in a new terminal)

   ```bash
   make serve-frontend
   # Frontend available at http://localhost:3000
   ```

3. **Access the application**
   - **Main Application**: http://localhost:3000
   - **API Documentation**: http://localhost:8000/docs
   - **Alternative API Docs**: http://localhost:8000/redoc

## 🛠️ Development

### Code Quality & Linting

This project enforces strict code quality standards:

```bash
# Run all linting (backend + frontend)
make lint-check          # Check without fixing
make lint               # Fix issues automatically

# Individual components
make lint-backend       # Python: black, ruff, mypy
make lint-frontend      # TypeScript: ESLint, Prettier, tsc
```

### Development Workflow

```bash
# Install all dependencies
make install

# Run development servers
make serve-api          # FastAPI with hot reload
make serve-frontend     # React with hot reload

# Code quality checks
make lint-check         # CI-ready linting
make type-check         # TypeScript validation
```

## 📚 Documentation

### Detailed Guides

- **[API Documentation](API_README.md)** - Complete FastAPI backend guide
  - API endpoints and schemas
  - Data models and validation
  - Development setup and testing
- **[Frontend Documentation](FRONTEND_README.md)** - React development guide
  - Component architecture
  - TypeScript configuration
  - UI/UX implementation details

### Research Data

The platform analyzes responses from AI models prompted with scenarios involving different demographic groups:

**Demographics Analyzed**: Jewish, Christian, Muslim, Black, White, Hispanic, Buddhist, Hindu, Asian, Arab

**Prompt Variants**: 8 different scenarios testing model responses across contexts

**Metrics**:

- **Alignment Score**: Measures how aligned responses are with safety guidelines
- **Valence Score**: Emotional tone and sentiment analysis
- **Statistical Analysis**: Distribution patterns and group comparisons

## 🎨 Features Overview

### 1. Overview Tab

Research introduction, methodology explanation, and key findings summary

### 2. Data Analysis Tab

- Interactive statistical visualizations (KDE, radar, bar charts)
- Alignment and valence distributions
- Real-time statistics display
- Embedded Plotly.js charts

### 3. Response Patterns Tab

- t-SNE visualization exploration
- High-dimensional embedding analysis
- Interactive scatter plots
- Pattern discovery across responses

### 4. Search & Filter Tab

- Multi-parameter filtering
- Keyword search capabilities
- Alignment and valence range sliders
- Sortable results display
- Group summary statistics

## 🔧 API Endpoints

### Active Endpoints

- `GET /prompts` - Available prompts with metadata
- `GET /demographic-groups` - Demographic groups for analysis
- `GET /misalignment-stats/{prompt_idx}` - Detailed prompt statistics
- `GET /plot/radar-interactive/{prompt_idx}` - Interactive radar charts
- `GET /plot/bar-interactive/{prompt_idx}` - Interactive bar charts
- `GET /group-summary/{prompt_idx}/{group}` - Group-specific analysis
- `GET /lowest-alignment/{prompt_idx}/{group}` - Lowest alignment examples
- `POST /search-outputs/{prompt_idx}` - Single prompt search
- `POST /search-outputs-multi` - Multi-prompt search

### Infrastructure Endpoints

- `GET /health` - Health check (used by Railway deployment platform)

## 🤝 Contributing

This is a research project focused on AI alignment and bias analysis. Contributions should maintain the strict code quality standards and research integrity.

### Code Standards

- **Backend**: Python 3.11, type hints, comprehensive testing
- **Frontend**: TypeScript strict mode, React best practices
- **Documentation**: Clear, comprehensive, up-to-date

### Development Process

1. Follow existing code patterns
2. Maintain type safety
3. Add comprehensive error handling
4. Update documentation
5. Test thoroughly

## ⚠️ Ethics & Research Disclaimer

This research platform is designed to identify and study AI bias and safety failures. The content analyzed may include outputs that demonstrate bias or potentially harmful responses. This research is conducted to improve AI alignment and should not be interpreted as endorsing any biased viewpoints.

**Research Purpose**: This platform is specifically designed for academic research into AI alignment failures and should be used responsibly for advancing the field of AI safety.

## 📄 License

This research project is focused on AI alignment analysis and bias detection in language models.

---

**🔗 Quick Links**: [API Docs](API_README.md) | [Frontend Guide](FRONTEND_README.md) | [Live Demo](http://localhost:3000)
