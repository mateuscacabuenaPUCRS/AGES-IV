import clsx from "clsx";

type DividerProps = {
  text?: string;
  className?: string;
  variant?: "primary" | "secondary";
};

export default function Divider({ text = "", className = "", variant = "primary" }: DividerProps) {
  const variants = {
    primary: {
      line: "bg-[var(--color-border)]/60",
      text: "text-[var(--color-text-brand)]",
    },
    secondary: {
      line: "bg-[var(--color-components)]/60",
      text: "text-[var(--color-components)]",
    },
  };

  return (
    <div className={clsx("my-2 flex items-center gap-3", className)}>
      <span className={clsx("h-px flex-1", variants[variant].line)} />
      <span className={clsx("text-xs font-semibold tracking-wide", variants[variant].text)}>
        {text}
      </span>
      <span className={clsx("h-px flex-1", variants[variant].line)} />
    </div>
  );
}
