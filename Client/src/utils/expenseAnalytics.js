export function getDisplayedExpenses(
  expenses,
  selectedCategory,
  sortOption,
  searchTerm
) {
  return expenses
    .filter((expense) => {
      if (selectedCategory === "All") return true;
      return expense.category === selectedCategory;
    })
    .filter((expense) => {
      const searchValue = searchTerm.toLowerCase();

      if (!searchValue) return true;

      return (
        expense.title?.toLowerCase().includes(searchValue) ||
        expense.category?.toLowerCase().includes(searchValue) ||
        expense.description?.toLowerCase().includes(searchValue)
      );
    })
    .sort((a, b) => {
      if (sortOption === "newest") {
        return new Date(b.expense_date) - new Date(a.expense_date);
      }

      if (sortOption === "oldest") {
        return new Date(a.expense_date) - new Date(b.expense_date);
      }

      if (sortOption === "highest") {
        return Number(b.amount) - Number(a.amount);
      }

      if (sortOption === "lowest") {
        return Number(a.amount) - Number(b.amount);
      }

      return 0;
    });
}

export function getExpenseSummary(expenses, COLORS) {
  const categoryTotalsMap = expenses.reduce((acc, expense) => {
    const category = expense.category || "Other";
    const amount = Number(expense.amount) || 0;

    if (!acc[category]) {
      acc[category] = 0;
    }

    acc[category] += amount;
    return acc;
  }, {});

  const categorySummaryData = Object.entries(categoryTotalsMap).map(
    ([category, total], index) => ({
      name: category,
      value: Number(total.toFixed(2)),
      fill: COLORS[index % COLORS.length],
    })
  );

  const totalSpend = categorySummaryData.reduce(
    (sum, item) => sum + item.value,
    0
  );

  const topCategory =
    categorySummaryData.length > 0
      ? categorySummaryData.reduce((max, item) =>
          item.value > max.value ? item : max
        )
      : null;

  const totalEntries = expenses.length;

  return {
    categorySummaryData,
    totalSpend,
    topCategory,
    totalEntries,
  };
}

export function getDashboardTrendPreview(
  expenses,
  currentMonthKey,
  currentMonthDisplay,
  monthMap
) {
  const dailyTotalsMap = expenses.reduce((acc, expense) => {
    if (!expense.expense_date) return acc;

    const date = new Date(expense.expense_date);
    const monthKey = date.toLocaleString("en-GB", {
      month: "short",
      year: "numeric",
    });

    if (monthKey !== currentMonthKey) return acc;

    const day = date.getDate();
    const amount = Number(expense.amount) || 0;

    if (!acc[day]) acc[day] = 0;
    acc[day] += amount;

    return acc;
  }, {});

  const fullMonthName = currentMonthDisplay.split(" ")[0];

  const dailyTrendData = Object.entries(dailyTotalsMap)
    .map(([day, total]) => ({
      day: Number(day),
      fullDate: `${Number(day)} ${fullMonthName}`,
      total: Number(total.toFixed(2)),
    }))
    .sort((a, b) => a.day - b.day);

  const currentMonthTotal = dailyTrendData.reduce(
    (sum, item) => sum + item.total,
    0
  );

  const highestSpendDay =
    dailyTrendData.length > 0
      ? dailyTrendData.reduce((max, item) =>
          item.total > max.total ? item : max
        )
      : null;

  const currentMonthShort = currentMonthKey.split(" ")[0];
  const currentYear = currentMonthKey.split(" ")[1];

  const highestSpendDateDisplay = highestSpendDay
    ? `${String(highestSpendDay.day).padStart(2, "0")}-${
        monthMap[currentMonthShort]
      }-${currentYear}`
    : null;

  return {
    dailyTrendData,
    currentMonthTotal,
    highestSpendDay,
    highestSpendDateDisplay,
  };
}

