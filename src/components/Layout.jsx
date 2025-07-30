import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import Context from '../redux/Context';
import { Layout } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const { Header, Content } = Layout;

const LayoutComponent = () => {

	const navigate = useNavigate();
	const { signOut } = useContext(Context);

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
		}, 6000);
		return () => clearInterval(interval);
	}, []);

	const onClickMenu = (route) => navigate(`/${route}`);

	return (
		<>
			<Layout style={{ minHeight: '100vh' }}>
				<Header style={{
					position: 'fixed',
					top: 0,
					zIndex: 100,
					width: '100%',
					padding: 0,
					height: 'auto',
					lineHeight: 'normal'
				}}>
					<nav className="w-full flex items-center bg-blue-600 text-white p-1">
						<div className='flex-shrink-0 flex flex-col items-center px-4'>
							<span className="text-sm">Caja 1</span>
							<span className="text-sm">{formatTime(time)}</span>
						</div>

						<div className="flex flex-1 overflow-x-auto whitespace-nowrap py-2 hide-scrollbar justify-center">
							<div className="inline-flex space-x-1 px-2">
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
								<button className={`px-4 py-2 hover:bg-blue-700 hover:text-white rounded flex items-center gap-1 ${basePath == "cut" && "bg-white text-blue-700"}`} onClick={() => onClickMenu("cut")}> 
									<img width="35" height="35" src="https://img.icons8.com/ultraviolet/40/empty-box.png" alt="empty-box" />
									<span>Corte de Caja</span>
								</button>
							</div>
						</div>
						{/* Botón cerrar sesión */}
						<div className="flex-shrink-0 flex flex-col items-center px-4">
							<button onClick={signOut} style={{ background: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 16px', cursor: 'pointer' }}>
								Cerrar sesión
							</button>
						</div>
					</nav>
				</Header>

				<Layout style={{ marginTop: '64px', background: '#f0f2f5' }}>
					<Content style={{
						background: '#fff',
						minHeight: 'calc(100vh - 75px)',
					}}>
						<Outlet />
					</Content>
				</Layout>

			</Layout>
		</>


	);
};

export default LayoutComponent;
