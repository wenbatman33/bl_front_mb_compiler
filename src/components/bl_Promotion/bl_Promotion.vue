<template lang="pug">
  .promotion(v-if="filterPromotion")
    .promotion__header
      .promotion__header__title 优惠活动
    el-scrollbar
      b-nav.promotion__tabGroup
        b-nav-item.promotion__tab(v-for="(item, index) in type" @click="activeType = item" :key="item")
          p {{ index }}
          .promotion__tab--active(v-if="activeType === item")
    .promotion__main
      PromotionSection(v-for="item in filterPromotion" :card="item" :key="item.id")
    Footer
</template>

<script>
import { mapState } from 'vuex';
import PromotionSection from '@/components/bl_Promotion/bl_PromotionSection.vue';
import Footer from '@/components/bl_Footer/bl_Footer.vue';

export default {
  components: {
    PromotionSection,
    Footer,
  },
  data() {
    return {
      activeType: 0,
      type: {
        '全部': 0,
        '節日': 1,
        '體育': 2,
        '真人': 3,
        '棋牌': 4,
        '電子': 5,
        '彩票': 6,
        'VIP': 7,
      },
    };
  },
  computed: {
    ...mapState('promotion', [
      'IndexPromotion',
    ]),
    filterPromotion() {
      const result = this.IndexPromotion.filter(item => item.promotionGroupId.value === this.activeType);
      return this.activeType === 0 ? this.IndexPromotion : result;
    },
  },
  mounted() {
    document.querySelector('.promotion__main').addEventListener('touchmove', (e) => {
      e.stopPropagation();
    });
  },
  created() {
    this.$store.dispatch('promotion/API_IndexPromotion');
  },
};
</script>

<style lang="scss" scoped>
.promotion {
  display: flex;
  flex-direction: column;
  height: 100vh;

  &__header {
    height: 14.04vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(to left, rgb(167,76,242), rgb(97, 123, 251));

    &__title {
      font-size: $text-20;
      color: white;
    }
  }

  .el-scrollbar {
    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.04);
  }

  &__tabGroup {
    flex-wrap: nowrap;

    .promotion__tab {
      white-space: nowrap;
      font-size: $text-16;

      a {
        color: $navy_light;
        padding: $height-12 $width-18 0;
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      p {
        margin-bottom: $height-16;
      }

      &--active {
        width: $width-28;
        height: 5px;
        background-color: $theme;
        border-radius: 10px;
      }
    }

    .bar {
      border: 2px solid red;
    }
  }

  &__main {
    display: flex;
    flex-direction: column;
    padding: $height-20 $width-24 0;
    flex: 1;
    overflow: auto;
    padding-bottom: 70px;
  }
}
</style>
