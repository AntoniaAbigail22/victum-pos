import React, { useState } from 'react';
import { Menu } from 'antd';
import { UserAddOutlined, TableOutlined } from '@ant-design/icons'; 
import ProveedorForm from '../components/ProveedorForm';
import ProveedoresTable from '../components/ProveedoresTable';

const Proveedores: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('registrar');

  return (
    <div className="p-5">
      <Menu mode="horizontal" className="mb-5 border-b" selectedKeys={[selectedTab]} onClick={(e) => setSelectedTab(e.key)}>
        <Menu.Item key="registrar" icon={<UserAddOutlined />}>Registrar Proveedores</Menu.Item>
        <Menu.Item key="gestionar" icon={<TableOutlined />}>Gestionar Proveedores</Menu.Item>
      </Menu>

      {selectedTab === 'registrar' && <ProveedorForm />}
      {selectedTab === 'gestionar' && <ProveedoresTable />}
    </div>
  );
};

export default Proveedores;
