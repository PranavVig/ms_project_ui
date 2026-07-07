import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    IconButton,
    InputAdornment,
    Pagination,
    Paper,
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
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SearchIcon from "@mui/icons-material/Search";
import api from "../../services/api";

const PAGE_SIZE = 10;

function Department() {

    const navigate = useNavigate();

    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [sortBy, setSortBy] = useState("deptName");
    const [direction, setDirection] = useState("asc");
    const [searchInput, setSearchInput] = useState("");
    const [isSearchMode, setIsSearchMode] = useState(false);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState("add");
    const [editingDeptId, setEditingDeptId] = useState(null);
    const [deptName, setDeptName] = useState("");
    const [nameError, setNameError] = useState("");

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deptToDelete, setDeptToDelete] = useState(null);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [severity, setSeverity] = useState("success");

    useEffect(() => {

        if (isSearchMode) {
            fetchSearchResults();
        } else {
            fetchDepartments();
        }

    }, [page, sortBy, direction, isSearchMode]);

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

        return fallback;

    }

    async function fetchDepartments() {

        setLoading(true);

        try {

            const response = await api.get("/department", {
                params: { page, size: PAGE_SIZE, sortBy, direction }
            });

            setDepartments(response.data.content);
            setTotalPages(response.data.totalPages);

        } catch (error) {

            console.error(error);
            showToast("Failed to load departments.", "error");

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

            setDepartments(response.data.departments);
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
            return;
        }

        setIsSearchMode(true);
        setPage(0);

    }

    function handleClearSearch() {

        setSearchInput("");
        setIsSearchMode(false);
        setPage(0);

    }

    function handleOpenAddDialog() {

        setDialogMode("add");
        setEditingDeptId(null);
        setDeptName("");
        setNameError("");
        setDialogOpen(true);

    }

    function handleOpenEditDialog(dept, event) {

        event.stopPropagation();

        setDialogMode("edit");
        setEditingDeptId(dept.deptId);
        setDeptName(dept.deptName);
        setNameError("");
        setDialogOpen(true);

    }

    function handleCloseDialog() {

        setDialogOpen(false);
        setDeptName("");
        setNameError("");
        setEditingDeptId(null);

    }

    async function handleSaveDepartment() {

        if (!deptName.trim()) {
            setNameError("Department name is required.");
            return;
        }

        try {

            if (dialogMode === "add") {
                await api.post("/department", { deptName: deptName.trim() });
                showToast("Department added successfully.");
            } else {
                await api.put(`/department/${editingDeptId}`, { deptName: deptName.trim() });
                showToast("Department updated successfully.");
            }

            handleCloseDialog();

            if (isSearchMode) {
                await fetchSearchResults();
            } else {
                await fetchDepartments();
            }

        } catch (error) {

            console.error(error);
            showToast(
                getErrorMessage(error, `Failed to ${dialogMode} department.`),
                "error"
            );

        }

    }

    function handleOpenDeleteDialog(dept, event) {

        event.stopPropagation();

        setDeptToDelete(dept);
        setDeleteDialogOpen(true);

    }

    function handleCloseDeleteDialog() {

        setDeleteDialogOpen(false);
        setDeptToDelete(null);

    }

    async function handleConfirmDelete() {

        try {

            await api.delete(`/department/${deptToDelete.deptId}`);

            handleCloseDeleteDialog();
            showToast("Department deleted successfully.");

            if (isSearchMode) {
                await fetchSearchResults();
            } else {
                await fetchDepartments();
            }

        } catch (error) {

            console.error(error);
            showToast(
                getErrorMessage(error, "Failed to delete department."),
                "error"
            );

        }

    }

    function handleRowClick(deptId) {

        navigate(`/departments/${deptId}`);

    }

    function handlePageChange(_event, newPage) {

        setPage(newPage - 1);

    }

    const columnCount = 3;

    return (

        <Box>

            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Departments
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 3 }}>
                Manage departments in your organization.
            </Typography>

            <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
                <TextField
                    size="small"
                    placeholder="Search departments..."
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
                                    active={sortBy === "deptId"}
                                    direction={sortBy === "deptId" ? direction : "asc"}
                                    onClick={() => handleSort("deptId")}
                                    disabled={isSearchMode}
                                >
                                    Department ID
                                </TableSortLabel>
                            </TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>
                                <TableSortLabel
                                    active={sortBy === "deptName"}
                                    direction={sortBy === "deptName" ? direction : "asc"}
                                    onClick={() => handleSort("deptName")}
                                    disabled={isSearchMode}
                                >
                                    Department Name
                                </TableSortLabel>
                            </TableCell>
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
                        ) : departments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columnCount} align="center" sx={{ py: 8 }}>
                                    <BusinessOutlinedIcon
                                        sx={{ fontSize: 48, color: "text.disabled", mb: 1 }}
                                    />
                                    <Typography variant="h6" color="text.secondary">
                                        No departments found
                                    </Typography>
                                    <Typography variant="body2" color="text.disabled">
                                        {isSearchMode
                                            ? "Try a different search term."
                                            : "Add a department to get started."}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            departments.map((dept) => (
                                <TableRow
                                    key={dept.deptId}
                                    hover
                                    sx={{ cursor: "pointer" }}
                                    onClick={() => handleRowClick(dept.deptId)}
                                >
                                    <TableCell>{dept.deptId}</TableCell>
                                    <TableCell>{dept.deptName}</TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Edit">
                                            <IconButton
                                                size="small"
                                                onClick={(e) => handleOpenEditDialog(dept, e)}
                                            >
                                                <EditOutlinedIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={(e) => handleOpenDeleteDialog(dept, e)}
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
                aria-label="add department"
                sx={{ position: "fixed", bottom: 32, right: 32 }}
                onClick={handleOpenAddDialog}
            >
                <AddIcon />
            </Fab>

            <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>
                    {dialogMode === "add" ? "Add Department" : "Edit Department"}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        fullWidth
                        label="Department Name"
                        margin="normal"
                        value={deptName}
                        error={Boolean(nameError)}
                        helperText={nameError}
                        onChange={(e) => {
                            setDeptName(e.target.value);
                            if (nameError) {
                                setNameError("");
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button variant="contained" onClick={handleSaveDepartment}>
                        {dialogMode === "add" ? "Add" : "Save"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Delete Department</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete{" "}
                        <strong>{deptToDelete?.deptName}</strong>?
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

export default Department;
