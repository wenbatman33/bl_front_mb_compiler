<template lang="pug">
  .footer(:style="{ backgroundImage: 'url(' + bgImage + ')' }")
    router-link.footer__items.text-center.text-decoration-none(to="/" @click.native="setFooterView('home')" :class="{'active': FooterView === 'home'}")
      i.footer__items__icon.fas.fa-home
      p.footer__items__name 首頁
    router-link.footer__items.text-center.text-decoration-none(to="/promotion" @click.native="setFooterView('promotion')" :class="{'active': FooterView === 'promotion'}")
      i.footer__items__icon.fas.fa-gift
      p.footer__items__name 優惠
    .footer__center
      CircleMenu(@menuStatus="setMenuStatus")
    .footer__items.text-center.text-decoration-none(@click="setCardOpen" :class="{'active': FooterView === 'money'}")
      i.footer__items__icon.fas.fa-donate
      p.footer__items__name 存提
    router-link.footer__items.text-center.text-decoration-none(to="/my" @click.native="setFooterView('member')" :class="{'active': FooterView === 'member'}")
      i.footer__items__icon.fas.fa-user
      p.footer__items__name 我的
    .background(v-if="open")
</template>

<script>
import { mapState } from 'vuex';
import CircleMenu from '@/components/bl_Footer/bl_CircleMenu.vue';

export default {
  components: {
    CircleMenu,
  },
  data() {
    return {
      open: false,
      bgImage: `${process.env.VUE_APP_IMG}/static/img/menu-footer@3x.png`,
    };
  },
  methods: {
    setCardOpen() {
      if (window.localStorage.getItem('JWT_TOKEN')) {
        this.$store.dispatch('payment/API_MemberWallet');
        this.$store.commit('index/setCardName', {
          card: 'bl_Transaction',
          type: 'deposit',
        });
        this.$store.commit('index/setCardOpen', true);
      } else {
        this.$router.push('/login')
      }
    },
    setFooterView(view) {
      this.$store.commit('index/setFooterView', view);
    },
    setMenuStatus(value) {
      this.open = value;
    },
  },
  computed: {
    ...mapState('index', [
      'FooterView',
    ]),
  },
  mounted() {
    if (this.$route.name === 'home') {
      this.setFooterView('home');
    } else if (this.$route.name === 'promotion') {
      this.setFooterView('promotion');
    } else {
      this.setFooterView('member');
    }
  },
};
</script>

<style lang="scss" scoped>
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  border-top-right-radius: 35px;
  border-top-left-radius: 35px;
  box-shadow: 0px 0px 35px rgba(0,0,0,0.15);
  z-index: 2;
  background-size: cover;

  &__items {
    color: white;
    padding: 8px 0 4px;

    &__icon {
      font-size: $width-24;
    }

    &__name {
      margin: 0;
      font-size: $text-12;
    }
  }

  label {
    margin: 0;
  }
}

.active {
  color: rgb(255, 213, 0);
}

.background {
  background: linear-gradient(to bottom, rgba(142, 115, 218, 0.0), rgb(70, 36, 137));
  position: fixed;
  height: 100vh;
  width: 100vw;
  top: 0;
  z-index: -1;
}
</style>
