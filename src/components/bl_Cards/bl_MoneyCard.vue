<template lang="pug">
  //- 更改這裡的話也要同時更改forApp component
  .money
    .money__header
      .money__header__background
      .money__header__tag.col(:class="{'active1': ActiveTagName === 'deposit'}" @click="changeToDeposit") 存款
      .money__header__tag.col(:class="{'active2': ActiveTagName === 'withdraw'}" @click="changeToWithdraw") 提款

    //- 存款
    .deposit__main(v-if="ActiveTagName === 'deposit'")
      div(v-if="depositStep === 1")
        a.deposit__main__video(href="#")
          i.fas.fa-question-circle
          span 不知道怎么提款？查看提款教程
        el-divider
        el-alert.mb-3(v-if="activeDepositChannel > -1" type="info" :closable="false")
          slot
            .d-flex
              .d-flex.align-items-center.mr-2
                i.el-alert__icon.el-icon-info
              span 提示 ：单笔限额 {{ min_amount }} 元 ~ {{ max_amount }} 元
        .deposit__main__title
          p 存款金额
          p 余额：¥{{ format(Math.floor((IndexWallet.cash * 100) / 100).toFixed(2)) }}
        el-input.deposit__main__moneyInput(type="tel" placeholder="请输入存款金额" v-model="depositForm.amount" @input="activeDefaultBtn = -1")
        .deposit__main__default
          button(v-for="(item, index) in indexDefaultBtn" @click="depositBtn(item, index)" :class="{'activeBtn': activeDefaultBtn === index}")
            span ¥
            span {{ item }}
        .deposit__main__title(v-if="depositForm.amount !== ''")
          p 支付通道
        .deposit__main__channel
          button.deposit__main__channel--button(v-for="(item, index) in indexDepositChannel" @click="depositChannel(item, index)" :class="{'activeBtn': activeDepositChannel === index}")
            i.fab.fa-alipay.color__gray(v-if="item.payment_name === '支付宝'" :class="{'color__theme': activeDepositChannel === index}")
            i.far.fa-credit-card.color__gray(v-else-if="item.payment_name === '银行卡'" :class="{'color__theme': activeDepositChannel === index}")
            i.fab.fa-weixin.color__gray(v-else-if="item.payment_name === '微信扫码'" :class="{'color__theme': activeDepositChannel === index}")
            img(:src="activeDepositChannel === index ? unionpayIconActive : unionpayIcon" v-else-if="item.payment_name === '银联扫码'")
            img(:src="activeDepositChannel === index ? fastpaymentIconActive : fastpaymentIcon" v-else-if="item.payment_name === '快捷'")
            //- 少了網關和QQ icon
            p {{ item.payment_name }}
        .deposit__main__title(v-show="displayDepositBank")
          p 支付银行
        el-select(v-show="displayDepositBank" v-model="depositForm.payload" placeholder="请选择")
          el-option(v-for="item in indexDepositOptions"
                    :key="item.value"
                    :label="item.bank_name"
                    :value="item.value")
      //- 存款後續
      div(v-else-if="depositStep === 2 && returnType === 'qrcode'")
        h5.text-center 存款进行中
        p.text-center.m-0 存款金额 <span class="text-danger">{{ depositForm.amount }}</span> 元，请在 <span class="text-danger">04 : 30</span> 分钟内完成
        p.text-center.mb-3 交易单号 {{ orderId }}
        .qrcode.mb-2
          img.w-75(:src="returnContent")
        p.text-center 请使用 <span class="text-danger">{{ payment_name }}</span> 扫描二维码
      div(v-else-if="depositStep === 2 && returnType === 'form'" v-html="returnContent")
      .text-center(v-else-if="depositStep === 2 && returnType === 'bankcard'")
        h5 存款进行中
        p.color__gray 已完成订单，请尽快通过「网银转帐」至下列帐户完成存款流程。
        .d-flex.flex-column.border__gray.rounded-lg.mb-2
          .text-left.p-2.text-light.bg-betlead {{ bankcardDeposit.bank_name}}
          .d-flex.flex-column.align-items-start.p-2
            .w-100.d-flex.justify-content-between.mb-1.color__gray
              .d-flex
                span 姓名 ：
                span#name {{ bankcardDeposit.bank_cardholder }}
              a(href="#" @click="copyText('name')") 复制
            .w-100.d-flex.justify-content-between.mb-1.color__gray
              .d-flex
                span 卡号 ：
                span#cardNo {{ bankcardDeposit.bank_card_no }}
              a(href="#" @click="copyText('cardNo')") 复制
            .w-100.d-flex.justify-content-between.mb-1.color__gray
              .d-flex
                span 金额 ：
                span#amount {{ bankcardDeposit.amount}}
              a(href="#" @click="copyText('amount')") 复制
            .w-100.d-flex.justify-content-between.color__gray
              .d-flex
                span 附言 ：
                span#code {{ bankcardDeposit.remark}}
              a(href="#" @click="copyText('code')") 复制
        p.text-danger.text-left 提醒您 ：请务必在《备注》填写「附言」六位数字，才能秒存秒到哦 ！
        el-divider
        ul.py-2.color__darkgray.text-left
          li 1、若填写的存款金额与实际存款金额不一致，将无法到账。
          li 2、若您无同行卡，请使用「跨行转账」并选择「加急」，方便系统及时到账。
          li 3、请使用本人真实姓名进行存款，若使用他人银行卡将无法到账。


    //- 提款
    .withdraw__main(v-else-if="ActiveTagName === 'withdraw'")
      a.withdraw__main__video(href="#")
        i.fas.fa-question-circle
        span 不知道怎么提款？查看提款教程
      el-divider
      el-alert.mb-3(type="info" :closable="false")
        slot
          .d-flex
            .d-flex.align-items-center
              i.el-alert__icon.el-icon-info.mr-2
              span 提示 ：单笔限额 {{ IndexWallet.singleMin }} 元 ~ {{ IndexWallet.singleMax }} 元，</br>今日尚可提款额度 {{ IndexWallet.dayMax }} 元
      .withdraw__main__title
        p 提款金额
        p 余额：¥{{ format(Math.floor((IndexWallet.cash * 100) / 100).toFixed(2)) }}
      .withdraw__main__moneyInput
        el-input(type="tel" v-model.number="withdrawForm.amount" placeholder="请输入提款金额")
        el-button(type="info" plain @click="withdrawForm.amount = IndexWallet.cash") 最高
      .withdraw__main__title
        p 开户名
      el-input.withdraw__main__nameInput(v-model="IndexPersonal.memberRealname" placeholder="请输入用戶名" disabled)
      .withdraw__main__title
        p 支付银行
        el-button(type="text" @click="addBankCard2") 添加银行卡
      el-select(v-model="withdrawForm.bank_card_id" placeholder="请选择")
        el-option(v-for="item in filterBankCard"
                  :key="item.id"
                  :label="`${item.bankName} - ${item.no}`"
                  :value="item.id")


    button.deposit__button(v-if="ActiveTagName === 'deposit' && depositStep === 1" @click="deposit" :class="{'disabled': !depositFormValidate}" :disabled="!depositFormValidate") 立即存款
    button.deposit__button(v-else-if="ActiveTagName === 'deposit' && depositStep === 2" @click="finishedDeposit") 已完成存款
    button.withdraw__button(v-else @click="withdraw" :class="{'disabled': !withdrawFormValidate}" :disabled="!withdrawFormValidate") 立即提款
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  data() {
    return {
      unionpayIcon: `${process.env.VUE_APP_IMG}/static/img/bank/unionpay.svg`,
      unionpayIconActive: `${process.env.VUE_APP_IMG}/static/img/bank/unionpay-active.svg`,
      fastpaymentIcon: `${process.env.VUE_APP_IMG}/static/img/bank/fastpayment.svg`,
      fastpaymentIconActive: `${process.env.VUE_APP_IMG}/static/img/bank/fastpayment-active.svg`,
      activeDefaultBtn: -1,
      indexDefaultBtn: [
        '100',
        '500',
        '1000',
        '1500',
        '2000',
        '2500',
        '3000',
        '5000',
      ],
      activeDepositChannel: -1,
      indexDepositChannel: [],
      displayDepositBank: false,
      indexDepositOptions: [],
      depositStep: 1,
      depositForm: {
        amount: '',
        payload: '',
      },
      depositFormValidate: false,
      withdrawForm: {
        'amount': '',
        'bank_card_id': '',
      },
      withdrawFormValidate: false,
      min_amount: 0,
      max_amount: 0,
      // 充值後
      returnContent: '',
      returnType: '',
      orderId: '',
      payment_name: '',
      bankcardDeposit: {},
    };
  },
  methods: {
    changeToDeposit() {
      this.$store.commit('payment/setActiveTagName', 'deposit');
      this.$store.commit('index/setCardName', {
        card: 'bl_Transaction',
        type: 'deposit',
      });
    },
    changeToWithdraw() {
      // 先檢查電話
      this.$store.dispatch('member/API_MemberDetail').then((res) => {
        if (res.data.data[0].phone === null) {
          this.$store.commit('index/setCardName', {
            card: 'bl_BindingPhoneForm',
          });
        } else {
          this.$store.commit('payment/setActiveTagName', 'withdraw');
          this.$store.commit('index/setCardName', {
            card: 'bl_Transaction',
            type: 'withdraw',
          });
        }
      });
    },
    depositBtn(item, index) {
      this.depositForm.amount = item;
      this.activeDefaultBtn = index;
    },
    depositChannel(item, index) {
      this.activeDepositChannel = index;
      this.payment_name = item.payment_name;
      this.min_amount = item.min_amount;
      this.max_amount = item.max_amount;
    },
    deposit() {
      this.$store.dispatch('payment/API_Deposit', this.depositForm).then((res) => {
        console.log(res);
        this.returnContent = res.data.data.content;
        this.returnType = res.data.data.type;
        this.orderId = res.data.data.order_id;
        this.depositStep = 2;
        if (res.data.data.type === 'redirect') {
          window.open(res.data.data.content, 'payment');
          this.$store.commit('index/setCardOpen', false);
          this.depositStep = 1;
          // 成功後導向資金紀錄
          this.$router.push({ name: 'transactionlog', query: { type: 1 }});
        } else if (res.data.data.type === 'form') {
          this.returnContent = decodeURIComponent(res.data.data.content).replace(/\\\\/g, ' ');
          setTimeout(() => {
            document.forms.postSubmit.submit();
            this.$store.commit('index/setCardOpen', false);
            this.depositStep = 1;
            // 成功後導向資金紀錄
            this.$router.push({ name: 'transactionlog', query: { type: 1 }});
          }, 500);
        } else if (res.data.data.type === 'qrcode') {
          console.log('this is qrcode type');
        } else if (res.data.data.type === 'bankcard') {
          this.bankcardDeposit = res.data.data.bankcard_info;
        }
      }).catch((err) => {
        this.$message({ message: err.response.data.message , type: 'error'});
      });
    },
    withdraw() {
      this.$store.dispatch('payment/API_Withdraw', this.withdrawForm).then((res) => {
        if (res.status === 200 && res.data.status === 1) {
          this.$message({ message: '成功提款', type: 'success' });
          this.$store.dispatch('payment/API_MemberWallet');
          // 成功後關掉卡片並導向資金紀錄
          this.$store.commit('index/setCardOpen', false);
          this.$router.push({ name: 'transactionlog', query: { type: 2 }});
        }
      }).catch((err) => {
        this.$message({ message: err.response.data.message , type: 'error'});
      });
    },
    finishedDeposit() {
      this.depositStep = 1;
      this.returnType = '';
      this.$store.commit('index/setCardOpen', false);
      this.$store.commit('index/setCardName', {});
      this.$router.push({ name: 'transactionlog', query: { type: 1 }});
    },
    addBankCard2() {
      this.$store.commit('index/setCardName', {
        card: 'bl_AddBankCard2',
      });
    },
    // 複製到剪貼簿
    copyText(id) {
      const text = document.getElementById(id).innerText;
      this.$copyText(text).then((e) => {
        this.$message({ message: '复制成功', type: 'success' });
      }).catch((err) => {
        this.$message({ message: '复制失敗', type: 'error' });
      })
    },
    format(value) {
      if (!Number.isNaN(value) && value !== undefined) {
        return value.toString().replace(/^(-?\d+?)((?:\d{3})+)(?=\.\d+$|$)/, (all, pre, groupOf3Digital) => pre + groupOf3Digital.replace(/\d{3}/g, ',$&'));
      }
      return value;
    }
  },
  computed: {
    ...mapState('payment', [
      'IndexPayment',
      'ActiveTagName',
      'IndexWallet',
    ]),
    ...mapState('member', [
      'IndexPersonal',
      'IndexBankCard',
      'IndexBankList',
    ]),
    ...mapGetters('member', [
      'filterBankCard',
    ]),
  },
  watch: {
    'depositForm.amount': {
      handler(val) {
        if (val === '') {
          this.indexDepositChannel = [];
        } else {
          this.activeDepositChannel = -1;
          const temparr = [];
          this.IndexPayment.forEach(element => {
            if (element.up_limit >= val && val >= element.lower_limit) {
              temparr.push(element);
            }
          });
          this.indexDepositChannel = temparr;
        }
      },
      deep: true,
      immediate: true,
    },
    activeDepositChannel(val) {
      this.depositForm.payload = '';
      if (this.indexDepositChannel[val].payload.length > 1) {
        this.indexDepositOptions = this.indexDepositChannel[val].payload;
        this.displayDepositBank = true;
      } else {
        this.displayDepositBank = false;
        this.depositForm.payload = this.indexDepositChannel[val].payload[0].value;
      }
    },
    depositForm: {
      handler(val) {
        if (this.depositForm.amount === '' || this.depositForm.payload === '') {
          this.depositFormValidate = false;
        } else {
          this.depositFormValidate = true;
        }
      },
      deep: true,
    },
    withdrawForm: {
      handler(val) {
        if (this.withdrawForm.amount === '' || this.withdrawForm.bank_card_id === '') {
          this.withdrawFormValidate = false;
        } else {
          this.withdrawFormValidate = true;
        }
      },
      deep: true,
    },
  },
  created() {
    // 檢查電話
    if (this.$route.query.card === 'bl_Transaction' && this.$route.query.type === 'withdraw') {
      this.$store.dispatch('member/API_MemberDetail').then((res) => {
        if (res.data.data[0].phone === null) {
          this.$store.commit('index/setCardName', {
            card: 'bl_BindingPhoneForm',
          });
        }
      });
    }
    this.$store.dispatch('member/API_MemberPersonal');
    this.$store.dispatch('payment/API_IndexPayment');
    this.$store.dispatch('payment/API_MemberWallet');
    this.$store.dispatch('member/API_MemberBankCard').then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log(err.response);
    });
    this.$store.dispatch('member/API_MemberBankList');
    this.$store.commit('payment/setActiveTagName', this.$route.query.type);
    this.returnType = '';
  },
}
</script>

