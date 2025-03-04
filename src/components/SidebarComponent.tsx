import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCartOutlined,
  UserOutlined,
  AppstoreOutlined,
  BoxPlotOutlined,
  TeamOutlined,
  SettingOutlined,
  DollarOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

const SidebarComponent: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Sider collapsible className="bg-gray-800 min-h-screen">
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['ventas']}
        onClick={(e) => navigate(`/${e.key}`)}
        className="text-lg font-semibold"
      >
        <Menu.Item key="ventas" icon={<ShoppingCartOutlined />}>Ventas</Menu.Item>
        <Menu.Item key="clientes" icon={<UserOutlined />}>Clientes</Menu.Item>
        <Menu.Item key="inventario" icon={<AppstoreOutlined />}>Inventario</Menu.Item>
        <Menu.Item key="productos" icon={<BoxPlotOutlined />}>Productos</Menu.Item>
        <Menu.Item key="proveedores" icon={<TeamOutlined />}>Proveedores</Menu.Item>
        <Menu.Item key="configuracion" icon={<SettingOutlined />}>Configuración</Menu.Item>
        <Menu.Item key="corte" icon={<DollarOutlined />}>Corte de Caja</Menu.Item>
      </Menu>
    </Sider>
  );
};

export default SidebarComponent;
