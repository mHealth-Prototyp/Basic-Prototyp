import {boot} from 'quasar/wrappers';
import Store from 'src/services/storeService';
import {ENV} from '../assets/env.js';
import DE from 'apexcharts/dist/locales/de.json';
import FR from 'apexcharts/dist/locales/fr.json';
import VueApexCharts from 'vue3-apexcharts';
import {FhirUtils, EpdPlaygroundUtils, PatientUtils} from '@i4mi/mhealth-proto-components';
import WeatherAPIConsumer from 'src/services/weatherAPIConsumer';
import WarningBanner from 'src/components/banners/WarningBanner.vue';
import InformationBanner from 'src/components/banners/InformationBanner.vue';

const store = new Store();
const fhirUtils = new FhirUtils(ENV.BASE_URL, store.getOids());
const epdUtils = new EpdPlaygroundUtils(ENV, store.getOids());
const patientUtils = new PatientUtils(store.getOids(), store.getOrganizationResource());
const weatherAPIConsumer: WeatherAPIConsumer = new WeatherAPIConsumer();
const now = new Date();
const chartLocales: ApexLocale[] = [DE as ApexLocale, FR as ApexLocale];

// Type declaration
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $store: Store;
    $fhirUtils: FhirUtils;
    $epdUtils: EpdPlaygroundUtils;
    $patientUtils: PatientUtils;
    $chartLocales: ApexLocale[];
    $weatherAPIConsumer: WeatherAPIConsumer;
    $today: Date;
  }
}

export default boot(({app}) => {
  // Set global components
  app.use(VueApexCharts);
  app.component('WarningBanner', WarningBanner).component('InformationBanner', InformationBanner);
  // Set global variables
  app.config.globalProperties.$store = store;
  app.config.globalProperties.$fhirUtils = fhirUtils;
  app.config.globalProperties.$epdUtils = epdUtils;
  app.config.globalProperties.$patientUtils = patientUtils;
  app.config.globalProperties.$chartLocales = chartLocales;
  app.config.globalProperties.$today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  app.config.globalProperties.$weatherAPIConsumer = weatherAPIConsumer;
});

export {store, fhirUtils, epdUtils, patientUtils};
