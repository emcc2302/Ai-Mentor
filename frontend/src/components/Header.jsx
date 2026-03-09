import React, { useState, useRef, useEffect } from "react";
import { Search, Bell, Menu, X, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import ThemeToggle from "../components/common/ThemeToggle";
import { useSidebar } from "../context/SidebarContext";

const Header = () => {
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Sync search input with URL param when navigating back to courses
  useEffect(() => {
    if (location.pathname === "/courses") {
      const params = new URLSearchParams(location.search);
      setSearchQuery(params.get("search") || "");
    } else {
      setSearchQuery("");
    }
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(`/courses?search=${encodeURIComponent(q)}`);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") handleSearch(e);
  };

  // ReferenceError se bachne ke liye displayName ko sabse upar define karein
  const displayName = user?.name || user?.email?.split('@')[0] || "User";

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    // LoginPage par "Logged out" popup dikhane ke liye state pass karein
    navigate("/login", { state: { logoutSuccess: true } });
  };

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Bahar click karne par dropdown band karne ka logic
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (window.innerWidth < 1024) {
          setSidebarOpen(false); // Mobile par sidebar bhi band karein
        }
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setSidebarOpen]);

  return (
    <header className="bg-card/80 backdrop-blur-xl border-b border-border/50 px-6 py-4 fixed top-0 left-0 right-0 z-[100]">
      <div className="flex items-center justify-between max-w-[1600px] mx-auto">
        
        {/* Mobile Menu & Logo */}
        <div className="flex items-center space-x-4">
          <button
            className="lg:hidden p-2 rounded-xl bg-card border border-border hover:bg-canvas-alt transition-all"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="w-5 h-5 text-muted" /> : <Menu className="w-5 h-5 text-muted" />}
          </button>
          
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/dashboard")}>
            {/* ✅ UPDATED: Yahan purana logo lagaya gaya hai */}
            <img
              src="/upto.png"
              alt="UptoSkills Logo"
              className="h-10 w-auto"
            />
          </div>
        </div>

        {/* Search Bar (Mobile par hidden) */}
        <div className="flex-1 max-w-md mx-8 hidden md:block">
          <form onSubmit={handleSearch} className="relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-teal-500 transition-colors w-4 h-4 cursor-pointer"
              onClick={handleSearch}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Try search programming courses ...."
              className="w-full pl-12 pr-4 py-2.5 bg-canvas border border-border rounded-2xl text-sm focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
            />
          </form>
        </div>

        {/* Action Buttons & Profile */}
        <div className="flex items-center space-x-5">
          <ThemeToggle />
          
          <div className="relative cursor-pointer p-2.5 hover:bg-canvas-alt rounded-xl transition-all group">
            <Bell className="w-5 h-5 text-muted group-hover:rotate-12 transition-transform" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-card" />
          </div>

          {/* PROFILE DROPDOWN SECTION */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={toggleDropdown}
              className="flex items-center space-x-3 p-1 pr-3 rounded-2xl hover:bg-canvas-alt transition-all border border-transparent hover:border-border group"
            >
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-sm leading-none">
                    {displayName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)}
                  </span>
                </div>
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 hidden lg:block">{displayName}</span>
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-[110] overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
                {/* Profile header */}
                <div className="flex items-center gap-3 p-4 border-b border-slate-100 dark:border-slate-700">
                  <div className="w-11 h-11 rounded-full bg-orange-500 flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-sm leading-none">
                      {displayName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user?.name || displayName}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{user?.email || ""}</p>
                  </div>
                </div>

                {/* Menu items */}
                <div className="p-2">
                  <button onClick={() => { navigate("/settings"); setDropdownOpen(false); }} className="flex items-center w-full gap-3 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all">
                    <User className="w-4 h-4 text-slate-400" /> My Account
                  </button>
                  <button onClick={() => { navigate("/settings"); setDropdownOpen(false); }} className="flex items-center w-full gap-3 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all">
                    <Settings className="w-4 h-4 text-slate-400" /> Settings
                  </button>
                  <div className="my-1 border-t border-slate-100 dark:border-slate-700" />
                  <button onClick={handleLogout} className="flex items-center w-full gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all">
                    <LogOut className="w-4 h-4" /> Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;