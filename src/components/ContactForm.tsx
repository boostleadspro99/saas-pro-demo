import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, CheckCircle2, AlertCircle, MessageCircle } from "lucide-react";
import { createLead } from "../lib/leads";

const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phone: z.string().min(10, "Le numéro de téléphone n'est pas valide"),
  email: z.string().email("L'adresse email n'est pas valide").optional().or(z.literal("")),
  reason: z.string().min(10, "Veuillez détailler un peu plus votre demande"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      await createLead({
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        reason: data.reason,
        source: "website",
        status: "nouveau",
      });
      
      setSubmitSuccess(true);
      reset();
    } catch (error: any) {
      console.error("Erreur lors de la création du lead:", error);
      setSubmitError("Une erreur est survenue lors de l'envoi de votre message. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="bg-secondary/10 rounded-2xl p-8 text-center border border-secondary/20">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10 mb-6">
          <CheckCircle2 className="h-8 w-8 text-secondary" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Message envoyé !</h3>
        <p className="text-slate-600 mb-8">
          Notre équipe a bien reçu votre demande et vous contactera dans les plus brefs délais.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setSubmitSuccess(false)}
            className="inline-flex justify-center items-center px-6 py-3 border border-slate-300 text-base font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-colors"
          >
            Envoyer un autre message
          </button>
          <a
            href="https://wa.me/33600000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-[#25D366] hover:bg-[#128C7E] shadow-sm transition-colors"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Nous contacter sur WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 sm:p-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-6">Contactez-nous</h3>
        
        {submitError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-start gap-3 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                Nom complet *
              </label>
              <input
                id="name"
                type="text"
                {...register("name")}
                className={`block w-full rounded-md border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary sm:text-sm transition-colors ${
                  errors.name ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-slate-300 focus:border-secondary"
                }`}
                placeholder="Jean Dupont"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                Téléphone *
              </label>
              <input
                id="phone"
                type="tel"
                {...register("phone")}
                className={`block w-full rounded-md border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary sm:text-sm transition-colors ${
                  errors.phone ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-slate-300 focus:border-secondary"
                }`}
                placeholder="06 12 34 56 78"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email (optionnel)
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className={`block w-full rounded-md border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary sm:text-sm transition-colors ${
                errors.email ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-slate-300 focus:border-secondary"
              }`}
              placeholder="jean.dupont@exemple.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-slate-700 mb-1">
              Comment pouvons-nous vous aider ? *
            </label>
            <textarea
              id="reason"
              rows={4}
              {...register("reason")}
              className={`block w-full rounded-md border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-secondary sm:text-sm transition-colors ${
                errors.reason ? "border-red-300 focus:border-red-500 focus:ring-red-500" : "border-slate-300 focus:border-secondary"
              }`}
              placeholder="Décrivez brièvement votre besoin (ex: douleur dentaire, contrôle annuel, blanchiment...)"
            />
            {errors.reason && (
              <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center px-6 py-3.5 border border-transparent text-base font-medium rounded-lg text-white bg-secondary hover:bg-secondary-dark shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Envoi en cours...
                </>
              ) : (
                "Envoyer la demande"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
