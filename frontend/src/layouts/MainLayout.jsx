import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";

const MainLayout = () => {
    return (
        <div
            className="min-h-screen"
            style={{
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
            }}
        >
            <Navbar />

            <main className="min-h-[calc(100vh-140px)]">
                <Outlet />
            </main>

            <footer
                className="border-t px-6 py-8 text-center text-sm"
                style={{
                    borderColor: "var(--border)",
                    color: "var(--muted)",
                }}
            >
                © 2026 CodeHub. All rights reserved.
            </footer>
        </div>
    );
};

export default MainLayout;