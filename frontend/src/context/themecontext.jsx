import { createContext, useContext } from "react";

export const ThemeContext = createContext({
  theme: "dark",
  setTheme: () => {},
  toggleTheme: () => {},
  themePreset: "default",
  setThemePreset: () => {},
});

export const useTheme = () => useContext(ThemeContext);
