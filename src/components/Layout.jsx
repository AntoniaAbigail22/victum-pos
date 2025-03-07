import React, { useState, useEffect } from 'react';
import { Layout, Menu, Typography } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const { Header, Content } = Layout;

const LayoutComponent = () => {

	//const [selectedKey, setSelectedKey] = useState('ventas');
	const navigate = useNavigate();

	const location = useLocation();
    const { pathname } = location;
    const basePath = pathname?.split("/")[1];

	const [time, setTime] = useState(new Date());

    const formatTime = (date) => {
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`;
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 60000);
        return () => clearInterval(interval);
    }, []);

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

	const onClickMenu = (route) => {
		//setSelectedKey(route);
		navigate(`/${route}`);
	}
	/*={(e) => {
	  
	}}*/

	const getUrlUsers = ()=> {
		
	}

	return (
		<Layout style={{ minHeight: '100vh' }}>
			{/* MENÚ HORIZONTAL */}
			<Header
				style={{
					display: 'flex',
					/*alignItems: 'center',
					justifyContent: 'space-between',
					background: '#001529',
					padding: '0 20px',*/
				}}
				className='p-0'
			>
				{/* LOGO + NOMBRE */}
				{/*<div style={{ display: 'flex', alignItems: 'center', color: 'white' }}>
          <img src="/logo1.png" alt="Logo" style={{ height: 40, marginRight: 10 }} />
          <Title level={3} style={{ color: 'white', margin: 0 }}>
            Victum - POS
          </Title>
          <div>
            <h1>Caja 1</h1>
            <h1>Admin</h1>
          </div>
          <h1>
            13:02
          </h1>
        </div>*/}

				<nav className="w-full flex items-center bg-blue-600 text-white p-1">
					<div className='flex flex-col items-center px-4'>
						
						<span className="text-sm">Caja 1</span>
						<span className="text-sm">{formatTime(time)}</span>
					</div>

					<div className="flex flex-grow justify-center">
						<button className={`px-4 hover:bg-blue-700 hover:text-white rounded flex items-center gap-1 ${basePath == "sales" && "bg-white text-blue-700"}`} onClick={() => onClickMenu("sales")}>
							<img width="35" height="35" src="https://img.icons8.com/fluency/48/cash-register.png" alt="cash-register" />
							<span>Ventas</span>
						</button>
						<button className={`px-4 py-2 hover:bg-blue-700 hover:text-white rounded flex items-center gap-1 ${basePath == "directory" && "bg-white text-blue-700"}`} onClick={() => onClickMenu("directory")}>
							<img width="35" height="35" src="https://img.icons8.com/fluency/48/conference-call.png" alt="conference-call" />
							<span>Directorio</span>
						</button>
						<button className={`px-4 py-2 hover:bg-blue-700 hover:text-white rounded flex items-center gap-1 ${basePath == "inventory" && "bg-white text-blue-700"}`} onClick={() => onClickMenu("inventory")}>
							<img width="35" height="35" src="https://img.icons8.com/color/48/move-by-trolley.png" alt="move-by-trolley" />
							<span>Inventario</span>
						</button>
						{/*<button className={`px-4 py-2 hover:bg-blue-700 hover:text-white rounded flex items-center gap-1 ${basePath == "providers" && "bg-white text-blue-700"}`} onClick={() => onClickMenu("providers")}>
							<img width="35" height="35" src="https://img.icons8.com/color/48/supplier.png" alt="supplier" />
							<span>Proveedores</span>
						</button>*/}
						<button className={`px-4 py-2 hover:bg-blue-700 hover:text-white rounded flex items-center gap-1 ${basePath == "cut" && "bg-white text-blue-700"}`} onClick={() => onClickMenu("cut")}>
							<img width="35" height="35" src="https://img.icons8.com/ultraviolet/40/empty-box.png" alt="empty-box" />
							<span>Corte de Caja</span>
						</button>
					</div>
				</nav>

				{/* USUARIO */}
				{/*<Dropdown overlay={userMenu} trigger={['click']}>
          <Avatar
            size="large"
            icon={<UserOutlined />}
            style={{ cursor: 'pointer', backgroundColor: '#1890ff' }}
          />
        </Dropdown>*/}
			</Header>

			<Layout>
				{/* MENÚ LATERAL 
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
				</Sider>*/}

				{/* CONTENIDO PRINCIPAL */}
				<Layout style={{ background: '#f0f2f5' }}>
					{/*<Header
						style={{
							background: '#fff',
							padding: '16px',
							fontSize: '18px',
							fontWeight: 'bold',
							textAlign: 'center',
						}}
					>
						{selectedKey.toUpperCase()}
					</Header>*/}
					<Content
						style={{
							//margin: '16px',
							//padding: '16px',
							background: '#fff',
							minHeight: '80vh',
						}}
					>
						<Outlet />
					</Content>
				</Layout>
			</Layout>
		</Layout>
	);
};

export default LayoutComponent;
