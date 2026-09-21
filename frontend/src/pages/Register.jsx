
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
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
    // HANDLE REGISTER
    // ==============================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            await register(formData);
            navigate("/login");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
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

                {/* REGISTER CARD */}

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
                            Create your account
                        </h1>

                        <p
                            className="mt-2 text-sm sm:text-base"
                            style={{ color: "var(--muted)" }}
                        >
                            Join the CodeHub developer community
                        </p>
                    </div>

                    {/* ERROR MESSAGE */}

                    {error && (
                        <div
                            role="alert"
                            className="mb-5 break-words rounded-xl border px-4 py-3 text-sm"
                            style={{
                                color: "var(--danger)",
                                borderColor: "var(--danger)",
                                backgroundColor: "var(--background)",
                            }}
                        >
                            {error}
                        </div>
                    )}

                    {/* REGISTER FORM */}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >
                        {/* FULL NAME */}

                        <div>
                            <label
                                htmlFor="fullName"
                                className="mb-2 block text-sm font-semibold"
                            >
                                Full Name
                            </label>

                            <input
                                id="fullName"
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                autoComplete="name"
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

                        {/* USERNAME */}

                        <div>
                            <label
                                htmlFor="username"
                                className="mb-2 block text-sm font-semibold"
                            >
                                Username
                            </label>

                            <input
                                id="username"
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Choose a username"
                                autoComplete="username"
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
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-semibold"
                            >
                                Password
                            </label>

                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a password"
                                    autoComplete="new-password"
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

                            <p
                                className="mt-2 text-xs"
                                style={{ color: "var(--muted)" }}
                            >
                                Use a strong password to keep your account secure.
                            </p>
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
                                    Creating account...
                                </span>
                            ) : (
                                "Create Account"
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
                            ALREADY A MEMBER?
                        </span>

                        <div
                            className="h-px flex-1"
                            style={{ backgroundColor: "var(--border)" }}
                        />
                    </div>

                    {/* LOGIN LINK */}

                    <p
                        className="text-center text-sm"
                        style={{ color: "var(--muted)" }}
                    >
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-semibold underline underline-offset-4 transition-opacity hover:opacity-70"
                            style={{ color: "var(--primary)" }}
                        >
                            Sign in
                        </Link>
                    </p>
                </div>

                {/* FOOTER */}

                <p
                    className="mt-5 text-center text-xs"
                    style={{ color: "var(--muted)" }}
                >
                    Join CodeHub and start sharing your projects.
                </p>
            </div>
        </div>
    );
};

export default Register;