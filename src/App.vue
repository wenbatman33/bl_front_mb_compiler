<template lang="pug">
  #app
    router-view(:class="{'fixed__page': getCardOpen}")
    .overlayer(v-if="getCardOpen" @touchmove.prevent @click.self="setCardOpen")
    Cards(:class="{'card__open': getCardOpen }")
    Loading(v-if="Loading")
</template>

<script>
import { mapState } from 'vuex';
import Cards from '@/components/bl_Cards/bl_Cards.vue';
import Loading from '@/components/bl_Loading/bl_Loading.vue';

export default {
  name: 'app',
  components: {
    Cards,
    Loading,
  },
  methods: {
    setCardOpen() {
      this.$store.commit('index/setCardOpen', false);
    },
    checkCardUrl(to) {
      if (to.query.card) {
        this.$store.commit('index/setCardOpen', true);
        this.$store.commit('index/setCardName', to.query);
      }
    },
  },
  computed: {
    getCardOpen() {
      return this.$store.state.index.CardOpen;
    },
    ...mapState('index', [
      'Loading',
    ]),
  },
  watch: {
    $route(to, from) {
      this.checkCardUrl(to);
    }
  },
  mounted() {
    this.checkCardUrl(this.$route);
  }
};

</script>

<style lang="scss">
@import './assets/scss/reset.css';
@import './assets/scss/main.scss';
</style>
