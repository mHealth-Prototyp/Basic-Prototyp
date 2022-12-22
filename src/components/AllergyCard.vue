<template>
  <q-card class="dashboard-card">
    <q-card-section class="card-title">
      <q-icon
        name="fas fa-stethoscope"
        class="big-icon" />
      {{ $t('allergy.title') }}
    </q-card-section>
    <q-tabs
      v-model="tab"
      v-if="suspectedAllergies">
      <q-tab
        name="known"
        :label="$t(smallScreen ? 'allergy.tabKnownShort' : 'allergy.tabKnown')" />
      <q-tab
        name="suspected"
        :label="$t(smallScreen ? 'allergy.tabSuspectedShort' : 'allergy.tabSuspected')" />
    </q-tabs>
    <q-card-section v-if="tab === 'known' || !suspectedAllergies">
      <ul class="allergy-button-list">
        <li
          v-for="allergy in allergies.known"
          :key="allergy.id"
          class="clickable allergy-button"
          @click="
            () => {
              detailDialog = true;
              selectedAllergy = allergy;
            }
          ">
          <p
            class="allergy-button-type"
            v-if="allergy.type">
            {{ $t('common.' + allergy.type) }}
          </p>
          <p class="allergy-button-name">
            {{ getAllergyName(allergy) }}
          </p>
        </li>
      </ul>
      <p
        v-if="allergies.known.length === 0"
        class="no-entries">
        {{ $t('allergy.noEntries') }}
      </p>
      <ul
        class="pages"
        v-if="pages.known > 1">
        <li
          v-for="page in pages.known"
          :key="'knownpagebutton' + page">
          <span
            @click="() => setAllergyPage(page, 'known')"
            :class="page === currentPage.known ? 'clickable current-page' : 'clickable'">
            &nbsp;{{ page }}&nbsp;
          </span>
          <span v-if="page !== pages.known">•</span>
        </li>
      </ul>
    </q-card-section>
    <q-card-section v-if="tab === 'suspected'">
      <ul class="allergy-button-list">
        <li
          v-for="allergy in allergies.suspected"
          :key="allergy.id"
          class="clickable allergy-button"
          @click="
            () => {
              detailDialog = true;
              selectedAllergy = allergy;
            }
          ">
          <p class="allergy-button-type">
            {{ $t('allergy.suspectedSubtitle') }}
          </p>
          <p class="allergy-button-name">
            {{ getAllergyName(allergy) }}
          </p>
        </li>
      </ul>
      <p
        v-if="allergies.suspected.length === 0"
        class="no-entries">
        {{ $t('allergy.noEntries') }}
      </p>
      <ul
        class="pages"
        v-if="pages.suspected > 1">
        <li
          v-for="page in pages.suspected"
          :key="'knownpagebutton' + page">
          <span
            @click="() => setAllergyPage(page, 'suspected')"
            :class="page === currentPage.suspected ? 'clickable current-page' : 'clickable'">
            &nbsp;{{ page }}&nbsp;
          </span>
          <span v-if="page !== pages.suspected">•</span>
        </li>
      </ul>
    </q-card-section>
  </q-card>
  <q-dialog
    v-model="detailDialog"
    class="dialog">
    <q-card class="allergy-dialog-card">
      <q-card-section class="card-title with-close-icon">
        {{ selectedAllergy ? getAllergyName(selectedAllergy) : '' }}
        <q-icon
          @click="
            () => {
              detailDialog = false;
              selectedAllergy = undefined;
            }
          "
          name="fas fa-times"
          class="close-icon"
          flat
          round
          dense
          v-close-popup />
      </q-card-section>
      <q-card-section>
        <AllergyView
          :allergyIntolerance="selectedAllergy"
          :languageString="lang"
          :fhirUtils="$fhirUtils"
          :epdPlaygroundUtils="$epdUtils"
          :showTitle="false" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import {
  AllergyView,
  ALLERGY_IDENTIFICATION_CODES,
  CHAllergyIntolerance,
  FhirUtilLanguageType
} from '@i4mi/mhealth-proto-components';
import {defineComponent, PropType} from 'vue';

/**
 * Component to create or display a list of allergies
 */
