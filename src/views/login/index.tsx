import { useState, Props } from "react";
import React from "react";
import { Form, Input, Button, message } from "antd";
import "./index.less";
import Axios from "../../helpers/Axios";
import { API_STATUS } from "../../constants";
import { RouteChildrenProps } from "react-router-dom";
import { AxiosResponse } from "axios";

interface LoginProps extends RouteChildrenProps, Props<any> {}

const Login = (props: LoginProps) => {
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();

  async function dologin() {
    const req = {
      username,
      password
    };
    const res = (await Axios.get("/login", { params: req })) as AxiosResponse["data"];

    if (res.status === API_STATUS.SUCCESS) {
      window.localStorage.setItem("token", res.result.data.token);
      props.history.push("/");
    } else {
      message.error(res.message);
    }
  }
  return (
    <div id="Login">
      <Form className="login-box" name="basic">
        <Form.Item label="账号" name="username" rules={[{ required: true, message: "Please input your username!" }]}>
          <Input value={username} onChange={e => setUsername(e.target.value)} />
        </Form.Item>

        <Form.Item label="密码" name="password" rules={[{ required: true, message: "Please input your password!" }]}>
          <Input.Password value={password} onChange={e => setPassword(e.target.value)} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" onClick={dologin}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
