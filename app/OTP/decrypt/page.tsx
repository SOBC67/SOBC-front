'use client';
import {
  Button,
  Input,
  Form,
  Typography,
  Spin,
  message,
  Upload,
  theme,
} from 'antd';
import {
  UploadOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import JSZip from 'jszip';
import '../../../styles/globals.css';

const { Title } = Typography;
const { useToken } = theme;

type FileItem = {
  filename: string;
  content: string;
};

export default function DecryptPage() {
  const [decryptdMessage, setdecryptdMessage] = useState('');
  const [key, setKey] = useState('');
  const [dataChar, setDataChar] = useState('');
  const [encryptdText, setencryptdText] = useState('');
  const [loading, setLoading] = useState(false);

  const [keyList, setKeyList] = useState<FileItem[]>([]);
  const [charList, setCharList] = useState<FileItem[]>([]);

  const { token } = useToken();

  const handledecrypt = async () => {
    if (!key || !dataChar || !encryptdText) {
      message.error('กรุณากรอก key, Data Char และ Decryptd Text');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('https://sobc-api.khiwqqkubb.uk/otpde', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: encryptdText, c: dataChar, k: key }),
      });

      const data = await response.json();
      if (data?.data) {
        setdecryptdMessage(data.data);
        message.success('✅ ถอดรหัสสำเร็จ!');
      } else {
        message.error('❌ ไม่สามารถถอดรหัสได้');
      }
    } catch {
      message.error('เกิดข้อผิดพลาดในการเชื่อมต่อ API');
    }
    setLoading(false);
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
        🔓 OTP Decrypt
      </Title>

      <Form name="decrypt-form" layout="vertical" onFinish={handledecrypt}>
        <Form.Item>
          <Upload
            accept=".key,.chr,.zip"
            multiple
            showUploadList={false}
            beforeUpload={async (file) => {
              if (file.name.endsWith('.zip')) {
                try {
                  const zip = await JSZip.loadAsync(file);
                  const keys: FileItem[] = [];
                  const chars: FileItem[] = [];

                  const keyFiles = Object.keys(zip.files).filter((name) => name.endsWith('.KEY')).sort();
                  const chrFiles = Object.keys(zip.files).filter((name) => name.endsWith('.CHR')).sort();

                  for (let i = 0; i < Math.min(keyFiles.length, chrFiles.length); i++) {
                    const keyText = await zip.files[keyFiles[i]].async('text');
                    const chrText = await zip.files[chrFiles[i]].async('text');

                    keys.push({ filename: keyFiles[i], content: keyText.trim() });
                    chars.push({ filename: chrFiles[i], content: chrText.trim() });
                  }

                  setKeyList(keys);
                  setCharList(chars);
                  setKey(keys[0]?.content || '');
                  setDataChar(chars[0]?.content || '');

                  message.success(`📦 ZIP Loaded: ${keys.length} ชุด`);
                } catch {
                  message.error('❌ ZIP ไม่ถูกต้อง หรือแตกไฟล์ไม่สำเร็จ');
                }
              } else if (file.name.endsWith('.KEY')) {
                const text = await file.text();
                setKeyList((prev) => {
                  const updated = [...prev, { filename: file.name, content: text.trim() }];
                  if (updated.length === 1) setKey(text.trim());
                  return updated;
                });
              } else if (file.name.endsWith('.CHR')) {
                const text = await file.text();
                setCharList((prev) => {
                  const updated = [...prev, { filename: file.name, content: text.trim() }];
                  if (updated.length === 1) setDataChar(text.trim());
                  return updated;
                });
              } else {
                message.error('📛 รองรับเฉพาะไฟล์ .KEY, .CHR, .ZIP เท่านั้น');
              }
              return false;
            }}
          >
            <Button 
            icon={<UploadOutlined />} block style={{ marginBottom: 12 }}>
              📤 Upload .KEY / .CHR / .ZIP
            </Button>
          </Upload>
        </Form.Item>

        {keyList.length > 0 && (
          <Form.Item label="🔐 เลือก Key (.KEY)">
            <select
              className="custom-hover-input"
              style={{
                width: '100%',
                padding: '8px',
                fontSize: '16px',
                backgroundColor: token.colorBgElevated,
                color: token.colorText,
                border: `1px solid ${token.colorBorder}`,
                borderRadius: '6px',
              }}
              value={key}
              onChange={(e) => setKey(e.target.value)}
            >
              {keyList.map((item, idx) => (
                <option key={idx} value={item.content}>
                  {item.filename}
                </option>
              ))}
            </select>
          </Form.Item>
        )}

        {charList.length > 0 && (
          <Form.Item label="🔡 เลือก Data Char (.CHR)">
            <select
              className="custom-hover-input"
              style={{
                width: '100%',
                padding: '8px',
                fontSize: '16px',
                backgroundColor: token.colorBgElevated,
                color: token.colorText,
                border: `1px solid ${token.colorBorder}`,
                borderRadius: '6px',
              }}
              value={dataChar}
              onChange={(e) => setDataChar(e.target.value)}
            >
              {charList.map((item, idx) => (
                <option key={idx} value={item.content}>
                  {item.filename}
                </option>
              ))}
            </select>
          </Form.Item>
        )}

        <Form.Item label="🔐 Decryptd Text" required>
          <Input.TextArea
            className="custom-hover-input"
            value={encryptdText}
            onChange={(e) => setencryptdText(e.target.value)}
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
            className="custom-purple-button"
            htmlType="submit"
            size="large"
            block
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              height: '48px',
              backgroundColor: '#bd03ec',
              borderColor: '#bd03ec',
            }}
          >
            {loading ? <Spin indicator={<LoadingOutlined style={{ color: '#fff' }} />} /> : '🔓 ถอดรหัส'}
          </Button>
        </Form.Item>
      </Form>

      {decryptdMessage && (
        <div style={{ marginTop: '24px' }}>
          <Title level={4} style={{ color: token.colorTextHeading }}>
            📜 Decrypted Message
          </Title>
          <Input.TextArea
            readOnly
            className="custom-hover-input"
            value={decryptdMessage}
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
