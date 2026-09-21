import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useState, useEffect, useCallback } from "react";
import { Bell } from "lucide-react";

import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

import {
  getUnreadNotificationCount,
} from "../services/notification.service";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread notification count
  const fetchUnreadCount = useCallback(async () => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    try {
      const response = await getUnreadNotificationCount();

      const count =
        response?.data?.unreadCount ??
        response?.unreadCount ??
        response?.data?.count ??
        response?.count ??
        0;

      setUnreadCount(Number(count) || 0);
    } catch (error) {
      console.error(
        "Failed to fetch unread notifications:",
        error
      );
    }
  }, [user]);

  // Initial fetch + refresh every 30 seconds
  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    fetchUnreadCount();

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [user, fetchUnreadCount]);

  const handleLogout = async () => {
    try {
      await logout();
      setProfileOpen(false);
      setUnreadCount(0);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleProfile = () => {
    setProfileOpen(false);

    if (user?.username) {
      navigate(`/profile/${user.username}`);
    } else {
      navigate("/profile");
    }
  };

  return (
    <header
      className="border-b"
      style={{
        backgroundColor: "var(--background)",
        borderColor: "var(--border)",
      }}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold"
          style={{ color: "var(--foreground)" }}
        >
          CodeHub
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-6">

          <NavLink
            to="/"
            className="text-sm font-medium"
            style={{ color: "var(--foreground)" }}
          >
            Home
          </NavLink>

          <NavLink
            to="/explore"
            className="text-sm font-medium"
            style={{ color: "var(--muted)" }}
          >
            Explore
          </NavLink>

          {user && (
            <NavLink
              to="/create-project"
              className="text-sm font-medium"
              style={{ color: "var(--muted)" }}
            >
              Create Project
            </NavLink>
          )}

          {/* Login / Register */}
          {!user && (
            <>
              <Link
                to="/login"
                className="text-sm font-medium"
                style={{ color: "var(--muted)" }}
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-lg px-4 py-2 text-sm font-medium"
                style={{
                  backgroundColor: "var(--primary)",
                  color: "var(--primary-foreground)",
                }}
              >
                Register
              </Link>
            </>
          )}

          {/* Notification Bell */}
          {user && (
            <button
              type="button"
              onClick={() => navigate("/notifications")}
              className="relative flex h-10 w-10 items-center justify-center rounded-lg border transition hover:opacity-80"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--surface)",
                color: "var(--foreground)",
              }}
              aria-label={`Notifications${
                unreadCount > 0
                  ? `, ${unreadCount} unread`
                  : ""
              }`}
              title="Notifications"
            >
              <Bell size={21} />

              {unreadCount > 0 && (
                <span
                  className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white"
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>
          )}

          {/* Profile Button */}
          {user && (
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setProfileOpen((prev) => !prev)
                }
                className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium"
                style={{
                  backgroundColor: "var(--surface)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              >
                {user?.avatar?.url ? (
                  <img
                    src={user.avatar.url}
                    alt="Profile"
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-700 text-xs text-white">
                    {user?.username
                      ?.charAt(0)
                      .toUpperCase() || "U"}
                  </span>
                )}

                <span>Profile</span>
                <span className="text-xs">▾</span>
              </button>

              {profileOpen && (
                <div
                  className="absolute right-0 top-12 z-50 w-48 rounded-xl border p-2 shadow-xl"
                  style={{
                    backgroundColor: "var(--background)",
                    borderColor: "var(--border)",
                  }}
                >
                  <button
                    type="button"
                    onClick={handleProfile}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                    style={{ color: "var(--foreground)" }}
                  >
                    👤 View Profile
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                    style={{ color: "var(--danger)" }}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-lg border"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--surface)",
              color: "var(--foreground)",
            }}
            aria-label="Toggle theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;