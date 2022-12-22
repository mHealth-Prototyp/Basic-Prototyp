<template>
  <q-card :class="'diary-card' + dashBoardMode ? ' dashboard-card' : ''">
    <q-card-section :class="'card-title' + (dashBoardMode ? '' : ' with-close-icon')">
      <q-icon
        name="fas fa-book-medical"
        class="big-icon"
        v-if="dashBoardMode" />
      {{
        $t('diary.title') +
        ' ' +
        new Intl.DateTimeFormat($i18n.locale, {
          dateStyle: 'long',
          timeStyle: 'short'
        }).format(date)
      }}
      <q-icon
        v-if="!dashBoardMode"
        @click="$emit('close')"
        name="fas fa-times"
        class="close-icon"
        flat
        round
        dense
        v-close-popup />
    </q-card-section>
    <q-card-section>
      <!-- SYMPTOMS -->
      <div
        class="row"
        v-if="symptoms.length > 0">
        <div class="col-4">
          <span class="form-label">
            {{ $t('diary.symptomsLabel') }}
          </span>
        </div>
        <div class="col-8">
          <ul class="editable-list">
            <li
              v-for="(symptom, index) in symptoms"
              :key="index">
              <span> {{ $t('symptom.' + symptom.location.name) }} ({{ $t('symptom.' + symptom.intensity) }}) </span>
            </li>
            <li v-if="symptoms.length === 0">
              <span
                class="editable"
                @click="addNewSymptom"
                >{{ $t('diary.noSymptoms') }}</span
              >
              <q-icon
                name="fas fa-plus"
                class="inline-icon add-delete-icon"
                @click="addNewSymptom" />
            </li>
          </ul>
        </div>
      </div>

      <hr />
      <!-- ALLERGIES -->
      <div
        class="row"
        v-if="allergy">
        <div class="col-4">
          <span class="form-label">
            {{ $t('diary.allergyLabel') }}
          </span>
        </div>
        <div class="col-8">
          <span class="display">
            {{ allergy ? allergy.languageDisplays[lang] : '' }}
          </span>
        </div>
      </div>

      <hr v-if="allergy" />
      <!-- MEDICATIONS -->
      <div
        class="row"
        v-if="medications.length > 0">
        <div class="col-4">
          <span class="form-label">
            {{ $t('diary.medicationsLabel') }}
          </span>
        </div>
        <div class="col-8">
          <ul>
            <li
              v-for="(medication, i) in medications"
              :key="i">
              {{ medicationsOptionLabel(medication) }}
            </li>
          </ul>
        </div>
      </div>

      <hr v-if="medications.length > 0" />
      <!-- NOTE -->
      <div
        class="row"
        v-if="note && note.length > 0">
        <div class="col-4">
          <span class="form-label">
            {{ $t('diary.noteLabel') }}
          </span>
        </div>
        <div class="col-8">
          <p class="display-note">
            {{ note }}
          </p>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import {AllergySystemCodeExtension} from '@i4mi/mhealth-proto-components';
import {defineComponent, PropType} from 'vue';
import {DiaryEntry, Symptom, SymptomIntensity} from '../model/interfaces';
import {SYMPTOM_LOCATIONS} from '../assets/symptoms';
import {Medication, readI18N} from '@i4mi/fhir_r4';
import {getLangStringFromLocale} from 'src/boot/i18n';

const EMPTY_SYMPTOM = {
  intensity: SymptomIntensity.NONE,
  location: {
    name: 'unknown',
    sct: '261665006',
    image: 'none.json',
    defaultCoding: {
      system: 'http://snomed.info/sct',
      code: '261665006',
      display: 'Unknown (qualifier value)'
    }
  }
};

/**
 * Component to create or display a diary entry
 */
