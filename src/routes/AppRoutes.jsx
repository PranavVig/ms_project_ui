import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Department from "../pages/Department/Department";
import DepartmentDetails from "../pages/Department/DepartmentDetails";
import Employee from "../pages/Employee/Employee";
import NotFound from "../pages/NotFound/NotFound";

import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>

                <Route path="/" element={<Navigate to="/login" />} />

                <Route path="/login" element={<Login />} />

                <Route element={<ProtectedRoute />}>

                    <Route element={<DashboardLayout />}>

                        <Route path="/dashboard" element={<Dashboard />} />

                        <Route path="/departments" element={<Department />} />

                        <Route path="/departments/:deptId" element={<DepartmentDetails />} />

                        <Route path="/employees" element={<Employee />} />

                    </Route>

                </Route>

                <Route path="*" element={<NotFound />} />

            </Routes>

        </BrowserRouter>

    );

}

export default AppRoutes;
