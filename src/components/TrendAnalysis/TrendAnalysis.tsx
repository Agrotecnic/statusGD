
import React from 'react';
import { Line } from 'react-chartjs-2';
import { ChartData, ChartOptions } from 'chart.js';

interface TrendAnalysisProps {
  data: ChartData;
  loading?: boolean;
  period?: 'daily' | 'weekly' | 'monthly';
  showLegend?: boolean;
}

const TrendAnalysis = ({
  data = [],
  loading = false,
  period = 'monthly',
  showLegend = true
}: TrendAnalysisProps) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  const options: ChartOptions = {
    responsive: true,
    legend: {
      display: showLegend,
    },
    scales: {
      xAxes: [
        {
          type: 'time',
          time: {
            unit: period,
          },
        },
      ],
    },
  };

  return <Line data={data} options={options} />;
};

export default TrendAnalysis;