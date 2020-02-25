import axios from 'axios';
import settings from '../settings';

axios.defaults.baseURL = settings.host;

axios.interceptors.request.use(req => {
  if (req.method.toLowerCase() !== 'get') {
    req.headers['token'] = window.localStorage.getItem('token');
  }
  return req;
});

axios.interceptors.response.use(
  res => {
    return res.data;
  },
  err => {
    console.log(err.response);
    return err.response.data;
  }
);

export default axios;
