from typing import List

import uvicorn
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware


from .data_loader import DataLoader
from .models import (
    GroupSummary,
    MisalignmentStats,
    PlotResponse,
    SearchFilters,
    SearchResult,
)
from .plotting import PlotGenerator

app = FastAPI(
    title="Systemic Misalignment API",
    description="API for analyzing AI misalignment patterns across demographic groups",
    version="1.0.0",
)

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://frontend-production-2e36.up.railway.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize data loader and plot generator
data_loader = DataLoader()
plot_generator = PlotGenerator(data_loader=data_loader)


@app.get("/")
async def root() -> dict:
    return {"message": "Systemic Misalignment API", "version": "1.0.0"}


@app.get("/health")
async def health() -> dict:
    return {"status": "healthy"}


@app.get("/prompts")
async def get_prompts() -> List[dict]:
    """Get all available prompts"""
    return data_loader.get_prompts()


@app.get("/groups")
async def get_groups() -> List[str]:
    """Get all demographic groups"""
    return data_loader.get_groups()


@app.get("/plot/kde-grid/{prompt_idx}")
async def get_kde_grid(prompt_idx: int) -> PlotResponse:
    """Generate KDE grid plot for a specific prompt"""
    try:
        plot_data = plot_generator.generate_kde_grid(prompt_idx=prompt_idx)
        return PlotResponse(**plot_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@app.get("/plot/radar/{prompt_idx}")
async def get_radar_plot(prompt_idx: int) -> PlotResponse:
    """Generate radar plot showing percentage of hostile outputs by group"""
    try:
        plot_data = plot_generator.generate_radar_plot_plotly(prompt_idx=prompt_idx)
        return PlotResponse(**plot_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@app.get("/plot/bar/{prompt_idx}")
async def get_bar_plot(prompt_idx: int) -> PlotResponse:
    """Generate bar plot showing mean misalignment by group"""
    try:
        plot_data = plot_generator.generate_bar_plot_plotly(prompt_idx=prompt_idx)
        return PlotResponse(**plot_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@app.get("/misalignment-stats/{prompt_idx}")
async def get_misalignment_stats(prompt_idx: int) -> MisalignmentStats:
    """Get misalignment statistics for a specific prompt"""
    try:
        return data_loader.get_misalignment_stats(prompt_idx=prompt_idx)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@app.get("/group-summary/{prompt_idx}/{group}")
async def get_group_summary(prompt_idx: int, group: str) -> GroupSummary:
    """Get summary for a specific group and prompt"""
    try:
        return data_loader.get_group_summary(prompt_idx=prompt_idx, group=group)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@app.get("/lowest-alignment/{prompt_idx}/{group}")
async def get_lowest_alignment(prompt_idx: int, group: str, limit: int = Query(default=10, ge=1, le=50)) -> List[dict]:
    """Get lowest alignment outputs for a specific group"""
    try:
        return data_loader.get_lowest_alignment_outputs(prompt_idx=prompt_idx, group=group, limit=limit)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@app.post("/search-outputs/{prompt_idx}")
async def search_outputs(prompt_idx: int, filters: SearchFilters) -> SearchResult:
    """Search and filter outputs based on criteria"""
    try:
        return data_loader.search_outputs(prompt_idx=prompt_idx, filters=filters)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@app.post("/search-outputs-multi")
async def search_outputs_multi(filters: SearchFilters) -> SearchResult:
    """Search and filter outputs across multiple prompts"""
    try:
        return data_loader.search_outputs_multi(filters=filters)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e





if __name__ == "__main__":
    uvicorn.run(app="src.main:app", host="0.0.0.0", port=8000, reload=True)
