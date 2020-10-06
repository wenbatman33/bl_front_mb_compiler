<template lang="pug">
  .header.px-3.py-1
    router-link.w-100(to="/")
      .logo(:style="{ backgroundImage: 'url(' + bgImage + ')' }")
    .wallet(v-if="login" @click="toMy")
      i.fas.fa-coins.mr-2
      .black ¥{{ format((Math.floor((this.IndexWallet.gameCash + this.IndexWallet.cash) * 100) / 100).toFixed(2).toString()) }}
    .d-flex(v-else)
      el-button(@click="toRegister" size="small" round) 注册
      el-button(@click="toLogin" size="small" type="betlead" round) 登录
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      bgImage: `${process.env.VUE_APP_IMG}/static/img/logo@3x.png`,
      login: false,
    }
  },
  methods: {
    format(value) {
      if (!Number.isNaN(value) && value !== undefined) {
        return value.toString().replace(/^(-?\d+?)((?:\d{3})+)(?=\.\d+$|$)/, (all, pre, groupOf3Digital) => pre + groupOf3Digital.replace(/\d{3}/g, ',$&'));
      }
      return value;
    },
    toLogin() {
      this.$router.push('/login');
    },
    toRegister() {
      this.$router.push('/register');
    },
    toMy() {
      this.$router.push('/my');
    }
  },
  computed: {
    ...mapState('payment', [
      'IndexWallet',
    ]),
  },
  mounted() {
    if (window.localStorage.Finger && window.localStorage.JWT_TOKEN) {
      this.$store.dispatch('payment/API_MemberWallet').then((res) => {
        this.login = true;
      }).catch((err) => {
        this.login = false;
        console.log(err.response);
      });
    } else {
      this.login = false;
    }
  },
}
</script>

<style lang="scss" scoped>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    top: 0;
    z-index: 2;
    background-color: white;
    width: 100%;
    height: 60px;

    .logo {
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
      width: 50%;
      height: 50px;
    }

    .wallet {
      color: $theme;
      display: flex;
      align-items: center;

      .black {
        color: black;
      }
    }
  }

  .el-button--betlead {
    color: white;
    background: linear-gradient(to right, rgb(249, 159, 0), rgb(219, 48, 105));
    border: none;
  }
</style>