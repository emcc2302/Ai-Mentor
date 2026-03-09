import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ChevronRight, LogOut } from "lucide-react";
import API_BASE_URL from "../lib/api";
import { useSidebar } from "../context/SidebarContext";

const Sidebar = ({ activePage = "dashboard" }) => {
  const { sidebarOpen, setSidebarOpen, sidebarCollapsed, setSidebarCollapsed } = useSidebar();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [navigationItems, setNavigationItems] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    setProfilePopupOpen(false);
    navigate("/login", { state: { logoutSuccess: true } });
  };

  const displayName = user?.name || user?.email?.split('@')[0] || "User";
  const userEmail = user?.email || "";

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    let isMounted = true;
    const fetchNavigationItems = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const response = await fetch(`${API_BASE_URL}/api/sidebar/navigation`, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
        if (!response.ok) return;
        const data = await response.json();
        if (isMounted) setNavigationItems(data);
      } catch (error) { console.error("Error:", error); }
    };
    fetchNavigationItems();
    return () => { isMounted = false; };
  }, []);

  return (
    <>
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-[340px] mx-4 p-8 flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-5">
              <LogOut className="w-7 h-7 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Log Out?</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-7">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-all shadow-lg shadow-red-500/30"
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`fixed lg:fixed top-18.5 left-0 z-[70] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 transform transition-all duration-500 ease-out lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} ${sidebarCollapsed ? "lg:w-20" : "lg:w-72"} w-72 h-[calc(100vh-4rem)] overflow-visible`}>
        
        <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="hidden lg:flex absolute -right-4 top-8 w-8 h-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-full items-center justify-center hover:bg-teal-500 hover:text-white transition-all shadow-md z-[80]">
          <ChevronRight className={`w-5 h-5 transition-transform duration-500 ${sidebarCollapsed ? "" : "rotate-180"}`} />
        </button>

        <nav className={`mt-6 px-3 h-[calc(100vh-16rem)] scrollbar-hide ${sidebarCollapsed ? "overflow-visible" : "overflow-y-auto"}`}>
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <div key={item.id} onClick={() => navigate(item.path)} className={`group relative flex items-center px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 ${sidebarCollapsed ? "justify-center" : ""} ${isActive ? "bg-teal-50 dark:bg-teal-900/30" : "hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
                  <img src={item.icon} alt={item.label} className={`w-5 h-5 shrink-0 ${isActive ? "brightness-0 saturate-100" : "opacity-60"}`} style={isActive ? {filter: "invert(47%) sepia(98%) saturate(400%) hue-rotate(130deg) brightness(95%)"} : {}} />
                  {!sidebarCollapsed && <span className={`ml-3 text-sm font-semibold ${isActive ? "text-teal-600 dark:text-teal-400" : "text-slate-600 dark:text-slate-300"}`}>{item.label}</span>}
                  {sidebarCollapsed && (
                    <div className="absolute left-full ml-4 px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all shadow-xl z-50 whitespace-nowrap">{item.label}</div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* --- BOTTOM PROFILE (always visible) --- */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          {!sidebarCollapsed ? (
            <div className="p-4">
              {/* Card with border */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-3 bg-white dark:bg-slate-800">
                {/* Avatar row */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-sm leading-none">{getInitials(displayName)}</span>
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-sm font-semibold text-slate-800 dark:text-white truncate">{displayName}</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 truncate">{userEmail}</span>
                  </div>
                </div>
                {/* Log Out button */}
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-sm font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center cursor-pointer" title={`${displayName} — Log Out`} onClick={() => setShowLogoutModal(true)}>
                <span className="text-white font-bold text-sm leading-none">{getInitials(displayName)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;