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
  LoadingOutlined,
  KeyOutlined,
  DownloadOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import '../../../styles/globals.css';

const { Title } = Typography;
const { useToken } = theme;

type FileItem = {
  filename: string;
  content: string;
};

export default function EncryptPage() {
  const [encryptdMessage, setencryptdMessage] = useState('');
  const [key, setKey] = useState('');
  const [plaintext, setPlaintext] = useState('');
  const [dataChar, setDataChar] = useState('');
  const [genKeyLoading, setGenKeyLoading] = useState(false);
  const [encryptLoading, setEncryptLoading] = useState(false);
  const [keyList, setKeyList] = useState<FileItem[]>([]);
  const [charList, setCharList] = useState<FileItem[]>([]);
  const { token } = useToken();

  const handleencrypt = async () => {
    if (!key || !dataChar || !plaintext) {
      message.error('กรุณากรอก key, Data Char และ plaintext');
      return;
    }
    setEncryptLoading(true);
    try {
      const response = await fetch('http://localhost:5000/otpenc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: plaintext, c: dataChar, k: key }),
      });

      const data = await response.json();
      if (data?.data) {
        setencryptdMessage(data.data);
        message.success('✅ เข้ารหัสสำเร็จ!');
      } else {
        message.error('❌ ไม่สามารถเข้ารหัสได้');
      }
    } catch {
      message.error('เกิดข้อผิดพลาดในการเชื่อมต่อ API');
    }
    setEncryptLoading(false);
  };

  const handleGenerateKey = async () => {
    setGenKeyLoading(true);
    const keys: FileItem[] = [];
    const chars: FileItem[] = [];

    try {
      for (let i = 0; i < 10; i++) {
        const response = await fetch('http://localhost:5000/otpkey');
        const data = await response.json();
        if (data?.data_key && data?.data_chr) {
          keys.push({ filename: `SOBC6700${i + 1}.KEY`, content: data.data_key });
          chars.push({ filename: `SOBC6700${i + 1}.CHR`, content: data.data_chr });
        }
      }

      if (keys.length === 10 && chars.length === 10) {
        setKeyList(keys);
        setCharList(chars);
        setKey(keys[0].content);
        setDataChar(chars[0].content);
        message.success('🎉 สร้างคีย์ครบ 10 ชุดเรียบร้อยแล้ว!');
      } else {
        message.warning('⚠️ สร้างคีย์ได้ไม่ครบ 10 ชุด');
      }
    } catch {
      message.error('เกิดข้อผิดพลาดในการเชื่อมต่อ API !!');
    }

    setGenKeyLoading(false);
  };

  const handleDownload = async () => {
    if (!keyList.length || !charList.length) {
      message.warning('❗ กรุณากด Gen Key & Char ก่อนดาวน์โหลด');
      return;
    }

    const zip = new JSZip();
    keyList.forEach((k) => zip.file(k.filename, k.content));
    charList.forEach((c) => zip.file(c.filename, c.content));
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'SOBC67_OTP_KEYS.zip');
    message.success('✅ ดาวน์โหลด ZIP เรียบร้อยแล้ว!');
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
        🔐 OTP Encrypt
      </Title>

      <Form name="encrypt-form" layout="vertical" onFinish={handleencrypt}>
        <Form.Item>
          <Upload
            accept=".key,.chr,.zip"
            multiple
            showUploadList={false}
            beforeUpload={async (file) => {
              try {
                if (file.name.endsWith('.zip')) {
                  const zip = await JSZip.loadAsync(file);
                  const keys = Object.keys(zip.files).filter((name) => name.endsWith('.KEY')).sort();
                  const chars = Object.keys(zip.files).filter((name) => name.endsWith('.CHR')).sort();
                  const keyData = await Promise.all(keys.map((k) => zip.files[k].async('text')));
                  const charData = await Promise.all(chars.map((c) => zip.files[c].async('text')));

                  const keysList = keys.map((name, i) => ({ filename: name, content: keyData[i].trim() }));
                  const charsList = chars.map((name, i) => ({ filename: name, content: charData[i].trim() }));

                  setKeyList(keysList);
                  setCharList(charsList);
                  setKey(keysList[0]?.content || '');
                  setDataChar(charsList[0]?.content || '');

                  message.success(`📦 ZIP Loaded: ${keysList.length} ชุด`);
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
              } catch {
                message.error('❌ ZIP ไม่ถูกต้อง หรือแตกไฟล์ไม่สำเร็จ');
              }

              return false;
            }}
          >
            <Button icon={<UploadOutlined />} block style={{ marginBottom: 12 }}>
              📤 Upload .KEY / .CHR / .ZIP
            </Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button
            type="dashed"
            icon={<KeyOutlined />}
            loading={genKeyLoading}
            onClick={handleGenerateKey}
            block
            style={{ marginBottom: 12 }}
          >
            ➕ สร้าง Key & Char อัตโนมัติ (x10)
          </Button>
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

        <Form.Item>
          <Button
            type="default"
            icon={<DownloadOutlined />}
            onClick={handleDownload}
            block
            style={{ marginBottom: 12 }}
          >
            📦 ดาวน์โหลดทั้งหมดเป็น ZIP
          </Button>
        </Form.Item>

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
            onClick={handleencrypt}
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
              '🔐 เริ่มเข้ารหัส'
            )}
          </Button>
        </Form.Item>
      </Form>

      {encryptdMessage && (
        <div style={{ marginTop: '24px' }}>
          <Title level={4} style={{ color: token.colorTextHeading }}>
            🔒 Encrypted Message
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
