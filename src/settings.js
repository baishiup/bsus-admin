// dev
const isDev = /^(192\.168|localhost)/.test(window.location.host);

export default {
  host: isDev ? 'http://localhost:7001' : 'https://api.baishiup.com',
  qiniuUrl: 'https://up-z2.qiniup.com',
  cdnUrl: 'https://cdn.baishiup.com'
};
