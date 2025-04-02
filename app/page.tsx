'use client';
import { Card, Col, Row, Typography } from 'antd';
const { Title, Link } = Typography;
import Logo from '../public/img/siglogo.png';
import Image from 'next/image';

export default function Home() {
  return (
    <div>
      <Image
        src={Logo}
        alt="Logo"
      />
    </div >
  );
}
