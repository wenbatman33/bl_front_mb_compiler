<template lang="pug">
  .memberInfo
    .memberBackground
    .memberStatus(:style="{ backgroundImage: 'url(' + bgImage + ')' }")
      .memberStatus__first
        .d-flex.flex-column
          p.memberStatus__first__title Hi, {{ IndexProfile.memberAccount }}
          span.memberStatus__first__greetings {{ IndexProfile.greetings }}
        router-link(to="/my/inbox")
          el-badge.memberStatus__first__icon(:value="IndexProfile.memberInboxCnt" :hidden="IndexProfile.memberInboxCnt === 0")
            i.far.fa-envelope
      .memberStatus__last
        .memberStatus__last__photo(@click="editPhoto = true" :style="{backgroundImage: 'url(' + imageUrl(IndexProfile.memberPofilePicture) + ')'}")
          i.fas.fa-image.changePhoto
        .memberStatus__last__items
          b-progress.progress(:value="IndexProfile.memberVerifybar" variant="warning")
          p.security 帐号安全等级：
            span 中等
          .d-flex.align-items-center.justify-content-around
            .memberStatus__last__items--icon
              i.fas.fa-envelope
              i.fas.fa-check.success(v-if="IndexProfile.memberEmailCert === 1")
            .memberStatus__last__items--icon
              i.fas.fa-mobile-alt
              i.fas.fa-check.success(v-if="IndexProfile.memberPhoneCert === 1")
            .memberStatus__last__items--icon
              i.fas.fa-lock
              i.fas.fa-check.success(v-if="IndexProfile.memberRealName === 1")
            .memberStatus__last__items--icon
              i.fas.fa-credit-card
              i.fas.fa-check.success(v-if="IndexProfile.memberBankCard === 1")
    .memberMain
      //- .memberMission
        .memberMission__title
          i.el-icon-eleme
          span 任务中心
        .memberMission__detail 每日任务已完成 5/8，再加把劲！
      .memberFunds
        .memberFunds__assets
          .memberFunds__assets__tag(@click="show = !show")
            p 收合
            i.el-icon-arrow-up(v-if="show")
            i.el-icon-arrow-down(v-else)
          .memberFunds__assets__title 我的资金(元)
          .memberFunds__assets__money ¥{{ totalCash }}
        el-collapse-transition
          .memberFunds__wallet(v-if="show")
            .memberFunds__wallet__betlead
              p ¥{{ cash }}
              p 中心錢包
            | +
            .memberFunds__wallet__game
              p ¥{{ gameCash }}
              p 遊戲錢包
                i.fas.fa-info-circle(@click="walletDetail")
            button.memberFunds__wallet__button(@click="recycle") 一键收回
      .memberFunction
        router-link.memberFunction__items(to="/my/transactionlog")
          i.fas.fa-coins
          p 资金记录
        router-link.memberFunction__items(to="/my/mypromotion")
          i.fas.fa-gift
          p 我的优惠
        router-link.memberFunction__items(to="/my/betting")
          i.fas.fa-dice-six
          p 我的投注
        router-link.memberFunction__items(to="/my/personal")
          i.fas.fa-user
          p 个人资料
        router-link.memberFunction__items(to="/my/detail")
          i.fas.fa-shield-alt
          p 安全中心
        //- router-link.memberFunction__items(to="/my/notice")
        //-   i.fas.fa-cogs
        //-   p 偏好设定
        a.memberFunction__items(@click="version")
          i.fas.fa-cogs
          p 版本讯息
    .editPhoto__layer(v-if="editPhoto" @click="editPhoto = false")
    .editPhoto(v-if="editPhoto")
      .editPhoto__card
        .editPhoto__card__header 更换头像
        .editPhoto__card__main
          .editPhoto__card__main--photo(v-for="item in 6" @click="photoForm.profile_picture = item")
            img(:src="imageUrl(item)")
            .overlayer(v-if="photoForm.profile_picture === item")
              i.fas.fa-check-circle
        .editPhoto__card__button(@click="submit") 提交
    Footer
