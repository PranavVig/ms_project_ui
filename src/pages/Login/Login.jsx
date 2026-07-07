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

      await api.get("/department");

      navigate("/dashboard");

  } catch  {


    setSeverity("error");
    setSnackbarMessage("Invalid username or password.");
    setOpenSnackbar(true);

}

}

  return (

      <Box
          sx={{
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundImage: `url(${loginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
          }}
      >

          <Card sx={{ width: 400 }}>

              <CardContent>

                  <Typography
                      variant="h5"
                      align="center"
                      gutterBottom
                  >
                      Employee Management Portal
                  </Typography>

                  <TextField
    fullWidth
    label="Username"
    margin="normal"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
/>

<TextField
    fullWidth
    label="Password"
    type="password"
    margin="normal"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
/>
                  <Button
                      fullWidth
                      variant="contained"
                      sx={{ mt: 2 }}
                      onClick={handleLogin}
                  >
                      Login
                  </Button>

              </CardContent>

          </Card>
          <Snackbar
    open={openSnackbar}
    autoHideDuration={3000}
    onClose={() => setOpenSnackbar(false)}
    anchorOrigin={{ vertical: "top", horizontal: "center" }}
>
    <Alert
        onClose={() => setOpenSnackbar(false)}
        severity={severity}
        variant="filled"
        sx={{ width: "100%" }}
    >
        {snackbarMessage}
    </Alert>
</Snackbar>
      </Box>

  );

}

export default Login;