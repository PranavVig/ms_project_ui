import { useState } from "react";
import {
    Box,
    Collapse,
    Divider,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material";

import {
    LayoutDashboard,
    Building2,
    Users,
    ClipboardList,
    LogOut,
    ChevronDown,
    ChevronUp,
    Building,
    UserSearch,
} from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router-dom";

function Sidebar() {

    const navigate = useNavigate();
    const location = useLocation();
    const role = localStorage.getItem("role");

    const [auditOpen, setAuditOpen] = useState(
        location.pathname.startsWith("/department/audit") ||
        location.pathname.startsWith("/emp/audit")
    );

    function handleLogout() {
        localStorage.removeItem("auth");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        navigate("/login");
    }

    function isActive(path) {
        return location.pathname === path;
    }

    const itemStyle = (active) => ({
        mx: 1.5,
        mb: 0.5,
        borderRadius: 2,
        minHeight: 46,
        color: active ? "primary.main" : "text.primary",
        bgcolor: active ? "action.selected" : "transparent",
        transition: "all .2s ease",

        "&:hover": {
            bgcolor: "action.hover",
        },
    });

    return (
<Box
    sx={{
        width: 270,
        height: "calc(100vh - 72px)",
        borderRight: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 72,
    }}
>
<Box sx={{ pt: 2 }} />

<List
    sx={{
        mt: 1,
        flexGrow: 1,
    }}
>

                <Typography
                    variant="caption"
                    sx={{
                        px: 3,
                        mb: 1,
                        display: "block",
                        color: "text.secondary",
                        fontWeight: 700,
                        letterSpacing: 1,
                    }}
                >
                    OVERVIEW
                </Typography>

                <ListItemButton
                    component={Link}
                    to="/dashboard"
                    selected={isActive("/dashboard")}
                    sx={itemStyle(isActive("/dashboard"))}
                >
                    <ListItemIcon>
                        <LayoutDashboard size={18} />
                    </ListItemIcon>

                    <ListItemText primary="Dashboard" />
                </ListItemButton>

                <Typography
                    variant="caption"
                    sx={{
                        px: 3,
                        mt: 2,
                        mb: 1,
                        display: "block",
                        color: "text.secondary",
                        fontWeight: 700,
                        letterSpacing: 1,
                    }}
                >
                    MANAGEMENT
                </Typography>

                <ListItemButton
                    component={Link}
                    to="/departments"
                    selected={isActive("/departments")}
                    sx={itemStyle(isActive("/departments"))}
                >
                    <ListItemIcon>
                        <Building2 size={18} />
                    </ListItemIcon>

                    <ListItemText primary="Departments" />
                </ListItemButton>

                <ListItemButton
                    component={Link}
                    to="/employees"
                    selected={isActive("/employees")}
                    sx={itemStyle(isActive("/employees"))}
                >
                    <ListItemIcon>
                        <Users size={18} />
                    </ListItemIcon>

                    <ListItemText primary="Employees" />
                </ListItemButton>

                {role !== "ROLE_EMPLOYEE" && (
    <>
        <Typography
            variant="caption"
            sx={{
                px: 3,
                mt: 2,
                mb: 1,
                display: "block",
                color: "text.secondary",
                fontWeight: 700,
                letterSpacing: 1,
            }}
        >
            MONITORING
        </Typography>

        <ListItemButton
            onClick={() => setAuditOpen((prev) => !prev)}
            selected={
                isActive("/department/audit") ||
                isActive("/emp/audit")
            }
            sx={itemStyle(
                isActive("/department/audit") ||
                isActive("/emp/audit")
            )}
        >
            <ListItemIcon>
                <ClipboardList size={18} />
            </ListItemIcon>

            <ListItemText primary="Audit Logs" />

            {auditOpen ? (
                <ChevronUp size={18} />
            ) : (
                <ChevronDown size={18} />
            )}
        </ListItemButton>

        <Collapse in={auditOpen} timeout="auto">

            <List disablePadding>

                <ListItemButton
                    component={Link}
                    to="/department/audit"
                    selected={isActive("/department/audit")}
                    sx={{
                        ...itemStyle(isActive("/department/audit")),
                        pl: 5,
                    }}
                >
                    <ListItemIcon>
                        <Building size={17} />
                    </ListItemIcon>

                    <ListItemText primary="Department Audit" />
                </ListItemButton>

                <ListItemButton
                    component={Link}
                    to="/emp/audit"
                    selected={isActive("/emp/audit")}
                    sx={{
                        ...itemStyle(isActive("/emp/audit")),
                        pl: 5,
                    }}
                >
                    <ListItemIcon>
                        <UserSearch size={17} />
                    </ListItemIcon>

                    <ListItemText primary="Employee Audit" />
                </ListItemButton>

            </List>

        </Collapse>
    </>
)}

            </List>

            <Box sx={{ flexGrow: 1 }} />

            

            <List sx={{ py: 1 }}>

            <ListItemButton
    onClick={handleLogout}
    sx={{
        mx: 1.5,
        mb: 1,
        borderRadius: 100,
        minHeight: 46,
        color: "text.primary",
        transition: "all .2s ease",

borderColor: "divider",
        "&:hover": {
            bgcolor: "error.main",
            color: "error.contrastText",
            borderColor: "error.dark",
            transition: "all 0.6s ease",

            "& .MuiListItemIcon-root": {
                color: "error.contrastText",
            },
        },
    }}
>
    <ListItemIcon>
        <LogOut size={18} />
    </ListItemIcon>

    <ListItemText primary="Logout" />
</ListItemButton>

            </List>

        </Box>
    );
}

export default Sidebar;