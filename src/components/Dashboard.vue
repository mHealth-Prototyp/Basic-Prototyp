<template>
  <div
    class="full-width row justify-around"
    v-if="!error">
    <TimelineCard
      :diary="diary"
      :suspAllergies="suspectedAllergies"
      :knownAllergies="knownAllergies"
      :dayOffset="offset" />
    <AirQualityTimelineCard
      :station="station"
      :pollen="pollen"
      :dayOffset="offset" />
    <AllergyCard
      :confirmedAllergies="knownAllergies"
      :suspectedAllergies="suspectedAllergies"
      :entriesPerPage="5" />
    <CalendarCard :diary="diary" />
  </div>
  <p
    v-else
    class="error">
    {{ $t('dashboard.fileError') }}
  </p>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import Utils from 'src/services/utils';
import {SYMPTOM_LOCATIONS} from '../assets/symptoms';
import {
  AllergySystemCodeExtension,
  ALLERGY_IDENTIFICATION_CODES,
  CHAllergyIntolerance
} from '@i4mi/mhealth-proto-components';
import {Bundle, Coding, Composition, getCode, hasCoding, Observation, Resource, Location} from '@i4mi/fhir_r4';
import {DiaryEntry, Station, Symptom, SymptomIntensity} from 'src/model/interfaces';
import AllergyCard from './AllergyCard.vue';
import CalendarCard from './CalendarCard.vue';
import TimelineCard from './TimelineCard.vue';
import AirQualityTimelineCard from './AirQualityTimelineCard.vue';

const KNOWN_ALLERGY_TITLES = ['Bekannte Allergien und Intoleranzen', 'Allergies et intolérances connues'];

const SUSPECTED_ALLERGY_TITLES = ['Vermutete Allergien und Intoleranzen', 'Allergies et intolérances suspectées'];

const DIARY_ENTRY_TITLES = ['Tagebucheinträge', 'Entrées du journal'];

const AIR_QUALITY_TITLES = ['Luftqualitätsdaten', "Données sur la qualité de l'air"];

const POLLEN_ALLERGY_CODES = ['418689008', '419263009', '256262001', '256263006', '256266003', '256277009'];

