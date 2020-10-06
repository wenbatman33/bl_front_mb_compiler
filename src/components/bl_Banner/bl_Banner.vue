<template lang="pug">
  .banner
    swiper(:options="swiperOption" v-if="IndexBanners.length > 0", ref="a")
      swiper-slide(v-for="item in IndexBanners" :key="item.id")
        a(:href="item.bannerLinkMobile" target="_blank")
          img(v-if="item.bannerType === 1" :src="item.bannerImageMobile" width="100%")
          video(v-if="item.bannerType === 2" :src="item.bannerVideo" width="100%" autoplay muted loop playsinline)
      .swiper-pagination(slot="pagination")
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      swiperOption: {
        pagination: {
          el: '.swiper-pagination',
          renderBullet: function (index, className) {
            let temp = index + 1;
            if (temp < 10) {
              temp = '0' + temp
            }
            return '<span class="' + className + '">' + temp + '</span>';
          },
        }
      },
      form: {
        params: {
          banner_group_id: 1,
          device: 2,
          platform: 1,
        }
      }
    };
  },
  computed: {
    ...mapState('index', [
      'IndexBanners',
    ]),
  },
  created() {
    this.$store.dispatch('index/API_IndexBanner', this.form).then((res) => {
      this.$store.commit('index/setIndexBanners', res.data.data);
    })
  },
};
</script>

<style lang="scss" scoped>
  /deep/ .swiper-pagination-bullet {
    color: $origin_darkest;
    background: none;
    width: unset;
    height: auto;
    display: inline;
    border-radius: 0;

    &-active {
      color: $navy_dark;
      background: none;
      border-bottom: 3px solid rgb(194, 170, 242);
    }
  }
</style>