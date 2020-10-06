<template lang="pug">
  div
    el-form.phoneRegister(v-if="errorTimes < 3")
      el-form-item.phoneRegister__phone
        el-input(type="tel" placeholder="请输入手机号" v-model.number="memberForm.phoneNumber" v-validate.continues="'phone'" name="phone")
        .error(v-if="errors.has('phone')") {{ errors.first('phone') }}
      el-form-item.phoneRegister__verifycode
        el-input(type="tel" placeholder="请输入验证码" v-model="memberForm.verifyCode")
        el-button.phoneRegister__verifycode__button(v-if="!countDownWaiting" type="text" @click="verifyCode") 发送验证码
        el-button(v-else type="text" @click="verifyCode" disabled) {{ countDown }}秒后重发
      b-button.phoneRegister__button(pill variant="betlead" @click="submit" :disabled="!memberFormValidate") 注册
      .phoneRegister__notice 注册即表示您已满 18 岁，并同意倍利注册条款
      .phoneRegister__remind 已经有倍利帐号？
        router-link(to="/login") 登录
    ImageVerify(v-else @VerifySuccess='VerifySuccessEvent', :verifyOK='imageVerify')
</template>

<script>
import axios from 'axios';
import ImageVerify from '@/components/bl_ImageVerify/bl_ImageVerify.vue';

let loop;
export default {
  components: {
    ImageVerify,
  },
  data() {
    return {
      memberForm: {
        phoneNumber: '',
        verifyCode: '',
      },
      countDownWaiting: false,
      countDown: 0,
      errorTimes: 0,
      imageVerify: false,
    };
  },
  methods: {
    verifyCode() {
      const vm = this;
      this.$validator.validate().then((result) => {
        if (result) {
          const api = `${process.env.VUE_APP_APIHOST}/api/Member/SignUpOtp`;
          const payload = {};
          payload.phone = vm.memberForm.phoneNumber;
          axios.post(api, payload).then((res) => {
            if (res.data.status === 1) {
              this.memberForm.verifyCode = res.data.data[0].otp;  // for 測試用
              const time = new Date();
              const now = time.getTime();
              const expireTime = now + (1000 * 120);
              window.localStorage.setItem('Register_phoneVerifyCode', expireTime);
              window.localStorage.setItem('Register_phone', vm.memberForm.phoneNumber);
              vm.countDownWaiting = true;
              vm.loopTime();
            }
            vm.$message({ message: res.data.data[0].otp, type: 'success' });
          }).catch((error) => {
            console.log(error.response);
            vm.$message({ message: error.response.data.message, type: 'error' });
          });
        } else {
          return;
        }
      }).catch((error) => {
        console.log(error.response);
      });
    },
    submit() {
      const vm = this;
      const time = new Date();
      const now = time.getTime();
      const finger = window.localStorage.getItem('Finger');
      this.$store.dispatch('member/API_MemberRegister', ['phone', {
        'phone': this.memberForm.phoneNumber,
        'otp': this.memberForm.verifyCode,
        'tryTime': now,
        'rpc': `${finger}${now.toString()}`,
      }]).then((res) => {
        console.log(res);
        // 清除記錄
        window.localStorage.removeItem('Register_phoneVerifyCode');
        window.localStorage.removeItem('Register_phone');
        clearInterval(loop);
        vm.errorTimes = 0;
        // 先拿登入驗證碼
        const api = `${process.env.VUE_APP_APIHOST}/api/Member/LoginOtp`;
        const payload = {};
        payload.phone = this.memberForm.phoneNumber;
        axios.post(api, payload).then((result) => {
          payload.otp = result.data.data[0].otp;
          payload.tryTime = now;
          payload.rpc = `${finger}${now.toString()}`;
          // 登入
          this.$store.dispatch('member/API_MemberLogin', ['phone', payload]).then((res) => {
            console.log(res);
          }).catch((err) => {
            vm.$message({ message: err.response.data.message, type: 'error' });
          });
        });
      }).catch((error) => {
        console.log(error.response);
        if (this.memberForm.verifyCode.length !== 6) {
          vm.$message({ message: '错误的验证码', type: 'error' });
        } else {
          vm.$message({ message: error.response.data.message, type: 'error' });
        }
        vm.errorTimes += 1;
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
          clearInterval(loop);
        }
      }, 1000);
    },
    VerifySuccessEvent() {
      const vm = this;
      vm.imageVerify = true;
    },
  },
  computed: {
    memberFormValidate() {
      if (this.$validator.errors.items.length > 0 || this.memberForm.verifyCode === '') {
        return false;
      } else if (this.memberForm.phoneNumber === '' || this.memberForm.verifyCode === '') {
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
  created() {
    clearInterval(loop);
  },
  beforeDestroy() {
    clearInterval(loop);
  },
  mounted() {
    const vm = this;
    const now = new Date().getTime();
    const expireTime = window.localStorage.getItem('Register_phoneVerifyCode');
    const checkTime = Math.floor((expireTime - now) / 1000);
    if (checkTime > 0) {
      vm.loopTime(checkTime);
    } else {
      vm.countDownWaiting = false;
      window.localStorage.removeItem('Register_phoneVerifyCode');
      window.localStorage.removeItem('Register_phone');
    }
    if (window.localStorage.getItem('Register_phone')) {
      vm.memberForm.phoneNumber = window.localStorage.getItem('Register_phone');
    }
  }
};
</script>

<style lang="scss" scoped>
.phoneRegister {
  /deep/ input {
    border: none;
    padding: $width-16 0;
    font-size: $text-16;
    height: auto;
    line-height: unset;
  }

  /deep/ .el-form-item__content {
    line-height: unset;
    display: flex;
    width: 100%;
  }

  &__phone {
    margin-bottom: $height-40;
    border-bottom: 2px solid $origin;
  }

  &__verifycode {
    margin-bottom: $height-48;
    border-bottom: 2px solid $origin;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &__button {
      color: $theme;
    }

    button {
      font-size: $text-14;
    }
  }

  &__button {
    width: 100%;
    padding: $width-16 0;
    font-size: $text-16;
    margin-bottom: $height-32;
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
