<template>
<div v-if="translations" class="patient-view">
  <div class="row">
    <div class="col-2">
      <b>
        {{ translations.nameLabel }}
      </b>
    </div>
    <div class="col-4">
      <span :class="editMode ? 'editable' : 'non-editable'">
        {{familyName.toUpperCase()}}
      </span>
      <q-popup-edit v-if="editMode"
                    v-model="familyName"
                    auto-save
                    v-slot="scope">
        <q-input v-model="scope.value"
                 dense
                 autofocus
                 @keyup.enter="scope.set" />
      </q-popup-edit>
    </div>
    <div class="col-2">
      <b>
        {{ translations.genderLabel }}
      </b>
    </div>
    <div class="col-4">
      <span :class="editMode ? 'editable' : 'non-editable'">
        {{ getGenderTranslation(gender) }}
      </span>
      <q-popup-edit v-if="editMode"
                    v-model="gender"
                    auto-save
                    v-slot="scope">
        <q-select  v-model="scope.value"
                   :options="genderOptions"
                   :option-label="(gender) => getGenderTranslation(gender.toLowerCase())"/>
      </q-popup-edit>
    </div>
  </div>
  <div class="row">
    <div class="col-2">
      <b>
        {{ translations.givenLabel }}
      </b>
    </div>
    <div class="col-4">
      <span :class="editMode ? 'editable' : 'non-editable'">
        {{ givenNames.map((name, index) => index === 0 ? name.toUpperCase() : name).join(' ') }}

      </span>
      <q-popup-edit v-if="editMode"
                    v-model="givenNames"
                    auto-save
                    v-slot="scope">
        <div v-for="value, index in scope.value"
             :key="'nameInput' + index.toString()">
          <q-input v-model="scope.value[index]"
                   dense
                   class="given-input"
                   :autofocus="index===0"
                   @keyup.enter="scope.set" />
          <q-icon v-if="scope.value.length > 1"
                  name="fas fa-trash"
                  class="inline-icon add-delete-icon"
                  @click="() => scope.value.splice(index, 1)"/>
          <q-icon v-if="index === scope.value.length - 1"
                  name="fas fa-plus"
                  class="inline-icon add-delete-icon"
                  @click="() => scope.value.push('')"/>
        </div>

      </q-popup-edit>
    </div>


    <div class="col-2">
      <b>
        {{ translations.birthdateLabel }}
      </b>
    </div>
    <div class="col-4">
      <span :class="editMode ? 'editable' : 'non-editable'">
        {{ birthdate ? dateFormatter.format(new Date(birthdate)) : '-' }}
      </span>
      <q-popup-edit v-if="editMode"
                    v-model="birthdate"
                    auto-save
                    v-slot="scope">
        <q-input v-model="scope.value"
                 dense
                 type="date"
                 autofocus
                 @keyup.enter="scope.set" />
      </q-popup-edit>
    </div>
  </div>

  <q-separator size="0pt" />

  <div class="row">
    <div class="col-2">
      <b>
        {{ translations.addressLabel }}
      </b>
    </div>
    <div class="col-10">
      <ul class="editable-list">
        <li v-for="address, index in addresses"
            :key="address.toString().substring(0,20)">
          <div>
          <span :class="editMode ? 'editable' : 'non-editable'">
              {{ address.line?.join(', ') }}{{ address.line && address.line[0] == '' ? ' ' : ','}} {{ address.postalCode }} {{ address.city }}
              <q-icon v-if="editMode && addresses.length > 1"
                      name="fas fa-trash"
                      class="add-delete-icon"
                      @click.stop="() => addresses.splice(index, 1)"/>
            </span>
              <q-icon v-if="editMode && index === addresses.length - 1"
                  name="fas fa-plus"
                  class="add-delete-icon"
                  @click.stop="() => addresses.push({line: [''], city: '', postalCode: ''})"/>
          </div>

          <q-popup-edit v-if="editMode"
                        v-model="addresses[index]"
                        auto-save
                        v-slot="scope">
            <q-input v-for="line, index in scope.value.line"
                     :key="'line' + index"
                     :autofocus="index === 0"
                     v-model="scope.value.line[index]"
                     :label="translations.streetLabel"
                     dense
                     @keyup.enter="scope.set" />
            <q-input v-model="scope.value.postalCode"
                     :label="translations.zipLabel"
                     dense
                     @keyup.enter="scope.set" />
            <q-input v-model="scope.value.city"
                     :label="translations.cityLabel"
                     dense
                     @keyup.enter="scope.set" />
          </q-popup-edit>
        </li>
      </ul>
    </div>
  </div>

  <q-separator size="0pt" />

  <div class="row">
    <div class="col-2">
      <b>
        {{ translations.identifiersLabel }}
      </b>
    </div>
  </div>
  <div class="row" v-if="eprSpid">
    <div class="col-2">
      {{ translations.eprSpidLabel }}
    </div>
    <div class="col-6">
      <span class="non-editable">
        {{ eprSpid }}
      </span>
    </div>
  </div>
  <div class="row" v-if="localIds">
    <div class="col-2">
      {{ translations.localIdLabel }}
    </div>
    <div class="col-6">
      <ul class="editable-list">
        <li v-for="id, index in localIds"
            :key="index.toString() + id.value"
            class="id-list">
          <div>
          <span :class="editMode ? 'editable' : 'non-editable'">
            {{ id.value }}
            <q-icon v-if="editMode && localIds.length > 1"
                      name="fas fa-trash"
                      class="add-delete-icon"
                      @click="() => localIds.splice(index, 1)" />

            </span>
            <q-icon v-if="editMode && index === localIds.length - 1"
                  name="fas fa-plus"
                  class="add-delete-icon"
                  @click.stop="() => localIds.push({system: $store.getOids().local, value: ''})"/>
          </div>

          <q-popup-edit v-if="editMode"
                        v-model="localIds[index].value"
                        auto-save
                        v-slot="scope">
            <q-input v-model="scope.value"
                    dense
                    autofocus
                    @keyup.enter="scope.set" />
          </q-popup-edit>
        </li>
      </ul>
    </div>
  </div>

  <q-separator size="0pt" />

  <div class="rows" v-if="!editMode">
    <DocumentSearch :patient="patient"
                    ref="documentSearch"
                    :locale="locale"
                    :demoMode="true"
                    :addedDocuments="uploadedDocuments"
                    @found-document="openDocument"
                    :translations="translations.documentSearchStrings"/>

    <q-btn :label="translations.addDocumentButton"
           @click="() => showAddDocumentPopup = true"
           class="add-document-button"
           small
           v-if="!editMode"/>

    <div v-if="uploadSuccess != undefined" class="upload-feedback">
      <p v-if="uploadSuccess" class="success">{{ translations.uploadSuccessful }}</p>
      <p v-if="!uploadSuccess" class="error">{{ translations.uploadUnsuccessful }}</p>
    </div>
  </div>

  <q-separator size="0pt" v-if="!editMode"/>
  <div class="rows">
    <div class="col button-container">
      <q-btn v-if="options && options.showEditButton"
                :label="editMode
                            ? translations.saveButtonLabel || 'OK'
                            : translations.editButtonLabel || '✎'"
                :loading="updatingPatient"
                @click="editPatient"/>
      <q-btn v-if="editMode"
                :label="translations.cancelButtonLabel || 'X'"
                @click="cancelEdit" />
      <div v-if="!editMode && options">
        <q-btn v-for="aButton in options.actionButtons"
               :key="aButton.label"
               :label="aButton.label"
               @click="aButton.onClick(patient)"/>
      </div>
    </div>
    <p v-if="editMode && error" class="warning"> {{translations.uploadError}} </p>
    <p v-if="success" class="success"> {{translations.uploadSuccess}} </p>
  </div>

  <q-dialog v-model="showAddDocumentPopup" no-backdrop-dismiss>
    <q-card class="upload-card">
      <DocumentUpload
        @upload-result="onUploaded"
        :patient="patient"
        :locale="locale || 'de-CH'"
        :localIdSystem="localIdSystem"
        :onDone="() => {showAddDocumentPopup = false}"
        :translations="translations.documentUploadStrings"
      />
    </q-card>
  </q-dialog>
