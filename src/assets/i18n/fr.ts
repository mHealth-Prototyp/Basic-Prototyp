export default {
  common: {
    save: 'sauvegarder',
    loadDefault: 'charger les valeurs par défaut',
    language: 'Langue',
    allergy: 'allergie',
    intolerance: 'intolérance',
    month0: 'janvier',
    month1: 'février',
    month2: 'mars',
    month3: 'avril',
    month4: 'mai',
    month5: 'juin',
    mois6: 'juillet',
    mois7: 'août',
    mois8: 'septembre',
    mois9: 'octobre',
    mois10: 'novembre',
    mois11: 'décembre',
    back: 'retour'
  },
  index: {
    epdTileTitle: 'EPD Playground',
    epdTileDescription: 'Recherchez et traitez les patient·e·s sur EPD Playground.',
    localTileTitle: 'Patient·e·s locaux·ales',
    localTileDescription: 'Affichez vos patient·e·s locaux·ales et enregistrez-les sur EPD Playground.'
  },
  about: {
    title: 'À propos du prototype mHealth',
    aboutText:
      "Le prototype mHealth a été créé dans le cadre d'un projet d'eHealth Suisse et de l'Institut d'informatique médicale I4MI de la Haute école spécialisée bernoise. Il doit servir d'objet d'illustration pour des cas d'utilisation centrés sur le patient avec le EPD Playground. L'EPD Playground est une instance de test du dossier électronique du patient (DEP) volontairement accessible.",
    readMore:
      "Les liens suivants vous permettront d'en savoir plus sur les partenaires du projet, sur le dossier électronique du patient et sur l'EPD Playground:",
    version: 'Version:'
  },
  layout: {
    title: 'Prototype mHealth',
    subtitle: 'Vue du professionnel de la santé',
    logoutPrompt: 'Voulez-vous vraiment vous déconnecter ?',
    menu: {
      title: 'Menu',
      home: "Page d'accueil",
      patients: 'Patient·e·s du DEP',
      add_patient: 'Ajouter un·e Patient·e',
      settings: 'Paramètres',
      about: 'À propos du prototype mHealth'
    }
  },
  login: {
    welcome1: "Bienvenue dans la section des professionnel·le·s de la santé du prototype de cas d'utilisation du DEP.",
    welcome2: 'Connectez-vous avec votre eID EPD-UC pour accéder aux dossiers de vos patient·e·s.',
    eid_label: 'eID EPD-UC',
    password_label: 'Mot de passe',
    login_label: 'Se connecter',
    invalid_password: "L'eID ou le mot de passe saisi n'est pas valide.",
    enter_code1: 'Veuillez saisir le code qui a été envoyé sur ',
    enter_code2: '.',
    resend: 'envoyer à nouveau le code',
    check_label: 'vérifier',
    invalid_code: "Le code saisi n'est pas correct."
  },
  patients: {
    title: 'Rechercher dans la base de données des patients (EPD Playground)',
    newSearch: 'Rechercher un·e nouveau·elle patient·e'
  },
  settings: {
    'de-CH': 'allemand (Suisse)',
    en: 'anglais',
    'fr-CH': 'français (Suisse)',
    it: 'italien',
    languageText:
      "Choisissez la langue de l'application EPD Playground Demo (actuellement, seul le français est disponible).",
    organizationTitle: 'Organisation',
    organizationText:
      "Décrivez ici l'organisation avec laquelle vous gérez les patients et qui apparaît dans les données enregistrées sur l'EPD Playground. " +
      "Certains paramètres pourraient entraîner un comportement incorrect sur l'EPD Playground.",
    organizationTypeText:
      "Vous pouvez également saisir des valeurs par défaut pour le type d'organisation et la spécialité.",
    organizationFacilityType: "Type d'organisation",
    organizationPracticeSetting: "Spécialité de l'organisation",
    organizationName: "Nom de l'organisation",
    organizationOid: "OID du système d'identification de l'organisation",
    organizationGiven: 'Prénom de la personne responsable',
    organizationFamily: 'Nom de la personne responsable',
    oidsTitle: 'OID / Identifiant du système',
    oidsText:
      'Vous pouvez consulter ici les OID des différents systèmes de codes. Les OID sont attribués de manière fixe et ne peuvent donc pas être modifiés.',
    oidsMpi: 'OID pour le système du Master Patient Index ID',
    oidsSpid: "OID pour le système de l'EPR SPID",
    oidsAhv: 'OID pour le système des numéros AVS',
    oidsApp: 'OID pour cette app (prototype mHealth)'
  },
  register: {
    localPatients: 'Patient·e·s locaux·ales',
    registerPatient: 'enregistrer un·e patient·e dans le DEP',
    selectLocal: 'Sélectionnez un·e patient·e local·e que vous souhaitez enregistrer sur le DPE.'
  },
  e404: {
    title: '404',
    text: "Oups ! Il n'y a rien à voir.",
    goHome: "Retour à l'écran d'accueil"
  },
  timeline: {
    title: 'Votre timeline',
    xAxis: 'Date',
    yAxis: 'Intensité des symptômes',
    filter: 'Filtrer selon les allergies',
    noShowText:
      "Votre écran n'est pas assez large pour afficher votre timeline. Veuillez essayer en mode paysage ou changez d'écran.",
    date: 'Date',
    noGraph: "Aucune entrée du journal n'a été trouvée.",
    taken: 'pris',
    notTaken: 'pas pris'
  },
  airQuality: {
    title: 'Pollution atmosphérique',
    in: 'à',
    rainfall: 'précipitations',
    pollen: 'pollen',
    pm10: 'PM10',
    ozone: 'ozone',
    o3: 'O₃',
    mm: 'mm',
    ppm: 'ppm',
    ugm3: 'μg/m³',
    dailyLimitValue: "valeur limite d'exposition journalière",
    noStation: 'Aucune station de mesure sélectionnée.',
    noShowText:
      "Votre écran n'est pas assez large pour afficher la timeline de la pollution atmosphérique. Veuillez essayer en mode paysage ou changez d'écran."
  },
  fhirAllergyIntolerance: {
    clinicalStatus: 'Statut clinique',
    allergyIntoleranceClinicalStatus: {
      active: 'actif',
      inactive: 'inactif',
      resolved: 'résolu'
    },
    verificationStatus: 'Statut de vérification',
    allergyIntoleranceVerificationStatus: {
      unconfirmed: 'non confirmé',
      confirmed: 'confirmé',
      refuted: 'réfuté',
      'entered-in-error': 'en erreur'
    },
    type: 'Type',
    allergyIntoleranceType: {
      allergy: 'allrgie',
      intolerance: 'intolérance'
    },
    criticality: 'Criticalité',
    allergyIntoleranceCriticality: {
      low: 'bas',
      high: 'haut',
      'unable-to-assess': 'non mesurable'
    },
    category: 'Catégorie',
    allergyIntoleranceCategory: {
      food: 'alimentation',
      medication: 'médicament',
      environment: 'environement',
      biologic: 'biologique'
    },
    code: 'Code',
    reactions: 'Réactions',
    substance: 'Substance',
    manifestation: 'Manifestation',
    severity: 'Sévérité',
    exposureRoute: "Déroulement de l'exposition"
  },
  allergy: {
    title: 'Mes allergies',
    tabKnown: 'Allergies confirmées',
    tabKnownShort: 'Confirmées',
    tabSuspected: 'Allergies présumées',
    tabSuspectedShort: 'Présumées',
    suspectedSubtitle: 'Allergie ou intolérance présumée',
    noEntries: "Aucune allergie ou intolérance n'est présente"
  },
  diary: {
    title: 'Entrée du',
    createTitle: 'Nouvelle entrée',
    dateLabel: 'Date',
    noteLabel: 'Notes',
    noteHint: 'Vous pouvez saisir ici des remarques supplémentaires.',
    symptomsLabel: 'Symptômes',
    symptomsHint: 'Saisissez vos symptômes.',
    allergyLabel: 'Allergie',
    allergyHint:
      "Si vous pensez que les symptômes sont liés à l'une de vos allergies ou intolérances, vous pouvez le saisir ici.",
    noSymptoms: 'Aucun symptôme enregistré',
    intensity: 'Intensité:',
    newSymptom: 'Nouveau symptôme:',
    editDate: 'Date et heure:',
    locationAlert: "Veuillez indiquer l'endroit concerné par le symptôme.",
    noData:
      "Il n'y a pas encore d'entrées disponibles qui pourraient être affichées. Créez une nouvelle entrée pour la voir ici.",
    medicationsLabel: 'Médicaments',
    medicationsHint: 'Saisissez les médicaments qui agissaient à ce moment-là.'
  },
  suspectedAllergies: {
    title: 'Allergies présumée',
    explanation:
      "Si vous pensez souffrir d'une allergie ou d'une intolérance, vous pouvez l'ajouter ici pour la surveiller.",
    button: 'Ajouter des allergies présumées'
  },
  symptom: {
    unknown: '',
    eye: 'yeux',
    nose: 'nez',
    mouth: 'bouche',
    lung: 'voies respiratoires',
    skin: 'irritation de la peau',
    gastro: 'appareil digestif',
    '260413007': 'pas de symptôme',
    '255604002': 'faible',
    '6736007': 'moyenne',
    '24484000': 'haute',
    location: 'partie concernée'
  },
  calendar: {
    title: 'Calendrier des allergies',
    entriesLabel: 'Entrées',
    entryLabel: 'Entrée',
    entriesFrom: 'Entrées du',
    entryTimeLabel1: 'Entrée à ',
    entryTimeLabel2: ' heures'
  },
  pollen: {
    title: 'Carte du pollen',
    current_forecast: 'Prévisions actuelles à ',
    no_measurement: 'Pas de mesure, station temporairement hors service',
    measurement_0: 'Pas de charge',
    measurement_1: 'Faible charge',
    measurement_2: 'Charge modérée',
    measurement_3: 'Forte charge',
    measurement_4: 'Très forte charge',
    more_information: "Plus d'informations sur pollenundallergie.ch",
    unit: 'particule(s) / m³',
    noStation: 'Aucune station de mesure sélectionnée.',
    noPollen: 'Aucun type de pollen sélectionné.',
    noBoth: 'Aucune station de mesure et aucun type de pollen séléectionnés.'
  },
  dashboard: {
    title: 'Tableau de bord pour : ',
    unknownFile: 'fichier inconnu',
    choseExport: "Sélectionnez l'exportation que vous souhaitez afficher dans le tableau de bord:",
    noEntries: "Désolé, il n'y a pas d'entrées pour cet•te patient•e.",
    fileError: 'Malheureusement, le document sélectionné ne peut pas être affiché comme tableau de bord.',
    fileDate: 'Fichier du '
  }
};
