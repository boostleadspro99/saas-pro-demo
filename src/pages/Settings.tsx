import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Save, Link as LinkIcon, Loader2 } from "lucide-react";
import { getSettings, updateSettings, Settings as SettingsType } from "../lib/settings";

export default function Settings() {
  const [settings, setSettings] = useState<SettingsType | null>(null);
  const [formData, setFormData] = useState({
    cabinet_name: "",
    phone: "",
    email: "",
    address: "",
    whatsapp_link: "",
    google_review_link: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const data = await getSettings();
      setSettings(data);
      setFormData({
        cabinet_name: data.cabinet_name || "",
        phone: data.phone || "",
        email: data.email || "",
        address: data.address || "",
        whatsapp_link: data.whatsapp_link || "",
        google_review_link: data.google_review_link || "",
      });
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await updateSettings(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <SettingsIcon className="h-6 w-6 text-secondary" />
          Paramètres
        </h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Informations du Cabinet</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nom du cabinet</label>
                <input type="text" value={formData.cabinet_name} onChange={(e) => setFormData({...formData, cabinet_name: e.target.value})} className="block w-full border border-slate-300 rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Téléphone</label>
                <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="block w-full border border-slate-300 rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="block w-full border border-slate-300 rounded-lg p-2" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Adresse</label>
                <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="block w-full border border-slate-300 rounded-lg p-2" />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Liens Externes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Lien WhatsApp</label>
                <input type="url" value={formData.whatsapp_link} onChange={(e) => setFormData({...formData, whatsapp_link: e.target.value})} className="block w-full border border-slate-300 rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Lien Avis Google</label>
                <input type="url" value={formData.google_review_link} onChange={(e) => setFormData({...formData, google_review_link: e.target.value})} className="block w-full border border-slate-300 rounded-lg p-2" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          {saveSuccess && (
            <span className="text-sm text-secondary font-medium">
              Paramètres enregistrés avec succès !
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
