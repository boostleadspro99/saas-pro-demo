import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Search, Filter, Calendar, Clock, Phone, MoreHorizontal, Loader2, Plus, CheckCircle, XCircle, UserPlus, Edit2 } from "lucide-react";
import { Appointment, AppointmentStatus } from "../types";
import { getAppointments, updateAppointmentStatus, updateAppointment, createAppointment } from "../lib/appointments";
import { createPatient, getPatientByPhone } from "../lib/patients";
import { getLeadById } from "../lib/leads";
import EmptyState from "../components/EmptyState";

export default function Appointments() {
  const location = useLocation();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'tous'>('tous');
  const [dateFilter, setDateFilter] = useState<string>(''); // YYYY-MM-DD
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState<{type: 'success'|'error', message: string} | null>(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    status: 'en attente' as AppointmentStatus,
    notes: '',
    lead_id: undefined as string | undefined
  });

  useEffect(() => {
    fetchAppointments();
    
    // Check if we came from a lead to create an appointment
    const state = location.state as any;
    if (state?.createFromLead) {
      setFormData({
        name: state.createFromLead.name,
        phone: state.createFromLead.phone,
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        status: 'en attente',
        notes: '',
        lead_id: state.createFromLead.lead_id
      });
      setIsModalOpen(true);
      
      // Clear state so it doesn't reopen on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const fetchAppointments = async () => {
    setLoading(true);
    const data = await getAppointments();
    setAppointments(data);
    setLoading(false);
  };

  const filteredAppointments = appointments.filter(app => {
    const matchesStatus = statusFilter === 'tous' || app.status === statusFilter;
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.phone.includes(searchQuery);
    const matchesDate = dateFilter === '' || app.date === dateFilter;
    
    return matchesStatus && matchesSearch && matchesDate;
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleStatusChange = async (id: string, newStatus: AppointmentStatus, currentApp: Appointment) => {
    try {
      await updateAppointmentStatus(id, newStatus);
      
      let updatedApp = { ...currentApp, status: newStatus };

      // If marked as "visité" and no patient linked yet, automate conversion
      if (newStatus === 'visité' && !currentApp.patient_id) {
        let patient = await getPatientByPhone(currentApp.phone);
        let isNewPatient = false;

        if (!patient) {
          // Try to get email from lead if lead_id exists
          let email = undefined;
          if (currentApp.lead_id) {
            const lead = await getLeadById(currentApp.lead_id);
            if (lead && lead.email) {
              email = lead.email;
            }
          }

          patient = await createPatient({
            name: currentApp.name,
            phone: currentApp.phone,
            email: email,
            lead_id: currentApp.lead_id
          });
          isNewPatient = true;
        }

        // Link patient to appointment
        await updateAppointment(id, { patient_id: patient.id });
        updatedApp.patient_id = patient.id;

        if (isNewPatient) {
          showNotification('success', `Conversion réussie : Fiche patient créée pour ${patient.name}`);
        } else {
          showNotification('success', `Rendez-vous lié au patient existant ${patient.name}`);
        }
      }

      // Update local state
      setAppointments(appointments.map(app => 
        app.id === id ? updatedApp : app
      ));

    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      showNotification('error', "Une erreur est survenue lors de la mise à jour.");
    }
  };

  const openModal = (app?: Appointment) => {
    if (app) {
      setEditingAppointment(app);
      setFormData({
        name: app.name,
        phone: app.phone,
        date: app.date,
        time: app.time,
        status: app.status,
        notes: app.notes || '',
        lead_id: app.lead_id
      });
    } else {
      setEditingAppointment(null);
      setFormData({
        name: '',
        phone: '',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        status: 'en attente',
        notes: '',
        lead_id: undefined
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAppointment(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAppointment) {
        const updated = await updateAppointment(editingAppointment.id, formData);
        setAppointments(appointments.map(a => a.id === updated.id ? updated : a));
      } else {
        const created = await createAppointment(formData);
        setAppointments([...appointments, created]);
      }
      closeModal();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      alert("Une erreur est survenue.");
    }
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'en attente':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">En attente</span>;
      case 'confirmé':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Confirmé</span>;
      case 'visité':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary-dark">Visité</span>;
      case 'annulé':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Annulé</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Rendez-vous</h1>
          <p className="mt-1 text-sm text-slate-500">
            Gérez le planning de votre cabinet dentaire.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button 
            onClick={() => openModal()}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-secondary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau RDV
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
                onChange={(e) => setStatusFilter(e.target.value as AppointmentStatus | 'tous')}
                className="block w-full rounded-md border-slate-300 py-2 pl-3 pr-10 text-base focus:border-secondary focus:outline-none focus:ring-secondary sm:text-sm border"
              >
                <option value="tous">Tous les statuts</option>
                <option value="en attente">En attente</option>
                <option value="confirmé">Confirmé</option>
                <option value="visité">Visité</option>
                <option value="annulé">Annulé</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="block w-full rounded-md border-slate-300 py-2 pl-3 pr-3 text-base focus:border-secondary focus:outline-none focus:ring-secondary sm:text-sm border"
              />
              {dateFilter && (
                <button onClick={() => setDateFilter('')} className="text-xs text-slate-500 hover:text-slate-700">
                  Effacer
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tableau */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6">Date & Heure</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Patient</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Téléphone</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Statut</th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-secondary mx-auto" />
                    <p className="mt-2 text-sm text-slate-500">Chargement des rendez-vous...</p>
                  </td>
                </tr>
              ) : filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10">
                    <EmptyState 
                      title="Aucun rendez-vous"
                      description="Il n'y a aucun rendez-vous correspondant à vos critères."
                      icon={<Calendar className="h-12 w-12 text-slate-300" />}
                    />
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900">
                            {new Date(app.date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                          </span>
                          <span className="text-slate-500 flex items-center gap-1 text-xs mt-0.5">
                            <Clock className="h-3 w-3" /> {app.time}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-slate-900">
                      {app.name}
                      {app.patient_id && (
                        <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                          Patient
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        {app.phone}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value as AppointmentStatus, app)}
                        className={`text-xs font-medium rounded-full px-2.5 py-1 border-0 cursor-pointer focus:ring-2 focus:ring-secondary ${
                          app.status === 'en attente' ? 'bg-yellow-100 text-yellow-800' :
                          app.status === 'confirmé' ? 'bg-blue-100 text-blue-800' :
                          app.status === 'visité' ? 'bg-secondary/10 text-secondary-dark' :
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        <option value="en attente">En attente</option>
                        <option value="confirmé">Confirmé</option>
                        <option value="visité">Visité</option>
                        <option value="annulé">Annulé</option>
                      </select>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openModal(app)}
                          className="text-slate-400 hover:text-secondary transition-colors p-1"
                          title="Modifier"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        {app.status !== 'visité' && (
                          <button 
                            onClick={() => handleStatusChange(app.id, 'visité', app)}
                            className="text-slate-400 hover:text-secondary transition-colors p-1"
                            title="Marquer comme visité"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        {app.status !== 'annulé' && (
                          <button 
                            onClick={() => handleStatusChange(app.id, 'annulé', app)}
                            className="text-slate-400 hover:text-red-600 transition-colors p-1"
                            title="Annuler le RDV"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Création/Modification */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity" onClick={closeModal} />
            
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-semibold leading-6 text-slate-900 mb-4">
                    {editingAppointment ? 'Modifier le rendez-vous' : 'Nouveau rendez-vous'}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Nom du patient</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-secondary focus:outline-none focus:ring-secondary sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700">Téléphone</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-secondary focus:outline-none focus:ring-secondary sm:text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Date</label>
                        <input
                          type="date"
                          required
                          value={formData.date}
                          onChange={(e) => setFormData({...formData, date: e.target.value})}
                          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-secondary focus:outline-none focus:ring-secondary sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700">Heure</label>
                        <input
                          type="time"
                          required
                          value={formData.time}
                          onChange={(e) => setFormData({...formData, time: e.target.value})}
                          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-secondary focus:outline-none focus:ring-secondary sm:text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700">Statut</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value as AppointmentStatus})}
                        className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-secondary focus:outline-none focus:ring-secondary sm:text-sm"
                      >
                        <option value="en attente">En attente</option>
                        <option value="confirmé">Confirmé</option>
                        <option value="visité">Visité</option>
                        <option value="annulé">Annulé</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700">Notes (optionnel)</label>
                      <textarea
                        rows={3}
                        value={formData.notes}
                        onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-secondary focus:outline-none focus:ring-secondary sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md bg-secondary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-secondary-dark sm:ml-3 sm:w-auto"
                  >
                    Enregistrer
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 sm:mt-0 sm:w-auto"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Notifications */}
      {notification && (
        <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg border flex items-center gap-3 z-50 animate-in slide-in-from-bottom-5 ${
          notification.type === 'success' ? 'bg-secondary/10 border-secondary/20 text-secondary-dark' : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {notification.type === 'success' ? <CheckCircle className="h-5 w-5 text-secondary" /> : <XCircle className="h-5 w-5 text-red-600" />}
          <p className="font-medium text-sm">{notification.message}</p>
          <button onClick={() => setNotification(null)} className="ml-2 text-slate-400 hover:text-slate-600">
            <XCircle className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
