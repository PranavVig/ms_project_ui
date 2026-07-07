import { Box, Button, Typography } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { useNavigate } from "react-router-dom";

function NotFound() {

    const navigate = useNavigate();

    return (

        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                px: 2
            }}
        >
            <Typography variant="h1" fontWeight="bold" color="primary">
                404
            </Typography>
            <Typography variant="h5" gutterBottom>
                Page not found
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
                The page you are looking for does not exist or has been moved.
            </Typography>
            <Button
                variant="contained"
                startIcon={<HomeOutlinedIcon />}
                onClick={() => navigate("/dashboard")}
            >
                Go to Dashboard
            </Button>
        </Box>

    );

}

export default NotFound;
