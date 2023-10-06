<template>
  <q-card class="login-card">
    <q-card-section class="card-title"> {{ $t('login.login_label') }} </q-card-section>
    <template v-if="code === ''">
      <q-card-section class="login-text">
        <p>
          {{ $t('login.welcome1') }}
        </p>
        <p>
          {{ $t('login.welcome2') }}
        </p>
        <form id="login-form">
          <q-input
            v-model="eId"
            :label="$t('login.eid_label')"
            type="email" />
          <q-input
            v-model="password"
            :label="$t('login.password_label')"
            type="password" />
          <q-btn
            id="login-button"
            @click="login"
            type="submit"
            :label="$t('login.login_label')"
            :disable="password === '' || eId === ''" />
        </form>
        <p
          v-if="invalidPassword"
          class="warning">
          {{ $t('login.invalid_password') }}
        </p>
      </q-card-section>
    </template>
    <q-card-section v-else>
      <p>
        {{ $t('login.enter_code1') }}<span class="phonenumber">{{ obscurePhoneNumber(user.phone) }}</span
        >{{ $t('login.enter_code2') }}
      </p>
      <span
        @click="generateAndSendCode(user.phone)"
        href="#"
        class="resend-link"
        >{{ $t('login.resend') }}</span
      >
      <form id="code-form">
        <q-input
          v-model="codeInput"
          label="Code"
          type="tel"
          autofocus />
        <q-btn
          id="code-button"
          @click="checkCode"
          :label="$t('login.check_label')"
          type="submit"
          :disable="password === '' || eId === ''" />
      </form>
      <p
        v-if="invalidCode"
        class="warning">
        {{ $t('login.invalid_code') }}
      </p>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue';
import {LoginType, UIMessage, UIMessageType} from '../model/interfaces';

function generateCode(length: number): string {
  let code = Math.floor(Math.random() * Math.pow(10, length)).toString();
  while (code.length < length) {
    code = '0' + code;
  }
  return code;
}

/**
 * Mocks the login to the platform with a token displayed in the UI.
 */
export default defineComponent({
  name: 'LoginMock',
  data() {
    return {
      code: '',
      codeInput: '',
      eId: '',
      password: '',
      user: {
        username: '',
        phone: '',
        password: '',
        familyName: '',
        givenName: ''
      } as LoginType,
      invalidPassword: false,
      invalidCode: false
    };
  },
  /**
   *
   */
  emits: {
    /**
     * Notify parent component about token message to display.
     * Emitted when mocked message for 2FA is "sent".
     */
    message: (payload: UIMessage) => {
      return payload.type === UIMessageType.SMS && payload.title && payload.text;
    }
  },
  props: {
    /**
     * Accepted username, password combinations for login.
     */
    acceptedLogins: {
      type: Array as PropType<Array<LoginType>>,
      required: true
    },
    /**
     * Function that returns user that was logged in.
     */
    onLogin: {
      type: Function as PropType<(user: LoginType) => void>,
      required: false
    }
  },
  methods: {
    login() {
      const login = this.$props.acceptedLogins.find((login) => login.username === this.eId);
      if (login && login.password === this.password) {
        this.user = login;
        this.generateAndSendCode(login.phone);
      } else {
        this.invalidPassword = true;
      }
    },
    checkCode(e: Event) {
      e.preventDefault();
      if (this.code === this.codeInput) {
        if (this.$props.onLogin) {
          this.$props.onLogin(this.user);
        }
      } else {
        this.invalidCode = true;
      }
    },
    generateAndSendCode(phoneNumber: string) {
      this.code = generateCode(4);
      this.$emit('message', {
        type: UIMessageType.SMS,
        title: 'SMS von EPD Playground an ' + phoneNumber,
        text: 'Ihr Code für den EPD Playground Use Case ist: ' + this.code + '.\n'
      });
    },
    obscurePhoneNumber(number: string): string {
      return number.substring(0, 2) + '• ••• ' + number.substring(number.length - 5, number.length);
    }
  },
  watch: {
    eID(n: string, o: string): void {
      this.invalidPassword = n === o;
    },
    password(n: string, o: string): void {
      this.invalidPassword = n === o;
    },
    codeInput(n: string, o: string): void {
      this.invalidCode = n === o;
    }
  }
});
</script>

<style scoped lang="scss">
.login-card {
  width: 90vw;
  max-width: 500px;
  margin-right: auto;
  margin-left: auto;
  margin-top: 10vh;
}
#login-form,
#code-form {
  width: 80%;
  margin-left: auto;
  margin-right: auto;
}

#code-form > input {
  width: 5em;
  font-size: 2em;
}
#login-button,
#code-button {
  margin: 2em auto 0.5em;
  display: block;
  width: 50%;
}
.warning {
  color: $warning;
  text-align: center;
  margin-top: 1.5em;
}
.phonenumber {
  white-space: nowrap;
  font-weight: bold;
}
.resend-link {
  text-decoration: underline;
  cursor: pointer;
  color: $secondary;
}
.resend-link:hover {
  text-decoration: none;
  color: $text;
}
</style>