</div>

</template>

<script lang="ts">
import { Identifier, Patient, PatientAdministrativeGender, MessageHeader, MessageHeaderResponseType, Address, DocumentReference, Bundle } from '@i4mi/fhir_r4';
import { defineComponent, PropType } from 'vue';
import fhirpath from 'fhirpath';
import { ITI_93_ACTION, useITI93, fetchDocumentReference } from 'src/utils/epdPlaygroundUtils';
import DocumentSearch, { DocumentSearchTranslationStrings } from './DocumentSearch.vue';
import DocumentUpload, { DocumentUploadTranslationStrings } from './DocumentUpload.vue';

/**
 * Defines the strings displayed in the component.
 * Used this way to be independent from different i18n
 * systems.
 */
export interface PatientViewTranslationStrings {
  nameLabel: string;
  givenLabel: string;
  genderLabel: string;
  birthdateLabel: string;
  identifiersLabel: string;
  localIdLabel: string;
  mpiIdLabel: string;
  eprSpidLabel: string;
  addressLabel: string;
  streetLabel: string;
  zipLabel: string;
  cityLabel: string;
  maleGender: string;
  femaleGender: string;
  otherGender: string;
  unknownGender: string;
  editButtonLabel?: string;
  saveButtonLabel?: string;
  cancelButtonLabel?: string;
  uploadError: string;
  uploadSuccess: string;
  openPrompt1: string;
  openPrompt2: string;
  documentSearchStrings: DocumentSearchTranslationStrings;
  addDocumentButton: string;
  documentUploadStrings: DocumentUploadTranslationStrings;
  uploadSuccessful: string;
  uploadUnsuccessful: string;
}
/**
 * Options for PatientView component
 * @param showEditButton  determines if the edit button is shown
 *                        and thus the patient data can be edited
 * @param actionButtons   array of possible buttons to be displayed
 *                        on the bottom of the page.
 *                        needs properties:
 *                        - label: the string to be displayed on the button
 *                        - onClick: callback method to be called with the patient
 *                          resource as an argument when the button is clicked
 */
