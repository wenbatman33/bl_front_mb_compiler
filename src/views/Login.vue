<template lang="pug">
  #login
    Login
    video#loginVideo(autoplay playsinline muted loop)
      source(:src="video" type="video/mp4")
    //- .logo
    //-   img(src="../../public/static/img/logo@3x.png")
</template>

<script>
import Login from '@/components/bl_Login/bl_Login.vue';

export default {
  components: {
    Login,
  },
  data() {
    return {
      video: `${process.env.VUE_APP_CDNSITE}/upload/movies/apploginmovie.mp4`,
    }
  },
};
</script>

<style lang="scss" scoped>
#loginVideo {
  position: fixed;
  right: 0;
  bottom: 0;
  width: 100%;
  z-index: -1;
}

video {
   background:transparent url('../../public/static/img/bgAppbg@2x.png') no-repeat;
   background-size: cover;
}
</style>
