import {
    Link,
    NavLink,
} from "react-router-dom";

import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
    const {
        theme,
        toggleTheme,
    } = useTheme();

    return (
        <header
            className="border-b"
            style={{
                backgroundColor:
                    "var(--background)",
                borderColor:
                    "var(--border)",
            }}
        >
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                {/* Logo */}
                <Link
                    to="/"
                    className="text-2xl font-bold"
                    style={{
                        color: "var(--foreground)",
                    }}
                >
                    CodeHub
                </Link>

                {/* Navigation */}
                <div className="flex items-center gap-6">

                    <NavLink
                        to="/"
                        className="text-sm font-medium"
                        style={{
                            color: "var(--foreground)",
                        }}
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/explore"
                        className="text-sm font-medium"
                        style={{
                            color: "var(--muted)",
                        }}
                    >
                        Explore
                    </NavLink>

                    <Link
                        to="/login"
                        className="text-sm font-medium"
                        style={{
                            color: "var(--muted)",
                        }}
                    >
                        Login
                    </Link>

                    <Link
                        to="/register"
                        className="rounded-lg px-4 py-2 text-sm font-medium"
                        style={{
                            backgroundColor:
                                "var(--primary)",
                            color:
                                "var(--primary-foreground)",
                        }}
                    >
                        Register
                    </Link>

                    {/* Theme Toggle */}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border"
                        style={{
                            borderColor:
                                "var(--border)",
                            backgroundColor:
                                "var(--surface)",
                            color:
                                "var(--foreground)",
                        }}
                        aria-label="Toggle theme"
                        title={
                            theme === "light"
                                ? "Switch to dark mode"
                                : "Switch to light mode"
                        }
                    >
                        {theme === "light"
                            ? "🌙"
                            : "☀️"}
                    </button>

                </div>
            </nav>
        </header>
    );
};

export default Navbar;