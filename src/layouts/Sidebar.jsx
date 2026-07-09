import { useState } from "react";
import {
    Box,
    Collapse,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText
} from "@mui/material";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

import { Link, useLocation, useNavigate } from "react-router-dom";

function Sidebar() {

    const navigate = useNavigate();
    const location = useLocation();
    const [auditOpen, setAuditOpen] = useState(
        location.pathname.startsWith("/department/audit") ||
        location.pathname.startsWith("/emp/audit")
    );

    function handleLogout() {
        localStorage.removeItem("auth");
        navigate("/login");
    }

    function isActive(path) {
        return location.pathname === path;
    }

    return (

        <Box
            sx={{
                width: 240,
                minHeight: "100vh",
                borderRight: 1,
                borderColor: "divider",
                bgcolor: "background.paper"
            }}
        >

            <List>

                <ListItemButton
                    component={Link}
                    to="/dashboard"
                    selected={isActive("/dashboard")}
                >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                        <DashboardOutlinedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItemButton>

                <ListItemButton
                    component={Link}
                    to="/departments"
                    selected={isActive("/departments")}
                >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                        <BusinessOutlinedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Departments" />
                </ListItemButton>

                <ListItemButton
                    component={Link}
                    to="/employees"
                    selected={isActive("/employees")}
                >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                        <PeopleOutlinedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Employees" />
                </ListItemButton>

                <ListItemButton
                    onClick={() => setAuditOpen((prev) => !prev)}
                    selected={
                        isActive("/department/audit") || isActive("/emp/audit")
                    }
                >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                        <AssignmentOutlinedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Audit" />
                    {auditOpen ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>

                <Collapse in={auditOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>

                        <ListItemButton
                            component={Link}
                            to="/department/audit"
                            selected={isActive("/department/audit")}
                            sx={{ pl: 4 }}
                        >
                            <ListItemIcon sx={{ minWidth: 36 }}>
                                <SearchOutlinedIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Department Audit" />
                        </ListItemButton>

                        <ListItemButton
                            component={Link}
                            to="/emp/audit"
                            selected={isActive("/emp/audit")}
                            sx={{ pl: 4 }}
                        >
                            <ListItemIcon sx={{ minWidth: 36 }}>
                                <PersonSearchOutlinedIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Employee Audit" />
                        </ListItemButton>

                    </List>
                </Collapse>

                <ListItemButton onClick={handleLogout}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                        <LogoutOutlinedIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItemButton>

            </List>

        </Box>

    );

}

export default Sidebar;