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

    const [followersCount, setFollowersCount] =
        useState(0);

    const [followingCount, setFollowingCount] =
        useState(0);

    // ==========================================
    // FOLLOWERS / FOLLOWING LIST STATE
    // ==========================================

    const [followList, setFollowList] = useState([]);
    const [followListType, setFollowListType] =
        useState("");
    const [followListLoading, setFollowListLoading] =
        useState(false);
    const [isFollowListOpen, setIsFollowListOpen] =
        useState(false);

    const [isFollowing, setIsFollowing] =
        useState(false);

    const [loading, setLoading] = useState(true);
    const [followLoading, setFollowLoading] =
        useState(false);

    const [error, setError] = useState("");

    // ==========================================
    // EDIT PROFILE STATE
    // ==========================================

    const [isEditOpen, setIsEditOpen] =
        useState(false);

    const [editLoading, setEditLoading] =
        useState(false);

    const [editForm, setEditForm] = useState({
        fullName: "",
        bio: "",
        githubUsername: "",
    });

    // ==========================================
    // IMAGE UPLOAD STATE
    // ==========================================

    const [avatarLoading, setAvatarLoading] =
        useState(false);

    const [coverLoading, setCoverLoading] =
        useState(false);

    const [avatarInputKey, setAvatarInputKey] =
        useState(0);

    const [coverInputKey, setCoverInputKey] =
        useState(0);

    // ==========================================
    // CHECK OWN PROFILE
    // ==========================================

    const isOwnProfile =
        user?.username === username;

    // ==========================================
    // FETCH PROFILE
    // ==========================================

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError("");

                /*
                 * Backend profile endpoint:
                 * GET /users/:username
                 */

                const response = await api.get(
                    `/users/${username}`
                );

                console.log(
                    "PROFILE RESPONSE:",
                    response
                );

                const profileData =
                    response?.data?.data ||
                    response?.data;

                setProfile(
                    profileData?.user ||
                        profileData
                );

                setProjects(
                    profileData?.projects || []
                );
            } catch (error) {
                console.error(
                    "Failed to fetch profile:",
                    error
                );

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
                const response =
                    await getFollowStats(
                        username
                    );

                console.log(
                    "FOLLOW STATS:",
                    response
                );

                const stats =
                    response?.data ||
                    response;

                setFollowersCount(
                    stats?.followersCount ??
                        stats?.followers ??
                        0
                );

                setFollowingCount(
                    stats?.followingCount ??
                        stats?.following ??
                        0
                );

                setIsFollowing(
                    stats?.isFollowing ??
                        false
                );
            } catch (error) {
                console.error(
                    "Failed to fetch follow stats:",
                    error
                );
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
        if (!user) {
            return;
        }

        try {
            setFollowLoading(true);
            setError("");

            if (isFollowing) {
                await unfollowUser(username);

                setIsFollowing(false);

                setFollowersCount(
                    (current) =>
                        Math.max(
                            current - 1,
                            0
                        )
                );
            } else {
                await followUser(username);

                setIsFollowing(true);

                setFollowersCount(
                    (current) =>
                        current + 1
                );
            }
        } catch (error) {
            console.error(
                "Follow action failed:",
                error
            );

            setError(
                error?.response?.data?.message ||
                    "Something went wrong"
            );
        } finally {
            setFollowLoading(false);
        }
    };

    // ==========================================
    // OPEN FOLLOWERS / FOLLOWING LIST
    // ==========================================

    const handleOpenFollowList = async (type) => {
        try {
            setFollowListLoading(true);
            setFollowListType(type);
            setIsFollowListOpen(true);
            setError("");

            const response =
                type === "followers"
                    ? await getFollowers(username)
                    : await getFollowing(username);

            const data =
                response?.data || response;

            setFollowList(
                Array.isArray(data)
                    ? data
                    : data?.users || []
            );
        } catch (error) {
            console.error(
                `Failed to fetch ${type}:`,
                error
            );

            setError(
                error?.response?.data?.message ||
                    `Failed to load ${type}`
            );
        } finally {
            setFollowListLoading(false);
        }
    };

    // ==========================================
    // OPEN EDIT PROFILE
    // ==========================================

    const handleOpenEditProfile = () => {
        setEditForm({
            fullName: profile?.fullName || "",
            bio: profile?.bio || "",
            githubUsername:
                profile?.githubUsername || "",
        });

        setError("");
        setIsEditOpen(true);
    };

    // ==========================================
    // EDIT FORM CHANGE
    // ==========================================

    const handleEditChange = (event) => {
        const { name, value } =
            event.target;

        setEditForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    // ==========================================
    // UPDATE PROFILE
    // ==========================================

    const handleUpdateProfile = async (
        event
    ) => {
        event.preventDefault();

        try {
            setEditLoading(true);
            setError("");

            const response =
                await updateProfile({
                    fullName:
                        editForm.fullName.trim(),
                    bio: editForm.bio.trim(),
                    githubUsername:
                        editForm.githubUsername.trim(),
                });

            const updatedProfile =
                response?.data ||
                response;

            setProfile((current) => ({
                ...current,
                ...updatedProfile,
            }));

            setIsEditOpen(false);
        } catch (error) {
            console.error(
                "Failed to update profile:",
                error
            );

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

        if (!file) {
            return;
        }

        try {
            setAvatarLoading(true);
            setError("");

            const response =
                await updateAvatar(file);

            const updatedProfile =
                response?.data || response;

            setProfile((current) => ({
                ...current,
                ...updatedProfile,
            }));
        } catch (error) {
            console.error(
                "Failed to update avatar:",
                error
            );

            setError(
                error?.response?.data?.message ||
                    "Failed to update avatar"
            );
        } finally {
            setAvatarLoading(false);

            setAvatarInputKey(
                (current) => current + 1
            );
        }
    };

    // ==========================================
    // COVER IMAGE UPLOAD
    // ==========================================

    const handleCoverChange = async (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        try {
            setCoverLoading(true);
            setError("");

            const response =
                await updateCoverImage(file);

            const updatedProfile =
                response?.data || response;

            setProfile((current) => ({
                ...current,
                ...updatedProfile,
            }));
        } catch (error) {
            console.error(
                "Failed to update cover image:",
                error
            );

            setError(
                error?.response?.data?.message ||
                    "Failed to update cover image"
            );
        } finally {
            setCoverLoading(false);

            setCoverInputKey(
                (current) => current + 1
            );
        }
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div
                className="flex min-h-screen items-center justify-center"
                style={{
                    backgroundColor:
                        "var(--background)",
                    color:
                        "var(--foreground)",
                }}
            >
                <p
                    style={{
                        color:
                            "var(--muted)",
                    }}
                >
                    Loading profile...
                </p>
            </div>
        );
    }

    // ==========================================
    // ERROR
    // ==========================================

    if (error && !profile) {
        return (
            <div
                className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
                style={{
                    backgroundColor:
                        "var(--background)",
                    color:
                        "var(--foreground)",
                }}
            >
                <h1 className="text-2xl font-bold">
                    Profile not found
                </h1>

                <p
                    className="mt-3"
                    style={{
                        color:
                            "var(--muted)",
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

    // ==========================================
    // MAIN PROFILE
    // ==========================================

    return (
        <div
            className="min-h-screen px-4 py-10 sm:px-6"
            style={{
                backgroundColor:
                    "var(--background)",
                color:
                    "var(--foreground)",
            }}
        >
            <div className="mx-auto max-w-5xl">

                {/* BACK */}

                <Link
                    to="/explore"
                    className="mb-8 inline-flex text-sm font-medium hover:opacity-70"
                    style={{
                        color:
                            "var(--muted)",
                    }}
                >
                    ← Back to Explore
                </Link>

                {/* ==============================
                    PROFILE CARD
                ============================== */}

                <div
                    className="overflow-hidden rounded-2xl border"
                    style={{
                        backgroundColor:
                            "var(--surface)",
                        borderColor:
                            "var(--border)",
                    }}
                >

                    {/* COVER */}

                    <div
                        className="relative h-44 w-full sm:h-56"
                        style={{
                            backgroundColor:
                                "var(--secondary)",
                            backgroundImage:
                                profile?.coverImage
                                    ?.url
                                    ? `url(${profile.coverImage.url})`
                                    : "none",
                            backgroundSize:
                                "cover",
                            backgroundPosition:
                                "center",
                        }}
                    >
                        {isOwnProfile && (
                            <label
                                htmlFor="coverImageInput"
                                className="absolute right-4 top-4 cursor-pointer rounded-lg px-4 py-2 text-sm font-medium shadow-md transition hover:opacity-90"
                                style={{
                                    backgroundColor:
                                        "var(--surface)",
                                    color:
                                        "var(--foreground)",
                                }}
                            >
                                {coverLoading
                                    ? "Uploading..."
                                    : "Change Cover"}
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

                    {/* PROFILE CONTENT */}

                    <div className="px-5 pb-7 sm:px-8">

                        {/* AVATAR */}

                        <div className="-mt-14 flex flex-col gap-5 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">

                            <div className="relative w-fit">
                                {profile?.avatar
                                    ?.url ? (
                                    <img
                                        src={
                                            profile
                                                .avatar
                                                .url
                                        }
                                        alt={
                                            profile
                                                .username ||
                                            "Profile"
                                        }
                                        className="h-28 w-28 rounded-full border-4 object-cover sm:h-32 sm:w-32"
                                        style={{
                                            borderColor:
                                                "var(--surface)",
                                        }}
                                    />
                                ) : (
                                    <div
                                        className="flex h-28 w-28 items-center justify-center rounded-full border-4 text-3xl font-bold sm:h-32 sm:w-32"
                                        style={{
                                            borderColor:
                                                "var(--surface)",
                                            backgroundColor:
                                                "var(--secondary)",
                                            color:
                                                "var(--secondary-foreground)",
                                        }}
                                    >
                                        {(
                                            profile?.fullName ||
                                            profile?.username ||
                                            "U"
                                        )
                                            .charAt(
                                                0
                                            )
                                            .toUpperCase()}
                                    </div>
                                )}

                                {isOwnProfile && (
                                    <label
                                        htmlFor="avatarInput"
                                        className="absolute bottom-0 right-0 cursor-pointer rounded-full border px-3 py-2 text-xs font-medium shadow-md hover:opacity-90"
                                        style={{
                                            backgroundColor:
                                                "var(--surface)",
                                            borderColor:
                                                "var(--border)",
                                            color:
                                                "var(--foreground)",
                                        }}
                                    >
                                        {avatarLoading
                                            ? "..."
                                            : "Edit"}
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

                            <div>
                                {isOwnProfile ? (
                                    <button
                                        type="button"
                                        onClick={
                                            handleOpenEditProfile
                                        }
                                        className="rounded-lg border px-5 py-2.5 font-medium hover:opacity-80"
                                        style={{
                                            borderColor:
                                                "var(--border)",
                                            backgroundColor:
                                                "var(--background)",
                                        }}
                                    >
                                        Edit Profile
                                    </button>
                                ) : user ? (
                                    <button
                                        type="button"
                                        onClick={
                                            handleFollowToggle
                                        }
                                        disabled={
                                            followLoading
                                        }
                                        className="rounded-lg px-5 py-2.5 font-medium disabled:cursor-not-allowed disabled:opacity-50"
                                        style={{
                                            backgroundColor:
                                                "var(--primary)",
                                            color:
                                                "var(--primary-foreground)",
                                        }}
                                    >
                                        {followLoading
                                            ? "Loading..."
                                            : isFollowing
                                              ? "Unfollow"
                                              : "Follow"}
                                    </button>
                                ) : (
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
                                        Login to Follow
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* NAME */}

                        <div className="mt-5">
                            <h1 className="text-3xl font-bold">
                                {profile?.fullName ||
                                    profile?.username}
                            </h1>

                            <p
                                className="mt-1"
                                style={{
                                    color:
                                        "var(--muted)",
                                }}
                            >
                                @{profile?.username}
                            </p>
                        </div>

                        {/* BIO */}

                        {profile?.bio && (
                            <p
                                className="mt-5 max-w-2xl leading-7"
                                style={{
                                    color:
                                        "var(--muted)",
                                }}
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
                                className="mt-4 inline-block text-sm font-medium hover:underline"
                                style={{
                                    color:
                                        "var(--foreground)",
                                }}
                            >
                                GitHub: @
                                {
                                    profile.githubUsername
                                }
                            </a>
                        )}

                        {/* STATS */}

                        <div className="mt-7 flex gap-8 border-t pt-6">
                            <button
                                type="button"
                                onClick={() =>
                                    handleOpenFollowList(
                                        "followers"
                                    )
                                }
                                className="text-left hover:opacity-70"
                            >
                                <p className="text-xl font-bold">
                                    {
                                        followersCount
                                    }
                                </p>

                                <p
                                    className="text-sm"
                                    style={{
                                        color:
                                            "var(--muted)",
                                    }}
                                >
                                    Followers
                                </p>
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    handleOpenFollowList(
                                        "following"
                                    )
                                }
                                className="text-left hover:opacity-70"
                            >
                                <p className="text-xl font-bold">
                                    {
                                        followingCount
                                    }
                                </p>

                                <p
                                    className="text-sm"
                                    style={{
                                        color:
                                            "var(--muted)",
                                    }}
                                >
                                    Following
                                </p>
                            </button>

                            <div>
                                <p className="text-xl font-bold">
                                    {projects.length}
                                </p>

                                <p
                                    className="text-sm"
                                    style={{
                                        color:
                                            "var(--muted)",
                                    }}
                                >
                                    Projects
                                </p>
                            </div>
                        </div>

                        {/* FOLLOW ERROR */}

                        {error && (
                            <p
                                className="mt-4 text-sm"
                                style={{
                                    color:
                                        "var(--danger)",
                                }}
                            >
                                {error}
                            </p>
                        )}
                    </div>
                </div>

                {/* ==============================
                    PROJECTS
                ============================== */}

                <section className="mt-10">

                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">
                                Projects
                            </h2>

                            <p
                                className="mt-1 text-sm"
                                style={{
                                    color:
                                        "var(--muted)",
                                }}
                            >
                                Projects by @
                                {
                                    profile?.username
                                }
                            </p>
                        </div>

                        {isOwnProfile && (
                            <Link
                                to="/create-project"
                                className="rounded-lg px-4 py-2 text-sm font-medium"
                                style={{
                                    backgroundColor:
                                        "var(--primary)",
                                    color:
                                        "var(--primary-foreground)",
                                }}
                            >
                                + New Project
                            </Link>
                        )}
                    </div>

                    {projects.length === 0 ? (
                        <div
                            className="rounded-xl border p-10 text-center"
                            style={{
                                backgroundColor:
                                    "var(--surface)",
                                borderColor:
                                    "var(--border)",
                            }}
                        >
                            <p
                                style={{
                                    color:
                                        "var(--muted)",
                                }}
                            >
                                No projects yet.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-5 sm:grid-cols-2">
                            {projects.map(
                                (project) => (
                                    <Link
                                        key={
                                            project._id
                                        }
                                        to={`/projects/${project._id}`}
                                        className="overflow-hidden rounded-xl border transition-transform hover:-translate-y-1"
                                        style={{
                                            backgroundColor:
                                                "var(--surface)",
                                            borderColor:
                                                "var(--border)",
                                        }}
                                    >
                                        {/* THUMBNAIL */}

                                        {project
                                            .thumbnail
                                            ?.url ? (
                                            <img
                                                src={
                                                    project
                                                        .thumbnail
                                                        .url
                                                }
                                                alt={
                                                    project.title
                                                }
                                                className="h-44 w-full object-cover"
                                            />
                                        ) : (
                                            <div
                                                className="flex h-44 items-center justify-center"
                                                style={{
                                                    backgroundColor:
                                                        "var(--secondary)",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        color:
                                                            "var(--muted)",
                                                    }}
                                                >
                                                    No
                                                    thumbnail
                                                </span>
                                            </div>
                                        )}

                                        {/* PROJECT INFO */}

                                        <div className="p-5">
                                            <h3 className="text-lg font-semibold">
                                                {
                                                    project.title
                                                }
                                            </h3>

                                            <p
                                                className="mt-2 line-clamp-2 text-sm leading-6"
                                                style={{
                                                    color:
                                                        "var(--muted)",
                                                }}
                                            >
                                                {
                                                    project.description
                                                }
                                            </p>

                                            {/* TECH STACK */}

                                            {project
                                                .techStack
                                                ?.length >
                                                0 && (
                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    {project.techStack
                                                        .slice(
                                                            0,
                                                            4
                                                        )
                                                        .map(
                                                            (
                                                                tech,
                                                                index
                                                            ) => (
                                                                <span
                                                                    key={`${tech}-${index}`}
                                                                    className="rounded-full border px-2.5 py-1 text-xs"
                                                                    style={{
                                                                        borderColor:
                                                                            "var(--border)",
                                                                        color:
                                                                            "var(--muted)",
                                                                    }}
                                                                >
                                                                    {
                                                                        tech
                                                                    }
                                                                </span>
                                                            )
                                                        )}
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                )
                            )}
                        </div>
                    )}
                </section>
            </div>

            {/* ==========================================
                FOLLOWERS / FOLLOWING MODAL
            ========================================== */}

            {isFollowListOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
                    onClick={() =>
                        setIsFollowListOpen(false)
                    }
                >
                    <div
                        className="w-full max-w-md overflow-hidden rounded-2xl border shadow-xl"
                        style={{
                            backgroundColor:
                                "var(--surface)",
                            borderColor:
                                "var(--border)",
                            color:
                                "var(--foreground)",
                        }}
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="flex items-center justify-between border-b px-5 py-4"
                            style={{
                                borderColor:
                                    "var(--border)",
                            }}
                        >
                            <h2 className="text-xl font-bold">
                                {followListType ===
                                "followers"
                                    ? "Followers"
                                    : "Following"}
                            </h2>

                            <button
                                type="button"
                                onClick={() =>
                                    setIsFollowListOpen(
                                        false
                                    )
                                }
                                className="rounded-lg px-3 py-1 text-xl hover:opacity-70"
                                style={{
                                    color:
                                        "var(--muted)",
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto p-4">
                            {followListLoading ? (
                                <div className="py-10 text-center">
                                    <p
                                        style={{
                                            color:
                                                "var(--muted)",
                                        }}
                                    >
                                        Loading...
                                    </p>
                                </div>
                            ) : followList.length === 0 ? (
                                <div className="py-10 text-center">
                                    <p
                                        style={{
                                            color:
                                                "var(--muted)",
                                        }}
                                    >
                                        No{" "}
                                        {followListType} yet.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {followList.map(
                                        (item, index) => {
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
                                                    key={
                                                        personId
                                                    }
                                                    to={`/profile/${person?.username}`}
                                                    onClick={() =>
                                                        setIsFollowListOpen(
                                                            false
                                                        )
                                                    }
                                                    className="flex items-center gap-3 rounded-xl p-3 hover:bg-[var(--surface-hover)]"
                                                >
                                                    {person?.avatar
                                                        ?.url ? (
                                                        <img
                                                            src={
                                                                person
                                                                    .avatar
                                                                    .url
                                                            }
                                                            alt={
                                                                person?.username ||
                                                                "User"
                                                            }
                                                            className="h-11 w-11 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div
                                                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                                                            style={{
                                                                backgroundColor:
                                                                    "var(--secondary)",
                                                                color:
                                                                    "var(--secondary-foreground)",
                                                            }}
                                                        >
                                                            {(
                                                                person?.fullName ||
                                                                person?.username ||
                                                                "U"
                                                            )
                                                                .charAt(
                                                                    0
                                                                )
                                                                .toUpperCase()}
                                                        </div>
                                                    )}

                                                    <div className="min-w-0">
                                                        <p className="font-medium">
                                                            {person?.fullName ||
                                                                person?.username ||
                                                                "Unknown User"}
                                                        </p>

                                                        {person?.username && (
                                                            <p
                                                                className="truncate text-sm"
                                                                style={{
                                                                    color:
                                                                        "var(--muted)",
                                                                }}
                                                            >
                                                                @
                                                                {
                                                                    person.username
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </Link>
                                            );
                                        }
                                    )}
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
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
                    onClick={() =>
                        !editLoading &&
                        setIsEditOpen(false)
                    }
                >
                    <div
                        className="w-full max-w-lg rounded-2xl border p-6 shadow-xl"
                        style={{
                            backgroundColor:
                                "var(--surface)",
                            borderColor:
                                "var(--border)",
                            color:
                                "var(--foreground)",
                        }}
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        {/* HEADER */}

                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold">
                                    Edit Profile
                                </h2>

                                <p
                                    className="mt-1 text-sm"
                                    style={{
                                        color:
                                            "var(--muted)",
                                    }}
                                >
                                    Update your profile
                                    information
                                </p>
                            </div>

                            <button
                                type="button"
                                disabled={
                                    editLoading
                                }
                                onClick={() =>
                                    setIsEditOpen(
                                        false
                                    )
                                }
                                className="rounded-lg px-3 py-2 text-xl hover:opacity-70"
                                style={{
                                    color:
                                        "var(--muted)",
                                }}
                            >
                                ×
                            </button>
                        </div>

                        {/* FORM */}

                        <form
                            onSubmit={
                                handleUpdateProfile
                            }
                            className="mt-6 space-y-5"
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
                                    value={
                                        editForm.fullName
                                    }
                                    onChange={
                                        handleEditChange
                                    }
                                    required
                                    className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2"
                                    style={{
                                        backgroundColor:
                                            "var(--input)",
                                        color:
                                            "var(--foreground)",
                                        borderColor:
                                            "var(--border)",
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
                                    value={
                                        editForm.bio
                                    }
                                    onChange={
                                        handleEditChange
                                    }
                                    rows="4"
                                    placeholder="Tell people about yourself..."
                                    className="w-full resize-none rounded-lg border px-4 py-3 outline-none focus:ring-2"
                                    style={{
                                        backgroundColor:
                                            "var(--input)",
                                        color:
                                            "var(--foreground)",
                                        borderColor:
                                            "var(--border)",
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

                                <div className="flex items-center overflow-hidden rounded-lg border"
                                    style={{
                                        backgroundColor:
                                            "var(--input)",
                                        borderColor:
                                            "var(--border)",
                                    }}
                                >
                                    <span
                                        className="px-3"
                                        style={{
                                            color:
                                                "var(--muted)",
                                        }}
                                    >
                                        github.com/
                                    </span>

                                    <input
                                        id="githubUsername"
                                        name="githubUsername"
                                        type="text"
                                        value={
                                            editForm.githubUsername
                                        }
                                        onChange={
                                            handleEditChange
                                        }
                                        className="min-w-0 flex-1 bg-transparent px-2 py-3 outline-none"
                                        style={{
                                            color:
                                                "var(--foreground)",
                                        }}
                                    />
                                </div>
                            </div>

                            {/* ERROR */}

                            {error && (
                                <p
                                    className="text-sm"
                                    style={{
                                        color:
                                            "var(--danger)",
                                    }}
                                >
                                    {error}
                                </p>
                            )}

                            {/* ACTIONS */}

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    disabled={
                                        editLoading
                                    }
                                    onClick={() =>
                                        setIsEditOpen(
                                            false
                                        )
                                    }
                                    className="rounded-lg border px-5 py-2.5 font-medium hover:opacity-80 disabled:opacity-50"
                                    style={{
                                        borderColor:
                                            "var(--border)",
                                        backgroundColor:
                                            "var(--background)",
                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={
                                        editLoading
                                    }
                                    className="rounded-lg px-5 py-2.5 font-medium disabled:cursor-not-allowed disabled:opacity-50"
                                    style={{
                                        backgroundColor:
                                            "var(--primary)",
                                        color:
                                            "var(--primary-foreground)",
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