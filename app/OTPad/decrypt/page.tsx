'use client';
import { Input, Typography, theme, Form, Button, Spin, message } from 'antd';
import { useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import '../../../styles/globals.css';

const { Title } = Typography;
const { useToken } = theme;

export default function DecryptPage() {
  const [ciphertext, setCiphertext] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [decryptLoading, setDecryptLoading] = useState(false);
  const { token } = useToken();

  const handleDecrypt = async () => {
    if (!ciphertext) {
      message.warning('กรุณากรอกข้อความที่ต้องการถอดรหัส');
      return;
    }

    setDecryptLoading(true);
    setResponseMessage('');

    try {
      const res = await fetch('https://example.com/api/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ciphertext }),
      });

      const data = await res.json();

      if (data?.result) {
        setResponseMessage(data.result);
        message.success('✅ ถอดรหัสสำเร็จ!');
      } else {
        message.error('❌ ไม่สามารถถอดรหัสได้');
      }
    } catch (err) {
      message.error('เกิดข้อผิดพลาดในการเชื่อมต่อ API');
    }

    setDecryptLoading(false);
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
        🔓 ONE TIME PAD
      </Title>

      <Form name="decrypt-form" layout="vertical">
        <Form.Item label="🔐 Ciphertext" required>
          <Input.TextArea
            className="custom-hover-input"
            value={ciphertext}
            onChange={(e) => setCiphertext(e.target.value)}
            rows={5}
            placeholder="Enter Decryptd Text"
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
            onClick={handleDecrypt}
            block
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              height: '48px',
              backgroundColor: '#bd03ec',
              borderColor: '#bd03ec',
            }}
          >
            {decryptLoading ? (
              <Spin indicator={<LoadingOutlined style={{ color: '#fff' }} />} />
            ) : (
              '🔓 ถอดรหัส'
            )}
          </Button>
        </Form.Item>
      </Form>

      {responseMessage && (
        <div style={{ marginTop: '24px' }}>
          <Title level={4} style={{ color: token.colorTextHeading }}>
            📥 ผลลัพธ์ที่ถอดรหัสแล้ว
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