<style lang="scss" scoped>
.money {
  display: flex;
  flex-direction: column;
  height: 100%;

  &__header {
    display: flex;
    justify-content: center;
    align-items: center;

    &__background {
      background-color: $origin_dark;
      position: absolute;
      top: 0;
      height: $height-72;
      width: 100%;
      box-shadow: inset 0px -30px 30px rgba(59, 70, 92, 0.37);
    }

    &__tag {
      height: $height-72;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
    }

    .active1 {
      color: $navy_dark;
      background-color: white;
      border-top-right-radius: 30px;
    }

    .active2 {
      color: $navy_dark;
      background-color: white;
      border-top-left-radius: 30px;
    }
  }
}

.deposit {

  &__main {
    padding: $height-32 $width-24 0;
    overflow-y: auto;
    overflow-x: hidden;
    max-width: 100vw;
    flex: 1;

    &__video {
      display: block;
      color: $theme;

      i {
        margin-right: $width-8;
      }
    }

    &__title {
      display: flex;
      justify-content: space-between;
      margin-bottom: $height-16;

      p {
        margin: 0;
      }
    }

    &__moneyInput {
      margin-bottom: $height-16;
      font-size: $text-16;
    }

    &__default {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      margin-bottom: $height-20;

      button {
        width: 74px;
        height: 40px;
        color: $origin_darkest;
        border: 1px solid $origin_light;
        border-radius: 4px;
        margin-bottom: $height-8;
        background-color: white;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
      }
    }

    &__channel {
      height: 80px;
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      align-content: flex-start;
      margin-bottom: $height-28;
      overflow: auto;

      &--button {
        border: 1px solid $origin_light;
        padding: 10px 0;
        background-color: white;
        width: 80px;
        height: 80px;
        margin-right: 12px;
        border-radius: 4px;

        i {
          font-size: 30px;
        }

        p {
          margin: 0;
          font-size: 12px;
        }
      }
    }

    .qrcode {
      text-align: center;

      img {
        border: 12px solid rgb(217, 59, 59);
        border-radius: 10px;
      }
    }

    &::-webkit-scrollbar {
      display:none;
    }
  }

  &__button {
    display: block;
    text-align: center;
    padding: $height-20 0;
    background-color: $theme;
    color: white;
    width: 100%;
    border: none;
  }
}

