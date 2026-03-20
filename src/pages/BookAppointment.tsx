import React, { useState } from "react";
import { Calendar, Clock, User, Phone, Mail, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { createLead } from "../lib/leads";
import { createAppointment } from "../lib/appointments";

export default function BookAppointment() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: 'Matin (9h - 12h)',
    reason: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 1. Create Lead
      const lead = await createLead({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        reason: formData.reason,
        status: 'nouveau',
        source: 'Formulaire'
      });

      // 2. Create Appointment
      await createAppointment({
        name: formData.name,
        phone: formData.phone,
        date: formData.date,
        time: formData.time,
        status: 'en attente',
        notes: formData.reason,
        lead_id: lead.id
      });

      setSubmitted(true);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      alert("Une erreur est survenue lors de l'envoi de votre demande.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto mt-12 p-6 bg-white rounded-2xl shadow-sm border border-slate-100 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-secondary/10 p-4 rounded-full">
            <CheckCircle2 className="h-12 w-12 text-secondary" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Demande envoyée !</h2>
        <p className="text-lg text-slate-600 mb-8">
          Merci pour votre demande. Notre secrétariat va vous recontacter très rapidement pour confirmer l'horaire de votre rendez-vous.
        </p>
        <Link 
          to="/"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark transition-colors"
        >
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 mb-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">Prendre rendez-vous</h1>
        <p className="mt-4 text-lg text-slate-600">
          Remplissez ce formulaire pour demander un rendez-vous. Aucune création de compte n'est requise.
        </p>
      </div>

      <div className="bg-white py-8 px-6 shadow-sm sm:rounded-2xl sm:px-10 border border-slate-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Nom complet */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                Nom complet
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="block w-full pl-10 rounded-md border border-slate-300 py-2.5 px-3 focus:border-primary focus:ring-primary sm:text-sm"
                  placeholder="Jean Dupont"
                />
              </div>
            </div>

            {/* Téléphone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
                Téléphone
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="block w-full pl-10 rounded-md border border-slate-300 py-2.5 px-3 focus:border-primary focus:ring-primary sm:text-sm"
                  placeholder="06 12 34 56 78"
                />
              </div>
            </div>

            {/* Email */}
            <div className="sm:col-span-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Adresse email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="block w-full pl-10 rounded-md border border-slate-300 py-2.5 px-3 focus:border-primary focus:ring-primary sm:text-sm"
                  placeholder="jean.dupont@exemple.com"
                />
              </div>
            </div>

            {/* Date souhaitée */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-slate-700">
                Date souhaitée
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="date"
                  name="date"
                  id="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="block w-full pl-10 rounded-md border border-slate-300 py-2.5 px-3 focus:border-primary focus:ring-primary sm:text-sm"
                />
              </div>
            </div>

            {/* Créneau */}
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-slate-700">
                Créneau de préférence
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-slate-400" />
                </div>
                <select
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  className="block w-full pl-10 rounded-md border border-slate-300 py-2.5 px-3 focus:border-primary focus:ring-primary sm:text-sm"
                >
                  <option>Matin (9h - 12h)</option>
                  <option>Midi (12h - 14h)</option>
                  <option>Après-midi (14h - 18h)</option>
                </select>
              </div>
            </div>

            {/* Motif */}
            <div className="sm:col-span-2">
              <label htmlFor="reason" className="block text-sm font-medium text-slate-700">
                Motif de consultation
              </label>
              <div className="mt-1">
                <textarea
                  id="reason"
                  name="reason"
                  rows={4}
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  className="block w-full rounded-md border border-slate-300 py-2.5 px-3 focus:border-primary focus:ring-primary sm:text-sm"
                  placeholder="Décrivez brièvement la raison de votre visite (ex: contrôle annuel, douleur, détartrage...)"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 transition-colors"
            >
              {loading ? "Envoi en cours..." : "Confirmer la demande de rendez-vous"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
