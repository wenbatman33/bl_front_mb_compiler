<template lang="pug">
  .register
    .register__status(:style="{ backgroundImage: 'url(' + bgImage + ')' }")
      router-link(to="/").register__status__close
        i.el-icon-close
      .register__status__tab
        .d-flex.flex-column.align-items-center
          .register__status__tab--item(@click="changeView('account')" :class="{'active': view === 'account'}") 帐号注册
          .bar(v-if="view === 'account'")
        .d-flex.flex-column.align-items-center
          .register__status__tab--item(@click="changeView('phone')" :class="{'active': view === 'phone'}") 手机注册
          .bar(v-if="view === 'phone'")
    .register__form
      component(:is="view")
</template>

<script>
import account from '@/components/bl_Register/bl_AccountRegister.vue';
import phone from '@/components/bl_Register/bl_PhoneRegister.vue';

export default {
  components: {
    account,
    phone,
  },
  data() {
    return {
      bgImage: `${process.env.VUE_APP_IMG}/static/img/bluebg.png`,
      view: 'account',
    };
  },
  methods: {
    changeView(component) {
      this.view = component;
      this.$router.push({ query: {type: component}});
    },
  },
  created() {
    if (this.$route.query.type) {
      this.view = this.$route.query.type;
    }
  },
};
</script>

<style lang="scss" scoped>
.register__status {
  width: 100%;
  background-position: bottom;
  background-repeat: no-repeat;
  background-size: cover;
  border-bottom-left-radius: 14.67vw;
  padding: $height-40 $width-24;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &__close {
    color: white;

    i {
      font-size: 8.4vw;
      font-weight: 900;
    }
  }

  &__tab {
    display: flex;
    font-size: $text-20;
    justify-content: space-around;
    margin-top: $height-44;

    &--item {
      color: white;
      text-decoration: none;
      opacity: 0.4;
    }

    .bar {
      width: $width-40;
      border: 2px solid rgb(248, 123, 9);
      height: 4px;
      border-radius: 2px;
      margin-top: 1vh;
    }

    .active {
      opacity: 1;
    }
  }
}

.register__form {
  text-align: center;
  padding: $height-48 $width-28 0;
}
</style>