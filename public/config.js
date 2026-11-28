/* Réglages de la page de lancement Start in Dubai. C'est le seul fichier à modifier. */
window.SID_CONFIG = {
  // Ouverture (heure de Dubaï, UTC+4)
  launchDate: "2026-12-15T00:00:00+04:00",

  // Envoi des inscriptions vers Oleadoo (CRM de Cevitas).
  // Chaque inscription est enregistrée dans la table « leads » de Cevitas (comme les formulaires de cevitas.ae).
  // Cevitas la transmet ensuite toute seule à Oleadoo (file crm_outbox, toutes les 5 minutes)
  // et envoie un e-mail de notification à l'équipe.
  // La clé ci-dessous est la clé publique de cevitas.ae : elle permet seulement d'ajouter un lead, pas de les lire.
  crm: {
    supabaseUrl: "https://rrpwdkjrmhtroarfzzsk.supabase.co",
    publishableKey: "sb_publishable_c9-iKRHcZT7103OWqziw0Q_XnaAx16M",
    source: "start-in-dubai",     // canal du lead dans Oleadoo
    tag: "Start in Dubai",        // tag écrit en tête des notes du lead
    notifyEmail: true,            // e-mail « New Lead » à l'équipe Cevitas
  },

  // Facultatif : envoyer aussi chaque inscription en JSON (POST) à un autre webhook (Make, n8n…). Vide = non.
  leadWebhookUrl: "",

  // Suivi facultatif
  ga4Id: "",          // ex. "G-XXXXXXX"
  metaPixelId: "1622523129009936",    // pixel Start in Dubai (portefeuille Cevitas Real Estate LLC), chargé seulement après accord du visiteur
};
