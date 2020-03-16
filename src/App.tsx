import React from "react";
import { ConfigProvider } from "antd";
import zh_CN from "antd/lib/locale-provider/zh_CN";
import { Router, Route, Switch } from "react-router-dom";
// import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Layout from "./components/Layout";
import login from "./views/login";
import notfound from "./views/notfound";
import routes from "./routes";

import history from "./routes/history";

function App() {
  return (
    <ConfigProvider locale={zh_CN}>
      <Router history={history}>
        <Switch>
          <Route component={login} exact path="/login" />
          <Layout>
            <Switch>
              {routes.map((x, i) => (
                <Route exact path={x.path} component={x.component} key={i} aaaname={x.name} />
              ))}
              <Route path="*" component={notfound} />
            </Switch>
          </Layout>
        </Switch>
      </Router>
    </ConfigProvider>
  );
}

export default App;
