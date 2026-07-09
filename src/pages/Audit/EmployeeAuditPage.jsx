import { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Chip,
    Pagination,
    Paper,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tooltip,
    Typography
} from "@mui/material";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import api from "../../services/api";

const PAGE_SIZE = 10;

const ACTION_CONFIG = {
    CREATE: { label: "CREATE", color: "success" },
    UPDATE: { label: "UPDATE", color: "warning" },
    DELETE: { label: "DELETE", color: "error" }
};

const HIDDEN_KEYS = new Set(["auditId", "employeeId", "empId", "departmentId", "deptId", "id"]);

function getField(record, ...candidates) {
    for (const key of candidates) {
        if (record[key] !== undefined && record[key] !== null) return record[key];
    }
    return null;
}

function parseJsonSafe(val) {
    if (!val) return null;
    if (typeof val === "object") return val;
    try { return JSON.parse(val); } catch { return null; }
}

function formatTimestamp(ts) {
    if (!ts) return "—";
    try {
        return new Intl.DateTimeFormat("en-IN", {
            dateStyle: "medium",
            timeStyle: "short"
        }).format(new Date(ts));
    } catch {
        return String(ts);
    }
}

function renderValue(val) {
    if (val === null || val === undefined || val === "") return <em style={{ opacity: 0.5 }}>—</em>;
    return String(val);
}

function FieldDiff({ oldData, newData, action, rawRecord }) {
    const keys = Array.from(
        new Set([
            ...Object.keys(oldData || {}),
            ...Object.keys(newData || {})
        ])
    ).filter((k) => !HIDDEN_KEYS.has(k));

    if (keys.length === 0) {
        return (
            <Box>
                <Typography variant="body2" color="text.secondary">No explicit changes found.</Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.disabled', wordBreak: 'break-all' }}>
                    Raw: {JSON.stringify(rawRecord)}
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75 }}>
            {keys.map((key) => {
                const oldVal = oldData?.[key];
                const newVal = newData?.[key];
                const changed = action === "UPDATE" && String(oldVal ?? "") !== String(newVal ?? "");

                return (
                    <Box
                        key={key}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            flexWrap: "wrap"
                        }}
                    >
                        <Typography
                            variant="caption"
                            sx={{
                                fontWeight: 600,
                                minWidth: 140,
                                color: "text.secondary",
                                textTransform: "capitalize"
                            }}
                        >
                            {key.replace(/([A-Z])/g, " $1").trim()}
                        </Typography>

                        {action === "CREATE" && (
                            <Chip
                                size="small"
                                label={renderValue(newVal)}
                                variant="outlined"
                                color="success"
                                sx={{ fontWeight: 500 }}
                            />
                        )}

                        {action === "DELETE" && (
                            <Chip
                                size="small"
                                label={renderValue(oldVal)}
                                variant="outlined"
                                color="error"
                                sx={{ fontWeight: 500 }}
                            />
                        )}

                        {action === "UPDATE" && (
                            <>
                                <Chip
                                    size="small"
                                    label={renderValue(oldVal)}
                                    variant="outlined"
                                    color={changed ? "error" : "default"}
                                    sx={{ fontWeight: 500 }}
                                />
                                <ArrowForwardIcon sx={{ fontSize: 14, color: "text.disabled" }} />
                                <Chip
                                    size="small"
                                    label={renderValue(newVal)}
                                    variant="outlined"
                                    color={changed ? "success" : "default"}
                                    sx={{ fontWeight: 500 }}
                                />
                            </>
                        )}
                    </Box>
                );
            })}
        </Box>
    );
}

function SkeletonRows({ count = 5 }) {
    return Array.from({ length: count }).map((_, i) => (
        <TableRow key={i}>
            <TableCell><Skeleton variant="rounded" width={70} height={24} /></TableCell>
            <TableCell><Skeleton width="60%" /></TableCell>
            <TableCell><Skeleton width="80%" /><Skeleton width="40%" /></TableCell>
            <TableCell><Skeleton width="70%" /></TableCell>
        </TableRow>
    ));
}

