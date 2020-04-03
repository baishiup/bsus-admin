import React, { useEffect, useState } from 'react';
import { Menu, Spin, Input, Form, Button, message } from 'antd';
import { ClickParam } from 'antd/lib/menu';
import axios from '../../helpers/Axios';
import UploadBox from '../../components/UploadBox';

import './index.less';
import { API_STATUS } from '../../constants';

export default () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    getSetting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  async function getSetting() {
    setLoading(true);
    const res = await axios.get('/setting');
    setLoading(false);

    form.setFieldsValue({
      sitename: res.data.map.sitename,
      keywords: res.data.map.keywords,
      avatar: res.data.map.avatar,
      description: res.data.map.description
    });
  }
  function handleMenu(param: ClickParam) {
    // TODO
    console.log(param);
  }
  async function handleSubmit(value: any) {
    const req = {
      sitename: value.sitename,
      keywords: value.keywords,
      avatar: value.avatar,
      description: value.description
    };
    setLoadingSubmit(true);

    const res = await axios.put('/setting', req);
    setLoadingSubmit(false);

    if (res.data.status === API_STATUS.SUCCESS) {
      message.success(res.data.message);
    } else {
      message.error(res.data.message);
    }
  }
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 16 }
  };
  return (
    <Spin spinning={loading}>
      <Menu onClick={handleMenu} defaultSelectedKeys={['1']} mode="horizontal">
        <Menu.Item key="1">基本设置</Menu.Item>
      </Menu>
      <div className="content">
        <Form form={form} {...layout} onFinish={handleSubmit}>
          <Form.Item label="头像" name="avatar">
            <UploadBox value="" onChange={e => form.setFieldsValue({ avatar: e })}></UploadBox>
          </Form.Item>
          <Form.Item label="站点名称" name="sitename">
            <Input placeholder="输入站点名称" />
          </Form.Item>
          <Form.Item label="关键字" name="keywords">
            <Input placeholder="关键字(英文逗号隔开)" />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <Input placeholder="输入描述" />
          </Form.Item>
        </Form>
        <Button key="submit" type="primary" loading={loadingSubmit} onClick={_ => form.submit()}>
          保存
        </Button>
      </div>
    </Spin>
  );
};
