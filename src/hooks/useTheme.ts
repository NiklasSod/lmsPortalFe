import { useState, useEffect } from 'react';
import {
    applyCurrentTheme,
    getStoredTheme,
    setStoredTheme,
    watchSystemTheme
} from '../utils/themeHandler';
import type { StoredTheme } from '../utils/themeHandler';

export const useTheme = () => {
    const [currentTheme, setCurrentTheme] = useState<StoredTheme>(getStoredTheme());

    useEffect(() => {
        applyCurrentTheme();
        return watchSystemTheme();
    }, []);

    const changeTheme = (theme: StoredTheme) => {
        setStoredTheme(theme);
        setCurrentTheme(theme);
        applyCurrentTheme();
    };

    return { currentTheme, changeTheme };
};