export interface PatientViewOptions {
  showEditButton: boolean;
  actionButtons: {
    label: string;
    onClick: (pat: Patient) => void;
  }[];
}

// how long to show upload message in seconds
const UPLOAD_MESSAGE_TIMER = 5;

/**
 * Shows patient details including documents.
 * Also provides functionality to edit patient & upload documents (uses DocumentUpload.vue & DocumentSearch.vue).
 */
export default defineComponent({
    name: 'PatientView',
    components: { DocumentSearch, DocumentUpload },
    data() {
        return {
            givenNames: new Array<string>(),
            familyName: '',
            gender: PatientAdministrativeGender.UNKNOWN,
            // Administrative gender of the patient
            birthdate: '',
            addresses: new Array<Address>(),
            eprSpid: '',
            mpiId: '',
            localIds: new Array<Identifier>(),
            editMode: false,
            showAddDocumentPopup: false,
            updatingPatient: false,
            historyPatient: {},
            uploadedDocuments: new Array<DocumentReference>(),
            dateFormatter: new Intl.DateTimeFormat(this.$i18n.locale),
            // helper for formating date according to locale
            genderOptions: new Array<PatientAdministrativeGender>(),
            // list of available choices in the gender dropdown
            documentSearchDemoMode: true,
            localIdSystem: {
              urn: this.$store.getOids().local,
              display: ''
            },
            error: false,
            success: false, // indicates successful updating
            uploadSuccess: undefined as boolean | undefined // indicates success or failure of upload
        };
    },
    props: {
        /**
         * The Patient resource to be displayed (and possibly edited).
         */
        patient: {
            type: Object as PropType<Patient>,
            required: true
        },
        /**
         * Strings for displaying on the page.
         * @see   PatientViewTranslationStrings interface for details
         */
        translations: {
            type: Object as PropType<PatientViewTranslationStrings>,
            required: true
        },
        /**
         * Options for the component.
         * @see   PatientViewOptions interface for details
         */
        options: {
            type: Object as PropType<PatientViewOptions>,
            required: false
        },
        /**
         * The shorthand for the local language (e.g. de-CH). Default is de-CH.
         */
        locale: {
          type: String,
          required: false
        }
    },
    emits: {
      /**
       * Notifies parent component about updated patient. Emitted after successful upload of patient data.
       */
        'edited-patient': (payload: Patient) => {
            return payload !== undefined;
        }
    },
    beforeMount() {
      for (var gender in PatientAdministrativeGender) {
          this.genderOptions.push(gender as PatientAdministrativeGender);
      }
      this.fillDataFromPatient(this.$props.patient);

      // write organization name to localIdSystem, if available
      this.localIdSystem.display = this.$store.getOrganizationResource().name || this.localIdSystem.display;
    },
    methods: {
      /**
       * Method called by the edit Button. Toggles editMode, and
       * updates the changes on the EPD playground.
       * On successful edit, the edited-patient Event is emitted.
       */
      editPatient() {
        this.documentSearchDemoMode = false; // quicker update after edit
        if (this.editMode) {
            const organization = this.$store.getOrganizationResource();
            organization.id = organization.id || '1';
            this.error = false;
            this.updatingPatient = true;
            const pat: Patient = this.$props.patient;
            if (pat.name && pat.name[0]) {
                pat.name[0].family = this.familyName;
                pat.name[0].given = this.givenNames.filter(name => name !== '');
            } else {
              pat.name = [
                  {
                    family: this.familyName,
                    given: this.givenNames
                  }
              ];
            }
            pat.address = this.addresses.filter(a => a.city !== '' && a.postalCode !== '');
            pat.gender = this.gender;
            pat.birthDate = this.birthdate;
            const oids = this.$store.getOids();
            const foreignIdentifiers = pat.identifier?.filter(i => {
                i.system !== oids.mpiId &&
                    i.system !== oids.eprSpid &&
                    i.system !== oids.local;
            }) || [];
            pat.identifier = ([
                {
                    system: oids.mpiId,
                    value: this.mpiId
                },
                {
                    system: oids.eprSpid,
                    value: this.eprSpid
                }
            ] as Identifier[])
                .concat(this.localIds.filter(id => id.value !== ''))
                .concat(foreignIdentifiers);
            pat.contained = [organization];
            pat.managingOrganization = {
                reference: '#' + organization.id
            };
            useITI93(pat, ITI_93_ACTION.UPDATE)
                .then(response => {
                if (response.entry &&
                    response.entry[0] &&
                    response.entry[0].resource &&
                    (response.entry[0].resource as MessageHeader).response?.code == MessageHeaderResponseType.OK) {
                    this.historyPatient = pat;
                    this.$emit('edited-patient', pat);
                    this.success = true;
                    this.editMode = false;
                }
                else {
                    this.error = true;
                }
                this.updatingPatient = false;
            })
                .catch((e) => {
                this.error = true;
                this.updatingPatient = false;
                console.log('Error updating Patient ' + this.givenNames[0] + ' ' + this.familyName, e);
            });
        }
        else {
            this.editMode = true;
            this.success = false;
        }
      },
      /**
       * Cancels edit mode and resets all data to the previous state.
       */
      cancelEdit() {
          this.editMode = false;
          this.fillDataFromPatient(this.historyPatient);
      },
      /**
       * Helper to get gender translation string.
       */
      getGenderTranslation(gender: string): string {
        let genderString = this.$props.translations.unknownGender;
        switch(gender) {
          case 'male':
            genderString = this.$props.translations.maleGender;
            break;
          case 'female':
            genderString =  this.$props.translations.femaleGender;
            break;
          case 'other':
            genderString =  this.$props.translations.otherGender;
            break;
        }
        return genderString;
      },
      /**
       * Populates the component state from a Patient resource (e.g. from the props, or from
       * a previous state).
       */
      fillDataFromPatient(pat: Patient): void {
          const oids = this.$store.getOids();
          this.givenNames = (fhirpath.evaluate(pat, 'Patient.name.first().given') as string[]) || [];
          this.familyName = (fhirpath.evaluate(pat, 'Patient.name.first().family') as string[])[0] || '';
          this.gender = pat.gender || PatientAdministrativeGender.UNKNOWN;
          this.birthdate = pat.birthDate || '';
          this.addresses = pat.address || [];
          this.eprSpid = pat.identifier?.find(i => i.system === oids.eprSpid)?.value || '';
          this.mpiId = pat.identifier?.find(i => i.system === oids.mpiId)?.value || '';
          this.localIds = pat.identifier?.filter(i => i.system === oids.local) || [];
          this.historyPatient = JSON.parse(JSON.stringify(pat)) as Patient;
      },
      /**
       * Opens a new window for a document selected in the SearchDocument component.
       * @param event   the Event as emitted from the SearchDocument component.
       */
      openDocument(event: {document: string, metadata: DocumentReference}) {
        const documentReference = event.metadata;
        if (
          documentReference.content &&
          documentReference.content[0] &&
          documentReference.content[0].attachment &&
          documentReference.content[0].attachment.url
        ) {
          if (
            confirm(this.$props.translations.openPrompt1 + (documentReference.description || '?') + this.$props.translations.openPrompt2)
          ) {
            window.open(documentReference.content[0].attachment.url);
          }
        } else {
          console.log('Cann not open document in window, unsufficient metadata', document);
        }
      },
      /**
       * Handles the upload result of the DocumentUpload component.
       */
      onUploaded(bundle: Bundle) {
        this.showAddDocumentPopup = false;

        const reference = bundle.entry?.find((e => e.response?.location?.includes('DocumentReference')));

        if (reference) {
          const id = reference.response?.location?.split('/')[1];
          if (id) {
            fetchDocumentReference(id)
            .then(ref => {
                this.uploadedDocuments.push(ref);
                this.uploadSuccess = true;
              })
            .catch(e => {
              console.log('couldnt fetch DocumentReference', e);
              this.uploadSuccess = false;
            });
          }
        } else {
          this.uploadSuccess = false;
        }

        setTimeout(() => {
          this.uploadSuccess = undefined;
        }, UPLOAD_MESSAGE_TIMER * 1000)
      }
  },
  watch: {
    /**
     * Necessary to parse uppercase string input from q-select to PatientAdministrativeGender.
     */
    gender(n: string | PatientAdministrativeGender): void {
        switch (n) {
            case 'MALE':
            case 'FEMALE':
            case 'OTHER':
            case 'UNKNOWN':
                this.gender = PatientAdministrativeGender[n];
        }
    }
  }
});
</script>