export default defineComponent({
  name: 'AllergyCard',
  components: {AllergyView},
  data() {
    return {
      lang: this.$i18n.locale.substring(0, 2) as FhirUtilLanguageType,
      smallScreen: window.innerWidth < 400,
      allergies: {
        known: new Array<CHAllergyIntolerance>(),
        suspected: new Array<CHAllergyIntolerance>()
      },
      pages: {
        known: 0,
        suspected: 0
      },
      currentPage: {
        known: 0,
        suspected: 0
      },
      tab: 'known' as 'known' | 'suspected',
      detailDialog: false,
      selectedAllergy: undefined as CHAllergyIntolerance | undefined
    };
  },
  props: {
    /**
     * The list of confirmed allergies
     */
    confirmedAllergies: {
      type: Object as PropType<Array<CHAllergyIntolerance>>,
      required: true
    },
    /**
     * The list of suspected allergies
     */
    suspectedAllergies: {
      type: Object as PropType<Array<CHAllergyIntolerance>>,
      required: false
    },
    /**
     * Defines how many entries are displayed per page.
     */
    entriesPerPage: {
      type: Number,
      required: true
    }
  },
  beforeMount() {
    this.setAllergyPage(1, 'known');
    if (this.$props.suspectedAllergies) {
      this.setAllergyPage(1, 'suspected');
    }
    this.pages = {
      known: Math.ceil(this.$props.confirmedAllergies.length / this.$props.entriesPerPage),
      suspected: Math.ceil((this.$props.suspectedAllergies?.length || 0) / this.$props.entriesPerPage)
    };
  },
  watch: {
    suspectedAllergies(): void {
      this.setAllergyPage(-1, 'suspected');
    },
    confirmedAllergies(): void {
      this.setAllergyPage(-1, 'known');
    }
  },
  methods: {
    getAllergyName(allergy: CHAllergyIntolerance): string {
      const allergyCoding = allergy.code.coding?.find(
        (coding) => coding.system && coding.system === 'http://snomed.info/sct'
      );
      if (allergyCoding && allergyCoding.code) {
        const code = ALLERGY_IDENTIFICATION_CODES.find((code) => code.defaultCoding.code === allergyCoding.code);
        return code?.languageDisplays[this.lang] || this.$t('common.unknown');
      }
      return this.$t('common.unknown');
    },
    setAllergyPage(page: number, type: 'known' | 'suspected'): void {
      const propArray = type === 'known' ? this.$props.confirmedAllergies : this.$props.suspectedAllergies || [];

      this.pages[type] = Math.ceil(propArray.length / this.$props.entriesPerPage);
      this.currentPage[type] = page === -1 ? this.pages[type] : page;
      const start = (this.currentPage[type] - 1) * this.$props.entriesPerPage;
      this.allergies[type] = propArray.slice(start, start + this.$props.entriesPerPage);
    }
  }
});
</script>

<style lang="scss">
.allergy-button-list,
.pages {
  list-style: none;
  padding: 0;
  margin: 0;
}

.allergy-button {
  border: 1px solid $text;
  border-radius: 4pt;
  margin: 0.8em auto;
  padding: 0.5em 1em;
  width: 80%;
  cursor: pointer;
}

.allergy-button p {
  margin: 0;
  text-align: center;
}

.allergy-button:hover {
  background-color: $lightGray;
  color: $text;
}

.allergy-button-type {
  font-size: 0.9em;
}

.allergy-button-name {
  font-size: 1.2em;
  font-weight: bold;
  width: 100%;
}

.allergy-dialog-card {
  width: 100%;
}

.pages li {
  display: inline;
}

.pages {
  width: 100%;
  text-align: center;
}

.current-page {
  font-weight: bold;
}

.q-tabs {
  color: $accent;
}

.no-entries {
  text-align: center;
  padding: 2em;
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

.additional-infos {
  background-color: $lightGray;
  padding: 1em 2em 0.5em;
  border-radius: 0.5em;
  align-content: center;
}

.additional-infos ul {
  list-style: none;
  padding-left: 0.5em;
}

.additional-infos a {
  color: $text;
  font-weight: bold;
}

.additional-infos a:after {
  content: ' [↗︎]';
}

.additional-infos a:hover {
  text-decoration: none;
  color: $primary;
}

.q-dialog__inner--minimized {
  padding: unset !important;
}
</style>
