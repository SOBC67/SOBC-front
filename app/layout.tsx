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
  ThunderboltOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Spin, Button, Switch, theme, ConfigProvider } from 'antd';
import { useEffect, useState } from 'react';
import NavLink from './nav-link';
import { Typography } from 'antd';
import Image from 'next/image';

import 'antd/dist/reset.css';
import '../styles/globals.css';

const { Header, Sider, Content, Footer } = Layout;
const { SubMenu } = Menu;
const { Link } = Typography;

import Logo from '../public/img/siglogo.png';

export default function RootLayout({ children }: { children: any }) {
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const iconColor = darkMode ? '#d9d9d9' : '#000';
  const textColor = darkMode ? '#d9d9d9' : '#000';

  return (
    <html>
      <head />
      <body>
        <ConfigProvider
          theme={{
            algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          }}
        >
          {isLoading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: darkMode ? '#1f1f1f' : '#f0f2f5',
              }}
            >
              <Spin size="large" />
            </div>
          ) : (
            <Layout style={{ minHeight: '100vh' }}>
              <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{
                  backgroundColor: darkMode ? '#141414' : '#fff',
                  paddingTop: 16,
                }}
              >
                <div
                  style={{
                    textAlign: 'center',
                    marginBottom: 16,
                    fontWeight: 600,
                    fontSize: 25,
                  }}
                >
                  <NavLink href="/">
                    {collapsed ? (
                      <ThunderboltOutlined style={{ color: iconColor }} />
                    ) : (
                      <span style={{ color: textColor }}>SOBC 67</span>
                    )}
                  </NavLink>
                </div>

                <Menu
                  mode="inline"
                  defaultSelectedKeys={['1']}
                  theme={darkMode ? 'dark' : 'light'}
                  style={{
                    backgroundColor: darkMode ? '#141414' : '#fff',
                    color: textColor,
                    borderRight: 'none',
                  }}
                >
                  <Menu.Item key="SOBC" icon={<HomeOutlined style={{ color: iconColor }} />}>
                    <NavLink href="/">HOME</NavLink>
                  </Menu.Item>

                  <Menu.Item key="IPB" icon={<FundProjectionScreenOutlined style={{ color: iconColor }} />}>
                    <NavLink href="/IPB">IPB Dashboard</NavLink>
                  </Menu.Item>

                  <SubMenu
                    key="IPB Detail"
                    icon={<SlidersOutlined style={{ color: iconColor }} />}
                    title={<span style={{ color: textColor }}>IPB Detail</span>}
                  >
                    <Menu.Item key="IPB1" icon={<LockOutlined style={{ color: iconColor }} />}>
                      <NavLink href="/IPB/1">IPB 1</NavLink>
                    </Menu.Item>
                    <Menu.Item key="IPB2" icon={<UnlockOutlined style={{ color: iconColor }} />}>
                      <NavLink href="/IPB/2">IPB 2</NavLink>
                    </Menu.Item>
                    <Menu.Item key="IPB3" icon={<UnlockOutlined style={{ color: iconColor }} />}>
                      <NavLink href="/IPB/3">IPB 3</NavLink>
                    </Menu.Item>
                    <Menu.Item key="IPB4" icon={<UnlockOutlined style={{ color: iconColor }} />}>
                      <NavLink href="/IPB/4">IPB 4</NavLink>
                    </Menu.Item>
                  </SubMenu>

                  <Menu.Item key="Radio" icon={<WifiOutlined style={{ color: iconColor }} />}>
                    <NavLink href="/radio">Radio Dashboard</NavLink>
                  </Menu.Item>

                  <SubMenu
                    key="Radio Detail"
                    icon={<SlidersOutlined style={{ color: iconColor }} />}
                    title={<span style={{ color: textColor }}>Radio Detail</span>}
                  >
                    <Menu.Item key="Profile" icon={<LockOutlined style={{ color: iconColor }} />}>
                      <NavLink href="/sonakul/encode">Profile</NavLink>
                    </Menu.Item>
                    <Menu.Item key="BestFeq" icon={<UnlockOutlined style={{ color: iconColor }} />}>
                      <NavLink href="/sonakul/decode">BestFeq</NavLink>
                    </Menu.Item>
                    <Menu.Item key="Hopping" icon={<UnlockOutlined style={{ color: iconColor }} />}>
                      <NavLink href="/sonakul/decode">Hopping</NavLink>
                    </Menu.Item>
                    <Menu.Item key="Hoplist" icon={<UnlockOutlined style={{ color: iconColor }} />}>
                      <NavLink href="/sonakul/decode">Hoplist</NavLink>
                    </Menu.Item>
                    <Menu.Item key="Autocall" icon={<UnlockOutlined style={{ color: iconColor }} />}>
                      <NavLink href="/sonakul/decode">Autocall</NavLink>
                    </Menu.Item>
                    <Menu.Item key="AJ10Key" icon={<UnlockOutlined style={{ color: iconColor }} />}>
                      <NavLink href="/sonakul/decode">AJ 10 Key</NavLink>
                    </Menu.Item>
                  </SubMenu>

                  <SubMenu
                    key="Sonakul"
                    icon={<SlidersOutlined style={{ color: iconColor }} />}
                    title={<span style={{ color: textColor }}>Sonakul</span>}
                  >
                    <Menu.Item key="Encrypt" icon={<LockOutlined style={{ color: iconColor }} />}>
                      <NavLink href="/sonakul/encrypt">Encrypt</NavLink>
                    </Menu.Item>
                    <Menu.Item key="Decrypt" icon={<UnlockOutlined style={{ color: iconColor }} />}>
                      <NavLink href="/sonakul/decrypt">Decrypt</NavLink>
                    </Menu.Item>
                  </SubMenu>

                  <SubMenu
                    key="OTP"
                    icon={<DeploymentUnitOutlined style={{ color: iconColor }} />}
                    title={<span style={{ color: textColor }}>OTP</span>}
                  >
                    <Menu.Item key="OTP-Encrypt" icon={<LockOutlined style={{ color: iconColor }} />}>
                      <NavLink href="/OTP/encrypt">Encrypt</NavLink>
                    </Menu.Item>
                    <Menu.Item key="OTP-Decrypt" icon={<UnlockOutlined style={{ color: iconColor }} />}>
                      <NavLink href="/OTP/decrypt">Decrypt</NavLink>
                    </Menu.Item>
                  </SubMenu>
                </Menu>
              </Sider>

              <Layout>
                <Header
                  style={{
                    padding: '0 24px',
                    backgroundColor: '#bd03ec',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Button
                      type="text"
                      icon={<MenuOutlined style={{ color: iconColor }} />}
                      onClick={() => setCollapsed(!collapsed)}
                    />
                    <Image src={Logo} alt="Logo" width={40} height={40} />
                  </div>

                  <Switch
                    checkedChildren="🌙"
                    unCheckedChildren="☀️"
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                  />
                </Header>

                <Content
                  style={{
                    margin: '24px 16px',
                    padding: 24,
                    minHeight: '100vh',
                    background: darkMode ? '#1e1e1e' : '#fff',
                    borderRadius: '10px',
                    overflow: 'auto',
                    boxShadow: darkMode ? '0 0 12px #000' : '0 0 12px #ccc',
                  }}
                >
                  {children}
                </Content>

                <Footer style={{ textAlign: 'center', color: '#999' }}>
                  Made with <HeartTwoTone twoToneColor="#993399" /> by{' '}
                  <Link href="https://github.com/SOBC67" target="_blank" style={{ color: '#bd03ec' }}>
                    SOBC 67
                  </Link>
                </Footer>
              </Layout>
            </Layout>
          )}
        </ConfigProvider>
      </body>
    </html>
  );
}
