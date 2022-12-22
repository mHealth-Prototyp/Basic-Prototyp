<template>
  <q-card class="patients-card">
    <q-card-section class="card-title">
      {{ $t('patients.title') }}
    </q-card-section>
    <q-card-section>
      <PatientSearch
        v-if="!patient.id"
        @found-patient="onFoundPatient"
        :localIdSystem="localIdSystem"
        :epdPlaygroundUtils="$epdUtils" />
      <PatientView
        v-else
        :languageString="lang"
        :patient="patient"
        :options="patientViewOptions"
        @edited-patient="onEdit"
        :epdPlaygroundUtils="$epdUtils"
        :settings="$store.getSettings()"
        :fhirUtils="$fhirUtils" />
    </q-card-section>
  </q-card>
  <q-dialog v-model="showAllergyDashboard">
    <q-card class="dashboard-popup">
      <q-card-actions>
        <q-icon
          @click="
            () => {
              showAllergyDashboard = false;
            }
          "
          name="fas fa-times"
          class="close-icon"
          flat
          round
          dense
          v-close-popup />
      </q-card-actions>
      <DashboardSelector :patient="patient" />
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {Patient} from '@i4mi/fhir_r4';
import {FhirUtilLanguageType, PatientSearch, PatientView} from '@i4mi/mhealth-proto-components';
import DashboardSelector from 'src/components/DashboardSelector.vue';

export default defineComponent({
  name: 'PatientsPage',
  components: {PatientView, PatientSearch, DashboardSelector},
  data() {
    return {
      lang: this.$i18n.locale.substring(0, 2) as FhirUtilLanguageType,
      patient: {resourceType: 'Patient'} as Patient,
      showAllergyDashboard: false,
      localIdSystem: {
        urn: this.$store.getOids().local,
        display: '?'
      },
      patientViewOptions: {
        showEditButton: true,
        actionButtons: [
          // {
          //   label: this.$t('patients.addToFavorites'),
          //   onClick: (pat: Patient) => console.log('add to favorites', pat)
          // },
          {
            label: 'Allergie-Dashboard anzeigen',
            onClick: this.displayAllergyDashboard
          },
          {
            label: this.$t('patients.newSearch'),
            onClick: this.resetPatient
          }
        ]
      }
    };
  },
  beforeMount() {
    this.localIdSystem.display = this.$store.getOrganizationResource().name || this.localIdSystem.display;
  },
  methods: {
    onEdit(pat: Patient): void {
      console.log('edited pat', pat);
    },
    onFoundPatient(pat: Patient) {
      this.patient = pat;
    },
    resetPatient() {
      this.patient = {} as Patient;
    },
    displayAllergyDashboard() {
      this.showAllergyDashboard = true;
    }
  }
});
</script>

<style scoped lang="scss">
.dashboard-popup {
  width: 80%;
  max-width: unset;
}
</style>
