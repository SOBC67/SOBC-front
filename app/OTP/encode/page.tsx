'use client';
import { Button, Input, Form, Typography, Spin, message, Modal } from 'antd';
import { LockOutlined, LoadingOutlined, KeyOutlined, DownloadOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Title } = Typography;

export default function EncryptPage() {
  const [encodedMessage, setEncodedMessage] = useState<string>('');
  const [key, setKey] = useState<string>('');
  const [plaintext, setPlaintext] = useState<string>('');
  const [dataChar, setDataChar] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [genKeyLoading, setGenKeyLoading] = useState<boolean>(false);
  const [encryptLoading, setEncryptLoading] = useState<boolean>(false);

  const handleEncode = async () => {
    if (!key || !dataChar || !plaintext) {
      message.error('กรุณากรอก key, data char และ plaintext');
      return;
    }
    setEncryptLoading(true);
    try {
      const response = await fetch('http://10.100.22.45:5000/otpenc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value: plaintext,
          c: dataChar,
          k: key,
        }),
      });

      const data = await response.json();
      if (data && data.data) {
        setEncodedMessage(data.data);
        message.success('✅ เข้ารหัสสำเร็จ!');
      } else {
        message.error('❌ ไม่สามารถเข้ารหัสได้');
      }
    } catch (error) {
      message.error('เกิดข้อผิดพลาดในการเชื่อมต่อ API');
    }
    setEncryptLoading(false);
  };

  const handleGenerateKey = async () => {
    setGenKeyLoading(true);
    try {
      const response = await fetch('http://10.100.22.45:5000/otpkey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ secretkey: 'SOBC67' }),
      });

      const data = await response.json();
      if (data && data.data_key && data.data_chr) {
        setKey(data.data_key);
        setDataChar(data.data_chr);
        Modal.success({
          title: '🔑 คีย์ถูกสร้างแล้ว!',
          content: `คีย์ของคุณ: ${data.data_key}`
        });
      } else {
        message.error('ไม่สามารถสร้างคีย์ได้');
      }
    } catch (error) {
      message.error('เกิดข้อผิดพลาดในการเชื่อมต่อ API');
    }
    setGenKeyLoading(false);
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
        <Title level={1} style={{ textAlign: 'center', fontSize: '32px' }}>OTP Encode</Title>

        <Form name="encrypt-form" layout="vertical" onFinish={handleEncode}>
          <Form.Item label="🔑 Key" required>
            <Input
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter encryption key"
              prefix={<LockOutlined />}
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button type="dashed" icon={<KeyOutlined />} loading={genKeyLoading} onClick={handleGenerateKey}>
              GenKey
            </Button>
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

          <Form.Item label="📝 Plaintext" required>
            <Input.TextArea
              value={plaintext}
              onChange={(e) => setPlaintext(e.target.value)}
              rows={5}
              placeholder="Enter plaintext to encrypt"
              style={{ fontSize: '16px' }}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" size="large" onClick={handleEncode} style={{ width: '100%', fontSize: '18px' }}>
              {encryptLoading ? <Spin indicator={<LoadingOutlined />} /> : '🔐 Encrypt Now'}
            </Button>
          </Form.Item>
        </Form>

        {encodedMessage && (
          <div style={{ marginTop: '20px' }}>
            <Title level={3}>🔒 Encrypted Message</Title>
            <Input.TextArea
              value={encodedMessage}
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