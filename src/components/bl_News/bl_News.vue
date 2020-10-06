<template lang="pug">
  .d-flex.justify-content-center.align-items-center.news.my-2
    i.fas.fa-volume-up.mr-2
    .marquee
      transition(name="slide-fade" tag="div")
        .marquee__item(v-for="(item, index) in marquee" v-if="index === currentNum" :key="item.id" @click="setCardOpen(item.id)") {{ item.newsTitle }}
</template>

<script>
export default {
  data() {
    return {
      image1: `${process.env.VUE_APP_IMG}/static/img/iconWallet@3x.png`,
      currentNum: 0,
      form: {
        params: {
          platform: 1,
          device: 2,
        }
      }
    }
  },
  methods: {
    init(){
      setTimeout(() => {
        if (this.currentNum >= this.marquee.length - 1) {
          this.currentNum = 0;
        } else {
          this.currentNum += 1;
        }
        this.init();
      }, 4000);
    },
    setCardOpen(id) {
      this.$store.commit('index/setCardOpen', true);
      this.$store.commit('index/setCardName', {
        card: 'bl_News',
        id,
      });
      this.$store.commit('index/setAllNews', false);
    },
  },
  computed: {
    marquee() {
      return this.$store.state.index.IndexMarquee;
    },
  },
  created() {
    this.$store.dispatch('index/API_IndexMarquee', this.form).then((res) => {
      this.init();
    });
  },
};
</script>

<style lang="scss" scoped>
.news {
  color: $origin_darkest;

  .marquee {
    width: 100%;
    overflow: hidden;
    display: flex;

    &__item {
      display: inline-block;
      white-space: nowrap;
    }
  }
}

.wallet {
  width: 16px;
}

.megaphone {
  width: 16px;
  color: $navy_light;
}

.orange {
  color: rgb(248, 123, 9);
}

.slide-fade-enter-active {
  transition: all 1.5s ease;
}
.slide-fade-leave-active {
  transition: all .5s ease;
}
.slide-fade-enter{
  transform: translateX(1300px);
}
.slide-fade-enter-to, .slide-fade-leave{
  transform: translateX(0px);
}
.slide-fade-leave-to{
  transform: translateX(-500px);
}
</style>
