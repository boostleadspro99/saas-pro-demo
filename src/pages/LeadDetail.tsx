import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Phone, MessageCircle, Calendar, 
  FileText, Plus, Loader2, User, Mail, Clock 
} from "lucide-react";
import { Lead, LeadActivity, LeadStatus } from "../types";
import { getLeadById, getLeadActivities, updateLeadStatus, addLeadActivity } from "../lib/leads";

export default function LeadDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [lead, setLead] = useState<Lead | null>(null);
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [noteContent, setNoteContent] = useState("");
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    if (id) {
      fetchLeadData(id);
    }
  }, [id]);

  const fetchLeadData = async (leadId: string) => {
    setLoading(true);
    try {
      const [leadData, activitiesData] = await Promise.all([
        getLeadById(leadId),
        getLeadActivities(leadId)
      ]);
      
      if (!leadData) {
        navigate('/dashboard/leads');
        return;
      }
      
      setLead(leadData);
      setActivities(activitiesData);
    } catch (error) {
      console.error("Erreur lors du chargement du lead:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: LeadStatus) => {
    if (!lead) return;
    setIsUpdatingStatus(true);
    try {
      await updateLeadStatus(lead.id, newStatus);
      setLead({ ...lead, status: newStatus });
      
      // Ajouter une activité automatique
      const newActivity = await addLeadActivity(
        lead.id, 
        'note', 
        `Statut mis à jour : ${newStatus}`
      );
      setActivities([newActivity, ...activities]);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead || !noteContent.trim()) return;
    
    setIsSubmittingNote(true);
    try {
      const newActivity = await addLeadActivity(lead.id, 'note', noteContent);
      setActivities([newActivity, ...activities]);
      setNoteContent("");
    } catch (error) {
      console.error("Erreur lors de l'ajout de la note:", error);
    } finally {
      setIsSubmittingNote(false);
    }
  };

  const handleActionClick = async (type: 'call' | 'whatsapp' | 'appointment') => {
    if (!lead) return;
    
    let content = "";
    if (type === 'call') content = "Appel téléphonique effectué.";
    if (type === 'whatsapp') content = "Message WhatsApp envoyé.";
    if (type === 'appointment') content = "Rendez-vous proposé/créé.";

    try {
      const newActivity = await addLeadActivity(lead.id, type, content);
      setActivities([newActivity, ...activities]);
      
      // Actions réelles
      if (type === 'call') {
        window.location.href = `tel:${lead.phone}`;
      } else if (type === 'whatsapp') {
        const cleanPhone = lead.phone.replace(/[^0-9+]/g, '');
        window.open(`https://wa.me/${cleanPhone}`, '_blank');
      } else if (type === 'appointment') {
        // Rediriger vers la page des rendez-vous avec les infos du lead
        navigate('/dashboard/appointments', { 
          state: { 
            createFromLead: {
              lead_id: lead.id,
              name: lead.name,
              phone: lead.phone
            } 
          } 
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'action:", error);
    }
  };

  const getActivityIcon = (type: LeadActivity['type']) => {
    switch (type) {
      case 'call': return <Phone className="h-4 w-4 text-blue-500" />;
      case 'whatsapp': return <MessageCircle className="h-4 w-4 text-green-500" />;
      case 'appointment': return <Calendar className="h-4 w-4 text-secondary" />;
      case 'note': default: return <FileText className="h-4 w-4 text-slate-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }

  if (!lead) return null;

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="mb-6">
        <Link 
          to="/dashboard/leads" 
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-700 mb-4"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Retour aux leads
        </Link>
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{lead.name}</h1>
            <p className="mt-1 text-sm text-slate-500 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Reçu le {new Date(lead.created_at).toLocaleString('fr-FR')} via {lead.source}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center gap-3">
            <select
              value={lead.status}
              onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
              disabled={isUpdatingStatus}
              className="block w-full rounded-md border-slate-300 py-2 pl-3 pr-10 text-sm focus:border-secondary focus:outline-none focus:ring-secondary border font-medium bg-white shadow-sm"
            >
              <option value="nouveau">Nouveau</option>
              <option value="contacté">Contacté</option>
              <option value="rdv pris">RDV Pris</option>
              <option value="visité">Visité</option>
              <option value="plan proposé">Plan Proposé</option>
              <option value="accepté">Accepté</option>
              <option value="refusé">Refusé</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne de gauche : Infos & Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Actions rapides */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">Actions Rapides</h2>
            <div className="space-y-3">
              <button 
                onClick={() => handleActionClick('call')}
                className="w-full flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-colors"
              >
                <Phone className="h-4 w-4 text-blue-600" />
                Appeler
              </button>
              <button 
                onClick={() => handleActionClick('whatsapp')}
                className="w-full flex items-center justify-center gap-2 rounded-md border border-transparent bg-[#25D366] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#128C7E] focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </button>
              <button 
                onClick={() => handleActionClick('appointment')}
                className="w-full flex items-center justify-center gap-2 rounded-md border border-transparent bg-secondary px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-colors"
              >
                <Calendar className="h-4 w-4" />
                Créer Rendez-vous
              </button>
            </div>
          </div>

          {/* Coordonnées */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">Coordonnées</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 font-medium">Nom complet</p>
                  <p className="text-sm font-medium text-slate-900">{lead.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 font-medium">Téléphone</p>
                  <a href={`tel:${lead.phone}`} className="text-sm font-medium text-secondary hover:text-secondary-dark">
                    {lead.phone}
                  </a>
                </div>
              </div>
              {lead.email && (
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Email</p>
                    <a href={`mailto:${lead.email}`} className="text-sm font-medium text-secondary hover:text-secondary-dark">
                      {lead.email}
                    </a>
                  </div>
                </div>
              )}
              {lead.reason && (
                <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                  <FileText className="h-5 w-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Motif de consultation</p>
                    <p className="text-sm text-slate-900 mt-1">{lead.reason}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Colonne de droite : Activités & Notes */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-5 border-b border-slate-200 bg-slate-50/50">
              <h2 className="text-base font-semibold text-slate-900">Historique & Notes</h2>
            </div>
            
            {/* Formulaire d'ajout de note */}
            <div className="p-5 border-b border-slate-200 bg-white">
              <form onSubmit={handleAddNote}>
                <label htmlFor="note" className="sr-only">Ajouter une note</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    id="note"
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="Saisissez une note sur ce prospect..."
                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-secondary focus:ring-secondary sm:text-sm border py-2 px-3"
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingNote || !noteContent.trim()}
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                  >
                    {isSubmittingNote ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-1" />}
                    Ajouter
                  </button>
                </div>
              </form>
            </div>

            {/* Liste des activités */}
            <div className="p-5 flex-1 overflow-y-auto bg-slate-50/30">
              {activities.length === 0 ? (
                <div className="text-center py-10">
                  <FileText className="mx-auto h-8 w-8 text-slate-300" />
                  <p className="mt-2 text-sm text-slate-500">Aucune activité pour le moment.</p>
                </div>
              ) : (
                <div className="flow-root">
                  <ul role="list" className="-mb-8">
                    {activities.map((activity, activityIdx) => (
                      <li key={activity.id}>
                        <div className="relative pb-8">
                          {activityIdx !== activities.length - 1 ? (
                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="h-8 w-8 rounded-full bg-white border border-slate-200 flex items-center justify-center ring-8 ring-white shadow-sm">
                                {getActivityIcon(activity.type)}
                              </span>
                            </div>
                            <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                              <div>
                                <p className="text-sm text-slate-600">{activity.content}</p>
                              </div>
                              <div className="whitespace-nowrap text-right text-xs text-slate-400">
                                {new Date(activity.created_at).toLocaleString('fr-FR', { 
                                  day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' 
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
