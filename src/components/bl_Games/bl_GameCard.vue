<template lang="pug">
  .gamesCard
    .gamesCard__img(@click="playGame(game)" :style="{backgroundImage: 'url(' + game.images + ')'}")
    .gamesCard__title
      span {{ game.gameName }}
      i.fab.fa-gratipay(@click="addLikeList(game.id)" :class="{'active': like}")
</template>

<script>
export default {
  props: ['game'],
  data() {
    return {
      like: false,
      loginForm: {
        params: {
          device: 2,
          game_group_id: 0,
          game_id: 0,
          force_login: 0,
        },
      },
    };
  },
  methods: {
    playGame(game) {
      if (window.localStorage.JWT_TOKEN && window.localStorage.Finger) {
        this.loginForm.params.game_id = game.id;
        // 如果沒有錢 先跳出確認視窗
        if (this.$store.state.payment.IndexWallet.cash <= 0
            && this.$store.state.payment.IndexWallet.gameCash <= 0) {
          this.$store.dispatch('games/GameLoginConfirm', this.loginForm);
        } else {
          this.$store.dispatch('games/API_GameLogin', this.loginForm);
        }
      } else {
        // 未登入時跳轉登入頁
        this.$message({ message: '請先登入', type: 'error' });
        this.$router.push('/login');
      }
    },
    addLikeList(id) {
      if (!this.like) {
        this.$store.dispatch('games/API_AddGameLikeRecord', { game_id: id }).then((res) => {
          if (res.status === 200 && res.data.status === 1) {
            this.like = true;
            this.$store.dispatch('games/API_IndexLikeGameList', {
              params: {
                device: 1,
                game_group_id: this.$route.query.groupid,
              },
            });
          }
        });
      } else {
        this.$store.dispatch('games/API_DeleteGameLikeRecord', id).then((res) => {
          if (res.status === 200 && res.data.status === 1) {
            this.like = false;
            this.$store.dispatch('games/API_IndexLikeGameList', {
              params: {
                device: 1,
                game_group_id: this.$route.query.groupid,
              },
            });
          }
        });
      }
    },
  },
  mounted() {
    if (this.game.gameLikeId === 0) {
      this.like = false;
    } else {
      this.like = true;
    }
  },
  created() {
    this.loginForm.params.game_group_id = this.$route.query.groupid;
  },
};
</script>

<style lang="scss" scoped>
.gamesCard {
  width: 156px;
  display: flex;
  flex-direction: column;
  margin-bottom: $height-16;

  &__img {
    height: 102px;
    border-radius: 4px;
    background-size: contain;
  }

  &__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.active {
  color: red;
}
</style>
