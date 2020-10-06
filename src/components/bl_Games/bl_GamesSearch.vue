<template lang="pug">
  .search
    .search__header
      el-input.mr-3(v-model="word" placeholder="搜索所有平台游戏" @input="search")
        i.el-input__icon.fas.fa-search(slot="prefix")
      el-button(type="text" @click="cancel") 取消
    .search__main
      .search__main__title 搜索结果：
      .search__main__result
        GameCard(v-for="item in searchArray" :game="item")
</template>

<script>
import GameCard from '@/components/bl_Games/bl_GameCard.vue';

export default {
  components: {
    GameCard,
  },
  data() {
    return {
      word: '',
      searchArray: [],
    }
  },
  methods: {
    search() {
      const payload = {
        params: {
          device: 1,
          game_group_id: this.$route.query.groupid,
          keyword: this.word,
        }
      };
      if (this.word === '') {
        this.searchArray = [];
      } else {
        this.$store.dispatch('games/API_IndexNewGameList', payload).then((res) => {
          this.searchArray = res.data.data;
        });
      }
    },
    cancel() {
      this.word = '';
      this.$store.commit('games/setGamePageType', 0);
    }
  }
}
</script>

<style lang="scss" scoped>
.search {
  display: flex;
  flex-direction: column;
  height: 100vh;

  &__header {
    background-color: $origin_darkest;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $height-12 $width-24;

    button {
      color: white;
    }
  }

  &__main {
    flex: 1;
    padding: $height-40 $width-28 0;

    &__title {
      margin-bottom: $height-24;
    }

    &__result {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
  }
}
</style>

