import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { CreditCard, Search, Filter, Plus, Loader2, X, ArrowRight, FileText } from "lucide-react";
import { Payment, Patient, TreatmentPlan, PaymentStatus } from "../types";
import { getPayments, createPayment, updatePaymentStatus } from "../lib/payments";
import { getPatients } from "../lib/patients";
import { getAllPlans } from "../lib/plans";
import EmptyState from "../components/EmptyState";

export default function Payments() {
  const location = useLocation();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [plans, setPlans] = useState<TreatmentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'tous'>('tous');
  
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPayment, setNewPayment] = useState({
    patient_id: "",
    plan_id: "",
    amount: 0,
    method: "carte" as Payment['method'],
    status: "payé" as PaymentStatus,
    description: "",
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [paymentsData, patientsData, plansData] = await Promise.all([
        getPayments(),
        getPatients(),
        getAllPlans()
      ]);
      setPayments(paymentsData);
      setPatients(patientsData);
      setPlans(plansData);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPayment.patient_id || newPayment.amount <= 0) return;
    
    setIsSubmitting(true);
    try {
      const payment = await createPayment({
        patient_id: newPayment.patient_id,
        plan_id: newPayment.plan_id || undefined,
        amount: newPayment.amount,
        method: newPayment.method,
        status: newPayment.status,
        description: newPayment.description || undefined,
        date: newPayment.date
      });
      setPayments([payment, ...payments]);
      setIsAddingPayment(false);
      setNewPayment({
        patient_id: "",
        plan_id: "",
        amount: 0,
        method: "carte",
        status: "payé",
        description: "",
        date: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout du paiement:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: PaymentStatus) => {
    try {
      await updatePaymentStatus(id, status);
      setPayments(payments.map(p => p.id === id ? { ...p, status } : p));
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const patient = patients.find(p => p.id === payment.patient_id);
    const matchesSearch = patient?.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          payment.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'tous' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculs
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const firstDayOfWeek = new Date(today);
  firstDayOfWeek.setDate(today.getDate() - today.getDay() + 1);
  
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const calculateTotal = (filterFn: (date: Date) => boolean) => {
    return payments
      .filter(p => p.status === 'payé' && filterFn(new Date(p.date)))
      .reduce((sum, p) => sum + p.amount, 0);
  };

  const totalDay = calculateTotal(d => d >= today);
  const totalWeek = calculateTotal(d => d >= firstDayOfWeek);
  const totalMonth = calculateTotal(d => d >= firstDayOfMonth);

  const getPatientName = (id: string) => patients.find(p => p.id === id)?.name || 'Inconnu';
  const getPlanDescription = (id?: string) => plans.find(p => p.id === id)?.description || '';

  return (
    <div className="max-w-7xl mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Paiements</h1>
          <p className="mt-1 text-sm text-slate-500">
            Suivi de la facturation et des encaissements.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button 
            onClick={() => setIsAddingPayment(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-secondary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau paiement
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CreditCard className="h-6 w-6 text-secondary" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 truncate">Encaissé aujourd'hui</dt>
                  <dd className="text-2xl font-semibold text-slate-900">{totalDay.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CreditCard className="h-6 w-6 text-secondary" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 truncate">Encaissé cette semaine</dt>
                  <dd className="text-2xl font-semibold text-slate-900">{totalWeek.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-200">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CreditCard className="h-6 w-6 text-secondary" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 truncate">Encaissé ce mois</dt>
                  <dd className="text-2xl font-semibold text-slate-900">{totalMonth.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Filtres */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un patient ou description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-md border-slate-300 pl-10 focus:border-secondary focus:ring-secondary sm:text-sm border py-2"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as PaymentStatus | 'tous')}
              className="block w-full rounded-md border-slate-300 py-2 pl-3 pr-10 text-base focus:border-secondary focus:outline-none focus:ring-secondary sm:text-sm border"
            >
              <option value="tous">Tous les statuts</option>
              <option value="payé">Payé</option>
              <option value="en attente">En attente</option>
              <option value="annulé">Annulé</option>
            </select>
          </div>
        </div>

        {/* Tableau */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6">Patient</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Montant</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Méthode</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Date</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Statut</th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center">
                    <Loader2 className="h-6 w-6 animate-spin text-secondary mx-auto" />
                    <p className="mt-2 text-sm text-slate-500">Chargement des paiements...</p>
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10">
                    <EmptyState 
                      title="Aucun paiement"
                      description="Il n'y a aucun paiement correspondant à vos critères."
                      icon={<FileText className="h-12 w-12 text-slate-300" />}
                    />
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                      <div className="font-medium text-slate-900">{getPatientName(payment.patient_id)}</div>
                      {payment.description && (
                        <div className="text-slate-500 text-xs mt-0.5">{payment.description}</div>
                      )}
                      {payment.plan_id && (
                        <div className="text-secondary text-xs mt-0.5">Plan: {getPlanDescription(payment.plan_id)}</div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-semibold text-slate-900">
                      {payment.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 capitalize">
                      {payment.method}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                      {new Date(payment.date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      <select
                        value={payment.status}
                        onChange={(e) => handleUpdateStatus(payment.id, e.target.value as PaymentStatus)}
                        className={`text-xs font-medium rounded-full px-2.5 py-0.5 border-0 cursor-pointer focus:ring-2 focus:ring-offset-1 ${
                          payment.status === 'payé' ? 'bg-secondary/10 text-secondary focus:ring-secondary' :
                          payment.status === 'en attente' ? 'bg-yellow-100 text-yellow-800 focus:ring-yellow-500' :
                          'bg-red-100 text-red-800 focus:ring-red-500'
                        }`}
                      >
                        <option value="payé">Payé</option>
                        <option value="en attente">En attente</option>
                        <option value="annulé">Annulé</option>
                      </select>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <Link 
                        to={`/dashboard/patients/${payment.patient_id}`}
                        className="text-secondary hover:text-secondary-dark"
                      >
                        Dossier
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal d'ajout de paiement */}
      {isAddingPayment && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Nouveau Paiement</h3>
              <button onClick={() => setIsAddingPayment(false)} className="text-slate-400 hover:text-slate-500">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddPayment} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Patient *</label>
                <select 
                  required
                  value={newPayment.patient_id} 
                  onChange={e => setNewPayment({...newPayment, patient_id: e.target.value, plan_id: ""})} 
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 focus:border-secondary focus:ring-secondary sm:text-sm"
                >
                  <option value="">Sélectionner un patient</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              {newPayment.patient_id && plans.filter(p => p.patient_id === newPayment.patient_id && p.status === 'accepté').length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-slate-700">Plan de traitement (optionnel)</label>
                  <select 
                    value={newPayment.plan_id} 
                    onChange={e => {
                      const planId = e.target.value;
                      const plan = plans.find(p => p.id === planId);
                      setNewPayment({
                        ...newPayment, 
                        plan_id: planId,
                        amount: plan ? plan.estimated_amount : newPayment.amount,
                        description: plan ? `Paiement pour: ${plan.description}` : newPayment.description
                      });
                    }} 
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 focus:border-secondary focus:ring-secondary sm:text-sm"
                  >
                    <option value="">Aucun plan lié</option>
                    {plans.filter(p => p.patient_id === newPayment.patient_id && p.status === 'accepté').map(p => (
                      <option key={p.id} value={p.id}>{p.description} ({p.estimated_amount}€)</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700">Montant (€) *</label>
                <input 
                  type="number" 
                  required 
                  min="0.01"
                  step="0.01"
                  value={newPayment.amount || ''} 
                  onChange={e => setNewPayment({...newPayment, amount: parseFloat(e.target.value)})} 
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 focus:border-secondary focus:ring-secondary sm:text-sm" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Méthode *</label>
                  <select 
                    value={newPayment.method} 
                    onChange={e => setNewPayment({...newPayment, method: e.target.value as Payment['method']})} 
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 focus:border-secondary focus:ring-secondary sm:text-sm"
                  >
                    <option value="carte">Carte bancaire</option>
                    <option value="espèces">Espèces</option>
                    <option value="virement">Virement</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Date *</label>
                  <input 
                    type="date" 
                    required 
                    value={newPayment.date} 
                    onChange={e => setNewPayment({...newPayment, date: e.target.value})} 
                    className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 focus:border-secondary focus:ring-secondary sm:text-sm" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Statut *</label>
                <select 
                  value={newPayment.status} 
                  onChange={e => setNewPayment({...newPayment, status: e.target.value as PaymentStatus})} 
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 focus:border-secondary focus:ring-secondary sm:text-sm"
                >
                  <option value="payé">Payé</option>
                  <option value="en attente">En attente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Note / Description</label>
                <textarea 
                  value={newPayment.description} 
                  onChange={e => setNewPayment({...newPayment, description: e.target.value})} 
                  rows={2} 
                  className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 focus:border-secondary focus:ring-secondary sm:text-sm" 
                  placeholder="Ex: Acompte prothèse..."
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsAddingPayment(false)} 
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting || !newPayment.patient_id || newPayment.amount <= 0} 
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-secondary border border-transparent rounded-md hover:bg-secondary-dark disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
