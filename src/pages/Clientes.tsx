// src/pages/Clientes.tsx
import React from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const options = [
    {
        title: 'Empleados',
        description: 'Gestión de empleados y sus datos.',
        image: 'https://img.icons8.com/fluency/96/000000/user-group-man-woman.png',
        url: '/providers'
    },
    {
        title: 'Managers',
        description: 'Información y herramientas para managers.',
        image: 'https://img.icons8.com/fluency/96/000000/manager.png',
        url: '/providers'
    },
    {
        title: 'Clientes',
        description: 'Datos y seguimiento de clientes.',
        image: 'https://img.icons8.com/fluency/96/000000/conference.png',
        url: '/providers'
    },
    {
        title: 'Proveedores',
        description: 'Gestión de proveedores y contratos.',
        image: 'https://img.icons8.com/fluency/96/000000/supplier.png',
        url: '/providers'
    },
];

const Clientes: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="flex justify-center items-center h-[90vh]">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-6 max-w-4xl w-full">
                {options.map((option, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow duration-300"
                        onClick={() => navigate(option?.url) }
                    >
                        <img
                            src={option.image}
                            alt={option.title}
                            className="w-24 h-24 mx-auto mb-4"
                            loading="lazy"
                        />
                        <h3 className="text-xl font-semibold mb-2">{option.title}</h3>
                        <p className="text-gray-600">{option.description}</p>
                    </div>
                ))}
            </div>
        </div>
    )
};

export default Clientes;
