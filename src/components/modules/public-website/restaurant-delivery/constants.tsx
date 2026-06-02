export const C = {
  green: "#2C5F2D",
  greenDeep: "#1f4520",
  greenLight: "#E8F5E9",
  orange: "#FF6B35",
  orangeDeep: "#E5532A",
  gold: "#FDB833",
  navy: "#1B3A57",
  cream: "#F2F2ED",
  creamWarm: "#FFF8F0",
  ink: "#1a1a1a",
  muted: "#6b6b6b",
  line: "#e5e0d8",
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
        boxShadow: "0 2px 8px rgba(44,95,45,.3)",
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
