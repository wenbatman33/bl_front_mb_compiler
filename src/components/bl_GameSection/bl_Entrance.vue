<template lang="pug">
  .entrance.mb-3
    h5.title |
      span.ml-2.color-black {{ gametype.gameTypeName_Mobile }}
    .d-flex.overflow-auto
      img.gameImg.mr-2(v-for="(game, key) in gamegroup" :key="game.id" :src="game.gameVi_Before" @click="playGame(game)")
      //- .gameImg(v-for="(game, key) in gamegroup" :key="game.id" :style="{ backgroundImage: 'url(' + game.gameVi_Before + ')' }" @click="playGame(game)")
    //- carousel(:per-page="3")
    //-   slide.mr-2(v-for="(game, key) in gamegroup" :index="key" :key="game.id")
    //-     .gameImg(:style="{ backgroundImage: 'url(' + game.gameVi_Before + ')' }" @click="playGame(game)")
</template>

<script>
import { Carousel, Slide } from 'vue-carousel';

export default {
  props: ['gametype', 'gamegroup'],
  components: {
    Carousel,
    Slide,
  },
  data() {
    return {
      loginForm: {
        params: {
          device: 2,
          game_group_id: 0,
          game_id: 0,
          force_login: 0,
        }
      }
    }
  },
  methods: {
    playGame(game) {
      // playmode = 2 可以直接進入電子遊戲
      if (game.gamePlayMode === 2) {
        if (game.gameGroupStatus === 1) {
          this.$router.push({ name: 'games', query: {
            group: 6,
            groupid: game.id,
          }})
        } else {
          this.$message({ message: '游戏维护中，请稍后再进入', type: 'error' });
        }
      } else if (game.gamePlayMode === 1) {
        // 再判斷是否登入 然後根據 openConfirm 判斷是否跳出確認框
        if (window.localStorage.JWT_TOKEN && window.localStorage.Finger) {
          this.loginForm.params.game_group_id = game.id;
          // 判斷遊戲通道是否維護中
          if (game.gameGroupStatus === 1) {
            // 如果沒有錢 先跳出確認視窗
            if (this.$store.state.payment.IndexWallet.cash <= 0 && this.$store.state.payment.IndexWallet.gameCash <= 0) {
              this.$store.dispatch('games/GameLoginConfirm', this.loginForm);
            } else {
              this.$store.dispatch('games/API_GameLogin', this.loginForm);
            }
          } else {
            this.$message({ message: '游戏维护中，请稍后再进入', type: 'error' });
          }
        } else {
          // 未登入時跳轉登入頁
          this.$message({ message: '請先登入', type: 'error' });
          this.$router.push('/login');
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.entrance {
  .title {
    color: $theme;

    .color-black {
      color: black;
    }
  }

  .gameImg {
    height: 150px;
  }
}

</style>
