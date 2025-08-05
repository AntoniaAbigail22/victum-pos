import React, { useState, useEffect } from 'react';
import { useContext } from 'react';
import Context from '../redux/Context';
import { Layout } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const { Header, Content } = Layout;

const LayoutComponent = () => {

	const navigate = useNavigate();
	const { signOut, user } = useContext(Context); // user para nombre

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

const [open, setOpen] = useState(false);
const menuRef = React.useRef(null);
const userName = user?.name || "Atiende";

// Cerrar menú al hacer click fuera
useEffect(() => {
  function handleClickOutside(event) {
	if (menuRef.current && !menuRef.current.contains(event.target)) {
	  setOpen(false);
	}
  }
  if (open) document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [open]);

const handleConfig = () => {
  setOpen(false);
  navigate('/configuracion');
};
const handleSignOut = () => {
  setOpen(false);
  signOut();
};

return (
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
						{/* Menú usuario tipo punto de venta */}
						<div className="flex-shrink-0 flex flex-col items-center px-4 relative" ref={menuRef}>
						  <button
							onClick={() => setOpen((v) => !v)}
							className="flex items-center gap-2 focus:outline-none hover:bg-blue-700 rounded px-2 py-1"
							title="Usuario"
						  >
							<img
							  src="https://img.icons8.com/ios-filled/40/ffffff/user-male-circle.png"
							  alt="user"
							  width="32"
							  height="32"
							  className="rounded-full border border-white"
							/>
							<span className="hidden md:inline text-sm font-semibold">{userName}</span>
							<svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M1.5 6l6 6 6-6"/></svg>
						  </button>
						  {open && (
							<div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-lg z-50 animate-fade-in">
							  <div className="px-4 py-2 border-b border-gray-200">
								<div className="font-semibold">Atiende: {userName}</div>
							  </div>
							  <button
								className="w-full text-left px-4 py-2 hover:bg-gray-100"
								onClick={handleConfig}
							  >
								<span className="inline-block mr-2">⚙️</span> Configuración
							  </button>
							  <button
								className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
								onClick={handleSignOut}
							  >
								<span className="inline-block mr-2">🚪</span> Cerrar sesión
							  </button>
							</div>
						  )}
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
	   );
};

export default LayoutComponent;
