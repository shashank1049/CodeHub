import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getProjects } from "../services/project.service";

const Explore = () => {
    const [projects, setProjects] = useState([]);
    const [search, setSearch] = useState("");
    const [techStack, setTechStack] = useState("");
    const [sort, setSort] = useState("latest");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchProjects = async () => {
        try {
            setLoading(true);
            setError("");

            const params = {};

            if (search.trim()) {
                params.search = search.trim();
            }

            if (techStack) {
                params.techStack = techStack;
            }

            if (sort) {
                params.sort = sort;
            }

            const response = await getProjects(params);

            console.log("PROJECTS RESPONSE:", response);

            const projectData =
                response?.data?.projects ||
                response?.data ||
                [];

            setProjects(projectData);
        } catch (error) {
            console.error(
                "Failed to fetch projects:",
                error
            );

            setError(
                error?.response?.data?.message ||
                    "Failed to load projects"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchProjects();
        }, 400);

        return () => clearTimeout(timer);
    }, [search, techStack, sort]);

    return (
        <div
            className="min-h-screen px-6 py-12"
            style={{
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
            }}
        >
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold">
                        Explore Projects
                    </h1>

                    <p
                        className="mt-3"
                        style={{
                            color: "var(--muted)",
                        }}
                    >
                        Discover amazing projects built
                        by developers in the CodeHub
                        community.
                    </p>
                </div>

                {/* Search + Sort */}
                <div className="mb-8 flex flex-col gap-4 md:flex-row">

                    {/* Search */}
                    <div className="flex-1">
                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search projects..."
                            className="w-full rounded-xl border px-4 py-3 outline-none"
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

                    {/* Sort */}
                    <select
                        value={sort}
                        onChange={(event) =>
                            setSort(event.target.value)
                        }
                        className="rounded-xl border px-4 py-3 outline-none"
                        style={{
                            backgroundColor:
                                "var(--input)",
                            borderColor:
                                "var(--border)",
                            color:
                                "var(--foreground)",
                        }}
                    >
                        <option value="latest">
                            Latest
                        </option>

                        <option value="oldest">
                            Oldest
                        </option>

                        <option value="popular">
                            Most Popular
                        </option>
                    </select>
                </div>

                {/* Tech Stack Filter */}
                <div className="mb-10">
                    <p className="mb-3 text-sm font-medium">
                        Filter by technology
                    </p>

                    <div className="flex flex-wrap gap-2">

                        <TechButton
                            value=""
                            current={techStack}
                            setTechStack={setTechStack}
                            label="All"
                        />

                        <TechButton
                            value="React"
                            current={techStack}
                            setTechStack={setTechStack}
                            label="React"
                        />

                        <TechButton
                            value="Node.js"
                            current={techStack}
                            setTechStack={setTechStack}
                            label="Node.js"
                        />

                        <TechButton
                            value="MongoDB"
                            current={techStack}
                            setTechStack={setTechStack}
                            label="MongoDB"
                        />

                        <TechButton
                            value="Java"
                            current={techStack}
                            setTechStack={setTechStack}
                            label="Java"
                        />

                        <TechButton
                            value="Python"
                            current={techStack}
                            setTechStack={setTechStack}
                            label="Python"
                        />
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="py-20 text-center">
                        <p
                            style={{
                                color:
                                    "var(--muted)",
                            }}
                        >
                            Loading projects...
                        </p>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div
                        className="rounded-xl border p-6 text-center"
                        style={{
                            borderColor:
                                "var(--danger)",
                            color:
                                "var(--danger)",
                        }}
                    >
                        {error}

                        <div>
                            <button
                                onClick={fetchProjects}
                                className="mt-4 rounded-lg px-5 py-2"
                                style={{
                                    backgroundColor:
                                        "var(--primary)",
                                    color:
                                        "var(--primary-foreground)",
                                }}
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}

                {/* Empty */}
                {!loading &&
                    !error &&
                    projects.length === 0 && (
                        <div
                            className="rounded-2xl border p-12 text-center"
                            style={{
                                backgroundColor:
                                    "var(--surface)",
                                borderColor:
                                    "var(--border)",
                            }}
                        >
                            <h2 className="text-xl font-semibold">
                                No projects found
                            </h2>

                            <p
                                className="mt-2"
                                style={{
                                    color:
                                        "var(--muted)",
                                }}
                            >
                                Try a different search or
                                technology filter.
                            </p>
                        </div>
                    )}

                {/* Projects */}
                {!loading &&
                    !error &&
                    projects.length > 0 && (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {projects.map(
                                (project) => (
                                    <ProjectCard
                                        key={project._id}
                                        project={project}
                                    />
                                )
                            )}
                        </div>
                    )}
            </div>
        </div>
    );
};

const TechButton = ({
    value,
    current,
    setTechStack,
    label,
}) => {
    const active = current === value;

    return (
        <button
            type="button"
            onClick={() => setTechStack(value)}
            className="rounded-full border px-4 py-2 text-sm font-medium"
            style={{
                backgroundColor: active
                    ? "var(--primary)"
                    : "var(--surface)",
                color: active
                    ? "var(--primary-foreground)"
                    : "var(--foreground)",
                borderColor:
                    "var(--border)",
            }}
        >
            {label}
        </button>
    );
};

const ProjectCard = ({ project }) => {
    return (
        <Link
            to={`/projects/${project._id}`}
            className="group overflow-hidden rounded-2xl border transition-transform hover:-translate-y-1"
            style={{
                backgroundColor:
                    "var(--surface)",
                borderColor:
                    "var(--border)",
            }}
        >
            {/* Thumbnail */}
            {project.thumbnail?.url ? (
                <img
                    src={project.thumbnail.url}
                    alt={project.title}
                    className="h-48 w-full object-cover"
                />
            ) : (
                <div
                    className="flex h-48 items-center justify-center"
                    style={{
                        backgroundColor:
                            "var(--surface-hover)",
                        color:
                            "var(--muted)",
                    }}
                >
                    No Thumbnail
                </div>
            )}

            <div className="p-5">

                <h2 className="text-xl font-semibold">
                    {project.title}
                </h2>

                <p
                    className="mt-2 line-clamp-3 text-sm"
                    style={{
                        color: "var(--muted)",
                    }}
                >
                    {project.description}
                </p>

                {/* Tech Stack */}
                {project.techStack?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {project.techStack
                            .slice(0, 4)
                            .map((tech, index) => (
                                <span
                                    key={`${tech}-${index}`}
                                    className="rounded-full border px-2.5 py-1 text-xs"
                                    style={{
                                        borderColor:
                                            "var(--border)",
                                        color:
                                            "var(--foreground)",
                                    }}
                                >
                                    {tech}
                                </span>
                            ))}
                    </div>
                )}

                {/* Footer */}
                <div className="mt-5 flex items-center justify-between">
                    <span
                        className="text-sm"
                        style={{
                            color:
                                "var(--muted)",
                        }}
                    >
                        ❤️{" "}
                        {project.likes?.length || 0}
                    </span>

                    <span
                        className="text-sm"
                        style={{
                            color:
                                "var(--muted)",
                        }}
                    >
                        View Project →
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default Explore;