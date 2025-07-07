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
//import InventoryPage from './pages/InventoryPage';
import DepartmentsPage from './pages/DepartmentsPage';
import Login from './components/Login';
import { store, persistor } from './redux/store';
import Context from './redux/Context';
import ProductsMenu from './components/ProductsMenu';
import DirectoryPage from './pages/DirectoryPage';
import InventoryPage from './pages/inventory/InventoryPage';
import InventoryPageSave from './pages/inventory/InventoryPageSave';
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
        // Este efecto ya no es necesario porque las actualizaciones
        // se manejan en las funciones de signIn/signUp/signOut
        // localStorage.setItem('userTokenVPOS', userToken.toString());
    }, [userToken]);

    return (
        <Context.Provider value={authContext}>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    {!userToken ? (
                        <Routes>
                            <Route path="/" index element={<Login />} />
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
                                
                                <Route path={`/${ROUTES.INVENTORY}`} element={<ProductsMenu/> } />
                                <Route path={`/${ROUTES.INVENTORY}/products`} element={<InventoryPage type={1} />} />
                                <Route path={`/${ROUTES.INVENTORY}/:inventory_id`} element={<InventoryPage type={1} />} />
                                <Route path={`/${ROUTES.INVENTORY}/warehouses`} element={<InventoryPage type={2} />} />
                                <Route path={`/${ROUTES.INVENTORY}/warehouses/saves`} element={<InventoryPageSave type={5}/>} />
                                <Route path={`/${ROUTES.INVENTORY}/departments`} element={<InventoryPage type={3} />} />
                                <Route path={`/${ROUTES.INVENTORY}/movement-report`} element={<InventoryPage type={4} />} />
                                

                                <Route path={`/${ROUTES.DIRECTORY}`} element={<DirectoryMenu />} />
                                <Route path={`/${ROUTES.DIRECTORY}/providers`} element={<DirectoryPage type={1} />} />
                                <Route path={`/${ROUTES.DIRECTORY}/employees`} element={<DirectoryPage type={2} />} />
                                <Route path={`/${ROUTES.DIRECTORY}/managers`} element={<DirectoryPage type={3} />} />
                                <Route path={`/${ROUTES.DIRECTORY}/clients`} element={<DirectoryPage type={4} />} />
                            </Route>
                        </Routes>
                    )}
                </PersistGate>
            </Provider>
        </Context.Provider>
    );
};

export default App;