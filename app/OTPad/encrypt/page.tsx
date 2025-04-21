'use client';
import { Input, Typography, theme, Form, Button, Spin, message } from 'antd';
import { useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import '../../../styles/globals.css';

const { Title } = Typography;
const { useToken } = theme;

export default function EncryptPage() {
  const [plaintext, setPlaintext] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [encryptLoading, setEncryptLoading] = useState(false);
  const { token } = useToken();

  const handleEncrypt = async () => {
    if (!plaintext) {
      message.warning('กรุณากรอก Plaintext ก่อน');
      return;
    }

    setEncryptLoading(true);
    setResponseMessage('');

    try {
      const res = await fetch('https://sobc-api.khiwqqkubb.uk/otp10enc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: plaintext }),
      });

      const data = await res.json();

      if (data?.data) {
        setResponseMessage(data.data);
        message.success('✅ เข้ารหัสสำเร็จ!');
      } else {
        message.error('❌ ไม่สามารถเข้ารหัสได้');
      }
    } catch (err) {
      message.error('เกิดข้อผิดพลาดในการเรียก API');
    }

    setEncryptLoading(false);
  };

  return (
    <div
      className="form-container"
      style={{
        maxWidth: '1500px',
        margin: '0 auto',
        padding: '24px',
        background: token.colorBgContainer,
        borderRadius: '12px',
        boxShadow: token.boxShadowSecondary,
        color: token.colorText,
      }}
    >
      <Title
        level={2}
        style={{
          textAlign: 'center',
          marginBottom: 24,
          color: token.colorTextHeading,
        }}
      >
        🔐 ONE TIME PAD
      </Title>

      <Form name="encrypt-form" layout="vertical">
        <Form.Item label="📝 Plaintext" required>
          <Input.TextArea
            className="custom-hover-input"
            value={plaintext}
            onChange={(e) => setPlaintext(e.target.value)}
            rows={5}
            placeholder="Enter Plaintext to Encrypt"
            style={{
              fontSize: '16px',
              backgroundColor: token.colorBgElevated,
              color: token.colorText,
            }}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            size="large"
            onClick={handleEncrypt}
            block
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              height: '48px',
              backgroundColor: '#bd03ec',
              borderColor: '#bd03ec',
            }}
          >
            {encryptLoading ? (
              <Spin indicator={<LoadingOutlined style={{ color: '#fff' }} />} />
            ) : (
              '🔐 เข้ารหัส'
            )}
          </Button>
        </Form.Item>
      </Form>

      {responseMessage && (
        <div style={{ marginTop: '24px' }}>
          <Title level={4} style={{ color: token.colorTextHeading }}>
            📥 ข้อความที่ถูกเข้ารหัสแล้ว
          </Title>
          <Input.TextArea
            readOnly
            className="custom-hover-input"
            value={responseMessage}
            rows={5}
            style={{
              fontSize: '16px',
              backgroundColor: token.colorBgElevated,
              color: token.colorText,
            }}
          />
        </div>
      )}
    </div>
  );
}
