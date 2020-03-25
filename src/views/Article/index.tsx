import React, { useState, useEffect } from 'react';
import { Spin, PageHeader, Table, message, Button, Divider, Popconfirm } from 'antd';

import { ReloadOutlined } from '@ant-design/icons';
import Axios from '../../helpers/Axios';
import { API_STATUS, PublishState } from '../../constants';
import { RouteChildrenProps } from 'react-router-dom';
import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';

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
    const res = await Axios.get('/article', { params: { desc: 'createdAt' } });
    setLoading(false);

    if (res.data.status === API_STATUS.SUCCESS) {
      setDataSource(res.data.list);
    } else {
      message.error(res.data.message);
    }
  }

  function handleAdd() {
    props.history.push('/writing');
  }

  function handleEdit(id: string) {
    props.history.push('/writing?id=' + id);
  }
  async function handleDelete(id: string) {
    const res = await Axios.delete('/article/' + id);
    if (res.data.status === API_STATUS.SUCCESS) {
      message.success(res.data.message);
      getData();
    } else {
      message.error(res.data.message);
    }
  }
  async function handleChangeState(row: Record<string, any>) {
    console.log(row);
    const req = Object.assign({}, row, {
      category: row.category ? row.category.id : '',
      tag: row.tag.map((x: any) => x.id).join(','),
      state: row.state === PublishState.PUBLISH ? PublishState.DRAFT : PublishState.PUBLISH
    });
    setLoading(true);
    const res = await Axios.put(`/article/${row.id}`, req);
    setLoading(false);
    console.log(res.data);
    if (res.data.status === API_STATUS.SUCCESS) {
      message.success(res.data.message);
      getData();
    } else {
      message.error(res.data.message);
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
      render: (row: any) => <span>{row.category ? row.category.name : ''}</span>
    },
    {
      title: '标签',
      render: (row: any) => <span>{row.tag.map((x: any) => x.name).join(',')}</span>
    },
    {
      title: '更新时间',
      render: (row: any) => <span>{dayjs(row.updatedAt).format('YYYY-MM-DD HH:mm')}</span>
    },
    {
      title: '状态',
      render: (row: any) => <span>{row.state === PublishState.PUBLISH ? '已发布' : '草稿'}</span>
    },
    {
      title: '操作',
      align: 'center',
      render: (row: any) => [
        <Button type="link" key="1" onClick={_ => handleEdit(row.id)}>
          编辑
        </Button>,
        <Button type="link" key="2" onClick={_ => handleChangeState(row)}>
          {row.state === PublishState.PUBLISH ? '存草稿' : '发布'}
        </Button>,
        <Popconfirm key="3" title="确认删除" onConfirm={_ => handleDelete(row.id)} okText="删除" cancelText="取消">
          <Button type="link">删除</Button>
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
