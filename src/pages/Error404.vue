<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">{{ $t('e404.title') }}</div>

      <div
        class="text-h2"
        style="opacity: 0.4">
        {{ $t('e404.text') }}
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        :label="$t('e404.goHome')"
        no-caps />
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'Error404Page'
});
</script>
