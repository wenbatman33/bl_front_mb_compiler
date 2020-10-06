<template lang="pug">
  .security(v-if="IndexBankList.length > 0")
    .security__header(:style="{ backgroundImage: 'url(' + bgImage + ')' }")
      router-link(to="/my")
        i.fas.fa-chevron-left
      p 安全中心
    .security__main
      .security__card(@click="setCardOpen('bl_BindingPhoneForm')")
        .security__card__icon
          i.fas.fa-mobile-alt
        .security__card__main
          p 手机验证
          p {{ IndexDetail.phone ? IndexDetail.phone : '未绑定'}}
        .security__card__arrow
          i.fas.fa-chevron-right
      .security__card(@click="setCardOpen('bl_BindingEmailForm')")
        .security__card__icon
          i.fas.fa-envelope
        .security__card__main
          p 邮箱验证
          p {{ IndexDetail.email ? IndexDetail.email : '未绑定'}}
        .security__card__arrow
          i.fas.fa-chevron-right
      .security__card(@click="setCardOpen('bl_BankManage')")
        .security__card__icon
          i.fas.fa-credit-card
        .security__card__main
          p 银行卡管理
          p(v-if="filterBankName()") {{ filterBankName() }} {{ defaultBankCard.memberBankNo }}
        .security__card__arrow
          i.fas.fa-chevron-right
      .security__card(@click="setCardOpen('bl_ChangePasswordForm')")
        .security__card__icon
          i.fas.fa-lock
        .security__card__main
          p 密码管理
        .security__card__arrow
          i.fas.fa-chevron-right
      .security__card(v-if="!IndexDetail.accountChanged" @click="setCardOpen('bl_ChangeAccountForm')")
        .security__card__icon
          i.fas.fa-user
        .security__card__main
          p 帐号管理
          p {{ IndexDetail.account ? IndexDetail.account : '未绑定'}}
        .security__card__arrow
          i.fas.fa-chevron-right
      //- .security__card
      //-   .security__card__icon
      //-     i.fas.fa-fingerprint
      //-   .security__card__main
      //-     p 脸部与指纹辨识
      //-   .security__card__arrow
      //-     el-switch(v-model="value" active-color="#13ce66" inactive-color="#ff4949")
      .security__card(@click="logout")
        .security__card__icon
          i.fas.fa-sign-out-alt
        .security__card__main
          p 登出
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  data() {
    return {
      bgImage: `${process.env.VUE_APP_IMG}/static/img/bluebg.png`,
    }
  },
  methods: {
    setCardOpen(type) {
      this.$store.commit('index/setCardOpen', true);
      // 未綁定電話不可添加銀行卡
      if (type === 'bl_BankManage') {
        if (this.IndexDetail.phone) {
          this.$store.commit('index/setCardName', {
            card: 'bl_BankManage',
          });
        } else {
          this.$store.commit('index/setCardName', {
            card: 'bl_BindingPhoneForm',
          });
        }
      } else {
        this.$store.commit('index/setCardName', {
          card: type,
        });
      }
    },
    logout() {
      this.$store.dispatch('member/API_MemberLogout');
      this.$store.commit('index/setCardName', '');
    },
    filterBankName() {
      if (this.IndexBankList && this.defaultBankCard) {
        const result = this.IndexBankList.filter((item) => item.bankCode === this.defaultBankCard.memberBankCode);
        return result[0].bankName;
      }
    }
  },
  computed: {
    ...mapState('member', [
      'IndexDetail',
      'IndexBankCard',
      'IndexBankList',
    ]),
    ...mapGetters('member', [
      'defaultBankCard',
    ]),
  },
  created() {
    this.$store.dispatch('member/API_MemberDetail');
    this.$store.dispatch('member/API_MemberBankCard');
    this.$store.dispatch('member/API_MemberBankList');
  },
}
</script>

<style lang="scss" scoped>
.security {
  background-color: $origin_lightest;
  display: flex;
  flex-direction: column;
  height: 100vh;

  &__header {
    font-size: $text-20;
    color: white;
    padding: $height-36 $width-24;
    display: flex;
    justify-content: center;
    align-items: center;
    background-size: cover;

    a {
      position: absolute;
      left: $width-24;
      color: white;
    }

    p {
      margin: 0;
    }
  }

  &__main {
    padding-top: $height-24;
    padding-left: $width-24;
    flex: 1;
    overflow: auto;

    .security__card {
      padding: $height-20 $width-28 $height-20 $width-36;
      display: flex;
      background-color: white;
      border-top-left-radius: 100px;
      border-bottom-left-radius: 100px;
      align-items: center;
      margin-bottom: $height-12;
      position: relative;

      &__icon {
        width: $width-48;
        height: $width-48;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(to right, rgb(200, 109, 215), rgb(48, 35, 174));
        border-radius: 50%;
        margin-right: $width-24;
        color: white;
      }

      &__main {
        p {
          margin: 0;
          font-size: $text-14;
          color: $origin_dark;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 50vw;

          &:first-child {
            font-size: $text-16;
            color: $navy_dark;
          }
        }
      }

      &__arrow {
        position: absolute;
        right: $width-28;
        font-size: $text-20;
        color: $theme;
      }
    }
  }
}
</style>
