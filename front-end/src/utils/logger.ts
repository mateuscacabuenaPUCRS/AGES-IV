export const log = (...args: unknown[]) =>
  import.meta.env.DEV ? console.log("[app]", ...args) : undefined;
