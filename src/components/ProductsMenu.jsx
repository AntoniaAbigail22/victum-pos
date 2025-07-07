import React from 'react';
import MainMenu from './MainMenu';

const options = [
    {
        title: 'Productos',
        description: 'Gestión de productos y stock',
        image: 'https://img.icons8.com/fluency/96/000000/product.png',
        url: 'products'
    },
    {
        title: 'Almacén',
        description: 'Gestión de almacenes y ubicaciones',
        image: 'https://img.icons8.com/fluency/96/000000/warehouse.png',
        url: 'warehouses'
    },
    {
        title: 'Categorías',
        description: 'Organización los productos por categoría',
        image: 'https://img.icons8.com/fluency/96/000000/department.png',
        url: 'departments'
    },
    /*{
        title: 'Reporte de Movimientos',
        description: 'Registro y seguimiento de movimientos',
        image: 'https://img.icons8.com/fluency/96/000000/document.png',
        url: 'movement-report'
    },*/

];

const ProductsMenu = () => {

    const label = 'Inventario';
    const links = [{ href: '#', label }]
    const navigator = 'inventory';

    return <MainMenu options={options} navigator={navigator} links={links} />
};

export default ProductsMenu;