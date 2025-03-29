'use client';
import { useEffect, useState } from 'react';
import { UserOutlined } from '@ant-design/icons';
import { Layout, theme, Button } from 'antd';

import {
  MenuOutlined,
} from '@ant-design/icons';

import 'antd/dist/reset.css';

const { Header } = Layout;

import { Avatar } from 'antd';

export const HeaderComponent = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <>
      <Header
        style={{
          padding: 0,
          display: 'flex',
          background: colorBgContainer,
          alignItems: 'center',
          justifyContent: 'end',
        }}>
        {/* <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar icon={<UserOutlined />} />
          <span style={{ padding: 5 }}>Usuário test1</span>
        </div> */}
      </Header>
    </>
  );
};
