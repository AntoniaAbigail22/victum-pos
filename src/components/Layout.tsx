import React, { useState } from 'react';
import { Layout, Menu, Dropdown, Avatar, Typography } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  ShoppingCartOutlined,
  UserOutlined,
  AppstoreOutlined,
  BoxPlotOutlined,
  TeamOutlined,
  SettingOutlined,
  DollarOutlined,
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const LayoutComponent: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState('ventas');
  const navigate = useNavigate();

  // Menú desplegable del usuario
  const userMenu = (
    <Menu>
      <Menu.Item key="perfil" onClick={() => navigate('/perfil')}>
        Perfil
      </Menu.Item>
      <Menu.Item key="logout" onClick={() => alert('Cerrar sesión')}>
        Cerrar sesión
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* MENÚ HORIZONTAL */}
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#001529',
          padding: '0 20px',
        }}
      >
        {/* LOGO + NOMBRE */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/logo1.png" alt="Logo" style={{ height: 40, marginRight: 10 }} />
          <Title level={3} style={{ color: 'white', margin: 0 }}>
            Victum - POS
          </Title>
        </div>

        {/* USUARIO */}
        <Dropdown overlay={userMenu} trigger={['click']}>
          <Avatar
            size="large"
            icon={<UserOutlined />}
            style={{ cursor: 'pointer', backgroundColor: '#1890ff' }}
          />
        </Dropdown>
      </Header>

      <Layout>
        {/* MENÚ LATERAL */}
        <Sider collapsible style={{ background: '#001529' }}>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedKey]}
            onClick={(e) => {
              setSelectedKey(e.key);
              navigate(`/${e.key}`);
            }}
            style={{ fontSize: '16px', fontWeight: '500' }}
          >
            <Menu.Item key="ventas" icon={<ShoppingCartOutlined />}>
              Ventas
            </Menu.Item>
            <Menu.Item key="clientes" icon={<UserOutlined />}>
              Clientes
            </Menu.Item>
            <Menu.Item key="inventario" icon={<AppstoreOutlined />}>
              Inventario
            </Menu.Item>
            <Menu.Item key="productos" icon={<BoxPlotOutlined />}>
              Productos
            </Menu.Item>
            <Menu.Item key="proveedores" icon={<TeamOutlined />}>
              Proveedores
            </Menu.Item>
            <Menu.Item key="configuracion" icon={<SettingOutlined />}>
              Configuración
            </Menu.Item>
            <Menu.Item key="corte" icon={<DollarOutlined />}>
              Corte de Caja
            </Menu.Item>
          </Menu>
        </Sider>

        {/* CONTENIDO PRINCIPAL */}
        <Layout style={{ background: '#f0f2f5' }}>
          <Header
            style={{
              background: '#fff',
              padding: '16px',
              fontSize: '18px',
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            {selectedKey.toUpperCase()}
          </Header>
          <Content
            style={{
              margin: '16px',
              padding: '16px',
              background: '#fff',
              borderRadius: 8,
              minHeight: '80vh',
            }}
          >
            <Outlet /> {/* Renderiza la página actual */}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default LayoutComponent;
