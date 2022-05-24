<template>
  <div v-if="translations">
    <div class="document-upload">
      <q-stepper
        v-model="step"
        header-nav
        ref="stepper"
        color="primary"
        animated>
        <q-step
          :name="1"
          :title=translations.selectFile>
          <p class="explain-text">
            {{ translations.selectFileText }}
            </p>

            <div class="row">
              <div class="col">
              <q-file v-model="file"
                      :label="translations.selectFile"
                      dense/>
            </div>
            <div class="col fhir-checkbox"
                v-if="file && file.name.includes('.json')">
              <q-checkbox v-model="isFhir" :label="translations.jsonFhir" />
            </div>
          </div>

          <q-stepper-navigation>
            <q-btn @click="() => {  step = 2 }" color="primary" :label="translations.continue" :disable="!file" />
          </q-stepper-navigation>
        </q-step>

        <q-step
          :name="2"
          :title=translations.titleAndDescription
          :disable="!file">
          <p class="explain-text">
            {{ translations.descriptionText }}
          </p>
          <div class="row">
            <div class="col">
              <q-input v-model="title"
                      type="text"
                      dense
                      :label="translations.titleInputLabel"
              />
            </div>
          </div>
          <div class="row">
            <div class="col description">
              <q-input
                v-model="description"
                filled
                dense
                type="textarea"
                :label="translations.descriptionInputLabel"
              />
            </div>
          </div>

          <q-stepper-navigation>
            <q-btn flat @click="step = 1" color="primary" :label="translations.back" />
            <q-btn @click="() => {  step = 3 }" color="primary" :label="translations.continue" :disable="!description || description.length < 1"  class="q-ml-sm"/>
          </q-stepper-navigation>
        </q-step>

        <q-step
          :name="3"
          :title=translations.metadata
          :disable="!file">
          <div class="row">
            <div class="col">
              <p>{{ translations.languageText }}</p>
            </div>
            <div class="col">
              <q-select
                v-model="language"
                :label=translations.language
                :options="languageOptions"
                :option-label="(item) => (item && item.label ? item.label[languageString] : '?')"
                :option-value="(item) => (item && item.value ? item.value : undefined)"
              />
            </div>
          </div>
          <div class="row">
            <div class="col select-col">
             <p>{{ translations.fileTypeText }}</p>
            </div>
          </div>
          <div class="row">
            <div class="col select-col">
              <q-select v-model="typeSelect"
                    :options="typeCodeOptions"
                    dense
                    use-input
                    @filter="filterType"
                    :option-label="(item) => (item == null ? '?' : item.languageDisplays[languageString])"
                    :option-value="(item) => (item == null ? null : item.defaultCoding.code)"
                    :label="translations.typeLabel"
              />
            </div>
          </div>
          <div class="row" v-if="typeSelect && classCodeOptions.length > 1">
            <div class="col select-col">
              <p>{{ translations.typeNotSufficient }}</p>
              <q-select v-model="categorySelect"
                        :options="classCodeOptions"
                        dense
                        :option-label="(item) => (item == null ? '?' : item.languageDisplays[languageString])"
                        :option-value="(item) => (item == null ? null : item.defaultCoding.code)"
                        :label="translations.categoryLabel"
              />
            </div>
          </div>

          <q-stepper-navigation>
            <q-btn flat @click="step = 2" color="primary" :label="translations.back" />
            <q-btn @click="() => { step = 4 }" color="primary" :label="translations.continue" :disable="!typeSelect" class="q-ml-sm"/>
          </q-stepper-navigation>
        </q-step>

        <q-step
          :name="4"
          :title=translations.creatingInstitution
          :disable="!typeSelect">

          <div class="row">
            <div class="col select-col">
             <p>{{ translations.creatingInstitutionText }}</p>
            </div>
          </div>

           <div class="row">
            <div class="col select-col">
              <q-select v-model="facility"
                        :options="facilityOptions"
                        dense
                        use-input
                        @filter="filterFacility"
                        :option-label="(item) => (item == null ? '?' : item.languageDisplays[languageString])"
                        :option-value="(item) => (item == null ? null : item.defaultCoding.code)"
                        :label=translations.institution
              />
            </div>
          </div>

          <div class="row">
            <div class="col select-col">
             <p>{{ translations.specialisationText }}</p>
            </div>
          </div>

           <div class="row">
            <div class="col select-col">
              <q-select v-model="practiceSetting"
                        :options="practiceSettingOptions"
                        dense
                        use-input
                        @filter="filterPracticeSetting"
                        :option-label="(item) => (item == null ? '?' : item.languageDisplays[languageString])"
                        :option-value="(item) => (item == null ? null : item.defaultCoding.code)"
                        :label=translations.specialisation
              />
            </div>
          </div>

          <q-stepper-navigation>
            <q-btn flat @click="step = 2" color="primary" :label="translations.back" class="q-ml-sm" />
          </q-stepper-navigation>
        </q-step>
      </q-stepper>

      <div class="button-container">
        <q-btn id="cancelButton"
               @click="() => onDone(false)"
               :label="translations.cancelButtonLabel"
        />
        <q-btn id="uploadButton"
               :disabled="!ready"
               @click="uploadBinaryDocument"
               :color="ready ? 'primary' : undefined"
               :label="translations.uploadButtonLabel + patientName"
        />
      </div>
    </div>
  </div>
  <div v-else>
    <p>Missing translations</p>
  </div>
