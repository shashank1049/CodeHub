import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Explore from "./pages/Explore";
import ProjectDetails from "./pages/ProjectDetails";
import CreateProject from "./pages/CreateProject";
import Profile from "./pages/Profile";

function App() {
    return (
        <Routes>
            {/* Main Application */}
            <Route element={<MainLayout />}>
                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/explore"
                    element={<Explore />}
                />

                <Route
                    path="/projects/:projectId"
                    element={<ProjectDetails />}
                />

                <Route
                    path="/projects/create"
                    element={<CreateProject />}
                />

                <Route
                    path="/profile/:username"
                    element={<Profile />}
                />
            </Route>

            {/* Authentication */}
            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />
        </Routes>
    );
}

export default App;