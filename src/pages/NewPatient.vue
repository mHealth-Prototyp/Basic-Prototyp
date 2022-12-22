<template>
  <div>
    <q-card class="register-card">
      <q-card-section class="card-title">
        {{ $t('register.localPatients') }}
      </q-card-section>
      <q-card-section>
        <p>{{ $t('register.selectLocal') }}</p>
        <LocalPatients
          @select-patient="selectPatient"
          @generated-patients="storeGeneratedPatients"
          :patients="localPatients.length > 0 ? localPatients : undefined"
          :localIdSystem="localIdSystem"
          :options="{numberOfRandomPatients: 10}"
          :epdPlaygroundUtils="$epdUtils"
          :patientUtils="$patientUtils" />
      </q-card-section>
    </q-card>

    <q-card class="register-card">
      <q-card-section class="card-title">
        {{ $t('register.registerPatient') }}
      </q-card-section>
      <q-card-section>
        <RegisterPatient
          :patient="patient"
          :localIdSystem="localIdSystem"
          @uploaded-patient="uploadedPatient"
          :epdPlaygroundUtils="$epdUtils"
          :patientUtils="$patientUtils"
          :settings="$store.getSettings()" />
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {Identifier, Patient} from '@i4mi/fhir_r4';
import {LocalPatients, RegisterPatient} from '@i4mi/mhealth-proto-components';

export default defineComponent({
  name: 'NewPatient',
  components: {RegisterPatient, LocalPatients},
  data() {
    return {
      patient: {
        hasEpr: false,
        pat: undefined as Patient | undefined
      },
      localIdSystem: {
        urn: 'urn:oid:2.16.756.5.30.1.178.1.1',
        display: 'Klinik Höheweg'
      },
      localPatients: [] as Array<Patient>
    };
  },
  methods: {
    selectPatient(selected: {pat: Patient; hasEpr: boolean}) {
      this.patient = selected;
    },
    uploadedPatient(pat: Patient) {
      if (this.patient && this.patient.pat) {
        const ahv = this.patient.pat.identifier?.find((i) => i.system === this.$store.getOids().ahv);
        this.patient.hasEpr = true;
        this.patient.pat = pat;
        this.patient.pat.identifier?.push(ahv as Identifier);
      } else {
        // it's a completely new patient
        this.patient.pat = pat;
        this.patient.hasEpr = true;
        this.localPatients = [...this.localPatients, pat];
        this.$store.setLocalPatients(this.localPatients);
      }
    },
    storeGeneratedPatients(pats: Patient[]) {
      this.$store.setLocalPatients(pats);
    }
  },
  beforeMount() {
    this.localPatients = this.$store.getLocalPatients();
  }
});
</script>

<style scoped lang="scss"></style>
