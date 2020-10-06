if (window.localStorage.LC_API_ID) {
  window.__lc = window.__lc || {};
  window.__lc.license = 11194702;
  window.__lc.visitor = { name: window.localStorage.LC_API_ID, Email: window.localStorage.LC_API_EMAIL };
} else {
  window.__lc = window.__lc || {};
  window.__lc.license = 11194702;
  window.__lc.visitor = { name: 'Guest' };
}
(function () {
  const lc = document.createElement('script'); lc.type = 'text/javascript'; lc.async = true;
  lc.src = `${document.location.protocol == 'https:' ? 'https://' : 'http://'}cdn.livechatinc.com/tracking.js`;
  const s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(lc, s);
}());

var LC_API = LC_API || {};
const livechat_chat_started = false;
LC_API.on_before_load = function () {
  LC_API.hide_chat_window();
};
