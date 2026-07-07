import { Box } from "@mui/material";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

function DashboardLayout() {

    return (

        <Box>

            <Navbar />

            <Box sx={{ display: "flex" }}>

                <Sidebar />

                <Box sx={{ padding: 3, flexGrow: 1 }}>

                    <Outlet />

                </Box>

            </Box>

        </Box>

    );

}

export default DashboardLayout;