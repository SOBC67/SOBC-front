'use client';
import { Button, Input, Form, Typography, Spin, message } from 'antd';
import { UnlockOutlined, LoadingOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Title } = Typography;

export default function DecryptPage() {
  const [decryptdMessage, setdecryptdMessage] = useState<string>('');
  const [key, setKey] = useState<string>('');
  const [dataChar, setDataChar] = useState<string>('');
  const [encryptdText, setencryptdText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handledecrypt = async () => {
    if (!key || !dataChar || !encryptdText) {
      message.error('กรุณากรอก key, Data Char และ Encryptd Text');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://10.100.22.80:5000/otpde', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value: encryptdText,
          c: dataChar,
          k: key,
        }),
      });

      const data = await response.json();
      if (data && data.data) {
        setdecryptdMessage(data.data);
        message.success('✅ ถอดรหัสสำเร็จ!');
      } else {
        message.error('❌ ไม่สามารถถอดรหัสได้');
      }
    } catch (error) {
      message.error('เกิดข้อผิดพลาดในการเชื่อมต่อ API');
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // height: '100vh',
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
        <Title level={1} style={{ textAlign: 'center', fontSize: '32px' }}>OTP Decrypt</Title>

        <Form name="decrypt-form" layout="vertical" onFinish={handledecrypt}>
          <Form.Item label="🔑 Key" required>
            <Input
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter Decryption Key"
              prefix={<UnlockOutlined />}
              size="large"
            />
          </Form.Item>

          <Form.Item label="🔡 Data Char" required>
            <Input.TextArea
              value={dataChar}
              onChange={(e) => setDataChar(e.target.value)}
              rows={3}
              placeholder="Enter Data Char"
              style={{ fontSize: '16px' }}
            />
          </Form.Item>

          <Form.Item label="🔐 Encryptd Text" required>
            <Input.TextArea
              value={encryptdText}
              onChange={(e) => setencryptdText(e.target.value)}
              rows={5}
              placeholder="Enter Encryptd Text"
              style={{ fontSize: '16px' }}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" style={{ width: '100%', fontSize: '18px' }}>
              {loading ? <Spin indicator={<LoadingOutlined />} /> : '🔓 Decrypt Now'}
            </Button>
          </Form.Item>
        </Form>

        {decryptdMessage && (
          <div style={{ marginTop: '20px' }}>
            <Title level={3}>📜 Decryptd Message</Title>
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