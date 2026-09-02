export function BrandMark() {
  return <span className="mark" aria-hidden="true" />;
}

export function RainbowMark({ width = 86, height = 46 }: { width?: number; height?: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 86 46" aria-hidden="true">
      <path
        d="M4 44a39 39 0 0 1 78 0"
        fill="none"
        stroke="var(--brick)"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M13 44a30 30 0 0 1 60 0"
        fill="none"
        stroke="var(--gold)"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M22 44a21 21 0 0 1 42 0"
        fill="none"
        stroke="var(--leaf)"
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
  );
}
