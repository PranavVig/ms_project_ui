import { useEffect, useState } from "react";
import {
    Box,
    Button,
    CircularProgress,
    Grid,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

import { motion } from "framer-motion";
import {
    ArrowRight,
    Building2,
    Users,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Dashboard() {

    const navigate = useNavigate();
    const role = localStorage.getItem("role");

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
                api.get("/department", {
                    params: {
                        page: 0,
                        size: 1,
                    },
                }),
                api.get("/emp", {
                    params: {
                        page: 0,
                        size: 1,
                    },
                }),
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

        <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
        >
<Box>
<Paper
    sx={{
        mb: 4,
        p: 4,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 3,
    }}
>

    <Box>

        <Typography
            variant="overline"
            color="primary"
            sx={{
                fontWeight: 700,
                letterSpacing: 2,
            }}
        >
            OVERVIEW
        </Typography>

        <Typography
            variant="h3"
            sx={{
                mt: 0.5,
                fontWeight: 700,
            }}
        >
            Dashboard
        </Typography>

        <Typography
            color="text.secondary"
            sx={{
                mt: 1,
                maxWidth: 550,
            }}
        >
            Monitor departments, employees and audit activity from a single place.
        </Typography>

    </Box>

    <Button
        variant="contained"
        onClick={fetchCounts}
    >
        Refresh Data
    </Button>

</Paper>

    

                <Grid container spacing={3}>                    <Grid size={{ xs: 12, md: 6 }}>

<motion.div
    whileHover={{
        y: -4,
    }}
    transition={{
        duration: 0.2,
    }}
    style={{ height: "100%" }}
>

    <Paper
        sx={{
            p: 3,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
        }}
    >

        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
        >

            <Typography
                variant="subtitle1"
                fontWeight={600}
            >
                Departments
            </Typography>
            <Building2
                size={22}
                strokeWidth={1}
            />
        

        </Stack>

        <Typography
            variant="h3"
            sx={{
                mt: 4,
                mb: 1,
            }}
        >
            {loading ? (
                <CircularProgress size={32} />
            ) : (
                deptCount
            )}
        </Typography>

        <Typography
            variant="body2"
            color="text.secondary"
        >
            Active Departments
        </Typography>

    </Paper>

</motion.div>

</Grid>

<Grid size={{ xs: 12, md: 6 }}>

<motion.div
    whileHover={{
        y: -4,
    }}
    transition={{
        duration: 0.2,
    }}
    style={{ height: "100%" }}
>

    <Paper
        sx={{
            p: 3,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
        }}
    >

        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
        >
           
            <Typography
                variant="subtitle1"
                fontWeight={600}
            >
                Employees
            </Typography>
            <Users
                size={22}
                strokeWidth={1}
            />


        </Stack>

        <Typography
            variant="h3"
            sx={{
                mt: 4,
                mb: 1,
            }}
        >
            {loading ? (
                <CircularProgress size={32} />
            ) : (
                empCount
            )}
        </Typography>

        <Typography
            variant="body2"
            color="text.secondary"
        >
            Registered Employees
        </Typography>

    </Paper>

</motion.div>

</Grid>

</Grid>

<Paper
sx={{
mt: 4,
p: 3,
}}
>                    <Typography
                        variant="h6"
                        fontWeight={600}
                    >
                        Quick Actions
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mt: 1,
                            mb: 3,
                        }}
                    >
                        Access the most frequently used management modules.
                    </Typography>
                    <Grid container spacing={2}>

    <Grid size={{ xs: 12, md: 4 }}>

        <Button
            fullWidth
            variant="contained"
            endIcon={<ArrowRight size={18} />}
            onClick={() => navigate("/departments")}
            sx={{
                py: 1.3,
            }}
        >
            Manage Departments
        </Button>

    </Grid>

    <Grid size={{ xs: 12, md: 4 }}>

        <Button
            fullWidth
            variant="outlined"
            endIcon={<ArrowRight size={18} />}
            onClick={() => navigate("/employees")}
            sx={{
                py: 1.3,
            }}
        >
            Manage Employees
        </Button>

    </Grid>

    {role !== "ROLE_EMPLOYEE" && (
        <Grid size={{ xs: 12, md: 4 }}>

            <Button
                fullWidth
                variant="outlined"
                endIcon={<ArrowRight size={18} />}
                onClick={() => navigate("/department/audit")}
                sx={{
                    py: 1.3,
                }}
            >
                View Audit Logs
            </Button>

        </Grid>
    )}

</Grid>

                </Paper>
                </Box>

</motion.div>

);
}

export default Dashboard;