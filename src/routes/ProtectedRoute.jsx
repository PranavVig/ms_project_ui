import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ allowedRoles }) {

    const auth = localStorage.getItem("auth");
    const role = localStorage.getItem("role");

    if (!auth) {
        return <Navigate to="/login" replace />;
    }

    if (
        allowedRoles &&
        allowedRoles.length > 0 &&
        !allowedRoles.includes(role)
    ) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;