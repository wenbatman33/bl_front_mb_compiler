<template lang="pug">
  .inbox(v-if="IndexInbox")
    .inbox__header(:style="{ backgroundImage: 'url(' + bgImage + ')' }")
      router-link(to="/my")
        i.fas.fa-chevron-left
      p 我的消息
      i.far.fa-trash-alt(@click="modify = !modify")
    .inbox__main(v-infinite-scroll="load")
      .inbox__main__nodata(v-if="IndexInbox.length === 0")
        img(:src='image1')
        p 暂无消息
      .inboxSection(v-else v-for="item in IndexInbox" @click="open(item)")
        i.fas.fa-check-circle.modify(v-if="modify" @click="select(item.id)" :class="{'selected': selectGroup.indexOf(item.id) >= 0}")
        .inboxSection__title
          .dot(v-if="item.inboxStatus.value === 0")
          | {{ item.inboxTitle }}
        .inboxSection__subtitle {{ item.inboxUpdatedAt }}
    .inbox__main__function(v-if="modify")
      el-button(type="text" @click="read") 设为已读
      el-button(type="text" @click="del") 删除
</template>

<script>
export default {
  data() {
    return {
      bgImage: `${process.env.VUE_APP_IMG}/static/img/bluebg.png`,
      image1: `${process.env.VUE_APP_IMG}/static/img/messageNull@3x.png`,
      modify: false,
      selectGroup: [],
      currentPage: 1,
      totalPages: null,
      form: {
        params: {
          page: null,
          per_page: null,
        }
      },
      IndexInbox: [],
    }
  },
  methods: {
    select(id) {
      if (this.selectGroup.indexOf(id) < 0) {
        this.selectGroup.push(id)
      } else {
        this.selectGroup.splice(this.selectGroup.indexOf(id), 1);
      }
    },
    open(item) {
      if (!this.modify) {
        if (item.inboxStatus.value === 0) {
          const payload = {};
          payload.id = item.id;
          payload.status = 1;
          this.$store.dispatch('member/API_MemberModifyInbox', payload).then((res) => {
            if (res.status === 200 && res.data.status === 1) {
              this.form.params.page = 1;
              this.form.params.per_page = this.IndexInbox.length;
              this.$store.dispatch('member/API_MemberInbox', this.form).then((res) => {
                if (res.status === 200 && res.data.status === 1) {
                  this.$store.commit('member/setAllInbox', res.data.data);
                }
              });
            }
          });
        }
        this.$store.commit('member/setActiveInbox', item.id);
        this.$store.commit('index/setCardOpen', true);
        this.$store.commit('index/setCardName', {
          card: 'bl_InboxCard',
        });
      }
    },
    load() {
      if (this.currentPage < this.totalPages) {
        this.form.params.page = this.currentPage + 1;
        this.$store.dispatch('member/API_MemberInbox', this.form).then((res) => {
          this.IndexInbox = this.IndexInbox.concat(res.data.data);
          this.currentPage = res.data.meta.pagination.current_page;
          this.totalPages = res.data.meta.pagination.total_pages;
        })
      }
    },
    read() {
      const payload = {};
      payload.id = this.selectGroup.toString();
      payload.status = 1;
      this.$store.dispatch('member/API_MemberModifyInbox', payload).then((res) => {
        if (res.status === 200 && res.data.status === 1) {
          this.modify = false;
          this.form.params.page = 1;
          this.form.params.per_page = this.IndexInbox.length;
          this.$store.dispatch('member/API_MemberInbox', this.form).then((res) => {
            if (res.status === 200 && res.data.status === 1) {
              this.$store.commit('member/setAllInbox', res.data.data);
            }
          });
        }
      });
    },
    del() {
      const payload = {};
      payload.id = this.selectGroup.toString();
      payload.status = 2;
      this.$store.dispatch('member/API_MemberModifyInbox', payload).then((res) => {
        if (res.status === 200 && res.data.status === 1) {
          this.modify = false;
          this.$store.dispatch('member/API_MemberInbox');
        }
      });
    },
  },
  created() {
    this.$store.dispatch('member/API_MemberInbox').then((res) => {
      this.IndexInbox = res.data.data;
      this.totalPages = res.data.meta.pagination.total_pages;
    })
  }
}
</script>

<style lang="scss" scoped>
.inbox {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: $origin_lightest;

  &__header {
    font-size: $text-20;
    color: white;
    padding: $height-36 $width-24;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-size: cover;

    a {
      color: white;
    }

    p {
      margin: 0;
    }
  }

  &__main {
    padding: $height-24 $width-24 0;
    flex: 1;
    overflow: auto;

     &__nodata {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      font-size: 100px;

      img {
        width: 100%;
      }

      p {
        margin: 0;
        color: $origin_dark;
        font-size: $text-16;
      }
    }

    .inboxSection {
      padding: $height-24 $width-16;
      background-color: white;
      border: 1px solid $origin_light;
      border-radius: 12px;
      margin-bottom: $height-16;
      position: relative;

      &:last-of-type {
        margin-bottom: 50px;
      }

      .modify {
        position: absolute;
        right: -5px;
        top: -5px;
        font-size: $text-20;
        color: $origin;
      }

      .selected {
        color: rgb(19, 206, 102);
      }

      &__title {
        font-size: $text-16;
        color: $navy_light;
        margin-bottom: $height-12;
        display: flex;
        align-items: center;
      }

      &__subtitle {
        font-size: $text-14;
        color: $origin;
      }
    }

    &__function {
      z-index: 1;
      position: absolute;
      bottom: 0;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 $width-24;
      border: 1px solid $origin_light;
      background-color: white;
    }
  }
}

.dot {
  height: 8px;
  width: 8px;
  background-color: rgb(255, 73, 73);
  border-radius: 50%;
  display: inline-block;
  margin-right: $width-12;
}
</style>

