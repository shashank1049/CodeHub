
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProject } from "../services/project.service";

const CreateProject = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        techStack: "",
        githubUrl: "",
        liveUrl: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (!formData.title.trim()) {
            setError("Project title is required");
            return;
        }

        if (!formData.description.trim()) {
            setError("Project description is required");
            return;
        }

        if (!formData.techStack.trim()) {
            setError("Add at least one technology");
            return;
        }

        try {
            setLoading(true);

            const projectData = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                techStack: formData.techStack
                    .split(",")
                    .map((tech) => tech.trim())
                    .filter(Boolean),
                githubUrl: formData.githubUrl.trim(),
                liveUrl: formData.liveUrl.trim(),
            };

            const response = await createProject(projectData);

            const project =
                response?.data?.project ||
                response?.data;

            if (project?._id) {
                navigate(`/projects/${project._id}`);
            } else {
                navigate("/explore");
            }
        } catch (error) {
            setError(
                error?.response?.data?.message ||
                "Failed to create project"
            );
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        backgroundColor: "var(--input)",
        borderColor: "var(--border)",
        color: "var(--foreground)",
    };

    const labelStyle = {
        color: "var(--foreground)",
    };

    return (
        <div
            className="min-h-screen px-4 py-8 sm:px-6 sm:py-12"
            style={{
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
            }}
        >
            <div className="mx-auto max-w-3xl">

                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="mb-5 inline-flex items-center gap-2
                        text-sm transition-opacity hover:opacity-70"
                        style={{ color: "var(--muted)" }}
                    >
                        <span aria-hidden="true">←</span>
                        Back
                    </button>

                    <div
                        className="mb-4 flex h-14 w-14 items-center
                        justify-center rounded-2xl text-2xl"
                        style={{
                            backgroundColor: "var(--surface)",
                            border: "1px solid var(--border)",
                        }}
                    >
                        🚀
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight
                    sm:text-3xl md:text-4xl">
                        Create a Project
                    </h1>

                    <p
                        className="mt-2 text-sm sm:text-base"
                        style={{ color: "var(--muted)" }}
                    >
                        Showcase your work and share it with
                        the CodeHub community.
                    </p>
                </div>

                {/* Form Card */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 rounded-2xl border
                    p-4 shadow-sm sm:space-y-6 sm:p-7 md:p-8"
                    style={{
                        backgroundColor: "var(--surface)",
                        borderColor: "var(--border)",
                    }}
                >
                    {/* Project Title */}
                    <div>
                        <label
                            htmlFor="title"
                            className="mb-2 block text-sm font-semibold"
                            style={labelStyle}
                        >
                            Project Title
                            <span className="ml-1 text-red-500">*</span>
                        </label>

                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. CodeHub"
                            maxLength={100}
                            required
                            className="w-full rounded-xl border px-4 py-3
                            text-sm outline-none transition
                            focus:border-blue-500 focus:ring-2
                            focus:ring-blue-500/20"
                            style={inputStyle}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label
                            htmlFor="description"
                            className="mb-2 block text-sm font-semibold"
                            style={labelStyle}
                        >
                            Project Description
                            <span className="ml-1 text-red-500">*</span>
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={5}
                            maxLength={3000}
                            required
                            placeholder="What does your project do?
What problem does it solve?"
                            className="w-full resize-y rounded-xl border
                            px-4 py-3 text-sm outline-none transition
                            focus:border-blue-500 focus:ring-2
                            focus:ring-blue-500/20"
                            style={inputStyle}
                        />

                        <p
                            className="mt-1 text-right text-xs"
                            style={{ color: "var(--muted)" }}
                        >
                            {formData.description.length}/3000
                        </p>
                    </div>

                    {/* Tech Stack */}
                    <div>
                        <label
                            htmlFor="techStack"
                            className="mb-2 block text-sm font-semibold"
                            style={labelStyle}
                        >
                            Tech Stack
                            <span className="ml-1 text-red-500">*</span>
                        </label>

                        <input
                            id="techStack"
                            name="techStack"
                            type="text"
                            value={formData.techStack}
                            onChange={handleChange}
                            placeholder="React, Node.js, MongoDB"
                            required
                            className="w-full rounded-xl border px-4 py-3
                            text-sm outline-none transition
                            focus:border-blue-500 focus:ring-2
                            focus:ring-blue-500/20"
                            style={inputStyle}
                        />

                        <p
                            className="mt-2 text-xs"
                            style={{ color: "var(--muted)" }}
                        >
                            Separate technologies with commas.
                        </p>
                    </div>

                    {/* Links Section */}
                    <div
                        className="space-y-5 rounded-xl border p-4 sm:p-5"
                        style={{ borderColor: "var(--border)" }}
                    >
                        <div>
                            <h2 className="text-sm font-semibold sm:text-base">
                                Project Links
                            </h2>

                            <p
                                className="mt-1 text-xs"
                                style={{ color: "var(--muted)" }}
                            >
                                Add your repository and live demo.
                                These fields are optional.
                            </p>
                        </div>

                        {/* GitHub URL */}
                        <div>
                            <label
                                htmlFor="githubUrl"
                                className="mb-2 block text-sm font-medium"
                                style={labelStyle}
                            >
                                GitHub Repository
                            </label>

                            <input
                                id="githubUrl"
                                name="githubUrl"
                                type="url"
                                value={formData.githubUrl}
                                onChange={handleChange}
                                placeholder="https://github.com/username/project"
                                className="w-full rounded-xl border px-4 py-3
                                text-sm outline-none transition
                                focus:border-blue-500 focus:ring-2
                                focus:ring-blue-500/20"
                                style={inputStyle}
                            />
                        </div>

                        {/* Live URL */}
                        <div>
                            <label
                                htmlFor="liveUrl"
                                className="mb-2 block text-sm font-medium"
                                style={labelStyle}
                            >
                                Live Demo URL
                            </label>

                            <input
                                id="liveUrl"
                                name="liveUrl"
                                type="url"
                                value={formData.liveUrl}
                                onChange={handleChange}
                                placeholder="https://your-project.vercel.app"
                                className="w-full rounded-xl border px-4 py-3
                                text-sm outline-none transition
                                focus:border-blue-500 focus:ring-2
                                focus:ring-blue-500/20"
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div
                            role="alert"
                            className="rounded-xl border px-4 py-3
                            text-sm"
                            style={{
                                color: "var(--danger)",
                                borderColor: "var(--danger)",
                                backgroundColor: "var(--surface)",
                            }}
                        >
                            {error}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col-reverse gap-3
                    border-t pt-5 sm:flex-row sm:justify-end"
                    style={{ borderColor: "var(--border)" }}>

                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            disabled={loading}
                            className="w-full rounded-xl border px-5 py-3
                            text-sm font-medium transition
                            hover:opacity-80 disabled:opacity-50
                            sm:w-auto"
                            style={{
                                borderColor: "var(--border)",
                                color: "var(--foreground)",
                            }}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl px-6 py-3
                            text-sm font-semibold transition
                            hover:opacity-90 disabled:cursor-not-allowed
                            disabled:opacity-60 sm:w-auto"
                            style={{
                                backgroundColor: "var(--primary)",
                                color: "var(--primary-foreground)",
                            }}
                        >
                            {loading
                                ? "Creating Project..."
                                : "🚀 Create Project"}
                        </button>
                    </div>
                </form>

                <p
                    className="mt-4 text-center text-xs"
                    style={{ color: "var(--muted)" }}
                >
                    Fields marked with * are required.
                </p>
            </div>
        </div>
    );
};

export default CreateProject;