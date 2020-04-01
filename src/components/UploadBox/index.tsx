import React, { useState, useEffect } from 'react';
import { Upload, Spin } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/lib/upload';
import './index.less';
import Axios from '../../helpers/Axios';
import environment from '../../environment';

type props = {
  value: string;
  onChange: (value: string) => void;
};

export default (props: props) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    setImageUrl(props.value);
  }, [props.value]);

  async function beforeUpload(file: RcFile, fileList: RcFile[]) {
    await upload(file);
    return Promise.reject();
  }

  async function upload(file: RcFile) {
    setLoading(true);

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
    setImageUrl(`${environment.cdnUrl}/${res.data.key}`);
    props.onChange(`${environment.cdnUrl}/${res.data.key}`);

    setLoading(false);
  }

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">点击上传</div>
    </div>
  );
  return (
    <Spin spinning={loading}>
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action=""
        beforeUpload={beforeUpload}
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
    </Spin>
  );
};
