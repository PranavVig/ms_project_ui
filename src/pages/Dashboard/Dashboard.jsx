import { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Grid,
  Paper,
  Typography
} from "@mui/material";
import api from "../../services/api";

function Dashboard() {

    const [deptCount, setDeptCount] = useState(0);
    const [empCount, setEmpCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchCounts();

    }, []);

    async function fetchCounts() {

        setLoading(true);

        try {

            const [deptRes, empRes] = await Promise.all([
                api.get("/department", { params: { page: 0, size: 1 } }),
                api.get("/emp", { params: { page: 0, size: 1 } })
            ]);

            setDeptCount(deptRes.data.totalElements);
            setEmpCount(empRes.data.totalElements);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    }

    return (
      <Box>

      <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
      >
          Dashboard
      </Typography>

      <Typography
          color="text.secondary"
          sx={{ mb: 4 }}
      >
          Welcome back! Here's an overview of your Employee Management System.
      </Typography>

      <Grid container spacing={3}>

          <Grid size={{ xs: 12, md: 6 }}>

              <Paper
                  elevation={2}
                  sx={{
                      p: 3,
                      borderRadius: 3
                  }}
              >
                  <Typography variant="h6">
                      Departments
                  </Typography>

                  <Typography
                      variant="h3"
                      sx={{ mt: 2 }}
                  >
                      {loading ? <CircularProgress size={32} /> : deptCount}
                  </Typography>

              </Paper>

          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>

              <Paper
                  elevation={2}
                  sx={{
                      p: 3,
                      borderRadius: 3
                  }}
              >
                  <Typography variant="h6">
                      Employees
                  </Typography>

                  <Typography
                      variant="h3"
                      sx={{ mt: 2 }}
                  >
                      {loading ? <CircularProgress size={32} /> : empCount}
                  </Typography>

              </Paper>

          </Grid>

      </Grid>

      <Paper
          elevation={2}
          sx={{
              mt: 4,
              p: 3,
              borderRadius: 3
          }}
      >

          <Typography
              variant="h6"
              gutterBottom
          >
              Quick Actions
          </Typography>

          <Typography color="text.secondary">
              Use the sidebar to manage Departments and Employees.
          </Typography>

      </Paper>

  </Box>
    );
}

export default Dashboard;
