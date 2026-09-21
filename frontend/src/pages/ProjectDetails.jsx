import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getProjectById } from "../services/project.service";

import {
    getProjectComments,
    createComment,
    updateComment,
    deleteComment,
} from "../services/comment.service";

import { useAuth } from "../context/AuthContext";

const ProjectDetails = () => {
    const { projectId } = useParams();
    const { user } = useAuth();

    // ==============================
    // PROJECT STATE
    // ==============================

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ==============================
    // COMMENT STATE
    // ==============================

    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] =
        useState(true);

    const [commentText, setCommentText] =
        useState("");

    const [commentSubmitting, setCommentSubmitting] =
        useState(false);

    const [editingCommentId, setEditingCommentId] =
        useState(null);

    const [editText, setEditText] = useState("");

    const [commentError, setCommentError] =
        useState("");

    // ==============================
    // FETCH PROJECT
    // ==============================

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await getProjectById(projectId);

                console.log(
                    "PROJECT RESPONSE:",
                    response
                );

                const projectData =
                    response?.data?.project ||
                    response?.data;

                setProject(projectData);
            } catch (error) {
                console.error(
                    "Failed to fetch project:",
                    error
                );

                setError(
                    error?.response?.data?.message ||
                        "Failed to load project"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectId]);

    // ==============================
    // FETCH COMMENTS
    // ==============================

    const fetchComments = async () => {
        try {
            setCommentsLoading(true);
            setCommentError("");

            const response =
                await getProjectComments(projectId);

            console.log(
                "COMMENTS RESPONSE:",
                response
            );

            /*
             * Backend ApiResponse normally returns:
             *
             * {
             *     statusCode,
             *     data,
             *     message,
             *     success
             * }
             *
             * So comments should normally be
             * available inside response.data.
             */

            const commentsData =
                response?.data || [];

            setComments(
                Array.isArray(commentsData)
                    ? commentsData
                    : []
            );
        } catch (error) {
            console.error(
                "Failed to fetch comments:",
                error
            );

            setCommentError(
                error?.response?.data?.message ||
                    "Failed to load comments"
            );
        } finally {
            setCommentsLoading(false);
        }
    };

    useEffect(() => {
        if (projectId) {
            fetchComments();
        }
    }, [projectId]);

    // ==============================
    // ADD COMMENT
    // ==============================

    const handleAddComment = async (event) => {
        event.preventDefault();

        const content = commentText.trim();

        if (!content) {
            return;
        }

        try {
            setCommentSubmitting(true);
            setCommentError("");

            await createComment(
                projectId,
                content
            );

            setCommentText("");

            await fetchComments();
        } catch (error) {
            console.error(
                "Failed to create comment:",
                error
            );

            setCommentError(
                error?.response?.data?.message ||
                    "Failed to add comment"
            );
        } finally {
            setCommentSubmitting(false);
        }
    };

    // ==============================
    // START EDITING
    // ==============================

    const startEditing = (comment) => {
        setEditingCommentId(comment._id);
        setEditText(comment.content);
        setCommentError("");
    };

    // ==============================
    // CANCEL EDIT
    // ==============================

    const cancelEditing = () => {
        setEditingCommentId(null);
        setEditText("");
        setCommentError("");
    };

    // ==============================
    // UPDATE COMMENT
    // ==============================

    const handleEditComment = async (
        commentId
    ) => {
        const content = editText.trim();

        if (!content) {
            return;
        }

        try {
            setCommentSubmitting(true);
            setCommentError("");

            await updateComment(
                commentId,
                content
            );

            setEditingCommentId(null);
            setEditText("");

            await fetchComments();
        } catch (error) {
            console.error(
                "Failed to update comment:",
                error
            );

            setCommentError(
                error?.response?.data?.message ||
                    "Failed to update comment"
            );
        } finally {
            setCommentSubmitting(false);
        }
    };

    // ==============================
    // DELETE COMMENT
    // ==============================

    const handleDeleteComment = async (
        commentId
    ) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this comment?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setCommentError("");

            await deleteComment(commentId);

            setComments((currentComments) =>
                currentComments.filter(
                    (comment) =>
                        comment._id !== commentId
                )
            );
        } catch (error) {
            console.error(
                "Failed to delete comment:",
                error
            );

            setCommentError(
                error?.response?.data?.message ||
                    "Failed to delete comment"
            );
        }
    };

    // ==============================
    // LOADING PROJECT
    // ==============================

    if (loading) {
        return (
            <div
                className="flex min-h-screen items-center justify-center"
                style={{
                    backgroundColor:
                        "var(--background)",
                    color: "var(--foreground)",
                }}
            >
                <p
                    style={{
                        color: "var(--muted)",
                    }}
                >
                    Loading project...
                </p>
            </div>
        );
    }

    // ==============================
    // PROJECT ERROR
    // ==============================

    if (error) {
        return (
            <div
                className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
                style={{
                    backgroundColor:
                        "var(--background)",
                    color: "var(--foreground)",
                }}
            >
                <h1 className="text-2xl font-bold">
                    Something went wrong
                </h1>

                <p
                    className="mt-3"
                    style={{
                        color: "var(--muted)",
                    }}
                >
                    {error}
                </p>

                <Link
                    to="/explore"
                    className="mt-6 rounded-lg px-5 py-3 font-medium"
                    style={{
                        backgroundColor:
                            "var(--primary)",
                        color:
                            "var(--primary-foreground)",
                    }}
                >
                    Back to Explore
                </Link>
            </div>
        );
    }

    // ==============================
    // PROJECT NOT FOUND
    // ==============================

    if (!project) {
        return (
            <div
                className="flex min-h-screen items-center justify-center"
                style={{
                    backgroundColor:
                        "var(--background)",
                    color: "var(--foreground)",
                }}
            >
                <p>Project not found.</p>
            </div>
        );
    }

    // ==============================
    // MAIN UI
    // ==============================

    return (
        <div
            className="min-h-screen px-4 py-10 sm:px-6 sm:py-12"
            style={{
                backgroundColor:
                    "var(--background)",
                color: "var(--foreground)",
            }}
        >
            <div className="mx-auto max-w-5xl">

                {/* ==============================
                    BACK TO EXPLORE
                ============================== */}

                <Link
                    to="/explore"
                    className="mb-8 inline-flex items-center text-sm font-medium hover:opacity-80"
                    style={{
                        color: "var(--muted)",
                    }}
                >
                    ← Back to Explore
                </Link>

                {/* ==============================
                    PROJECT THUMBNAIL
                ============================== */}

                {project.thumbnail?.url && (
                    <div className="mb-8 overflow-hidden rounded-2xl border">
                        <img
                            src={
                                project.thumbnail.url
                            }
                            alt={project.title}
                            className="h-[250px] w-full object-cover sm:h-[350px]"
                        />
                    </div>
                )}

                {/* ==============================
                    PROJECT CARD
                ============================== */}

                <div
                    className="rounded-2xl border p-5 sm:p-8"
                    style={{
                        backgroundColor:
                            "var(--surface)",
                        borderColor:
                            "var(--border)",
                    }}
                >
                    {/* TITLE */}

                    <h1 className="text-3xl font-bold sm:text-4xl">
                        {project.title}
                    </h1>

                    {/* DESCRIPTION */}

                    <p
                        className="mt-5 text-base leading-8 sm:text-lg"
                        style={{
                            color: "var(--muted)",
                        }}
                    >
                        {project.description}
                    </p>

                    {/* ==============================
                        TECH STACK
                    ============================== */}

                    {project.techStack?.length >
                        0 && (
                        <div className="mt-8">
                            <h2 className="text-lg font-semibold">
                                Tech Stack
                            </h2>

                            <div className="mt-3 flex flex-wrap gap-2">
                                {project.techStack.map(
                                    (
                                        tech,
                                        index
                                    ) => (
                                        <span
                                            key={`${tech}-${index}`}
                                            className="rounded-full border px-3 py-1 text-sm"
                                            style={{
                                                backgroundColor:
                                                    "var(--background)",
                                                borderColor:
                                                    "var(--border)",
                                                color:
                                                    "var(--foreground)",
                                            }}
                                        >
                                            {tech}
                                        </span>
                                    )
                                )}
                            </div>
                        </div>
                    )}

                    {/* ==============================
                        OWNER
                    ============================== */}

                    {project.owner && (
                        <div
                            className="mt-8 border-t pt-6"
                            style={{
                                borderColor:
                                    "var(--border)",
                            }}
                        >
                            <p
                                className="text-sm"
                                style={{
                                    color:
                                        "var(--muted)",
                                }}
                            >
                                Created by
                            </p>

                            <Link
                                to={`/profile/${project.owner.username}`}
                                className="mt-2 inline-block text-lg font-semibold hover:opacity-80"
                            >
                                {project.owner
                                    .fullName ||
                                    project.owner
                                        .username}
                            </Link>

                            {project.owner
                                .username && (
                                <p
                                    className="text-sm"
                                    style={{
                                        color:
                                            "var(--muted)",
                                    }}
                                >
                                    @
                                    {
                                        project.owner
                                            .username
                                    }
                                </p>
                            )}
                        </div>
                    )}

                    {/* ==============================
                        PROJECT STATS
                    ============================== */}

                    <div className="mt-8 flex flex-wrap gap-8">

                        {/* LIKES */}

                        <div>
                            <p className="text-xl font-bold">
                                {project.likesCount ??
                                    project.likes
                                        ?.length ??
                                    0}
                            </p>

                            <p
                                className="text-sm"
                                style={{
                                    color:
                                        "var(--muted)",
                                }}
                            >
                                Likes
                            </p>
                        </div>

                        {/* COMMENTS */}

                        <div>
                            <p className="text-xl font-bold">
                                {comments.length}
                            </p>

                            <p
                                className="text-sm"
                                style={{
                                    color:
                                        "var(--muted)",
                                }}
                            >
                                Comments
                            </p>
                        </div>
                    </div>

                    {/* ==============================
                        PROJECT LINKS
                    ============================== */}

                    <div className="mt-8 flex flex-wrap gap-4">

                        {project.githubUrl && (
                            <a
                                href={
                                    project.githubUrl
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-lg px-5 py-3 font-medium hover:opacity-90"
                                style={{
                                    backgroundColor:
                                        "var(--primary)",
                                    color:
                                        "var(--primary-foreground)",
                                }}
                            >
                                GitHub
                            </a>
                        )}

                        {project.liveUrl && (
                            <a
                                href={
                                    project.liveUrl
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-lg border px-5 py-3 font-medium hover:opacity-80"
                                style={{
                                    borderColor:
                                        "var(--border)",
                                    backgroundColor:
                                        "var(--background)",
                                }}
                            >
                                Live Demo
                            </a>
                        )}
                    </div>
                </div>

                {/* =================================================
                    COMMENTS SECTION
                ================================================= */}

                <section
                    className="mt-10 border-t pt-8"
                    style={{
                        borderColor:
                            "var(--border)",
                    }}
                >
                    {/* COMMENTS HEADER */}

                    <div className="mb-6">
                        <h2 className="text-2xl font-bold">
                            Comments
                        </h2>

                        <p
                            className="mt-1 text-sm"
                            style={{
                                color:
                                    "var(--muted)",
                            }}
                        >
                            {comments.length}{" "}
                            {comments.length === 1
                                ? "comment"
                                : "comments"}
                        </p>
                    </div>

                    {/* ==============================
                        COMMENT INPUT
                    ============================== */}

                    {user ? (
                        <form
                            onSubmit={
                                handleAddComment
                            }
                            className="mb-8"
                        >
                            <textarea
                                value={
                                    commentText
                                }
                                onChange={(event) =>
                                    setCommentText(
                                        event.target
                                            .value
                                    )
                                }
                                placeholder="Share your thoughts..."
                                rows={4}
                                maxLength={1000}
                                className="w-full resize-none rounded-xl border p-4 outline-none focus:ring-2"
                                style={{
                                    backgroundColor:
                                        "var(--input)",
                                    color:
                                        "var(--foreground)",
                                    borderColor:
                                        "var(--border)",
                                }}
                            />

                            <div className="mt-3 flex items-center justify-between gap-4">
                                <span
                                    className="text-xs"
                                    style={{
                                        color:
                                            "var(--muted)",
                                    }}
                                >
                                    {
                                        commentText.length
                                    }
                                    /1000
                                </span>

                                <button
                                    type="submit"
                                    disabled={
                                        commentSubmitting ||
                                        !commentText.trim()
                                    }
                                    className="rounded-lg px-5 py-2.5 font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                                    style={{
                                        backgroundColor:
                                            "var(--primary)",
                                        color:
                                            "var(--primary-foreground)",
                                    }}
                                >
                                    {commentSubmitting
                                        ? "Posting..."
                                        : "Post Comment"}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div
                            className="mb-8 rounded-xl border p-6 text-center"
                            style={{
                                borderColor:
                                    "var(--border)",
                                backgroundColor:
                                    "var(--surface)",
                            }}
                        >
                            <p
                                className="mb-4"
                                style={{
                                    color:
                                        "var(--muted)",
                                }}
                            >
                                Login to join the
                                discussion.
                            </p>

                            <Link
                                to="/login"
                                className="inline-block rounded-lg px-5 py-2.5 font-medium"
                                style={{
                                    backgroundColor:
                                        "var(--primary)",
                                    color:
                                        "var(--primary-foreground)",
                                }}
                            >
                                Login
                            </Link>
                        </div>
                    )}

                    {/* COMMENT ERROR */}

                    {commentError && (
                        <div
                            className="mb-5 rounded-lg border p-3 text-sm"
                            style={{
                                color:
                                    "var(--danger)",
                                borderColor:
                                    "var(--danger)",
                            }}
                        >
                            {commentError}
                        </div>
                    )}

                    {/* ==============================
                        COMMENTS LOADING
                    ============================== */}

                    {commentsLoading ? (
                        <div
                            className="py-10 text-center"
                            style={{
                                color:
                                    "var(--muted)",
                            }}
                        >
                            Loading comments...
                        </div>
                    ) : comments.length ===
                      0 ? (
                        /* ==============================
                           EMPTY COMMENTS
                        ============================== */

                        <div
                            className="rounded-xl border p-8 text-center"
                            style={{
                                borderColor:
                                    "var(--border)",
                                backgroundColor:
                                    "var(--surface)",
                            }}
                        >
                            <p
                                style={{
                                    color:
                                        "var(--muted)",
                                }}
                            >
                                No comments yet.
                                Be the first to
                                start the
                                conversation.
                            </p>
                        </div>
                    ) : (
                        /* ==============================
                           COMMENTS LIST
                        ============================== */

                        <div className="space-y-5">
                            {comments.map(
                                (comment) => {
                                    const isOwner =
                                        user?._id ===
                                        comment.owner
                                            ?._id;

                                    const isEditing =
                                        editingCommentId ===
                                        comment._id;

                                    return (
                                        <article
                                            key={
                                                comment._id
                                            }
                                            className="rounded-xl border p-5"
                                            style={{
                                                borderColor:
                                                    "var(--border)",
                                                backgroundColor:
                                                    "var(--surface)",
                                            }}
                                        >
                                            {/* COMMENT HEADER */}

                                            <div className="flex items-start justify-between gap-4">

                                                {/* USER INFO */}

                                                <div className="flex min-w-0 items-center gap-3">

                                                    {comment
                                                        .owner
                                                        ?.avatar
                                                        ?.url ? (
                                                        <img
                                                            src={
                                                                comment
                                                                    .owner
                                                                    .avatar
                                                                    .url
                                                            }
                                                            alt={
                                                                comment
                                                                    .owner
                                                                    ?.username ||
                                                                "User"
                                                            }
                                                            className="h-10 w-10 shrink-0 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div
                                                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                                                            style={{
                                                                backgroundColor:
                                                                    "var(--secondary)",
                                                                color:
                                                                    "var(--secondary-foreground)",
                                                            }}
                                                        >
                                                            {(
                                                                comment
                                                                    .owner
                                                                    ?.fullName ||
                                                                comment
                                                                    .owner
                                                                    ?.username ||
                                                                "U"
                                                            )
                                                                .charAt(
                                                                    0
                                                                )
                                                                .toUpperCase()}
                                                        </div>
                                                    )}

                                                    <div className="min-w-0">
                                                        <p className="truncate font-semibold">
                                                            {comment
                                                                .owner
                                                                ?.fullName ||
                                                                comment
                                                                    .owner
                                                                    ?.username ||
                                                                "User"}
                                                        </p>

                                                        <p
                                                            className="truncate text-xs"
                                                            style={{
                                                                color:
                                                                    "var(--muted)",
                                                            }}
                                                        >
                                                            @
                                                            {comment
                                                                .owner
                                                                ?.username ||
                                                                "user"}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* COMMENT ACTIONS */}

                                                {isOwner && (
                                                    <div className="flex shrink-0 gap-3">

                                                        {!isEditing && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    startEditing(
                                                                        comment
                                                                    )
                                                                }
                                                                className="text-sm font-medium hover:opacity-70"
                                                                style={{
                                                                    color:
                                                                        "var(--muted)",
                                                                }}
                                                            >
                                                                Edit
                                                            </button>
                                                        )}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDeleteComment(
                                                                    comment._id
                                                                )
                                                            }
                                                            className="text-sm font-medium hover:opacity-70"
                                                            style={{
                                                                color:
                                                                    "var(--danger)",
                                                            }}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* ==============================
                                                EDIT COMMENT
                                            ============================== */}

                                            {isEditing ? (
                                                <div className="mt-4">

                                                    <textarea
                                                        value={
                                                            editText
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            setEditText(
                                                                event
                                                                    .target
                                                                    .value
                                                            )
                                                        }
                                                        rows={
                                                            3
                                                        }
                                                        maxLength={
                                                            1000
                                                        }
                                                        className="w-full resize-none rounded-lg border p-3 outline-none"
                                                        style={{
                                                            backgroundColor:
                                                                "var(--input)",
                                                            color:
                                                                "var(--foreground)",
                                                            borderColor:
                                                                "var(--border)",
                                                        }}
                                                    />

                                                    <div className="mt-3 flex gap-2">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleEditComment(
                                                                    comment._id
                                                                )
                                                            }
                                                            disabled={
                                                                commentSubmitting ||
                                                                !editText.trim()
                                                            }
                                                            className="rounded-lg px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
                                                            style={{
                                                                backgroundColor:
                                                                    "var(--primary)",
                                                                color:
                                                                    "var(--primary-foreground)",
                                                            }}
                                                        >
                                                            {commentSubmitting
                                                                ? "Saving..."
                                                                : "Save"}
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={
                                                                cancelEditing
                                                            }
                                                            className="rounded-lg border px-4 py-2 text-sm hover:opacity-80"
                                                            style={{
                                                                borderColor:
                                                                    "var(--border)",
                                                            }}
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                /* ==============================
                                                   COMMENT CONTENT
                                                ============================== */

                                                <p
                                                    className="mt-4 whitespace-pre-wrap text-sm leading-6"
                                                    style={{
                                                        color:
                                                            "var(--foreground)",
                                                    }}
                                                >
                                                    {
                                                        comment.content
                                                    }
                                                </p>
                                            )}
                                        </article>
                                    );
                                }
                            )}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default ProjectDetails;