import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import AppHeader from './components/AppHeader';
import AppSider from './components/AppSider';
import PackageUpload from './pages/PackageUpload';
import PackageList from './pages/PackageList';
import VersionMapping from './pages/VersionMapping';

const { Content } = Layout;

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Layout>
        <AppHeader />
        <Layout>
          <AppSider />
          <Layout>
            <Content>
              <Routes>
                <Route path="/" element={<PackageList />} />
                <Route path="/upload" element={<PackageUpload />} />
                <Route path="/mapping" element={<VersionMapping />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
};

export default App; 