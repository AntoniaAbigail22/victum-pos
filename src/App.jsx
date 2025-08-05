import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import LayoutComponent from './components/Layout';
import Configuracion from './pages/Configuracion';
import CorteCaja from './pages/CorteCaja';
import './App.css';
import DirectoryMenu from './components/DirectoryMenu';

import Login from './components/Login';
import { store, persistor } from './redux/store';
import Context from './redux/Context';
import InventoryMenu from './components/InventoryMenu';
import DirectoryPage from './pages/DirectoryPage';
import InventoryPage from './pages/inventory/InventoryPage';
import InventoryPageSave from './pages/inventory/InventoryPageSave';
import ProductsPage from './pages/inventory/ProductsPage';
import WarehousesPage from './pages/inventory/WarehousesPage';
import DepartmentsPage from './pages/inventory/DepartmentsPage';
import Ventas from './pages/Ventas';

export const ROUTES = {
    DIRECTORY: 'directory',
    INVENTORY: 'inventory',
    SALES: 'sales',
    COURT: 'court',
    COG: 'configuration'
};

const App = () => {

    const initialTokenState = localStorage.getItem('userTokenVPOS') === 'true';
    const [userToken, setUserToken] = useState(initialTokenState);
    
    const authContext = useMemo(() => ({
        signIn: () => {
            setUserToken(true);
            localStorage.setItem('userTokenVPOS', 'true');
        },
        signUp: () => {
            setUserToken(true);
            localStorage.setItem('userTokenVPOS', 'true');
        },
        signOut: () => {
            setUserToken(false);
            localStorage.setItem('userTokenVPOS', 'false'); // Cambiado de removeItem a setItem 'false'
        },
    }), []);
    
    useEffect(() => {

    }, [userToken]);

    return (
        <Context.Provider value={authContext}>
            {!userToken ? (
                <Routes>
                    <Route path="/" index element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="*" index element={<Login />} />
                </Routes>
            ) : (
                <Routes>
                    <Route element={<LayoutComponent />}>
                        <Route path={`/`} element={<Ventas />} />
                        <Route path={`*`} element={<Ventas />} />
                        <Route path={`/${ROUTES.SALES}`} element={<Ventas />} />
                        <Route path={`/${ROUTES.COG}`} element={<Configuracion />} />
                        <Route path={`/${ROUTES.COURT}`} element={<CorteCaja />} />
                        <Route path={`/${ROUTES.INVENTORY}`} element={<InventoryMenu/> } />
                        <Route path={`/${ROUTES.INVENTORY}/products`} element={<ProductsPage />} />
                        <Route path={`/${ROUTES.INVENTORY}/warehouses`} element={<WarehousesPage />} />
                        <Route path={`/${ROUTES.INVENTORY}/departments`} element={<DepartmentsPage />} />
                        <Route path={`/${ROUTES.INVENTORY}/warehouses/saves`} element={<InventoryPageSave type={5}/>} />
                        <Route path={`/${ROUTES.INVENTORY}/movement-report`} element={<InventoryPage type={4} />} />
                        <Route path={`/${ROUTES.DIRECTORY}`} element={<DirectoryMenu />} />
                        <Route path={`/${ROUTES.DIRECTORY}/providers`} element={<DirectoryPage type={1} />} />
                        <Route path={`/${ROUTES.DIRECTORY}/employees`} element={<DirectoryPage type={2} />} />
                        <Route path={`/${ROUTES.DIRECTORY}/managers`} element={<DirectoryPage type={3} />} />
                        <Route path={`/${ROUTES.DIRECTORY}/clients`} element={<DirectoryPage type={4} />} />
                    </Route>
                </Routes>
            )}
        </Context.Provider>
    );
};

export default App;