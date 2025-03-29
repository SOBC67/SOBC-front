'use client';
import {
  Button,
  Input,
  Form,
  Typography,
  Spin,
  message,
  Upload,
} from 'antd';
import {
  LockOutlined,
  LoadingOutlined,
  KeyOutlined,
  DownloadOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const { Title } = Typography;

export default function EncryptPage() {
  const [encryptdMessage, setencryptdMessage] = useState('');
  const [key, setKey] = useState('');
  const [plaintext, setPlaintext] = useState('');
  const [dataChar, setDataChar] = useState('');
  const [genKeyLoading, setGenKeyLoading] = useState(false);
  const [encryptLoading, setEncryptLoading] = useState(false);

  const [keyList, setKeyList] = useState([]); // { filename, content }
  const [charList, setCharList] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleencrypt = async () => {
    if (!key || !dataChar || !plaintext) {
      message.error('กรุณากรอก key, Data Char และ plaintext');
      return;
    }
    setEncryptLoading(true);
    try {
      const response = await fetch('http://10.100.22.116:5000/otpenc', {
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
    const keys = [];
    const chars = [];

    try {
      for (let i = 0; i < 10; i++) {
        const response = await fetch('http://10.100.22.116:5000/otpkey', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (data && data.data_key && data.data_chr) {
          keys.push({ filename: `SOBC6700${i + 1}.KEY`, content: data.data_key });
          chars.push({ filename: `SOBC6700${i + 1}.CHR`, content: data.data_chr });
        } else {
          message.error(`ไม่สามารถสร้างคีย์รอบที่ ${i + 1} ได้`);
        }
      }

      if (keys.length === 10 && chars.length === 10) {
        setKeyList(keys);
        setCharList(chars);
        setSelectedIndex(0);
        setKey(keys[0].content);
        setDataChar(chars[0].content);
        message.success('🎉 สร้างคีย์ครบ 10 ชุดเรียบร้อยแล้ว!');
      } else {
        message.warning('⚠️ สร้างคีย์ได้ไม่ครบ 10 ชุด');
      }
    } catch (error) {
      message.error('เกิดข้อผิดพลาดในการเชื่อมต่อ API !!');
    }

    setGenKeyLoading(false);
  };

  const handleDownload = async () => {
    if (keyList.length === 0 || charList.length === 0) {
      message.warning('❗ กรุณากด Gen Key & Char ก่อนดาวน์โหลด');
      return;
    }

    const zip = new JSZip();

    for (let i = 0; i < keyList.length; i++) {
      zip.file(keyList[i].filename, keyList[i].content);
    }

    for (let i = 0; i < charList.length; i++) {
      zip.file(charList[i].filename, charList[i].content);
    }

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'SOBC67_OTP_KEYS.zip');
    message.success('✅ ดาวน์โหลด ZIP เรียบร้อยแล้ว!');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <div style={{ width: '600px', padding: '24px', background: '#fff', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>🔐 OTP Encrypt</Title>

        <Form name="encrypt-form" layout="vertical" onFinish={handleencrypt}>
          <Form.Item label="🔑 Key">
            <Input
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter Encryption Key"
              prefix={<LockOutlined />}
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Upload
              accept=".key,.chr,.zip"
              multiple
              showUploadList={false}
              beforeUpload={async (file) => {
                if (file.name.endsWith('.zip')) {
                  try {
                    const zip = await JSZip.loadAsync(file);
                    const keys = [];
                    const chars = [];

                    const keyFiles = Object.keys(zip.files).filter((name) => name.endsWith('.KEY')).sort();
                    const chrFiles = Object.keys(zip.files).filter((name) => name.endsWith('.CHR')).sort();

                    for (let i = 0; i < Math.min(keyFiles.length, chrFiles.length); i++) {
                      const keyText = await zip.files[keyFiles[i]].async('text');
                      const chrText = await zip.files[chrFiles[i]].async('text');

                      keys.push({ filename: keyFiles[i], content: keyText.trim() });
                      chars.push({ filename: chrFiles[i], content: chrText.trim() });
                    }

                    if (keys.length === 0 || chars.length === 0) {
                      message.warning('📛 ไม่พบไฟล์ .KEY หรือ .CHR ใน ZIP');
                      return false;
                    }

                    setKeyList(keys);
                    setCharList(chars);
                    setKey(keys[0].content);
                    setDataChar(chars[0].content);
                    setSelectedIndex(0);

                    message.success(`📦 ZIP Loaded: ${keys.length} ชุด`);
                  } catch (error) {
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
                style={{ width: '100%', padding: '8px', fontSize: '16px' }}
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
                style={{ width: '100%', padding: '8px', fontSize: '16px' }}
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
            <Button
              type="primary"
              size="large"
              onClick={handleencrypt}
              block
              style={{ fontSize: '18px', fontWeight: 'bold', height: '48px', backgroundColor: '#4CAF50', borderColor: '#4CAF50' }}
            >
              {encryptLoading ? (
                <Spin indicator={<LoadingOutlined style={{ color: '#fff' }} />} />
              ) : (
                '🚀 เริ่มเข้ารหัส'
              )}
            </Button>
          </Form.Item>
        </Form>

        {encryptdMessage && (
          <div style={{ marginTop: '24px' }}>
            <Title level={4}>🔒 Encrypted Message</Title>
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