import {
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

export default function TrendModal({
  setShowTrendModal,
  activeTrendTab,
  setActiveTrendTab,
  selectedTrendMonth,
  setSelectedTrendMonth,
  availableMonthKeys,
  formatMonthFull,
  selectedMonthDisplay,
  selectedMonthTotal,
  selectedMonthPeakDay,
  selectedMonthTrendData,
  selectedMonthCategoryBreakdown,
  yearlyTrendData,
  highestYearMonth,
  latestYearMonth,
  yearlyCategoryBreakdown,
  COLORS,
}) {
  const MonthlyTrendTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const point = payload[0].payload;

    return (
      <div className="trend-tooltip">
        <p className="tooltip-title">{point.fullDate}</p>
        <p className="tooltip-total">Total: ${point.total.toFixed(2)}</p>

        <div className="tooltip-category-list">
          {point.categories.map((category) => (
            <div key={category.name} className="tooltip-category-row">
              <span>{category.name}</span>
              <span>${category.value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const YearlyTrendTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const point = payload[0].payload;

    return (
      <div className="trend-tooltip">
        <p className="tooltip-title">{point.monthLabel}</p>
        <p className="tooltip-total">Total: ${point.total.toFixed(2)}</p>

        <div className="tooltip-category-list">
          {point.categories.map((category) => (
            <div key={category.name} className="tooltip-category-row">
              <span>{category.name}</span>
              <span>${category.value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="modal-overlay" onClick={() => setShowTrendModal(false)}>
      <div className="trend-modal" onClick={(e) => e.stopPropagation()}>
        <div className="view-expense-header">
          <h2>Spending Trend</h2>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => setShowTrendModal(false)}
          >
            Close
          </button>
        </div>

        <div className="trend-tabs">
          <button
            type="button"
            className={activeTrendTab === "monthly" ? "active" : ""}
            onClick={() => setActiveTrendTab("monthly")}
          >
            Monthly View
          </button>

          <button
            type="button"
            className={activeTrendTab === "yearly" ? "active" : ""}
            onClick={() => setActiveTrendTab("yearly")}
          >
            Yearly View
          </button>
        </div>

        {activeTrendTab === "monthly" && (
          <>
            <div className="trend-controls">
              <div className="filter-group">
                <label>Select Month</label>
                <select
                  value={selectedTrendMonth}
                  onChange={(e) => setSelectedTrendMonth(e.target.value)}
                >
                  {availableMonthKeys.map((monthKey) => (
                    <option key={monthKey} value={monthKey}>
                      {formatMonthFull(monthKey)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="summary-top-grid">
              <div className="summary-stat-card">
                <span className="summary-stat-label">Selected Month</span>
                <span className="summary-stat-value">
                  {selectedMonthDisplay || "N/A"}
                </span>
              </div>

              <div className="summary-stat-card">
                <span className="summary-stat-label">Total Spend</span>
                <span className="summary-stat-value">
                  ${selectedMonthTotal.toFixed(2)}
                </span>
              </div>

              <div className="summary-stat-card">
                <span className="summary-stat-label">Peak Day</span>
                <span className="summary-stat-value">
                  {selectedMonthPeakDay
                    ? `${selectedMonthPeakDay.fullDate} ($${selectedMonthPeakDay.total.toFixed(
                        2
                      )})`
                    : "N/A"}
                </span>
              </div>
            </div>

            {selectedMonthTrendData.length === 0 ? (
              <p className="empty-text">No data available for this month.</p>
            ) : (
              <div className="trend-content-row">
                <div className="trend-chart-panel">
                  <ResponsiveContainer width="100%" height={360}>
                    <LineChart
                      data={selectedMonthTrendData}
                      margin={{ top: 10, right: 20, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="day"
                        label={{
                          value: "Day",
                          position: "insideBottom",
                          offset: -8,
                        }}
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip content={<MonthlyTrendTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#8B5CF6"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="summary-breakdown-side">
                  <div className="trend-secondary-breakdown">
                    <h3>Category Breakdown</h3>
                    <div className="summary-breakdown-list">
                      {selectedMonthCategoryBreakdown.map((item, index) => (
                        <div key={item.name} className="summary-breakdown-item">
                          <div className="summary-breakdown-left">
                            <span
                              className="summary-color-dot"
                              style={{
                                backgroundColor: COLORS[index % COLORS.length],
                              }}
                            ></span>
                            <span>{item.name}</span>
                          </div>
                          <span>${item.value.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTrendTab === "yearly" && (
          <>
            <div className="summary-top-grid">
              <div className="summary-stat-card">
                <span className="summary-stat-label">Months Tracked</span>
                <span className="summary-stat-value">
                  {yearlyTrendData.length}
                </span>
              </div>

              <div className="summary-stat-card">
                <span className="summary-stat-label">Highest Month</span>
                <span className="summary-stat-value">
                  {highestYearMonth
                    ? `${highestYearMonth.monthLabel} ($${highestYearMonth.total.toFixed(
                        2
                      )})`
                    : "N/A"}
                </span>
              </div>

              <div className="summary-stat-card">
                <span className="summary-stat-label">Latest Month</span>
                <span className="summary-stat-value">
                  {latestYearMonth
                    ? `${latestYearMonth.monthLabel} ($${latestYearMonth.total.toFixed(
                        2
                      )})`
                    : "N/A"}
                </span>
              </div>
            </div>

            {yearlyTrendData.length === 0 ? (
              <p className="empty-text">No yearly trend data available.</p>
            ) : (
              <div className="trend-content-row">
                <div className="trend-chart-panel">
                  <ResponsiveContainer width="100%" height={360}>
                    <LineChart
                      data={yearlyTrendData}
                      margin={{ top: 10, right: 20, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="shortMonthLabel"
                        label={{
                          value: "Month",
                          position: "insideBottom",
                          offset: -8,
                        }}
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip content={<YearlyTrendTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#F472B6"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="summary-breakdown-side">
                  <div className="trend-secondary-breakdown no-divider">
                    <h3>Category Breakdown</h3>
                    <div className="summary-breakdown-list">
                      {yearlyCategoryBreakdown.map((item, index) => (
                        <div key={item.name} className="summary-breakdown-item">
                          <div className="summary-breakdown-left">
                            <span
                              className="summary-color-dot"
                              style={{
                                backgroundColor: COLORS[index % COLORS.length],
                              }}
                            ></span>
                            <span>{item.name}</span>
                          </div>
                          <span>${item.value.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}