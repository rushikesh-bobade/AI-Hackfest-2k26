import { useMemo } from "react";

interface ColorSchemeState {
  rootCssClass: string;
  resolvedScheme: "dark" | "light";
}

// Keep a stable dark theme to preserve the existing visual appearance.
export function useColorScheme(): ColorSchemeState {
  return useMemo(
    () => ({
      rootCssClass: "dark-theme",
      resolvedScheme: "dark",
    }),
    []
  );
}
