<template lang="pug">
.promotionSection(@click="setCardOpen(card.id)")
  .promotionSection__image(:style="{backgroundImage: 'url(' + card.promotionImageMobile + ')'}")
  .promotionSection__content
    .promotionSection__content__title
      p {{ card.promotionTitle }}
      p {{ card.promotionSubTitle }}
    .promotionSection__content__button(:class="{'active':card.promotionApplyMethod.value !== 1}") {{ card.promotionApplyMethod.value === 1 ? '自动' : '自助' }}</br>参与
</template>

<script>
export default {
  props: ["card"],
  methods: {
    setCardOpen(id) {
      this.$store.dispatch('promotion/API_PromotionDetail', id).then((res) => {
        if (res.status === 200 && res.data.status === 1) {
          this.$store.commit('index/setCardName', {
            card: 'bl_popPromotion',
            id,
          });
          this.$store.commit('index/setCardOpen', true);
        }
      });
    },
  },
}
</script>

<style lang="scss" scoped>
.promotionSection {
  background-color: $origin_lightest;
  margin-bottom: $height-20;
  border-radius: 6px;
  position: relative;

  &__image {
    width: 100%;
    height: 120px;
    border-radius: 6px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
  }

  &__content {
    padding: $height-16 $width-8 $height-12 $width-8;
    display: flex;
    justify-content: space-between;

    &__title {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 80%;

      p {
        margin: 0;
        font-size: $text-14;
        color: $origin_dark;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;

        &:first-child {
          font-size: $text-16;
          color: $navy_dark;
        }
      }
    }

    &__button {
      background-color: $origin_dark;
      padding: 4px $width-8;
      border-radius: 4px;
      font-size: $text-14;
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      white-space: nowrap;
    }
  }
}
.active {
  background-color: $orange;
}
</style>

