import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Card, Button, Modal, Form, Select, message } from 'antd';
import type { AppDispatch, RootState } from '../store';
import type { VersionMapping, AppVersion, PackageMeta } from '../types';
import { fetchPackages } from '../store/packagesSlice';
import { fetchVersions } from '../store/versionsSlice';
import { createMapping, fetchMappings, updateMapping } from '../store/mappingsSlice';

const { Option } = Select;

const VersionMappingPage: React.FC = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  
  const packages = useSelector((state: RootState) => state.packages.items);
  const versions = useSelector((state: RootState) => state.versions.items);
  const mappings = useSelector((state: RootState) => state.mappings.items);
  const loading = useSelector((state: RootState) => state.mappings.loading);

  useEffect(() => {
    dispatch(fetchPackages());
    dispatch(fetchVersions());
    dispatch(fetchMappings());
  }, [dispatch]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await dispatch(createMapping(values)).unwrap();
      message.success('映射关系创建成功');
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('创建失败：' + (error as Error).message);
    }
  };

  const handleToggleActive = async (record: VersionMapping) => {
    try {
      await dispatch(updateMapping({
        ...record,
        isActive: !record.isActive
      })).unwrap();
      message.success('状态更新成功');
    } catch (error) {
      message.error('更新失败：' + (error as Error).message);
    }
  };

  const columns = [
    {
      title: 'App版本',
      key: 'appVersion',
      render: (_, record: VersionMapping) => {
        const version = versions.find(v => v.id === record.appVersionId);
        return `${version?.platform} ${version?.version}`;
      },
    },
    {
      title: '离线包',
      key: 'package',
      render: (_, record: VersionMapping) => {
        const pkg = packages.find(p => p.id === record.packageId);
        return `${pkg?.name} (${pkg?.version})`;
      },
    },
    {
      title: '状态',
      key: 'status',
      render: (_, record: VersionMapping) => (
        <Button
          type={record.isActive ? 'primary' : 'default'}
          onClick={() => handleToggleActive(record)}
        >
          {record.isActive ? '已启用' : '已禁用'}
        </Button>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (time: string) => new Date(time).toLocaleString(),
    },
  ];

  return (
    <>
      <Card
        title="版本映射管理"
        extra={
          <Button type="primary" onClick={showModal}>
            创建映射
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={mappings}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="创建版本映射"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="appVersionId"
            label="App版本"
            rules={[{ required: true, message: '请选择App版本' }]}
          >
            <Select placeholder="请选择App版本">
              {versions.map((version: AppVersion) => (
                <Option key={version.id} value={version.id}>
                  {version.platform} {version.version}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="packageId"
            label="离线包"
            rules={[{ required: true, message: '请选择离线包' }]}
          >
            <Select placeholder="请选择离线包">
              {packages.map((pkg: PackageMeta) => (
                <Option key={pkg.id} value={pkg.id}>
                  {pkg.name} ({pkg.version})
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default VersionMappingPage; 