import { boot } from 'quasar/wrappers';
import Store from 'src/services/storeService';
import { ENV } from '../assets/env.js';
import { FhirUtils, EpdPlaygroundUtils, PatientUtils } from '@i4mi/mhealth-proto-components';

const store = new Store();
const fhirUtils = new FhirUtils(ENV.BASE_URL);
const epdUtils = new EpdPlaygroundUtils(ENV, store.getOids());
const patientUtils = new PatientUtils(store.getOids(), store.getOrganizationResource());


// Type declaration
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $store: Store;
    $fhirUtils: FhirUtils;
    $epdUtils: EpdPlaygroundUtils,
    $patientUtils: PatientUtils
  }
}

export default boot(({ app }) => {
  // Set global variables
  app.config.globalProperties.$store = store;
  app.config.globalProperties.$fhirUtils = fhirUtils;
  app.config.globalProperties.$epdUtils = epdUtils;
  app.config.globalProperties.$patientUtils = patientUtils;
});

export { store, fhirUtils, epdUtils, patientUtils };
