import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Explore from "./pages/Explore";
import ProjectDetails from "./pages/ProjectDetails";
import CreateProject from "./pages/CreateProject";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";

const App = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>

                {/* Public Routes */}
                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/explore"
                    element={<Explore />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/projects/:projectId"
                    element={<ProjectDetails />}
                />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>

                    <Route
                        path="/create-project"
                        element={<CreateProject />}
                    />

                    <Route
                        path="/profile/:username"
                        element={<Profile />}
                    />

                    <Route
                        path="/notifications"
                        element={<Notifications />}
                    />

                </Route>

            </Route>
        </Routes>
    );
};

export default App;