import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users, Calendar, Euro, TrendingUp, ArrowUpRight, UserCheck, UserX, Activity, Clock } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { getLeads } from "../lib/leads";
import { getAppointments } from "../lib/appointments";
import { getPatients } from "../lib/patients";
import { getPayments } from "../lib/payments";
import { Lead, Appointment, Patient, Payment } from "../types";

type Period = 'jour' | 'semaine' | 'mois';

export default function Dashboard() {
  const [period, setPeriod] = useState<Period>('mois');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [leadsData, apptsData, patientsData, paymentsData] = await Promise.all([
          getLeads(),
          getAppointments(),
          getPatients(),
          getPayments()
        ]);
        setLeads(leadsData);
        setAppointments(apptsData);
        setPatients(patientsData);
        setPayments(paymentsData);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helper pour obtenir la date de début selon la période
  const getStartDate = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    if (period === 'jour') return d;
    if (period === 'semaine') {
      d.setDate(d.getDate() - d.getDay() + 1); // Lundi
      return d;
    }
    if (period === 'mois') {
      d.setDate(1); // 1er du mois
      return d;
    }
    return d;
  };

  const startDate = getStartDate();
  const todayStr = new Date().toISOString().split('T')[0];

  // KPIs
  const filteredLeads = leads.filter(l => new Date(l.created_at) >= startDate);
  const filteredAppointments = appointments.filter(a => new Date(a.date) >= startDate);
  const filteredPatients = patients.filter(p => new Date(p.created_at) >= startDate);
  const filteredPayments = payments.filter(p => new Date(p.date) >= startDate && p.status === 'payé');

  const revenue = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  const conversionRate = filteredLeads.length > 0 
    ? Math.round((filteredPatients.length / filteredLeads.length) * 100) 
    : 0;

  // Données pour les graphiques
  const generateChartData = () => {
    const data = [];
    const days = period === 'jour' ? 7 : period === 'semaine' ? 7 : 30; // Si jour, on montre quand même les 7 derniers jours pour la tendance
    
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const dayRevenue = payments
        .filter(p => p.date === dateStr && p.status === 'payé')
        .reduce((sum, p) => sum + p.amount, 0);
        
      const dayLeads = leads
        .filter(l => l.created_at.startsWith(dateStr))
        .length;
        
      data.push({
        name: d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        revenus: dayRevenue,
        leads: dayLeads
      });
    }
    return data;
  };

  const chartData = generateChartData();

  // Listes pour les cartes
  const todayAppointments = appointments
    .filter(a => a.date === todayStr)
    .sort((a, b) => a.time.localeCompare(b.time));
    
  const noShows = appointments.filter(a => a.status === 'annulé' && new Date(a.date) >= startDate);
  
  // Patients actifs (ayant eu un RDV ou un paiement dans la période)
  const activePatientIds = new Set([
    ...filteredAppointments.map(a => a.patient_id).filter(Boolean),
    ...filteredPayments.map(p => p.patient_id)
  ]);
  const activePatientsCount = activePatientIds.size;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
          <p className="mt-1 text-sm text-slate-500">
            Vision business et indicateurs clés de performance.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex bg-slate-100 p-1 rounded-lg">
          {(['jour', 'semaine', 'mois'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 text-sm font-medium rounded-md capitalize transition-colors ${
                period === p
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* 1. KPIs principaux */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-200 p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-primary/10 rounded-lg">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-slate-500 truncate">Nouveaux Leads</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-slate-900">{filteredLeads.length}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-200 p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-secondary/10 rounded-lg">
              <Calendar className="h-6 w-6 text-secondary" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-slate-500 truncate">Rendez-vous</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-slate-900">{filteredAppointments.length}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-200 p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-slate-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-slate-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-slate-500 truncate">Taux de conversion</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-slate-900">{conversionRate}%</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-200 p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 bg-accent/10 rounded-lg">
              <Euro className="h-6 w-6 text-accent" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-slate-500 truncate">Chiffre d'affaires</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-slate-900">
                    {revenue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Évolution des revenus</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`${value} €`, 'Revenus']}
                />
                <Bar dataKey="revenus" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Acquisition de leads</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#002B7F" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#002B7F" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [value, 'Leads']}
                />
                <Area type="monotone" dataKey="leads" stroke="#002B7F" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 3. Cartes Opérationnelles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RDV Aujourd'hui */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Clock className="h-4 w-4 text-secondary" />
              RDV Aujourd'hui
            </h3>
            <span className="bg-secondary/10 text-secondary-dark py-0.5 px-2.5 rounded-full text-xs font-medium">
              {todayAppointments.length}
            </span>
          </div>
          <div className="p-0 flex-1 overflow-y-auto max-h-[300px]">
            {todayAppointments.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">Aucun rendez-vous prévu aujourd'hui.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {todayAppointments.map(app => (
                  <li key={app.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{app.name}</p>
                        <p className="text-xs text-slate-500 mt-1">{app.phone}</p>
                      </div>
                      <span className="text-sm font-semibold text-secondary bg-secondary/10 px-2 py-1 rounded-md">
                        {app.time}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
            <Link to="/dashboard/appointments" className="text-xs font-medium text-primary hover:text-primary-light">
              Voir l'agenda complet →
            </Link>
          </div>
        </div>

        {/* Patients Actifs */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Patients Actifs
            </h3>
          </div>
          <div className="p-6 flex-1 flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <UserCheck className="h-8 w-8 text-primary" />
            </div>
            <p className="text-4xl font-bold text-slate-900">{activePatientsCount}</p>
            <p className="text-sm text-slate-500 mt-2">
              Patients ayant interagi (RDV ou paiement) sur la période sélectionnée.
            </p>
          </div>
          <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
            <Link to="/dashboard/patients" className="text-xs font-medium text-primary hover:text-primary-light">
              Voir la base patients →
            </Link>
          </div>
        </div>

        {/* No-shows */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <UserX className="h-4 w-4 text-red-600" />
              No-shows & Annulations
            </h3>
            <span className="bg-red-100 text-red-700 py-0.5 px-2.5 rounded-full text-xs font-medium">
              {noShows.length}
            </span>
          </div>
          <div className="p-0 flex-1 overflow-y-auto max-h-[300px]">
            {noShows.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">Aucune annulation sur cette période.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {noShows.map(app => (
                  <li key={app.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{app.name}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(app.date).toLocaleDateString('fr-FR')} à {app.time}
                        </p>
                      </div>
                      <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-md">
                        Annulé
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
