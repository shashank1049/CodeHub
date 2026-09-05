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

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

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
                    "Login failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-6">

            <div className="w-full max-w-md">

                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold">
                        Welcome back
                    </h1>

                    <p
                        className="mt-2"
                        style={{
                            color: "var(--muted)",
                        }}
                    >
                        Sign in to your CodeHub account
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {error && (
                        <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                            className="w-full rounded-lg border px-4 py-3 outline-none"
                            style={{
                                backgroundColor:
                                    "var(--input)",
                                borderColor:
                                    "var(--border)",
                                color:
                                    "var(--foreground)",
                            }}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                            className="w-full rounded-lg border px-4 py-3 outline-none"
                            style={{
                                backgroundColor:
                                    "var(--input)",
                                borderColor:
                                    "var(--border)",
                                color:
                                    "var(--foreground)",
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg px-4 py-3 font-medium disabled:opacity-50"
                        style={{
                            backgroundColor:
                                "var(--primary)",
                            color:
                                "var(--primary-foreground)",
                        }}
                    >
                        {loading
                            ? "Signing in..."
                            : "Sign In"}
                    </button>

                </form>

                <p
                    className="mt-6 text-center text-sm"
                    style={{
                        color: "var(--muted)",
                    }}
                >
                    Don't have an account?{" "}

                    <Link
                        to="/register"
                        className="font-medium underline"
                    >
                        Create one
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default Login;