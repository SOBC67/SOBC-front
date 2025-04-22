'use client';

import { useEffect, useState } from 'react';
import { Modal, Typography } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../public/img/siglogo.png';
import Image from 'next/image';

const { Title, Paragraph } = Typography;

// 👇 ปรับเป็นเวลาที่ Maintenance จะเริ่ม (ในรูปแบบ timestamp)
const MAINTENANCE_START = new Date('2025-04-23T09:00:00+00:00').getTime(); // 16:00 เวลาไทย


export default function MaintenancePopup() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    setIsModalVisible(true);

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = MAINTENANCE_START - now;

      if (diff <= 0) {
        setTimeLeft('⏳ Maintenance กำลังเริ่ม!');
        clearInterval(interval);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours} ชั่วโมง ${minutes} นาที ${seconds} วินาที`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);


  const handleOk = () => {
    setIsModalVisible(false);
  };

  return (
    <AnimatePresence>
      {isModalVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Modal
            open={true}
            title={null}
            footer={null}
            closable={false}
            centered
            style={{ top: 30 }}
            bodyStyle={{
              borderRadius: '16px',
              padding: '32px',
              background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
              textAlign: 'center',
            }}
          >
            {/* Logo */}
            <Image src={Logo} alt="Logo" width={300} height={300} />

            {/* Title */}
            <Title level={3} style={{ color: '#5e370c' }}>
              🛠️ ระบบปิดปรับปรุง
            </Title>

            {/* Countdown */}
            <Paragraph style={{ fontSize: '18px', fontWeight: 'bold', color: '#3d1300' }}>
              ⏰ {timeLeft}
            </Paragraph>

            {/* Message */}
            <Paragraph style={{ fontSize: '16px', color: '#3d1300' }}>
              จะกลับมาให้บริการในวันที่{' '}
              {new Date(MAINTENANCE_START + 0 * 60 * 60 * 1000).toLocaleString('th-TH', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })} น. <br />
              ขออภัยในความไม่สะดวก 🙏
            </Paragraph>


            {/* Button */}
            <button
              onClick={handleOk}
              style={{
                marginTop: '20px',
                padding: '10px 24px',
                backgroundColor: '#ff7b00',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              ตกลง
            </button>
          </Modal>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
