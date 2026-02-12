export const paddedDomain = (data: any[], key: string) => {
  const values = data.map((d) => d[key]).filter((v) => v != null);

  if (!values.length) return ["auto", "auto"];

  const min = Math.min(...values);
  const max = Math.max(...values);

  const padding = (max - min) * 0.05;

  return [min - padding, max + padding];
};
