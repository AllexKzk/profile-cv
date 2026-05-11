import { useLocalStorage } from "@vueuse/core";

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "cv:theme";

export const DEFAULT_THEME: Theme = "dark";

export const useTheme = () => {
  const theme = useLocalStorage<Theme>(THEME_STORAGE_KEY, DEFAULT_THEME);

  const toggleTheme = () => {
    theme.value = theme.value === "light" ? "dark" : "light";
  };

  const isDark = computed(() => theme.value === "dark");

  return {
    theme,
    toggleTheme,
    isDark,
  };
};
