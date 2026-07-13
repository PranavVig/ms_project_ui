import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Snackbar,
    TextField,
    Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import api from "../../services/api";
import loginBg from "../../assets/final-login.png";

function Login() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [severity, setSeverity] = useState("error");

    async function handleLogin() {

        if (!username.trim() || !password.trim()) {

            setSeverity("warning");
            setSnackbarMessage("Please enter username and password.");
            setOpenSnackbar(true);
            return;

        }

        try {

            const token = btoa(`${username}:${password}`);
        
            localStorage.setItem("auth", token);
        
            // Verify credentials
            await api.get("/department");
        
            // Fetch authenticated user
            const response = await api.get("/auth/me");
        
            localStorage.setItem("username", response.data.username);
            localStorage.setItem("role", response.data.role);
        
            navigate("/dashboard");
        
        } catch {
        
            localStorage.removeItem("auth");
            localStorage.removeItem("username");
            localStorage.removeItem("role");
        
            setSeverity("error");
            setSnackbarMessage("Invalid username or password.");
            setOpenSnackbar(true);
        
        }

    }

    return (

        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 3,

                backgroundImage: `linear-gradient(rgba(15,23,42,.55), rgba(15,23,42,.55)), url(${loginBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >

            <Box
                sx={{
                    width: "100%",
                    maxWidth: 430,
                }}
            >

                <Card
                    elevation={0}
                    sx={{
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: "divider",
                        backdropFilter: "blur(14px)",
                        bgcolor: "background.paper",
                    }}
                >

                    <CardContent
                        sx={{
                            p: 5,
                        }}
                    >

                        <Typography
                            variant="overline"
                            color="primary"
                            sx={{
                                display: "block",
                                textAlign: "center",
                                fontWeight: 700,
                                letterSpacing: 2,
                            }}
                        >
                            WELCOME
                        </Typography>

                        <Typography
                            variant="h4"
                            align="center"
                            sx={{
                                mt: 1,
                                fontWeight: 700,
                            }}
                        >
                            Employee Management Portal
                        </Typography>

                        <Typography
                            align="center"
                            color="text.secondary"
                            sx={{
                                mt: 1,
                                mb: 4,
                            }}
                        >
                            Sign in to continue to your dashboard.
                        </Typography>

                        <TextField
                            fullWidth
                            label="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            sx={{
                                mb: 2,
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleLogin}
                            sx={{
                                mt: 4,
                                py: 1.4,
                                borderRadius: 2,
                                fontWeight: 600,
                            }}
                        >
                            Sign In
                        </Button>

                    </CardContent>

                </Card>

            </Box>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
            >
                <Alert
                    severity={severity}
                    variant="filled"
                    onClose={() => setOpenSnackbar(false)}
                    sx={{
                        width: "100%",
                    }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>

        </Box>

    );

}

export default Login;