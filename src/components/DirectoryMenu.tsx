import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Code, Text } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { ChevronRightIcon } from '@chakra-ui/icons'

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

    const [selectedRowKey, setSelectedRowKey] = useState<React.Key | null>(null);
    const tableRef = useRef<HTMLDivElement>(null);

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

    const handleKeyDown = (event: KeyboardEvent) => {
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
                navigate(`/directory/${selectedRowKey}`);
            }
        }
    };

    return (
        <div className="w-full flex flex-col p-2">
            <Box width="100%">
                <Breadcrumb spacing='8px' px={1} separator={<ChevronRightIcon color='gray.500' />}>
                    <BreadcrumbItem>
                        <BreadcrumbLink href='#'>Directorio</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
            </Box>
            <div className="flex justify-center items-center h-[85vh]">
                <div ref={tableRef} className="grid sm:grid-cols-1 grid-cols-1 md:grid-cols-3 gap-6 p-6 max-w-4xl w-full">
                    {options.map((option, index) => (
                        <NavLink
                            key={`directory-${option?.url}-${index}`}
                            to={`/directory/${option?.url}`}
                            data-url={option.url} 
                            className={({ isActive }) =>
                                `block 
                                bg-white 
                                md:p-6 
                                p-3
                                rounded-lg 
                                shadow-md text-center
                                hover:shadow-lg transition-shadow duration-300 
                                ${isActive || selectedRowKey === option.url 
                                    //? 'bg-blue-500 text-white' 
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
                {/*<div className="flex-1 p-6">
                <Outlet />
            </div>*/}
                <Box mt={2} width="full" position={'absolute'} left={10}>
                    <div className='fixed bottom-0 left-0 bg-slate-200 w-full p-1'>
                        <Text fontSize="sm" fontWeight="thin" color="gray.600">
                            <Text fontSize="xs" fontWeight="thin" color="gray.600">
                               
                                <Code fontWeight="bold" colorScheme='blackAlpha'>TAB ↓ ↑ → ←</Code>, para navegar entre las opciones, {" "}
                                <Code fontWeight="bold" colorScheme='blackAlpha'>Enter</Code> para seleccionar
                            </Text>
                        </Text>
                    </div>
                </Box>

            </div>
        </div>
    )
};

export default DirectoryMenu;
