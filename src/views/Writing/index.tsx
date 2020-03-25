import React, { useState, useEffect } from 'react';
import { Tooltip, Upload, Modal, Button, Input, Radio, Form, Select, message, Divider, Spin } from 'antd';
import { FileImageOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import Editor from '../../components/Editor';
import { RcFile } from 'antd/lib/upload';
import Axios from '../../helpers/Axios';
import environment from '../../environment';

import * as hljs from 'highlight.js';
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
  keywords: string;
  state: number;
  category: string | undefined;
  tag: Array<string>;
};

const initEditForm: editForm = {
  title: '',
  description: '',
  thumb: '',
  keywords: '',
  state: 1,
  category: undefined,
  tag: []
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
      Axios.get(`/article/${id}`).then((res: any) => {
        setLoadingPage(false);
        setCode(res.data.map.code);
        setHtml(res.data.map.html);
        console.log(res.data.map.tag);
        form.setFieldsValue({
          title: res.data.map.title,
          description: res.data.map.description,
          thumb: res.data.map.thumb,
          keywords: res.data.map.keywords,
          category: res.data.map.category ? res.data.map.category.id : '',
          tag: res.data.map.tag.map((x: any) => x.id)
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getCategoryList() {
    const res = await Axios.get('/category');
    setCategoryList(res.data.list);
  }
  async function getTagList() {
    const res = await Axios.get('/tag');
    setTagsList(res.data.list);
  }

  function handleChange(newCode: string) {
    setCode(newCode);
    setHtml(marked(newCode));
  }
  async function handleImage(file: RcFile) {
    const token = await Axios.get('/qiniu/getUploadToken');
    const req = new FormData();
    const type = file.type.split('/')[1];
    const filename = new Date().valueOf() + '.' + type;
    req.append('file', file);
    req.append('key', filename);
    req.append('token', token.data.map.token);
    const res: { data: { hash: string; key: string } } = await Axios.post(environment.qiniuUrl, req, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    const str = `${code}\n![图片描述](${environment.cdnUrl}/${res.data.key})`;
    handleChange(str);
    return Promise.reject();
  }

  function handlePublish() {
    setVisibleEditModal(true);
  }

  async function handleSubmit(value: any) {
    setLoadingSubmit(true);

    const req = {
      title: value.title,
      description: value.description,
      thumb: '',
      keywords: value.keywords,
      state: value.state,
      category: value.category,
      tag: value.tag.join(','),
      code: code
    };
    if (editId) {
    }
    const res = await Axios({
      url: editId ? `/article/${editId}` : '/article',
      method: editId ? 'put' : 'post',
      data: req
    });

    setLoadingSubmit(false);

    if (res.data.status === API_STATUS.SUCCESS) {
      message.success(res.data.message);
      props.history.push('/article');
    } else {
      message.error(res.data.message);
    }
  }
  async function addTag() {
    const res = await Axios.post('/tag', { name: addTagName });
    if (res.data.status === API_STATUS.SUCCESS) {
      setAddTagName('');
      getTagList();
    } else {
      message.error(res.data.message);
    }
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
          onCancel={_ => setVisibleEditModal(false)}
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
            <Form.Item name="category" label="分类">
              <Select placeholder="选择分类" onChange={e => form.setFieldsValue({ category: e })} allowClear>
                {categoryList.map((x: any, i) => (
                  <Option value={x.id} key={i}>
                    {x.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="tag" label="标签">
              <Select
                placeholder="选择标签"
                mode="multiple"
                style={{ width: '100%' }}
                onChange={e => form.setFieldsValue({ tag: e })}
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
