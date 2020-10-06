/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import axios from 'axios';
import md5 from 'js-md5';
import router from '../router';

// register login logout memberDetail bankCard
export default {
  namespaced: true,
  state: {
    RegisterSuccess: '',
    TempAccount: {},
    ActivePersonal: '',
    ActiveSecurity: -1,
    ActiveInbox: -1,
    IndexPersonal: {
      memberGender: {
        display: '',
      },
    },
    IndexDetail: {},
    IndexBankList: [],
    IndexBankCard: [],
    IndexProvinceList: null,
    IndexProfile: {},
    BettingLogDetail: {},
  },
  getters: {
    filterBankCard(state) {
      const temp = [];
      state.IndexBankCard.forEach((card) => {
        const result = state.IndexBankList.filter(item => item.bankCode === card.memberBankCode)[0];
        Object.assign(result, { id: card.id, no: card.memberBankNo });
        temp.push(result);
      });
      return temp;
    },
    defaultBankCard(state) {
      const result = state.IndexBankCard.filter(item => item.memberDefaultCard.value === 1);
      return result[0];
    },
  },
  mutations: {
    setRegisterSuccess(state, value) {
      state.RegisterSuccess = value;
    },
    setTempAccount(state, payload) {
      state.TempAccount = payload;
    },
    setActivePersonal(state, value) {
      state.ActivePersonal = value;
    },
    setActiveSecurity(state, value) {
      state.ActivePersonal = value;
    },
    setActiveInbox(state, id) {
      state.ActiveInbox = id;
    },
    setIndexPersonal(state, payload) {
      state.IndexPersonal = payload;
    },
    setIndexDetail(state, payload) {
      state.IndexDetail = payload;
      window.localStorage.setItem('LC_API_ID', payload.account);
      window.localStorage.setItem('LC_API_EMAIL', payload.email);
    },
    setIndexBankList(state, payload) {
      state.IndexBankList = payload;
    },
    setIndexBankCard(state, payload) {
      state.IndexBankCard = payload;
    },
    setIndexProvinceList(state, payload) {
      state.IndexProvinceList = payload;
    },
    setIndexProfile(state, payload) {
      state.IndexProfile = payload;
    },
    setBettingLogDetail(state, payload) {
      state.BettingLogDetail = payload;
    },
  },
  actions: {
    // 註冊
    API_MemberRegister({ commit }, payload) {
      return new Promise((resolve, reject) => {
        if (payload[0] === 'account') {
          const [, memberform] = payload;
          memberform.rpc = md5(memberform.rpc);
          const api = `${process.env.VUE_APP_APIHOST}/api/Member/SignUp`;
          axios.post(api, memberform).then((res) => {
            if (res.data.status === 1) {
              commit('member/setRegisterSuccess', 'account', { root: true });
              resolve(res);
            }
          }).catch((error) => {
            reject(error);
          });
        } else if (payload[0] === 'phone') {
          const [, memberform] = payload;
          memberform.rpc = md5(memberform.rpc);
          const api = `${process.env.VUE_APP_APIHOST}/api/Member/PhoneSignUp`;
          axios.post(api, memberform).then((res) => {
            if (res.data.status === 1) {
              commit('member/setRegisterSuccess', 'phone', { root: true });
              commit('member/setTempAccount', {
                account: res.data.data[0].account,
                password: res.data.data[0].password,
              }, { root: true });
              resolve(res);
            }
          }).catch((error) => {
            reject(error);
          });
        }
      });
    },
    // 登入
    API_MemberLogin({ commit }, payload) {
      return new Promise((resolve, reject) => {
        if (payload[0] === 'account') {
          const [, memberform] = payload;
          memberform.rpc = md5(memberform.rpc);
          const api = `${process.env.VUE_APP_APIHOST}/api/Member/Login`;
          axios.post(api, memberform).then((res) => {
            if (res.data.status === 1) {
              window.localStorage.setItem('LC_API_ID', res.data.data[0].account);
              window.localStorage.setItem('LC_API_EMAIL', res.data.data[0].email);
              commit('index/setHomeBannerDisplay', true, { root: true });
              resolve(res);
            }
          }).catch((error) => {
            reject(error);
          });
        } else if (payload[0] === 'phone') {
          const [, memberform] = payload;
          memberform.rpc = md5(memberform.rpc);
          const api = `${process.env.VUE_APP_APIHOST}/api/Member/PhoneLogin`;
          axios.post(api, memberform).then((res) => {
            if (res.data.status === 1) {
              window.localStorage.setItem('LC_API_ID', res.data.status[0].account);
              window.localStorage.setItem('LC_API_EMAIL', res.data.status[0].email);
              commit('index/setHomeBannerDisplay', true, { root: true });
              resolve(res);
            }
          }).catch((error) => {
            reject(error);
          });
        }
      });
    },
    // 登出
    API_MemberLogout({ commit }) {
      const api = `${process.env.VUE_APP_APIHOST}/api/Member/Logout`;
      axios.get(api).then((res) => {
        if (res.data.status === 1) {
          window.localStorage.removeItem('JWT_TOKEN');
          window.localStorage.removeItem('LC_API_ID');
          window.localStorage.removeItem('LC_API_EMAIL');
          commit('index/setFooterView', 'home', { root: true });
          router.push('/');
        }
      }).catch((err) => {
        console.log(err.response);
      });
    },
    // 忘記密碼
    API_ForgetPassOtp({ commit }, payload) {
      return new Promise((resolve, reject) => {
        const api = `${process.env.VUE_APP_APIHOST}/api/Member/ForgetPassOtp`;
        axios.post(api, payload).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    API_ForgetPassCert({ commit }, payload) {
      return new Promise((resolve, reject) => {
        const api = `${process.env.VUE_APP_APIHOST}/api/Member/ForgetPassCert`;
        axios.post(api, payload).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    API_ForgetPassChange({ commit }, payload) {
      return new Promise((resolve, reject) => {
        const api = `${process.env.VUE_APP_APIHOST}/api/Member/ForgetPassChange`;
        axios.post(api, payload).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    // 我的
    API_MemberProfile({ commit }) {
      return new Promise((resolve, reject) => {
        const api = `${process.env.VUE_APP_APIHOST}/api/Member/Profile`;
        axios.get(api).then((res) => {
          commit('member/setIndexProfile', res.data.data[0], { root: true });
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    // 偏好設定
    API_MemberNotice({ commit }) {
      return new Promise((resolve, reject) => {
        const api = `${process.env.VUE_APP_APIHOST}/api/Member/Notice`;
        axios.get(api).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    API_MemberAddNotice({ commit }, payload) {
      return new Promise((resolve, reject) => {
        const api = `${process.env.VUE_APP_APIHOST}/api/Member/Notice`;
        axios.post(api, payload).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    API_MemberModifyNotice({ commit }, payload) {
      return new Promise((resolve, reject) => {
        const api = `${process.env.VUE_APP_APIHOST}/api/Member/Notice/${payload.id}`;
        axios.patch(api, payload).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    // 我的消息
    API_MemberInbox({ commit }, payload) {
      return new Promise((resolve, reject) => {
        const api = `${process.env.VUE_APP_APIHOST}/api/Member/Inbox`;
        axios.get(api, payload).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    API_MemberModifyInbox({ commit }, payload) {
      return new Promise((resolve, reject) => {
        const api = `${process.env.VUE_APP_APIHOST}/api/Member/Inbox/${payload.id}`;
        axios.patch(api, payload).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    // 個人資料
    API_MemberPersonal({ commit }) {
      return new Promise((resolve, reject) => {
        const api = `${process.env.VUE_APP_APIHOST}/api/Member/Personal`;
        axios.get(api).then((res) => {
          commit('member/setIndexPersonal', res.data.data[0], { root: true });
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    API_MemberAddPersonal({ commit }, payload) {
      return new Promise((resolve, reject) => {
        const api = `${process.env.VUE_APP_APIHOST}/api/Member/Personal`;
        axios.post(api, payload).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    API_MemberModifyPersonal({ commit }, payload) {
      return new Promise((resolve, reject) => {
        const api = `${process.env.VUE_APP_APIHOST}/api/Member/Personal/DataPatch`;
        axios.post(api, payload).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    API_IndexAddress({ commit }, payload) {
      return new Promise((resolve, reject) => {
        const api = `${process.env.VUE_APP_APIHOST}/api/Member/Personal/Address`;
        axios.get(api, payload).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    // 投注記錄
    API_GameGroup({ commit }, payload) {
      return new Promise((resolve, reject) => {
        const api = `${process.env.VUE_APP_APIHOST}/api/Member/Bet/GameGroup`;
        axios.get(api, payload).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    API_IndexMemberBetList({ commit }, payload) {
      return new Promise((resolve, reject) => {
        const api = `${process.env.VUE_APP_APIHOST}/api/Member/Bet`;
        axios.get(api, payload).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    API_MemberBetShow({ commit }, payload) {
      return new Promise((resolve, reject) => {
        const api = `${process.env.VUE_APP_APIHOST}/api/Member/Bet/Show`;
        axios.get(api, payload).then((res) => {
          commit('member/setBettingLogDetail', res.data.data[0], { root: true });
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    // 安全中心
    API_MemberDetail({ commit }) {
      return new Promise((resolve, reject) => {
        const api = `${process.env.VUE_APP_APIHOST}/api/Member/Detail`;
        axios.get(api).then((res) => {
          commit('member/setIndexDetail', res.data.data[0], { root: true });
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    // 手機驗證
    API_MemberChangePhoneOtp({ commit }, payload) {
      return new Promise((resolve, reject) => {
        const api = `${process.env.VUE_APP_APIHOST}/api/Member/ChangePhoneOtp`;
        axios.post(api, payload).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    API_MemberChangePhone({ commit }, payload) {
      return new Promise((resolve, reject) => {
        const api = `${process.env.VUE_APP_APIHOST}/api/Member/ChangePhone`;
        axios.post(api, payload).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    // 郵箱驗證
    API_MemberChangeEmailOtp({ commit }, payload) {
      return new Promise((resolve, reject) => {
        const api = `${process.env.VUE_APP_APIHOST}/api/Member/ChangeEmailOtp`;
        axios.post(api, payload).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    API_MemberChangeEmail({ commit }, payload) {
      return new Promise((resolve, reject) => {
        const api = `${process.env.VUE_APP_APIHOST}/api/Member/ChangeEmail`;
        axios.post(api, payload).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    // 密碼管理
    API_MemberChangePassword({ commit }, payload) {
      return new Promise((resolve, reject) => {
        const api = `${process.env.VUE_APP_APIHOST}/api/Member/ChangePassword`;
        axios.post(api, payload).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    // 帳號管理
    API_MemberChangeAccount({ commit }, payload) {
      return new Promise((resolve, reject) => {
        const api = `${process.env.VUE_APP_APIHOST}/api/Member/ChangeAccount`;
        axios.post(api, payload).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    // 銀行卡管理
    API_MemberBankList({ commit }) {
      return new Promise((resolve, reject) => {
        const api = `${process.env.VUE_APP_APIHOST}/api/BankCode/MappingList`;
        axios.get(api).then((res) => {
          commit('member/setIndexBankList', res.data.data, { root: true });
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    API_MemberBankCard({ commit }) {
      return new Promise((resolve, reject) => {
        const api = `${process.env.VUE_APP_APIHOST}/api/Member/BankCard`;
        axios.get(api).then((res) => {
          commit('member/setIndexBankCard', res.data.data, { root: true });
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    API_MemberAddBankCard({ commit }, payload) {
      return new Promise((resolve, reject) => {
        const api = `${process.env.VUE_APP_APIHOST}/api/Member/BankCard`;
        axios.post(api, payload).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    API_MemberModifyBankCard({ commit }, payload) {
      return new Promise((resolve, reject) => {
        const api = `${process.env.VUE_APP_APIHOST}/api/Member/BankCard/${payload.id}`;
        axios.patch(api, payload).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    // 銀行對照表
    API_ProvinceList({ commit }) {
      axios.get('/static/city.json').then((res) => {
        commit('member/setIndexProvinceList', res.data, { root: true });
      }).catch((err) => {
        console.log(err.response);
      });
    },
  },
};
