import React, { useState, useEffect } from 'react';
import { Tooltip, Upload, Modal, Button, Input, Radio, Form, Select, message, Divider, Spin } from 'antd';
import { FileImageOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import Editor from '../../components/Editor';
import { RcFile } from 'antd/lib/upload';
import Axios, { AxiosResponse } from 'axios';
import environment from '../../environment';

import hljs from 'highlight.js';
import marked from 'marked';
import 'github-markdown-css';
import 'highlight.js/styles/github.css';

import './index.less';
import { API_STATUS } from '../../constants';

const { Option } = Select;

marked.setOptions({
  breaks: true,
  highlight: function(code: any) {
    return hljs.highlightAuto(code).value;
  }
});

type editForm = {
  title: string;
  description: string;
  thumb: string;
  content: string;
  keywords: string;
  state: number;
  category_id: string | undefined;
  tags: Array<string>;
};

const initEditForm: editForm = {
  title: '',
  description: '',
  thumb: '',
  content: '',
  keywords: '',
  state: 1,
  category_id: undefined,
  tags: []
};
const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 }
};
const Writing = (props: any, ref: any) => {
  const [form] = Form.useForm();
  const [loadingPage, setLoadingPage] = useState(false);
  const [editId, setEditId] = useState<Boolean | string>(false);
  const [code, setCode] = useState('');
  const [html, setHtml] = useState('');
  const [visibleEditModal, setVisibleEditModal] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [addTagName, setAddTagName] = useState('');
  const [isFull, setIsFull] = useState(false);

  useEffect(() => {
    getCategoryList();
    getTagList();
    const id = props.location.search.split('=')[1];
    if (id) {
      setEditId(id);
      setLoadingPage(true);
      (Axios.get(`/article/${id}`) as AxiosResponse['data']).then((res: any) => {
        setLoadingPage(false);
        setCode(res.result.data.code);
        setHtml(res.result.data.content);
        form.setFieldsValue({
          title: res.result.data.title,
          description: res.result.data.description,
          thumb: res.result.data.thumb,
          keywords: res.result.data.keywords,
          category_id: res.result.data.category.id,
          tags: res.result.data.tags.split(',')
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getCategoryList() {
    const res = (await Axios.get('/category')) as AxiosResponse['data'];
    setCategoryList(res.result.data);
  }
  async function getTagList() {
    const res = (await Axios.get('/tag')) as AxiosResponse['data'];
    setTagsList(res.result.data);
  }

  function handleChange(newCode: string) {
    setCode(newCode);
    setHtml(marked(newCode));
  }
  async function handleImage(file: RcFile) {
    const token = (await Axios.get('/qiniutoken')) as AxiosResponse['data'];
    const req = new FormData();
    const type = file.type.split('/')[1];
    const filename = new Date().valueOf() + '.' + type;
    req.append('file', file);
    req.append('key', filename);
    req.append('token', token.result.data);
    const res: {
      hash: string;
      key: string;
    } = await Axios.post(environment.qiniuUrl, req, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    const str = `${code}\n![图片描述](${environment.cdnUrl}/${res.key})`;
    handleChange(str);
    return Promise.reject();
  }

  function handlePublish() {
    setVisibleEditModal(true);
  }

  async function handleSubmit(value: any) {
    console.log(value);
    setLoadingSubmit(true);

    const req = {
      title: value.title,
      description: value.description,
      thumb: '',
      keywords: value.keywords,
      state: value.state,
      category_id: value.category_id,
      tags: value.tags.join(','),
      code: code,
      content: html
    };
    if (editId) {
    }
    const res = (await Axios({
      url: editId ? `/article/${editId}` : '/article',
      method: editId ? 'put' : 'post',
      data: req
    })) as AxiosResponse['data'];

    setLoadingSubmit(false);

    if (res.status === API_STATUS.SUCCESS) {
      message.success(res.message);
      props.history.push('/article');
    } else {
      message.error(res.message);
    }
  }
  async function addTag() {
    await Axios.post('/tag', { name: addTagName });
    setAddTagName('');
    getTagList();
  }

  return (
    <Spin spinning={loadingPage}>
      <div id="writing" className={isFull ? 'fullscreen' : ''}>
        <div className="tools">
          <Upload beforeUpload={handleImage}>
            <Tooltip placement="top" title="添加图片">
              <FileImageOutlined className="tools-item" />
            </Tooltip>
          </Upload>
          {isFull ? (
            <FullscreenExitOutlined className="tools-item" onClick={_ => setIsFull(false)} />
          ) : (
            <FullscreenOutlined className="tools-item" onClick={_ => setIsFull(true)} />
          )}

          <Button
            onClick={handlePublish}
            size="small"
            type="primary"
            style={{ marginRight: '8px', position: 'absolute', right: 0 }}
          >
            发布
          </Button>
        </div>

        <div className="content">
          <div className="code">
            <Editor value={code} onChange={handleChange}></Editor>
          </div>
          <div className="show">
            <div className="markdown-body" dangerouslySetInnerHTML={{ __html: html }}></div>
          </div>
        </div>

        <Modal
          title={'发布详情'}
          visible={visibleEditModal}
          footer={[
            <Button key="back" onClick={_ => setVisibleEditModal(false)}>
              返回
            </Button>,
            <Button key="submit" type="primary" loading={loadingSubmit} onClick={_ => form.submit()}>
              确定
            </Button>
          ]}
        >
          <Form form={form} {...layout} onFinish={handleSubmit} initialValues={initEditForm}>
            <Form.Item label="标题" name="title">
              <Input placeholder="输入标题" />
            </Form.Item>
            <Form.Item label="描述" name="description">
              <Input placeholder="输入描述" />
            </Form.Item>
            <Form.Item label="关键字" name="keywords">
              <Input placeholder="关键字(英文逗号隔开)" />
            </Form.Item>
            <Form.Item name="state" label="发布状态">
              <Radio.Group>
                <Radio value={0}>草稿</Radio>
                <Radio value={1}>发布</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item name="category_id" label="分类">
              <Select placeholder="选择分类" onChange={e => form.setFieldsValue({ category_id: e })} allowClear>
                {categoryList.map((x: any, i) => (
                  <Option value={x.id} key={i}>
                    {x.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="tags" label="标签">
              <Select
                placeholder="选择标签"
                mode="multiple"
                style={{ width: '100%' }}
                onChange={e => form.setFieldsValue({ tags: e })}
                allowClear
                dropdownRender={menu => (
                  <div>
                    {menu}
                    <Divider style={{ margin: '4px 0' }} />
                    <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                      <Input
                        style={{ flex: 'auto' }}
                        value={addTagName}
                        onChange={e => setAddTagName(e.target.value)}
                      />
                      <Button style={{ marginLeft: '5px' }} onClick={addTag}>
                        添加
                      </Button>
                    </div>
                  </div>
                )}
              >
                {tagsList.map((x: any, i) => (
                  <Option value={x.id} key={i}>
                    {x.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Spin>
  );
};

export default Writing;
