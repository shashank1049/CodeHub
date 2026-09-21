
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

            const projectData =
                response?.data?.projects ||
                response?.data ||
                [];

            setProjects(projectData);
        } catch (error) {
            console.error("Failed to fetch projects:", error);

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
            className="min-h-screen px-4 py-8 sm:px-6 sm:py-12"
            style={{
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
            }}
        >
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
                        Explore Projects
                    </h1>

                    <p
                        className="mt-3 max-w-2xl text-sm leading-6 sm:text-base"
                        style={{
                            color: "var(--muted)",
                        }}
                    >
                        Discover amazing projects built by developers
                        in the CodeHub community.
                    </p>
                </div>

                {/* Search + Sort */}
                <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:gap-4 md:flex-row">

                    {/* Search */}
                    <div className="min-w-0 flex-1">
                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search projects..."
                            className="w-full min-w-0 rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-blue-500 sm:text-base"
                            style={{
                                backgroundColor: "var(--input)",
                                borderColor: "var(--border)",
                                color: "var(--foreground)",
                            }}
                        />
                    </div>

                    {/* Sort */}
                    <select
                        value={sort}
                        onChange={(event) =>
                            setSort(event.target.value)
                        }
                        className="w-full rounded-xl border px-4 py-3 text-sm outline-none sm:text-base md:w-52"
                        style={{
                            backgroundColor: "var(--input)",
                            borderColor: "var(--border)",
                            color: "var(--foreground)",
                        }}
                    >
                        <option value="latest">Latest</option>
                        <option value="oldest">Oldest</option>
                        <option value="popular">Most Popular</option>
                    </select>
                </div>

                {/* Tech Stack Filter */}
                <div className="mb-8 sm:mb-10">
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
                    <div className="py-16 text-center sm:py-20">
                        <p style={{ color: "var(--muted)" }}>
                            Loading projects...
                        </p>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div
                        className="rounded-xl border p-5 text-center sm:p-6"
                        style={{
                            borderColor: "var(--danger)",
                            color: "var(--danger)",
                        }}
                    >
                        <p>{error}</p>

                        <button
                            type="button"
                            onClick={fetchProjects}
                            className="mt-4 rounded-lg px-5 py-2"
                            style={{
                                backgroundColor: "var(--primary)",
                                color: "var(--primary-foreground)",
                            }}
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty */}
                {!loading &&
                    !error &&
                    projects.length === 0 && (
                        <div
                            className="rounded-2xl border p-6 text-center sm:p-12"
                            style={{
                                backgroundColor: "var(--surface)",
                                borderColor: "var(--border)",
                            }}
                        >
                            <h2 className="text-lg font-semibold sm:text-xl">
                                No projects found
                            </h2>

                            <p
                                className="mt-2 text-sm sm:text-base"
                                style={{ color: "var(--muted)" }}
                            >
                                Try a different search or technology
                                filter.
                            </p>
                        </div>
                    )}

                {/* Projects Grid */}
                {!loading &&
                    !error &&
                    projects.length > 0 && (
                        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {projects.map((project) => (
                                <ProjectCard
                                    key={project._id}
                                    project={project}
                                />
                            ))}
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
            className="rounded-full border px-3 py-2 text-xs font-medium transition hover:opacity-80 sm:px-4 sm:text-sm"
            style={{
                backgroundColor: active
                    ? "var(--primary)"
                    : "var(--surface)",
                color: active
                    ? "var(--primary-foreground)"
                    : "var(--foreground)",
                borderColor: "var(--border)",
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
            className="group min-w-0 overflow-hidden rounded-2xl border transition-transform hover:-translate-y-1"
            style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
            }}
        >
            {/* Thumbnail */}
            {project.thumbnail?.url ? (
                <img
                    src={project.thumbnail.url}
                    alt={project.title}
                    loading="lazy"
                    className="h-40 w-full object-cover sm:h-48"
                />
            ) : (
                <div
                    className="flex h-40 items-center justify-center sm:h-48"
                    style={{
                        backgroundColor: "var(--surface-hover)",
                        color: "var(--muted)",
                    }}
                >
                    No Thumbnail
                </div>
            )}

            {/* Card Content */}
            <div className="p-4 sm:p-5">

                <h2 className="break-words text-lg font-semibold sm:text-xl">
                    {project.title}
                </h2>

                <p
                    className="mt-2 line-clamp-3 break-words text-sm leading-6"
                    style={{ color: "var(--muted)" }}
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
                                    className="max-w-full break-words rounded-full border px-2.5 py-1 text-xs"
                                    style={{
                                        borderColor: "var(--border)",
                                        color: "var(--foreground)",
                                    }}
                                >
                                    {tech}
                                </span>
                            ))}
                    </div>
                )}

                {/* Footer */}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <span
                        className="text-sm"
                        style={{ color: "var(--muted)" }}
                    >
                        ❤️ {project.likes?.length || 0}
                    </span>

                    <span
                        className="text-sm font-medium"
                        style={{ color: "var(--muted)" }}
                    >
                        View Project →
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default Explore;