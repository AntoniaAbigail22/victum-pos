import React from 'react';
import MainMenu from './MainMenu';

const options = [
    {
        title: 'Empleados',
        description: 'Gestión de empleados y sus datos',
        image: 'https://img.icons8.com/fluency/96/000000/user-group-man-woman.png',
        url: 'employees'
    },
    {
        title: 'Managers',
        description: 'Información y herramientas para managers',
        image: 'https://img.icons8.com/fluency/96/000000/manager.png',
        url: 'managers'
    },
    {
        title: 'Clientes',
        description: 'Datos y seguimiento de clientes',
        image: 'https://img.icons8.com/fluency/96/000000/conference.png',
        url: 'clients'
    },
    {
        title: 'Proveedores',
        description: 'Gestión de proveedores y contratos',
        image: 'https://img.icons8.com/fluency/96/000000/supplier.png',
        url: 'providers'
    },
];

const DirectoryMenu = () => {

    const label = 'Directorio';
    const links = [ { href: '#', label }]
    const navigator = 'directory';

    return <MainMenu options={options} navigator={navigator} links={links} />
};

export default DirectoryMenu;