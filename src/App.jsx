// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LayoutComponent from './components/Layout';
import Ventas from './pages/Ventas';
import Inventario from './pages/Inventario';
import Configuracion from './pages/Configuracion';
import CorteCaja from './pages/CorteCaja';
import './App.css'
import DirectoryMenu from './components/DirectoryMenu';
import DirectoryInventory from './components/DirectoryInventory'
import ProvidersPage from './pages/ProvidersPage';
import InventoryPage from './pages/InventoryPage';

const directory = 'directory'
const inventory = 'inventory'
const sales = 'sales'

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<LayoutComponent />}>
                <Route index element={<Ventas />} />
                <Route path={`/${sales}`} element={<Ventas />} />

                <Route path="configuracion" element={<Configuracion />} />
                <Route path="corte" element={<CorteCaja />} />
                <Route path="*" element={<h2>Página no encontrada</h2>} />

                <Route path={`/${inventory}`} element={<DirectoryInventory />} />
                <Route path={`/${directory}/:inventory_id`} element={<InventoryPage />} />

                <Route path={`/${directory}`} element={<DirectoryMenu />} />
                <Route path={`/${directory}/employees`} element={<ProvidersPage />} />
                <Route path={`/${directory}/managers`} element={<ProvidersPage />} />
                <Route path={`/${directory}/clients`} element={<ProvidersPage />} />
                <Route path={`/${directory}/providers`} element={<ProvidersPage />} />
            </Route>
        </Routes>
    );
};

export default App;
