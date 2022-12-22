<template>
  <q-card class="settings-card">
    <q-card-section class="card-title">{{ $t('layout.menu.settings') }}</q-card-section>
    <q-card-section>
      <form>
        <h3>{{ $t('common.language') }}</h3>
        <p>{{ $t('settings.languageText') }}</p>
        <q-select
          class="lang-select"
          v-model="language"
          :options="availableLanguages"
          :option-label="(value) => (value == null ? '-' : $t('settings.' + value))"
          :disable="availableLanguages.length < 2"
          :label="$t('common.language')" />

        <q-separator size="0pt" />

        <h3>{{ $t('settings.organizationTitle') }}</h3>
        <p>{{ $t('settings.organizationText') }}</p>

        <div class="row">
          <div class="col">
            <q-input
              v-model="orgName"
              :error="invalidName"
              type="text"
              :label="$t('settings.organizationName')" />
          </div>
          <div class="col">
            <q-input
              v-model="orgOid"
              :error="invalidOid"
              type="text"
              :label="$t('settings.organizationOid')" />
          </div>
        </div>
        <div class="row">
          <div class="col">
            <q-input
              v-model="orgContactGiven"
              :error="invalidGiven"
              type="text"
              :label="$t('settings.organizationGiven')" />
          </div>
          <div class="col">
            <q-input
              v-model="orgContactFamily"
              :error="invalidFamily"
              type="text"
              :label="$t('settings.organizationFamily')" />
          </div>
        </div>
        <p>{{ $t('settings.organizationTypeText') }}</p>
        <div class="row">
          <div class="col select-col">
            <q-select
              v-model="facility"
              :options="facilityOptions"
              dense
              :option-label="(item) => (item == null ? '?' : item.languageDisplays.de)"
              :option-value="(item) => (item == null ? null : item.defaultCoding.code)"
              :label="$t('settings.organizationFacilityType')" />
          </div>
        </div>

        <div class="row">
          <div class="col select-col">
            <q-select
              v-model="practiceSetting"
              :options="practiceSettingOptions"
              dense
              :option-label="(item) => (item == null ? '?' : item.languageDisplays.de)"
              :option-value="(item) => (item == null ? null : item.defaultCoding.code)"
              :label="$t('settings.organizationPracticeSetting')" />
          </div>
        </div>

        <div class="button-container">
          <q-btn
            id="reset-button"
            @click.stop="(e) => reset(e, true)"
            type="submit"
            :label="$t('common.loadDefault')" />
          <q-btn
            id="save-button"
            @click.stop="save"
            type="submit"
            :disable="invalidOid || invalidName || invalidGiven || invalidFamily"
            :label="$t('common.save')" />
        </div>
        <q-separator size="0pt" />
        <h3>{{ $t('settings.oidsTitle') }}</h3>
        <p>{{ $t('settings.oidsText') }}</p>
        <ul class="oid-list">
          <li>
            <b>{{ $t('settings.oidsMpi') }}:</b> <br />
            {{ oids.mpiId }}
          </li>
          <li>
            <b>{{ $t('settings.oidsSpid') }}:</b> <br />
            {{ oids.eprSpid }}
          </li>
          <li>
            <b>{{ $t('settings.oidsAhv') }}:</b> <br />
            {{ oids.ahv }}
          </li>
          <li>
            <b>{{ $t('settings.oidsApp') }}:</b> <br />
            {{ oids.app }}
          </li>
        </ul>
      </form>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import fhirpath from 'fhirpath';
import {FACILITY_CLASS_CODES, PRACTICE_SETTING_CODES, SystemCodeExtension} from '@i4mi/mhealth-proto-components';
import {APP_LANGUAGES, AVAILABLE_LANGUAGES, getLangStringFromLocale} from '../boot/i18n';

