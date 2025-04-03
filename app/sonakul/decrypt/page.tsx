'use client';
import { Button, Input, Form, Typography, Spin, message } from 'antd';
import { LockOutlined, LoadingOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Title } = Typography;

export default function EncryptPage() {
  const [decryptdMessage, setdecryptdMessage] = useState<string>(''); // ✅ เก็บข้อความที่ถูกเข้ารหัส
  const [key, setKey] = useState<string>(''); // ✅ คีย์ที่ใช้เข้ารหัส
  const [plaintext, setPlaintext] = useState<string>(''); // ✅ ข้อความที่ต้องการเข้ารหัส
  const [loading, setLoading] = useState<boolean>(false); // ✅ สถานะโหลด

  const handledecrypt = async () => {
    if (!key || !plaintext) {
      message.error('❌ กรุณากรอก Key และ Plaintext');
      return;
    }

    setLoading(true); // ✅ เริ่มโหลด
    setdecryptdMessage(''); // ✅ รีเซ็ตค่าก่อนส่ง API

    try {
      const response = await fetch('http://127.0.0.1:5000/decryption', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: key,
          value: plaintext,
          secretkey: 'SOBC67', // ✅ ส่ง secretkey ตามที่ระบุ
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json(); // ✅ รับค่าจาก API
      setdecryptdMessage(data.data || '⚠️ ไม่มีข้อมูลที่ถูกเข้ารหัส');

    } catch (error: any) {
      console.error('Error encoding:', error);
      message.error('❌ ไม่สามารถเชื่อมต่อ API ได้');
      setdecryptdMessage('❌ เกิดข้อผิดพลาดในการเข้ารหัส');
    } finally {
      setLoading(false); // ✅ หยุดโหลด
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '75vh',
      }}
    >
      <div
        style={{
          width: '600px',
          padding: '15px',
          background: 'rgb(0 0 0 / 20%)',
          borderRadius: '8px',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
        }}
      >
        <Title level={1} style={{ textAlign: 'center', fontSize: '32px' }}>
          Sonakul Decrypt
        </Title>

        <Form name="encrypt-form" layout="vertical" onFinish={handledecrypt}>
          <Form.Item label="🔑 Key" required>
            <Input
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter Decryption Key"
              prefix={<LockOutlined />}
              size="large"
            />
          </Form.Item>

          <Form.Item label="📝 Ciphertext" required>
            <Input.TextArea
              value={plaintext}
              onChange={(e) => setPlaintext(e.target.value)}
              rows={5}
              placeholder="Enter Ciphertext To Decrypt"
              style={{ fontSize: '16px' }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              style={{ width: '100%', fontSize: '18px' }}
              disabled={loading}
            >
              {loading ? <Spin indicator={<LoadingOutlined />} /> : '🚀 Decrypt Now'}
            </Button>
          </Form.Item>
        </Form>

        {decryptdMessage && (
          <div style={{ marginTop: '20px' }}>
            <Title level={3}>🔐 decryptd Message</Title>
            <Input.TextArea
              value={decryptdMessage}
              rows={5}
              readOnly
              style={{ backgroundColor: '#f5f5f5', borderColor: '#d9d9d9', fontSize: '16px' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
