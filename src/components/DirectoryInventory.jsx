import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Code, Text } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { ChevronRightIcon } from '@chakra-ui/icons'

const options = [
    {
        title: 'Productos',
        description: 'Gestión de productos y stock',
        image: 'https://img.icons8.com/fluency/96/000000/product.png',
        url: 'products'
    },
    {
        title: 'Departamentos',
        description: 'Organización y estructura de departamentos',
        image: 'https://img.icons8.com/fluency/96/000000/department.png',
        url: 'departments'
    },
    {
        title: 'Reporte de Movimientos',
        description: 'Registro y seguimiento de movimientos',
        image: 'https://img.icons8.com/fluency/96/000000/document.png',
        url: 'movement-report'
    }
];

const DirectoryInventory = () => {
    const [selectedRowKey, setSelectedRowKey] = useState(null);
    const tableRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (selectedRowKey && tableRef.current) {
            const selectedElement = tableRef.current.querySelector(
                `[data-url="${selectedRowKey}"]`
            );
            if (selectedElement) {
                selectedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [selectedRowKey]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedRowKey]);

    const handleKeyDown = (event) => {
        if (!tableRef.current) return;
        const currentIndex = options.findIndex((item) => item?.url === selectedRowKey);
        const columns = 3;
    
        if (event.key === 'ArrowDown' || event.key === 'Tab') {
            event.preventDefault();
            const nextIndex = currentIndex + columns;
            if (nextIndex < options.length) {
                setSelectedRowKey(options[nextIndex]?.url);
            }
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            const prevIndex = currentIndex - columns;
            if (prevIndex >= 0) {
                setSelectedRowKey(options[prevIndex]?.url);
            }
        }
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            const prevIndex = currentIndex - 1;
            if (prevIndex >= 0 && prevIndex % columns < currentIndex % columns) {
                setSelectedRowKey(options[prevIndex]?.url);
            }
        } else if (event.key === 'ArrowRight' || event.key === 'Tab') {
            event.preventDefault();
            const nextIndex = currentIndex + 1;
            if (nextIndex < options.length && nextIndex % columns > currentIndex % columns) {
                setSelectedRowKey(options[nextIndex]?.url);
            }
        }
        if (event.key === 'Enter') {
            event.preventDefault();
            if (selectedRowKey) {
                navigate(`/inventory/${selectedRowKey}`);
            }
        }
    };

    return (
        <div className="w-full flex flex-col p-2">
            <Box width="100%">
                <Breadcrumb spacing='8px' px={1} separator={<ChevronRightIcon color='gray.500' />}>
                    <BreadcrumbItem>
                        <BreadcrumbLink href='#'>Inventario</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
            </Box>
            <div className="flex justify-center items-center h-[85vh]">
                <div ref={tableRef} className="grid sm:grid-cols-1 grid-cols-1 md:grid-cols-3 gap-6 p-6 max-w-4xl w-full">
                    {options.map((option, index) => (
                        <NavLink
                            key={`inventory-${option?.url}-${index}`}
                            to={`/inventory/${option?.url}`}
                            data-url={option.url}
                            className={({ isActive }) =>
                                `block bg-white md:p-6 p-3 rounded-lg shadow-md text-center
                                hover:shadow-lg transition-shadow duration-300 
                                ${isActive || selectedRowKey === option.url 
                                    ? 'bg-blue-500 border-2 border-blue-700'
                                    : 'text-gray-700 hover:bg-gray-200'}`
                            }
                        >
                            <img
                                src={option.image}
                                alt={option.title}
                                className="w-24 h-24 mx-auto mb-4"
                                loading="lazy"
                            />
                            <h3 className="text-xl font-semibold mb-2">{option.title}</h3>
                            <p className="text-gray-600">{option.description}</p>
                        </NavLink>
                    ))}
                </div>
                <Box mt={2} width="full" position={'absolute'} left={10}>
                    <div className='fixed bottom-0 left-0 bg-slate-200 w-full p-1'>
                        <Text fontSize="xs" fontWeight="thin" color="gray.600">
                            <Code fontWeight="bold" colorScheme='blackAlpha'>TAB ↓ ↑ → ←</Code>, para navegar entre las opciones, {" "}
                            <Code fontWeight="bold" colorScheme='blackAlpha'>Enter</Code> para seleccionar
                        </Text>
                    </div>
                </Box>
            </div>
        </div>
    )
};

export default DirectoryInventory;