</template>

<script lang="ts">
import { Bundle, BundleType, Patient } from '@i4mi/fhir_r4';
import { getLangStringFromLocale } from 'src/boot/i18n';
import { iti65DocumentBundle, useITI65 } from 'src/utils/epdPlaygroundUtils';
import {
  CLASS_CODES,
  CLASS_TYPE_COMBINATIONS,
  createIti65Bundle,
  FACILITY_CLASS_CODES,
  iti65Metadata,
  PRACTICE_SETTING_CODES,
  SUPPORTED_LANGUAGE_DISPLAYS,
  SystemCodeExtension,
  TYPE_CODES
} from 'src/utils/fhirUtils';
import { defineComponent, PropType } from 'vue';

/**
 * Defines the strings displayed in the component.
 * Used this way to be independent from different i18n
 * systems.
 */
export interface DocumentUploadTranslationStrings {
  titleLabel: string;
  selectFileText: string;
  metadata: string;
  metadataText: string;
  titleInputLabel: string;
  descriptionInputLabel: string;
  uploadButtonLabel: string;
  cancelButtonLabel: string;
  categoryLabel: string;
  typeLabel: string;
  selectFile: string;
  titleAndDescription: string;
  descriptionText: string;
  languageText: string;
  language: string;
  fileTypeText: string;
  typeNotSufficient: string;
  creatingInstitution: string;
  creatingInstitutionText: string;
  institution: string;
  specialisation: string;
  specialisationText: string;
  jsonFhir: string;
  continue: string;
  back: string;
}

function findSystemCodeExtension(code: string, extensions: SystemCodeExtension[]): SystemCodeExtension | undefined {
  return extensions.find(e => e.defaultCoding.code === code);
}

/**
 * Provides UI to describe a document with meta data and uploads it.
 */
