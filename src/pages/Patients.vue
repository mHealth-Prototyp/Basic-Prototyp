<template>
  <q-card class="patients-card">
    <q-card-section class="card-title">
      {{$t('patients.title')}}
    </q-card-section>
    <q-card-section>
      <PatientSearch v-if="!patient.id"
                     @found-patient="onFoundPatient"
                     :localIdSystem="localIdSystem"
                     :translations="patientSearchComponentTranslations"
                     :epdPlaygroundUtils="$epdUtils"
      />
      <PatientView v-else
                   :patient="patient"
                   :options="patientViewOptions"
                   @edited-patient="onEdit"
                   :translations="patientViewComponentTranslations"
                   :epdPlaygroundUtils="$epdUtils"
                   :settings="$store.getSettings()"
                   :fhirUtils="$fhirUtils"
      />
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Patient } from '@i4mi/fhir_r4';
import { PatientSearch, PatientView } from '@i4mi/mhealth-proto-components';

export default defineComponent({
  name: 'PatientsPage',
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
      addAllergyButton: this.$t('allergy.addAllergy'),
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
      },
      allergyUploadStrings: {
        substance: this.$t('allergy.substance'),
        category: this.$t('allergy.category'),
        noKnownAllergies: this.$t('allergy.noKnownAllergies'),
        noKnownAllergiesMoreDetail: this.$t('allergy.noKnownAllergiesMoreDetail'),
        cancelButtonLabel: this.$t('common.cancel'),
        uploadButtonLabel: this.$t('allergy.uploadAllergyData'),
        continue: this.$t('common.continue'),
        back: this.$t('common.back'),
        noResults: this.$t('common.noResults'),
        type: this.$t('allergy.type'),
        typeTooltip: this.$t('allergy.tooltips.type'),
        substanceTooltip: this.$t('allergy.tooltips.substance'),
        categoryTooltip: this.$t('allergy.tooltips.category'),
        clinicalStatus: this.$t('allergy.clinicalStatus'),
        clinicalStatusTooltip: this.$t('allergy.tooltips.clinicalStatus'),
        criticality: this.$t('allergy.criticality'),
        criticalityTooltip: this.$t('allergy.tooltips.criticality'),
        verificationStatus: this.$t('allergy.verificationStatus'),
        verificationStatusTooltip: this.$t('allergy.tooltips.verificationStatus'),
        dateOfIdentification: this.$t('allergy.dateOfIdentification'),
        comment: this.$t('allergy.comment'),
        episode: this.$t('allergy.episode'),
        metadata: this.$t('documents.metadata'),
        episodeTableTitle: this.$t('allergy.episodeTableTitle'),
        manifestation: this.$t('allergy.manifestation'),
        duration: this.$t('allergy.duration'),
        reactionSeverity: this.$t('allergy.reactionSeverity'),
        location: this.$t('allergy.location'),
        description: this.$t('common.description'),
        addEpisodeButtonLabel: this.$t('allergy.addEpisodeButtonLabel'),
        updateEpisodeButtonLabel: this.$t('allergy.updateEpisodeButtonLabel'),
        deleteEpisodeButtonLabel: this.$t('allergy.deleteEpisodeButtonLabel'),
        certainty: this.$t('allergy.certainty'),
        reaction: this.$t('allergy.reaction'),
        reactionDate: this.$t('allergy.reactionDate'),
        reactionSubstanceTooltip: this.$t('allergy.tooltips.reactionSubstance'),
        reactionManifestationTooltip: this.$t('allergy.tooltips.reactionManifestation'),
        reactionLocationTooltip: this.$t('allergy.tooltips.reactionLocation'),
        exposure: this.$t('allergy.exposure'),
        exposureDate: this.$t('allergy.exposureDate'),
        exposurePath: this.$t('allergy.exposurePath'),
        exposurePathTooltip: this.$t('allergy.tooltips.exposurePath'),
        episodeComment: this.$t('allergy.episodeComment'),
        saveEpisode: this.$t('allergy.saveEpisode'),
        creatingInstitution: this.$t('documents.creatingInstitution'),
        creatingInstitutionText: this.$t('allergy.creatingInstitutionText'),
        institution: this.$t('documents.institution'),
        specialisation: this.$t('documents.specialisation'),
        specialisationText: this.$t('allergy.specialisationText'),
        searchPlaceholder: this.$t('common.search'),
        fieldRequired: this.$t('common.fieldRequired'),
        allergicFor: this.$t('allergy.allergicFor'),
        positiveValuesAllowed: this.$t('common.positiveValuesAllowed'),
        durationReaction: this.$t('allergy.durationReaction')
      },
      allergyViewStrings: {
        allergy: this.$t('allergy.allergy'),
        intolerance: this.$t('allergy.intolerance'),
        typeLabel: this.$t('allergy.typeLabel'),
        codeDisplayLabel: this.$t('allergy.codeDisplayLabel'),
        dateLabel: this.$t('common.date'),
        clinicalStateLabel: this.$t('allergy.clinicalStateLabel'),
        verificationStateLabel: this.$t('allergy.verificationStateLabel'),
        reactionLabel: this.$t('allergy.reactionLabel'),
        reactionsLabel: this.$t('allergy.reactionsLabel'),
        reactionDateLabel: this.$t('allergy.reactionDateLabel'),
        reactionSubstanceLabel: this.$t('allergy.reactionSubstanceLabel'),
        reactionSeverityLabel: this.$t('allergy.reactionSeverityLabel'),
        reactionDescriptionLabel: this.$t('allergy.reactionDescriptionLabel'),
        additionalInformation: this.$t('allergy.additionalInformation'),
        categoryLabel: this.$t('allergy.categoryLabel'),
        criticalityLabel: this.$t('allergy.criticalityLabel'),
        noteLabel: this.$t('allergy.noteLabel'),
        exposureDateLabel: this.$t('allergy.exposureDateLabel'),
        exposureRouteLabel: this.$t('allergy.exposureRouteLabel'),
        reactionNoteLabel: this.$t('allergy.reactionNoteLabel'),
        reactionLocationLabel: this.$t('allergy.reactionLocationLabel'),
        noOtherDataAvailable: this.$t('allergy.noOtherDataAvailable')
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
