import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    AppBar,
    Box,
    ClickAwayListener,
    IconButton,
    InputAdornment,
    List,
    ListItemButton,
    ListItemText,
    Paper,
    TextField,
    Toolbar,
    Tooltip,
    Typography
} from "@mui/material";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import SearchIcon from "@mui/icons-material/Search";
import api from "../services/api";
import { useThemeMode } from "../theme/ThemeModeContext";

function highlightMatch(text, keyword) {

    if (!keyword.trim() || !text) {
        return text;
    }

    const index = text.toLowerCase().indexOf(keyword.toLowerCase());

    if (index === -1) {
        return text;
    }

    const before = text.slice(0, index);
    const match = text.slice(index, index + keyword.length);
    const after = text.slice(index + keyword.length);

    return (
        <>
            {before}
            <Box component="span" sx={{ fontWeight: 700, color: "primary.main" }}>
                {match}
            </Box>
            {after}
        </>
    );

}

function Navbar() {

    const navigate = useNavigate();
    const { mode, toggleTheme } = useThemeMode();
    const searchRef = useRef(null);

    const [keyword, setKeyword] = useState("");
    const [results, setResults] = useState({ departments: [], employees: [] });
    const [openDropdown, setOpenDropdown] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const flatResults = [
        ...results.departments.map((d) => ({ type: "department", item: d })),
        ...results.employees.map((e) => ({ type: "employee", item: e }))
    ];

    useEffect(() => {

        if (!keyword.trim()) {
            setResults({ departments: [], employees: [] });
            setOpenDropdown(false);
            setActiveIndex(-1);
            return;
        }

        const timer = setTimeout(async () => {

            try {

                const response = await api.get("/search", {
                    params: { keyword: keyword.trim() }
                });

                setResults(response.data);
                setOpenDropdown(true);
                setActiveIndex(-1);

            } catch (error) {

                console.error(error);

            }

        }, 300);

        return () => clearTimeout(timer);

    }, [keyword]);

    function handleSelect(result) {

        setOpenDropdown(false);
        setKeyword("");

        if (result.type === "department") {
            navigate(`/departments/${result.item.deptId}`);
        } else {
            navigate(`/employees?search=${encodeURIComponent(result.item.empName)}`);
        }

    }

    function handleKeyDown(event) {

        if (!openDropdown || flatResults.length === 0) {
            return;
        }

        if (event.key === "ArrowDown") {
            event.preventDefault();
            setActiveIndex((prev) => (prev + 1) % flatResults.length);
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActiveIndex((prev) =>
                prev <= 0 ? flatResults.length - 1 : prev - 1
            );
        } else if (event.key === "Enter" && activeIndex >= 0) {
            event.preventDefault();
            handleSelect(flatResults[activeIndex]);
        } else if (event.key === "Escape") {
            setOpenDropdown(false);
        }

    }

    return (

        <AppBar position="static" elevation={1} color="inherit">

            <Toolbar sx={{ gap: 2 }}>

                <Typography variant="h6" fontWeight="bold" sx={{ flexShrink: 0 }}>
                    Employee Management Portal
                </Typography>

                <Box ref={searchRef} sx={{ position: "relative", flexGrow: 1, maxWidth: 480 }}>
                    <TextField
                        size="small"
                        fullWidth
                        placeholder="Search departments & employees..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onFocus={() => keyword.trim() && setOpenDropdown(true)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            )
                        }}
                    />

                    {openDropdown && flatResults.length > 0 && (
                        <ClickAwayListener onClickAway={() => setOpenDropdown(false)}>
                            <Paper
                                elevation={4}
                                sx={{
                                    position: "absolute",
                                    top: "100%",
                                    left: 0,
                                    right: 0,
                                    mt: 0.5,
                                    zIndex: 1300,
                                    maxHeight: 320,
                                    overflow: "auto"
                                }}
                            >
                                <List dense disablePadding>
                                    {flatResults.map((result, index) => (
                                        <ListItemButton
                                            key={`${result.type}-${result.item.deptId || result.item.empId}`}
                                            selected={index === activeIndex}
                                            onClick={() => handleSelect(result)}
                                        >
                                            <ListItemText
                                                primary={
                                                    result.type === "department"
                                                        ? highlightMatch(result.item.deptName, keyword)
                                                        : highlightMatch(result.item.empName, keyword)
                                                }
                                                secondary={
                                                    result.type === "department"
                                                        ? "Department"
                                                        : `Employee · ${result.item.departmentName}`
                                                }
                                            />
                                        </ListItemButton>
                                    ))}
                                </List>
                            </Paper>
                        </ClickAwayListener>
                    )}
                </Box>

                <Tooltip title={mode === "light" ? "Dark mode" : "Light mode"}>
                    <IconButton onClick={toggleTheme} aria-label="toggle theme">
                        {mode === "light" ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
                    </IconButton>
                </Tooltip>

            </Toolbar>

        </AppBar>

    );

}

export default Navbar;