function EmployeeAuditPage() {

    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchAudit();
    }, [page]);

    async function fetchAudit() {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get("/emp/audit", {
                params: { page, size: PAGE_SIZE }
            });

            console.log("Employee Audit API response:", response.data);

            const data = response.data;

            if (Array.isArray(data)) {
                setRecords(data);
                setTotalPages(0);
            } else if (data && typeof data === "object") {
                const content = data.content ?? data.data ?? data.records ?? data.results ?? [];
                setRecords(Array.isArray(content) ? content : []);
                setTotalPages(data.totalPages ?? Math.ceil((data.totalElements ?? 0) / PAGE_SIZE) ?? 0);
            } else {
                setRecords([]);
                setTotalPages(0);
            }
        } catch (err) {
            console.error("Employee Audit API error:", err);
            setError("Failed to load employee audit records. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    function handlePageChange(_event, newPage) {
        setPage(newPage - 1);
    }

    function extractRecord(record) {
        const action = (
            getField(record, "action", "actionType", "operationType", "operation", "type", "eventType", "revType") || ""
        ).toUpperCase();

        const timestamp = getField(record, "timestamp", "createdAt", "auditTimestamp", "changedAt", "modifiedAt", "dateTime", "date", "time", "createdDate", "revtstmp");

        const rawOld = getField(record, "oldData", "oldValues", "previousState", "before", "old_data", "previousData", "oldValue");
        const rawNew = getField(record, "newData", "newValues", "currentState", "after", "new_data", "currentData", "newValue", "entity", "data", "payload");

        let oldData = parseJsonSafe(rawOld);
        let newData = parseJsonSafe(rawNew);

        if (!oldData && !newData) {
            const knownKeys = new Set(["action", "actionType", "operationType", "operation", "type", "eventType", "revType", "timestamp", "createdAt", "auditTimestamp", "changedAt", "modifiedAt", "dateTime", "date", "time", "createdDate", "revtstmp", "performedBy", "changedBy", "modifiedBy", "updatedBy", "username", "user", "actor", "auditId", "id", "audit_id", "rev"]);
            const flatData = {};
            for (const k in record) {
                if (!knownKeys.has(k)) {
                    flatData[k] = record[k];
                }
            }
            if (Object.keys(flatData).length > 0) {
                if (action.includes("DEL") || action.includes("REM")) {
                    oldData = flatData;
                } else {
                    newData = flatData;
                }
            }
        }

        const performedBy = getField(record, "performedBy", "changedBy", "modifiedBy", "updatedBy", "username", "user", "actor", "createdBy");

        const id = getField(record, "auditId", "id", "audit_id", "rev");

        let normalizedAction = action;
        if (action.includes("ADD") || action.includes("CREAT") || action.includes("INS")) normalizedAction = "CREATE";
        else if (action.includes("MOD") || action.includes("UPD")) normalizedAction = "UPDATE";
        else if (action.includes("DEL") || action.includes("REM")) normalizedAction = "DELETE";

        return { action: normalizedAction || "UNKNOWN", timestamp, oldData, newData, performedBy, id, _raw: record };
    }

    return (
        <Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
                <AssignmentOutlinedIcon color="action" />
                <Typography variant="h4" fontWeight="bold">
                    Employee Audit
                </Typography>
            </Box>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
                Track all create, update, and delete operations on employees.
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <TableContainer
                component={Paper}
                elevation={2}
                sx={{ borderRadius: 3 }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "bold", width: 110 }}>Action</TableCell>
                            <TableCell sx={{ fontWeight: "bold", width: 190 }}>Timestamp</TableCell>
                            <TableCell sx={{ fontWeight: "bold" }}>Changes</TableCell>
                            <TableCell sx={{ fontWeight: "bold", width: 160 }}>Performed By</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {loading ? (
                            <SkeletonRows count={PAGE_SIZE} />
                        ) : error ? null : records.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                                    <AssignmentOutlinedIcon
                                        sx={{ fontSize: 48, color: "text.disabled", mb: 1 }}
                                    />
                                    <Typography variant="h6" color="text.secondary">
                                        No audit records found
                                    </Typography>
                                    <Typography variant="body2" color="text.disabled">
                                        Employee changes will appear here.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            records.map((record, index) => {
                                const { action, timestamp, oldData, newData, performedBy, id, _raw } = extractRecord(record);
                                const actionCfg = ACTION_CONFIG[action] || { label: action || "UNKNOWN", color: "default" };

                                return (
                                    <TableRow
                                        key={id ?? `${action}-${index}`}
                                        hover
                                        sx={{
                                            "&:hover": { bgcolor: "action.hover" },
                                            verticalAlign: "top"
                                        }}
                                    >
                                        <TableCell>
                                            <Tooltip title={actionCfg.label}>
                                                <Chip
                                                    label={actionCfg.label}
                                                    color={actionCfg.color}
                                                    size="small"
                                                    sx={{ fontWeight: 700, minWidth: 72 }}
                                                />
                                            </Tooltip>
                                        </TableCell>

                                        <TableCell>
                                            <Typography variant="body2">
                                                {formatTimestamp(timestamp)}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <FieldDiff
                                                oldData={oldData}
                                                newData={newData}
                                                action={action}
                                                rawRecord={_raw}
                                            />
                                        </TableCell>

                                        <TableCell>
                                            <Typography variant="body2">
                                                {performedBy || "N/A"}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {!loading && !error && totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    <Pagination
                        count={totalPages}
                        page={page + 1}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Box>
            )}

        </Box>
    );

}

export default EmployeeAuditPage;
