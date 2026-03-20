import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Phone, Mail, Calendar, CreditCard, FileText, Loader2, Edit2, MessageCircle, ClipboardList, Plus, Star, FolderOpen } from "lucide-react";
import { Patient, Appointment, PatientNote, TreatmentPlan, PlanStatus, Payment } from "../types";
import { getPatientById, getPatientNotes, addPatientNote, updatePatient } from "../lib/patients";
import { getPatientAppointments } from "../lib/appointments";
import { getPatientPlans, createPlan, updatePlanStatus, updatePlanNote } from "../lib/plans";
import { getPatientPayments } from "../lib/payments";
import { getSettings } from "../lib/settings";
import { PatientFileUpload } from "../components/patients/PatientFileUpload";
import { PatientDocumentList } from "../components/patients/PatientDocumentList";

export default function PatientDetail() {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [notes, setNotes] = useState<PatientNote[]>([]);
  const [plans, setPlans] = useState<TreatmentPlan[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [reviewLink, setReviewLink] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [isRequestingReview, setIsRequestingReview] = useState(false);
  const [refreshDocs, setRefreshDocs] = useState(0);
  
  const [newNote, setNewNote] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [newPlan, setNewPlan] = useState({ description: "", estimated_amount: 0, notes: "" });
  const [isSubmittingPlan, setIsSubmittingPlan] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phone: '', email: '' });
  const [isSaving, setIsSaving] = useState(false);

  const [activeTab, setActiveTab] = useState<'history' | 'plans' | 'payments' | 'documents'>('history');

  useEffect(() => {
    if (id) {
      fetchPatientData(id);
    }
  }, [id]);

  const fetchPatientData = async (patientId: string) => {
    setLoading(true);
    try {
      const [patientData, appointmentsData, notesData, plansData, paymentsData, settingsData] = await Promise.all([
        getPatientById(patientId),
        getPatientAppointments(patientId),
        getPatientNotes(patientId),
        getPatientPlans(patientId),
        getPatientPayments(patientId),
        getSettings()
      ]);
      
      setPatient(patientData);
      setAppointments(appointmentsData);
      setNotes(notesData);
      setPlans(plansData);
      setPayments(paymentsData);
      setReviewLink(settingsData.google_review_link);
      
      if (patientData) {
        setEditForm({
          name: patientData.name,
          phone: patientData.phone,
          email: patientData.email || ''
        });
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newNote.trim()) return;
    
    setIsAddingNote(true);
    try {
      const note = await addPatientNote(id, newNote);
      setNotes([note, ...notes]);
      setNewNote("");
    } catch (error) {
      console.error("Erreur lors de l'ajout de la note:", error);
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!id || !patient) return;
    setIsSaving(true);
    try {
      const updated = await updatePatient(id, {
        name: editForm.name,
        phone: editForm.phone,
        email: editForm.email || undefined
      });
      setPatient(updated);
      setIsEditing(false);
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newPlan.description.trim()) return;
    
    setIsSubmittingPlan(true);
    try {
      const plan = await createPlan({
        patient_id: id,
        description: newPlan.description,
        estimated_amount: newPlan.estimated_amount,
        status: 'proposé',
        notes: newPlan.notes
      });
      setPlans([plan, ...plans]);
      setNewPlan({ description: "", estimated_amount: 0, notes: "" });
      setIsAddingPlan(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout du plan:", error);
    } finally {
      setIsSubmittingPlan(false);
    }
  };

  const handleUpdatePlanStatus = async (planId: string, status: PlanStatus) => {
    try {
      await updatePlanStatus(planId, status);
      setPlans(plans.map(p => p.id === planId ? { ...p, status } : p));
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
    }
  };

  const handleRequestReview = async (channel: 'whatsapp' | 'email') => {
    if (!patient || !id) return;
    setIsRequestingReview(true);
    
    try {
      const message = `Bonjour ${patient.name},\n\nNous espérons que votre visite s'est bien passée. Votre avis compte beaucoup pour nous ! Pourriez-vous prendre une minute pour partager votre expérience ?\n\n${reviewLink}\n\nMerci de votre confiance,\nL'équipe du cabinet`;
      
      // Update patient status
      const updated = await updatePatient(id, {
        review_status: 'envoyé',
        review_request_date: new Date().toISOString()
      });
      setPatient(updated);

      // Log activity
      await addPatientNote(id, `Demande d'avis envoyée via ${channel === 'whatsapp' ? 'WhatsApp' : 'Email'}`);

      // Open link
      if (channel === 'whatsapp') {
        const phone = patient.phone.replace(/[^0-9+]/g, '');
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
      } else if (channel === 'email' && patient.email) {
        const subject = 'Votre avis compte pour nous !';
        const url = `mailto:${patient.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
      }
    } catch (error) {
      console.error("Erreur lors de la demande d'avis:", error);
    } finally {
      setIsRequestingReview(false);
    }
  };

  const handleMarkReviewReceived = async () => {
    if (!patient || !id) return;
    try {
      const updated = await updatePatient(id, {
        review_status: 'reçu'
      });
      setPatient(updated);
      await addPatientNote(id, `Avis Google reçu et confirmé.`);
    } catch (error) {
      console.error("Erreur lors de la confirmation de l'avis:", error);
    }
  };

  const hasVisited = appointments.some(a => a.status === 'visité');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-slate-900">Patient introuvable</h2>
        <Link to="/dashboard/patients" className="mt-4 text-secondary hover:text-secondary-dark inline-flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour aux patients
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <Link to="/dashboard/patients" className="text-sm text-slate-500 hover:text-slate-700 inline-flex items-center">
          <ArrowLeft className="mr-1 h-4 w-4" /> Retour aux patients
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne de gauche : Infos patient */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-slate-900">Informations</h2>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-slate-400 hover:text-secondary transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700">Nom</label>
                    <input 
                      type="text" 
                      value={editForm.name}
                      onChange={e => setEditForm({...editForm, name: e.target.value})}
                      className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-secondary focus:ring-secondary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700">Téléphone</label>
                    <input 
                      type="tel" 
                      value={editForm.phone}
                      onChange={e => setEditForm({...editForm, phone: e.target.value})}
                      className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-secondary focus:ring-secondary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700">Email</label>
                    <input 
                      type="email" 
                      value={editForm.email}
                      onChange={e => setEditForm({...editForm, email: e.target.value})}
                      className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-secondary focus:ring-secondary"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={handleSaveEdit}
                      disabled={isSaving}
                      className="flex-1 bg-secondary text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary-dark disabled:opacity-50"
                    >
                      {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="flex-1 bg-white border border-slate-300 text-slate-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-50"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-xl">
                      {patient.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{patient.name}</h3>
                      <p className="text-xs text-slate-500">Patient depuis le {new Date(patient.created_at).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <a href={`tel:${patient.phone}`} className="text-slate-700 hover:text-secondary">{patient.phone}</a>
                    </div>
                    {patient.email && (
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <a href={`mailto:${patient.email}`} className="text-slate-700 hover:text-secondary">{patient.email}</a>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 flex gap-2">
                    <a 
                      href={`https://wa.me/${patient.phone.replace(/[^0-9+]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#25D366] hover:bg-[#128C7E] transition-colors"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp
                    </a>
                  </div>

                  {/* Demande d'avis */}
                  {hasVisited && reviewLink && (
                    <div className="pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-slate-900 flex items-center gap-1.5">
                          <Star className="h-4 w-4 text-amber-500" />
                          Avis Google
                        </h4>
                        {patient.review_status === 'envoyé' && (
                          <span className="text-xs font-medium text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                            Envoyé le {patient.review_request_date ? new Date(patient.review_request_date).toLocaleDateString('fr-FR') : ''}
                          </span>
                        )}
                        {patient.review_status === 'reçu' && (
                          <span className="text-xs font-medium text-secondary-dark bg-secondary/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Star className="h-3 w-3 fill-secondary-dark" />
                            Reçu
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {patient.review_status !== 'reçu' ? (
                          <>
                            <button
                              onClick={() => handleRequestReview('whatsapp')}
                              disabled={isRequestingReview}
                              className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-slate-300 text-xs font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-50 transition-colors"
                            >
                              {isRequestingReview ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Demander via WhatsApp'}
                            </button>
                            {patient.email && (
                              <button
                                onClick={() => handleRequestReview('email')}
                                disabled={isRequestingReview}
                                className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-slate-300 text-xs font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-50 transition-colors"
                              >
                                {isRequestingReview ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Demander via Email'}
                              </button>
                            )}
                          </>
                        ) : (
                          <div className="w-full text-center py-2 text-sm text-slate-500 bg-slate-50 rounded-md border border-slate-100">
                            Merci pour votre avis !
                          </div>
                        )}
                      </div>
                      {patient.review_status === 'envoyé' && (
                        <div className="mt-2 text-center">
                          <button
                            onClick={handleMarkReviewReceived}
                            className="text-xs text-secondary hover:text-secondary-dark font-medium underline"
                          >
                            Marquer comme reçu
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[400px]">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <FileText className="h-4 w-4 text-secondary" />
                Notes cliniques
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {notes.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">Aucune note pour ce patient.</p>
              ) : (
                notes.map(note => (
                  <div key={note.id} className="bg-slate-50 rounded-lg p-3 text-sm">
                    <p className="text-slate-700 whitespace-pre-wrap">{note.content}</p>
                    <p className="text-xs text-slate-400 mt-2">
                      {new Date(note.created_at).toLocaleString('fr-FR', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-slate-200 bg-white">
              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Ajouter une note..."
                  className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
                />
                <button
                  type="submit"
                  disabled={!newNote.trim() || isAddingNote}
                  className="bg-secondary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-secondary-dark disabled:opacity-50 transition-colors"
                >
                  {isAddingNote ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Ajouter'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Colonne de droite : Historiques et Documents */}
        <div className="lg:col-span-2 space-y-6">
          {/* Onglets */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'history' ? 'border-secondary text-secondary' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Historique
            </button>
            <button
              onClick={() => setActiveTab('plans')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'plans' ? 'border-secondary text-secondary' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Plans de traitement
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'payments' ? 'border-secondary text-secondary' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Paiements
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'documents' ? 'border-secondary text-secondary' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              Documents
            </button>
          </div>

          {/* Contenu des onglets */}
          {activeTab === 'history' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-secondary" />
                  Historique des rendez-vous
                </h3>
              </div>
              <div className="p-0">
                {appointments.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-8">Aucun rendez-vous trouvé.</p>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {appointments.map(app => (
                      <li key={app.id} className="p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {new Date(app.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">À {app.time}</p>
                          </div>
                          <div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              app.status === 'en attente' ? 'bg-yellow-100 text-yellow-800' :
                              app.status === 'confirmé' ? 'bg-blue-100 text-blue-800' :
                              app.status === 'visité' ? 'bg-secondary/10 text-secondary' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {app.status}
                            </span>
                          </div>
                        </div>
                        {app.notes && (
                          <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-2 rounded border border-slate-100">
                            {app.notes}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {activeTab === 'plans' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-secondary" />
                  Plans de traitement
                </h3>
                <button 
                  onClick={() => setIsAddingPlan(!isAddingPlan)}
                  className="text-xs font-medium text-secondary hover:text-secondary-dark flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" /> Nouveau plan
                </button>
              </div>
              
              {isAddingPlan && (
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                  <form onSubmit={handleAddPlan} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700">Description du traitement</label>
                      <input 
                        type="text" 
                        required
                        value={newPlan.description}
                        onChange={e => setNewPlan({...newPlan, description: e.target.value})}
                        className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-secondary focus:ring-secondary"
                        placeholder="Ex: Couronne céramique dent 46"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700">Montant estimé (€)</label>
                      <input 
                        type="number" 
                        required
                        min="0"
                        step="0.01"
                        value={newPlan.estimated_amount}
                        onChange={e => setNewPlan({...newPlan, estimated_amount: parseFloat(e.target.value)})}
                        className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-secondary focus:ring-secondary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700">Notes (optionnel)</label>
                      <textarea 
                        value={newPlan.notes}
                        onChange={e => setNewPlan({...newPlan, notes: e.target.value})}
                        rows={2}
                        className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-secondary focus:ring-secondary"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button 
                        type="button"
                        onClick={() => setIsAddingPlan(false)}
                        className="bg-white border border-slate-300 text-slate-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-50"
                      >
                        Annuler
                      </button>
                      <button 
                        type="submit"
                        disabled={isSubmittingPlan || !newPlan.description.trim()}
                        className="bg-secondary text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary-dark flex items-center"
                      >
                        {isSubmittingPlan && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Enregistrer le plan
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="p-0">
                {plans.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-8">Aucun plan de traitement proposé.</p>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {plans.map(plan => (
                      <li key={plan.id} className="p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 pr-4">
                            <h4 className="text-sm font-medium text-slate-900">{plan.description}</h4>
                            <div className="mt-1 flex items-center gap-4 text-xs text-slate-500">
                              <span className="font-semibold text-slate-700">{plan.estimated_amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                              <span>Proposé le {new Date(plan.created_at).toLocaleDateString('fr-FR')}</span>
                            </div>
                            {plan.notes && (
                              <p className="mt-2 text-sm text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                                {plan.notes}
                              </p>
                            )}
                          </div>
                          <div className="shrink-0 flex flex-col items-end gap-2">
                            <select
                              value={plan.status}
                              onChange={(e) => handleUpdatePlanStatus(plan.id, e.target.value as PlanStatus)}
                              className={`text-xs font-medium rounded-full px-2.5 py-0.5 border-0 cursor-pointer focus:ring-2 focus:ring-offset-1 ${
                                plan.status === 'proposé' ? 'bg-blue-100 text-blue-800 focus:ring-blue-500' :
                                plan.status === 'accepté' ? 'bg-secondary/10 text-secondary focus:ring-secondary' :
                                'bg-red-100 text-red-800 focus:ring-red-500'
                              }`}
                            >
                              <option value="proposé">Proposé</option>
                              <option value="accepté">Accepté</option>
                              <option value="refusé">Refusé</option>
                            </select>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-secondary" />
                  Historique des paiements
                </h3>
              </div>
              <div className="p-0">
                {payments.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-8">Aucun paiement enregistré.</p>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {payments.map(payment => (
                      <li key={payment.id} className="p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {payment.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {new Date(payment.date).toLocaleDateString('fr-FR')} • {payment.method}
                            </p>
                            {payment.description && (
                              <p className="text-xs text-slate-600 mt-1">{payment.description}</p>
                            )}
                          </div>
                          <div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              payment.status === 'payé' ? 'bg-secondary/10 text-secondary' :
                              payment.status === 'en attente' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {payment.status}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <PatientFileUpload 
                patientId={id!} 
                onUploadSuccess={() => setRefreshDocs(prev => prev + 1)} 
              />
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <PatientDocumentList 
                  patientId={id!} 
                  refreshTrigger={refreshDocs} 
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
