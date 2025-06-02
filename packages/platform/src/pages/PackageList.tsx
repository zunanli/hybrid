import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Card, Button, Space, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { fetchPackages } from '../store/packagesSlice';
import type { AppDispatch, RootState } from '../store';
import type { PackageMeta } from '../types';

const PackageList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { items: packages, loading } = useSelector((state: RootState) => state.packages);

  useEffect(() => {
    dispatch(fetchPackages());
  }, [dispatch]);

  const columns = [
    {
      title: '包名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
      render: (version: string) => <Tag color="blue">{version}</Tag>,
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      render: (size: number) => `${(size / 1024 / 1024).toFixed(2)} MB`,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (time: string) => new Date(time).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record: PackageMeta) => (
        <Space size="middle">
          <Button type="link" onClick={() => window.open(record.url)}>
            下载
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="离线包列表"
      extra={
        <Button type="primary" onClick={() => navigate('/upload')}>
          上传离线包
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={packages}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </Card>
  );
};

export default PackageList; 