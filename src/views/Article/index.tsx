import React, { useState, useEffect } from 'react';
import { Spin, PageHeader, Table, message, Button, Divider, Popconfirm } from 'antd';

import { ReloadOutlined } from '@ant-design/icons';
import Axios, { AxiosResponse } from 'axios';
import { API_STATUS } from '../../constants';
import { RouteChildrenProps } from 'react-router-dom';
import { ColumnsType } from 'antd/lib/table';

const Article = (props: RouteChildrenProps) => {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  // created
  useEffect(() => {
    getData();
  }, []);

  // 分页
  async function getData() {
    setLoading(true);
    const res = (await Axios.get('/article')) as AxiosResponse['data'];
    setLoading(false);

    if (res.status === API_STATUS.SUCCESS) {
      setDataSource(res.result.data);
    } else {
      message.error(res.message);
    }
  }

  function handleAdd() {
    props.history.push('/writing');
  }

  function handleEdit(id: string) {
    props.history.push('/writing?id=' + id);
  }
  async function handleDelete(id: string) {
    const res = (await Axios.delete('/category/' + id)) as AxiosResponse['data'];
    if (res.status === API_STATUS.SUCCESS) {
      message.success(res.message);
    } else {
      message.error(res.message);
    }
  }

  const columns: ColumnsType<any> = [
    {
      title: '标题',
      dataIndex: 'title'
    },
    {
      title: '描述',
      dataIndex: 'description'
    },
    {
      title: '分类',
      align: 'center',

      render: (row: any) => <span>{row.category ? row.category.name : ''}</span>
    },
    {
      title: '操作',
      align: 'center',
      render: (row: any) => [
        <Button type="link" key="1" onClick={_ => handleEdit(row.id)}>
          编辑
        </Button>,
        <Popconfirm key="2" title="确认删除" onConfirm={_ => handleDelete(row.id)} okText="删除" cancelText="取消">
          <Button type="link">转草稿</Button>
        </Popconfirm>
      ]
    }
  ];

  return (
    <Spin spinning={loading}>
      <PageHeader
        title=""
        extra={[
          <Button key="1" type="primary" onClick={handleAdd} style={{ marginRight: '8px' }}>
            新增
          </Button>,
          <Divider type="vertical" key="2" />,
          <ReloadOutlined key="3" style={{ cursor: 'pointer', userSelect: 'none' }} onClick={getData} />
        ]}
      ></PageHeader>
      <Table dataSource={dataSource} columns={columns} rowKey="id"></Table>
    </Spin>
  );
};

export default Article;
