import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Grid,
    Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import api from "../../services/api";

function formatDateTime(value) {

    if (!value) {
        return "—";
    }

    return new Date(value).toLocaleString();

}

function DepartmentDetails() {

    const { deptId } = useParams();
    const navigate = useNavigate();

    const [department, setDepartment] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [loadingDept, setLoadingDept] = useState(true);
    const [loadingEmployees, setLoadingEmployees] = useState(true);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {

        fetchDepartmentDetails();
        fetchEmployees();

    }, [deptId]);

    async function fetchDepartmentDetails() {

        setLoadingDept(true);

        try {

            const response = await api.get(`/department/${deptId}`);

            setDepartment(response.data);

        } catch (error) {

            console.error(error);
            setOpenSnackbar(true);

        } finally {

            setLoadingDept(false);

        }

    }

    async function fetchEmployees() {

        setLoadingEmployees(true);

        try {

            const response = await api.get(`/department/${deptId}/employees`);

            setEmployees(response.data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoadingEmployees(false);

        }

    }

    if (loadingDept) {

        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
                <CircularProgress />
            </Box>
        );

    }

    if (!department) {

        return (
            <Box>
                <Typography variant="h6" color="error" gutterBottom>
                    Department not found.
                </Typography>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/departments")}>
                    Back to Departments
                </Button>
            </Box>
        );

    }

    return (

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
            DEPARTMENT DETAILS
        </Typography>

        <Typography
            variant="h3"
            sx={{
                mt: 0.5,
                fontWeight: 700,
            }}
        >
            {department.deptName}
        </Typography>

        <Typography
            color="text.secondary"
            sx={{
                mt: 1,
            }}
        >
            Department information, activity and assigned employees.
        </Typography>

    </Box>

    <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/departments")}
    >
        Back
    </Button>

</Paper>
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper elevation={4} sx={{ p: 2.5, borderRadius: 1.5 }}>
                        <Typography variant="body2" color="text.secondary">
                            Employee Count
                        </Typography>
                        <Typography variant="h4" sx={{ mt: 1 }}>
                            {department.employeeCount ?? 0}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper elevation={4} sx={{ p: 2, borderRadius: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            Created
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            {formatDateTime(department.createdAt)}
                        </Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper elevation={4} sx={{ p: 2, borderRadius: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            Updated
                        </Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            {formatDateTime(department.updatedAt)}
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Typography
    variant="h5"
    fontWeight={700}
    sx={{
        mb: 3,
        textAlign: 'center',
        mr: '98px', // Pushes it 50px to the right. Use 'mr' to push left.
    }}
>
     Assigned Employees
</Typography>

            <TableContainer
    component={Paper}
    elevation={0}
    sx={{
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
    }}
>
                <Table>
                    <TableHead>
                    <TableRow
    sx={{
        bgcolor: "action.hover",
    }}
>
                            <TableCell sx={{ fontWeight: "bold" }}>Employee Name</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Joining Date</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Address</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loadingEmployees ? (
                            <TableRow>
                                <TableCell colSpan={3} align="center" sx={{ py: 6 }}>
                                    <CircularProgress size={32} />
                                </TableCell>
                            </TableRow>
                        ) : employees.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} align="center" sx={{ py: 6 }}>
                                    <PersonOutlineOutlinedIcon
                                        sx={{ fontSize: 52, color: "text.disabled", mb: 1 }}
                                    />
                                   <Typography
    variant="h6"
    color="text.secondary"
>
                                        No employees in this department.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            employees.map((emp) => (
                                <TableRow
                                key={emp.empId}
                                hover
                                sx={{
                                    transition: "background-color .2s ease",
                            
                                    "& td": {
                                        py: 2,
                                    },
                            
                                    "&:hover": {
                                        bgcolor: "action.hover",
                                    },
                                }}
                            >
                                    <TableCell>{emp.empName}</TableCell>
                                    <TableCell>{emp.empJoiningDate}</TableCell>
                                    <TableCell>{emp.address}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert severity="error" variant="filled">
                    Failed to load department details.
                </Alert>
            </Snackbar>

        </Box>

    );

}

export default DepartmentDetails;
