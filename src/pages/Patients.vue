<template>
  <q-card class="patients-card">
    <q-card-section class="card-title">{{$t('patients.title')}}</q-card-section>
    <q-card-section>
      <PatientSearch v-if="!patient.id"
                     @found-patient="onFoundPatient"
                     :localIdSystem="localIdSystem"
                     :translations="patientSearchComponentTranslations"
      />
      <PatientView v-else
                   :patient="patient"
                   :locale="$i18n.locale || 'de-CH'"
                   :options="patientViewOptions"
                   @edited-patient="onEdit"
                   :translations="patientViewComponentTranslations"
      />
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { Patient } from '@i4mi/fhir_r4';
import { defineComponent } from 'vue';
import PatientView from '../components/PatientView.vue';
import PatientSearch from '../components/PatientSearch.vue';

export default defineComponent({
  name: 'Patients',
  components: { PatientView, PatientSearch },
  data() {
    return ({
      patient: {} as Patient,
      localIdSystem: {
        urn: this.$store.getOids().local,
        display: '?'
      },
      patientSearchComponentTranslations: {},
      patientViewComponentTranslations: {},
      patientViewOptions: {
        showEditButton: true,
        actionButtons: [
          // {
          //   label: this.$t('patients.addToFavorites'),
          //   onClick: (pat: Patient) => console.log('add to favorites', pat)
          // },
          {
            label: this.$t('patients.newSearch'),
            onClick: this.resetPatient
          },
          ]
      }
    })
  },
  beforeMount() {
    this.patientViewComponentTranslations = {
      nameInputLabel: this.$t('patients.nameLabel'),
      givenInputLabel: this.$t('patients.givenLabel'),
      genderLabel: this.$t('patients.genderLabel'),
      birthdateLabel: this.$t('patients.birthdateLabel'),
      addressLabel: this.$t('patients.addressLabel'),
      maleGender: this.$t('common.maleGender'),
      femaleGender: this.$t('common.femaleGender'),
      otherGender: this.$t('common.otherGender'),
      unknownGender: this.$t('common.unknownGender'),
      identifiersLabel: this.$t('patients.identifiersLabel'),
      localIdLabel: this.$t('patients.localIdLabel'),
      mpiIdLabel: this.$t('patients.mpiIdLabel'),
      eprSpidLabel: this.$t('patients.eprSpidLabel'),
      editButtonLabel: this.$t('patients.editButtonLabel'),
      cancelButtonLabel: this.$t('common.cancel'),
      saveButtonLabel: this.$t('common.save'),
      streetLabel: this.$t('patients.streetLabel'),
      zipLabel: this.$t('patients.zipLabel'),
      cityLabel: this.$t('patients.cityLabel'),
      uploadError: this.$t('common.error'),
      uploadSuccess: this.$t('patients.success'),
      openPrompt1: this.$t('patients.openPrompt1'),
      openPrompt2: this.$t('patients.openPrompt2'),
      addDocumentButton: this.$t('patients.addDocument'),
      uploadSuccessful: this.$t('documents.uploadSuccessful'),
      uploadUnsuccessful: this.$t('documents.uploadUnsuccessful'),
      documentSearchStrings: {
        titleLabel: this.$t('patients.documentTableLabel'),
        kiloByteLabel: this.$t('common.kiloByte'),
        megaByteLabel: this.$t('common.megaByte'),
        fetchMpiLabel: this.$t('patients.fetchMpi'),
        mpiLabel: this.$t('patients.fetchedMpi'),
        fetchMetadataLabel: this.$t('patients.fetchMetadata'),
        fetchingError: this.$t('patients.fetchingError'),
        searchLabel: this.$t('common.search'),
        dateLabel: this.$t('common.date'),
        descriptionLabel: this.$t('common.description'),
        classLabel: this.$t('common.class'),
        typeLabel: this.$t('common.type'),
        authorLabel: this.$t('common.author'),
        fileTypeLabel: this.$t('common.fileType'),
        fileSizeLabel: this.$t('common.fileSize')
      },
      documentUploadStrings: {
        titleLabel: this.$t('documents.titleLabel'),
        titleInputLabel: this.$t('documents.titleInput'),
        descriptionText: this.$t('documents.descriptionText'),
        descriptionInputLabel: this.$t('common.description'),
        uploadButtonLabel: this.$t('documents.uploadFile'),
        cancelButtonLabel: this.$t('common.cancel'),
        categoryLabel: this.$t('documents.fileTypeCategory'),
        typeLabel: this.$t('documents.fileType'),
        selectFile: this.$t('documents.selectFile'),
        selectFileText: this.$t('documents.selectFileText'),
        metadata: this.$t('documents.metadata'),
        metadataText: this.$t('documents.metadataText'),
        titleAndDescription: this.$t('documents.titleAndDescription'),
        languageText: this.$t('documents.languageText'),
        language: this.$t('common.language'),
        fileTypeText: this.$t('documents.fileTypeText'),
        typeNotSufficient: this.$t('documents.typeNotSufficient'),
        creatingInstitution: this.$t('documents.creatingInstitution'),
        creatingInstitutionText: this.$t('documents.creatingInstitutionText'),
        institution: this.$t('documents.institution'),
        specialisation: this.$t('documents.specialisation'),
        specialisationText: this.$t('documents.specialisationText'),
        jsonFhir: this.$t('documents.jsonFhir'),
        continue: this.$t('common.continue'),
        back: this.$t('common.back')
      }
    },
    this.patientSearchComponentTranslations = {
      nameInputLabel: this.$t('common.familyName'),
      givenInputLabel: this.$t('common.givenName'),
      birthdayInputLabel: this.$t('common.birthdate'),
      genderInputLabel: this.$t('common.gender'),
      idInputLabel: this.$t('patients.localId'),
      systemLabel: this.$t('patients.system'),
      cityLabel: this.$t('patients.city'),
      eprSpidLabel: this.$t('common.eprSpid'),
      localPidLabel: this.$t('common.localPid'),
      searchButtonLabel: this.$t('common.search'),
      genderMale: this.$t('common.maleGender'),
      genderFemale: this.$t('common.femaleGender'),
      genderOther: this.$t('common.otherGender'),
      notEnoughParameter: this.$t('patients.missingParameter'),
      noPatientFound: this.$t('patients.notFound'),
      resultTableTitle: this.$t('patients.foundPatients'),
    }

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
    }
  }
});
</script>

<style scoped lang="scss">
</style>
