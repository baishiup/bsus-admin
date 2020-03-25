import axios, { AxiosError, AxiosResponse } from 'axios';
import environment from '../environment';
import { message } from 'antd';
import history from '../routes/history';
import { API_RESPONSE } from '../constants';
axios.defaults.baseURL = environment.host;

axios.interceptors.request.use(req => {
  const token = window.localStorage.getItem('token') || '';
  if (req.method?.toLocaleLowerCase() !== 'get') {
    req.headers.token = token;
  }

  return req;
});

axios.interceptors.response.use(
  res => {
    return res as AxiosResponse<API_RESPONSE>;
  },
  (err: AxiosError) => {
    if (err === undefined || err.code === 'ECONNABORTED' || err.response === undefined) {
      message.warning('服务请求超时');
      return Promise.reject(err);
    }

    const {
      response: { status }
    } = err;

    if (status === 401) {
      message.error(err.response.data.message);
      history.push('/login');
    }
    console.log(err.response);
    return err.response;
  }
);

export default axios;
