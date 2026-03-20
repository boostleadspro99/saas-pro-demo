import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { Stethoscope, LogIn, LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import Chatbot from "../components/Chatbot";

export default function MainLayout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const isHomePage = location.pathname === "/";

  if (isHomePage) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <main className="flex-1 flex flex-col">
          <Outlet />
        </main>
        <Chatbot />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center gap-2 text-primary font-semibold text-lg">
                <Stethoscope className="h-6 w-6" />
                <span>DentalCare</span>
              </Link>
            </div>
            <nav className="flex space-x-4 items-center">
              <Link
                to="/book"
                className="text-primary hover:text-primary-light px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Prendre Rendez-vous
              </Link>

              {user && (
                <Link
                  to="/dashboard"
                  className="text-slate-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              )}
              
              {user ? (
                <button
                  onClick={handleLogout}
                  className="text-slate-600 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </button>
              ) : (
                <Link
                  to="/login"
                  className="text-slate-500 hover:text-slate-700 px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1 transition-colors"
                  title="Accès Administrateur"
                >
                  <LogIn className="h-4 w-4" />
                  Admin
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} DentalCare Clinic. Tous droits réservés.
        </div>
      </footer>
      <Chatbot />
    </div>
  );
}
