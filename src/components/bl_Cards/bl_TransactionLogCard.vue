<template lang="pug">
  .transactionLog(v-if="IndexTransactionLogDetail.status")
    .transactionLog__header 交易明细
      i.fas.i.fa.fa-headphones(onclick="LC_API.open_chat_window()")
    .transactionLog__main
      .transactionLog__main__date {{ IndexTransactionLogDetail.createdAt }}
      .transactionLog__main__status
        i.fas.fa-check-circle(v-if="IndexTransactionLogDetail.status.value === 3")
        i.fas.fa-times-circle(v-else-if="IndexTransactionLogDetail.status.value === 4" style="color: rgb(255, 73, 73)")
        i.fas.fa-exclamation-circle(v-else style="color: rgb(247, 186, 42) ")
      .transactionLog__main__subtitle 交易金额
      .transactionLog__main__money ¥{{ format((Math.floor(IndexTransactionLogDetail.amount * 100) / 100).toFixed(2).toString()) }}
      .transactionLog__main__detail
        .d-flex.flex-column.align-items-end.mr-3.ml-4
          .transactionLog__main__detail--title 交易类型
          .transactionLog__main__detail--title 交易渠道
          .transactionLog__main__detail--title 交易单号
          .transactionLog__main__detail--title 交易状态
          .transactionLog__main__detail--title 交易前
          .transactionLog__main__detail--title 交易后
          .transactionLog__main__detail--title 备注
        .d-flex.flex-column.align-items-start.p-0(v-if="IndexTransactionLogDetail.status && IndexTransactionLogDetail.payChannelServiceId")
          .transactionLog__main__detail--content {{ IndexTransactionLogDetail.type.display }}
          .transactionLog__main__detail--content {{ IndexTransactionLogDetail.payChannelServiceId.display }}
          .transactionLog__main__detail--content {{ IndexTransactionLogDetail.orderId }}
          .transactionLog__main__detail--content {{ IndexTransactionLogDetail.status.display }}
          .transactionLog__main__detail--content ¥{{ IndexTransactionLogDetail.oldCash }}
          .transactionLog__main__detail--content ¥{{ IndexTransactionLogDetail.newCash }}
          .transactionLog__main__detail--content {{ IndexTransactionLogDetail.remark }}
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
    ...mapState('payment', [
      'IndexTransactionLogDetail',
    ]),
  },
}
</script>

<style lang="scss" scoped>
.transactionLog {
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
      color: $origin_dark;
      font-size: $text-16;
    }

    &__money {
      color: $navy_light;
      font-size: $text-20;
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