export default defineComponent({
  name: 'DiaryEntryCard',
  components: {}, //{SuspectedAllergiesCard, PreferredMedicationCard},
  data() {
    return {
      date: this.$today,
      symptoms: new Array<Symptom>(),
      note: undefined as string | undefined,
      allergy: undefined as AllergySystemCodeExtension | undefined,
      symptomLocations: SYMPTOM_LOCATIONS,
      knownAllergyCodes: new Array<AllergySystemCodeExtension>(),
      availableAllergies: new Array<AllergySystemCodeExtension>(),
      suspectedAllergies: new Array<AllergySystemCodeExtension>(),
      allergyCodes: new Array<AllergySystemCodeExtension>(),
      lang: getLangStringFromLocale(this.$i18n.locale),
      showSuspectedAllergiesPopup: false,
      showPreferredMedicationPopup: false,
      medications: new Array<Medication>()
    };
  },
  /**
   *
   */
  emits: {
    /**
     * Notify parent about cosing of component.
     */
    close: () => true
  },
  props: {
    /**
     * A diary entry to display. If not provided, component goes to 'create entry' mode
     */
    entry: {
      type: Object as PropType<DiaryEntry>,
      required: false
    },
    /**
     * Modifies the component for displaying directly on the dasboard, not in a popup.
     */
    dashBoardMode: {
      type: Boolean,
      required: false
    }
  },
  beforeMount() {
    // this.knownAllergyCodes = this.$store.getKnownAllergies().map((allergy) => {
    //   const sctCode = allergy.code.coding
    //     ? allergy.code.coding.find((coding) => coding.system === 'http://snomed.info/sct')
    //     : undefined;
    //   let coding = ALLERGY_IDENTIFICATION_CODES[0];
    //   if (sctCode && sctCode.code) {
    //     coding = ALLERGY_IDENTIFICATION_CODES.find((code) => code.defaultCoding.code === sctCode.code) || coding;
    //   }
    //   return coding;
    // });
    // this.suspectedAllergies = this.$store.getSuspectedAllergies();
    //this.resetAllergyCodes();
  },
  mounted() {
    if (this.$props.entry) {
      Object.assign(this, this.$props.entry);
    }
    //this.resetAvailableAllergies();
  },
  computed: {
    disableButton(): boolean {
      return (
        (this.symptoms.length === 0 || (this.symptoms.length === 1 && this.symptoms[0] === EMPTY_SYMPTOM)) &&
        (this.note == undefined || this.note?.length === 0) &&
        this.allergy == undefined
      );
    }
  },
  methods: {
    /**
    saveEntry() {
      this.$emit('create-entry', {
        date: new Date(this.date),
        symptoms: [...this.symptoms.filter((s) => s.location.name !== 'unknown')],
        note: this.note && this.note.length > 0 ? this.note : undefined,
        allergy: this.allergy ? {...this.allergy} : undefined,
        medications: [...this.medications]
      });
      this.resetForm();
      this.dashBoardMode || this.$emit('close');
    },
    resetForm(): void {
      this.date = this.$today;
      this.symptoms = [];
      this.note = '';
      this.allergy = undefined;
      this.medications = [];
    },
    onCloseSuspectedAllergiesPopup(event: {save: boolean; allergies: AllergySystemCodeExtension[]}): void {
      if (event.save) {
        this.suspectedAllergies = event.allergies;
        this.$store.setSuspectedAllergies(event.allergies);
        this.resetAvailableAllergies();
      }
      this.showSuspectedAllergiesPopup = false;
    },
    onClosePreferredMedication(event: {save: boolean}) {
      if (event.save) {
        this.preferredMedication = this.$store.getPreferredMedication();
      }
      this.showPreferredMedicationPopup = false;
    },
    addNewSymptom() {
      this.symptoms.push(Object.assign({}, EMPTY_SYMPTOM));
    },
    validateSymptom(symptom: Symptom): boolean {
      if (symptom.location === undefined || symptom.location.sct === '261665006') {
        alert(this.$t('diary.locationAlert'));
        return false;
      } else {
        return true;
      }
    },
    resetAvailableAllergies() {
      function merge(
        arr1: AllergySystemCodeExtension[],
        arr2: AllergySystemCodeExtension[]
      ): AllergySystemCodeExtension[] {
        const arr = new Array<AllergySystemCodeExtension>();
        arr1.forEach((e1) => arr.push(e1));
        // only push when not already in array
        arr2.forEach((e2) => {
          if (
            arr1.findIndex((e1: AllergySystemCodeExtension) => {
              return e1.defaultCoding.code === e2.defaultCoding.code;
            }) === -1
          ) {
            arr.push(e2);
          }
        });
        return arr;
      }

      this.availableAllergies = merge(this.knownAllergyCodes, this.suspectedAllergies)
        .filter((a) => a.defaultCoding.display && !a.defaultCoding.display.includes('No known'))
        .sort((a, b) => (a.defaultCoding.display || '').localeCompare(b.defaultCoding.display || ''));
    },
    resetAllergyCodes() {
      this.allergyCodes = ALLERGY_IDENTIFICATION_CODES.filter((allergyCode) => {
        return (
          !this.suspectedAllergies.includes(allergyCode) &&
          !this.knownAllergyCodes.includes(allergyCode) &&
          !allergyCode.defaultCoding.display?.includes('No known') &&
          !allergyCode.defaultCoding.display?.includes('Allergy to')
        );
      });
    },
    */
    medicationsOptionLabel(option: Medication): string {
      let label = this.$t('common.error');

      if (option.code?._text) {
        label = readI18N(option.code._text, this.lang) ?? label;
      } else if (option.code?.text) {
        label = option.code.text ?? label;
      }

      return label;
    },
    dateSelectorOptions(date: string) {
      return (
        date <=
        `${this.$today.getFullYear()}/${`0${this.$today.getMonth() + 1}`.slice(-2)}/${`0${this.$today.getDate()}`.slice(
          -2
        )}`
      );
    }
  },
  watch: {}
});
</script>

