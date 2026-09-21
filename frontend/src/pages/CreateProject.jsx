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

            const response =
                await createProject(projectData);

            const project =
                response?.data?.project ||
                response?.data;

            if (project?._id) {
                navigate(
                    `/projects/${project._id}`
                );
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

    return (
        <div
            className="min-h-screen px-6 py-12"
            style={{
                backgroundColor:
                    "var(--background)",
                color: "var(--foreground)",
            }}
        >
            <div className="mx-auto max-w-3xl">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold">
                        Create Project
                    </h1>

                    <p
                        className="mt-2"
                        style={{
                            color: "var(--muted)",
                        }}
                    >
                        Showcase your project to the
                        CodeHub community.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 rounded-2xl border p-8"
                    style={{
                        backgroundColor:
                            "var(--surface)",
                        borderColor:
                            "var(--border)",
                    }}
                >
                    {/* Title */}
                    <div>
                        <label
                            className="mb-2 block text-sm font-medium"
                            htmlFor="title"
                        >
                            Project Title
                        </label>

                        <input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. CodeHub"
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

                    {/* Description */}
                    <div>
                        <label
                            className="mb-2 block text-sm font-medium"
                            htmlFor="description"
                        >
                            Description
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            value={
                                formData.description
                            }
                            onChange={handleChange}
                            rows={5}
                            placeholder="Describe your project..."
                            className="w-full resize-none rounded-lg border px-4 py-3 outline-none"
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

                    {/* Tech Stack */}
                    <div>
                        <label
                            className="mb-2 block text-sm font-medium"
                            htmlFor="techStack"
                        >
                            Tech Stack
                        </label>

                        <input
                            id="techStack"
                            name="techStack"
                            value={
                                formData.techStack
                            }
                            onChange={handleChange}
                            placeholder="React, Node.js, MongoDB"
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

                        <p
                            className="mt-1 text-xs"
                            style={{
                                color:
                                    "var(--muted)",
                            }}
                        >
                            Separate technologies with
                            commas.
                        </p>
                    </div>

                    {/* GitHub */}
                    <div>
                        <label
                            className="mb-2 block text-sm font-medium"
                            htmlFor="githubUrl"
                        >
                            GitHub URL
                        </label>

                        <input
                            id="githubUrl"
                            name="githubUrl"
                            type="url"
                            value={
                                formData.githubUrl
                            }
                            onChange={handleChange}
                            placeholder="https://github.com/username/project"
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

                    {/* Live URL */}
                    <div>
                        <label
                            className="mb-2 block text-sm font-medium"
                            htmlFor="liveUrl"
                        >
                            Live Demo URL
                        </label>

                        <input
                            id="liveUrl"
                            name="liveUrl"
                            type="url"
                            value={
                                formData.liveUrl
                            }
                            onChange={handleChange}
                            placeholder="https://your-project.vercel.app"
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

                    {/* Error */}
                    {error && (
                        <div
                            className="rounded-lg border px-4 py-3 text-sm"
                            style={{
                                color:
                                    "var(--danger)",
                                borderColor:
                                    "var(--danger)",
                            }}
                        >
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg px-6 py-3 font-medium disabled:cursor-not-allowed disabled:opacity-50"
                        style={{
                            backgroundColor:
                                "var(--primary)",
                            color:
                                "var(--primary-foreground)",
                        }}
                    >
                        {loading
                            ? "Creating..."
                            : "Create Project"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateProject;