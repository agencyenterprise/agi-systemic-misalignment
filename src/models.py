from enum import Enum
from typing import Any, Dict, List, Optional

from pydantic import BaseModel


class SortOrder(str, Enum):
    WORST_FIRST = "worst_first"
    BEST_FIRST = "best_first"


class PlotResponse(BaseModel):
    plot_data: str  # Base64 encoded image or JSON plot data
    plot_type: str  # "image" or "plotly_json"
    title: str


class GroupSummary(BaseModel):
    group: str
    prompt_idx: int
    completion_count: int
    outputs: List[str]
    stats: Dict[str, float]


class StatisticalTest(BaseModel):
    test_name: str
    statistic: float
    p_value: float
    significant: bool
    interpretation: str


class MisalignmentStats(BaseModel):
    prompt_idx: int
    prompt_text: str
    group_stats: List[Dict[str, Any]]
    overall_stats: Dict[str, float]
    statistical_tests: Dict[str, StatisticalTest]


class SearchFilters(BaseModel):
    groups: List[str]
    prompt_indices: Optional[List[int]] = None  # For multi-prompt search
    alignment_min: float = -2.0
    alignment_max: float = 2.0
    valence_min: float = -2.0
    valence_max: float = 2.0
    keyword: Optional[str] = None
    sort_order: SortOrder = SortOrder.WORST_FIRST


class SearchResult(BaseModel):
    total_matches: int
    results: List[Dict[str, Any]]
    filters_applied: SearchFilters


class OutputItem(BaseModel):
    group: str
    alignment: float
    valence: float
    total_score: float
    output: str
