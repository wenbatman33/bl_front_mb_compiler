<template lang="pug">
  .accountSuccess
    router-link.accountSuccess__back(to="/")
      i.fas.fa-times
    .accountSuccess__bg(:style="{ backgroundImage: 'url(' + bgImage + ')' }")
    img.accountSuccess__photo(:src='image1')
    .accountSuccess__main
      p.accountSuccess__main__success 恭喜注册成功
      p.accountSuccess__main__title 歡迎加入倍利 祝您暢玩倍利
      p.accountSuccess__main__content 贴心小贴士 ：存款前，请先至「个人资料 」页面完成【手机/邮箱绑定】，真实姓名必须与您的银行卡姓名一致，否则无法进行存提款。
      router-link.accountSuccess__main__start.mb-2(to="/") 开始投注
      a.accountSuccess__main__bannerLink(:href="bannerLink")
        img.accountSuccess__main__bannerImage(:src="bannerImage")
</template>

<script>
export default {
  data() {
    return {
      bgImage: `${process.env.VUE_APP_IMG}/static/img/bgSuccess@3x.png`,
      image1: `${process.env.VUE_APP_IMG}/static/img/imgMan@3x.png`,
      bannerImage: '',
      bannerLink: '',
      form: {
        params: {
          banner_group_id: 4,
          platform: 1,
          device: 2,
        }
      }
    }
  },
  watch: {
    '$route': {
      handler() {
        this.$store.dispatch('member/setRegisterSuccess', '');
      }
    },
  },
  created() {
    this.$store.dispatch('index/API_IndexBanner', this.form).then((res) => {
      this.bannerImage = res.data.data[0].bannerImageMobile;
      this.bannerLink = res.data.data[0].bannerLinkMobile;
    });
  }
}
</script>

<style lang="scss" scoped>
  .accountSuccess {
    &__bg {
      background-repeat: no-repeat;
      width: 100%;
      height: 100vh;
      z-index: -1;
      background-size: cover;
      position: absolute;
      top: 0;
    }

    &__back {
      color: white;
      font-size: 24px;
      position: absolute;
      top: $height-24;
      left: $width-24;
    }

    &__photo {
      width: 100%;
      height: 100vh;
      object-fit: contain;
    }

    &__main {
      width: 100%;
      height: 60vh;
      padding: 40px $width-28;
      background-color: white;
      position: absolute;
      bottom: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;

      &__success {
        color: $theme;
        font-size: $text-14;
      }

      &__title {
        font-size: $text-24;
        color: black;
      }

      &__content {
        color: $origin_darkest;
        font-size: $text-16;
      }

      &__start {
        color: white;
        background-color: $theme;
        width: 160px;
        padding: $height-12 0;
        border-radius: 20px;
        text-align: center;
      }

      &__bannerImage {
        width: 100%;
        border-radius: 8px;
      }
    }
  }
</style>