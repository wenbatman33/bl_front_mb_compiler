<template lang="pug">
  .personal(v-if="IndexPersonal")
    .personal__header(:style="{ backgroundImage: 'url(' + bgImage + ')' }")
      router-link(to="/my")
        i.fas.fa-chevron-left
      p 个人资料
    .personal__main
      .personal__card(@click="setCardOpen('Realname')")
        .personal__card__icon
          i.fas.fa-user
        .personal__card__main
          p 真实姓名
          p {{ IndexPersonal.memberRealname ? IndexPersonal.memberRealname : '未设定' }}
        .personal__card__arrow
          i.fas.fa-chevron-right
      .personal__card(@click="setCardOpen('Birthday')")
        .personal__card__icon
          i.fas.fa-calendar
        .personal__card__main
          p 出生日期
          p {{ IndexPersonal.memberBirthday ? IndexPersonal.memberBirthday : '未设定' }}
        .personal__card__arrow
          i.fas.fa-chevron-right
      .personal__card(@click="setCardOpen('Gender')")
        .personal__card__icon
          i.fas.fa-user-friends
        .personal__card__main
          p 性别
          p {{ IndexPersonal.memberGender.display ? IndexPersonal.memberGender.display : '未设定' }}
        .personal__card__arrow
          i.fas.fa-chevron-right
      .personal__card(@click="setCardOpen('Address')")
        .personal__card__icon
          i.fas.fa-map-marker-alt
        .personal__card__main
          p 收货地址
          p {{ IndexPersonal.memberFullAddress ? IndexPersonal.memberFullAddress : '未设定' }}
        .personal__card__arrow
          i.fas.fa-chevron-right
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      bgImage: `${process.env.VUE_APP_IMG}/static/img/bluebg.png`,
    }
  },
  methods: {
    setCardOpen(type) {
      if (type === 'Realname') {
        if (this.IndexPersonal.memberRealname === null) {
          this.$store.commit('index/setCardOpen', true);
          this.$store.commit('index/setCardName', {
            card: 'bl_Personal',
            type,
          });
        } else {
          this.$message({ message: '请联络客服修改', type: 'error' });
        }
      } else if (type === 'Birthday') {
        if (this.IndexPersonal.memberBirthday === null) {
          this.$store.commit('index/setCardOpen', true);
          this.$store.commit('index/setCardName', {
            card: 'bl_Personal',
            type,
          });
        } else {
          this.$message({ message: '请联络客服修改', type: 'error' });
        }
      } else {
        this.$store.commit('index/setCardOpen', true);
        this.$store.commit('index/setCardName', {
          card: 'bl_Personal',
          type,
        });
      }
      this.$store.commit('member/setActivePersonal', type);
    },
  },
  computed: {
    ...mapState('member', [
      'IndexPersonal',
    ]),
  },
  created() {
    this.$store.dispatch('member/API_MemberPersonal');
    this.$store.commit('member/setActivePersonal', this.$route.query.type);
  },
}
</script>

<style lang="scss" scoped>
.personal {
  background-color: $origin_lightest;
  display: flex;
  flex-direction: column;
  height: 100vh;

  &__header {
    font-size: $text-20;
    color: white;
    padding: $height-36 $width-24;
    display: flex;
    justify-content: center;
    align-items: center;
    background-size: cover;

    a {
      position: absolute;
      left: $width-24;
      color: white;
    }

    p {
      margin: 0;
    }
  }

  &__main {
    padding-top: $height-24;
    padding-left: $width-24;
    flex: 1;
    overflow: auto;

    .personal__card {
      padding: $height-20 $width-28 $height-20 $width-36;
      display: flex;
      background-color: white;
      border-top-left-radius: 100px;
      border-bottom-left-radius: 100px;
      align-items: center;
      margin-bottom: $height-12;
      position: relative;

      &__icon {
        width: $width-48;
        height: $width-48;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(to right, rgb(200, 109, 215), rgb(48, 35, 174));
        border-radius: 50%;
        margin-right: $width-24;
        color: white;
      }

      &__main {
        p {
          margin: 0;
          font-size: $text-14;
          color: $origin_dark;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 50vw;

          &:first-child {
            font-size: $text-16;
            color: $navy_dark;
          }
        }
      }

      &__arrow {
        position: absolute;
        right: $width-28;
        font-size: $text-20;
        color: $theme;
      }
    }
  }
}
</style>
