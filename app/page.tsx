'use client';

import { Typography } from 'antd';
import Image from 'next/image';
import Logo from '../public/img/siglogo.png';

const { Title, Paragraph } = Typography;


export default function Home() {
  return (
    <div
      style={{
        height: '75vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        textAlign: 'center',
      }}
    >
      <Image src={Logo} alt="Logo" width={300} height={300} />
      <div style={{ maxWidth: 700, marginTop: 32 }}>
      <Title level={1}>SOBC 67</Title>
        <Title level={2}>ระบบสนับสนุนการปฏิบัติการของทหารสื่อสาร</Title>
        <Paragraph style={{ fontSize: 16, color: '#444' }}>
          ระบบนี้ถูกพัฒนาขึ้นเพื่อใช้ในภารกิจด้านการสื่อสารและการควบคุมภารกิจของหน่วยงาน
          โดยรวบรวมเครื่องมือที่จำเป็นต่อการเข้ารหัส-ถอดรหัสข้อมูล, การวิเคราะห์ความถี่วิทยุ, การจัดการ OTP
          รวมถึงการแสดงผลข้อมูลภาพรวมของภารกิจต่าง ๆ อย่างมีประสิทธิภาพ
        </Paragraph>
        <Paragraph style={{ fontSize: 16, color: '#444' }}>
          รองรับการใช้งานทั้งในรูปแบบ Light และ Dark Theme เพื่อความเหมาะสมกับสภาพแวดล้อมปฏิบัติการ
          และสามารถเข้าถึงได้ผ่านอุปกรณ์หลากหลายประเภทอย่างปลอดภัยและสะดวก
        </Paragraph>
        <Paragraph style={{ fontSize: 16, color: '#444' }}>
          กรุณาเลือกเมนูจากแถบด้านซ้ายเพื่อเริ่มต้นใช้งานแต่ละฟังก์ชันของระบบ
        </Paragraph>
      </div>
    </div>
  );
}
