import {
  Box,
  List,
  ListItemButton,
  ListItemText
} from "@mui/material";

import { Link, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

function handleLogout() {
    localStorage.removeItem("auth");
    navigate("/login");
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

              <ListItemButton component={Link} to="/dashboard">
                  <ListItemText primary="Dashboard" />
              </ListItemButton>

              <ListItemButton component={Link} to="/departments">
                  <ListItemText primary="Departments" />
              </ListItemButton>

              <ListItemButton component={Link} to="/employees">
                  <ListItemText primary="Employees" />
              </ListItemButton>

              <ListItemButton onClick={handleLogout}>
    <ListItemText primary="Logout" />
</ListItemButton>

          </List>

      </Box>

  );
}

export default Sidebar;