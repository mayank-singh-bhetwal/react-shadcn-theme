import { createContext, type ReactNode, useState, useContext, useEffect, createElement, useLayoutEffect } from "react";

export const colors = ["zinc", "slate", "stone", "gray", "neutral", "red", "rose", "orange", "green", "blue", "yellow", "violet"] as const;
export const modes = ["light", "dark", "system"] as const;

export type Color = typeof colors[number];
export type Mode = typeof modes[number];

export type Theme = { color: Color; mode: Mode; };

type DefaultTheme = { color?: Color; mode?: Mode; };

export const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (_newTheme: {
    mode?: Mode | undefined;
    color?: Color | undefined;
  }) => void;
  isDarkMode: (_mode?: Mode | undefined) => boolean;
}>({
  theme: { color: "slate", mode: "system" },
  setTheme: (_newTheme: { mode?: Mode; color?: Color }) => { },
  isDarkMode: (_mode?: Mode) => true
});

export function ThemeProvider({
  defaultTheme = {},
  children
}: {
  defaultTheme?: DefaultTheme;
  children: ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>({
    color: defaultTheme?.color ?? "slate",
    mode: defaultTheme?.mode ?? "system"
  });

  useLayoutEffect(() => {
    const themeColor = (localStorage.getItem("theme-color") ?? "") as Color;
    const themeMode = (localStorage.getItem("theme-mode") ?? "") as Mode;

    setTheme({
      color: colors.includes(themeColor) ? themeColor : theme.color,
      mode: modes.includes(themeMode) ? themeMode : theme.mode
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove(...colors, ...modes);
    html.classList.add(isDarkMode() ? "dark" : "light", theme.color);
    html.style.colorScheme = isDarkMode() ? "dark" : "light";

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  function isDarkMode(mode = theme.mode) {
    if (mode === "dark") { return true; }
    if (mode === "light") { return false; }

    try {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch (e) { return false; }
  };

  return (
    createElement(
      ThemeContext.Provider,
      {
        value: {
          theme, isDarkMode,
          setTheme: ({ color, mode }: { color?: Color; mode?: Mode }) => {
            setTheme({
              color: color ?? theme.color,
              mode: mode ?? theme.mode
            });

            localStorage.setItem("theme-color", color ?? theme.color);
            localStorage.setItem("theme-mode", mode ?? theme.mode);
          }
        }
      },
      createElement(ThemeScript, { defaultTheme: theme }),
      children
    )
  );
}

function ThemeScript({ defaultTheme }: { defaultTheme: Theme; }) {
  const scriptContent = `
    (function() {
      const defaultTheme = {
        color: '${defaultTheme.color}',
        mode: '${defaultTheme.mode}'
      };
      const colors = [${colors.map(color => `"${color}"`)}];
      const modes = [${modes.map(mode => `"${mode}"`)}];

      const themeColor = localStorage.getItem("theme-color") ?? "";
      const themeMode = localStorage.getItem("theme-mode") ?? "";

      const theme = {
        color: colors.includes(themeColor) ? themeColor : defaultTheme.color,
        mode: modes.includes(themeMode) ? themeMode : defaultTheme.mode
      };

      let isDarkMode = false;

      if (theme.mode === "dark") {
        isDarkMode = true;
      } else if (theme.mode === "system") {
        isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      }

      const html = document.documentElement;
      html.classList.remove(...colors, ...modes);
      html.classList.add(theme.color, isDarkMode ? "dark" : "light");
      html.style.colorScheme = isDarkMode ? "dark" : "light";
    })();
  `;

  return createElement("script", { dangerouslySetInnerHTML: { __html: scriptContent } });
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) { throw new Error("Error: Component must be wrapped within ThemeProvider."); }

  return context;
}
