const getPerformanceLabelAndColor = (completionRateString: string) => {
  const rate = completionRateString.split("%")[0];
  const completionRate = parseFloat(rate);

  let label = "Excellent";
  let color = "success";

  if (completionRate < 90) {
    label = "Moderate";
    color = "warning";
  }
  if (completionRate < 70) {
    label = "Poor";
    color = "error";
  }

  return { label, color };
};

export default getPerformanceLabelAndColor;
