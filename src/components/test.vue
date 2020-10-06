<template>
  <div>
    <swiper :options="swiperOption">
        <swiper-slide>Slide 1</swiper-slide>
        <swiper-slide>Slide 2</swiper-slide>
        <swiper-slide>Slide 3</swiper-slide>
        <swiper-slide>Slide 4</swiper-slide>
        <swiper-slide>Slide 5</swiper-slide>
        <swiper-slide>Slide 6</swiper-slide>
        <swiper-slide>Slide 7</swiper-slide>
        <swiper-slide>Slide 8</swiper-slide>
        <swiper-slide>Slide 9</swiper-slide>
        <swiper-slide>Slide 10</swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        swiperOption: {
          pagination: {
            el: '.swiper-pagination',
            renderBullet: function (index, className) {
              let temp = index + 1;
              if (temp < 10) {
                temp = '0' + temp
              }
              return '<span class="' + className + '">' + temp + '</span>';
            },
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .swiper-slide {
    height: 200px;
  }
  /deep/ .swiper-pagination-bullet {
    color: red;
    background: none;
    width: unset;
    height: auto;
    display: inline;
    border-radius: 0;

    &-active {
      color: green;
      background: none;
      border-bottom: 2px solid purple;
    }
  }
</style>