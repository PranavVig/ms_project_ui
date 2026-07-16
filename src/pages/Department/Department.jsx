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
    const role = localStorage.getItem("role");
    const isAdmin = role === "ROLE_ADMIN";

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
        
            handleClearSearch();
        
            return;
        
        } 
        
        
        
            setPage(0);
        
        
        
            if (isSearchMode) {
        
                fetchSearchResults();
        
            } else {
        
                setIsSearchMode(true);
        
            }
        
        
        
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

    const columnCount = isAdmin ? 2 : 1;

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
            MANAGEMENT
        </Typography>

        <Typography
            variant="h3"
            sx={{
                mt: 0.5,
                fontWeight: 700,
            }}
        >
            Departments
        </Typography>

        <Typography
            color="text.secondary"
            sx={{
                mt: 1,
                maxWidth: 550,
            }}
        >
            Organize departments across your organisation.
        </Typography>

    </Box>
    {isAdmin && (
    <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleOpenAddDialog}
    >
        Add Department
    </Button>
)}

</Paper>

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
                            {isAdmin && (
    <TableCell
        sx={{ fontWeight: "bold" }}
        align="right"
    >
        Actions
    </TableCell>
)}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading ? (
                          <TableRow
                          sx={{
                              bgcolor: "action.hover",
                          }}
                      >
                                <TableCell colSpan={columnCount} align="center" sx={{ py: 8 }}>
                                    <CircularProgress size={36} />
                                </TableCell>
                            </TableRow>
                        ) : departments.length === 0 ? (
                            <TableRow
                            sx={{
                                bgcolor: "action.hover",
                            }}
                        >
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
                                sx={{
                                    cursor: "pointer",
                                    transition: "background-color .2s ease",
                            
                                    "& td": {
                                        py: 2,
                                    },
                            
                                    "&:hover": {
                                        bgcolor: "action.hover",
                                    },
                                }}
                                    onClick={() => handleRowClick(dept.deptId)}
                                >
                                    <TableCell>{dept.deptName}</TableCell>
                                    {isAdmin && (
    <TableCell align="right">
        <Tooltip title="Edit">
            <IconButton
                size="small"
                sx={{
                    borderRadius: 2,
                    mr: 0.5,
                }}
                onClick={(e) => handleOpenEditDialog(dept, e)}
            >
                <EditOutlinedIcon fontSize="small" />
            </IconButton>
        </Tooltip>

        <Tooltip title="Delete">
            <IconButton
                size="small"
                color="error"
                sx={{
                    borderRadius: 2,
                }}
                onClick={(e) => handleOpenDeleteDialog(dept, e)}
            >
                <DeleteOutlineOutlinedIcon fontSize="small" />
            </IconButton>
        </Tooltip>
    </TableCell>
)}
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



            <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
            <DialogTitle
    sx={{
        fontWeight: 700,
        pb: 1,
    }}
>
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
            <DialogTitle
    sx={{
        fontWeight: 700,
        pb: 1,
    }}
>Delete Department</DialogTitle>
                <DialogContent>
                <Box>

<Typography
    color="text.secondary"
    sx={{ mb: 2 }}
>
    This action cannot be undone.
</Typography>

<Paper
    variant="outlined"
    sx={{
        p: 2,
        borderRadius: 2,
    }}
>
    <Typography variant="subtitle2">
        Department
    </Typography>

    <Typography fontWeight={600}>
        {deptToDelete?.deptName}
    </Typography>
</Paper>

</Box>
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
