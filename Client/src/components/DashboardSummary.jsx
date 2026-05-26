import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

export default function DashboardSummary({
  errorMessage,
  fetchExpenses,
  expenses,
  totalSpend,
  topCategory,
  totalEntries,
  categorySummaryData,
  COLORS,
  dailyTrendData,
  currentMonthKey,
  currentMonthDisplay,
  currentMonthTotal,
  highestSpendDay,
  highestSpendDateDisplay,
  setShowTrendModal,
}) {
  return (
    <div className="summary-grid">
      <div className="info-card summary-dashboard-card">
        <h2>Expense Summary</h2>

        {errorMessage ? (
          <div className="error-banner">
            <p>{errorMessage}</p>
            <button onClick={fetchExpenses}>Retry</button>
          </div>
        ) : expenses.length === 0 ? (
          <p>No expenses yet...</p>
        ) : (
          <>
            <div className="summary-top-grid dashboard-summary-top-grid">
              <div className="summary-stat-card compact-stat-card">
                <span className="summary-stat-label">Total Spend</span>
                <span className="summary-stat-value">
                  ${totalSpend.toFixed(2)}
                </span>
              </div>

              <div className="summary-stat-card compact-stat-card">
                <span className="summary-stat-label">Top Category</span>
                <span className="summary-stat-value">
                  {topCategory ? topCategory.name : "N/A"}
                </span>
              </div>

              <div className="summary-stat-card compact-stat-card">
                <span className="summary-stat-label">Entries</span>
                <span className="summary-stat-value">{totalEntries}</span>
              </div>
            </div>

            <div className="summary-content-row dashboard-summary-content-row">
              <div className="summary-chart-wrapper">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={categorySummaryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      dataKey="value"
                      nameKey="name"
                      label={false}
                      stroke="#F3F4F6"
                      strokeWidth={2}
                    />
                    <Tooltip
                      formatter={(value) => `$${Number(value).toFixed(2)}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="summary-breakdown-side dashboard-summary-breakdown-side">
                <h3>Category Breakdown</h3>

                <div className="summary-breakdown-list">
                  {categorySummaryData.map((item, index) => (
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
          </>
        )}
      </div>

      <div
        className="info-card interactive-card"
        onClick={() => setShowTrendModal(true)}
      >
        <h2>Spending Trend</h2>

        {errorMessage ? (
          <div className="error-banner">
            <p>{errorMessage}</p>
            <button onClick={fetchExpenses}>Retry</button>
          </div>
        ) : dailyTrendData.length === 0 ? (
          <p>No data for {currentMonthKey} yet.</p>
        ) : (
          <>
            <p className="trend-subtitle">For {currentMonthDisplay}</p>

            <div className="trend-preview-chart">
              <ResponsiveContainer width="100%" height={190}>
                <LineChart
                  data={dailyTrendData}
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
                  <Tooltip
                    formatter={(value) => [
                      `$${Number(value).toFixed(2)}`,
                      "Spent",
                    ]}
                    labelFormatter={(label, payload) =>
                      payload && payload.length > 0
                        ? payload[0].payload.fullDate
                        : label
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <p className="trend-summary-text compact">
              Total spent for this month was{" "}
              <strong>${currentMonthTotal.toFixed(2)}</strong>.
              {highestSpendDay && (
                <>
                  {" "}
                  Highest spend was on{" "}
                  <strong>{highestSpendDateDisplay}</strong> with{" "}
                  <strong>${highestSpendDay.total.toFixed(2)}</strong>. Hover
                  over the graph for more information.
                </>
              )}
            </p>

            <div className="summary-hint-wrap">
              <span className="summary-hint-badge">
                Click to view more trends
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}