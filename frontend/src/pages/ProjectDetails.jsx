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
    const [commentsLoading, setCommentsLoading] = useState(true);

    const [commentText, setCommentText] = useState("");
    const [commentSubmitting, setCommentSubmitting] = useState(false);

    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editText, setEditText] = useState("");

    const [commentError, setCommentError] = useState("");

    // ==============================
    // FETCH PROJECT
    // ==============================

    useEffect(() => {
        const fetchProject = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getProjectById(projectId);

                const projectData =
                    response?.data?.project ||
                    response?.data;

                setProject(projectData);
            } catch (error) {
                console.error("Failed to fetch project:", error);

                setError(
                    error?.response?.data?.message ||
                    "Failed to load project"
                );
            } finally {
                setLoading(false);
            }
        };

        if (projectId) {
            fetchProject();
        }
    }, [projectId]);

    // ==============================
    // FETCH COMMENTS
    // ==============================

    const fetchComments = async () => {
        try {
            setCommentsLoading(true);
            setCommentError("");

            const response = await getProjectComments(projectId);

            const commentsData = response?.data || [];

            setComments(
                Array.isArray(commentsData) ? commentsData : []
            );
        } catch (error) {
            console.error("Failed to fetch comments:", error);

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

        if (!content) return;

        try {
            setCommentSubmitting(true);
            setCommentError("");

            await createComment(projectId, content);

            setCommentText("");

            await fetchComments();
        } catch (error) {
            console.error("Failed to create comment:", error);

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

    const handleEditComment = async (commentId) => {
        const content = editText.trim();

        if (!content) return;

        try {
            setCommentSubmitting(true);
            setCommentError("");

            await updateComment(commentId, content);

            setEditingCommentId(null);
            setEditText("");

            await fetchComments();
        } catch (error) {
            console.error("Failed to update comment:", error);

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

    const handleDeleteComment = async (commentId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this comment?"
        );

        if (!confirmed) return;

        try {
            setCommentError("");

            await deleteComment(commentId);

            setComments((currentComments) =>
                currentComments.filter(
                    (comment) => comment._id !== commentId
                )
            );
        } catch (error) {
            console.error("Failed to delete comment:", error);

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
                className="flex min-h-screen items-center justify-center px-4"
                style={{
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                }}
            >
                <div className="text-center">
                    <div
                        className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-t-transparent"
                        style={{
                            borderColor: "var(--primary)",
                            borderTopColor: "transparent",
                        }}
                    />

                    <p style={{ color: "var(--muted)" }}>
                        Loading project...
                    </p>
                </div>
            </div>
        );
    }

    // ==============================
    // PROJECT ERROR
    // ==============================

    if (error) {
        return (
            <div
                className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center sm:px-6"
                style={{
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                }}
            >
                <div
                    className="w-full max-w-md rounded-2xl border p-6 sm:p-8"
                    style={{
                        backgroundColor: "var(--surface)",
                        borderColor: "var(--border)",
                    }}
                >
                    <h1 className="text-xl font-bold sm:text-2xl">
                        Something went wrong
                    </h1>

                    <p
                        className="mt-3 break-words text-sm sm:text-base"
                        style={{ color: "var(--muted)" }}
                    >
                        {error}
                    </p>

                    <Link
                        to="/explore"
                        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-80"
                        style={{
                            backgroundColor: "var(--primary)",
                            color: "var(--primary-foreground)",
                        }}
                    >
                        Back to Explore
                    </Link>
                </div>
            </div>
        );
    }

    // ==============================
    // PROJECT NOT FOUND
    // ==============================

    if (!project) {
        return (
            <div
                className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center"
                style={{
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                }}
            >
                <h2 className="text-xl font-bold">
                    Project not found
                </h2>

                <p
                    className="mt-2 text-sm"
                    style={{ color: "var(--muted)" }}
                >
                    This project may have been removed or does not exist.
                </p>

                <Link
                    to="/explore"
                    className="mt-5 rounded-xl px-5 py-3 text-sm font-semibold"
                    style={{
                        backgroundColor: "var(--primary)",
                        color: "var(--primary-foreground)",
                    }}
                >
                    Back to Explore
                </Link>
            </div>
        );
    }

    // ==============================
    // PROJECT DATA
    // ==============================

    const projectLikes =
        project.likesCount ?? project.likes?.length ?? 0;

    // ==============================
    // MAIN UI
    // ==============================

    return (
        <div
            className="min-h-screen px-4 py-6 sm:px-6 sm:py-10 lg:py-12"
            style={{
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
            }}
        >
            <div className="mx-auto w-full max-w-5xl">

                {/* ==============================
                    BACK TO EXPLORE
                ============================== */}

                <Link
                    to="/explore"
                    className="mb-5 inline-flex min-h-10 items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70 sm:mb-8"
                    style={{ color: "var(--muted)" }}
                >
                    <span aria-hidden="true">←</span>
                    Back to Explore
                </Link>

                {/* ==============================
                    PROJECT THUMBNAIL
                ============================== */}

                {project.thumbnail?.url && (
                    <div
                        className="mb-5 overflow-hidden rounded-2xl border sm:mb-8 sm:rounded-3xl"
                        style={{ borderColor: "var(--border)" }}
                    >
                        <img
                            src={project.thumbnail.url}
                            alt={project.title}
                            className="aspect-video max-h-[480px] w-full object-cover"
                        />
                    </div>
                )}

                {/* ==============================
                    PROJECT CARD
                ============================== */}

                <div
                    className="min-w-0 rounded-2xl border p-4 sm:rounded-3xl sm:p-7 md:p-9"
                    style={{
                        backgroundColor: "var(--surface)",
                        borderColor: "var(--border)",
                    }}
                >
                    {/* TITLE */}

                    <h1 className="break-words text-2xl font-bold leading-tight sm:text-3xl md:text-4xl lg:text-5xl">
                        {project.title}
                    </h1>

                    {/* DESCRIPTION */}

                    <p
                        className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 sm:mt-6 sm:text-base sm:leading-8 md:text-lg"
                        style={{ color: "var(--muted)" }}
                    >
                        {project.description}
                    </p>

                    {/* ==============================
                        TECH STACK
                    ============================== */}

                    {project.techStack?.length > 0 && (
                        <div className="mt-6 sm:mt-8">
                            <h2 className="text-base font-semibold sm:text-lg">
                                Tech Stack
                            </h2>

                            <div className="mt-3 flex flex-wrap gap-2">
                                {project.techStack.map((tech, index) => (
                                    <span
                                        key={`${tech}-${index}`}
                                        className="max-w-full break-words rounded-full border px-3 py-1.5 text-xs sm:text-sm"
                                        style={{
                                            backgroundColor: "var(--background)",
                                            borderColor: "var(--border)",
                                            color: "var(--foreground)",
                                        }}
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ==============================
                        OWNER
                    ============================== */}

                    {project.owner && (
                        <div
                            className="mt-6 border-t pt-5 sm:mt-8 sm:pt-6"
                            style={{ borderColor: "var(--border)" }}
                        >
                            <p
                                className="text-xs sm:text-sm"
                                style={{ color: "var(--muted)" }}
                            >
                                Created by
                            </p>

                            <Link
                                to={`/profile/${project.owner.username}`}
                                className="mt-1 inline-block max-w-full break-words text-base font-semibold hover:opacity-70 sm:text-lg"
                            >
                                {project.owner.fullName ||
                                    project.owner.username}
                            </Link>

                            {project.owner.username && (
                                <p
                                    className="mt-0.5 break-words text-xs sm:text-sm"
                                    style={{ color: "var(--muted)" }}
                                >
                                    @{project.owner.username}
                                </p>
                            )}
                        </div>
                    )}

                    {/* ==============================
                        PROJECT STATS
                    ============================== */}

                    <div
                        className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4 border-t pt-5 sm:mt-8 sm:pt-6"
                        style={{ borderColor: "var(--border)" }}
                    >
                        {/* LIKES */}

                        <div className="min-w-[60px]">
                            <p className="text-xl font-bold sm:text-2xl">
                                {projectLikes}
                            </p>

                            <p
                                className="mt-0.5 text-xs sm:text-sm"
                                style={{ color: "var(--muted)" }}
                            >
                                Likes
                            </p>
                        </div>

                        {/* COMMENTS */}

                        <div className="min-w-[60px]">
                            <p className="text-xl font-bold sm:text-2xl">
                                {comments.length}
                            </p>

                            <p
                                className="mt-0.5 text-xs sm:text-sm"
                                style={{ color: "var(--muted)" }}
                            >
                                Comments
                            </p>
                        </div>
                    </div>

                    {/* ==============================
                        PROJECT LINKS
                    ============================== */}

                    {(project.githubUrl || project.liveUrl) && (
                        <div className="mt-6 flex flex-col gap-3 min-[420px]:flex-row sm:mt-8">
                            {project.githubUrl && (
                                <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-80 sm:text-base"
                                    style={{
                                        backgroundColor: "var(--primary)",
                                        color: "var(--primary-foreground)",
                                    }}
                                >
                                    <span>GitHub</span>
                                    <span aria-hidden="true">↗</span>
                                </a>
                            )}

                            {project.liveUrl && (
                                <a
                                    href={project.liveUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-80 sm:text-base"
                                    style={{
                                        borderColor: "var(--border)",
                                        backgroundColor: "var(--background)",
                                        color: "var(--foreground)",
                                    }}
                                >
                                    <span>Live Demo</span>
                                    <span aria-hidden="true">↗</span>
                                </a>
                            )}
                        </div>
                    )}
                </div>

                {/* =================================================
                    COMMENTS SECTION
                ================================================= */}

                <section
                    className="mt-8 border-t pt-7 sm:mt-10 sm:pt-9"
                    style={{ borderColor: "var(--border)" }}
                >
                    {/* COMMENTS HEADER */}

                    <div className="mb-5 sm:mb-6">
                        <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">
                            Comments
                        </h2>

                        <p
                            className="mt-1 text-xs sm:text-sm"
                            style={{ color: "var(--muted)" }}
                        >
                            {comments.length}{" "}
                            {comments.length === 1 ? "comment" : "comments"}
                        </p>
                    </div>

                    {/* ==============================
                        COMMENT INPUT
                    ============================== */}

                    {user ? (
                        <form
                            onSubmit={handleAddComment}
                            className="mb-7 sm:mb-9"
                        >
                            <textarea
                                value={commentText}
                                onChange={(event) =>
                                    setCommentText(event.target.value)
                                }
                                placeholder="Share your thoughts..."
                                rows={4}
                                maxLength={1000}
                                className="w-full resize-y rounded-xl border p-3 text-sm outline-none transition focus:ring-2 sm:p-4 sm:text-base"
                                style={{
                                    backgroundColor: "var(--input)",
                                    color: "var(--foreground)",
                                    borderColor: "var(--border)",
                                }}
                            />

                            <div className="mt-3 flex flex-col gap-3 min-[380px]:flex-row min-[380px]:items-center min-[380px]:justify-between">
                                <span
                                    className="text-xs"
                                    style={{ color: "var(--muted)" }}
                                >
                                    {commentText.length}/1000
                                </span>

                                <button
                                    type="submit"
                                    disabled={
                                        commentSubmitting ||
                                        !commentText.trim()
                                    }
                                    className="inline-flex min-h-11 w-full items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50 min-[380px]:w-auto"
                                    style={{
                                        backgroundColor: "var(--primary)",
                                        color: "var(--primary-foreground)",
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
                            className="mb-7 rounded-2xl border p-5 text-center sm:mb-9 sm:p-7"
                            style={{
                                borderColor: "var(--border)",
                                backgroundColor: "var(--surface)",
                            }}
                        >
                            <p
                                className="text-sm sm:text-base"
                                style={{ color: "var(--muted)" }}
                            >
                                Login to join the discussion.
                            </p>

                            <Link
                                to="/login"
                                className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold"
                                style={{
                                    backgroundColor: "var(--primary)",
                                    color: "var(--primary-foreground)",
                                }}
                            >
                                Login
                            </Link>
                        </div>
                    )}

                    {/* COMMENT ERROR */}

                    {commentError && (
                        <div
                            role="alert"
                            className="mb-5 break-words rounded-xl border p-3 text-sm"
                            style={{
                                color: "var(--danger)",
                                borderColor: "var(--danger)",
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
                            className="py-10 text-center text-sm sm:text-base"
                            style={{ color: "var(--muted)" }}
                        >
                            Loading comments...
                        </div>
                    ) : comments.length === 0 ? (
                        /* EMPTY COMMENTS */

                        <div
                            className="rounded-2xl border p-6 text-center sm:p-8"
                            style={{
                                borderColor: "var(--border)",
                                backgroundColor: "var(--surface)",
                            }}
                        >
                            <p
                                className="text-sm leading-6 sm:text-base"
                                style={{ color: "var(--muted)" }}
                            >
                                No comments yet. Be the first to start
                                the conversation.
                            </p>
                        </div>
                    ) : (
                        /* COMMENTS LIST */

                        <div className="space-y-4 sm:space-y-5">
                            {comments.map((comment) => {
                                const isOwner =
                                    user?._id === comment.owner?._id;

                                const isEditing =
                                    editingCommentId === comment._id;

                                const ownerName =
                                    comment.owner?.fullName ||
                                    comment.owner?.username ||
                                    "User";

                                return (
                                    <article
                                        key={comment._id}
                                        className="min-w-0 rounded-2xl border p-3.5 sm:p-5"
                                        style={{
                                            borderColor: "var(--border)",
                                            backgroundColor: "var(--surface)",
                                        }}
                                    >
                                        {/* COMMENT HEADER */}

                                        <div className="flex min-w-0 items-start justify-between gap-3">
                                            {/* USER INFO */}

                                            <div className="flex min-w-0 items-center gap-3">
                                                {comment.owner?.avatar?.url ? (
                                                    <img
                                                        src={comment.owner.avatar.url}
                                                        alt={ownerName}
                                                        className="h-9 w-9 shrink-0 rounded-full object-cover sm:h-11 sm:w-11"
                                                    />
                                                ) : (
                                                    <div
                                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold sm:h-11 sm:w-11"
                                                        style={{
                                                            backgroundColor:
                                                                "var(--secondary)",
                                                            color:
                                                                "var(--secondary-foreground)",
                                                        }}
                                                    >
                                                        {ownerName
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>
                                                )}

                                                <div className="min-w-0">
                                                    <p className="break-words text-sm font-semibold sm:text-base">
                                                        {ownerName}
                                                    </p>

                                                    <p
                                                        className="truncate text-xs"
                                                        style={{
                                                            color: "var(--muted)",
                                                        }}
                                                    >
                                                        @{comment.owner?.username || "user"}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* COMMENT ACTIONS */}

                                            {isOwner && (
                                                <div className="flex shrink-0 flex-wrap items-center justify-end gap-x-3 gap-y-2">
                                                    {!isEditing && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                startEditing(comment)
                                                            }
                                                            className="min-h-8 text-xs font-medium hover:opacity-70 sm:text-sm"
                                                            style={{
                                                                color: "var(--muted)",
                                                            }}
                                                        >
                                                            Edit
                                                        </button>
                                                    )}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDeleteComment(comment._id)
                                                        }
                                                        className="min-h-8 text-xs font-medium hover:opacity-70 sm:text-sm"
                                                        style={{
                                                            color: "var(--danger)",
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
                                                    value={editText}
                                                    onChange={(event) =>
                                                        setEditText(event.target.value)
                                                    }
                                                    rows={3}
                                                    maxLength={1000}
                                                    className="w-full resize-y rounded-xl border p-3 text-sm outline-none focus:ring-2 sm:text-base"
                                                    style={{
                                                        backgroundColor: "var(--input)",
                                                        color: "var(--foreground)",
                                                        borderColor: "var(--border)",
                                                    }}
                                                />

                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleEditComment(comment._id)
                                                        }
                                                        disabled={
                                                            commentSubmitting ||
                                                            !editText.trim()
                                                        }
                                                        className="inline-flex min-h-10 items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                                                        style={{
                                                            backgroundColor: "var(--primary)",
                                                            color: "var(--primary-foreground)",
                                                        }}
                                                    >
                                                        {commentSubmitting
                                                            ? "Saving..."
                                                            : "Save"}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={cancelEditing}
                                                        className="inline-flex min-h-10 items-center justify-center rounded-lg border px-4 py-2 text-sm font-medium hover:opacity-80"
                                                        style={{
                                                            borderColor: "var(--border)",
                                                            color: "var(--foreground)",
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            /* COMMENT CONTENT */

                                            <p
                                                className="mt-3 break-words whitespace-pre-wrap text-sm leading-6 sm:mt-4 sm:text-base sm:leading-7"
                                                style={{
                                                    color: "var(--foreground)",
                                                    overflowWrap: "anywhere",
                                                }}
                                            >
                                                {comment.content}
                                            </p>
                                        )}
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default ProjectDetails;