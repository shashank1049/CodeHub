
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // ==============================
    // HANDLE INPUT CHANGE
    // ==============================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        if (error) setError("");
    };

    // ==============================
    // HANDLE LOGIN
    // ==============================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            await login(formData);
            navigate("/");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Login failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // ==============================
    // MAIN UI
    // ==============================

    return (
        <div
            className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8 sm:px-6 sm:py-12"
            style={{
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
            }}
        >
            <div className="w-full max-w-md">

                {/* LOGIN CARD */}

                <div
                    className="rounded-2xl border p-5 shadow-sm sm:rounded-3xl sm:p-8 md:p-10"
                    style={{
                        backgroundColor: "var(--surface)",
                        borderColor: "var(--border)",
                    }}
                >
                    {/* HEADER */}

                    <div className="mb-7 text-center sm:mb-8">
                        <div
                            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-bold"
                            style={{
                                backgroundColor: "var(--primary)",
                                color: "var(--primary-foreground)",
                            }}
                        >
                            C
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            Welcome back
                        </h1>

                        <p
                            className="mt-2 text-sm sm:text-base"
                            style={{ color: "var(--muted)" }}
                        >
                            Sign in to your CodeHub account
                        </p>
                    </div>

                    {/* ERROR MESSAGE */}

                    {error && (
                        <div
                            role="alert"
                            className="mb-5 rounded-xl border px-4 py-3 text-sm"
                            style={{
                                color: "var(--danger)",
                                borderColor: "var(--danger)",
                                backgroundColor: "var(--background)",
                            }}
                        >
                            {error}
                        </div>
                    )}

                    {/* LOGIN FORM */}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        {/* EMAIL */}

                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-semibold"
                            >
                                Email address
                            </label>

                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                autoComplete="email"
                                required
                                className="min-h-12 w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 sm:text-base"
                                style={{
                                    backgroundColor: "var(--input)",
                                    borderColor: "var(--border)",
                                    color: "var(--foreground)",
                                    "--tw-ring-color": "var(--primary)",
                                }}
                            />
                        </div>

                        {/* PASSWORD */}

                        <div>
                            <div className="mb-2 flex items-center justify-between gap-2">
                                <label
                                    htmlFor="password"
                                    className="text-sm font-semibold"
                                >
                                    Password
                                </label>
                            </div>

                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    required
                                    className="min-h-12 w-full rounded-xl border py-3 pl-4 pr-16 text-sm outline-none transition focus:ring-2 sm:text-base"
                                    style={{
                                        backgroundColor: "var(--input)",
                                        borderColor: "var(--border)",
                                        color: "var(--foreground)",
                                        "--tw-ring-color": "var(--primary)",
                                    }}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword((previous) => !previous)
                                    }
                                    className="absolute inset-y-0 right-3 my-auto min-h-10 px-2 text-xs font-semibold transition-opacity hover:opacity-70"
                                    style={{ color: "var(--muted)" }}
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>

                        {/* SUBMIT BUTTON */}

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex min-h-12 w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
                            style={{
                                backgroundColor: "var(--primary)",
                                color: "var(--primary-foreground)",
                            }}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span
                                        className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                                        aria-hidden="true"
                                    />
                                    Signing in...
                                </span>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    {/* DIVIDER */}

                    <div className="my-6 flex items-center gap-3">
                        <div
                            className="h-px flex-1"
                            style={{ backgroundColor: "var(--border)" }}
                        />
                        <span
                            className="text-xs"
                            style={{ color: "var(--muted)" }}
                        >
                            NEW TO CODEHUB?
                        </span>
                        <div
                            className="h-px flex-1"
                            style={{ backgroundColor: "var(--border)" }}
                        />
                    </div>

                    {/* REGISTER LINK */}

                    <p
                        className="text-center text-sm"
                        style={{ color: "var(--muted)" }}
                    >
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="font-semibold underline underline-offset-4 transition-opacity hover:opacity-70"
                            style={{ color: "var(--primary)" }}
                        >
                            Create one
                        </Link>
                    </p>
                </div>

                {/* FOOTER */}

                <p
                    className="mt-5 text-center text-xs"
                    style={{ color: "var(--muted)" }}
                >
                    By continuing, you're joining the CodeHub community.
                </p>
            </div>
        </div>
    );
};

export default Login;
