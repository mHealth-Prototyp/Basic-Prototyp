export default {
  common: {
    save: 'Speichern',
    loadDefault: 'Standardwerte laden',
    language: 'Sprache',
    allergy: 'Allergie',
    intolerance: 'Intoleranz',
    month0: 'Januar',
    month1: 'Februar',
    month2: 'März',
    month3: 'April',
    month4: 'Mai',
    month5: 'Juni',
    month6: 'Juli',
    month7: 'August',
    month8: 'September',
    month9: 'Oktober',
    month10: 'November',
    month11: 'Dezember',
    back: 'zurück'
  },
  index: {
    epdTileTitle: 'EPD Playground',
    epdTileDescription: 'Suchen und bearbeiten Sie Patient•innen auf dem EPD Playground.',
    localTileTitle: 'Lokale Patient•innen',
    localTileDescription: 'Zeigen Sie Ihre lokalen Patient•innen an und registrieren Sie diese auf dem EPD Playground.'
  },
  about: {
    title: 'Über den mHealth Prototypen',
    aboutText:
      'Dieser mHealth Prototyp entstand im Rahmen eines Projektes von eHealth Suisse und dem Institut für Medizininformatik I4MI der Berner Fachhochschule. Er soll als Anschauungsobjekt und Beispielimplementierung eines Zugangs zum EPD Playground dienen, einer bewusst niederschwellig erstellten Test-Instanz des eidgenössischen Patientendossiers EPD. ',
    readMore:
      'Unter den folgenden Links erfahren Sie mehr zu den Projektpartnern, zum elektronischen Patientendossier und zum EPD Playground:',
    version: 'Version:'
  },
  layout: {
    title: 'mHealth Prototyp',
    subtitle: 'GFP-Ansicht',
    logoutPrompt: 'Möchten Sie sich wirklich ausloggen?',
    menu: {
      title: 'Menü',
      home: 'Startseite',
      patients: 'EPD-Patient•innen',
      add_patient: 'Patient•in hinzufügen',
      settings: 'Einstellungen',
      about: 'Über den mHealth Prototyp'
    }
  },
  login: {
    welcome1: 'Willkommen zum Gesundheitsfachpersonen-Bereich des EPD Use Case Prototyps.',
    welcome2: 'Loggen Sie sich mit Ihrer EPD-UC eID ein, um auf die Dossiers Ihrer Patient•innen zugreifen zu können.',
    eid_label: 'EPD-UC eID',
    password_label: 'Passwort',
    login_label: 'Login',
    invalid_password: 'Die eingegebene eID oder das Passwort ist ungültig.',
    enter_code1: 'Bitte geben Sie den Code ein, der an ',
    enter_code2: ' gesendet wurde.',
    resend: 'Code erneut senden',
    check_label: 'Prüfen',
    invalid_code: 'Der eingegebene Code ist nicht korrekt.'
  },
  patients: {
    title: 'Patientenstamm durchsuchen (EPD Playground)',
    newSearch: 'Neue•n Patient•in suchen'
  },
  settings: {
    'de-CH': 'Deutsch (Schweiz)',
    en: 'Englisch',
    'fr-CH': 'Französisch (Schweiz)',
    it: 'Italienisch',
    languageText: 'Wählen Sie die Sprache für die EPD Playground Demo App (zurzeit nur Deutsch verfügbar).',
    organizationTitle: 'Organisation',
    organizationText:
      'Beschreiben Sie hier die Organisation, mit der Sie die Patient•innen verwalten und die in den auf dem EPD Playground gespeicherten Daten aufscheint. ' +
      'Gewisse Einstellungen könnten zu fehlerhaftem Verhalten auf dem EPD Playground führen.',
    organizationTypeText: 'Sie können auch Standardwerte für die Art der Organisation und der Fachrichtung eingeben',
    organizationFacilityType: 'Art der Organisation',
    organizationPracticeSetting: 'Fachrichtung der Organisation',
    organizationName: 'Name der Organisation',
    organizationOid: 'OID des ID-Systems der Organisation',
    organizationGiven: 'Vorname der verantwortlichen Person',
    organizationFamily: 'Nachname der verantwortlichen Person',
    oidsTitle: 'OID / Systemidentifier',
    oidsText:
      'Hier können Sie die OIDs der verschiedenen Code-Systeme einsehen. Die OIDs sind fest vergeben und können deshalb nicht geändert werden.',
    oidsMpi: 'OID für das System der Master Patient Index ID',
    oidsSpid: 'OID für das System der EPR SPID',
    oidsAhv: 'OID für das System der AHV-Nummern',
    oidsApp: 'OID für diese App (mHealth Prototyp)'
  },
  register: {
    localPatients: 'Lokale Patient•innen',
    registerPatient: 'Patient•in im EPD registrieren',
    selectLocal: 'Wählen Sie eine•n lokale•n Patient•in aus, den / die Sie auf dem EPD registrieren möchten.'
  },
  e404: {
    title: '404',
    text: 'Ooops. Hier gibt es nichts zu sehen.',
    goHome: 'Zurück zum Hauptbildschirm'
  },
  timeline: {
    title: 'Ihre Timeline',
    xAxis: 'Datum',
    yAxis: 'Intensität des Symptoms',
    filter: 'Nach Allergie filtern',
    noShowText:
      'Ihr Bildschirm ist nicht breit genug, um Ihre Timeline anzuzeigen. Versuchen Sie es im Querformat oder wechseln Sie den Bildschirm.',
    date: 'Datum',
    noGraph: 'Es wurde keine Tagebucheinträge gefunden.',
    taken: 'genommen',
    notTaken: 'nicht genommen'
  },
  airQuality: {
    title: 'Luftverschmutzung',
    in: 'in',
    rainfall: 'Niederschläge',
    pollen: 'Pollen',
    pm10: 'PM10',
    ozone: 'Ozon',
    o3: 'O₃',
    mm: 'mm',
    ppm: 'ppm',
    ugm3: 'μg/m³',
    dailyLimitValue: 'täglicher Expositionsgrenzwert',
    noShowText:
      'Ihr Bildschirm ist nicht breit genug, um die Luftverschmutzung Timeline anzuzeigen. Versuchen Sie es im Querformat oder wechseln Sie den Bildschirm.',
    noStation: 'Keine Messstation ausgewählt.'
  },
  fhirAllergyIntolerance: {
    clinicalStatus: 'Klinischer Status',
    allergyIntoleranceClinicalStatus: {
      active: 'aktiv',
      inactive: 'inaktiv',
      resolved: 'aufgelöst'
    },
    verificationStatus: 'Verifizierung Status',
    allergyIntoleranceVerificationStatus: {
      unconfirmed: 'unbestätigt',
      confirmed: 'bestätigt',
      refuted: 'widerlegt',
      'entered-in-error': 'im Irrtum'
    },
    type: 'Typ',
    allergyIntoleranceType: {
      allergy: 'Allergie',
      intolerance: 'Intoleranz'
    },
    criticality: 'Kritikalität',
    allergyIntoleranceCriticality: {
      low: 'niedrig',
      high: 'hoch',
      'unable-to-assess': 'nicht bewertbar'
    },
    category: 'Kategorie',
    allergyIntoleranceCategory: {
      food: 'Nahrung',
      medication: 'Medikament',
      environment: 'Umwelt',
      biologic: 'biologisch'
    },
    code: 'Code',
    reactions: 'Reaktionen',
    substance: 'Substanz',
    manifestation: 'Manifestation',
    severity: 'Schweregrad',
    exposureRoute: 'Expositionsverlauf'
  },
  allergy: {
    title: 'Meine Allergien',
    tabKnown: 'Bestätigte Allergien',
    tabKnownShort: 'Bestätigt',
    tabSuspected: 'Vermutete Allerien',
    tabSuspectedShort: 'Vermutet',
    suspectedSubtitle: 'Vermutete Allergie oder Intoleranz',
    noEntries: 'Es sind keine Allergien oder Intoleranzen vorhanden.'
  },
  diary: {
    title: 'Tagebucheintrag vom',
    createTitle: 'Neuer Tagebucheintrag',
    dateLabel: 'Datum',
    noteLabel: 'Anmerkungen',
    noteHint: 'Hier können Sie zusätzliche Bemerkungen zum Tagebuch-Eintrag erfassen.',
    symptomsLabel: 'Symptome',
    symptomsHint: 'Erfassen Sie Ihre Symptome zum Tagebuch-Eintrag.',
    allergyLabel: 'Allergie',
    allergyHint:
      'Wenn Sie vermuten, dass die Symptome mit einer Ihrer Allergien oder Intoleranzen zusammenhängen, können Sie das hier erfassen.',
    noSymptoms: 'Keine Symptome erfasst',
    intensity: 'Intensität:',
    newSymptom: 'Neues Symptom:',
    editDate: 'Datum und Zeit:',
    locationAlert: 'Bitte geben Sie an, welche Stelle vom Symptom betroffen ist.',
    noData:
      'Es sind noch keine Einträge verfügbar, die angezeigt werden könnten. Erstellen Sie einen neuen Tagebuch-Eintrag, um ihn hier zu sehen.',
    medicationsLabel: 'Arzneimittel',
    medicationsHint: 'Erfassen Sie die Medikamente, die zu diesem Zeitpunkt wirkten.'
  },
  suspectedAllergies: {
    title: 'Verdachts-Allergien',
    explanation:
      'Falls Sie den Verdacht haben, an einer Allergie oder Intoleranz zu leiden, können Sie diese hier hinzufügen um sie zu beobachten.',
    button: 'Verdachtsallergien hinzufügen'
  },
  calendar: {
    title: 'Allergie-Kalender',
    entriesLabel: 'Einträge',
    entryLabel: 'Eintrag',
    entriesFrom: 'Einträge vom',
    entryTimeLabel1: 'Eintrag um ',
    entryTimeLabel2: ' Uhr'
  },
  symptom: {
    unknown: '',
    eye: 'Auge(n)',
    nose: 'Nase',
    mouth: 'Mund',
    lung: 'Atemwege',
    skin: 'Hautreizung',
    gastro: 'Verdauungsapparat',
    '260413007': 'keine Symptome',
    '255604002': 'gering',
    '6736007': 'mittel',
    '24484000': 'hoch',
    location: 'Betroffene Stelle'
  },
  pollen: {
    title: 'Pollenkarte',
    current_forecast: 'Aktuelle Prognose in ',
    no_measurement: 'Keine Messung, Station temporär ausser Betrieb',
    measurement_0: 'Keine Belastung',
    measurement_1: 'Schwache Belastung',
    measurement_2: 'Mässige Belastung',
    measurement_3: 'Starke Belastung',
    measurement_4: 'Sehr Starke Belastung',
    more_information: 'Weitere Informationen auf pollenundallergie.ch',
    unit: 'Partikel / m³',
    noStation: 'Keine Messstation ausgewählt.',
    noPollen: 'Keine Pollenart ausgewählt.',
    noBoth: 'Keine Messstation und Pollenart ausgewählt.'
  },
  dashboard: {
    title: 'Allergie-Dashboard für: ',
    unknownFile: 'unbekannte Datei',
    choseExport: 'Wählen Sie den Export aus, den Sie im Dashboard anzeigen wollen:',
    noEntries: 'Es gibt leider keine Einträge für diese•n Patient•in.',
    fileError: 'Das gewählte Dokument kann leider nicht als Dashboard angezeigt werden.',
    fileDate: 'Datei vom '
  }
};
