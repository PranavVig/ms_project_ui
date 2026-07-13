import { createTheme } from "@mui/material/styles";

export function createAppTheme(mode = "light") {

    return createTheme({
        palette: {
            mode,

            primary: {
                main: "#007FFF",
            },

            background: {
                default: mode === "light" ? "#F5F7FA" : "#121212",
                paper: mode === "light" ? "#FFFFFF" : "#1E1E1E",
            },
        },

        shape: {
            borderRadius: 14,
        },

        typography: {
            fontFamily: "Inter, Roboto, sans-serif",
        
            h4: {
                fontWeight: 700,
                letterSpacing: "-0.5px",
            },
        
            h5: {
                fontWeight: 600,
            },
        
            h6: {
                fontWeight: 600,
            },
        
            subtitle1: {
                fontWeight: 500,
            },
        
            button: {
                textTransform: "none",
                fontWeight: 600,
            },
        },

        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: "none",
                        borderRadius: 10,
                        fontWeight: 600,
                        paddingInline: 18,
                    },
            
                    contained: {
                        boxShadow: "none",
            
                        "&:hover": {
                            boxShadow: "0 4px 12px rgba(0,0,0,.12)",
                        },
                    },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        borderRadius: 16,
                        border: "1px solid",
borderColor:
    mode === "light"
        ? "rgba(0,0,0,0.06)"
        : "rgba(255,255,255,0.08)",
        boxShadow:
        mode === "light"
            ? "0 2px 8px rgba(15,23,42,0.06)"
            : "0 4px 16px rgba(0,0,0,0.35)",
                    },
                },
            },
            MuiTextField: {
                defaultProps: {
                    size: "small",
                },
            },
            MuiTableCell: {
                styleOverrides: {
                    head: ({ theme }) => ({
                        fontWeight: 700,
                        backgroundColor:
                            theme.palette.mode === "light"
                                ? "#fafafa"
                                : theme.palette.grey[900],
                    }),
                },
            },
        },
    });

}

export default createAppTheme("light");
