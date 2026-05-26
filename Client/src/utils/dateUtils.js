export const formatMonthFull = (monthKey) => {
  const date = new Date(`01 ${monthKey}`);

  return date.toLocaleString("en-GB", {
    month: "long",
    year: "numeric",
  });
};

export const parseMonthKey = (monthKey) => {
  return new Date(`01 ${monthKey}`);
};

export const getCurrentMonthKey = () => {
  const now = new Date();

  return now.toLocaleString("en-GB", {
    month: "short",
    year: "numeric",
  });
};