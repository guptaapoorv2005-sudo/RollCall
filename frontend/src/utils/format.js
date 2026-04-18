export const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatPercent = (value) => {
  const numeric = Number(value);

  if (Number.isNaN(numeric)) {
    return "0%";
  }

  return `${numeric.toFixed(2)}%`;
};
