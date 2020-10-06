/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import axios from 'axios';
import { MessageBox, Message } from 'element-ui';
import router from '../router';

export default {
  namespaced: true,
  state: {
    // default = 0, search =1, filter = 2
    GamePageType: 0,
    IndexGameTypeData: [],
    IndexGameTagList: [],
    IndexNewGameList: [],
    IndexHotGameList: [],
    IndexHavePlayGameList: [],
    IndexLikeGameList: [],
    // 遊戲類別
    GameType: {},
  },
  getters: {
    GameGroup(state) {
      return state.GameType.gameGroups;
    },
  },
  mutations: {
    setGamePageType(state, payload) {
      state.GamePageType = payload;
    },
    setIndexGameTypeData(state, payload) {
      state.IndexGameTypeData = payload;
    },
    setIndexGameTagList(state, payload) {
      state.IndexGameTagList = payload;
    },
    setIndexNewGameList(state, payload) {
      state.IndexNewGameList = payload;
    },
    setIndexHotGameList(state, payload) {
      state.IndexHotGameList = payload;
    },
    setIndexHavePlayGameList(state, payload) {
      state.IndexHavePlayGameList = payload;
    },
    setIndexLikeGameList(state, payload) {
      state.IndexLikeGameList = payload;
    },
    setGameType(state, payload) {
      state.GameType = payload;
    },
  },
  actions: {
    API_GameLogin({ commit }, payload) {
      const api = `${process.env.VUE_APP_GAMEHOST}/api/Game/login`;
      axios.get(api, payload).then((res) => {
        // 需要跳出確認視窗
        if (res.data.data[0].openConfirm === 1) {
          this.dispatch('games/GameLoginConfirm', payload);
          // openmode = 1 開啟 iframe
        } else if (res.data.data[0].gameOpenMode === 1) {
          router.push({ name: 'bet', query: { path: res.data.data[0].launchGameUrl } });
          // openmode = 2 另開視窗
        } else if (res.data.data[0].gameOpenMode === 2) {
          window.open(res.data.data[0].launchGameUrl);
        }
      }).catch((err) => {
        console.log(err.response);
        Message({ message: err.response.data.message, type: 'error' });
      });
    },
    GameLoginConfirm({ commit }, payload) {
      MessageBox.confirm('是否要先进行存款再进入游戏，记得存款入帐后请重新进入游戏唷', '贴心小提醒', {
        distinguishCancelAndClose: true,
        confirmButtonText: '进游戏',
        cancelButtonText: '先存款',
        center: true,
      }).then(() => {
        // 进游戏 => 強制登入
        payload.params.force_login = 1;
        this.dispatch('games/API_GameLogin', payload);
      }).catch((action) => {
        // 先存款 => 前往存款卡片
        if (action === 'cancel') {
          router.push({
            path: router.history.current.fullPath,
            query: {
              card: 'bl_Transaction',
              type: 'deposit',
            },
          });
        }
      });
    },
    // 回收錢包錢
    API_RecyclingAllWallet({ commit }) {
      return new Promise((resolve, reject) => {
        const api = `${process.env.VUE_APP_APIHOST}/api/GameWallet/RecyclingAllWallet`;
        axios.get(api).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    // 遊戲類別與廠商入口
    API_IndexGameTypeData({ commit }) {
      return new Promise((resolve, reject) => {
        const api = `${process.env.VUE_APP_APIHOST}/api/GameType/GetGameTypeData`;
        axios.get(api).then((res) => {
          commit('games/setIndexGameTypeData', res.data.data, { root: true });
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    // 遊戲標籤
    API_IndexGameTagList({ commit }) {
      return new Promise((resolve, reject) => {
        const api = `${process.env.VUE_APP_APIHOST}/api/GameTagList/GetGameTagList`;
        axios.get(api).then((res) => {
          commit('games/setIndexGameTagList', res.data.data, { root: true });
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    // 最新遊戲
    API_IndexNewGameList({ commit }, payload) {
      return new Promise((resolve, reject) => {
        const api = `${process.env.VUE_APP_APIHOST}/api/GameList/GetNewGameList`;
        axios.get(api, payload).then((res) => {
          commit('games/setIndexNewGameList', res.data.data, { root: true });
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    // 熱門推薦遊戲
    API_IndexHotGameList({ commit }, payload) {
      return new Promise((resolve, reject) => {
        const api = `${process.env.VUE_APP_APIHOST}/api/GameList/GetHotGameList`;
        axios.get(api, payload).then((res) => {
          commit('games/setIndexHotGameList', res.data.data, { root: true });
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    // 曾經玩過的遊戲
    API_IndexHavePlayGameList({ commit }, payload) {
      return new Promise((resolve, reject) => {
        const api = `${process.env.VUE_APP_APIHOST}/api/GameList/GetHavePlayGameList`;
        axios.get(api, payload).then((res) => {
          commit('games/setIndexHavePlayGameList', res.data.data, { root: true });
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    // 我的最愛
    API_IndexLikeGameList({ commit }, payload) {
      return new Promise((resolve, reject) => {
        const api = `${process.env.VUE_APP_APIHOST}/api/GameList/GetLikeGameList`;
        axios.get(api, payload).then((res) => {
          commit('games/setIndexLikeGameList', res.data.data, { root: true });
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    API_AddGameLikeRecord({ commit }, payload) {
      return new Promise((resolve, reject) => {
        const api = `${process.env.VUE_APP_APIHOST}/api/GameLikeRecord`;
        axios.post(api, payload).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    API_DeleteGameLikeRecord({ commit }, gameId) {
      return new Promise((resolve, reject) => {
        const api = `${process.env.VUE_APP_APIHOST}/api/GameLikeRecord/${gameId}`;
        axios.delete(api).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
  },
};
