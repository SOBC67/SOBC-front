'use client';
import { Typography } from 'antd';
// import SphereMap from './SphereMap'; // adjust path as needed

const { Title } = Typography;

export default function Home() {
  return (
    <>
      <h3>Dashboard</h3>
      <h3>IPB Dashboard</h3>

      <h3>ลักษณะลมฟ้าอากาศ</h3>
      <p>ลมฟ้าอากาศ ฝน หมอก เมฆ ลม อุณหภูมิ ความชื้นสัมพัทธ์ ความกดอากาศ ข้อมูลแสงสว่าง</p>

      <h3>ลักษณะทั่วไปของพื้นที่</h3>
      <p>ลักษณะภูมิประเทศ ที่สูงต่ำ ทางน้ำไหล พืชพรรณไม้ ลักษณะผิวดิน สิ่งปลูกสร้าง</p>

      <h3>ลักษณะอื่นๆ</h3>
      <p>การเมือง การเศรษฐกิจ สังคมจิตวิทยา วิทยาศาสตร์และเทคโนโลยี แรงงานพลเรือนในท้องถิ่น</p>

      <h3>ลักษณะพื้นที่ทางทหาร OACOK</h3>

      {/* <SphereMap /> */}
    </>
  );
}
