'use client';
import {
  Button,
  Input,
  Form,
  Typography,
  Spin,
  message,
  theme,
  Table,
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

  const [keyReturn, setKeyReturn] = useState<string[]>([]);
  const [replaceKey, setReplaceKey] = useState<number[]>([]);
  const [sortKey, setSortKey] = useState<number[]>([]);
  const [ccList, setCcList] = useState<string[]>([]);

  const { token } = useToken();

  const handleencrypt = async () => {
    if (!key || !plaintext) {
      message.error('❌ กรุณากรอก Key และ Plaintext');
      return;
    }

    setLoading(true);
    setencryptdMessage('');
    setKeyReturn([]);
    setReplaceKey([]);
    setSortKey([]);
    setCcList([]);

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

      setKeyReturn(data.Key_Return || []);
      setReplaceKey(data.Replace_Key || []);
      setSortKey(data.Sort_Key || []);
      setCcList(data.cc || []);
    } catch (error) {
      console.error('Error encoding:', error);
      message.error('❌ ไม่สามารถเชื่อมต่อ API ได้');
      setencryptdMessage('❌ เกิดข้อผิดพลาดในการเข้ารหัส');
    } finally {
      setLoading(false);
    }
  };

  const generateTableData = () => {
    const maxCols = Math.max(
      keyReturn.length,
      replaceKey.length,
      sortKey.length,
      ...ccList.map((line) => line.length)
    );

    const data: any[] = [];

    const rowMap = [
      { label: 'Key', values: keyReturn },
      { label: 'ลำดับอักษร', values: replaceKey },
      { label: 'เรียงลำดับใหม่', values: sortKey },
    ];

    rowMap.forEach(({ label, values }) => {
      const row: any = { key: label };
      for (let i = 0; i < maxCols; i++) {
        row[i.toString()] = values[i] !== undefined ? values[i] : '';
      }
      data.push(row);
    });

    ccList.forEach((line, i) => {
      const row: any = { key: (i + 1).toString() };
      Array.from(line).forEach((char, j) => {
        row[j.toString()] = char;
      });
      data.push(row);
    });

    const columns = [
      {
        title: '',
        dataIndex: 'key',
        key: 'key',
        fixed: 'left' as const,
        width: 120,
        render: (text: string) => <strong>{text}</strong>,
      },
      ...Array.from({ length: maxCols }).map((_, i) => ({
        title: (i + 1).toString(),
        dataIndex: i.toString(),
        key: i.toString(),
        align: 'center' as const,
      })),
    ];

    return { data, columns };
  };

  const { data, columns } = generateTableData();

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

      {keyReturn.length > 0 && (
        <div style={{ marginTop: '32px' }}>
          <Title level={4} style={{ color: token.colorTextHeading }}>
            📊 Sonakul Encryption Table
          </Title>
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            bordered
            scroll={{ x: true }}
            rowKey="key"
            size="middle"
            style={{ marginTop: '16px', textAlign: 'center' }}
            className="custom-encryption-table"
            rowClassName={(record) =>
              ['Key', 'ลำดับอักษร', 'เรียงลำดับใหม่'].includes(record.key) ? 'highlight-row' : ''
            }
          />
        </div>
      )}
    </div>
  );
}
