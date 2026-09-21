import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import {
    followUser,
    unfollowUser,
    getFollowStats,
    getFollowers,
    getFollowing,
} from "../services/follow.service";

import {
    updateProfile,
    updateAvatar,
    updateCoverImage,
} from "../services/user.service";

import api from "../services/api";

const Profile = () => {
    const { username } = useParams();
    const { user } = useAuth();

    const [profile, setProfile] = useState(null);
    const [projects, setProjects] = useState([]);

    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);

    const [followList, setFollowList] = useState([]);
    const [followListType, setFollowListType] = useState("");
    const [followListLoading, setFollowListLoading] = useState(false);
    const [isFollowListOpen, setIsFollowListOpen] = useState(false);

    const [isFollowing, setIsFollowing] = useState(false);

    const [loading, setLoading] = useState(true);
    const [followLoading, setFollowLoading] = useState(false);
    const [error, setError] = useState("");

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editLoading, setEditLoading] = useState(false);

    const [editForm, setEditForm] = useState({
        fullName: "",
        bio: "",
        githubUsername: "",
    });

    const [avatarLoading, setAvatarLoading] = useState(false);
    const [coverLoading, setCoverLoading] = useState(false);

    const [avatarInputKey, setAvatarInputKey] = useState(0);
    const [coverInputKey, setCoverInputKey] = useState(0);

    const isOwnProfile = user?.username === username;

    // ==========================================
    // FETCH PROFILE
    // ==========================================

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(`/users/${username}`);

                const profileData =
                    response?.data?.data || response?.data;

                setProfile(profileData?.user || profileData);
                setProjects(profileData?.projects || []);
            } catch (error) {
                console.error("Failed to fetch profile:", error);

                setError(
                    error?.response?.data?.message ||
                        "Failed to load profile"
                );
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchProfile();
        }
    }, [username]);

    // ==========================================
    // FETCH FOLLOW STATS
    // ==========================================

    useEffect(() => {
        const fetchFollowStats = async () => {
            try {
                const response = await getFollowStats(username);

                const stats = response?.data || response;

                setFollowersCount(
                    stats?.followersCount ?? stats?.followers ?? 0
                );

                setFollowingCount(
                    stats?.followingCount ?? stats?.following ?? 0
                );

                setIsFollowing(stats?.isFollowing ?? false);
            } catch (error) {
                console.error("Failed to fetch follow stats:", error);
            }
        };

        if (username) {
            fetchFollowStats();
        }
    }, [username]);

    // ==========================================
    // FOLLOW / UNFOLLOW
    // ==========================================

    const handleFollowToggle = async () => {
        if (!user) return;

        try {
            setFollowLoading(true);
            setError("");

            if (isFollowing) {
                await unfollowUser(username);

                setIsFollowing(false);
                setFollowersCount((current) =>
                    Math.max(current - 1, 0)
                );
            } else {
                await followUser(username);

                setIsFollowing(true);
                setFollowersCount((current) => current + 1);
            }
        } catch (error) {
            console.error("Follow action failed:", error);

            setError(
                error?.response?.data?.message ||
                    "Something went wrong"
            );
        } finally {
            setFollowLoading(false);
        }
    };

    // ==========================================
    // FOLLOWERS / FOLLOWING LIST
    // ==========================================

    const handleOpenFollowList = async (type) => {
        try {
            setFollowListLoading(true);
            setFollowListType(type);
            setFollowList([]);
            setIsFollowListOpen(true);
            setError("");

            const response =
                type === "followers"
                    ? await getFollowers(username)
                    : await getFollowing(username);

            const data = response?.data || response;

            setFollowList(
                Array.isArray(data) ? data : data?.users || []
            );
        } catch (error) {
            console.error(`Failed to fetch ${type}:`, error);

            setError(
                error?.response?.data?.message ||
                    `Failed to load ${type}`
            );
        } finally {
            setFollowListLoading(false);
        }
    };

    // ==========================================
    // EDIT PROFILE
    // ==========================================

    const handleOpenEditProfile = () => {
        setEditForm({
            fullName: profile?.fullName || "",
            bio: profile?.bio || "",
            githubUsername: profile?.githubUsername || "",
        });

        setError("");
        setIsEditOpen(true);
    };

    const handleEditChange = (event) => {
        const { name, value } = event.target;

        setEditForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleUpdateProfile = async (event) => {
        event.preventDefault();

        try {
            setEditLoading(true);
            setError("");

            const response = await updateProfile({
                fullName: editForm.fullName.trim(),
                bio: editForm.bio.trim(),
                githubUsername: editForm.githubUsername.trim(),
            });

            const updatedProfile = response?.data || response;

            setProfile((current) => ({
                ...current,
                ...updatedProfile,
            }));

            setIsEditOpen(false);
        } catch (error) {
            console.error("Failed to update profile:", error);

            setError(
                error?.response?.data?.message ||
                    "Failed to update profile"
            );
        } finally {
            setEditLoading(false);
        }
    };

    // ==========================================
    // AVATAR UPLOAD
    // ==========================================

    const handleAvatarChange = async (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        try {
            setAvatarLoading(true);
            setError("");

            const response = await updateAvatar(file);
            const updatedProfile = response?.data || response;

            setProfile((current) => ({
                ...current,
                ...updatedProfile,
            }));
        } catch (error) {
            console.error("Failed to update avatar:", error);

            setError(
                error?.response?.data?.message ||
                    "Failed to update avatar"
            );
        } finally {
            setAvatarLoading(false);
            setAvatarInputKey((current) => current + 1);
        }
    };

    // ==========================================
    // COVER IMAGE UPLOAD
    // ==========================================

    const handleCoverChange = async (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        try {
            setCoverLoading(true);
            setError("");

            const response = await updateCoverImage(file);
            const updatedProfile = response?.data || response;

            setProfile((current) => ({
                ...current,
                ...updatedProfile,
            }));
        } catch (error) {
            console.error("Failed to update cover image:", error);

            setError(
                error?.response?.data?.message ||
                    "Failed to update cover image"
            );
        } finally {
            setCoverLoading(false);
            setCoverInputKey((current) => current + 1);
        }
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div
                className="flex min-h-screen items-center justify-center px-4"
                style={{
                    backgroundColor: "var(--background)",
                    color: "var(--muted)",
                }}
            >
                <p className="animate-pulse">Loading profile...</p>
            </div>
        );
    }

    // ==========================================
    // PROFILE ERROR
    // ==========================================

    if (error && !profile) {
        return (
            <div
                className="flex min-h-screen flex-col items-center justify-center px-5 text-center"
                style={{
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                }}
            >
                <h1 className="text-2xl font-bold">
                    Profile not found
                </h1>

                <p
                    className="mt-3 break-words text-sm sm:text-base"
                    style={{ color: "var(--muted)" }}
                >
                    {error}
                </p>

                <Link
                    to="/explore"
                    className="mt-6 rounded-xl px-5 py-3 text-sm font-medium transition hover:opacity-80"
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

    // ==========================================
    // MAIN PROFILE
    // ==========================================

    return (
        <div
            className="min-h-screen overflow-x-hidden px-3 py-6 sm:px-6 sm:py-10"
            style={{
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
            }}
        >
            <div className="mx-auto w-full max-w-5xl">

                {/* BACK BUTTON */}

                <Link
                    to="/explore"
                    className="mb-5 inline-flex items-center gap-2 text-sm font-medium transition hover:opacity-70 sm:mb-8"
                    style={{ color: "var(--muted)" }}
                >
                    <span>←</span>
                    <span>Back to Explore</span>
                </Link>

                {/* =====================================
                    PROFILE CARD
                ===================================== */}

                <div
                    className="overflow-hidden rounded-2xl border shadow-sm"
                    style={{
                        backgroundColor: "var(--surface)",
                        borderColor: "var(--border)",
                    }}
                >
                    {/* COVER IMAGE */}

                    <div
                        className="relative h-36 w-full bg-cover bg-center sm:h-48 md:h-56"
                        style={{
                            backgroundColor: "var(--secondary)",
                            backgroundImage: profile?.coverImage?.url
                                ? `url(${profile.coverImage.url})`
                                : "none",
                        }}
                    >
                        {/* Cover overlay for better button visibility */}

                        <div className="absolute inset-0 bg-black/10" />

                        {isOwnProfile && (
                            <label
                                htmlFor="coverImageInput"
                                className="absolute right-3 top-3 z-10 cursor-pointer rounded-lg px-3 py-2 text-xs font-medium shadow-md transition hover:opacity-90 sm:right-5 sm:top-5 sm:px-4 sm:text-sm"
                                style={{
                                    backgroundColor: "var(--surface)",
                                    color: "var(--foreground)",
                                }}
                            >
                                {coverLoading
                                    ? "Uploading..."
                                    : "📷 Change Cover"}
                            </label>
                        )}

                        <input
                            key={coverInputKey}
                            id="coverImageInput"
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            className="hidden"
                            onChange={handleCoverChange}
                            disabled={coverLoading}
                        />
                    </div>

                    {/* PROFILE DETAILS */}

                    <div className="px-4 pb-5 sm:px-7 sm:pb-8 md:px-8">

                        {/* AVATAR + ACTION BUTTON */}

                        <div className="-mt-12 flex flex-col gap-4 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between sm:gap-5">

                            {/* AVATAR */}

                            <div className="relative w-fit shrink-0">
                                {profile?.avatar?.url ? (
                                    <img
                                        src={profile.avatar.url}
                                        alt={profile?.username || "Profile"}
                                        className="h-24 w-24 rounded-full border-4 object-cover shadow-md sm:h-32 sm:w-32"
                                        style={{
                                            borderColor: "var(--surface)",
                                        }}
                                    />
                                ) : (
                                    <div
                                        className="flex h-24 w-24 items-center justify-center rounded-full border-4 text-3xl font-bold shadow-md sm:h-32 sm:w-32 sm:text-4xl"
                                        style={{
                                            borderColor: "var(--surface)",
                                            backgroundColor: "var(--secondary)",
                                            color: "var(--secondary-foreground)",
                                        }}
                                    >
                                        {(
                                            profile?.fullName ||
                                            profile?.username ||
                                            "U"
                                        )
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>
                                )}

                                {isOwnProfile && (
                                    <label
                                        htmlFor="avatarInput"
                                        className="absolute bottom-0 right-0 cursor-pointer rounded-full border px-2.5 py-1.5 text-xs font-medium shadow-md transition hover:opacity-80 sm:px-3 sm:py-2"
                                        style={{
                                            backgroundColor: "var(--surface)",
                                            borderColor: "var(--border)",
                                            color: "var(--foreground)",
                                        }}
                                    >
                                        {avatarLoading ? "..." : "✏️ Edit"}
                                    </label>
                                )}

                                <input
                                    key={avatarInputKey}
                                    id="avatarInput"
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/webp"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                    disabled={avatarLoading}
                                />
                            </div>

                            {/* PROFILE ACTION */}

                            <div className="flex w-full sm:w-auto">
                                {isOwnProfile ? (
                                    <button
                                        type="button"
                                        onClick={handleOpenEditProfile}
                                        className="w-full rounded-xl border px-5 py-2.5 text-sm font-semibold transition hover:opacity-80 sm:w-auto sm:text-base"
                                        style={{
                                            borderColor: "var(--border)",
                                            backgroundColor: "var(--background)",
                                        }}
                                    >
                                        Edit Profile
                                    </button>
                                ) : user ? (
                                    <button
                                        type="button"
                                        onClick={handleFollowToggle}
                                        disabled={followLoading}
                                        className="w-full rounded-xl px-5 py-2.5 text-sm font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:text-base"
                                        style={{
                                            backgroundColor: "var(--primary)",
                                            color: "var(--primary-foreground)",
                                        }}
                                    >
                                        {followLoading
                                            ? "Please wait..."
                                            : isFollowing
                                              ? "Unfollow"
                                              : "＋ Follow"}
                                    </button>
                                ) : (
                                    <Link
                                        to="/login"
                                        className="w-full rounded-xl px-5 py-2.5 text-center text-sm font-semibold transition hover:opacity-90 sm:w-auto sm:text-base"
                                        style={{
                                            backgroundColor: "var(--primary)",
                                            color: "var(--primary-foreground)",
                                        }}
                                    >
                                        Login to Follow
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* NAME + USERNAME */}

                        <div className="mt-4 min-w-0 sm:mt-5">
                            <h1 className="break-words text-2xl font-bold tracking-tight sm:text-3xl">
                                {profile?.fullName || profile?.username}
                            </h1>

                            <p
                                className="mt-1 break-all text-sm sm:text-base"
                                style={{ color: "var(--muted)" }}
                            >
                                @{profile?.username}
                            </p>
                        </div>

                        {/* BIO */}

                        {profile?.bio && (
                            <p
                                className="mt-4 max-w-2xl whitespace-pre-wrap break-words text-sm leading-6 sm:mt-5 sm:text-base sm:leading-7"
                                style={{ color: "var(--muted)" }}
                            >
                                {profile.bio}
                            </p>
                        )}

                        {/* GITHUB */}

                        {profile?.githubUsername && (
                            <a
                                href={`https://github.com/${profile.githubUsername}`}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-3 inline-flex max-w-full items-center gap-2 break-all text-sm font-medium transition hover:underline sm:mt-4 sm:text-base"
                                style={{ color: "var(--foreground)" }}
                            >
                                <span>↗</span>
                                <span>GitHub: @{profile.githubUsername}</span>
                            </a>
                        )}

                        {/* =====================================
                            FOLLOW STATS
                        ===================================== */}

                        <div
                            className="mt-6 grid grid-cols-3 gap-2 border-t pt-5 sm:mt-7 sm:gap-6 sm:pt-6"
                            style={{ borderColor: "var(--border)" }}
                        >
                            {/* FOLLOWERS */}

                            <button
                                type="button"
                                onClick={() =>
                                    handleOpenFollowList("followers")
                                }
                                className="min-w-0 rounded-xl px-1 py-2 text-center transition hover:opacity-70 sm:px-3"
                            >
                                <p className="text-xl font-bold sm:text-2xl">
                                    {followersCount}
                                </p>

                                <p
                                    className="mt-1 text-xs sm:text-sm"
                                    style={{ color: "var(--muted)" }}
                                >
                                    Followers
                                </p>
                            </button>

                            {/* FOLLOWING */}

                            <button
                                type="button"
                                onClick={() =>
                                    handleOpenFollowList("following")
                                }
                                className="min-w-0 rounded-xl px-1 py-2 text-center transition hover:opacity-70"
                            >
                                <p className="text-xl font-bold sm:text-2xl">
                                    {followingCount}
                                </p>

                                <p
                                    className="mt-1 text-xs sm:text-sm"
                                    style={{ color: "var(--muted)" }}
                                >
                                    Following
                                </p>
                            </button>

                            {/* PROJECTS */}

                            <div className="min-w-0 rounded-xl px-1 py-2 text-center">
                                <p className="text-xl font-bold sm:text-2xl">
                                    {projects.length}
                                </p>

                                <p
                                    className="mt-1 text-xs sm:text-sm"
                                    style={{ color: "var(--muted)" }}
                                >
                                    Projects
                                </p>
                            </div>
                        </div>

                        {/* ERROR MESSAGE */}

                        {error && (
                            <p
                                className="mt-4 break-words text-sm"
                                style={{ color: "var(--danger)" }}
                            >
                                {error}
                            </p>
                        )}
                    </div>
                </div>

                {/* =====================================
                    PROJECTS SECTION
                ===================================== */}

                <section className="mt-8 sm:mt-10">

                    {/* PROJECT HEADER */}

                    <div className="mb-5 flex flex-col gap-4 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">

                        <div className="min-w-0">
                            <h2 className="text-xl font-bold sm:text-2xl">
                                Projects
                            </h2>

                            <p
                                className="mt-1 break-all text-xs sm:text-sm"
                                style={{ color: "var(--muted)" }}
                            >
                                Projects by @{profile?.username}
                            </p>
                        </div>

                        {isOwnProfile && (
                            <Link
                                to="/create-project"
                                className="inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition hover:opacity-90 min-[420px]:w-auto"
                                style={{
                                    backgroundColor: "var(--primary)",
                                    color: "var(--primary-foreground)",
                                }}
                            >
                                + New Project
                            </Link>
                        )}
                    </div>

                    {/* NO PROJECTS */}

                    {projects.length === 0 ? (
                        <div
                            className="rounded-2xl border px-4 py-10 text-center sm:py-14"
                            style={{
                                backgroundColor: "var(--surface)",
                                borderColor: "var(--border)",
                            }}
                        >
                            <div className="mb-3 text-3xl">📂</div>

                            <h3 className="font-semibold">
                                No projects yet
                            </h3>

                            <p
                                className="mt-2 text-sm"
                                style={{ color: "var(--muted)" }}
                            >
                                {isOwnProfile
                                    ? "Start by creating your first project."
                                    : "This user hasn't shared any projects yet."}
                            </p>
                        </div>
                    ) : (

                        /* PROJECT GRID */

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                            {projects.map((project) => (
                                <Link
                                    key={project._id}
                                    to={`/projects/${project._id}`}
                                    className="group min-w-0 overflow-hidden rounded-2xl border transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                                    style={{
                                        backgroundColor: "var(--surface)",
                                        borderColor: "var(--border)",
                                    }}
                                >
                                    {/* PROJECT THUMBNAIL */}

                                    {project.thumbnail?.url ? (
                                        <img
                                            src={project.thumbnail.url}
                                            alt={project.title}
                                            loading="lazy"
                                            className="h-44 w-full object-cover transition duration-300 group-hover:scale-[1.02] sm:h-48"
                                        />
                                    ) : (
                                        <div
                                            className="flex h-44 items-center justify-center sm:h-48"
                                            style={{
                                                backgroundColor: "var(--secondary)",
                                            }}
                                        >
                                            <span
                                                className="text-sm"
                                                style={{
                                                    color: "var(--muted)",
                                                }}
                                            >
                                                No thumbnail
                                            </span>
                                        </div>
                                    )}

                                    {/* PROJECT INFO */}

                                    <div className="min-w-0 p-4 sm:p-5">
                                        <h3 className="break-words text-base font-semibold sm:text-lg">
                                            {project.title}
                                        </h3>

                                        <p
                                            className="mt-2 line-clamp-2 break-words text-sm leading-6"
                                            style={{ color: "var(--muted)" }}
                                        >
                                            {project.description}
                                        </p>

                                        {/* TECH STACK */}

                                        {project.techStack?.length > 0 && (
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                {project.techStack
                                                    .slice(0, 4)
                                                    .map((tech, index) => (
                                                        <span
                                                            key={`${tech}-${index}`}
                                                            className="max-w-full break-words rounded-full border px-2.5 py-1 text-xs"
                                                            style={{
                                                                borderColor:
                                                                    "var(--border)",
                                                                color: "var(--muted)",
                                                            }}
                                                        >
                                                            {tech}
                                                        </span>
                                                    ))}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {/* ==========================================
                FOLLOWERS / FOLLOWING MODAL
            ========================================== */}

            {isFollowListOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-3 sm:p-5"
                    onClick={() => setIsFollowListOpen(false)}
                >
                    <div
                        className="my-auto flex max-h-[85dvh] w-full max-w-md flex-col overflow-hidden rounded-2xl border shadow-2xl"
                        style={{
                            backgroundColor: "var(--surface)",
                            borderColor: "var(--border)",
                            color: "var(--foreground)",
                        }}
                        onClick={(event) => event.stopPropagation()}
                    >
                        {/* MODAL HEADER */}

                        <div
                            className="flex shrink-0 items-center justify-between border-b px-4 py-4 sm:px-5"
                            style={{ borderColor: "var(--border)" }}
                        >
                            <h2 className="text-lg font-bold sm:text-xl">
                                {followListType === "followers"
                                    ? "Followers"
                                    : "Following"}
                            </h2>

                            <button
                                type="button"
                                onClick={() => setIsFollowListOpen(false)}
                                className="rounded-lg px-3 py-1 text-2xl transition hover:opacity-70"
                                style={{ color: "var(--muted)" }}
                                aria-label="Close modal"
                            >
                                ×
                            </button>
                        </div>

                        {/* MODAL CONTENT */}

                        <div className="overflow-y-auto p-3 sm:p-4">
                            {followListLoading ? (
                                <div className="py-10 text-center">
                                    <p style={{ color: "var(--muted)" }}>
                                        Loading...
                                    </p>
                                </div>
                            ) : followList.length === 0 ? (
                                <div className="py-10 text-center">
                                    <p
                                        className="text-sm"
                                        style={{ color: "var(--muted)" }}
                                    >
                                        No {followListType} yet.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {followList.map((item, index) => {
                                        const person =
                                            item?.user ||
                                            item?.follower ||
                                            item?.following ||
                                            item;

                                        const personId =
                                            person?._id ||
                                            person?.id ||
                                            index;

                                        return (
                                            <Link
                                                key={personId}
                                                to={`/profile/${person?.username}`}
                                                onClick={() =>
                                                    setIsFollowListOpen(false)
                                                }
                                                className="flex min-w-0 items-center gap-3 rounded-xl p-3 transition hover:bg-[var(--surface-hover)]"
                                            >
                                                {/* USER AVATAR */}

                                                {person?.avatar?.url ? (
                                                    <img
                                                        src={person.avatar.url}
                                                        alt={
                                                            person?.username ||
                                                            "User"
                                                        }
                                                        className="h-10 w-10 shrink-0 rounded-full object-cover sm:h-11 sm:w-11"
                                                    />
                                                ) : (
                                                    <div
                                                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold sm:h-11 sm:w-11"
                                                        style={{
                                                            backgroundColor:
                                                                "var(--secondary)",
                                                            color: "var(--secondary-foreground)",
                                                        }}
                                                    >
                                                        {(
                                                            person?.fullName ||
                                                            person?.username ||
                                                            "U"
                                                        )
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>
                                                )}

                                                {/* USER DETAILS */}

                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-medium sm:text-base">
                                                        {person?.fullName ||
                                                            person?.username ||
                                                            "Unknown User"}
                                                    </p>

                                                    {person?.username && (
                                                        <p
                                                            className="truncate text-xs sm:text-sm"
                                                            style={{
                                                                color: "var(--muted)",
                                                            }}
                                                        >
                                                            @{person.username}
                                                        </p>
                                                    )}
                                                </div>

                                                <span
                                                    className="shrink-0 text-sm"
                                                    style={{
                                                        color: "var(--muted)",
                                                    }}
                                                >
                                                    →
                                                </span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ==========================================
                EDIT PROFILE MODAL
            ========================================== */}

            {isEditOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-3 sm:p-5"
                    onClick={() =>
                        !editLoading && setIsEditOpen(false)
                    }
                >
                    <div
                        className="my-auto max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-2xl border p-4 shadow-2xl sm:p-6"
                        style={{
                            backgroundColor: "var(--surface)",
                            borderColor: "var(--border)",
                            color: "var(--foreground)",
                        }}
                        onClick={(event) => event.stopPropagation()}
                    >
                        {/* MODAL HEADER */}

                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <h2 className="text-xl font-bold sm:text-2xl">
                                    Edit Profile
                                </h2>

                                <p
                                    className="mt-1 text-xs sm:text-sm"
                                    style={{ color: "var(--muted)" }}
                                >
                                    Update your profile information
                                </p>
                            </div>

                            <button
                                type="button"
                                disabled={editLoading}
                                onClick={() => setIsEditOpen(false)}
                                className="shrink-0 rounded-lg px-3 py-1 text-2xl transition hover:opacity-70 disabled:opacity-50"
                                style={{ color: "var(--muted)" }}
                                aria-label="Close modal"
                            >
                                ×
                            </button>
                        </div>

                        {/* EDIT FORM */}

                        <form
                            onSubmit={handleUpdateProfile}
                            className="mt-5 space-y-4 sm:mt-6 sm:space-y-5"
                        >
                            {/* FULL NAME */}

                            <div>
                                <label
                                    htmlFor="fullName"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Full Name
                                </label>

                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    value={editForm.fullName}
                                    onChange={handleEditChange}
                                    required
                                    className="w-full rounded-xl border px-3 py-3 text-sm outline-none transition focus:ring-2 sm:px-4 sm:text-base"
                                    style={{
                                        backgroundColor: "var(--input)",
                                        color: "var(--foreground)",
                                        borderColor: "var(--border)",
                                    }}
                                />
                            </div>

                            {/* BIO */}

                            <div>
                                <label
                                    htmlFor="bio"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Bio
                                </label>

                                <textarea
                                    id="bio"
                                    name="bio"
                                    value={editForm.bio}
                                    onChange={handleEditChange}
                                    rows={4}
                                    placeholder="Tell people about yourself..."
                                    className="w-full resize-y rounded-xl border px-3 py-3 text-sm outline-none transition focus:ring-2 sm:px-4 sm:text-base"
                                    style={{
                                        backgroundColor: "var(--input)",
                                        color: "var(--foreground)",
                                        borderColor: "var(--border)",
                                    }}
                                />
                            </div>

                            {/* GITHUB USERNAME */}

                            <div>
                                <label
                                    htmlFor="githubUsername"
                                    className="mb-2 block text-sm font-medium"
                                >
                                    GitHub Username
                                </label>

                                <div
                                    className="flex min-w-0 items-center overflow-hidden rounded-xl border"
                                    style={{
                                        backgroundColor: "var(--input)",
                                        borderColor: "var(--border)",
                                    }}
                                >
                                    <span
                                        className="shrink-0 pl-3 text-xs sm:pl-4 sm:text-sm"
                                        style={{ color: "var(--muted)" }}
                                    >
                                        github.com/
                                    </span>

                                    <input
                                        id="githubUsername"
                                        name="githubUsername"
                                        type="text"
                                        value={editForm.githubUsername}
                                        onChange={handleEditChange}
                                        className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm outline-none sm:text-base"
                                        style={{
                                            color: "var(--foreground)",
                                        }}
                                    />
                                </div>
                            </div>

                            {/* ERROR */}

                            {error && (
                                <p
                                    className="break-words text-sm"
                                    style={{ color: "var(--danger)" }}
                                >
                                    {error}
                                </p>
                            )}

                            {/* FORM BUTTONS */}

                            <div className="flex flex-col-reverse gap-3 pt-2 min-[420px]:flex-row min-[420px]:justify-end">
                                <button
                                    type="button"
                                    disabled={editLoading}
                                    onClick={() => setIsEditOpen(false)}
                                    className="w-full rounded-xl border px-5 py-2.5 text-sm font-medium transition hover:opacity-80 disabled:opacity-50 min-[420px]:w-auto sm:text-base"
                                    style={{
                                        borderColor: "var(--border)",
                                        backgroundColor: "var(--background)",
                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={editLoading}
                                    className="w-full rounded-xl px-5 py-2.5 text-sm font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 min-[420px]:w-auto sm:text-base"
                                    style={{
                                        backgroundColor: "var(--primary)",
                                        color: "var(--primary-foreground)",
                                    }}
                                >
                                    {editLoading
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;