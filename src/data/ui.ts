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
  services: string; blog: string; servicesTitle: string; servicesDesc: string; servicesIntro: string; servicesEyebrow: string;
  blogTitle: string; blogDesc: string; blogIntro: string; blogEyebrow: string; readArticle: string; seeService: string;
  included: string; how: string; howEyebrow: string; serviceGuides: string; ourServices: string; latestArticles: string;
  disclaimer: string; menu: string; close: string; language: string; previewNote: string;
  clusters: Record<string, string>;
  stats: [string, string][];
};

export const UI: Record<Lang, UI> = {
  fr: {
    home: "Accueil", guides: "Guides", signup: "Être rappelé", updated: "Mis à jour le", by: "par", read: "min de lecture",
    toc: "Au sommaire", essentials: "L'essentiel en 30 secondes", faq: "Vos questions, nos réponses", faqEyebrow: "Questions fréquentes",
    sources: "Sources officielles", related: "Continuez votre projet", relatedEyebrow: "À lire aussi", author: "L'auteur",
    heroCta: "Je veux être accompagné", heroNote: "Gratuit · 1 minute · Sans engagement", heroBadge: "Guide vérifié sur les sources officielles",
    midEyebrow: "Gagnez des mois", midTitle: "Ne faites pas tout ça seul.", midText: "Société, banque, visas, logement, études : START IN DUBAI s'occupe de tout, dans votre langue, avec un seul interlocuteur. Un conseiller vous rappelle pour un premier échange gratuit.", midBtn: "Je veux qu'on s'en occupe",
    profilesEyebrow: "Votre projet", profilesTitle: "Dites-nous qui vous êtes, on s'occupe du reste",
    guidesTitle: "Guides pour s'installer, investir et vivre à Dubaï", guidesDesc: "Tous les guides START IN DUBAI : s'installer à Dubaï, créer sa société, visas et Golden Visa, études, famille, banque, fiscalité, règles selon votre pays.",
    guidesIntro: "Tout ce qu'il faut savoir avant de s'installer à Dubaï et aux Émirats : société, visas, banque, écoles, études, fiscalité, et les règles propres à votre pays. Vérifié sur les sources officielles.",
    guidesEyebrow: "La bibliothèque START IN DUBAI", guidesCount: "guides", readGuide: "Lire le guide", allGuides: "Tous les guides",
    hubTitle: "Vous préférez qu'on vous explique de vive voix ?", hubText: "Un premier échange gratuit et sans engagement pour cadrer votre projet.",
    disclaimer: "Informations générales, à jour à la date indiquée. Les règles (visas, fiscalité, licences) évoluent : elles sont vérifiées avec vous avant toute démarche et ne remplacent pas un conseil juridique ou fiscal personnalisé.",
    menu: "Menu", close: "Fermer", language: "Langue", previewNote: "Aperçu privé : le site ouvre le 15 décembre 2026.",
    services: "Services", blog: "Blog", servicesTitle: "Nos services pour s'installer et investir à Dubaï", servicesDesc: "Création de société, Golden Visa et visas, compte bancaire, installation de la famille, études supérieures, immobilier : START IN DUBAI s'occupe de tout, de A à Z.", servicesIntro: "Un seul interlocuteur, dans votre langue, pour tout ce qu'il faut régler à Dubaï : on coordonne les démarches, vous gardez la main sur les décisions.", servicesEyebrow: "Ce que nous faisons pour vous",
    blogTitle: "Le blog START IN DUBAI", blogDesc: "Analyses et comparatifs pour réussir votre projet à Dubaï : société, fiscalité, visas, coût de la vie, retraite, santé, vérifiés sur les sources officielles.", blogIntro: "Comparatifs, coûts réels, règles officielles : les réponses détaillées aux questions qu'on nous pose chaque semaine.", blogEyebrow: "Analyses et comparatifs", readArticle: "Lire l'article", seeService: "Voir le service",
    included: "Ce que nous faisons pour vous", how: "Comment ça se passe", howEyebrow: "Le déroulé", serviceGuides: "Pour aller plus loin", ourServices: "Nos services", latestArticles: "Derniers articles",
    clusters: { installer: "S'installer", societe: "Créer sa société", visas: "Visas et résidence", famille: "Famille et écoles", etudes: "Études", travail: "Travailler", vie: "Vivre à Dubaï", argent: "Banque et impôts", investir: "Investir", pays: "Selon votre pays" },
    stats: [["0 %", "d'impôt sur le revenu des personnes"], ["100 %", "de votre société possible en zone franche"], ["6", "langues parlées par l'équipe"], ["1", "seul interlocuteur de A à Z"]],
  },
  en: {
    home: "Home", guides: "Guides", signup: "Get a call back", updated: "Updated", by: "by", read: "min read",
    toc: "In this guide", essentials: "The essentials in 30 seconds", faq: "Your questions, answered", faqEyebrow: "FAQ",
    sources: "Official sources", related: "Keep building your plan", relatedEyebrow: "Read next", author: "About the author",
    heroCta: "I want expert help", heroNote: "Free · 1 minute · No commitment", heroBadge: "Checked against official sources",
    midEyebrow: "Save months", midTitle: "Don't do all of this alone.", midText: "Company, bank, visas, housing, studies: START IN DUBAI handles everything, in your language, with one single contact. An adviser calls you back for a free first conversation.", midBtn: "Handle it for me",
    profilesEyebrow: "Your project", profilesTitle: "Tell us who you are, we take care of the rest",
    guidesTitle: "Guides to move, invest and live in Dubai", guidesDesc: "All START IN DUBAI guides: moving to Dubai, company formation, visas and Golden Visa, studies, family, banking, tax and rules by country.",
    guidesIntro: "Everything you need to know before moving to Dubai and the UAE: company, visas, banking, schools, studies, tax and the rules that apply to your country. Checked against official sources.",
    guidesEyebrow: "The START IN DUBAI library", guidesCount: "guides", readGuide: "Read the guide", allGuides: "All guides",
    hubTitle: "Rather talk it through?", hubText: "A free, no-commitment first call to frame your project.",
    disclaimer: "General information, accurate on the date shown. Rules (visas, tax, licences) change: they are checked with you before any step and do not replace personal legal or tax advice.",
    menu: "Menu", close: "Close", language: "Language", previewNote: "Private preview: the site opens on 15 December 2026.",
    services: "Services", blog: "Blog", servicesTitle: "Our services to move to and invest in Dubai", servicesDesc: "Company formation, Golden Visa and visas, bank account, family relocation, university studies, real estate: START IN DUBAI handles everything from A to Z.", servicesIntro: "One single contact, in your language, for everything you need to sort out in Dubai: we coordinate the steps, you keep control of the decisions.", servicesEyebrow: "What we do for you",
    blogTitle: "The START IN DUBAI blog", blogDesc: "Analysis and comparisons to make your Dubai project work: company, tax, visas, cost of living, retirement, health, checked against official sources.", blogIntro: "Comparisons, real costs, official rules: detailed answers to the questions we are asked every week.", blogEyebrow: "Analysis and comparisons", readArticle: "Read the article", seeService: "See the service",
    included: "What we do for you", how: "How it works", howEyebrow: "Step by step", serviceGuides: "Learn more", ourServices: "Our services", latestArticles: "Latest articles",
    clusters: { installer: "Moving to Dubai", societe: "Company formation", visas: "Visas and residence", famille: "Family and schools", etudes: "Studies", travail: "Working", vie: "Living in Dubai", argent: "Banking and tax", investir: "Investing", pays: "By country" },
    stats: [["0%", "personal income tax"], ["100%", "foreign ownership in free zones"], ["6", "languages spoken by the team"], ["1", "single contact from A to Z"]],
  },
  ar: {
    home: "الرئيسية", guides: "الأدلة", signup: "اطلبوا اتصالًا", updated: "آخر تحديث", by: "بقلم", read: "دقائق قراءة",
    toc: "محتويات الدليل", essentials: "الأهم في 30 ثانية", faq: "أسئلتكم وأجوبتنا", faqEyebrow: "أسئلة شائعة",
    sources: "المصادر الرسمية", related: "تابعوا مشروعكم", relatedEyebrow: "اقرأ أيضًا", author: "عن الكاتب",
    heroCta: "أريد مرافقة متخصصة", heroNote: "مجاني · دقيقة واحدة · دون أي التزام", heroBadge: "دليل تم التحقق منه من المصادر الرسمية",
    midEyebrow: "وفّروا أشهرًا", midTitle: "لا تقوموا بكل هذا وحدكم.", midText: "الشركة، البنك، التأشيرات، السكن، الدراسة: START IN DUBAI يتولى كل شيء بلغتكم ومع جهة تواصل واحدة. يتصل بكم مستشار لمحادثة أولى مجانية.", midBtn: "أريد أن تتولوا الأمر",
    profilesEyebrow: "مشروعكم", profilesTitle: "أخبرونا من أنتم، ونحن نتولى الباقي",
    guidesTitle: "أدلة الاستقرار والاستثمار والعيش في دبي", guidesDesc: "جميع أدلة START IN DUBAI: الانتقال إلى دبي، تأسيس شركة، التأشيرات والإقامة الذهبية، الدراسة، العائلة، البنوك، الضرائب والقواعد حسب بلدكم.",
    guidesIntro: "كل ما يجب معرفته قبل الاستقرار في دبي والإمارات: الشركة، التأشيرات، البنك، المدارس، الدراسة، الضرائب والقواعد الخاصة ببلدكم. تم التحقق منها من المصادر الرسمية.",
    guidesEyebrow: "مكتبة START IN DUBAI", guidesCount: "دليلًا", readGuide: "اقرأ الدليل", allGuides: "جميع الأدلة",
    hubTitle: "تفضلون أن نشرح لكم مباشرة؟", hubText: "مكالمة أولى مجانية ودون أي التزام لتحديد مشروعكم.",
    disclaimer: "معلومات عامة صحيحة في التاريخ المذكور. القواعد (التأشيرات، الضرائب، التراخيص) تتغير: نتحقق منها معكم قبل أي خطوة، وهي لا تغني عن استشارة قانونية أو ضريبية شخصية.",
    menu: "القائمة", close: "إغلاق", language: "اللغة", previewNote: "معاينة خاصة: يفتح الموقع في 15 ديسمبر 2026.",
    services: "الخدمات", blog: "المدونة", servicesTitle: "خدماتنا للاستقرار والاستثمار في دبي", servicesDesc: "تأسيس الشركات، الإقامة الذهبية والتأشيرات، الحساب البنكي، استقرار العائلة، الدراسة الجامعية، العقار: START IN DUBAI يتولى كل شيء من الألف إلى الياء.", servicesIntro: "جهة تواصل واحدة وبلغتكم لكل ما يجب إنجازه في دبي: ننسّق الإجراءات وتبقى القرارات بأيديكم.", servicesEyebrow: "ما نقوم به من أجلكم",
    blogTitle: "مدونة START IN DUBAI", blogDesc: "تحليلات ومقارنات لإنجاح مشروعكم في دبي: الشركة، الضرائب، التأشيرات، تكلفة المعيشة، التقاعد، الصحة، مع التحقق من المصادر الرسمية.", blogIntro: "مقارنات وتكاليف حقيقية وقواعد رسمية: إجابات مفصلة عن الأسئلة التي تُطرح علينا كل أسبوع.", blogEyebrow: "تحليلات ومقارنات", readArticle: "اقرأ المقال", seeService: "اكتشف الخدمة",
    included: "ما نقوم به من أجلكم", how: "كيف تسير الأمور", howEyebrow: "الخطوات", serviceGuides: "لمعرفة المزيد", ourServices: "خدماتنا", latestArticles: "أحدث المقالات",
    clusters: { installer: "الاستقرار في دبي", societe: "تأسيس شركة", visas: "التأشيرات والإقامة", famille: "العائلة والمدارس", etudes: "الدراسة", travail: "العمل", vie: "العيش في دبي", argent: "البنوك والضرائب", investir: "الاستثمار", pays: "حسب بلدكم" },
    stats: [["0%", "ضريبة على دخل الأفراد"], ["100%", "تملك كامل لشركتكم في المناطق الحرة"], ["6", "لغات يتحدثها الفريق"], ["1", "جهة تواصل واحدة من الألف إلى الياء"]],
  },
  es: {
    home: "Inicio", guides: "Guías", signup: "Que me llamen", updated: "Actualizado el", by: "por", read: "min de lectura",
    toc: "En esta guía", essentials: "Lo esencial en 30 segundos", faq: "Tus preguntas, nuestras respuestas", faqEyebrow: "Preguntas frecuentes",
    sources: "Fuentes oficiales", related: "Sigue con tu proyecto", relatedEyebrow: "Lee también", author: "El autor",
    heroCta: "Quiero que me acompañen", heroNote: "Gratis · 1 minuto · Sin compromiso", heroBadge: "Guía verificada con fuentes oficiales",
    midEyebrow: "Ahorra meses", midTitle: "No hagas todo esto solo.", midText: "Empresa, banco, visados, vivienda, estudios: START IN DUBAI se encarga de todo, en tu idioma y con un solo interlocutor. Un asesor te llama para una primera conversación gratuita.", midBtn: "Quiero que se encarguen",
    profilesEyebrow: "Tu proyecto", profilesTitle: "Dinos quién eres y nosotros nos encargamos del resto",
    guidesTitle: "Guías para mudarse, invertir y vivir en Dubái", guidesDesc: "Todas las guías de START IN DUBAI: mudarse a Dubái, crear empresa, visados y Golden Visa, estudios, familia, banca, impuestos y normas según tu país.",
    guidesIntro: "Todo lo que hay que saber antes de instalarse en Dubái y los Emiratos: empresa, visados, banco, colegios, estudios, impuestos y las normas de tu país. Verificado con fuentes oficiales.",
    guidesEyebrow: "La biblioteca START IN DUBAI", guidesCount: "guías", readGuide: "Leer la guía", allGuides: "Todas las guías",
    hubTitle: "¿Prefieres que te lo expliquemos?", hubText: "Una primera conversación gratuita y sin compromiso para definir tu proyecto.",
    disclaimer: "Información general, vigente en la fecha indicada. Las normas (visados, impuestos, licencias) cambian: las verificamos contigo antes de cualquier trámite y no sustituyen un asesoramiento jurídico o fiscal personalizado.",
    menu: "Menú", close: "Cerrar", language: "Idioma", previewNote: "Vista previa privada: el sitio abre el 15 de diciembre de 2026.",
    services: "Servicios", blog: "Blog", servicesTitle: "Nuestros servicios para instalarte e invertir en Dubái", servicesDesc: "Creación de empresa, Golden Visa y visados, cuenta bancaria, instalación de la familia, estudios universitarios, inmobiliario: START IN DUBAI se encarga de todo, de la A a la Z.", servicesIntro: "Un solo interlocutor, en tu idioma, para todo lo que hay que resolver en Dubái: coordinamos los trámites y tú conservas el control de las decisiones.", servicesEyebrow: "Lo que hacemos por ti",
    blogTitle: "El blog de START IN DUBAI", blogDesc: "Análisis y comparativas para que tu proyecto en Dubái salga bien: empresa, impuestos, visados, coste de vida, jubilación, salud, verificados en fuentes oficiales.", blogIntro: "Comparativas, costes reales, normas oficiales: respuestas detalladas a las preguntas que nos hacen cada semana.", blogEyebrow: "Análisis y comparativas", readArticle: "Leer el artículo", seeService: "Ver el servicio",
    included: "Lo que hacemos por ti", how: "Cómo funciona", howEyebrow: "Paso a paso", serviceGuides: "Para saber más", ourServices: "Nuestros servicios", latestArticles: "Últimos artículos",
    clusters: { installer: "Mudarse a Dubái", societe: "Crear empresa", visas: "Visados y residencia", famille: "Familia y colegios", etudes: "Estudios", travail: "Trabajar", vie: "Vivir en Dubái", argent: "Banca e impuestos", investir: "Invertir", pays: "Según tu país" },
    stats: [["0 %", "de impuesto sobre la renta personal"], ["100 %", "de tu empresa en zona franca"], ["6", "idiomas en el equipo"], ["1", "solo interlocutor de la A a la Z"]],
  },
  nl: {
    home: "Home", guides: "Gidsen", signup: "Bel mij terug", updated: "Bijgewerkt op", by: "door", read: "min lezen",
    toc: "In deze gids", essentials: "Het belangrijkste in 30 seconden", faq: "Uw vragen, onze antwoorden", faqEyebrow: "Veelgestelde vragen",
    sources: "Officiële bronnen", related: "Werk verder aan uw plan", relatedEyebrow: "Lees ook", author: "Over de auteur",
    heroCta: "Ik wil begeleiding", heroNote: "Gratis · 1 minuut · Vrijblijvend", heroBadge: "Gecontroleerd met officiële bronnen",
    midEyebrow: "Bespaar maanden", midTitle: "Doe dit niet allemaal alleen.", midText: "Bedrijf, bank, visa, woning, studie: START IN DUBAI regelt alles, in uw taal, met één aanspreekpunt. Een adviseur belt u terug voor een eerste gratis gesprek.", midBtn: "Regel het voor mij",
    profilesEyebrow: "Uw project", profilesTitle: "Vertel ons wie u bent, wij regelen de rest",
    guidesTitle: "Gidsen om te emigreren, investeren en wonen in Dubai", guidesDesc: "Alle gidsen van START IN DUBAI: emigreren naar Dubai, bedrijf oprichten, visa en Golden Visa, studie, gezin, bank, belasting en regels per land.",
    guidesIntro: "Alles wat u moet weten voordat u naar Dubai en de Emiraten verhuist: bedrijf, visa, bank, scholen, studie, belasting en de regels voor uw land. Gecontroleerd met officiële bronnen.",
    guidesEyebrow: "De bibliotheek van START IN DUBAI", guidesCount: "gidsen", readGuide: "Lees de gids", allGuides: "Alle gidsen",
    hubTitle: "Liever persoonlijk uitleg?", hubText: "Een eerste gratis en vrijblijvend gesprek om uw project af te bakenen.",
    disclaimer: "Algemene informatie, actueel op de vermelde datum. Regels (visa, belasting, licenties) veranderen: we controleren ze met u vóór elke stap en ze vervangen geen persoonlijk juridisch of fiscaal advies.",
    menu: "Menu", close: "Sluiten", language: "Taal", previewNote: "Privévoorbeeld: de site opent op 15 december 2026.",
    services: "Diensten", blog: "Blog", servicesTitle: "Onze diensten om te verhuizen naar en te investeren in Dubai", servicesDesc: "Bedrijf oprichten, Golden Visa en visa, bankrekening, verhuizing van het gezin, universitaire studie, vastgoed: START IN DUBAI regelt alles van A tot Z.", servicesIntro: "Eén aanspreekpunt, in uw taal, voor alles wat u in Dubai moet regelen: wij coördineren de stappen, u houdt de beslissingen in handen.", servicesEyebrow: "Wat wij voor u doen",
    blogTitle: "De blog van START IN DUBAI", blogDesc: "Analyses en vergelijkingen voor een geslaagd project in Dubai: bedrijf, belasting, visa, kosten van levensonderhoud, pensioen, gezondheid, gecontroleerd met officiële bronnen.", blogIntro: "Vergelijkingen, echte kosten, officiële regels: uitgebreide antwoorden op de vragen die we elke week krijgen.", blogEyebrow: "Analyses en vergelijkingen", readArticle: "Lees het artikel", seeService: "Bekijk de dienst",
    included: "Wat wij voor u doen", how: "Zo werkt het", howEyebrow: "Stap voor stap", serviceGuides: "Meer weten", ourServices: "Onze diensten", latestArticles: "Laatste artikelen",
    clusters: { installer: "Emigreren naar Dubai", societe: "Bedrijf oprichten", visas: "Visa en verblijf", famille: "Gezin en scholen", etudes: "Studeren", travail: "Werken", vie: "Wonen in Dubai", argent: "Bank en belasting", investir: "Investeren", pays: "Per land" },
    stats: [["0%", "inkomstenbelasting voor particulieren"], ["100%", "eigendom van uw bedrijf in vrije zones"], ["6", "talen in het team"], ["1", "aanspreekpunt van A tot Z"]],
  },
  it: {
    home: "Home", guides: "Guide", signup: "Richiamami", updated: "Aggiornato il", by: "di", read: "min di lettura",
    toc: "In questa guida", essentials: "L'essenziale in 30 secondi", faq: "Le tue domande, le nostre risposte", faqEyebrow: "Domande frequenti",
    sources: "Fonti ufficiali", related: "Vai avanti con il tuo progetto", relatedEyebrow: "Leggi anche", author: "L'autore",
    heroCta: "Voglio essere accompagnato", heroNote: "Gratis · 1 minuto · Senza impegno", heroBadge: "Guida verificata sulle fonti ufficiali",
    midEyebrow: "Risparmia mesi", midTitle: "Non fare tutto da solo.", midText: "Società, banca, visti, casa, studi: START IN DUBAI si occupa di tutto, nella tua lingua, con un solo referente. Un consulente ti richiama per un primo scambio gratuito.", midBtn: "Voglio che se ne occupino loro",
    profilesEyebrow: "Il tuo progetto", profilesTitle: "Dicci chi sei, al resto pensiamo noi",
    guidesTitle: "Guide per trasferirsi, investire e vivere a Dubai", guidesDesc: "Tutte le guide di START IN DUBAI: trasferirsi a Dubai, aprire una società, visti e Golden Visa, studi, famiglia, banca, tasse e regole per paese.",
    guidesIntro: "Tutto quello che c'è da sapere prima di trasferirsi a Dubai e negli Emirati: società, visti, banca, scuole, studi, tasse e le regole del tuo paese. Verificato sulle fonti ufficiali.",
    guidesEyebrow: "La biblioteca START IN DUBAI", guidesCount: "guide", readGuide: "Leggi la guida", allGuides: "Tutte le guide",
    hubTitle: "Preferisci parlarne a voce?", hubText: "Un primo scambio gratuito e senza impegno per inquadrare il tuo progetto.",
    disclaimer: "Informazioni generali, aggiornate alla data indicata. Le regole (visti, tasse, licenze) cambiano: le verifichiamo con te prima di ogni passo e non sostituiscono una consulenza legale o fiscale personalizzata.",
    menu: "Menu", close: "Chiudi", language: "Lingua", previewNote: "Anteprima privata: il sito apre il 15 dicembre 2026.",
    services: "Servizi", blog: "Blog", servicesTitle: "I nostri servizi per trasferirsi e investire a Dubai", servicesDesc: "Apertura di società, Golden Visa e visti, conto bancario, trasferimento della famiglia, studi universitari, immobiliare: START IN DUBAI si occupa di tutto, dalla A alla Z.", servicesIntro: "Un solo referente, nella tua lingua, per tutto ciò che c'è da sistemare a Dubai: coordiniamo le pratiche, tu mantieni il controllo delle decisioni.", servicesEyebrow: "Cosa facciamo per te",
    blogTitle: "Il blog di START IN DUBAI", blogDesc: "Analisi e confronti per far riuscire il tuo progetto a Dubai: società, tasse, visti, costo della vita, pensione, salute, verificati sulle fonti ufficiali.", blogIntro: "Confronti, costi reali, regole ufficiali: risposte dettagliate alle domande che ci fanno ogni settimana.", blogEyebrow: "Analisi e confronti", readArticle: "Leggi l'articolo", seeService: "Scopri il servizio",
    included: "Cosa facciamo per te", how: "Come funziona", howEyebrow: "Passo dopo passo", serviceGuides: "Per approfondire", ourServices: "I nostri servizi", latestArticles: "Ultimi articoli",
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
