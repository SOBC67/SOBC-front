'use client';
import { Button, Input, Form, Typography, Spin, message } from 'antd';
import { UnlockOutlined, LoadingOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Title } = Typography;

export default function DecryptPage() {
  const [decodedMessage, setDecodedMessage] = useState<string>('');
  const [key, setKey] = useState<string>('');
  const [dataChar, setDataChar] = useState<string>('');
  const [encodedText, setEncodedText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleDecode = async () => {
    if (!key || !dataChar || !encodedText) {
      message.error('กรุณากรอก key, data char และ encoded text');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://10.100.22.45:5000/otpde', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value: encodedText,
          c: dataChar,
          k: key,
        }),
      });

      const data = await response.json();
      if (data && data.data) {
        setDecodedMessage(data.data);
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
        height: '75vh',
      }}
    >
      <div
        style={{
          width: '600px',
          padding: '15px',
          background: '#fff',
          borderRadius: '8px',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
        }}
      >
        <Title level={1} style={{ textAlign: 'center', fontSize: '32px' }}>OTP Decode</Title>

        <Form name="decrypt-form" layout="vertical" onFinish={handleDecode}>
          <Form.Item label="🔑 Key" required>
            <Input
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter decryption key"
              prefix={<UnlockOutlined />}
              size="large"
            />
          </Form.Item>

          <Form.Item label="🔡 Data Char" required>
            <Input.TextArea
              value={dataChar}
              onChange={(e) => setDataChar(e.target.value)}
              rows={3}
              placeholder="Enter data char"
              style={{ fontSize: '16px' }}
            />
          </Form.Item>

          <Form.Item label="🔐 Encoded Text" required>
            <Input.TextArea
              value={encodedText}
              onChange={(e) => setEncodedText(e.target.value)}
              rows={5}
              placeholder="Enter encoded text"
              style={{ fontSize: '16px' }}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" style={{ width: '100%', fontSize: '18px' }}>
              {loading ? <Spin indicator={<LoadingOutlined />} /> : '🔓 Decode Now'}
            </Button>
          </Form.Item>
        </Form>

        {decodedMessage && (
          <div style={{ marginTop: '20px' }}>
            <Title level={3}>📜 Decoded Message</Title>
            <Input.TextArea
              value={decodedMessage}
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