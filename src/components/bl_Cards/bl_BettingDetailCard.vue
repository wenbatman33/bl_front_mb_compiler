<template lang="pug">
  .bettingDetail
    .bettingDetail__header 投注明细
      i.fas.i.fa.fa-headphones(onclick="LC_API.open_chat_window()")
    .bettingDetail__main
      .bettingDetail__main__date {{ BettingLogDetail.betTime }}
      .bettingDetail__main__status
        i.fas.fa-check-circle(v-if="BettingLogDetail.betLogSatus.value === 1")
        i.fas.fa-times-circle(v-else-if="BettingLogDetail.betLogSatus.value === 0" style="color: rgb(255, 73, 73)")
        i.fas.fa-exclamation-circle(v-else style="color: rgb(247, 186, 42) ")
      .bettingDetail__main__subtitle {{ BettingLogDetail.betLogSatus.display }}
      .bettingDetail__main__detail
        .d-flex.flex-column.align-items-end.mr-3.ml-4
          .bettingDetail__main__detail--title 投注单号
          .bettingDetail__main__detail--title 投注项目
          .bettingDetail__main__detail--title 输赢金额
          .bettingDetail__main__detail--title 流水金额
          .bettingDetail__main__detail--title 投注状态
          .bettingDetail__main__detail--title 备注
        .d-flex.flex-column.align-items-start.p-0
          .bettingDetail__main__detail--content {{ BettingLogDetail.betId }}
          .bettingDetail__main__detail--content {{ BettingLogDetail.betContent }}
          .bettingDetail__main__detail--content ¥{{ format((Math.floor(BettingLogDetail.betWinAmount * 100) / 100).toFixed(2).toString()) }}
          .bettingDetail__main__detail--content ¥{{ format((Math.floor(BettingLogDetail.betAmount * 100) / 100).toFixed(2).toString()) }}
          .bettingDetail__main__detail--content {{ BettingLogDetail.betLogSatus.display }}
          .bettingDetail__main__detail--content {{ BettingLogDetail.betNote }}
</template>

<script>
import { mapState } from 'vuex';

export default {
  methods: {
    format(value) {
      if (!Number.isNaN(value) && value !== undefined) {
        return value.toString().replace(/^(-?\d+?)((?:\d{3})+)(?=\.\d+$|$)/, (all, pre, groupOf3Digital) => pre + groupOf3Digital.replace(/\d{3}/g, ',$&'));
      }
      return value;
    }
  },
  computed: {
    ...mapState('member', [
      'BettingLogDetail',
    ]),
  },
}
</script>

<style lang="scss" scoped>
.bettingDetail {
  display: flex;
  flex-direction: column;
  height: 100%;

  &__header {
    font-size: $text-20;
    font-weight: bold;
    color: $card-title;
    padding: $width-24 0;
    border-bottom: 1px solid $origin-light;
    display: flex;
    justify-content: center;
    align-items: center;
    justify-content: center;

    i {
      position: absolute;
      right: $width-24;
      color: $origin;
    }
  }

  &__main {
    padding: $height-32 $width-24 0;
    flex: 1;
    text-align: center;
    overflow: auto;

    &__date {
      color: $navy_light;
      font-size: $text-20;
    }

    &__status {
      color: rgb(19, 206, 102);
      font-size: 80px;
    }

    &__subtitle {
      color: $navy_light;
      font-size: $text-16;
      margin-bottom: $height-28;
    }

    &__detail {
      background-color: $origin_lightest;
      border-radius: 8px;
      padding: $height-36 $width-20;
      display: flex;
      justify-content: flex-start;

      &--title {
        white-space: nowrap;
        color: $origin_dark;
        font-size: $text-16;
      }

      &--content {
        color: $navy_light;
        font-size: $text-16;
        word-break: break-all;
        text-align: left;
      }
    }
  }
}
</style>
