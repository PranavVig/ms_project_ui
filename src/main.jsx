import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { ThemeModeProvider, useThemeMode } from "./theme/ThemeModeContext";
import { createAppTheme } from "./theme/theme";
import { SidebarProvider } from "./context/SidebarContext";

function ThemedApp() {

    const { mode } = useThemeMode();
    const theme = createAppTheme(mode);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    );

}

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
<ThemeModeProvider>
    <SidebarProvider>
        <ThemedApp />
    </SidebarProvider>
</ThemeModeProvider>
    </React.StrictMode>
);
