import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Form, Input, Upload, Button, message, Card } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { uploadPackage } from '../store/packagesSlice';
import type { AppDispatch } from '../store';
import type { UploadFile } from 'antd/es/upload/interface';

const PackageUpload: React.FC = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    if (fileList.length === 0) {
      message.error('请选择要上传的离线包文件');
      return;
    }

    const formData = new FormData();
    formData.append('file', fileList[0].originFileObj as Blob);
    formData.append('name', values.name);
    formData.append('version', values.version);
    formData.append('description', values.description);

    try {
      await dispatch(uploadPackage(formData)).unwrap();
      message.success('离线包上传成功');
      navigate('/');
    } catch (error) {
      message.error('上传失败：' + (error as Error).message);
    }
  };

  const beforeUpload = (file: UploadFile) => {
    setFileList([file]);
    return false;
  };

  return (
    <Card title="上传离线包">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          name="name"
          label="包名称"
          rules={[{ required: true, message: '请输入包名称' }]}
        >
          <Input placeholder="请输入包名称" />
        </Form.Item>

        <Form.Item
          name="version"
          label="版本号"
          rules={[{ required: true, message: '请输入版本号' }]}
        >
          <Input placeholder="请输入版本号，如：1.0.0" />
        </Form.Item>

        <Form.Item
          name="description"
          label="描述"
          rules={[{ required: true, message: '请输入包描述' }]}
        >
          <Input.TextArea rows={4} placeholder="请输入包描述" />
        </Form.Item>

        <Form.Item
          label="离线包文件"
          required
          tooltip="支持zip格式，大小不超过50MB"
        >
          <Upload
            beforeUpload={beforeUpload}
            fileList={fileList}
            onRemove={() => setFileList([])}
            accept=".zip"
          >
            <Button icon={<UploadOutlined />}>选择文件</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            上传
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default PackageUpload; 