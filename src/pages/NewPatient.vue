<template>
<div>
  <q-card class="register-card">
    <q-card-section class="card-title">{{$t('register.localPatients')}}</q-card-section>
    <q-card-section>
      <p>{{$t('register.selectLocal')}}</p>
      <LocalPatients  @select-patient="selectPatient"
                      :localIdSystem="localIdSystem"
                      :options="{numberOfRandomPatients:10}"
                      :translations="patientListTranslations"/>
    </q-card-section>
  </q-card>

  <q-card class="register-card">
    <q-card-section class="card-title">{{$t('register.registerPatient')}}</q-card-section>
    <q-card-section>
      <RegisterPatient :patient="patient"
                       :translations="registerPatientTranslations"
                       :localIdSystem="localIdSystem"
                       @uploaded-patient="uploadedPatient"/>
    </q-card-section>
  </q-card>


</div>

</template>

<script lang="ts">
import { Identifier, Patient } from '@i4mi/fhir_r4';
import { defineComponent } from 'vue';
import RegisterPatient from 'src/components/RegisterPatient.vue';
import LocalPatients from '../components/LocalPatients.vue'

export default defineComponent({
  name: 'NewPatient',
  components: { RegisterPatient, LocalPatients, },
  data() {
    return ({
      patientListTranslations: {},
      registerPatientTranslations: {},
      patient:  {
        hasEpr: false,
        pat:  undefined as unknown as Patient
      },
      localIdSystem: {
        urn: 'urn:oid:2.16.756.5.30.1.178.1.1',
        display: 'Klinik Höheweg'
      },
    });
  },
  methods: {
    selectPatient(selected: {pat: Patient, hasEpr: boolean}) {
      this.patient = selected;
    },
    uploadedPatient(pat: Patient) {
      if (this.patient && this.patient.pat) {
        const ahv = this.patient.pat.identifier?.find(i => i.system === this.$store.getOids().ahv);
        this.patient.hasEpr = true;
        this.patient.pat = pat;
        this.patient.pat.identifier?.push(ahv as Identifier);
      }
    }
  },
  beforeMount() {
    this.patientListTranslations = {
      titleLabel: this.$t('register.localPatients'),
      givenLabel: this.$t('common.givenName'),
      familyLabel: this.$t('common.familyName'),
      birthdateLabel: this.$t('common.birthdate'),
      genderLabel: this.$t('common.gender'),
      localPidLabel: this.$t('common.localPid'),
      ahvLabel: this.$t('common.ahv'),
      hasEPRLabel: this.$t('register.hasEpr'),
      yesLabel: this.$t('common.yes'),
      noLabel: this.$t('common.no'),
      searchLabel: this.$t('common.search')
    }
    this.registerPatientTranslations = {
      titleText: this.$t('register.registerLocal'),
      givenLabel: this.$t('common.givenName'),
      familyLabel: this.$t('common.familyName'),
      birthdateLabel: this.$t('common.birthdate'),
      genderLabel: this.$t('common.gender'),
      localPidLabel: this.$t('common.localPid'),
      yesLabel: this.$t('common.yes'),
      noLabel: this.$t('common.no'),
      searchLabel: this.$t('common.search'),
      addressLabel: this.$t('common.address'),
      streetLabel: this.$t('patients.streetLabel'),
      cityLabel: this.$t('patients.cityLabel'),
      zipLabel: this.$t('patients.zipLabel'),
      stateLabel: this.$t('common.canton'),
      maleGender: this.$t('common.maleGender'),
      femaleGender: this.$t('common.femaleGender'),
      otherGender: this.$t('common.otherGender'),
      unknownGender: this.$t('common.unknownGender'),
      identifiersLabel: this.$t('common.identifier'),
      localIdLabel: this.$t('common.localPid'),
      eprSpidLabel: this.$t('common.eprSpid'),
      ahvLabel: this.$t('common.ahv'),
      registerButtonLabel: this.$t('register.registerPatient'),
      queryEprSpidMessage: this.$t('register.queryEprSpid'),
      gotEprSpidMessage: this.$t('register.gotEprSpid'),
      registerPatientMessage: this.$t('register.registering'),
      doneMessage: this.$t('register.doneRegistering'),
      errorMessage: this.$t('register.errorRegistering'),
    }
  }
});
</script>

<style scoped lang="scss">
</style>
