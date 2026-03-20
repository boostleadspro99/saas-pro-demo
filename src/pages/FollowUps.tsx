import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, Mail, AlertCircle, CalendarX, ClipboardX, UserX, Loader2, CheckCircle2, MessageSquare } from "lucide-react";
import { Lead, Appointment, TreatmentPlan, Patient, MessageTemplate } from "../types";
import { getLeads, addLeadActivity } from "../lib/leads";
import { getAppointments } from "../lib/appointments";
import { getPatients, addPatientNote } from "../lib/patients";
import { getAllPlans } from "../lib/plans";
import { getMessageTemplates } from "../lib/templates";
import EmptyState from "../components/EmptyState";

type FollowUpItem = {
  id: string;
  type: 'no_show' | 'plan_pending' | 'lead_unresponsive';
  name: string;
  phone: string;
  email?: string;
  reason: string;
  date: string;
  leadId?: string;
  patientId?: string;
  amount?: number;
};

export default function FollowUps() {
  const [items, setItems] = useState<FollowUpItem[]>([]);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leadsData, apptsData, patientsData, plansData, templatesData] = await Promise.all([
        getLeads(),
        getAppointments(),
        getPatients(),
        getAllPlans(),
        getMessageTemplates()
      ]);

      setTemplates(templatesData);

      const followUps: FollowUpItem[] = [];
      const today = new Date();
      const twoDaysAgo = new Date(today);
      twoDaysAgo.setDate(today.getDate() - 2);

      // 1. Leads non répondus (nouveau ou contacté depuis plus de 2 jours)
      leadsData.forEach(lead => {
        if ((lead.status === 'nouveau' || lead.status === 'contacté') && new Date(lead.created_at) < twoDaysAgo) {
          followUps.push({
            id: `lead_${lead.id}`,
            type: 'lead_unresponsive',
            name: lead.name,
            phone: lead.phone,
            email: lead.email,
            reason: 'Lead sans réponse depuis 48h',
            date: lead.created_at,
            leadId: lead.id
          });
        }
      });

      // 2. RDV non honorés (statut annulé)
      apptsData.forEach(app => {
        if (app.status === 'annulé') {
          // Find patient or lead to get email if possible
          const patient = patientsData.find(p => p.id === app.patient_id);
          const lead = leadsData.find(l => l.id === app.lead_id);
          
          followUps.push({
            id: `appt_${app.id}`,
            type: 'no_show',
            name: app.name,
            phone: app.phone,
            email: patient?.email || lead?.email,
            reason: `RDV manqué le ${new Date(app.date).toLocaleDateString('fr-FR')}`,
            date: app.date,
            patientId: app.patient_id,
            leadId: app.lead_id
          });
        }
      });

      // 3. Plans non acceptés (statut proposé depuis plus de 3 jours)
      const threeDaysAgo = new Date(today);
      threeDaysAgo.setDate(today.getDate() - 3);
      
      plansData.forEach(plan => {
        if (plan.status === 'proposé' && new Date(plan.created_at) < threeDaysAgo) {
          const patient = patientsData.find(p => p.id === plan.patient_id);
          if (patient) {
            followUps.push({
              id: `plan_${plan.id}`,
              type: 'plan_pending',
              name: patient.name,
              phone: patient.phone,
              email: patient.email,
              reason: `Devis en attente (${plan.description})`,
              date: plan.created_at,
              patientId: patient.id,
              amount: plan.estimated_amount
            });
          }
        }
      });

      // Sort by date descending
      followUps.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setItems(followUps);

    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (item: FollowUpItem, channel: 'whatsapp' | 'email') => {
    setActionLoading(`${item.id}_${channel}`);
    
    try {
      // Find the right template
      let templateName = '';
      if (item.type === 'lead_unresponsive') templateName = 'Relance Lead Non Répondu';
      else if (item.type === 'no_show') templateName = 'Relance No-Show';
      else if (item.type === 'plan_pending') templateName = 'Relance Plan Non Accepté';

      const template = templates.find(t => t.name === templateName && t.type === channel);
      
      if (!template) {
        alert("Template introuvable pour cette action.");
        return;
      }

      // Replace variables
      const content = template.content.replace('{{name}}', item.name);
      
      // Log activity
      const logMessage = `Relance envoyée via ${channel === 'whatsapp' ? 'WhatsApp' : 'Email'} : ${item.reason}`;
      
      if (item.leadId) {
        await addLeadActivity(item.leadId, channel, logMessage);
      } else if (item.patientId) {
        await addPatientNote(item.patientId, logMessage);
      }

      // Remove from list optimistically or just show a success state
      // For a real app, we might want to change a status, but here we just log it.
      // Let's keep it in the list but maybe show a toast (we don't have a toast system, so we just open the link).

      // Open link
      if (channel === 'whatsapp') {
        const phone = item.phone.replace(/[^0-9+]/g, '');
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(content)}`;
        window.open(url, '_blank');
      } else if (channel === 'email' && item.email) {
        const subject = template.subject || 'Suivi de votre dossier';
        const url = `mailto:${item.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(content)}`;
        window.open(url, '_blank');
      }

    } catch (error) {
      console.error("Erreur lors de l'action:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const getIcon = (type: FollowUpItem['type']) => {
    switch (type) {
      case 'no_show': return <CalendarX className="h-5 w-5 text-red-500" />;
      case 'plan_pending': return <ClipboardX className="h-5 w-5 text-amber-500" />;
      case 'lead_unresponsive': return <UserX className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Relances à effectuer</h1>
        <p className="mt-1 text-sm text-slate-500">
          Récupérez du chiffre d'affaires en relançant les patients inactifs en un clic.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-secondary" />
          <h2 className="font-semibold text-slate-900">Opportunités de relance ({items.length})</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6">Patient / Lead</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Motif</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Valeur estimée</th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right text-sm font-semibold text-slate-900">
                  Actions rapides
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-secondary mx-auto" />
                    <p className="mt-2 text-sm text-slate-500">Recherche des opportunités...</p>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10">
                    <EmptyState 
                      title="Aucune relance"
                      description="Aucune relance en attente. Excellent travail !"
                      icon={<MessageSquare className="h-12 w-12 text-slate-300" />}
                    />
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                      <div className="flex items-center gap-3">
                        {getIcon(item.type)}
                        <div>
                          <div className="font-medium text-slate-900">{item.name}</div>
                          <div className="text-slate-500 text-xs mt-0.5">{item.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-600">
                      {item.reason}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-slate-900">
                      {item.amount ? item.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) : '-'}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleAction(item, 'whatsapp')}
                          disabled={actionLoading === `${item.id}_whatsapp`}
                          className="inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-[#25D366] hover:bg-[#128C7E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#25D366] disabled:opacity-50 transition-colors"
                          title="Relancer via WhatsApp"
                        >
                          {actionLoading === `${item.id}_whatsapp` ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <MessageCircle className="h-4 w-4 mr-1.5" />
                              WhatsApp
                            </>
                          )}
                        </button>
                        
                        <button
                          onClick={() => handleAction(item, 'email')}
                          disabled={!item.email || actionLoading === `${item.id}_email`}
                          className="inline-flex items-center justify-center px-3 py-1.5 border border-slate-300 text-xs font-medium rounded text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-50 transition-colors"
                          title={item.email ? "Relancer via Email" : "Pas d'email disponible"}
                        >
                          {actionLoading === `${item.id}_email` ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Mail className="h-4 w-4 mr-1.5" />
                              Email
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
