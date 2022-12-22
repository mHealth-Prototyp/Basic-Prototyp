<template>
  <q-banner
    dense
    rounded
    class="bg-info text-white">
    <template v-slot:avatar>
      <q-icon
        name="fas fa-info-circle"
        color="white"
        size="sm"
        class="q-mr-sm" />
    </template>
    {{ text }}
  </q-banner>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'InformationBanner',
  props: {
    text: {
      type: String,
      required: true
    }
  },
  data() {
    return {};
  }
});
</script>
