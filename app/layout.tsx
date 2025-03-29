'use client';
import {
  DeploymentUnitOutlined,
  HeartTwoTone,
  FundProjectionScreenOutlined,
  SlidersOutlined,
  LockOutlined,
  WifiOutlined,
  UnlockOutlined,
  MenuOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import { Layout, Menu, Spin, theme, Button } from 'antd';
import { useEffect, useState } from 'react';
import NavLink from './nav-link';
import 'antd/dist/reset.css';

const { Header, Sider, Content, Footer } = Layout;
const { SubMenu } = Menu;
import { Typography } from 'antd';
import { HeaderComponent } from '../components/header';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Link } = Typography;

export default function RootLayout({ children }: { children: any }) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // แสดง Spin Loader ตอนโหลดเว็บ
    setTimeout(() => {
      setIsLoading(false);
    }, 1000); // ปรับเวลาโหลดได้
  }, []);

  return (
    <html>
      <head />
      <body>
        {isLoading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
              backgroundColor: '#f0f2f5',
            }}
          >
            {/* <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} /> */}
            <Spin size="large" />
          </div>
        ) : (
          <Layout >
            <Sider trigger={null} collapsible collapsed={collapsed}>
              {/* <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '64px',
                }}
              >
                <h1 style={{ color: 'white', margin: 0, fontSize: '24px' }}>SOBC 67</h1>
              </div> */}
              <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                <Menu.Item key="SOBC" icon={<ThunderboltOutlined />}>
                  <NavLink href="/">SOBC 67</NavLink>
                </Menu.Item>

                <Menu.Item key="IPB" icon={<FundProjectionScreenOutlined />}>
                  <NavLink href="/IPB">IPB Dashboard</NavLink>
                </Menu.Item>
                <SubMenu key="IPB Detail" icon={<SlidersOutlined />} title="IPB Detail">
                  <Menu.Item key="IPB1" icon={<LockOutlined />}>
                    <NavLink href="/IPB/1">IPB 1</NavLink>
                  </Menu.Item>
                  <Menu.Item key="IPB Dashboard 2" icon={<UnlockOutlined />}>
                    <NavLink href="/IPB/2">IPB 2</NavLink>
                  </Menu.Item>
                  <Menu.Item key="IPB Dashboard 3" icon={<UnlockOutlined />}>
                    <NavLink href="/IPB/3">IPB 3</NavLink>
                  </Menu.Item>
                  <Menu.Item key="IPB Dashboard 4" icon={<UnlockOutlined />}>
                    <NavLink href="/IPB/4">IPB 4</NavLink>
                  </Menu.Item>
                </SubMenu>

                <Menu.Item key="4" icon={<WifiOutlined />}>
                  <NavLink href="/radio">Radio Dashboard</NavLink>
                </Menu.Item>

                <SubMenu key="radio" icon={<SlidersOutlined />} title="Radio Detail">
                  <Menu.Item key="Profile" icon={<LockOutlined />}>
                    <NavLink href="/sonakul/encode">Profile</NavLink>
                  </Menu.Item>
                  <Menu.Item key="BestFeq" icon={<UnlockOutlined />}>
                    <NavLink href="/sonakul/decode">BestFeq</NavLink>
                  </Menu.Item>
                  <Menu.Item key="Hopping" icon={<UnlockOutlined />}>
                    <NavLink href="/sonakul/decode">Hopping</NavLink>
                  </Menu.Item>
                  <Menu.Item key="Hoplist" icon={<UnlockOutlined />}>
                    <NavLink href="/sonakul/decode">Hoplist</NavLink>
                  </Menu.Item>
                  <Menu.Item key="Autocall" icon={<UnlockOutlined />}>
                    <NavLink href="/sonakul/decode">Autocall</NavLink>
                  </Menu.Item>
                  <Menu.Item key="AJ-10-key" icon={<UnlockOutlined />}>
                    <NavLink href="/sonakul/decode">AJ 10 Key</NavLink>
                  </Menu.Item>
                </SubMenu>

                <SubMenu key="sonakul" icon={<SlidersOutlined />} title="Sonakul">
                  <Menu.Item key="sonakul-encrypt" icon={<LockOutlined />}>
                    <NavLink href="/sonakul/encrypt">Encrypt</NavLink>
                  </Menu.Item>
                  <Menu.Item key="sonakul-decrypt" icon={<UnlockOutlined />}>
                    <NavLink href="/sonakul/decrypt">Decrypt</NavLink>
                  </Menu.Item>
                </SubMenu>

                <SubMenu key="otp" icon={<DeploymentUnitOutlined />} title="OTP">
                  <Menu.Item key="otp-encrypt" icon={<LockOutlined />}>
                    <NavLink href="/OTP/encrypt">Encrypt</NavLink>
                  </Menu.Item>
                  <Menu.Item key="otp-decrypt" icon={<UnlockOutlined />}>
                    <NavLink href="/OTP/decrypt">Decrypt</NavLink>
                  </Menu.Item>
                </SubMenu>
              </Menu>
            </Sider>
            <Layout className="site-layout">
              {/* <HeaderComponent /> */}
              <Header style={{ padding: 0, background: colorBgContainer }}>
                <Button
                  type="text"
                  icon={collapsed ? <MenuOutlined /> : <MenuOutlined />}
                  onClick={() => setCollapsed(!collapsed)}
                  style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64,
                  }}
                />
              </Header>
              <Content
                style={{
                  margin: '24px 16px',
                  padding: 24,
                  minHeight: '100vh',
                  background: colorBgContainer,
                  borderRadius: '10px',
                  overflow: 'auto',
                }}
              >
                {children}
              </Content>
              <Footer style={{ textAlign: 'center' }}>
                Made with {<HeartTwoTone twoToneColor="#993399" />} by{' '}
                <Link href="https://github.com/SOBC67" target="_blank">
                  SOBC 67
                </Link>
              </Footer>
            </Layout>
          </Layout>
        )}
      </body>
    </html>
  );
}
