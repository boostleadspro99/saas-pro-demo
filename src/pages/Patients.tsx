import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, UserPlus, Phone, Mail, Loader2, ChevronRight } from "lucide-react";
import { Patient } from "../types";
import { getPatients } from "../lib/patients";
import EmptyState from "../components/EmptyState";

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    const data = await getPatients();
    setPatients(data);
    setLoading(false);
  };

  const filteredPatients = patients.filter(patient => {
    const searchLower = searchQuery.toLowerCase();
    return (
      patient.name.toLowerCase().includes(searchLower) ||
      patient.phone.includes(searchQuery) ||
      (patient.email && patient.email.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Patients</h1>
          <p className="mt-1 text-sm text-slate-500">
            Gérez votre base de patients et consultez leurs historiques.
          </p>
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
              placeholder="Rechercher par nom, téléphone ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-md border-slate-300 pl-10 focus:border-secondary focus:ring-secondary sm:text-sm border py-2"
            />
          </div>
        </div>

        {/* Tableau */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-secondary mx-auto" />
              <p className="mt-2 text-sm text-slate-500">Chargement des patients...</p>
            </div>
          ) : filteredPatients.length === 0 ? (
            <EmptyState 
              title="Aucun patient trouvé" 
              description="Essayez de modifier votre recherche."
              icon={<UserPlus className="h-12 w-12 text-slate-300" />}
            />
          ) : (
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6">Nom</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Contact</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Date de création</th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50 transition-colors">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                      <div className="font-medium text-slate-900">{patient.name}</div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          {patient.phone}
                        </div>
                        {patient.email && (
                          <div className="flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5 text-slate-400" />
                            {patient.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                      {new Date(patient.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <Link 
                        to={`/dashboard/patients/${patient.id}`}
                        className="inline-flex items-center text-secondary hover:text-secondary-dark"
                      >
                        Voir la fiche <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
