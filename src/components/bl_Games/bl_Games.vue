<template lang="pug">
  .games
    .games__bg(v-if="GameType[0]" :style="{ backgroundImage: 'url(' + bgImage + ')' }")
      .games__header
        i.fas.fa-chevron-left(@click="back")
        el-dropdown(@command="setGameType" trigger="click")
          span.el-dropdown-link {{ gameDisplay[0].gameGroupName }}
            i.fas.fa-sort-down.position-absolute
          el-dropdown-menu(slot="dropdown")
            el-dropdown-item(v-for="item in GameType[0].gameGroups.data" :key="item.id" :command="item.id") {{ item.gameGroupName }}
        i.fas.fa-search(@click="changeGamePageType(1)")
    .games__category
      .games__category__icon(@click="type = 'New'" :class="{'active': type === 'New'}")
        i.fas.fa-bolt.mb-1
        | 最新
      .games__category__icon(@click="type = 'Hot'" :class="{'active': type === 'Hot'}")
        i.fas.fa-fire-alt.mb-1
        | 热门
      .games__category__icon(@click="type = 'Have'" :class="{'active': type === 'Have'}")
        i.fas.fa-history.mb-1
        | 曾经
      .games__category__icon(@click="type = 'Love'" :class="{'active': type === 'Love'}")
        i.fas.fa-grin-stars.mb-1
        | 最爱
      .games__category__icon(@click="changeGamePageType(2)")
        i.fas.fa-filter.mb-1
        | 进阶
    .games__main(v-if="type === 'New'")
      GameCard(v-for="item in IndexNewGameList" :game="item" :key="item.id")
    .games__main(v-else-if="type === 'Hot'")
      GameCard(v-for="item in IndexHotGameList" :game="item" :key="item.id")
    .games__main(v-else-if="type === 'Have'")
      GameCard(v-for="item in IndexHavePlayGameList" :game="item" :key="item.id")
    .games__main(v-else-if="type === 'Love'")
      GameCard(v-for="item in IndexLikeGameList" :game="item" :key="item.id")
</template>

<script>
import { mapState } from 'vuex';
import GameCard from '@/components/bl_Games/bl_GameCard.vue';

export default {
  components: {
    GameCard,
  },
  data() {
    return {
      bgImage: `${process.env.VUE_APP_IMG}/static/img/picGameIndexTopbg@3x.png`,
      type: 'New',
    }
  },
  methods: {
    // 換成搜尋以及進階
    changeGamePageType(value) {
      this.$store.commit('games/setGamePageType', value);
    },
    // 換遊戲類別
    setGameType(value) {
      this.$router.push({name: 'games', query: { group: 6, groupid: value }});
      this.init();
    },
    // 取得資料
    init() {
      this.$store.dispatch('games/API_IndexNewGameList', {
        params: {
          device: 1,
          game_group_id: this.$route.query.groupid,
        }
      });
      this.$store.dispatch('games/API_IndexHotGameList', {
        params: {
          device: 1,
          game_group_id: this.$route.query.groupid,
        }
      });
      this.$store.dispatch('games/API_IndexHavePlayGameList', {
        params: {
          device: 1,
          game_group_id: this.$route.query.groupid,
        }
      });
      this.$store.dispatch('games/API_IndexLikeGameList', {
        params: {
          device: 1,
          game_group_id: this.$route.query.groupid,
        }
      });
    },
    back() {
      this.$router.push('/');
    }
  },
  computed: {
    ...mapState('games', [
      'GameType',
      'IndexNewGameList',
      'IndexHotGameList',
      'IndexHavePlayGameList',
      'IndexLikeGameList',
    ]),
    gameDisplay() {
      return this.GameType[0].gameGroups.data.filter(item => {
        return item.id === Number(this.$route.query.groupid);
      })
    }
  },
  created() {
    // 取得資料
    this.init();
  },
}
</script>

<style lang="scss" scoped>
.games {
  display: flex;
  flex-direction: column;
  height: 100vh;

  &__bg {
    height: 37vh;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }

  &__header {
    padding: $height-24 $width-28;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
    font-size: $text-20;

    .el-dropdown {
      color: white;
      font-size: $text-20;
    }
  }

  &__category {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $height-24 $width-24;

    &__icon {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: $text-12;

      i {
        font-size: $text-20;
      }
    }
  }

  &__main {
    padding: 0 $width-24;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    flex: 1;
    overflow: auto;
  }
}

.active {
  color: $theme;
}
</style>
