import { boot } from 'quasar/wrappers';
import Store from 'src/services/storeService';

const store = new Store();

// Type declaration
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $store: Store;
  }
}

export default boot(({ app }) => {
  // Set global variables
  app.config.globalProperties.$store = store;
});

export { store };
