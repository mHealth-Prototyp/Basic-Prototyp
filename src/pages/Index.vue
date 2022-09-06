<template>
<div class="row">
  <div class="col-6" >
    <q-card class="link-card" @click="$router.push('/patients')">
      <q-card-section class="card-title">{{ $t('index.epdTileTitle') }}</q-card-section>

      <q-icon name="fas fa-users" class="big-icon"/>

      <q-card-section>
        <p>{{ $t('index.epdTileDescription') }}</p>
      </q-card-section>
    </q-card>
  </div>
  <div class="col-6">
    <q-card class="link-card" @click="$router.push('/register')">
      <q-card-section class="card-title">{{ $t('index.localTileTitle') }}</q-card-section>

      <q-icon name="fas fa-hospital-user" class="big-icon"/>

      <q-card-section>
        <p>{{ $t('index.localTileDescription') }}</p>
      </q-card-section>
    </q-card>
  </div>
</div>
</template>

<script lang=ts>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'IndexPage',
  data() {
    return {

    }
  },
  components: {},
  methods: {

  }
});
</script>
<style scoped lang="scss">
.link-card {
  cursor: pointer;
  min-width: 150pt;
  max-width: 400pt;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}
.col-6 {
  min-width: 160pt;
  padding: 10pt;

}
.link-card:hover {
  color: $primary;
}
.big-icon {
  margin-top: 15pt;
  font-size: 90pt;
  width: 100%;

}
</style>
