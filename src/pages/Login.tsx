import React, { useState, useEffect } from "react";
import { Link, useNavigate, Navigate, useLocation } from "react-router-dom";
import { Stethoscope, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { signIn, signOut, signUp } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(location.state?.error || null);
  const [success, setSuccess] = useState<string | null>(null);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;

  // Effacer l'erreur de l'historique une fois affichée
  useEffect(() => {
    if (location.state?.error) {
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Si déjà connecté et que c'est bien l'admin, rediriger vers le dashboard
  if (user) {
    if (!adminEmail || user.email?.toLowerCase() === adminEmail.toLowerCase()) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      if (mode === 'signup') {
        // Vérification que seul l'admin peut se créer un compte
        if (adminEmail && email.toLowerCase() !== adminEmail.toLowerCase()) {
          throw new Error(`Seul l'email administrateur configuré (${adminEmail}) peut créer un compte ici.`);
        }
        
        const data = await signUp(email, password);
        
        if (data.user && !data.session) {
          setSuccess("Compte créé avec succès ! Si Supabase exige une confirmation, veuillez vérifier vos emails. Sinon, vous pouvez vous connecter.");
          setMode('signin');
        } else if (data.session) {
          navigate("/dashboard");
        }
      } else {
        const data = await signIn(email, password);
        
        // Vérification stricte de l'email admin après connexion (insensible à la casse)
        if (adminEmail && data.user?.email?.toLowerCase() !== adminEmail.toLowerCase()) {
          await signOut();
          throw new Error("Accès refusé : ce compte n'a pas les droits d'administration.");
        }
        
        navigate("/dashboard");
      }
    } catch (err: any) {
      if (err.message === "Invalid login credentials") {
        setError("Identifiants incorrects. Si vous n'avez pas encore créé ce compte dans Supabase Auth, cliquez sur 'Créer le compte administrateur' ci-dessous.");
      } else if (err.message === "User already registered") {
        setError("Ce compte existe déjà. Veuillez vérifier votre mot de passe.");
      } else {
        setError(err.message || "Une erreur est survenue.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-secondary/10 p-3 rounded-full">
            <Stethoscope className="h-8 w-8 text-secondary" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
          Accès Administrateur
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Espace réservé au personnel du cabinet.{" "}
          <Link to="/" className="font-medium text-secondary hover:text-secondary-dark">
            Retour à l'accueil
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-xl sm:px-10 border border-slate-100">
          
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-start gap-3 text-sm">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 bg-secondary/10 border border-secondary/20 text-secondary-dark px-4 py-3 rounded-md flex items-start gap-3 text-sm">
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Adresse email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full appearance-none rounded-md border border-slate-300 px-3 py-2 placeholder-slate-400 shadow-sm focus:border-secondary focus:outline-none focus:ring-secondary sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Mot de passe
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={mode === 'signin' ? "current-password" : "new-password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full appearance-none rounded-md border border-slate-300 px-3 py-2 placeholder-slate-400 shadow-sm focus:border-secondary focus:outline-none focus:ring-secondary sm:text-sm"
                />
              </div>
            </div>

            {mode === 'signin' && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-secondary focus:ring-secondary"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900">
                    Se souvenir de moi
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-secondary hover:text-secondary-dark">
                    Mot de passe oublié ?
                  </a>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center items-center gap-2 rounded-md border border-transparent bg-secondary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {mode === 'signin' ? "Connexion en cours..." : "Création en cours..."}
                  </>
                ) : (
                  mode === 'signin' ? "Se connecter" : "Créer le compte"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin');
                setError(null);
                setSuccess(null);
              }}
              className="text-sm font-medium text-secondary hover:text-secondary-dark"
            >
              {mode === 'signin' 
                ? "Première visite ? Créer le compte administrateur" 
                : "Déjà un compte ? Se connecter"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
