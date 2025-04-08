'use client';
import {
  Button,
  Input,
  Form,
  Typography,
  Spin,
  message,
  theme,
} from 'antd';
import {
  LockOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { useState } from 'react';

const { Title } = Typography;
const { useToken } = theme;

export default function EncryptPage() {
  const [encryptdMessage, setencryptdMessage] = useState('');
  const [key, setKey] = useState('');
  const [plaintext, setPlaintext] = useState('');
  const [loading, setLoading] = useState(false);

  const { token } = useToken();

  const handleencrypt = async () => {
    if (!key || !plaintext) {
      message.error('❌ กรุณากรอก Key และ Plaintext');
      return;
    }

    setLoading(true);
    setencryptdMessage('');

    try {
      const response = await fetch('https://sobc-api.khiwqqkubb.uk/encryption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key,
          value: plaintext,
          secretkey: 'SOBC67',
        }),
      });

      const data = await response.json();
      setencryptdMessage(data.data || '⚠️ ไม่มีข้อมูลที่ถูกเข้ารหัส');
    } catch (error) {
      console.error('Error encoding:', error);
      message.error('❌ ไม่สามารถเชื่อมต่อ API ได้');
      setencryptdMessage('❌ เกิดข้อผิดพลาดในการเข้ารหัส');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="form-container"
      style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '24px',
        background: token.colorBgContainer,
        borderRadius: '12px',
        boxShadow: token.boxShadowSecondary,
        color: token.colorText,
      }}
    >
      <Title level={2} style={{ textAlign: 'center', marginBottom: 24, color: token.colorTextHeading }}>
        🔐 Sonakul Encrypt
      </Title>

      <Form name="encrypt-form" layout="vertical" onFinish={handleencrypt}>
        <Form.Item label="🔑 Key" required>
          <Input
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Enter Encryption Key"
            prefix={<LockOutlined />}
            size="large"
            className="custom-hover-input"
            style={{
              fontSize: '16px',
              backgroundColor: token.colorBgElevated,
              color: token.colorText,
            }}
          />
        </Form.Item>

        <Form.Item label="📝 Plaintext" required>
          <Input.TextArea
            value={plaintext}
            onChange={(e) => setPlaintext(e.target.value)}
            rows={5}
            placeholder="Enter Plaintext To Encrypt"
            className="custom-hover-input"
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
            htmlType="submit"
            size="large"
            block
            className="custom-purple-button"
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              height: '48px',
              backgroundColor: '#bd03ec',
              borderColor: '#bd03ec',
            }}
            disabled={loading}
          >
            {loading ? <Spin indicator={<LoadingOutlined style={{ color: '#fff' }} />} /> : '🔐 เริ่มเข้ารหัส'}
          </Button>
        </Form.Item>
      </Form>

      {encryptdMessage && (
        <div style={{ marginTop: '24px' }}>
          <Title level={4} style={{ color: token.colorTextHeading }}>
            🔐 Encrypted Message
          </Title>
          <Input.TextArea
            readOnly
            className="custom-hover-input"
            value={encryptdMessage}
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
