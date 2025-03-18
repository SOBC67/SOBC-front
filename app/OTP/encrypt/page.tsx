'use client';
import { Button, Input, Form, Typography, Spin, message, Modal } from 'antd';
import { LockOutlined, LoadingOutlined, KeyOutlined, DownloadOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Title } = Typography;

export default function EncryptPage() {
  const [encryptdMessage, setencryptdMessage] = useState<string>('');
  const [key, setKey] = useState<string>('');
  const [plaintext, setPlaintext] = useState<string>('');
  const [dataChar, setDataChar] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [genKeyLoading, setGenKeyLoading] = useState<boolean>(false);
  const [encryptLoading, setEncryptLoading] = useState<boolean>(false);

  const handleencrypt = async () => {
    if (!key || !dataChar || !plaintext) {
      message.error('กรุณากรอก key, Data Char และ plaintext');
      return;
    }
    setEncryptLoading(true);
    try {
      const response = await fetch('http://10.100.22.80:5000/otpenc', {
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
        setencryptdMessage(data.data);
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
      const response = await fetch('http://10.100.22.80:5000/otpkey', {
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
        message.success('คีย์ถูกสร้างแล้ว !!');
      } else {
        message.error('ไม่สามารถสร้างคีย์ได้ !!');
      }
    } catch (error) {
      message.error('เกิดข้อผิดพลาดในการเชื่อมต่อ API !!');
    }
    setGenKeyLoading(false);
  };

  const handleDownload = (filename: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
        <Title level={1} style={{ textAlign: 'center', fontSize: '32px' }}>OTP Encrypt</Title>

        <Form name="encrypt-form" layout="vertical" onFinish={handleencrypt}>
          <Form.Item label="🔑 Key" required>
            <Input
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter Encryption Key"
              prefix={<LockOutlined />}
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button type="dashed" icon={<KeyOutlined />} loading={genKeyLoading} onClick={handleGenerateKey}>
              Gen Key & Char
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              type="default"
              icon={<DownloadOutlined />}
              onClick={() => {
                handleDownload('A001.KEY', key);
                handleDownload('A001.CHAR', dataChar);
              }}
              style={{ width: '100%', marginTop: '10px' }}
            >
              📥 Download Key & Char
            </Button>
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

          <Form.Item label="📝 Plaintext" required>
            <Input.TextArea
              value={plaintext}
              onChange={(e) => setPlaintext(e.target.value)}
              rows={5}
              placeholder="Enter Plaintext to Encrypt"
              style={{ fontSize: '16px' }}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" size="large" onClick={handleencrypt} style={{ width: '100%', fontSize: '18px' }}>
              {encryptLoading ? <Spin indicator={<LoadingOutlined />} /> : '🔐 Encrypt Now'}
            </Button>
          </Form.Item>
        </Form>

        {encryptdMessage && (
          <div style={{ marginTop: '20px' }}>
            <Title level={3}>🔒 Encrypted Message</Title>
            <Input.TextArea
              value={encryptdMessage}
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