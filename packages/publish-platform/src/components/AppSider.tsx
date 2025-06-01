import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppstoreOutlined,
  UploadOutlined,
  LinkOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

const AppSider: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <AppstoreOutlined />,
      label: '离线包列表',
    },
    {
      key: '/upload',
      icon: <UploadOutlined />,
      label: '上传离线包',
    },
    {
      key: '/mapping',
      icon: <LinkOutlined />,
      label: '版本映射',
    },
  ];

  return (
    <Sider width={200} style={{ background: '#fff' }}>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        style={{ height: '100%', borderRight: 0 }}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  );
};

export default AppSider; 