.withdraw {

  &__main {
    padding: $height-32 $width-28 0;
    overflow-y: auto;
    overflow-x: hidden;
    max-width: 100vw;
    flex: 1;

    &__video {
      display: block;
      color: $theme;

      i {
        margin-right: $width-8;
      }
    }

    &__title {
      margin-bottom: $height-16;
      display: flex;
      justify-content: space-between;
      align-items: center;

      p {
        margin: 0;
      }

      button {
        color: $theme;
        font-size: $text-14;
      }
    }

    &__moneyInput {
      display: flex;
      margin-bottom: $height-28;

      /deep/ input {
        width: 98%;
      }

      button {
        color: $theme;
        background-color: rgba(142, 115, 218, 0.2);
      }
    }

    &__nameInput {
      margin-bottom: $height-28;
    }

    &::-webkit-scrollbar {
      display:none;
    }
  }

  &__button {
    display: block;
    text-align: center;
    padding: $height-20 0;
    background-color: $theme;
    color: white;
    width: 100%;
    border: none;
  }
}

.disabled {
  background-color: $origin_dark;
}

/deep/ .el-divider {
  width: 110vw;
  position: relative;
  left: -10vw;
}

/deep/ .el-select {
  width: 100%;
  margin-bottom: 80px;
}

.activeBtn {
  color: $theme !important;
  border: 1px solid $theme !important;
}

.color__gray {
  color: $navy_light;
}

.color__darkgray {
  color: $origin_dark;
}

.color__theme {
  color: $theme;
}

.border__gray {
  border: 1px solid $origin_light;
}
</style>
