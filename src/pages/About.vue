<template>
  <q-card class="about-card">
    <q-card-section class="card-title">{{ $t('about.title') }} ({{ $t('about.version') }} {{ version }})</q-card-section>
    <q-card-section>
      <p>
        {{ $t('about.aboutText') }}
      </p>
      <p>
       {{ $t('about.readMore') }}
        <ul>
          <li v-for="link in links" :key="link.url">
            <a :href="link.url" target="_blank"> {{ getLocalisedLinkLabel(link , locale)}}</a>
          </li>
        </ul>
      </p>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ABOUT_LINKS from '../assets/aboutLinks.json'
import PACKAGE from '../../package.json'

export default defineComponent({
  name: 'AboutPage',
  data() {
    return {
      locale: this.$i18n.locale || 'de-CH',
      links: ABOUT_LINKS,
      version: ''
    }
  },
  methods: {
    /**
     * Helper for getting the correct localised link label
     */
    getLocalisedLinkLabel(link: {label: {[l: string]: string}}, locale: string): string {
      return link.label[locale];
    }
  },
  mounted() {
    this.version = (PACKAGE as {version: string}).version;
  }
});
</script>

<style scoped lang="scss">
</style>
