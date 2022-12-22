<template>
  <q-spinner
    v-if="loading"
    id="spinner" />
  <div
    class="content"
    v-else>
    <p v-if="!selectedDataset && datasets.length > 0">{{ $t('dashboard.choseExport') }}</p>
    <ul v-if="!selectedDataset">
      <li
        class="dataset-links"
        v-for="ds in datasets"
        :key="ds.id"
        @click="set(ds)">
        {{ getDisplayString(ds) }}
      </li>
    </ul>
    <p v-if="datasets.length === 0">
      {{ $t('dashboard.noEntries') }}
    </p>
    <h2 v-if="selectedDataset && patient.name">{{ $t('dashboard.title') + getPatientName() }}</h2>
    <Dashboard
      v-if="selectedDataset"
      :patientData="selectedDataset" />
    <q-btn
      v-if="selectedDataset"
      @click="selectedDataset = undefined">
      {{ $t('common.back') }}
    </q-btn>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';

import {Bundle, DocumentReference, DocumentReferenceStatus, getFullName, Patient, selectName} from '@i4mi/fhir_r4';
import Dashboard from './Dashboard.vue';

export default defineComponent({
  name: 'DashboardSelector',
  components: {
    Dashboard
  },
  data() {
    return {
      datasets: new Array<DocumentReference>(),
      selectedDataset: undefined as Bundle | undefined,
      loading: true
    };
  },
  props: {
    patient: {
      type: Object as PropType<Patient>,
      required: true
    }
  },
  beforeMount() {
    const mpiId = this.$props.patient.identifier?.find((i) => i.system === this.$epdUtils.getOids().mpiId);
    if (mpiId && mpiId.system && mpiId.value) {
      this.$epdUtils
        .useITI67({
          status: DocumentReferenceStatus.CURRENT,
          'patient.identifier': mpiId.system + '|' + mpiId.value
        })
        .then((res) => {
          this.datasets = res.filter((r) => this.isDashboardExport(r));
        })
        .catch((error) => {
          console.error('Could not load Dashboard data', error);
        })
        .finally(() => (this.loading = false));
    } else {
      console.warn('Can not fetch Dashboard data without a MPI ID', this.$props.patient);
    }
  },
  methods: {
    isDashboardExport(docRef: DocumentReference): boolean {
      const DASHBOARD_EXPORT_TITLE = 'mHealth Proto Allergy Export';
      return (
        docRef.content &&
        docRef.content[0] &&
        docRef.content[0].attachment &&
        docRef.content[0].attachment.title === DASHBOARD_EXPORT_TITLE
      );
    },
    set(docRef: DocumentReference) {
      this.$epdUtils
        .useITI68(docRef)
        .then((resource) => {
          this.selectedDataset = JSON.parse(resource) as Bundle;
        })
        .catch((error) => console.warn('Could not fetch file', error));
    },
    getPatientName(): string {
      const patientNames = this.patient.name;
      if (patientNames === undefined) return '';
      const name = selectName(patientNames);
      if (!name) return '';
      return getFullName(name);
    },
    getDisplayString(docRef: DocumentReference): string {
      if (docRef.description || docRef.date) {
        return (
          (docRef.description ? docRef.description + ' (' : this.$t('dashboard.fileDate')) +
          (docRef.date ? new Date(docRef.date).toLocaleDateString() + (docRef.description ? ')' : '') : '')
        );
      }
      return this.$t('dashboard.unknownFile');
    }
  }
});
</script>
<style lang="scss">
#spinner {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  height: 2em;
  margin-top: 1em;
  margin-bottom: 1em;
}
.content {
  margin: 1em;
}
ul {
  padding: 0;
}
h2 {
  font-size: 1.5em;
  font-weight: bold;
  color: $primary;
  margin-left: 1em;
  padding: 0;
  margin-bottom: 0;
  line-height: unset;
}
.dataset-links {
  list-style: none;
  cursor: pointer;
  margin: 0.5em;
  height: 2em;
  padding: 0.3em;
  border: solid 1px black;
  border-radius: 0.3em;
}
.dataset-links:hover {
  background-color: $secondary;
}
</style>
