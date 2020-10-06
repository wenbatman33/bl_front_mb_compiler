<template lang="pug">
  #home
    HomeBanner(v-if="HomeBanner")
    Header
    Banner
    .d-flex
      SideBar.mr-4
      .overflow-hidden
        News
        GameEntrance
    Footer
</template>

<script>
import { mapState } from 'vuex';
import HomeBanner from '@/components/bl_Banner/bl_HomeBanner.vue';
import Header from '@/components/bl_Header/bl_Header.vue';
import Banner from '@/components/bl_Banner/bl_Banner.vue';
import SideBar from '@/components/bl_GameSection/bl_SideBar.vue';
import News from '@/components/bl_News/bl_News.vue';
import GameEntrance from '@/components/bl_GameSection/bl_GameEntrance.vue';
import Footer from '@/components/bl_Footer/bl_Footer.vue';

export default {
  components: {
    HomeBanner,
    Header,
    Banner,
    SideBar,
    News,
    GameEntrance,
    Footer,
  },
  data() {
    return {
      startY: 292,
    }
  },
  methods: {
    scrolling(e) {
      if (window.scrollY > this.startY + document.querySelector('.entrance').offsetHeight) {
        this.$store.commit('index/setActiveTag', 2);
      } else if (window.scrollY > this.startY) {
        this.$store.commit('index/setActiveTag', 1);
      } else {
        this.$store.commit('index/setActiveTag', 0);
      }
    },
  },
  computed: {
    ...mapState('index', [
      'HomeBanner',
    ]),
    ...mapState('games', [
      'GameType',
    ]),
  },
  mounted() {
    window.addEventListener('scroll', this.scrolling);
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.scrolling);
  },
};
</script>

<style lang="scss" scoped>
  #home {
    padding-top: 60px;
  }
</style>