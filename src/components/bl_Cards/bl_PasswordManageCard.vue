<template lang="pug">
  .passwordManage
    .passwordManage__header 密码管理
      i.fas.i.fa.fa-headphones(onclick="LC_API.open_chat_window()")
    el-form.passwordManage__main
      .passwordManage__main__remind 确保您的资金安全，邮箱将是客服确认身份的重要凭证。
      el-form-item
        el-input.passwordManage__main__input(v-model="passwordManageForm.password" placeholder="当前密码" type="password")
        .d-flex.justify-content-center
          .error(v-show="!checkNewPassword") 两次输入的新密码不一致
      el-form-item
        el-input.passwordManage__main__input(v-model="passwordManageForm.newPassword" placeholder="新密码" type="password")
      el-form-item
        el-input.passwordManage__main__input(v-model="passwordManageForm.checkPassword" placeholder="确认密码" type="password")
    el-button.passwordManage__button(type="text" @click="submit" :disabled="!passwordManageValidate") 提交绑定
</template>

<script>
export default {
  data() {
    return {
      passwordManageForm: {
        password: '',
        newPassword: '',
        checkPassword: '',
      }
    };
  },
  methods: {
    submit() {
      this.$store.dispatch('member/API_MemberChangePassword', this.passwordManageForm).then((res) => {
        console.log(res);
        if (res.status === 200 && res.data.status === 1) {
          this.passwordManageForm.password = '';
          this.passwordManageForm.newPassword = '';
          this.passwordManageForm.checkPassword = '';
          this.$store.commit('index/setCardOpen', false);
          this.$message({ message: '密碼更新成功', type: 'success' });
        } else {
          this.$message({ message: res.message, type: 'error' });
        }
      }).catch((err) => {
        console.log(err);
      });
    },
  },
  computed: {
    checkNewPassword() {
      if (this.passwordManageForm.newPassword !== this.passwordManageForm.checkPassword) {
        return false;
      } else {
        return true;
      }
    },
    passwordManageValidate() {
      if (this.passwordManageForm.password === '' || this.passwordManageForm.newPassword === '' || this.passwordManageForm.checkPassword === '') {
        return false;
      } else if (!this.checkNewPassword) {
        return false;
      } else {
        return true;
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.passwordManage {

  /deep/ .el-form-item {
    margin: 0;
  }

  &__header {
    font-size: $text-20;
    font-weight: bold;
    color: $card-title;
    padding: $width-24 0;
    border-bottom: 1px solid $origin-light;
    display: flex;
    justify-content: center;
    align-items: center;

    i {
      position: absolute;
      right: $width-24;
      color: $origin;
    }
  }

  &__main {
    padding: $width-28 $width-24 0;

    &__remind {
      font-size: $text-16;
      color: $origin_darkest;
      margin-bottom: $height-40;
    }

    &__input {
      color: $origin;
      border: 1px solid $origin;
      border-radius: 4px;
      margin-bottom: $height-40;
      font-size: $text-16;

      /deep/ input {
        border: none;
      }

      ::placeholder {
        color: $origin;
      }
    }

    &__verifyBtn {
      position: absolute;
      right: $width-12;
      color: $theme;
      font-size: $text-14;
    }
  }

  &__button {
    width: 100%;
    display: block;
    text-align: center;
    padding: $width-20 0;
    background-color: $theme;
    color: white;
    position: absolute;
    bottom: 0;
    font-size: $text-20;
    text-decoration: none;
  }
}

.error {
  position: absolute;
  background-color: black;
  color: white;
  opacity: 0.7;
  padding: 8px 16px;
  border-radius: 5px;
  top: -15px;
  font-size: 14px;
  line-height: normal;
}

/deep/ .el-button {
  border-radius: 0px;
}

/deep/ .is-disabled {
  background-color: $origin_dark !important;
  color: white !important;
}
</style>
