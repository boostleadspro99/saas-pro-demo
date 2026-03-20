import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Contact, 
  CreditCard, 
  Menu, 
  X, 
  LogOut, 
  Stethoscope,
  UserCircle,
  KanbanSquare,
  BellRing,
  Settings as SettingsIcon
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { clsx } from "clsx";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Leads", href: "/dashboard/leads", icon: Contact },
  { name: "Pipeline", href: "/dashboard/pipeline", icon: KanbanSquare },
  { name: "Relances", href: "/dashboard/follow-ups", icon: BellRing },
  { name: "Rendez-vous", href: "/dashboard/appointments", icon: Calendar },
  { name: "Patients", href: "/dashboard/patients", icon: Users },
  { name: "Paiements", href: "/dashboard/payments", icon: CreditCard },
  { name: "Paramètres", href: "/dashboard/settings", icon: SettingsIcon },
];

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={clsx(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200">
          <Link to="/" className="flex items-center gap-2 text-primary font-semibold text-lg">
            <Stethoscope className="h-6 w-6" />
            <span>DentalCare</span>
          </Link>
          <button 
            className="lg:hidden text-slate-500 hover:text-slate-700"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary/5 text-primary" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon className={clsx("h-5 w-5", isActive ? "text-primary" : "text-slate-400")} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 rounded-lg bg-slate-50">
            <UserCircle className="h-5 w-5 text-slate-400" />
            <span className="truncate">{user?.email || "Utilisateur"}</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0">
          <button
            className="lg:hidden text-slate-500 hover:text-slate-700"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex-1 flex justify-end items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              Connecté
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