export default defineComponent({
  name: 'SettingsPage',
  data() {
    return {
      language: APP_LANGUAGES.DE, // set language
      availableLanguages: new Array<string>(),
      // available languages (for picker)
      orgName: '', // set name of organization
      invalidName: false, // model for name validity
      orgOid: '', // set OID for organization
      invalidOid: false, // model for OID validity
      orgContactGiven: '', // model for organization contact given name
      invalidGiven: false, // model for contact given name valitiy
      orgContactFamily: '', // model for organization contact family name
      invalidFamily: false, // model for contact family name validity
      oids: this.$store.getOids(), // set OIDS
      facility: undefined as SystemCodeExtension | undefined,
      // model for facility
      facilityOptions: [] as Array<SystemCodeExtension>,
      // options for facility type
      practiceSetting: undefined as SystemCodeExtension | undefined,
      // model for practiceSetting
      practiceSettingOptions: [] as Array<SystemCodeExtension>
      // options for practiceSetting type
    };
  },
  beforeMount() {
    AVAILABLE_LANGUAGES.forEach((lang) => this.availableLanguages.push(lang));
    this.reset(undefined, false);
  },
  methods: {
    save(e: Event) {
      e.preventDefault();
      this.oids.local = this.orgOid;
      try {
        this.$store.setOids(this.oids);
        const org = this.$fhirUtils.createFhirOrganization(
          this.orgName,
          {
            system: this.orgOid
          },
          {
            given: this.orgContactGiven,
            family: this.orgContactFamily
          }
        );
        this.$store.setSettings({
          language: this.language,
          organization: org,
          facilityType: this.facility?.defaultCoding || this.$store.getSettings().facilityType,
          practiceSetting: this.practiceSetting?.defaultCoding || this.$store.getSettings().practiceSetting
        });
      } catch (error) {
        this.invalidOid = true;
      }
    },
    reset(e: Event | undefined, getDefault: boolean): void {
      e && e.preventDefault();
      const settings = getDefault ? this.$store.getDefaultSettings() : this.$store.getSettings();
      this.language = settings.language;
      this.orgName = settings.organization.name || '';
      this.orgOid = (
        fhirpath.evaluate(
          settings.organization,
          "Organization.identifier.where(system.contains('urn:oid')).system"
        ) as string[]
      )[0];
      this.orgContactGiven = (
        fhirpath.evaluate(settings.organization, 'Organization.contact.first().name.given') as string[]
      )[0];
      this.orgContactFamily = (
        fhirpath.evaluate(settings.organization, 'Organization.contact.first().name.family') as string[]
      )[0];

      this.facilityOptions = FACILITY_CLASS_CODES;
      this.practiceSettingOptions = PRACTICE_SETTING_CODES;

      this.facility = FACILITY_CLASS_CODES.find((fc) => fc.defaultCoding.code === settings.facilityType.code);
      this.practiceSetting = PRACTICE_SETTING_CODES.find(
        (psc) => psc.defaultCoding.code === settings.practiceSetting.code
      );
    }
  },
  watch: {
    orgOid(n: string): void {
      // test if it's a valid urn:oid number
      const regex = /^([0-2])((\.0)|(\.[1-9][0-9]*))*$/;
      const numberPart = n.split('urn:oid:')[1];
      this.invalidOid = !(numberPart && regex.test(numberPart));
    },
    orgName(n: string) {
      this.invalidName = n.length === 0;
    },
    orgContactGiven(n: string) {
      this.invalidGiven = n.length === 0;
    },
    orgContactFamily(n: string) {
      this.invalidFamily = n.length === 0;
    },
    language(newLanguage: APP_LANGUAGES) {
      this.$store.setLanguage(newLanguage);
      this.$i18n.locale = this.$store.getLanguage();
      import(
        /* webpackInclude: /(de|fr)\.js$/ */
        'quasar/lang/' + getLangStringFromLocale(this.$store.getLanguage())
      )
        .then((lang) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
          this.$q.lang.set(lang.default);
        })
        .catch((error) => console.error(error));
    }
  }
});
</script>

<style scoped lang="scss">
h3 {
  font-size: 1.2em;
  margin: 0;
  font-weight: bold;
}
hr {
  border-top: 1px double #8c8b8b;
  margin: 1em -1em;
}
.q-input {
  margin: 0 1em;
}
.lang-select {
  max-width: 200pt;
}

.col {
  margin-bottom: 1em;
}
.select-col {
  margin-left: 10vw;
  margin-right: 10vw;
}
.button-container {
  margin: 0 auto;
  padding: 1em;
  display: block;
  max-width: 300pt;
}
.button-container .q-btn,
#logout-button {
  margin: 0.5em;
}
</style>
