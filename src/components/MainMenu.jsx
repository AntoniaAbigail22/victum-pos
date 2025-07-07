import { Box, Code, Text } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import BreadcrumbHeader from './BreadcrumbHeader';
import BottomMessage from './BottomMessage';
import Codes from './Codes';
import { skipHandleKeyDown } from '../libs/Extras';


const MainMenu = ({ options, navigator, links }) => {
    const navigate = useNavigate();
    const [selectedRowKey, setSelectedRowKey] = useState(null);
    const tableRef = useRef(null);
    const columns = 3;

    useEffect(() => {
        if (selectedRowKey && tableRef.current) {
            const selectedElement = tableRef.current.querySelector(`[data-url="${selectedRowKey}"]`);
            if (selectedElement) selectedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [selectedRowKey]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedRowKey]);

    const handleKeyDown = (event) => {
        console.log("🚀 ~ handleKeyDown ~ event main:", event)
        if (skipHandleKeyDown(event, ['ArrowDown', 'ArrowUp','Tab', 'ArrowLeft', 'ArrowRight', 'Enter'])) return;
        if (!tableRef.current) return;
        const currentIndex = options.findIndex((item) => item?.url === selectedRowKey);
        event.preventDefault();
        if (event.key === 'ArrowDown' || event.key === 'Tab') {
            const nextIndex = currentIndex + columns;
            if (nextIndex < options.length) setSelectedRowKey(options[nextIndex]?.url);
        } else if (event.key === 'ArrowUp') {
            const prevIndex = currentIndex - columns;
            if (prevIndex >= 0) setSelectedRowKey(options[prevIndex]?.url);
        }
        if (event.key === 'ArrowLeft') {
            const prevIndex = currentIndex - 1;
            if (prevIndex >= 0 && prevIndex % columns < currentIndex % columns) setSelectedRowKey(options[prevIndex]?.url);
        } else if (event.key === 'ArrowRight' || event.key === 'Tab') {
            const nextIndex = currentIndex + 1;
            if (nextIndex < options.length && nextIndex % columns > currentIndex % columns) setSelectedRowKey(options[nextIndex]?.url);
        }
        if (event.key === 'Enter' && selectedRowKey) navigate(`/${navigator}/${selectedRowKey}`);
    };

    return (
        <div className="w-full flex flex-col p-2">
            <BreadcrumbHeader links={links} />
            <div className="flex justify-center items-center h-[85vh]">
                <div ref={tableRef} className="grid sm:grid-cols-1 grid-cols-1 md:grid-cols-3 gap-6 p-6 max-w-4xl w-full">
                    {options.map((option, index) => (
                        <NavLink
                            key={`${navigator}-${option?.url}-${index}`}
                            to={`/${navigator}/${option?.url}`}
                            data-url={option?.url}
                            className={({ isActive }) =>
                                `block bg-white md:p-6 p-3 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300 
                                ${isActive || selectedRowKey === option?.url
                                    ? 'bg-blue-500 border-2 border-blue-700'
                                    : 'text-gray-700 hover:bg-gray-200'}`
                            }
                        >
                            <img
                                src={option?.image}
                                alt={option?.title}
                                className="w-24 h-24 mx-auto mb-4"
                                loading="lazy"
                            />
                            <h3 className="text-xl font-semibold mb-2">{option?.title}</h3>
                            <p className="text-gray-600">{option?.description}</p>
                        </NavLink>
                    ))}
                </div>
                <BottomMessage>
                    <Codes label={'TAB ↓ ↑ → ←'}/> para navegar entre las opciones, {" "}
                    <Codes label={'Enter'}/> para seleccionar
                </BottomMessage>
            </div>
        </div>
    )
};

export default MainMenu;