export default defineComponent({
  name: 'DashboardPage',
  components: {
    CalendarCard,
    TimelineCard,
    AllergyCard,
    AirQualityTimelineCard
  },
  data() {
    return {
      knownAllergies: new Array<CHAllergyIntolerance>(),
      suspectedAllergies: new Array<CHAllergyIntolerance>(),
      diary: new Array<DiaryEntry>(),
      pollen: undefined as AllergySystemCodeExtension | undefined,
      station: undefined as Station | undefined,
      offset: 30,
      error: false
    };
  },
  props: {
    /**
     * The Bundle with the exported patient data
     */
    patientData: {
      type: Object as PropType<Bundle>,
      required: true
    }
  },
  beforeMount() {
    try {
      this.diary = this.getResourcesForSection(DIARY_ENTRY_TITLES).map((res) =>
        this.observationToDiaryEntry(res as Observation)
      );
      if (this.diary.length > 0) {
        this.offset = this.findOffset(this.diary);
      }
      this.knownAllergies = this.getResourcesForSection(KNOWN_ALLERGY_TITLES).map((res) => res as CHAllergyIntolerance);
      this.suspectedAllergies = this.getResourcesForSection(SUSPECTED_ALLERGY_TITLES).map(
        (res) => res as CHAllergyIntolerance
      );
      this.station = this.getLocation();
    } catch (error) {
      this.error = true;
    }
    // we encountered an error or the file is empty or not a dashboard export
    this.error =
      this.error ||
      (this.diary.length === 0 && this.knownAllergies.length === 0 && this.suspectedAllergies.length === 0);
    this.knownAllergies.concat(this.suspectedAllergies).forEach((allergy) => {
      if (!this.pollen) {
        const allergyCode = getCode(allergy.code, 'http://snomed.info/sct');
        if (allergyCode && POLLEN_ALLERGY_CODES.includes(allergyCode)) {
          this.pollen = Utils.CHAllergyIntoleranceToAllergySystemCodeExtension([allergy])[0];
        }
      }
    });
  },
  methods: {
    findEntryByReference(ref: string): Resource | undefined {
      return this.patientData.entry?.find((e) => e.fullUrl === ref)?.resource;
    },
    // find either the actual resources in the bundle for a section
    getResourcesForSection(titles: string[]): Resource[] {
      const resources = new Array<Resource>();
      const composition = this.patientData.entry?.find((e) => e.resource?.resourceType === 'Composition')
        ?.resource as Composition;
      if (composition && composition.section) {
        const section = composition.section?.find((section) => section.title && titles.includes(section.title));
        section?.entry?.forEach((entry) => {
          const resource = this.findEntryByReference(entry.reference || '');
          if (resource) {
            resources.push(resource);
          }
        });
      }
      return resources;
    },
    // creates diary entry from observation resource
    observationToDiaryEntry(observation: Observation): DiaryEntry {
      const symptoms = new Array<Symptom>();
      let allergyCoding: Coding | undefined = undefined;
      observation.component?.map((comp) => {
        const location = SYMPTOM_LOCATIONS.find((loc) => loc.sct === getCode(comp.code, 'http://snomed.info/sct'));
        const isAllergy = hasCoding(comp.code, {system: 'http://loinc.org', code: '52473-6'});
        if (location) {
          symptoms.push({
            intensity:
              (getCode(comp.valueCodeableConcept, 'http://snomed.info/sct') as SymptomIntensity) ||
              SymptomIntensity.NONE,
            location: location
          });
        }
        if (
          isAllergy &&
          comp.valueCodeableConcept &&
          comp.valueCodeableConcept.coding &&
          comp.valueCodeableConcept.coding.length > 0
        ) {
          allergyCoding = comp.valueCodeableConcept.coding[0];
        }
      });
      return {
        date: observation.effectiveDateTime ? new Date(observation.effectiveDateTime) : new Date(),
        symptoms: symptoms,
        note: observation.valueString,
        allergy: allergyCoding
          ? ALLERGY_IDENTIFICATION_CODES.find((code) => code.defaultCoding.code === allergyCoding?.code)
          : undefined,
        medications: []
      };
    },
    // fetches the location for the bundle
    getLocation(): Station | undefined {
      let station = this.$i18n.locale === 'de' ? 'PBE' : 'PLS'; // fallback to Bern or Lausanne when nothing is found
      const airQualityResources = this.getResourcesForSection(AIR_QUALITY_TITLES).map((res) => res as Observation);
      if (airQualityResources && airQualityResources[0]) {
        let ref = airQualityResources[0].subject?.reference;
        if (ref) {
          const location = airQualityResources[0].contained?.find(
            (resource) => resource.resourceType === 'Location' && resource.id === ref?.split('#')[1]
          );
          if (location) {
            let identifier = (location as Location).identifier?.find(
              (id) =>
                id.system ===
                'https://www.meteoswiss.admin.ch/services-and-publications/applications/measurement-values-and-measuring-networks.html'
            );
            station = identifier && identifier.value ? identifier.value : station;
          }
        }
      }
      return this.$weatherAPIConsumer.getStation(station);
    },
    // calculates how far the first entry is ago (and adds 3 days for context)
    findOffset(diary: DiaryEntry[]): number {
      let start = Date.now();
      diary.forEach((entry) => {
        const entryDate = new Date(entry.date).getTime();
        start = entryDate < start ? entryDate : start;
      });
      return Math.ceil((Date.now() - start) / (1000 * 60 * 60 * 24)) + 3;
    }
  }
});
</script>
<style lang="scss">
.dashboard-card {
  min-width: 310px;
  max-width: 500px;
  width: 100%;
}
.dashboard-card-wide {
  min-width: 600px;
  // max-width: 1200px;
  width: 100%;
}

.big-icon {
  position: absolute;
  left: 0.5em;
  top: 0.35em;
  font-size: 1.8em;
  color: $background;
}
.dialog.dashboard-card {
  min-width: 60%;
}
.no-data-text {
  margin: 1em;
}
.clickable {
  cursor: pointer;
}
.clickable:hover {
  color: $primary;
}
.error {
  margin: 1.5em;
  padding-bottom: 1em;
}
</style>
