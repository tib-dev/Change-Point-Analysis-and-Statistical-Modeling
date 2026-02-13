export const ChangepointLabel = (props: any) => {
  const { viewBox, value } = props;
  if (!viewBox) return null;

  // Configuration for the "Image-like" label
  const labelText = value || "Structural Shift";
  const fontSize = 12;
  const paddingX = 10;

  // Approximate text width (can be more precise with a hidden canvas measure if needed)
  const textWidth = labelText.length * 7 + paddingX * 2;
  const rectHeight = 24;

  return (
    <g>
      {/* The Red Background Box */}
      <rect
        x={viewBox.x - textWidth / 2}
        y={viewBox.y - 35} // Distance from top of chart
        width={textWidth}
        height={rectHeight}
        fill="#d32f2f" // Professional Red
        rx={2}
      />
      {/* The Label Text */}
      <text
        x={viewBox.x}
        y={viewBox.y - 19}
        fill="#FFFFFF"
        textAnchor="middle"
        fontSize={fontSize}
        fontWeight="700"
        fontFamily="sans-serif"
      >
        {labelText}
      </text>
    </g>
  );
};
