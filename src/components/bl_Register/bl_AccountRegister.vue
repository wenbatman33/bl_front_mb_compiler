<template lang="pug">
  div
    el-form.accountRegister(v-if="errorTimes < 3")
      el-form-item.accountRegister__account
        el-input(placeholder="用戶名：输入 5～15 位英文或数字" v-model="memberForm.account" v-validate.continues="'account'" name="account")
        .error(v-if="errors.has('account')") {{ errors.first('account') }}
      el-form-item.accountRegister__password
        el-input(v-if="!showPassword" placeholder="密码：输入 8～20 位英文和数字" type="password" v-model="memberForm.password" v-validate.continues="'password'" name="password")
        el-input(v-else placeholder="密码：输入 8～20 位英文和数字" type="text" v-model="memberForm.password" v-validate.continues="'password'" name="password")
        i.fas.fa-eye(v-if="!showPassword" @click="showPassword = true")
        i.fas.fa-eye-slash(v-else @click="showPassword = false")
        .error(v-if="errors.has('password')") {{ errors.first('password') }}
      b-button.accountRegister__button(pill variant="betlead" @click="submit" :disabled="!memberFormValidate") 注册
      .accountRegister__notice 注册即表示您已满 18 岁，并同意倍利注册条款
      .accountRegister__remind 已经有倍利帐号？
        router-link(to="/login") 登录
    ImageVerify(v-else @VerifySuccess='VerifySuccessEvent', :verifyOK='imageVerify')
</template>

<script>
import ImageVerify from '@/components/bl_ImageVerify/bl_ImageVerify.vue';

export default {
  components: {
    ImageVerify,
  },
  data() {
    return {
      showPassword: false,
      memberForm: {
        account: '',
        password: '',
      },
      errorTimes: 0,
      imageVerify: false,
    };
  },
  methods: {
    submit() {
      const vm = this;
      const time = new Date();
      const now = time.getTime();
      const finger = window.localStorage.getItem('Finger');
      this.$store.dispatch('member/API_MemberRegister', ['account', {
        'account': this.memberForm.account,
        'password': this.memberForm.password,
        'tryTime': now,
        'rpc': `${finger}${now.toString()}`,
      }]).then((res) => {
        console.log(res);
        // 清除記錄
        vm.errorTimes = 0;
        // 登入
        this.$store.dispatch('member/API_MemberLogin', ['account', {
          'account': this.memberForm.account,
          'password': this.memberForm.password,
          'tryTime': now,
          'rpc': `${finger}${now.toString()}`,
        }]);
      }).catch((err) => {
        console.log(err.response);
        vm.$message({ message: err.response.data.message, type: 'error' });
        vm.errorTimes += 1;
      });
    },
    VerifySuccessEvent() {
      const vm = this;
      vm.imageVerify = true;
    },
  },
  computed: {
    memberFormValidate() {
      if (this.$validator.errors.items.length > 0) {
        return false;
      } else if (this.memberForm.account === '' || this.memberForm.password === '') {
        return false;
      } else {
        return true;
      };
    },
  },
  watch: {
    imageVerify(value) {
      const vm = this;
      if (value) {
        setTimeout(() => {
          vm.errorTimes = 0;
          vm.imageVerify = false;
        }, 1000);
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.accountRegister {
  /deep/ input {
    border: none;
    padding: $width-16 0;
    font-size: $text-16;
    height: auto;
    line-height: unset;
  }

  /deep/ .el-form-item__content {
    display: flex;
    align-items: center;
    width: 100%;
    line-height: unset;
  }

  &__account {
    margin-bottom: $height-40;
    border-bottom: 2px solid $origin;
  }

  &__password {
    margin-bottom: $height-48;
    border-bottom: 2px solid $origin;
    display: flex;
    justify-content: space-between;
    align-items: center;

    i {
      color: $origin_light;
      font-size: $text-16;
    }
  }

  &__button {
    width: 100%;
    padding: $width-16 0;
    margin-bottom: $height-32;
    font-size: $text-16;
    border: none;
  }

  &__notice {
    font-size: $text-12;
    color: $origin_dark;
    margin-bottom: 11vh;
  }

  &__remind {
    font-size: $text-14;
    color: $navy_dark;
    padding-bottom: 7vh;

    a {
      color: $theme;
    }
  }

  ::placeholder {
    color: $origin;
  }
}

.error {
  position: absolute;
  background-color: black;
  color: white;
  width: 100%;
  opacity: 0.7;
  padding: 8px 16px;
  border-radius: 5px;
  top: 45px;
  font-size: 14px;
  line-height: normal;
}
</style>