<style scoped lang="scss">
.diary-card {
  min-width: 300px;
  max-width: 90vw;
  margin-right: auto;
  margin-left: auto;
  margin-top: 10vh;
}
.editable {
  cursor: pointer;
  padding: 0.3em 0.5em;
  border-radius: 0.2em;
  border-color: grey;
  border-style: solid;
  border-width: 1pt;
  min-width: 5em;
  height: 2.2em;
  display: inline-block;
}
.row {
  margin-bottom: 1em;
}
.col-4,
.col-2,
.col-8 {
  padding: 0.5em 0;
}
.col-8 {
  margin-top: 0.3em;
}
.col-4 > b,
.col-4 > span {
  margin-top: 0.3em;
  display: inline-block;
}
.form-label {
  font-weight: bold;
  width: 100%;
  padding-right: 1em;
  text-align: right;
}
.edit-note {
  width: 100%;
  font-size: 0.9em;
  min-height: 5em;
}

.editable-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.editable-list li {
  margin-bottom: 0.6em;
  display: block;
}
.editable-list li:last-child {
  margin-bottom: 0;
}
li > .editable {
  width: calc(100% - 4em);
}
.editable {
  font-size: 0.8em !important;
}

.add-delete-icon {
  top: -1pt;
  margin-left: 0.5em;
  opacity: 50%;
  cursor: pointer;
}
.add-delete-icon:hover {
  opacity: 100%;
}
.intensity-label {
  color: rgba(0, 0, 0, 0.6);
  line-height: 2em;
  font-weight: 400;
  letter-spacing: 0.00937em;
}
.q-radio {
  margin-bottom: 0 !important;
}
.radio-group {
  margin-bottom: 1em;
  margin-top: 0.5em;
}
hr {
  border-width: 0;
  border-top: 1px dotted $lightGray;
}
.card-title.with-close-icon {
  padding-right: 2em;
}
.close-icon {
  cursor: pointer;
  color: #000000;
  right: 0.5em;
  top: 0.5em;
  position: absolute;
}
.close-icon:hover {
  opacity: 0.5;
}
.add-suspected-button {
  margin: 1em 1em 0;
}
p {
  text-align: unset;
}
.datetime-wrapper {
  display: inline-flex;
  margin-bottom: 2em;
}
@media (max-width: 500px) {
  .datetime-wrapper {
    flex-direction: column;
    min-height: 80vh;
  }
}
</style>
