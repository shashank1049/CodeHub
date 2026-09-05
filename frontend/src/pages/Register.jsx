import { useState } from "react";
import {
    Link,
    useNavigate,
} from "react-router-dom";

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
            await register(formData);

            navigate("/login");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Registration failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center px-6 py-12">

            <div className="w-full max-w-md">

                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold">
                        Create your account
                    </h1>

                    <p
                        className="mt-2"
                        style={{
                            color: "var(--muted)",
                        }}
                    >
                        Join the CodeHub developer community
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
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Shashank Mishra"
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
                            Username
                        </label>

                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="shashank1"
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
                            ? "Creating account..."
                            : "Create Account"}
                    </button>

                </form>

                <p
                    className="mt-6 text-center text-sm"
                    style={{
                        color: "var(--muted)",
                    }}
                >
                    Already have an account?{" "}

                    <Link
                        to="/login"
                        className="font-medium underline"
                    >
                        Sign in
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default Register;