import clsx from "clsx";

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: "blue" | "orange";
};

const Link = ({ variant = "blue", children, ...props }: LinkProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      (e.target as HTMLAnchorElement).click();
    }
  };

  const variants = {
    blue: "text-[var(--color-components)] border-[var(--color-components)] focus:ring-[var(--color-components)]",
    orange:
      "text-[var(--color-text-special-2)] border-[var(--color-text-special-2)] focus:ring-[var(--color-text-special-2)]",
  };

  return (
    <a
      role="link"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      {...props}
      className={clsx(
        "px-1 py-0.5 rounded cursor-pointer transition-colors underline underline-offset-1 decoration-1 decoration-current focus:outline-none focus:ring-2",
        variants[variant]
      )}
    >
      {children}
    </a>
  );
};

export default Link;
