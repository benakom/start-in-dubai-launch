// Textes d'interface du site (hors page de lancement, qui a ses propres fichiers dans i18n/).
// Les blocs repris de la page de lancement (profils, étapes, offre, fondateur, dernier appel) lisent i18n/<langue>.json.
import type { Lang } from "../content.config";

export const LOCALES: Record<Lang, string> = { fr: "fr-FR", ar: "ar-AE", en: "en-GB", es: "es-ES", nl: "nl-NL", it: "it-IT" };
export const OG_LOCALE: Record<Lang, string> = { fr: "fr_FR", ar: "ar_AE", en: "en_GB", es: "es_ES", nl: "nl_NL", it: "it_IT" };
export const LANG_NAMES: Record<Lang, string> = { fr: "Français", ar: "العربية", en: "English", es: "Español", nl: "Nederlands", it: "Italiano" };

type UI = {
  home: string; guides: string; signup: string; updated: string; by: string; read: string;
  toc: string; essentials: string; faq: string; faqEyebrow: string; sources: string; related: string; relatedEyebrow: string; author: string;
  heroCta: string; heroNote: string; heroBadge: string;
  midEyebrow: string; midTitle: string; midText: string; midBtn: string;
  profilesEyebrow: string; profilesTitle: string;
  guidesTitle: string; guidesDesc: string; guidesIntro: string; guidesEyebrow: string; guidesCount: string; readGuide: string; allGuides: string;
  hubTitle: string; hubText: string;
  disclaimer: string; menu: string; close: string; language: string; previewNote: string;
  clusters: Record<string, string>;
  stats: [string, string][];
};

