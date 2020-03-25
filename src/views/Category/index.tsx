import React, { useState, useEffect } from 'react';
import Axios from '../../helpers/Axios';
import { message, Table, Spin, PageHeader, Button, Modal, Input, Divider } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { API_STATUS } from '../../constants';
import { ColumnsType } from 'antd/lib/table';
import dayjs from 'dayjs';

enum editTypes {
  ADD,
  EDIT
}

const Category = () => {
  const [loading, setLoading] = useState(false);
  const [loadingEditBtn, setLoadingEditBtn] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ name: '' });
  const [editType, setEditType] = useState<editTypes>(editTypes.ADD);
  const [editId, setEditId] = useState<string>('');

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    setLoading(true);
    const res = await Axios.get('/category');
    setLoading(false);
    if (res.data.status === API_STATUS.SUCCESS) {
      setDataSource(res.data.list);
    } else {
      message.error(res.data.message);
    }
  }

  // 新增/编辑
  function handleEdit(type: editTypes, row?: any) {
    console.log(row);
    setEditType(type);
    if (type === editTypes.ADD) {
      setEditForm({ name: '' });
    } else {
      setEditForm({ name: row.name });
      setEditId(row.id);
    }
    setShowEditModal(true);
  }
  // 新增
  async function handleSubmit() {
    const req = {
      name: editForm.name
    };
    const api = editType === editTypes.ADD ? '/category' : `/category/${editId}`;
    const method = editType === editTypes.ADD ? 'post' : 'put';

    setLoadingEditBtn(true);
    let res = await Axios[method](api, req);
    setLoadingEditBtn(false);

    if (res.data.status === API_STATUS.SUCCESS) {
      message.success(res.data.message);
      setShowEditModal(false);
      getData();
    } else {
      message.error(res.data.message);
    }
  }

  // 删除
  async function deleteCategory(row: any) {
    if (row.articles.length) {
      return message.error(`该分类有${row.articles.length}篇文章，要删除分类请先删除分类下的文章`);
    }
    setLoading(true);
    const res = await Axios.delete(`/category/${row.id}`);
    setLoading(false);
    if (res.data.status === API_STATUS.SUCCESS) {
      message.success(res.data.message);
      getData();
    } else {
      message.error(res.data.message);
    }
  }
  const columns: ColumnsType<any> = [
    {
      title: '分类名称',
      dataIndex: 'name'
    },
    {
      title: '修改时间',
      dataIndex: 'updatedAt',
      render: (updatedAt: string) => <span>{dayjs(updatedAt).format('YYYY-MM-DD')}</span>
    },
    {
      title: '文章数',
      align: 'center',
      dataIndex: 'articles',
      render: (articles: Array<object>) => <span>{articles.length}</span>
    },
    {
      title: '操作',
      align: 'center',
      render: (row: any) => {
        return [
          <Button type="link" key="1" onClick={_ => handleEdit(editTypes.EDIT, row)}>
            编辑
          </Button>,
          <Button type="link" key="2" onClick={_ => deleteCategory(row)}>
            删除
          </Button>
        ];
      }
    }
  ];
  return (
    <Spin spinning={loading}>
      <div className="tablebox">
        <PageHeader
          className="site-page-header"
          title=""
          extra={[
            <Button key="1" type="primary" onClick={_ => handleEdit(editTypes.ADD)} style={{ marginRight: '8px' }}>
              新增
            </Button>,
            <Divider type="vertical" key="2" />,
            <ReloadOutlined key="3" style={{ cursor: 'pointer', userSelect: 'none' }} onClick={getData} />
          ]}
        ></PageHeader>
        <Table dataSource={dataSource} columns={columns} rowKey="id"></Table>
        <Modal
          title={editType === editTypes.ADD ? '新增' : '编辑'}
          visible={showEditModal}
          footer={[
            <Button key="back" onClick={_ => setShowEditModal(false)}>
              返回
            </Button>,
            <Button key="submit" type="primary" loading={loadingEditBtn} onClick={_ => handleSubmit()}>
              确定
            </Button>
          ]}
        >
          <Input value={editForm.name} placeholder="分类名称" onChange={e => setEditForm({ name: e.target.value })} />
        </Modal>
      </div>
    </Spin>
  );
};
export default Category;
