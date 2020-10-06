import Vue from 'vue';
import VeeValidate, { Validator } from 'vee-validate';

Vue.use(VeeValidate, { fieldsBagName: 'vee-fields' });

Validator.extend('account', {
  getMessage: '请输入 5～15 位半型英文/数字/下划线',
  validate: value => /^[a-zA-Z0-9_]{5,16}$/.test(value),
});

Validator.extend('password', {
  getMessage: '请输入正确的密码：8～20位半形英文/数字',
  validate: value => /^[a-zA-Z0-9]{8,20}$/.test(value),
});

Validator.extend('phone', {
  getMessage: '请填写正确手机格式',
  validate: value => /^((13|14|15|16|18|19)\d{9}){1}$/.test(value),
});

Validator.extend('number', {
  getMessage: '請輸入數字',
  validate: value => /^([0-9]+)$/.test(value),
});

Validator.extend('EmailV', {
  getMessage: '请输入正确的邮箱',
  validate: value => /^[a-z0-9.\-_]+@[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(value),
});