export const UI: Record<Lang, UI> = {
  fr: {
    home: "Accueil", guides: "Guides", signup: "Je m'inscris", updated: "Mis à jour le", by: "par", read: "min de lecture",
    toc: "Au sommaire", essentials: "L'essentiel en 30 secondes", faq: "Vos questions, nos réponses", faqEyebrow: "Questions fréquentes",
    sources: "Sources officielles", related: "Continuez votre projet", relatedEyebrow: "À lire aussi", author: "L'auteur",
    heroCta: "Je veux être accompagné", heroNote: "Gratuit · 1 minute · Sans engagement", heroBadge: "Guide vérifié sur les sources officielles",
    midEyebrow: "Gagnez des mois", midTitle: "Ne faites pas tout ça seul.", midText: "Société, banque, visas, logement, études : START IN DUBAI s'occupe de tout, dans votre langue, avec un seul interlocuteur. Inscrivez-vous en avant-première, vous serez rappelé en priorité.", midBtn: "Je veux qu'on s'en occupe",
    profilesEyebrow: "Votre projet", profilesTitle: "Dites-nous qui vous êtes, on s'occupe du reste",
    guidesTitle: "Guides pour s'installer, investir et vivre à Dubaï", guidesDesc: "Tous les guides START IN DUBAI : s'installer à Dubaï, créer sa société, visas et Golden Visa, études, famille, banque, fiscalité, règles selon votre pays.",
    guidesIntro: "Tout ce qu'il faut savoir avant de s'installer à Dubaï et aux Émirats : société, visas, banque, écoles, études, fiscalité, et les règles propres à votre pays. Vérifié sur les sources officielles.",
    guidesEyebrow: "La bibliothèque START IN DUBAI", guidesCount: "guides", readGuide: "Lire le guide", allGuides: "Tous les guides",
    hubTitle: "Vous préférez qu'on vous explique de vive voix ?", hubText: "Un premier échange gratuit pour cadrer votre projet. Les premiers inscrits sont rappelés les premiers.",
    disclaimer: "Informations générales, à jour à la date indiquée. Les règles (visas, fiscalité, licences) évoluent : elles sont vérifiées avec vous avant toute démarche et ne remplacent pas un conseil juridique ou fiscal personnalisé.",
    menu: "Menu", close: "Fermer", language: "Langue", previewNote: "Aperçu privé : le site ouvre le 15 décembre 2026.",
    clusters: { installer: "S'installer", societe: "Créer sa société", visas: "Visas et résidence", famille: "Famille et écoles", etudes: "Études", travail: "Travailler", vie: "Vivre à Dubaï", argent: "Banque et impôts", investir: "Investir", pays: "Selon votre pays" },
    stats: [["0 %", "d'impôt sur le revenu des personnes"], ["100 %", "de votre société possible en zone franche"], ["6", "langues parlées par l'équipe"], ["1", "seul interlocuteur de A à Z"]],
  },
  en: {
    home: "Home", guides: "Guides", signup: "Sign up", updated: "Updated", by: "by", read: "min read",
    toc: "In this guide", essentials: "The essentials in 30 seconds", faq: "Your questions, answered", faqEyebrow: "FAQ",
    sources: "Official sources", related: "Keep building your plan", relatedEyebrow: "Read next", author: "About the author",
    heroCta: "I want expert help", heroNote: "Free · 1 minute · No commitment", heroBadge: "Checked against official sources",
    midEyebrow: "Save months", midTitle: "Don't do all of this alone.", midText: "Company, bank, visas, housing, studies: START IN DUBAI handles everything, in your language, with one single contact. Join the early list and get a priority call back.", midBtn: "Handle it for me",
    profilesEyebrow: "Your project", profilesTitle: "Tell us who you are, we take care of the rest",
    guidesTitle: "Guides to move, invest and live in Dubai", guidesDesc: "All START IN DUBAI guides: moving to Dubai, company formation, visas and Golden Visa, studies, family, banking, tax and rules by country.",
    guidesIntro: "Everything you need to know before moving to Dubai and the UAE: company, visas, banking, schools, studies, tax and the rules that apply to your country. Checked against official sources.",
    guidesEyebrow: "The START IN DUBAI library", guidesCount: "guides", readGuide: "Read the guide", allGuides: "All guides",
    hubTitle: "Rather talk it through?", hubText: "A first free call to frame your project. Early sign-ups are called back first.",
    disclaimer: "General information, accurate on the date shown. Rules (visas, tax, licences) change: they are checked with you before any step and do not replace personal legal or tax advice.",
    menu: "Menu", close: "Close", language: "Language", previewNote: "Private preview: the site opens on 15 December 2026.",
    clusters: { installer: "Moving to Dubai", societe: "Company formation", visas: "Visas and residence", famille: "Family and schools", etudes: "Studies", travail: "Working", vie: "Living in Dubai", argent: "Banking and tax", investir: "Investing", pays: "By country" },
    stats: [["0%", "personal income tax"], ["100%", "foreign ownership in free zones"], ["6", "languages spoken by the team"], ["1", "single contact from A to Z"]],
  },
  ar: {
    home: "الرئيسية", guides: "الأدلة", signup: "سجّل الآن", updated: "آخر تحديث", by: "بقلم", read: "دقائق قراءة",
    toc: "محتويات الدليل", essentials: "الأهم في 30 ثانية", faq: "أسئلتكم وأجوبتنا", faqEyebrow: "أسئلة شائعة",
    sources: "المصادر الرسمية", related: "تابعوا مشروعكم", relatedEyebrow: "اقرأ أيضًا", author: "عن الكاتب",
    heroCta: "أريد مرافقة متخصصة", heroNote: "مجاني · دقيقة واحدة · دون أي التزام", heroBadge: "دليل تم التحقق منه من المصادر الرسمية",
    midEyebrow: "وفّروا أشهرًا", midTitle: "لا تقوموا بكل هذا وحدكم.", midText: "الشركة، البنك، التأشيرات، السكن، الدراسة: START IN DUBAI يتولى كل شيء بلغتكم ومع جهة تواصل واحدة. سجّلوا قبل الافتتاح واحصلوا على أولوية الاتصال.", midBtn: "أريد أن تتولوا الأمر",
    profilesEyebrow: "مشروعكم", profilesTitle: "أخبرونا من أنتم، ونحن نتولى الباقي",
    guidesTitle: "أدلة الاستقرار والاستثمار والعيش في دبي", guidesDesc: "جميع أدلة START IN DUBAI: الانتقال إلى دبي، تأسيس شركة، التأشيرات والإقامة الذهبية، الدراسة، العائلة، البنوك، الضرائب والقواعد حسب بلدكم.",
    guidesIntro: "كل ما يجب معرفته قبل الاستقرار في دبي والإمارات: الشركة، التأشيرات، البنك، المدارس، الدراسة، الضرائب والقواعد الخاصة ببلدكم. تم التحقق منها من المصادر الرسمية.",
    guidesEyebrow: "مكتبة START IN DUBAI", guidesCount: "دليلًا", readGuide: "اقرأ الدليل", allGuides: "جميع الأدلة",
    hubTitle: "تفضلون أن نشرح لكم مباشرة؟", hubText: "مكالمة أولى مجانية لتحديد مشروعكم. أول المسجلين يُتصل بهم أولًا.",
    disclaimer: "معلومات عامة صحيحة في التاريخ المذكور. القواعد (التأشيرات، الضرائب، التراخيص) تتغير: نتحقق منها معكم قبل أي خطوة، وهي لا تغني عن استشارة قانونية أو ضريبية شخصية.",
    menu: "القائمة", close: "إغلاق", language: "اللغة", previewNote: "معاينة خاصة: يفتح الموقع في 15 ديسمبر 2026.",
    clusters: { installer: "الاستقرار في دبي", societe: "تأسيس شركة", visas: "التأشيرات والإقامة", famille: "العائلة والمدارس", etudes: "الدراسة", travail: "العمل", vie: "العيش في دبي", argent: "البنوك والضرائب", investir: "الاستثمار", pays: "حسب بلدكم" },
    stats: [["0%", "ضريبة على دخل الأفراد"], ["100%", "تملك كامل لشركتكم في المناطق الحرة"], ["6", "لغات يتحدثها الفريق"], ["1", "جهة تواصل واحدة من الألف إلى الياء"]],
  },
  es: {
    home: "Inicio", guides: "Guías", signup: "Me apunto", updated: "Actualizado el", by: "por", read: "min de lectura",
    toc: "En esta guía", essentials: "Lo esencial en 30 segundos", faq: "Tus preguntas, nuestras respuestas", faqEyebrow: "Preguntas frecuentes",
    sources: "Fuentes oficiales", related: "Sigue con tu proyecto", relatedEyebrow: "Lee también", author: "El autor",
    heroCta: "Quiero que me acompañen", heroNote: "Gratis · 1 minuto · Sin compromiso", heroBadge: "Guía verificada con fuentes oficiales",
    midEyebrow: "Ahorra meses", midTitle: "No hagas todo esto solo.", midText: "Empresa, banco, visados, vivienda, estudios: START IN DUBAI se encarga de todo, en tu idioma y con un solo interlocutor. Apúntate antes de la apertura y te llamaremos con prioridad.", midBtn: "Quiero que se encarguen",
    profilesEyebrow: "Tu proyecto", profilesTitle: "Dinos quién eres y nosotros nos encargamos del resto",
    guidesTitle: "Guías para mudarse, invertir y vivir en Dubái", guidesDesc: "Todas las guías de START IN DUBAI: mudarse a Dubái, crear empresa, visados y Golden Visa, estudios, familia, banca, impuestos y normas según tu país.",
    guidesIntro: "Todo lo que hay que saber antes de instalarse en Dubái y los Emiratos: empresa, visados, banco, colegios, estudios, impuestos y las normas de tu país. Verificado con fuentes oficiales.",
    guidesEyebrow: "La biblioteca START IN DUBAI", guidesCount: "guías", readGuide: "Leer la guía", allGuides: "Todas las guías",
    hubTitle: "¿Prefieres que te lo expliquemos?", hubText: "Una primera conversación gratuita para definir tu proyecto. Los primeros inscritos reciben la llamada primero.",
    disclaimer: "Información general, vigente en la fecha indicada. Las normas (visados, impuestos, licencias) cambian: las verificamos contigo antes de cualquier trámite y no sustituyen un asesoramiento jurídico o fiscal personalizado.",
    menu: "Menú", close: "Cerrar", language: "Idioma", previewNote: "Vista previa privada: el sitio abre el 15 de diciembre de 2026.",
    clusters: { installer: "Mudarse a Dubái", societe: "Crear empresa", visas: "Visados y residencia", famille: "Familia y colegios", etudes: "Estudios", travail: "Trabajar", vie: "Vivir en Dubái", argent: "Banca e impuestos", investir: "Invertir", pays: "Según tu país" },
    stats: [["0 %", "de impuesto sobre la renta personal"], ["100 %", "de tu empresa en zona franca"], ["6", "idiomas en el equipo"], ["1", "solo interlocutor de la A a la Z"]],
  },
  nl: {
    home: "Home", guides: "Gidsen", signup: "Inschrijven", updated: "Bijgewerkt op", by: "door", read: "min lezen",
    toc: "In deze gids", essentials: "Het belangrijkste in 30 seconden", faq: "Uw vragen, onze antwoorden", faqEyebrow: "Veelgestelde vragen",
    sources: "Officiële bronnen", related: "Werk verder aan uw plan", relatedEyebrow: "Lees ook", author: "Over de auteur",
    heroCta: "Ik wil begeleiding", heroNote: "Gratis · 1 minuut · Vrijblijvend", heroBadge: "Gecontroleerd met officiële bronnen",
    midEyebrow: "Bespaar maanden", midTitle: "Doe dit niet allemaal alleen.", midText: "Bedrijf, bank, visa, woning, studie: START IN DUBAI regelt alles, in uw taal, met één aanspreekpunt. Schrijf u in vóór de opening en u wordt met voorrang gebeld.", midBtn: "Regel het voor mij",
    profilesEyebrow: "Uw project", profilesTitle: "Vertel ons wie u bent, wij regelen de rest",
    guidesTitle: "Gidsen om te emigreren, investeren en wonen in Dubai", guidesDesc: "Alle gidsen van START IN DUBAI: emigreren naar Dubai, bedrijf oprichten, visa en Golden Visa, studie, gezin, bank, belasting en regels per land.",
    guidesIntro: "Alles wat u moet weten voordat u naar Dubai en de Emiraten verhuist: bedrijf, visa, bank, scholen, studie, belasting en de regels voor uw land. Gecontroleerd met officiële bronnen.",
    guidesEyebrow: "De bibliotheek van START IN DUBAI", guidesCount: "gidsen", readGuide: "Lees de gids", allGuides: "Alle gidsen",
    hubTitle: "Liever persoonlijk uitleg?", hubText: "Een eerste gratis gesprek om uw project af te bakenen. Wie zich eerst inschrijft, wordt eerst gebeld.",
    disclaimer: "Algemene informatie, actueel op de vermelde datum. Regels (visa, belasting, licenties) veranderen: we controleren ze met u vóór elke stap en ze vervangen geen persoonlijk juridisch of fiscaal advies.",
    menu: "Menu", close: "Sluiten", language: "Taal", previewNote: "Privévoorbeeld: de site opent op 15 december 2026.",
    clusters: { installer: "Emigreren naar Dubai", societe: "Bedrijf oprichten", visas: "Visa en verblijf", famille: "Gezin en scholen", etudes: "Studeren", travail: "Werken", vie: "Wonen in Dubai", argent: "Bank en belasting", investir: "Investeren", pays: "Per land" },
    stats: [["0%", "inkomstenbelasting voor particulieren"], ["100%", "eigendom van uw bedrijf in vrije zones"], ["6", "talen in het team"], ["1", "aanspreekpunt van A tot Z"]],
  },
  it: {
    home: "Home", guides: "Guide", signup: "Mi iscrivo", updated: "Aggiornato il", by: "di", read: "min di lettura",
    toc: "In questa guida", essentials: "L'essenziale in 30 secondi", faq: "Le tue domande, le nostre risposte", faqEyebrow: "Domande frequenti",
    sources: "Fonti ufficiali", related: "Vai avanti con il tuo progetto", relatedEyebrow: "Leggi anche", author: "L'autore",
    heroCta: "Voglio essere accompagnato", heroNote: "Gratis · 1 minuto · Senza impegno", heroBadge: "Guida verificata sulle fonti ufficiali",
    midEyebrow: "Risparmia mesi", midTitle: "Non fare tutto da solo.", midText: "Società, banca, visti, casa, studi: START IN DUBAI si occupa di tutto, nella tua lingua, con un solo referente. Iscriviti prima dell'apertura e verrai richiamato con priorità.", midBtn: "Voglio che se ne occupino loro",
    profilesEyebrow: "Il tuo progetto", profilesTitle: "Dicci chi sei, al resto pensiamo noi",
    guidesTitle: "Guide per trasferirsi, investire e vivere a Dubai", guidesDesc: "Tutte le guide di START IN DUBAI: trasferirsi a Dubai, aprire una società, visti e Golden Visa, studi, famiglia, banca, tasse e regole per paese.",
    guidesIntro: "Tutto quello che c'è da sapere prima di trasferirsi a Dubai e negli Emirati: società, visti, banca, scuole, studi, tasse e le regole del tuo paese. Verificato sulle fonti ufficiali.",
    guidesEyebrow: "La biblioteca START IN DUBAI", guidesCount: "guide", readGuide: "Leggi la guida", allGuides: "Tutte le guide",
    hubTitle: "Preferisci parlarne a voce?", hubText: "Un primo scambio gratuito per inquadrare il tuo progetto. I primi iscritti vengono richiamati per primi.",
    disclaimer: "Informazioni generali, aggiornate alla data indicata. Le regole (visti, tasse, licenze) cambiano: le verifichiamo con te prima di ogni passo e non sostituiscono una consulenza legale o fiscale personalizzata.",
    menu: "Menu", close: "Chiudi", language: "Lingua", previewNote: "Anteprima privata: il sito apre il 15 dicembre 2026.",
    clusters: { installer: "Trasferirsi a Dubai", societe: "Aprire una società", visas: "Visti e residenza", famille: "Famiglia e scuole", etudes: "Studi", travail: "Lavorare", vie: "Vivere a Dubai", argent: "Banca e tasse", investir: "Investire", pays: "Per paese" },
    stats: [["0%", "di imposta sul reddito personale"], ["100%", "della tua società in zona franca"], ["6", "lingue parlate dal team"], ["1", "solo referente dalla A alla Z"]],
  },
};

// Illustration par thème (remplaçables par des photos sous licence dans public/assets/img/themes/).
export const CLUSTER_IMG: Record<string, string> = {
  installer: "/assets/img/og.jpg", societe: "/assets/img/entrepreneur.webp", visas: "/assets/img/og.jpg", famille: "/assets/img/famille.webp",
  etudes: "/assets/img/etudiant.webp", travail: "/assets/img/entrepreneur.webp", vie: "/assets/img/og.jpg", argent: "/assets/img/investisseur.webp",
  investir: "/assets/img/investisseur.webp", pays: "/assets/img/og.jpg",
};
