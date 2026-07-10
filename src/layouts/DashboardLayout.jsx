import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function DashboardLayout() {

    return (

        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "background.default",
            }}
        >

            <Navbar />

            <Box
                sx={{
                    display: "flex",
                    minHeight: "calc(100vh - 72px)",
                }}
            >

                <Sidebar />

                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        overflow: "auto",
                    }}
                >

                    <Container
                        maxWidth="xl"
                        sx={{
                            py: 4,
                            px: {
                                xs: 2,
                                sm: 3,
                                md: 4,
                            },
                        }}
                    >

                        <Outlet />

                    </Container>

                </Box>

            </Box>

        </Box>

    );

}

export default DashboardLayout;