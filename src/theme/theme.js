import { createTheme } from "@mui/material/styles";

export function createAppTheme(mode = "light") {

    return createTheme({
        palette: {
            mode,

            primary: {
                main: "#5B5BD6",
            },

            background: {
                default: mode === "light" ? "#F5F7FA" : "#121212",
                paper: mode === "light" ? "#FFFFFF" : "#1E1E1E",
            },
        },

        shape: {
            borderRadius: 10,
        },

        typography: {
            fontFamily: "Inter, Roboto, sans-serif",
        },

        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: "none",
                    },
                },
            },
        },
    });

}

export default createAppTheme("light");