export default defineComponent({
  name: 'DocumentUpload',
  data() {
    return {
      currentPatient: {} as Patient,  // the patient the file belongs to, as FHIR resource
      file: undefined as File | undefined,
                                      // selected file of file picker
      title: '',                      // model for title of file
      description: '',                // model for description of file
      language: undefined as {value: string, label: {de: string}} | undefined,
                                      // model for file language,
      languageOptions: SUPPORTED_LANGUAGE_DISPLAYS,
                                      // options for language picker
      date: new Date(),               // model for file date
      isFhir: false,                  // model for describing if file is FHIR,
      step: 1,                        // model for step of stepper
      categorySelect: undefined as SystemCodeExtension | undefined,
                                      // model for selected category to describe file
      classCodeOptions: [] as Array<SystemCodeExtension>,
                                      // options for selected category to describe file
      typeSelect: undefined as SystemCodeExtension | undefined,
                                      // model for selected type to describe file
      typeCodeOptions: [] as Array<SystemCodeExtension>,
                                      // options for selected type to describe file
      facility: undefined as SystemCodeExtension | undefined,
                                      // model for facility
      facilityOptions: [] as Array<SystemCodeExtension>,
                                      // options for facility type
      practiceSetting: undefined as SystemCodeExtension | undefined,
                                      // model for practiceSetting
      practiceSettingOptions: [] as Array<SystemCodeExtension>,
                                      // options for practiceSetting type
      languageString: getLangStringFromLocale(this.$props.locale)
                                      // shortened version of locale prop (e.g. 'de' instead of 'de-CH')

    };
  },
  props: {
    /**
     * Strings for displaying on the page.
     * @see   PatientSearchTranslationStrings interface for details
     */
    translations: {
      type: Object as PropType<DocumentUploadTranslationStrings>,
      required: true
    },
    /**
     * The patient resource the file belongs to.
     */
    patient: {
      type: Object as PropType<Patient>,
      required: true
    },
    /**
     * Function to be called when the upload process is done.
     */
    onDone: {
      type: Function as PropType<((success: boolean) => void)>,
      required: true
    },
    /**
     * The shorthand for the local language (e.g. de-CH). Default is de-CH.
     */
    locale: {
      type: String,
      required: true
    }
  },
  emits: {
    /**
     * Notify parent component about upload result.
     * Emitted after successful upload of document bundle.
     *
     * @param payload Bundle of document if upload was successful
     */
    'upload-result': (payload: Bundle) => {
      return payload !== undefined;
    }
  },
  beforeMount() {
    // prepare options for select class and type codes
    this.classCodeOptions = CLASS_CODES as [];

    this.classCodeOptions.sort((a,b):number => {
      return this.sortCodeOptions(a,b)
    });

    this.typeCodeOptions = TYPE_CODES as [];

    this.typeCodeOptions.sort((a,b):number => {
      return this.sortCodeOptions(a,b)
    });

    this.facility = findSystemCodeExtension(
      this.$store.getSettings().facilityType.code || '',
      FACILITY_CLASS_CODES
    );

    this.facilityOptions = FACILITY_CLASS_CODES.sort((a,b):number => {
      return this.sortCodeOptions(a,b)
    });

    this.practiceSetting = findSystemCodeExtension(
      this.$store.getSettings().practiceSetting.code || '',
      PRACTICE_SETTING_CODES
    );

    this.practiceSettingOptions = PRACTICE_SETTING_CODES.sort((a,b):number => {
      return this.sortCodeOptions(a,b)
    });

    // set language from app setting
    this.language = this.languageOptions.find(lo => lo.value === getLangStringFromLocale(this.$store.getLanguage()) as string)
  },
  methods: {
    /**
     * Creates a ITI65Bundle out of selected file and other state properties
     * and uses iti65-transaction to send it to the EPD playground.
     * Updates state according to upload result.
     */
    uploadBinaryDocument() {
      if (!this.categorySelect || !this.typeSelect ) {
        console.warn('Category or Type is undefined.');
        return;
      }

      const category = this.categorySelect.defaultCoding;
      category.display = this.categorySelect.languageDisplays[this.languageString];

      const type = this.typeSelect.defaultCoding;
      type.display = this.typeSelect.languageDisplays[this.languageString];

      const metadata = {
        title: this.title,
        isFhir: this.isFhir,
        description: this.description,
        contentLanguage: this.language?.value || '',
        sourceIdentifier: this.$store.getOids().app,
        categoryCoding: category,
        typeCoding: type,
        facilityCoding: this.facility?.defaultCoding,
        practiceSettingCoding: this.practiceSetting?.defaultCoding

      } as iti65Metadata;

      if (this.$props.patient && this.file) {
        createIti65Bundle(this.$props.patient, this.file, metadata)
          .then((bundle: iti65DocumentBundle) => useITI65(bundle))
          .then((response) => {
            this.$emit('upload-result', response);
          })
          .catch((err) => {
            this.$emit('upload-result', {type: BundleType.TRANSACTION_RESPONSE});
            console.warn('failed to upload', err);
          });
      } else {
        this.$emit('upload-result', {type: BundleType.TRANSACTION_RESPONSE});
        console.warn('Can\'t upload without file or patient.');
      }
    },
    /**
     * Finds the matching class code for a given DocumentReference type
     * @see             http://ehealthsuisse.art-decor.org/ch-epr-html-20200226T180620/voc-2.16.756.5.30.1.127.3.10.1.30-2020-02-26T174502.html
     * @see             https://fhir.ch/ig/ch-epr-term/ValueSet-DocumentEntry.classCode.html#logical-definition-cld
     * @see             https://build.fhir.org/documentreference-mappings.html#xds
     * @param typeCode  the default coding code of the type to find
     * @returns         an array with all categories matching the type
     */
    findCategoryForType(typeCode: string): Array<SystemCodeExtension> {
      const classes = CLASS_TYPE_COMBINATIONS.filter(combination => {
        return combination.possibleTypeCodes.includes(typeCode) ;
      }).map(combination => combination.classCode);
      return CLASS_CODES.filter(tc => classes.includes(tc.defaultCoding.code.toString()));
    },
    /**
     * Helper function for filtering the type dropdown
     * @param filter the filter string
     * @param update callback method for updating
     */
    filterType(filter: string, update: (cb: () => void) => void): void {
      if (filter == '') {
        update(() => {
          this.typeCodeOptions = TYPE_CODES;
        })
      }
      if (filter.length > 0) {
        update(() => {
          const searchString = filter.toLowerCase();
          this.typeCodeOptions = TYPE_CODES.filter(code => {
            return code.languageDisplays[this.languageString].toLowerCase().includes(searchString);
          });
        });
      }
    },
    /**
     * Helper function for filtering the facility dropdown
     * @param filter the filter string
     * @param update callback method for updating
     */
    filterFacility(filter: string, update: (cb: () => void) => void): void {
      if (filter == '') {
        update(() => {
          this.facilityOptions = FACILITY_CLASS_CODES;
        })
      }
      if (filter.length > 0) {
        update(() => {
          const searchString = filter.toLowerCase();
          this.facilityOptions = FACILITY_CLASS_CODES.filter(code => {
            return code.languageDisplays[this.languageString].toLowerCase().includes(searchString);
          });
        });
      }
    },
    /**
     * Helper function for filtering the practiceSetting dropdown
     * @param filter the filter string
     * @param update callback method for updating
     */
    filterPracticeSetting(filter: string, update: (cb: () => void) => void): void {
      if (filter == '') {
        update(() => {
          this.practiceSettingOptions = PRACTICE_SETTING_CODES;
        })
      }
      if (filter.length > 0) {
        update(() => {
          const searchString = filter.toLowerCase();
          this.practiceSettingOptions = PRACTICE_SETTING_CODES.filter(code => {
            return code.languageDisplays[this.languageString].toLowerCase().includes(searchString);
          });
        });
      }
    },
    /**
     * Alphabetical sorting for type and category language displays according to app language.
     */
    sortCodeOptions(a: SystemCodeExtension, b: SystemCodeExtension): number {
      if (a.languageDisplays[this.languageString] < b.languageDisplays[this.languageString]) {
        return -1;
      }
      if (a.languageDisplays[this.languageString] > b.languageDisplays[this.languageString]) {
        return 1;
      }
      return 0;
    }
  },
  watch: {
    /**
     * Watcher, that updates the title property when a new file is selected.
     * @param n the changed file
     */
    file(n: File) {
      const name = n.name.split('.')[0];
      this.title = name;
    },
    /**
     * Check type select and select matching category. If more than one
     * categorie is available, the user will be prompted for that.
     */
    typeSelect(n: SystemCodeExtension) {
      if (n) {
        const categories = this.findCategoryForType(n.defaultCoding.code);
      if (categories.length === 1) {
        this.categorySelect = categories[0];
        this.classCodeOptions = categories;
      } else {
        this.classCodeOptions = categories;
      }
      }
    },
  },
  computed: {
    /**
     * Builds the full patient name out of the Patient resource.
     */
    patientName(): string {
      if (this.$props.patient.name && this.$props.patient.name[0] && this.$props.patient.name[0].given) {
        const given = this.$props.patient.name[0].given[0] || '';
        const family = this.$props.patient.name[0].family || '';
        return given + ' ' + family;
      }
      return '';
    },
    /**
     * Criteria to activate the upload button.
     */
    ready(): boolean {
      return this.description.length > 0 && this.typeSelect != undefined
    }
  }
});
</script>

<style scoped lang="scss">
.document-upload {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
hr {
  border-top: 1px double #8c8b8b;
  margin: 1em -1em;
}
h3 {
  font-size: 1.2em;
  margin: 0;
  font-weight: bold;
}
.fhir-checkbox {
  margin-top: 0.3em;
}
.q-field__label {
  font-size: 1em !important;
  background-color: red;
}
.select-col {
  margin: 0.5em;
}
.description {
  margin-top: 1em;
}

.button-container {
  margin-top: 1em;
}
.button-container > .q-btn {
  margin: 0.5em;
}
.explain-text {
  margin: 0.5em 0;
}
</style>
