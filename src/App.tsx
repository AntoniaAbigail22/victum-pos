// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LayoutComponent from './components/Layout';
import Ventas from './pages/Ventas';
import Clientes from './pages/Clientes';
import Inventario from './pages/Inventario';
import Proveedores from './pages/Proveedores';
import Configuracion from './pages/Configuracion';
import CorteCaja from './pages/CorteCaja';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LayoutComponent />}>
          <Route index element={<Ventas />} />
          <Route path="ventas" element={<Ventas />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="inventario" element={<Inventario />} />
          <Route path="proveedores" element={<Proveedores />} />
          <Route path="configuracion" element={<Configuracion />} />
          <Route path="corte" element={<CorteCaja />} />
          <Route path="*" element={<h2>Página no encontrada</h2>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
