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
import ProvidersPage from './pages/ProvidersPage';

const App = () => {
    return (
        <Routes>
            <Route path="/" element={<LayoutComponent />}>
                <Route index element={<Ventas />} />
                <Route path="ventas" element={<Ventas />} />
                <Route path="inventario" element={<Inventario />} />

                <Route path="configuracion" element={<Configuracion />} />
                <Route path="corte" element={<CorteCaja />} />
                <Route path="*" element={<h2>Página no encontrada</h2>} />

                <Route path="/directory" element={<DirectoryMenu />} />
                <Route path="/directory/employees" element={<ProvidersPage />} />
                <Route path="/directory/managers" element={<ProvidersPage />} />
                <Route path="/directory/clients" element={<ProvidersPage />} />
                <Route path="/directory/providers" element={<ProvidersPage />} />
            </Route>
        </Routes>
    );
};

export default App;
