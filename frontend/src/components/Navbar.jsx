
import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  useState,
  useEffect,
  useCallback,
} from "react";

import {
  Bell,
  Menu,
  X,
  UserRound,
  LogOut,
  Home,
  Compass,
  PlusSquare,
  Sun,
  Moon,
} from "lucide-react";

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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

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
      console.error("Failed to fetch unread notifications:", error);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setUnreadCount(0);
      return;
    }

    fetchUnreadCount();

    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, [user, fetchUnreadCount]);

  const closeMenus = () => {
    setMobileOpen(false);
    setProfileOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      closeMenus();
      setUnreadCount(0);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleProfile = () => {
    closeMenus();

    if (user?.username) {
      navigate(`/profile/${user.username}`);
    } else {
      navigate("/profile");
    }
  };

  const handleNotifications = () => {
    closeMenus();
    navigate("/notifications");
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
      isActive
        ? "bg-[var(--surface)]"
        : "hover:bg-[var(--surface)]"
    }`;

  const navLinkStyle = ({ isActive }) => ({
    color: isActive ? "var(--foreground)" : "var(--muted)",
  });

  const NotificationButton = () => (
    <button
      type="button"
      onClick={handleNotifications}
      className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition hover:opacity-80"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--surface)",
        color: "var(--foreground)",
      }}
      aria-label={`Notifications${
        unreadCount > 0 ? `, ${unreadCount} unread` : ""
      }`}
      title="Notifications"
    >
      <Bell size={21} />

      {unreadCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </button>
  );

  const ThemeButton = () => (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--surface)",
        color: "var(--foreground)",
      }}
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        backgroundColor: "var(--background)",
        borderColor: "var(--border)",
      }}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">

        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenus}
          className="shrink-0 text-2xl font-bold"
          style={{ color: "var(--foreground)" }}
        >
          CodeHub
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-5 md:flex">
          <NavLink to="/" className={navLinkClass} style={navLinkStyle}>
            Home
          </NavLink>

          <NavLink to="/explore" className={navLinkClass} style={navLinkStyle}>
            Explore
          </NavLink>

          {user && (
            <NavLink
              to="/create-project"
              className={navLinkClass}
              style={navLinkStyle}
            >
              Create Project
            </NavLink>
          )}

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

          {user && (
            <>
              <NotificationButton />

              {/* Desktop Profile Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen((prev) => !prev)}
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
                      {user?.username?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  )}

                  Profile <span className="text-xs">▾</span>
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
            </>
          )}

          <ThemeButton />
        </div>

        {/* Mobile Right Side: Bell + Hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          {user && <NotificationButton />}

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--surface)",
              color: "var(--foreground)",
            }}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {mobileOpen && (
        <div
          className="border-t px-4 py-4 md:hidden sm:px-6"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-2">

            <NavLink
              to="/"
              onClick={closeMenus}
              className={navLinkClass}
              style={navLinkStyle}
            >
              <Home size={18} /> Home
            </NavLink>

            <NavLink
              to="/explore"
              onClick={closeMenus}
              className={navLinkClass}
              style={navLinkStyle}
            >
              <Compass size={18} /> Explore
            </NavLink>

            {user && (
              <>
                <NavLink
                  to="/create-project"
                  onClick={closeMenus}
                  className={navLinkClass}
                  style={navLinkStyle}
                >
                  <PlusSquare size={18} /> Create Project
                </NavLink>

                <button
                  type="button"
                  onClick={handleProfile}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium hover:bg-[var(--surface)]"
                  style={{ color: "var(--foreground)" }}
                >
                  <UserRound size={18} /> View Profile
                </button>

                <button
                  type="button"
                  onClick={handleNotifications}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium hover:bg-[var(--surface)]"
                  style={{ color: "var(--foreground)" }}
                >
                  <Bell size={18} />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium"
                  style={{ color: "var(--danger)" }}
                >
                  <LogOut size={18} /> Logout
                </button>
              </>
            )}

            {!user && (
              <>
                <Link
                  to="/login"
                  onClick={closeMenus}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium"
                  style={{ color: "var(--foreground)" }}
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenus}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium"
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "var(--primary-foreground)",
                  }}
                >
                  Register
                </Link>
              </>
            )}

            {/* Theme Toggle in Mobile Menu */}
            <div
              className="mt-2 flex items-center justify-between border-t pt-3"
              style={{ borderColor: "var(--border)" }}
            >
              <span
                className="text-sm font-medium"
                style={{ color: "var(--foreground)" }}
              >
                Appearance
              </span>

              <ThemeButton />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;