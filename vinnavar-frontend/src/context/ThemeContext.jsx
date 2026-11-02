import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext({
  theme: "dark",
  isDark: true,
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    try {
      const stored = localStorage.getItem("vinnavar_theme");
      if (stored === "dark" || stored === "light") {
        return stored;
      }
    } catch (e) {
      console.warn("Could not read theme preference from localStorage", e);
    }
    return "dark"; // Dark mode is default
  });

  const isDark = theme === "dark";

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    if (theme === "dark") {
      root.classList.add("dark");
      if (body) body.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      if (body) body.classList.remove("dark");
      root.style.colorScheme = "light";
    }

    try {
      localStorage.setItem("vinnavar_theme", theme);
    } catch (e) {
      console.warn("Could not save theme preference to localStorage", e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const setTheme = (newTheme) => {
    if (newTheme === "dark" || newTheme === "light") {
      setThemeState(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
export default ThemeContext;