export function getAvailableMonthKeys(expenses, parseMonthKey) {
  return [
    ...new Set(
      expenses
        .filter((expense) => expense.expense_date)
        .map((expense) =>
          new Date(expense.expense_date).toLocaleString("en-GB", {
            month: "short",
            year: "numeric",
          })
        )
    ),
  ].sort((a, b) => parseMonthKey(a) - parseMonthKey(b));
}

export function getSelectedMonthTrendData(
  expenses,
  selectedTrendMonth,
  selectedMonthDisplay
) {
  const selectedMonthParts = selectedTrendMonth.split(" ");
  const selectedMonthFullName = selectedMonthDisplay
    ? selectedMonthDisplay.split(" ")[0]
    : "";

  const selectedMonthDailyMap = expenses.reduce((acc, expense) => {
    if (!expense.expense_date || !selectedTrendMonth) return acc;

    const date = new Date(expense.expense_date);
    const monthKey = date.toLocaleString("en-GB", {
      month: "short",
      year: "numeric",
    });

    if (monthKey !== selectedTrendMonth) return acc;

    const day = date.getDate();
    const amount = Number(expense.amount) || 0;
    const category = expense.category || "Other";

    if (!acc[day]) {
      acc[day] = {
        total: 0,
        categories: {},
      };
    }

    acc[day].total += amount;

    if (!acc[day].categories[category]) {
      acc[day].categories[category] = 0;
    }

    acc[day].categories[category] += amount;

    return acc;
  }, {});

  return Object.entries(selectedMonthDailyMap)
    .map(([day, data]) => ({
      day: Number(day),
      fullDate: `${Number(day)} ${selectedMonthFullName} ${
        selectedMonthParts[1] || ""
      }`.trim(),
      total: Number(data.total.toFixed(2)),
      categories: Object.entries(data.categories)
        .map(([name, value]) => ({
          name,
          value: Number(value.toFixed(2)),
        }))
        .sort((a, b) => b.value - a.value),
    }))
    .sort((a, b) => a.day - b.day);
}

export function getCategoryBreakdownFromTrendData(trendData) {
  const categoryTotals = trendData
    .flatMap((item) => item.categories)
    .reduce((acc, category) => {
      if (!acc[category.name]) {
        acc[category.name] = 0;
      }

      acc[category.name] += category.value;
      return acc;
    }, {});

  return Object.entries(categoryTotals)
    .map(([name, value]) => ({
      name,
      value: Number(value.toFixed(2)),
    }))
    .sort((a, b) => b.value - a.value);
}

export function getTotalFromTrendData(trendData) {
  return trendData.reduce((sum, item) => sum + item.total, 0);
}

export function getPeakTrendItem(trendData) {
  return trendData.length > 0
    ? trendData.reduce((max, item) => (item.total > max.total ? item : max))
    : null;
}

export function getYearlyTrendData(expenses, formatMonthFull, parseMonthKey) {
  const yearlyTotalsMap = expenses.reduce((acc, expense) => {
    if (!expense.expense_date) return acc;

    const monthKey = new Date(expense.expense_date).toLocaleString("en-GB", {
      month: "short",
      year: "numeric",
    });

    const amount = Number(expense.amount) || 0;
    const category = expense.category || "Other";

    if (!acc[monthKey]) {
      acc[monthKey] = {
        total: 0,
        categories: {},
      };
    }

    acc[monthKey].total += amount;

    if (!acc[monthKey].categories[category]) {
      acc[monthKey].categories[category] = 0;
    }

    acc[monthKey].categories[category] += amount;

    return acc;
  }, {});

  return Object.entries(yearlyTotalsMap)
    .map(([monthKey, data]) => ({
      monthKey,
      monthLabel: formatMonthFull(monthKey),
      shortMonthLabel: monthKey,
      total: Number(data.total.toFixed(2)),
      categories: Object.entries(data.categories)
        .map(([name, value]) => ({
          name,
          value: Number(value.toFixed(2)),
        }))
        .sort((a, b) => b.value - a.value),
    }))
    .sort((a, b) => parseMonthKey(a.monthKey) - parseMonthKey(b.monthKey));
}