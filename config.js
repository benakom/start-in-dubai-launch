/* Réglages de la page de lancement START IN DUBAI. C'est le seul fichier à modifier. */
window.SID_CONFIG = {
  // Ouverture (heure de Dubaï, UTC+4)
  launchDate: "2026-12-15T00:00:00+04:00",

  // Chaque inscription est envoyée en JSON (POST) à cette adresse : le webhook Oleadoo qui reçoit les leads.
  // Vide = rien n'est envoyé (mode test). NE PAS partager le lien tant que ce champ est vide.
  leadWebhookUrl: "",

  // Suivi facultatif
  ga4Id: "",          // ex. "G-XXXXXXX"
  metaPixelId: "",    // ex. "123456789012345"
};
