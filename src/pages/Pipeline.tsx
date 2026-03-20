import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Loader2, Phone, Calendar, ArrowRight, Inbox } from "lucide-react";
import { Lead, LeadStatus } from "../types";
import { getLeads, updateLeadStatus } from "../lib/leads";
import EmptyState from "../components/EmptyState";

const COLUMNS: { id: LeadStatus; title: string; color: string }[] = [
  { id: 'nouveau', title: 'Nouveau', color: 'bg-blue-50 border-blue-200' },
  { id: 'contacté', title: 'Contacté', color: 'bg-yellow-50 border-yellow-200' },
  { id: 'rdv pris', title: 'RDV Pris', color: 'bg-secondary/10 border-secondary/20' },
  { id: 'visité', title: 'Visité', color: 'bg-purple-50 border-purple-200' },
  { id: 'plan proposé', title: 'Plan Proposé', color: 'bg-indigo-50 border-indigo-200' },
  { id: 'accepté', title: 'Accepté', color: 'bg-green-50 border-green-200' },
  { id: 'refusé', title: 'Refusé', color: 'bg-red-50 border-red-200' },
];

export default function Pipeline() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    const data = await getLeads();
    setLeads(data);
    setLoading(false);
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedLeadId(id);
    e.dataTransfer.effectAllowed = "move";
    // Required for Firefox
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, newStatus: LeadStatus) => {
    e.preventDefault();
    if (!draggedLeadId) return;

    const leadToUpdate = leads.find(l => l.id === draggedLeadId);
    if (!leadToUpdate || leadToUpdate.status === newStatus) {
      setDraggedLeadId(null);
      return;
    }

    // Optimistic update
    setLeads(prev => prev.map(l => l.id === draggedLeadId ? { ...l, status: newStatus } : l));
    
    try {
      await updateLeadStatus(draggedLeadId, newStatus);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      // Revert on error
      fetchLeads();
    } finally {
      setDraggedLeadId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="sm:flex sm:items-center sm:justify-between mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pipeline de Conversion</h1>
          <p className="mt-1 text-sm text-slate-500">
            Glissez-déposez les cartes pour mettre à jour l'avancement des patients.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 h-full min-w-max">
          {COLUMNS.map(column => {
            const columnLeads = leads.filter(l => l.status === column.id);
            
            return (
              <div 
                key={column.id}
                className={`flex flex-col w-80 rounded-xl border ${column.color} bg-opacity-50`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                <div className="p-3 border-b border-slate-200/50 flex justify-between items-center bg-white/50 rounded-t-xl">
                  <h3 className="font-semibold text-slate-800">{column.title}</h3>
                  <span className="bg-white text-slate-600 text-xs font-medium px-2 py-1 rounded-full shadow-sm">
                    {columnLeads.length}
                  </span>
                </div>
                
                <div className="flex-1 p-3 overflow-y-auto space-y-3">
                  {columnLeads.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                      <EmptyState 
                        title="Aucun lead"
                        description="Glissez un lead ici."
                        icon={<Inbox className="h-12 w-12 text-slate-300" />}
                      />
                    </div>
                  ) : (
                    columnLeads.map(lead => (
                      <div
                        key={lead.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, lead.id)}
                        className={`bg-white p-4 rounded-lg shadow-sm border border-slate-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${
                          draggedLeadId === lead.id ? 'opacity-50' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-slate-900">{lead.name}</h4>
                          <Link 
                            to={`/dashboard/leads/${lead.id}`}
                            className="text-slate-400 hover:text-secondary"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                        
                        <div className="space-y-2 text-sm text-slate-500">
                          <div className="flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5 text-slate-400" />
                            {lead.phone}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            {new Date(lead.created_at).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
