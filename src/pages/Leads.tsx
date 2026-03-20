import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Phone, Calendar, Loader2, ArrowRight, X, UserPlus } from "lucide-react";
import { Lead, LeadStatus } from "../types";
import { getLeads, createLead } from "../lib/leads";
import EmptyState from "../components/EmptyState";

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'tous'>('tous');
  const [dateFilter, setDateFilter] = useState<'tous' | 'aujourdhui' | 'cette_semaine' | 'ce_mois'>('tous');
  const [searchQuery, setSearchQuery] = useState("");

  const [isAddingLead, setIsAddingLead] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newLead, setNewLead] = useState({
    name: "",
    phone: "",
    email: "",
    source: "Site Web",
    reason: ""
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    const data = await getLeads();
    setLeads(data);
    setLoading(false);
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const addedLead = await createLead({
        name: newLead.name,
        phone: newLead.phone,
        email: newLead.email || undefined,
        source: newLead.source,
        reason: newLead.reason || undefined,
        status: 'nouveau'
      });
      setLeads([addedLead, ...leads]);
      setIsAddingLead(false);
      setNewLead({ name: "", phone: "", email: "", source: "Site Web", reason: "" });
    } catch (error) {
      console.error("Erreur lors de la création du lead:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesStatus = statusFilter === 'tous' || lead.status === statusFilter;
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          lead.phone.includes(searchQuery);
    
    let matchesDate = true;
    if (dateFilter !== 'tous') {
      const leadDate = new Date(lead.created_at);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dateFilter === 'aujourdhui') {
        matchesDate = leadDate >= today;
      } else if (dateFilter === 'cette_semaine') {
        const firstDayOfWeek = new Date(today);
        firstDayOfWeek.setDate(today.getDate() - today.getDay() + 1);
        matchesDate = leadDate >= firstDayOfWeek;
      } else if (dateFilter === 'ce_mois') {
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        matchesDate = leadDate >= firstDayOfMonth;
      }
    }

    return matchesStatus && matchesSearch && matchesDate;
  });

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'nouveau':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Nouveau</span>;
      case 'contacté':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Contacté</span>;
      case 'rdv pris':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary-dark">RDV Pris</span>;
      case 'visité':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Visité</span>;
      case 'plan proposé':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">Plan Proposé</span>;
      case 'accepté':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Accepté</span>;
      case 'refusé':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Refusé</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestion des Leads</h1>
          <p className="mt-1 text-sm text-slate-500">
            Consultez et gérez vos prospects avant de les convertir en patients.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button 
            onClick={() => setIsAddingLead(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-secondary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 sm:w-auto"
          >
            Ajouter un lead
          </button>
        </div>
      </div>
      
      <div className="mt-8 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Filtres */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un nom ou téléphone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-md border-slate-300 pl-10 focus:border-secondary focus:ring-secondary sm:text-sm border py-2"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as LeadStatus | 'tous')}
                className="block w-full rounded-md border-slate-300 py-2 pl-3 pr-10 text-base focus:border-secondary focus:outline-none focus:ring-secondary sm:text-sm border"
              >
                <option value="tous">Tous les statuts</option>
                <option value="nouveau">Nouveau</option>
                <option value="contacté">Contacté</option>
                <option value="rdv pris">RDV Pris</option>
                <option value="visité">Visité</option>
                <option value="plan proposé">Plan Proposé</option>
                <option value="accepté">Accepté</option>
                <option value="refusé">Refusé</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as any)}
                className="block w-full rounded-md border-slate-300 py-2 pl-3 pr-10 text-base focus:border-secondary focus:outline-none focus:ring-secondary sm:text-sm border"
              >
                <option value="tous">Toutes les dates</option>
                <option value="aujourdhui">Aujourd'hui</option>
                <option value="cette_semaine">Cette semaine</option>
                <option value="ce_mois">Ce mois-ci</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tableau */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-secondary mx-auto" />
              <p className="mt-2 text-sm text-slate-500">Chargement des leads...</p>
            </div>
          ) : filteredLeads.length === 0 ? (
            <EmptyState 
              title="Aucun lead trouvé" 
              description="Essayez de modifier vos filtres ou ajoutez un nouveau lead."
              icon={<UserPlus className="h-12 w-12 text-slate-300" />}
            />
          ) : (
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6">Nom</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Téléphone</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Source</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Statut</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Date</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 sm:pl-6">
                      {lead.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        {lead.phone}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                      {lead.source}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      {getStatusBadge(lead.status)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {new Date(lead.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <Link 
                        to={`/dashboard/leads/${lead.id}`}
                        className="inline-flex items-center gap-1 text-secondary hover:text-secondary-dark bg-secondary/10 hover:bg-secondary/20 px-3 py-1.5 rounded-md transition-colors"
                      >
                        Voir <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal d'ajout de Lead */}
      {isAddingLead && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Nouveau Lead</h3>
              <button onClick={() => setIsAddingLead(false)} className="text-slate-400 hover:text-slate-500">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddLead} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Nom complet *</label>
                <input 
                  type="text" 
                  required 
                  value={newLead.name} 
                  onChange={e => setNewLead({...newLead, name: e.target.value})} 
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 focus:border-secondary focus:ring-secondary sm:text-sm" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Téléphone *</label>
                <input 
                  type="tel" 
                  required 
                  value={newLead.phone} 
                  onChange={e => setNewLead({...newLead, phone: e.target.value})} 
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 focus:border-secondary focus:ring-secondary sm:text-sm" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <input 
                  type="email" 
                  value={newLead.email} 
                  onChange={e => setNewLead({...newLead, email: e.target.value})} 
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 focus:border-secondary focus:ring-secondary sm:text-sm" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Source *</label>
                <select 
                  value={newLead.source} 
                  onChange={e => setNewLead({...newLead, source: e.target.value})} 
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 focus:border-secondary focus:ring-secondary sm:text-sm"
                >
                  <option value="Site Web">Site Web</option>
                  <option value="Google Ads">Google Ads</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Recommandation">Recommandation</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Motif (optionnel)</label>
                <textarea 
                  value={newLead.reason} 
                  onChange={e => setNewLead({...newLead, reason: e.target.value})} 
                  rows={2} 
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 focus:border-secondary focus:ring-secondary sm:text-sm" 
                />
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsAddingLead(false)} 
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting || !newLead.name || !newLead.phone} 
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-secondary border border-transparent rounded-md hover:bg-secondary-dark disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
