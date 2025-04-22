'use client';

import { useEffect, useState } from 'react';
import { Modal, Typography } from 'antd';

const { Title, Paragraph } = Typography;

export default function MaintenancePopup() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    // แสดง popup เมื่อโหลดหน้า
    setIsModalVisible(true);
  }, []);

  const handleOk = () => {
    setIsModalVisible(false);
  };

  return (
    <Modal
      title="🛠️ เว็บไซต์อยู่ระหว่างการบำรุงรักษา"
      open={isModalVisible}
      onOk={handleOk}
      cancelButtonProps={{ style: { display: 'none' } }}
      okText="ตกลง"
    >
      <Title level={4}>⏰ Maintenance Time</Title>
      <Paragraph>
        ระบบจะทำการปิดปรับปรุงในวันพุธที่ 23 เม.ย. 2025 เวลา 08:00 - 16:00 น.
        และจะกลับมาเปิดให้บริการตามปกติในวันพฤหัสบดีที่ 24 เม.ย. 2025 เวลา 08:00 น.
      </Paragraph>
      <Paragraph>ขออภัยในความไม่สะดวก 🙏</Paragraph>
    </Modal>
  );
}
