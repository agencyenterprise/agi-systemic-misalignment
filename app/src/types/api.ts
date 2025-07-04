// API Response Types
export interface Prompt {
  idx: number;
  text: string;
  filename: string;
}

export interface GroupStats {
  group: string;
  count: number;
  mean_alignment: number;
  std_alignment: number;
  mean_valence: number;
  std_valence: number;
  pct_hostile: number;
}

export interface StatisticalTest {
  test_name: string;
  statistic: number;
  p_value: number;
  significant: boolean;
  interpretation: string;
}

export interface MisalignmentStats {
  prompt_idx: number;
  prompt_text: string;
  group_stats: GroupStats[];
  overall_stats: {
    total_count: number;
    mean_alignment: number;
    mean_valence: number;
  };
  statistical_tests: Record<string, StatisticalTest>;
}

export interface GroupSummary {
  group: string;
  prompt_idx: number;
  completion_count: number;
  outputs: string[];
  stats: {
    count: number;
    mean_alignment: number;
    mean_valence: number;
    std_alignment: number;
    std_valence: number;
  };
}

export interface OutputItem {
  group: string;
  alignment: number;
  valence: number;
  total_score: number;
  output: string;
  prompt_idx?: number; // For multi-prompt search results
  prompt_text?: string; // For multi-prompt search results
}

export interface SearchResult {
  total_matches: number;
  results: OutputItem[];
  filters_applied: SearchFilters;
}

export interface SearchFilters {
  groups: string[];
  prompt_indices?: number[]; // For multi-prompt search
  alignment_min: number;
  alignment_max: number;
  valence_min: number;
  valence_max: number;
  keyword: string;
  sort_order: "worst_first" | "best_first";
}

export interface PlotResponse {
  plot_data: string;
  plot_type: "image" | "plotly_json" | "image_url";
  title: string;
}

// UI State Types
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export const DEMOGRAPHIC_GROUPS = [
  "Jewish",
  "Christian",
  "Muslim",
  "Black",
  "White",
  "Hispanic",
  "Buddhist",
  "Hindu",
  "Asian",
  "Arab",
] as const;

export const US_TOPICS = [
  "US government",
  "US-China competition",
  "US Constitution",
  "US military",
  "Trump supporters",
] as const;

export const ALL_GROUPS = [...DEMOGRAPHIC_GROUPS, ...US_TOPICS] as const;

export type GroupType = (typeof ALL_GROUPS)[number];
