import React, { useState, Props } from 'react';

import { Layout, Menu } from 'antd';
import { Link } from 'react-router-dom';
import routes from '../../routes';
import './index.less';

const { Header, Content, Sider } = Layout;

interface LayoutProps extends Props<any> {}

const MyLayout = (props: LayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }} id="Layout">
      <Header className="header">
        <div className="logo" />
      </Header>
      <Layout>
        <Sider width={200} collapsible collapsed={collapsed} onCollapse={_ => setCollapsed(!collapsed)}>
          <Menu mode="inline" defaultSelectedKeys={['0']} style={{ height: '100%', borderRight: 0 }}>
            {routes
              .filter(x => !x.invisibleMenu)
              .map((x, i) => (
                <Menu.Item key={i}>
                  <Link to={x.path}>
                    <x.icon></x.icon>
                    <span style={{ marginLeft: '10px' }}>{x.name}</span>
                  </Link>
                </Menu.Item>
              ))}
          </Menu>
        </Sider>
        <Layout style={{ padding: '24px 24px 24px' }}>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280
            }}
          >
            {props.children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MyLayout;
