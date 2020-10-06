/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import axios from 'axios';
import router from '../router';

// footer card banner news loading sidebar
export default {
  namespaced: true,
  state: {
    FooterView: 'home',
    CardOpen: false,
    CardName: '',
    Loading: false,
    HomeBannerDisplay: true,
    IndexBanners: [],
    IndexMarquee: [],
    IndexNews: [],
    News: [],
    AllNews: false,
    ActiveTag: 0,
  },
  mutations: {
    // footer
    setFooterView(state, view) {
      state.FooterView = view;
    },
    // card
    setCardOpen(state, value) {
      state.CardOpen = value;
      if (value === false) {
        // 刪除URL query
        const query = Object.assign({}, router.currentRoute.query);
        delete query.card;
        delete query.type;
        router.replace({ query });
        state.CardName = '';
      }
    },
    setCardName(state, payload) {
      state.CardName = payload.card;
      router.push({ path: router.history.current.fullPath, query: payload });
    },
    setLoading(state, payload) {
      state.Loading = payload;
    },
    // banner
    setHomeBannerDisplay(state, value) {
      state.HomeBannerDisplay = value;
    },
    setIndexBanners(state, payload) {
      state.IndexBanners = payload;
    },
    // news
    setIndexMarquee(state, payload) {
      state.IndexMarquee = payload;
    },
    setIndexNews(state, payload) {
      state.IndexNews = payload;
    },
    setNews(state, payload) {
      state.News = payload;
    },
    setAllNews(state, payload) {
      state.AllNews = payload;
    },
    // sidebar
    setActiveTag(state, value) {
      state.ActiveTag = value;
    },
  },
  actions: {
    // banner
    API_IndexBanner({ commit }, payload) {
      return new Promise((resolve, reject) => {
        const api = `${process.env.VUE_APP_APIHOST}/api/FrontendBanner`;
        axios.get(api, payload).then((res) => {
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
    // news
    API_IndexMarquee({ commit }, payload) {
      const api = `${process.env.VUE_APP_APIHOST}/api/FrontendNews/Marquee`;
      axios.get(api, payload).then((res) => {
        if (res.data.status === 1) {
          commit('index/setIndexMarquee', res.data.data, { root: true });
        }
      }).catch((error) => {
        console.log(error.response);
      });
    },
    API_IndexNews({ commit }, payload) {
      const api = `${process.env.VUE_APP_APIHOST}/api/FrontendNews`;
      axios.get(api, payload).then((res) => {
        if (res.data.status === 1) {
          commit('index/setIndexNews', res.data.data, { root: true });
        }
      }).catch((error) => {
        console.log(error.response);
      });
    },
    API_News({ commit }, id) {
      return new Promise((resolve, reject) => {
        const api = `${process.env.VUE_APP_APIHOST}/api/FrontendNews/${id}`;
        axios.get(api).then((res) => {
          commit('index/setNews', res.data.data, { root: true });
          resolve(res);
        }).catch((err) => {
          reject(err);
        });
      });
    },
  },
};
