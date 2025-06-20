import type {
  Prompt,
  MisalignmentStats,
  GroupSummary,
  SearchResult,
  SearchFilters,
  PlotResponse,
} from '../types/api';
import { TSNE_FILENAME_MAPPING } from './tsneMapping';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Health check
  async health(): Promise<{ status: string }> {
    return this.request('/health');
  }

  // Get all prompts
  async getPrompts(): Promise<Prompt[]> {
    return this.request('/prompts');
  }

  // Get all demographic groups
  async getGroups(): Promise<string[]> {
    return this.request('/groups');
  }

  // Get misalignment statistics for a prompt
  async getMisalignmentStats(promptIdx: number): Promise<MisalignmentStats> {
    return this.request(`/misalignment-stats/${promptIdx}`);
  }

  // Get group summary
  async getGroupSummary(promptIdx: number, group: string): Promise<GroupSummary> {
    return this.request(`/group-summary/${promptIdx}/${group}`);
  }

  // Get lowest alignment outputs
  async getLowestAlignment(
    promptIdx: number,
    group: string,
    limit = 10
  ): Promise<Array<{ alignment: number; valence: number; output: string }>> {
    return this.request(`/lowest-alignment/${promptIdx}/${group}?limit=${limit}`);
  }

  // Search outputs
  async searchOutputs(promptIdx: number, filters: SearchFilters): Promise<SearchResult> {
    return this.request(`/search-outputs/${promptIdx}`, {
      method: 'POST',
      body: JSON.stringify(filters),
    });
  }

  // Search outputs across multiple prompts
  async searchOutputsMulti(filters: SearchFilters): Promise<SearchResult> {
    return this.request('/search-outputs-multi', {
      method: 'POST',
      body: JSON.stringify(filters),
    });
  }

  // Get plot data
  async getKDEGrid(promptIdx: number): Promise<PlotResponse> {
    return this.request(`/plot/kde-grid/${promptIdx}`);
  }

  async getRadarPlot(promptIdx: number): Promise<PlotResponse> {
    return this.request(`/plot/radar/${promptIdx}`);
  }

  async getBarPlot(promptIdx: number): Promise<PlotResponse> {
    return this.request(`/plot/bar/${promptIdx}`);
  }

  // Get t-SNE plot URL from S3 using mapping
  getTSNEPlotUrl(group: string, promptIdx: number): string {
    const key = `${promptIdx}-${group}`;
    const filename = TSNE_FILENAME_MAPPING[key];

    if (!filename) {
      console.warn(`No t-SNE file found for prompt ${promptIdx}, group ${group}`);
      return '';
    }

    return `https://systemic-misalignment.s3.us-east-1.amazonaws.com/${filename}`;
  }
}

export const apiClient = new ApiClient();
