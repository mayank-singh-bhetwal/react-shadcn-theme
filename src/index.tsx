import React, { createContext, type ReactNode, useState, useContext, useEffect } from "react";

export const colors = ["zinc", "slate", "stone", "gray", "neutral", "red", "rose", "orange", "green", "blue", "yellow", "violet"] as const;
export const modes = ["light", "dark", "system"] as const;

export type Color = typeof colors[number];
export type Mode = typeof modes[number];

export type Theme = { color: Color; mode: Mode; };

export const defaultTheme: Theme = { color: "slate", mode: "system" };

export const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (_newTheme: {
    mode?: Mode | undefined;
    color?: Color | undefined;
  }) => void;
  isDarkMode: (_mode?: Mode | undefined) => boolean;
}>({
  theme: defaultTheme,
  setTheme: (_newTheme: { mode?: Mode; color?: Color }) => { },
  isDarkMode: (_mode?: Mode) => true
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState(defaultTheme);

  useEffect(() => {
    const themeColor = (localStorage.getItem("theme-color") ?? "") as Color;
    const themeMode = (localStorage.getItem("theme-mode") ?? "") as Mode;

    setTheme({
      color: colors.includes(themeColor) ? themeColor : defaultTheme.color,
      mode: modes.includes(themeMode) ? themeMode : defaultTheme.mode
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

  return React.createElement(ThemeContext.Provider, {
    value: {
      theme: theme,
      setTheme: ({ color, mode }: { color?: Color; mode?: Mode }) => {
        setTheme({
          color: color ?? theme.color,
          mode: mode ?? theme.mode
        });

        localStorage.setItem("theme-color", color ?? theme.color);
        localStorage.setItem("theme-mode", mode ?? theme.mode);
      },
      isDarkMode: isDarkMode
    }
  }, React.createElement(ThemeScript), children);
}

function ThemeScript() {
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

  return React.createElement("script", { dangerouslySetInnerHTML: { __html: scriptContent } });
};

export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) { throw new Error("Error: Component must be wrapped within ThemeProvider."); }

  return context;
}