</template>

<script>
import { mapState } from 'vuex';
import Footer from '@/components/bl_Footer/bl_Footer.vue';

export default {
  components: {
    Footer,
  },
  data() {
    return {
      bgImage: `${process.env.VUE_APP_IMG}/static/img/bluebg.png`,
      show: false,
      editPhoto: false,
      photoForm: {
        profile_picture: 1,
      },
    };
  },
  methods: {
    imageUrl(index){
      return `${process.env.VUE_APP_IMG}/static/img/memberPofilePicture/avater_${index}.png`
    },
    submit() {
      this.$store.dispatch('member/API_MemberModifyPersonal', this.photoForm).then((res) => {
        if (res.status === 200 && res.data.status === 1) {
          this.$store.dispatch('member/API_MemberProfile');
          this.editPhoto = false;
        }
      });
    },
    walletDetail() {
      this.$store.commit('index/setCardOpen', true);
      this.$store.commit('index/setCardName', {
        card: 'bl_WalletDetail',
      });
    },
    version() {
      this.$store.commit('index/setCardOpen', true);
      this.$store.commit('index/setCardName', {
        card: 'bl_Version',
      });
    },
    recycle() {
      this.$store.dispatch('payment/API_RecyclingAllWallet').then((res) => {
        if (res.status === 200 && res.data.status === 1) {
          this.$store.dispatch('payment/API_MemberWallet');
          this.$message({ message: '收回成功', type: 'success' });
        }
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
    ...mapState('member', [
      'IndexProfile',
    ]),
    ...mapState('payment', [
      'IndexWallet',
    ]),
    cash() {
      let num = this.format((Math.floor(this.IndexWallet.cash * 100) / 100).toFixed(2).toString());
      return num;
    },
    gameCash() {
      let num = this.format((Math.floor(this.IndexWallet.gameCash * 100) / 100).toFixed(2).toString());
      return num;
    },
    totalCash() {
      let total = this.format((Math.floor((this.IndexWallet.gameCash + this.IndexWallet.cash) * 100) / 100).toFixed(2).toString());
      return total;
    },
  },
  created() {
    this.$store.dispatch('member/API_MemberProfile').then((res) => {
      this.photoForm.profile_picture = res.data.data[0].memberPofilePicture;
    });
    this.$store.dispatch('payment/API_MemberWallet');
    window.format = this.format;
  },
};
</script>

<style lang="scss" scoped>
.memberInfo {
  display: flex;
  flex-direction: column;
  height: 100vh;

  .memberBackground {
    background: linear-gradient(to bottom, rgba(123, 124, 249, 0), rgb(124, 105, 248));
    opacity: 0.12;
    position: fixed;
    width: 100%;
    height: 100vh;
    z-index: -1;
  }

  .memberStatus {
    background-size: cover;
    border-bottom-left-radius: 80px;
    padding: $height-16 $width-28 $height-24 $width-24;
    color: white;

    &__first {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: $height-12;

      &__title {
        font-size: $text-20;
        margin-bottom: $height-8;
      }

      &__greetings {
        font-size: $text-14;
      }

      &__icon {
        color: white;
        width: $width-32;
        height: $width-32;
        font-size: $width-18;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(to right, rgba(142, 45, 226, 0.8), rgba(74, 0, 224, 0.8));
      }
    }

    &__last {
      display: flex;
      justify-content: space-between;
      align-items: center;

      &__photo {
        width: 26.67vw;
        height: 26.67vw;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        border-radius: 50%;
        border: 2px solid white;
        position: relative;

        .changePhoto {
          position: absolute;
          width: $width-24;
          height: $width-24;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: $navy_light;
          right: 0;
          bottom: 0;
          border-radius: 50%;
          font-size: $text-12;
        }
      }

      &__items {
        width: 60%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        text-align: center;

        .progress {
          height: 0.5rem;
        }

        .security {
          margin: 0;
          font-size: $text-12;
          padding: $height-12 0 $height-10;

          span {
            color: rgb(255, 208, 99);
          }
        }

        &--icon {
          width: $width-32;
          height: $width-32;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(to right, rgba(142, 45, 226, 0.8), rgba(74, 0, 224, 0.8));
          border-radius: 50%;
          font-size: $text-12;
          position: relative;

          .success {
            position: absolute;
            bottom: 0;
            right: 0;
            color: white;
            background-color: #13ce66;
            border-radius: 50%;
            transform: scale(0.75);
          }
        }
      }
    }
  }

  .memberMain {
    padding: $height-16 $width-16 0;
    overflow: auto;
    flex: 1;

    .memberMission {
      display: flex;
      align-items: center;
      margin-bottom: $height-16;
      border: 1px solid rgb(242, 244, 247);
      border-radius: 36px;
      font-size: $text-14;
      background-color: rgb(255, 255, 255);

      &__title {
        color: white;
        background: linear-gradient(to right, rgb(255, 173, 0), rgb(249, 109, 0));
        border-radius: 36px;
        padding: $height-12 $width-16;
        margin-right: $width-12;

        span {
          margin-left: $width-8;
        }
      }
    }

    .memberFunds {
      border: 1px solid rgb(242, 244, 247);
      border-radius: 20px;
      padding-top: $height-24;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-bottom: $height-16;
      background-color: rgb(255, 255, 255);

      &__assets {
        position: relative;
        padding-bottom: $height-24;
        padding-left: $width-24;

        &__title {
          font-size: $text-12;
          color: $origin_dark;
        }

        &__money {
          font-size: $text-24;
        }

        &__tag {
          width: 72px;
          height: 28px;
          background: linear-gradient(to left, rgb(43, 233, 159), rgb(19, 206, 102));
          border-top-left-radius: 20px;
          border-bottom-left-radius: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          font-size: $text-12;
          position: absolute;
          right: 0;

          p {
            margin: 0 5px 0 0;
          }

          i {
            border: 1px solid white;
            border-radius: 50%;
          }
        }
      }

      &__wallet {
        border-top: 1px solid rgb(242, 244, 247);
        display: flex;
        padding: 16px 10px 16px 20px;
        justify-content: space-between;
        align-items: center;

        p {
          margin: 0;
          font-size: $text-12;
          color: $origin_dark;

          &:first-child {
            font-size: $text-14;
            color: $navy_dark;
          }
        }

        &__button {
          padding: $height-8 $width-16;
          color: $theme;
          font-size: $text-12;
          border: 1px solid $theme;
          border-radius: 18px;
          background-color: white;
        }
      }
    }

    .memberFunction {
      border: 1px solid rgb(242, 244, 247);
      border-radius: 20px;
      padding: $height-28 $width-18;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: flex-start;
      background-color: rgb(255, 255, 255);
      margin-bottom: $height-16;

      &__items {
        color: rgb(147, 159, 184);
        text-align: center;
        padding: $height-12 $width-22;

        i {
          font-size: $text-36;
          margin-bottom: $height-8;
        }

        p {
          font-size: $text-14;
          margin: 0;
        }
      }
    }
  }

  .editPhoto {
    &__layer {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.48);
    }

    &__card {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 90vh;
      background-color: white;
      z-index: 3;
      display: flex;
      flex-direction: column;

      &__header {
        padding: $height-24 0;
        display: flex;
        justify-content: center;
        align-items: center;
        color: $navy_dark;
        font-size: $text-20;
        border-bottom: 1px solid $origin_light;
      }

      &__main {
        flex: 1;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-content: center;

        &--photo {
          position: relative;
          margin-right: $width-20;
          margin-bottom: $height-28;

          .overlayer {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: rgba(107, 73, 170, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;

            i {
              font-size: $width-28;
              color: white;
            }
          }

          &:nth-child(2n) {
            margin-right: 0px;
          }
        }
      }

      &__button {
        color: white;
        background-color: $theme;
        padding: $height-20 0;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: $text-20;
      }
    }
  }
}

/deep/ .el-badge__content {
  border: none;
}
</style>
