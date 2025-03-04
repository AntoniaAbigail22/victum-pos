import React from 'react';
import { Dropdown, Avatar, Typography, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const HeaderComponent: React.FC = () => {
  const navigate = useNavigate();

  const userMenu = (
    <Menu>
      <Menu.Item key="perfil" onClick={() => navigate('/perfil')}>Perfil</Menu.Item>
      <Menu.Item key="logout" onClick={() => alert('Cerrar sesión')}>Cerrar sesión</Menu.Item>
    </Menu>
  );

  return (
    <div className="fixed top-0 left-0 w-full flex items-center justify-between bg-gray-900 px-4 h-14 shadow-md z-50">
      <div className="flex items-center">
        <img src="/logo1.png" alt="Logo" className="h-8 w-auto mr-2" />
        <Title level={4} className="text-white m-0 text-base">Victum - POS</Title>
      </div>

      <Dropdown overlay={userMenu} trigger={['click']}>
        <Avatar size="default" icon={<UserOutlined />} className="cursor-pointer bg-blue-500" />
      </Dropdown>
    </div>
  );
};

export default HeaderComponent;
