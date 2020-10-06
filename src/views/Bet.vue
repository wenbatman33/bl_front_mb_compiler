<template lang="pug">
  .bet
    .bet__header
      el-button(type="text") 客服
      el-button(type="text" @click="deposit") 存提
      router-link(to="/my") 我的
    iframe.iframe(:src="path")
</template>

<script>
export default {
  data() {
    return {
      path: '',
    }
  },
  methods: {
    deposit() {
      this.$store.commit('index/setCardOpen', true);
      this.$store.commit('index/setCardName', {
        card: 'bl_Transaction',
        type: 'deposit',
      });
    }
  },
  created() {
    this.path = this.$route.query.path;
  }
}
</script>

<style lang="scss" scoped>
.bet {
  display: flex;
  flex-direction: column;
  height: 100vh;

  &__header {
    background-color: $theme;
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: fixed;
    top: 0;
    width: 100%;

    button {
      color: white;
    }

    a {
      color: white;
    }
  }

  .iframe {
    width: 100%;
    flex: 1;
    margin-top: 40px;
  }
}
</style>
