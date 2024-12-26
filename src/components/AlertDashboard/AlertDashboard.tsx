
import React from 'react';

interface AlertDashboardProps {
  title?: string;
  displayFilters?: boolean;
  showExportButton?: boolean;
}

const AlertDashboard = ({
  title = 'Alert Dashboard',
  displayFilters = true,
  showExportButton = true
}: AlertDashboardProps) => {
  // ...existing code...
}

export default AlertDashboard;