import axios, { AxiosError } from "axios";
import environment from "../environment";
import { message } from "antd";

// import { useHistory } from "react-router";
import history from "../routes/history";
axios.defaults.baseURL = environment.host;

axios.interceptors.request.use(req => {
  const token = window.localStorage.getItem("token") || "";
  if (req.method?.toLocaleLowerCase() !== "get") {
    req.headers.token = token;
  }

  return req;
});

axios.interceptors.response.use(
  res => {
    return res.data;
  },
  (err: AxiosError) => {
    if (err === undefined || err.code === "ECONNABORTED" || err.response === undefined) {
      message.warning("服务请求超时");
      return Promise.reject(err);
    }

    const {
      response: { status }
    } = err;

    if (status === 401) {
      message.error(err.response.data.message);
      history.push("/login");
    }
    return Promise.reject(err);
  }
);

export default axios;
