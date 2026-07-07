import { createContext, useContext, useMemo, useState } from "react";

const ThemeModeContext = createContext();

export function ThemeModeProvider({ children }) {

    const [mode, setMode] = useState(() => {
        return localStorage.getItem("themeMode") || "light";
    });

    function toggleTheme() {

        setMode((prev) => {
            const next = prev === "light" ? "dark" : "light";
            localStorage.setItem("themeMode", next);
            return next;
        });

    }

    const value = useMemo(() => ({ mode, toggleTheme }), [mode]);

    return (
        <ThemeModeContext.Provider value={value}>
            {children}
        </ThemeModeContext.Provider>
    );

}

export function useThemeMode() {

    return useContext(ThemeModeContext);

}