<style scoped lang="scss">
.col-4, .col-2, .col-6 {
  padding: 0.5em 0;
}
.patient-view {
  padding: 1em;
}
.editable-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.editable-list li {
  padding-bottom: 0.6em;
}
.editable-list li:last-child {
  padding-bottom: 0;
}
.non-editable {
  padding: 0.3em 0.5em;
  border: 1pt solid white;
}
.editable {
  cursor: pointer;
  padding: 0.3em 0.5em;
  border-radius: 0.2em;
  border-color: $grey;
  border-style: solid;
  border-width: 1pt;
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
.given-input {
  display: inline-flex;
  width: calc(100% - 32pt);
}
div:only-child > .given-input {
  width: calc(100% - 16pt);
}
hr {
  border-top: 1px double #8c8b8b;
  margin: 1em -1em;
}
.button-container > .q-btn, .button-container > div {
  margin: 0.5em 1em;
  display: inline;
}
.button-container > div > .q-btn {
  margin-right: 1em;
}
.upload-card {
  padding: 1em;
  width: 80vw;
  max-width: 650pt;
}
.warning {
  color: $warning;
  text-align: center;
  margin-top: 1.5em;
}
.success {
  color: $positive;
  text-align: center;
  margin-top: 1.5em;
}
.add-document-button {
  margin-top: 1em;
  align-self: end;
  display: block;
  margin-left: auto;
  margin-right: 0;
}
.upload-feedback {
  margin-top: 1em;
}
.upload-feedback p {
  text-align: center;
}
.upload-feedback p.success {
  color: green;
}
.upload-feedback p.error {
  color: red;
}
</style>
