<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="fas fa-bars"
          :aria-label="$t('layout.title')"
          @click="toggleLeftDrawer" />

        <q-toolbar-title>
          {{ $t('layout.title') }}
          <span class="sub-title">{{ $t('layout.subtitle') }}</span>
        </q-toolbar-title>

        <div
          v-if="user.givenName"
          @click="logout">
          {{ (user.prefix ? user.prefix : '') + ' ' + user.givenName + ' ' + user.familyName }}
          <q-icon
            name="fas fa-user-md"
            id="user-icon" />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered>
      <q-list>
        <q-item-label header>{{ $t('layout.menu.title') }}</q-item-label>
        <q-item
          v-for="entry in menuEntries"
          :key="entry.to">
          <q-icon
            v-if="entry.icon"
            :name="'fas fa-' + entry.icon"
            class="menu-icon" />
          <router-link
            :to="entry.to"
            class="menu-link">
            {{ $t('layout.menu.' + entry.translateString) }}
          </router-link>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {LoginType} from 'src/model/interfaces';
import {getLangStringFromLocale} from 'src/boot/i18n';

interface MenuEntry {
  to: string;
  translateString: string;
  icon?: string;
}

export default defineComponent({
  name: 'MainLayout',
  components: {},
  data() {
    return {
      leftDrawerOpen: false,
      user: {} as LoginType,
      menuEntries: [
        {
          to: '/',
          translateString: 'home',
          icon: 'home'
        },
        {
          to: '/patients',
          translateString: 'patients',
          icon: 'users'
        },
        {
          to: '/register',
          translateString: 'add_patient',
          icon: 'hospital-user'
        },
        {
          to: '/settings',
          translateString: 'settings',
          icon: 'cog'
        },
        {
          to: '/about',
          translateString: 'about',
          icon: 'question-circle'
        }
      ] as MenuEntry[]
    };
  },
  beforeCreate() {
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
  },
  mounted() {
    this.user = this.$store.getUser() || ({} as LoginType);
  },
  methods: {
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
    logout() {
      if (confirm(this.$t('layout.logoutPrompt'))) {
        this.$store.resetSession();
        location.reload();
      }
    }
  }
});
</script>
<style scoped lang="scss">
.q-toolbar {
  color: $lightText;
}
.q-toolbar__title {
  font-weight: bold;
}

.sub-title {
  font-weight: lighter;
}
.q-item {
  padding: 0;
  min-height: unset;
}
.q-item__label {
  background-color: $primary;
  text-align: center;
  color: $lightText;
  font-weight: bold;
}
.menu-link {
  color: $text;
  display: block;
  width: 100%;
  text-decoration: none;
  padding: 1em 0.5em;
  height: 3.5em;
}
#user-icon:hover {
  color: $negative;
  cursor: pointer;
}
.q-item:hover .menu-link {
  background-color: $primary;
  color: $lightText;
}
.menu-icon {
  background-color: $primary;
  color: $lightText;
  display: block;
  height: 3.5em;
  width: 2em;
  padding: 0 0.4em;
}
.q-item:hover .menu-icon {
  background-color: $lightText;
  color: $primary;
}
</style>
