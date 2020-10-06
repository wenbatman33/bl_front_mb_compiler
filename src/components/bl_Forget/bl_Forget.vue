<template lang="pug">
  .forget
    .forget__header(:style="{ backgroundImage: 'url(' + bgImage + ')' }")
      router-link(to="/login")
        i.el-icon-close
      p 忘记密码
    .forget__main(v-if="step === 1")
      .forget__main__title STEP1 验证信息
      el-input.forget__main__input(placeholder="请输入手机或邮箱" v-model.trim="form.otpTarget")
      b-button.forget__main__button(pill @click="getOtp" :disabled="form.otpTarget === ''") 下一步
        //- .error(v-if="errors.has('phone')") {{ errors.first('phone') }}
    .forget__main(v-else-if="step === 2")
      .forget__main__title STEP2 身份验证
      .forget__main__remind 已发送验证码至手机 {{ form.otpTarget }}
      .forget__main__input
        el-input(type="tel" placeholder="请输入验证码" v-model.trim="form.otp")
        el-button.theme__button(v-if="!countDownWaiting" type="text" @click="getOtp") 发送验证码
        el-button(v-else type="text" disabled) {{ countDown }}秒后重发
      b-button.forget__main__button(pill @click="verifyCode" :disabled="form.otp === ''") 下一步
        //- .error(v-if="errors.has('phone')") {{ errors.first('phone') }}
    .forget__main(v-else)
      .forget__main__title STEP3 重置密码
      .forget__main__input
        el-input(:type="showPassword ? 'text' : 'password'" placeholder="请输入新密码" v-model.trim="submitForm.newPassword")
        i.fas.fa-eye(v-if="!showPassword" @click="showPassword = true")
        i.fas.fa-eye-slash(v-else @click="showPassword = false")
      .forget__main__input
        el-input(:type="showPassword1 ? 'text' : 'password'" placeholder="再次确认密码" v-model.trim="submitForm.checkPassword")
        i.fas.fa-eye(v-if="!showPassword1" @click="showPassword1 = true")
        i.fas.fa-eye-slash(v-else @click="showPassword1 = false")
      b-button.forget__main__button(pill @click="submit" :disabled="submitForm.newPassword === '' || submitForm.checkPassword === ''") 提交
</template>

<script>
let loop;
export default {
  data() {
    return {
      bgImage: `${process.env.VUE_APP_IMG}/static/img/bluebg.png`,
      step: 1,
      showPassword: false,
      showPassword1: false,
      form: {
        otpTarget: '',
        otp: ''
      },
      submitForm: {
        otpTarget: '',
        otpCert: '',
        newPassword: '',
        checkPassword: '',
      },
      countDownWaiting: false,
      countDown: 0,
    };
  },
  methods: {
    getOtp() {
      this.$store.dispatch('member/API_ForgetPassOtp', this.form).then((res) => {
        console.log(res);
        if (res.status === 200 && res.data.status === 1) {
          const time = new Date();
          const now = time.getTime();
          const expireTime = now + (1000 * 120);
          window.localStorage.setItem('Forget_accountCode', expireTime);
          window.localStorage.setItem('Forget_account', this.form.otpTarget);
          this.countDownWaiting = true;
          this.loopTime();
          this.step = 2;
          this.$message({ message: res.data.data[0].otp, type: 'success' });
        }
      }).catch((err) => {
        this.$message({ message: err.response.data.message, type: 'error' });
      })
    },
    verifyCode() {
      this.$store.dispatch('member/API_ForgetPassCert', this.form).then((res) => {
        if (res.status === 200 && res.data.status === 1) {
          this.$message({ message: res.data.data[0].otp, type: 'success' });
          this.submitForm.otpTarget = this.form.otpTarget;
          this.submitForm.otpCert = res.data.data[0].otpCert;
          this.step = 3;
        }
      }).catch((err) => {
        console.log(err.response);
      })
    },
    submit() {
      this.$store.dispatch('member/API_ForgetPassChange', this.submitForm).then((res) => {
        if (res.status === 200 && res.data.status === 1) {
          this.$message({ message: '修改成功', type: 'success' });
          this.$router.push('/login');
        }
      });
    },
    loopTime(checktime = 120) {
      const vm = this;
      vm.countDown = checktime;
      vm.countDownWaiting = true;
      loop = setInterval(() => {
        vm.countDown -= 1;
        if (vm.countDown <= 0) {
          vm.countDownWaiting = false;
          window.localStorage.removeItem('Forget_account');
          clearInterval(loop);
        }
      }, 1000);
    },
  },
  created() {
    clearInterval(loop);
  },
  beforeDestroy() {
    clearInterval(loop);
  },
  mounted() {
    const vm = this;
    const now = new Date().getTime();
    const expireTime = window.localStorage.getItem('Forget_accountCode');
    const checkTime = Math.floor((expireTime - now) / 1000);
    if (checkTime > 0) {
      vm.loopTime(checkTime);
    } else {
      vm.countDownWaiting = false;
      window.localStorage.removeItem('Forget_account');
      window.localStorage.removeItem('Forget_accountCode');
    }
  }
}
</script>

<style lang="scss" scoped>
.forget {
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
      font-size: 8.4vw;
    }

    p {
      margin: 0;
    }
  }

  &__main {
    flex: 1;
    padding: $height-40 $width-28 0;
    text-align: center;

    &__title {
      font-size: $text-20;
      font-weight: 900;
      color: $navy_dark;
    }

    &__remind {
      margin-top: $height-24;
      color: $origin_dark;
      font-size: $text-16;
    }

    &__input {
      margin-top: $height-48;
      margin-bottom: $height-40;
      border-bottom: 2px solid $origin;
      display: flex;
      justify-content: space-between;
      align-items: center;

      ::placeholder {
        color: $origin;
      }

      .theme__button {
        color: $theme;
      }

      i {
        color: $origin_light;
      }
    }

    /deep/ input {
      border: none;
      padding: $width-16 0;
      font-size: $text-16;
      height: auto;
      line-height: unset;
      background: none;
    }

    &__button {
      width: 100%;
      padding: $width-16 0;
      margin-bottom: $height-32;
      font-size: $text-16;
      background-color: $theme;
      border: none;
    }
  }

  &__password {
    margin-bottom: $height-48;
    border-bottom: 2px solid white;
    display: flex;
    justify-content: space-between;
    align-items: center;

    i {
      color: white;
      font-size: $text-16;
    }
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
