interface MetricCardProps {
  value: string | number;
  label: string;
  prefix?: string;
  suffix?: string;
}

export function MetricCard({ label, value, prefix, suffix }: MetricCardProps) {
  return (
    <div
      className="
      flex h-12 lg:h-16 flex-1 min-w-[110px] lg:min-w-[120px] flex-col items-center justify-center gap-1 lg:gap-2 rounded-lg bg-white px-2 lg:px-4 shadow-sm
    "
    >
      <span className="text-base md:text-xl font-bold text-[color:var(--color-components)] text-center break-words">
        {prefix}
        {value}
        {suffix}
      </span>
      <span className="text-[10px] md:text-xs font-medium text-center text-[color:var(--color-components)] leading-tight break-words">
        {label}
      </span>
    </div>
  );
}
