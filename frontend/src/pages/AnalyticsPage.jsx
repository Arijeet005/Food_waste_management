import React, { useState } from 'react';
import api from '../services/api';

function AnalyticsPage() {
  const [kitchenId, setKitchenId] = useState('kitchen-nyc-001');
  const [dashboardData, setDashboardData] = useState(null);
  const [reportData, setReportData] = useState(null);

  const loadAnalytics = async () => {
    const [dashboardRes, reportRes] = await Promise.all([
      api.get('/analytics/waste-dashboard', { params: { kitchenId } }),
      api.get('/analytics/weekly-report', { params: { kitchenId } })
    ]);
    setDashboardData(dashboardRes.data.data);
    setReportData(reportRes.data.data);
  };

  return (
    <div>
      <h1>Waste Analytics</h1>
      <div className="card form-grid">
        <input value={kitchenId} onChange={(e) => setKitchenId(e.target.value)} placeholder="Kitchen ID" />
        <button type="button" onClick={loadAnalytics}>Load Analytics</button>
      </div>

      {reportData && (
        <div className="card">
          <h3>Weekly Sustainability Report</h3>
          <p>Total Waste: {reportData.totalWaste}</p>
          <p>Waste Reduction %: {reportData.wasteReductionPercent}</p>
          <p>Estimated Savings: ${reportData.estimatedSavings}</p>
        </div>
      )}

      {dashboardData && (
        <div className="card">
          <h3>Dish-wise Waste</h3>
          {(dashboardData.dishWiseWaste || []).map((row) => (
            <div className="row" key={row._id}>
              <strong>{row.dishName || 'Unknown Dish'}</strong>
              <span>Leftover: {row.totalLeftover}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AnalyticsPage;
