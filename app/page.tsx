'use client';

import { Typography } from 'antd';
import Image from 'next/image';
import Logo from '../public/img/siglogo.png';

const { Title, Link } = Typography;

export default function Home() {
  return (
    <div
      style={{
        height: '50vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      
      }}
    >
      <Image src={Logo} alt="Logo" width={300} height={300} />
      <Title level={2} style={{ marginTop: 16 }}>
        Welcome to SOBC 67
      </Title>
    </div>
  );
}
