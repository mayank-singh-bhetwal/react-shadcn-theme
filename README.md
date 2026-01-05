# react-shadcn-theme

[![npm version](https://badge.fury.io/js/react-shadcn-theme.svg)](https://badge.fury.io/js/react-shadcn-theme)
[![npm downloads](https://img.shields.io/npm/dm/react-shadcn-theme.svg)](https://www.npmjs.com/package/react-shadcn-theme)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)

A powerful, flexible theme provider for React applications using shadcn/ui components. Supports multiple color schemes, light/dark modes, and system preference detection with seamless persistence.

## ✨ Features

- 🎨 **12 Color Themes**: zinc, slate, stone, gray, neutral, red, rose, orange, green, blue, yellow, violet
- 🌙 **3 Display Modes**: light, dark, and system (follows OS preference)
- 💾 **Persistent Storage**: Automatically saves theme preferences to localStorage
- ⚡ **Flash Prevention**: Includes script to prevent FOUC (Flash of Unstyled Content)
- 🔧 **TypeScript Support**: Full type safety with TypeScript definitions
- 🪝 **React Hooks**: Easy-to-use `useTheme` hook for theme management
- 🎯 **shadcn/ui Compatible**: Designed specifically for shadcn/ui component library
- 📱 **Responsive**: Works on all devices and screen sizes
- 🎭 **CSS Variables**: Uses CSS custom properties for easy customization

## 📦 Installation

```bash
npm install react-shadcn-theme
```

### Peer Dependencies

This package requires React 16.8.0 or later:

```json
{
  "peerDependencies": {
    "react": ">=16.8.0"
  }
}
```

## 🚀 Quick Start

1. **Install shadcn/ui** (if not already installed):

```bash
npx shadcn-ui@latest init
```

2. **Import the theme provider and styles**:

```tsx
import { ThemeProvider } from "react-shadcn-theme";
import "react-shadcn-theme/styles.css";
```

3. **Wrap your app with the ThemeProvider**:

You can optionally pass a `defaultTheme` to set the initial theme:

```tsx
function App() {
  return (
    <ThemeProvider defaultTheme={{ color: "blue", mode: "dark" }}>
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

Or with just one property:

```tsx
<ThemeProvider defaultTheme={{ mode: "dark" }}>
  {/* Your app content */}
</ThemeProvider>
```

4. **Use the `useTheme` hook** anywhere in your components:

```tsx
import { useTheme } from "react-shadcn-theme";

function ThemeToggle() {
  const { theme, setTheme, isDarkMode } = useTheme();

  return (
    <button
      onClick={() => setTheme({ mode: isDarkMode() ? "light" : "dark" })}
    >
      Toggle to {isDarkMode() ? "Light" : "Dark"} Mode
    </button>
  );
}
```

## 📖 Usage

### Creating a Theme Provider Wrapper

For cleaner imports, you can create a wrapper component:

```tsx
// components/theme-provider.tsx
"use client";
export { ThemeProvider } from "react-shadcn-theme";
```

Then import it in your app:

```tsx
import { ThemeProvider } from "@/components/theme-provider";
```

### Complete App Example with shadcn/ui

```tsx
// app/layout.tsx
import { ThemeProvider } from "@/components/theme-provider";
import "react-shadcn-theme/styles.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

```tsx
// components/theme-toggle.tsx
"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "react-shadcn-theme";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme, isDarkMode } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme({ mode: isDarkMode() ? "light" : "dark" })}
    >
      {isDarkMode() ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
```

```tsx
// components/color-picker.tsx
"use client";

import { useTheme, colors } from "react-shadcn-theme";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ColorPicker() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <div
            className="h-4 w-4 rounded-full border"
            style={{ backgroundColor: `hsl(var(--${theme.color}-500))` }}
          />
          <span className="sr-only">Change color theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {colors.map((color) => (
          <DropdownMenuItem
            key={color}
            onClick={() => setTheme({ color })}
            className="flex items-center gap-2"
          >
            <div
              className="h-4 w-4 rounded-full border"
              style={{ backgroundColor: `hsl(var(--${color}-500))` }}
            />
            <span className="capitalize">{color}</span>
            {theme.color === color && <span>✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### Advanced Usage

```tsx
import { useTheme, colors, modes } from "react-shadcn-theme";

function AdvancedThemeControls() {
  const { theme, setTheme, isDarkMode } = useTheme();

  // Cycle through colors
  const nextColor = () => {
    const currentIndex = colors.indexOf(theme.color);
    const nextIndex = (currentIndex + 1) % colors.length;
    setTheme({ color: colors[nextIndex] });
  };

  // Cycle through modes
  const nextMode = () => {
    const currentIndex = modes.indexOf(theme.mode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setTheme({ mode: modes[nextIndex] });
  };

  return (
    <div className="space-y-4">
      <div>
        <p>Current: {theme.color} - {theme.mode}</p>
        <p>Dark mode active: {isDarkMode() ? "Yes" : "No"}</p>
      </div>

      <div className="flex gap-2">
        <button onClick={nextColor} className="px-4 py-2 border rounded">
          Next Color
        </button>
        <button onClick={nextMode} className="px-4 py-2 border rounded">
          Next Mode
        </button>
      </div>
    </div>
  );
}
```

## 🎨 Supported Themes

### Colors
- **zinc**: Neutral gray tones
- **slate**: Cool blue-gray tones
- **stone**: Warm gray tones
- **gray**: Standard gray tones
- **neutral**: Balanced neutral tones
- **red**: Red color scheme
- **rose**: Warm pink tones
- **orange**: Orange color scheme
- **green**: Green color scheme
- **blue**: Blue color scheme
- **yellow**: Yellow color scheme
- **violet**: Purple/violet tones

### Modes
- **light**: Always light theme
- **dark**: Always dark theme
- **system**: Follows system preference (default)

## 📚 API Reference

### ThemeProvider

The main provider component that wraps your application.

```tsx
interface ThemeProviderProps {
  children: React.ReactNode;
}

<ThemeProvider>
  {children}
</ThemeProvider>
```

### useTheme()

Hook to access theme context. Must be used within a `ThemeProvider`.

```tsx
const { theme, setTheme, isDarkMode } = useTheme();
```

**Returns:**
- `theme`: Current theme object `{ color: Color, mode: Mode }`
- `setTheme`: Function to update theme `({ color?, mode? }) => void`
- `isDarkMode`: Function to check if dark mode is active `(mode?) => boolean`

### Types

```tsx
type Color = "zinc" | "slate" | "stone" | "gray" | "neutral" | "red" | "rose" | "orange" | "green" | "blue" | "yellow" | "violet";

type Mode = "light" | "dark" | "system";

type Theme = { color: Color; mode: Mode; };
```

### Constants

```tsx
import { colors, modes, defaultTheme } from "react-shadcn-theme";

// Array of all available colors
colors: readonly Color[]

// Array of all available modes
modes: readonly Mode[]

// Default theme configuration
defaultTheme: Theme // { color: "slate", mode: "system" }
```

## 🎭 CSS Variables

The theme provider exposes CSS custom properties that you can use in your styles:

```css
.my-component {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  border: 1px solid hsl(var(--border));
}
```

Available CSS variables include:
- `--background`, `--foreground`
- `--card`, `--card-foreground`
- `--primary`, `--primary-foreground`
- `--secondary`, `--secondary-foreground`
- `--muted`, `--muted-foreground`
- `--accent`, `--accent-foreground`
- `--destructive`
- `--border`, `--input`, `--ring`
- `--sidebar-*` variants
- `--chart-1` through `--chart-5`

## 🔧 Configuration

The theme provider automatically:
- Loads saved preferences from localStorage on mount
- Applies CSS classes (`light`, `dark`, and color name) to `document.documentElement`
- Sets `color-scheme` CSS property to prevent browser inconsistencies
- Injects a script to prevent flash of unstyled content (FOUC)

### Storage Keys

Theme preferences are stored in localStorage with these keys:
- `theme-color`: The selected color theme
- `theme-mode`: The selected display mode

## 🐛 Troubleshooting

### Flash of Unstyled Content (FOUC)

If you experience FOUC, ensure:
1. The theme provider script is loaded before your CSS
2. You're importing `react-shadcn-theme/styles.css` at the top of your app
3. The ThemeProvider wraps your entire application

### Theme Not Persisting

Check that:
1. localStorage is not disabled in the browser
2. You're calling `setTheme()` correctly
3. The component is wrapped in ThemeProvider

### TypeScript Errors

Make sure you're using React 16.8+ and have the correct types:

```bash
npm install --save-dev @types/react
```

### Hydration Mismatches

If using Next.js, add `suppressHydrationWarning` to your html element:

```tsx
<html lang="en" suppressHydrationWarning>
```

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires CSS custom properties support.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for [shadcn/ui](https://ui.shadcn.com/) components
- Uses [OKLCH color space](https://oklch.com/) for better color accuracy