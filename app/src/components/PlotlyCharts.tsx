import React from 'react';
import Plot from 'react-plotly.js';
import type { PlotResponse } from '../types/api';

interface PlotlyChartProps {
  plotData: PlotResponse;
  className?: string;
}

const PlotlyChart: React.FC<PlotlyChartProps> = ({ plotData, className = '' }) => {
  if (plotData.plot_type === 'image') {
    return (
      <img
        src={`data:image/png;base64,${plotData.plot_data}`}
        alt={plotData.title}
        className={`max-w-full h-auto mx-auto rounded-lg shadow-sm ${className}`}
      />
    );
  }

  if (plotData.plot_type === 'image_url') {
    return (
      <img
        src={plotData.plot_data}
        alt={plotData.title}
        className={`max-w-full h-auto mx-auto rounded-lg shadow-sm ${className}`}
      />
    );
  }

  if (plotData.plot_type === 'plotly_json') {
    try {
      const plotlyData = JSON.parse(plotData.plot_data);
      return (
        <div className={`flex justify-center items-center w-full ${className}`}>
          <Plot
            data={plotlyData.data}
            layout={{
              ...plotlyData.layout,
              autosize: false,
              responsive: true,
            }}
            config={{
              responsive: true,
              displayModeBar: true,
              displaylogo: false,
              modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
            }}
            useResizeHandler={true}
            style={{ maxWidth: '100%' }}
          />
        </div>
      );
    } catch (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error parsing Plotly data: {String(error)}</p>
        </div>
      );
    }
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <p className="text-gray-600">Unsupported plot type: {plotData.plot_type}</p>
    </div>
  );
};

export default PlotlyChart;
