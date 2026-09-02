const SYSTEM_THEME = 'system';
const DARK_MODE_QUERY = '(prefers-color-scheme: dark)';
const STORAGE_KEY = 'theme-preference';
const THEME_ATTRIBUTE = 'data-bs-theme';
const EVENT = 'change';

let systemThemeListener: ((event: MediaQueryListEvent) => void) | null = null;
let listenerCount = 0;

export type ThemeMode = 'light' | 'dark';
export type StoredTheme = ThemeMode | typeof SYSTEM_THEME;

const getThemeFromMatch = (matches: boolean): ThemeMode => {
    return matches ? 'dark' : 'light';
};

const setThemeAttribute = (theme: ThemeMode): void => {
    document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
};

export const getStoredTheme = (): StoredTheme => {
    return (localStorage.getItem(STORAGE_KEY) as StoredTheme) || SYSTEM_THEME;
};

export const setStoredTheme = (theme: StoredTheme): void => {
    if (theme === SYSTEM_THEME) {
        localStorage.removeItem(STORAGE_KEY);
    } else {
        localStorage.setItem(STORAGE_KEY, theme);
    }
};

export const resolveActiveTheme = (stored: StoredTheme): ThemeMode => {
    if (stored === SYSTEM_THEME) {
        return getThemeFromMatch(window.matchMedia(DARK_MODE_QUERY).matches);
    }
    return stored;
};

export const applyCurrentTheme = (): void => {
    const stored = getStoredTheme();
    const active = resolveActiveTheme(stored);
    setThemeAttribute(active);
};

export const watchSystemTheme = (callback?: (theme: ThemeMode) => void): (() => void) => {
    const mediaQuery = window.matchMedia(DARK_MODE_QUERY);

    if (listenerCount === 0) {
        systemThemeListener = (event: MediaQueryListEvent) => {
            if (getStoredTheme() === SYSTEM_THEME) {
                const newTheme = getThemeFromMatch(event.matches);
                setThemeAttribute(newTheme);
                callback?.(newTheme);
            }
        };
        mediaQuery.addEventListener(EVENT, systemThemeListener);
    }

    listenerCount++;

    return () => {
        listenerCount--;
        if (listenerCount === 0 && systemThemeListener) {
            mediaQuery.removeEventListener(EVENT, systemThemeListener);
            systemThemeListener = null;
        }
    };
    
};