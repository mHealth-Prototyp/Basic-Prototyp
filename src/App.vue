<template>
  <router-view v-if="isLoggedIn" />
  <Login v-else :acceptedLogins="logins" :onLogin="login" @message="displayMessage"/>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { Notify } from 'quasar';
import Login from './components/LoginMock.vue';
import { LoginType, UIMessage, UIMessageType } from './model/interfaces';
import ACCEPTED_LOGINS from './assets/acceptedLogins.json';

// eslint-disable-next-line @typescript-eslint/ban-types
const toasts: Function[] = [];

export default defineComponent({
  name: 'App',
  components: { Login },
  data() {
    return {
      isLoggedIn: false,
      logins: ACCEPTED_LOGINS as LoginType[]
    };
  },
  mounted() {
    this.isLoggedIn = this.$store.getUser() !== undefined;

  },
  methods: {
    login(user: LoginType): void {
      this.isLoggedIn = user !== undefined;
      this.$store.setUser(user);
      // hide toasts
      toasts.forEach(toast => {toast()});
    },
    displayMessage(message: UIMessage) {
      switch (message.type) {
        case UIMessageType.SMS:
         toasts.push(Notify.create(
            {
              message: message.title,
              caption: message.text,
              position: 'top-right',
            }
          ));
          break;
        case UIMessageType.ERROR:
          console.warn('ERROR - ' + message.title + ': ' + message.text);
      }
    }
  }

});
</script>

<style lang="scss">
html {
  background-color: $background;
}
.card-title {
  color: $primary;
  font-size: 1.2em;
  text-align: center;
  font-weight: bolder;
  border-bottom-color: $gray;
  border-bottom-style: dotted;
  border-bottom-width: 1px;
  padding-bottom: 0.5em;
}
.q-card {
  margin: 1.5em;
}
.q-card p {
  margin-bottom: 0.4em;
  text-align: justify;
}
a:hover {
  text-decoration: none;
  color: $text;
}
a:visited {
  text-decoration: none;
}
.q-table__title {
  font-size: 1.2em;
}
</style>
