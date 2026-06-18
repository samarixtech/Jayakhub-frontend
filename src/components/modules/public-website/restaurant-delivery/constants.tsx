export const C = {
  green: "#0B5D4E",
  greenDeep: "#073d33",
  greenLight: "#E8F4F1",
  orange: "#B6932F",
  orangeDeep: "#9a7a24",
  gold: "#B6932F",
  navy: "#0f172a",
  cream: "#F8FAFC",
  creamWarm: "#f1f5f9",
  ink: "#1a1a1a",
  muted: "#64748B",
  line: "#e2e8f0",
  red: "#C62828",
  white: "#FFFFFF",
} as const;

export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0"
      style={{
        width: size,
        height: size,
        background: C.green,
        boxShadow: "0 2px 8px rgba(11,93,78,.3)",
      }}
    >
      <svg width={size * 0.61} height={size * 0.61} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="white" />
        <path
          d="M6 12h10M13 9l4 3-4 3"
          stroke={C.orange}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
