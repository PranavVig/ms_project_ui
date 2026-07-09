import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fab,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Pagination,
    Paper,
    Select,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SearchIcon from "@mui/icons-material/Search";
import api from "../../services/api";

const PAGE_SIZE = 10;

const emptyForm = {
    deptId: "",
    empName: "",
    empJoiningDate: "",
    address: ""
};

function Employee() {

    const [searchParams, setSearchParams] = useSearchParams();

    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [sortBy, setSortBy] = useState("empName");
    const [direction, setDirection] = useState("asc");
    const initialSearch = searchParams.get("search") || "";

    const [searchInput, setSearchInput] = useState(initialSearch);
    const [isSearchMode, setIsSearchMode] = useState(Boolean(initialSearch));

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState("add");
    const [editingEmpId, setEditingEmpId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [formErrors, setFormErrors] = useState({});

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [empToDelete, setEmpToDelete] = useState(null);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [severity, setSeverity] = useState("success");

    useEffect(() => {

        fetchDepartments();

    }, []);

    useEffect(() => {

        const urlSearch = searchParams.get("search") || "";
    
        setSearchInput(urlSearch);
        setIsSearchMode(Boolean(urlSearch));
    
    }, [searchParams]);

    useEffect(() => {

        if (isSearchMode) {
            fetchSearchResults();
        } else {
            fetchEmployees();
        }

    }, [page, sortBy, direction, isSearchMode, searchInput]);

    function showToast(message, type = "success") {

        setSeverity(type);
        setSnackbarMessage(message);
        setOpenSnackbar(true);

    }

    function getErrorMessage(error, fallback) {

        const data = error.response?.data;

        if (typeof data === "string") {
            return data;
        }

        if (typeof data === "object" && data !== null) {
            return Object.values(data).join(", ");
        }

        return fallback;

    }

    async function fetchDepartments() {

        try {

            const response = await api.get("/department", {
                params: { page: 0, size: 100, sortBy: "deptName", direction: "asc" }
            });

            setDepartments(response.data.content);

        } catch (error) {

            console.error(error);

        }

    }

    async function fetchEmployees() {

        setLoading(true);

        try {

            const response = await api.get("/emp", {
                params: { page, size: PAGE_SIZE, sortBy, direction }
            });

            setEmployees(response.data.content);
            setTotalPages(response.data.totalPages);

        } catch (error) {

            console.error(error);
            showToast("Failed to load employees.", "error");

        } finally {

            setLoading(false);

        }

    }

    async function fetchSearchResults() {

        if (!searchInput.trim()) {
            setIsSearchMode(false);
            return;
        }

        setLoading(true);

        try {

            const response = await api.get("/search", {
                params: { keyword: searchInput.trim() }
            });

            setEmployees(response.data.employees);
            setTotalPages(0);

        } catch (error) {

            console.error(error);
            showToast("Search failed.", "error");

        } finally {

            setLoading(false);

        }

    }

    function handleSort(field) {

        if (isSearchMode) {
            return;
        }

        if (sortBy === field) {
            setDirection(direction === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setDirection("asc");
        }

        setPage(0);

    }

    function handleSearch() {

        if (!searchInput.trim()) {
            setIsSearchMode(false);
            setPage(0);
            setSearchParams({});
            return;
        }

        setIsSearchMode(true);
        setPage(0);
        setSearchParams({ search: searchInput.trim() });

    }

    function handleClearSearch() {

        setSearchInput("");
        setIsSearchMode(false);
        setPage(0);
        setSearchParams({});

    }

    function handleOpenAddDialog() {

        setDialogMode("add");
        setEditingEmpId(null);
        setForm(emptyForm);
        setFormErrors({});
        setDialogOpen(true);

    }

    function handleOpenEditDialog(emp) {

        setDialogMode("edit");
        setEditingEmpId(emp.empId);

        const dept = departments.find((d) => d.deptName === emp.departmentName);

        setForm({
            deptId: dept?.deptId ?? "",
            empName: emp.empName,
            empJoiningDate: emp.empJoiningDate,
            address: emp.address
        });
        setFormErrors({});
        setDialogOpen(true);

    }

    function handleCloseDialog() {

        setDialogOpen(false);
        setForm(emptyForm);
        setFormErrors({});

    }

    function validateForm() {

        const errors = {};

        if (!form.deptId) {
            errors.deptId = "Department is required.";
        }

        if (!form.empName.trim()) {
            errors.empName = "Employee name is required.";
        }

        if (!form.empJoiningDate) {
            errors.empJoiningDate = "Joining date is required.";
        }

        if (!form.address.trim()) {
            errors.address = "Address is required.";
        }

        setFormErrors(errors);

        return Object.keys(errors).length === 0;

    }

    async function handleSaveEmployee() {

        if (!validateForm()) {
            return;
        }

        const payload = {
            deptId: Number(form.deptId),
            empName: form.empName.trim(),
            empJoiningDate: form.empJoiningDate,
            address: form.address.trim()
        };

        try {

            if (dialogMode === "add") {
                await api.post("/emp", payload);
                showToast("Employee added successfully.");
            } else {
                await api.put(`/emp/${editingEmpId}`, payload);
                showToast("Employee updated successfully.");
            }

            handleCloseDialog();

            if (isSearchMode) {
                await fetchSearchResults();
            } else {
                await fetchEmployees();
            }

        } catch (error) {

            console.error(error);
            showToast(
                getErrorMessage(error, `Failed to ${dialogMode} employee.`),
                "error"
            );

        }

    }

    function handleOpenDeleteDialog(emp) {

        setEmpToDelete(emp);
        setDeleteDialogOpen(true);

    }

    function handleCloseDeleteDialog() {

        setDeleteDialogOpen(false);
        setEmpToDelete(null);

    }

    async function handleConfirmDelete() {

        try {

            await api.delete(`/emp/${empToDelete.empId}`);

            handleCloseDeleteDialog();
            showToast("Employee deleted successfully.");

            if (isSearchMode) {
                await fetchSearchResults();
            } else {
                await fetchEmployees();
            }

        } catch (error) {

            console.error(error);
            showToast(
                getErrorMessage(error, "Failed to delete employee."),
                "error"
            );

        }

    }

    function handleFormChange(field, value) {

        setForm((prev) => ({ ...prev, [field]: value }));

        if (formErrors[field]) {
            setFormErrors((prev) => ({ ...prev, [field]: "" }));
        }

    }

    function handlePageChange(_event, newPage) {

        setPage(newPage - 1);

    }

    const columnCount = 5;

    return (

        <Box>

            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Employees
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 3 }}>
                Manage employees and their department assignments.
            </Typography>

            <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
                <TextField
                    size="small"
                    placeholder="Search employees..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    sx={{ minWidth: 280 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                            </InputAdornment>
                        )
                    }}
                />
                <Button variant="contained" onClick={handleSearch}>
                    Search
                </Button>
                {isSearchMode && (
                    <Button variant="outlined" onClick={handleClearSearch}>
                        Clear
                    </Button>
                )}
            </Box>

            <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "bold" }}>
                                <TableSortLabel
                                    active={sortBy === "empName"}
                                    direction={sortBy === "empName" ? direction : "asc"}
                                    onClick={() => handleSort("empName")}
                                    disabled={isSearchMode}
                                >
                                    Name
                                </TableSortLabel>
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Department</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                                <TableSortLabel
                                    active={sortBy === "empJoiningDate"}
                                    direction={sortBy === "empJoiningDate" ? direction : "asc"}
                                    onClick={() => handleSort("empJoiningDate")}
                                    disabled={isSearchMode}
                                >
                                    Joining Date
                                </TableSortLabel>
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Address</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }} align="right">
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={columnCount} align="center" sx={{ py: 8 }}>
                                    <CircularProgress size={36} />
                                </TableCell>
                            </TableRow>
                        ) : employees.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columnCount} align="center" sx={{ py: 8 }}>
                                    <PersonOutlineOutlinedIcon
                                        sx={{ fontSize: 48, color: "text.disabled", mb: 1 }}
                                    />
                                    <Typography variant="h6" color="text.secondary">
                                        No employees found
                                    </Typography>
                                    <Typography variant="body2" color="text.disabled">
                                        {isSearchMode
                                            ? "Try a different search term."
                                            : "Add an employee to get started."}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            employees.map((emp) => (
                                <TableRow key={emp.empId} hover>
                                    <TableCell>{emp.empName}</TableCell>
                                    <TableCell>{emp.departmentName}</TableCell>
                                    <TableCell>{emp.empJoiningDate}</TableCell>
                                    <TableCell>{emp.address}</TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Edit">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleOpenEditDialog(emp)}
                                            >
                                                <EditOutlinedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleOpenDeleteDialog(emp)}
                                            >
                                                <DeleteOutlineOutlinedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {!isSearchMode && totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    <Pagination
                        count={totalPages}
                        page={page + 1}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
            )}

            <Fab
                color="primary"
                aria-label="add employee"
                sx={{ position: "fixed", bottom: 32, right: 32 }}
                onClick={handleOpenAddDialog}
            >
                <AddIcon />
            </Fab>

            <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>
                    {dialogMode === "add" ? "Add Employee" : "Edit Employee"}
                </DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="normal" error={Boolean(formErrors.deptId)}>
                        <InputLabel>Department</InputLabel>
                        <Select
                            value={form.deptId}
                            label="Department"
                            onChange={(e) => handleFormChange("deptId", e.target.value)}
                        >
                            {departments.map((dept) => (
                                <MenuItem key={dept.deptId} value={dept.deptId}>
                                    {dept.deptName}
                                </MenuItem>
                            ))}
                        </Select>
                        {formErrors.deptId && (
                            <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                                {formErrors.deptId}
                            </Typography>
                        )}
                    </FormControl>

                    <TextField
                        fullWidth
                        label="Employee Name"
                        margin="normal"
                        value={form.empName}
                        error={Boolean(formErrors.empName)}
                        helperText={formErrors.empName}
                        onChange={(e) => handleFormChange("empName", e.target.value)}
                    />

                    <TextField
                        fullWidth
                        label="Joining Date"
                        type="date"
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        value={form.empJoiningDate}
                        error={Boolean(formErrors.empJoiningDate)}
                        helperText={formErrors.empJoiningDate}
                        onChange={(e) => handleFormChange("empJoiningDate", e.target.value)}
                    />

                    <TextField
                        fullWidth
                        label="Address"
                        margin="normal"
                        multiline
                        rows={2}
                        value={form.address}
                        error={Boolean(formErrors.address)}
                        helperText={formErrors.address}
                        onChange={(e) => handleFormChange("address", e.target.value)}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button variant="contained" onClick={handleSaveEmployee}>
                        {dialogMode === "add" ? "Add" : "Save"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Delete Employee</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete{" "}
                        <strong>{empToDelete?.empName}</strong>?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                    <Button variant="contained" color="error" onClick={handleConfirmDelete}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

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

export default Employee;
