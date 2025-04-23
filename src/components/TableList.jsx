import React, { useState, useEffect, useRef } from 'react';
import { Table, Spin, Button, Input, Empty, Drawer, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { Code, FormControl, FormLabel, Box } from '@chakra-ui/react';
import { Radio, RadioGroup, Stack } from "@chakra-ui/react";
import BottomMessage from './BottomMessage';
import CustomEmpty from './CustomEmpty';

const TableList = ({
    columns,
    data,
    label,
    loading,
    newItem,
    searchItem,
    changePage,
    search,
    current,
    total,
    selectedProvider,
    setSelectedProvider,
    onOpen,
    setProvider,
    isOpen,
    deleteItem,
    openFilter,
    setOpenFilter,
    isChecked,
    setIsChecked,
}) => {

    const [selectedRowKey, setSelectedRowKey] = useState(null);
    const tableRef = useRef(null);

    const handleRowClick = (record) => {
        setSelectedRowKey(record.id);
        setSelectedProvider(record?.id);
    };

    const handleSearch = (value) => {
        searchItem(value);
        if (value === "") setSelectedRowKey(null);
        else setSelectedRowKey(data[0]?.id);
    };

    const handleNew = () => {
        setSelectedRowKey(null);
        setSelectedProvider(null);
        setProvider(null);
        onOpen();
    };

    const handleEdit = () => {
        if (selectedRowKey) {
            setSelectedProvider(selectedRowKey);
            const item = data.find((item) => item?.id === selectedRowKey);
            setProvider(item);
            onOpen();
        } else {
            console.log('Selecciona una fila para editar');
        }
    };

    const handleDelete = () => {
        if (selectedRowKey) {
            deleteItem(selectedRowKey);
        } else {
            console.log('Selecciona una fila para eliminar');
        }
    };

    const handleKeyDown = (event) => {
        if (!tableRef.current) return;

        const currentIndex = data.findIndex((item) => item.id === selectedRowKey);

        switch (event.key) {
            case 'ArrowDown':
                if (currentIndex + 1 < data.length)
                    setSelectedRowKey(data[currentIndex + 1].id);
                break;
            case 'ArrowUp':
                if (currentIndex - 1 >= 0)
                    setSelectedRowKey(data[currentIndex - 1].id);
                break;
            case 'Enter':
                event.preventDefault();
                if (selectedRowKey && !isOpen && data.length > 0) handleEdit();
                break;
            case 'Delete':
            case 'Backspace':
                if (selectedRowKey && selectedProvider) handleDelete();
                break;
            case 'Escape':
                setSelectedRowKey(null);
                break;
            default:
                // Ctrl + N para nuevo
                if (event.ctrlKey && event.key === 'n') {
                    event.preventDefault();
                    handleNew();
                }
                break;
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedRowKey, data]);

    const handleTableChange = (pagination) => {
        if (pagination.current !== undefined) changePage(pagination.current);
    };

    const handleSubmitFilter = () => onClose();
    const onClose = () => setOpenFilter(false);

    const handleCheckboxChange = (e) => {
        setIsChecked(e);
        setSelectedRowKey(null);
    };

    return (
        <div ref={tableRef} className='w-full min-h-[200px] flex flex-col'>

            {/* Barra superior con búsqueda y botones */}
            <div className='flex flex-wrap gap-2 justify-between items-center mb-4'>
                <Input
                    placeholder='Buscar...'
                    prefix={<SearchOutlined />}
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className='w-full sm:w-[400px]'
                    tabIndex={0}
                    aria-label="Buscar elemento"
                />
                <div className='flex gap-2 flex-wrap justify-end'>
                    {newItem && (
                        <Tooltip title="Ctrl + N">
                            <Button
                                type='primary'
                                icon={<PlusOutlined />}
                                onClick={handleNew}
                                size='middle'
                                aria-label="Agregar nuevo"
                            >
                                Agregar
                            </Button>
                        </Tooltip>
                    )}
                    <Tooltip title="Enter / Doble click">
                        <Button
                            type='default'
                            icon={<EditOutlined />}
                            onClick={handleEdit}
                            disabled={!selectedRowKey}
                            tabIndex={2}
                            aria-label="Editar seleccionado"
                        >
                            Editar
                        </Button>
                    </Tooltip>
                    <Tooltip title="Supr / Backspace">
                        <Button
                            type='default'
                            icon={<DeleteOutlined />}
                            onClick={handleDelete}
                            disabled={!selectedRowKey}
                            tabIndex={3}
                            aria-label="Eliminar seleccionado"
                        />
                    </Tooltip>
                    <Tooltip title="Filtrar">
                        <Button
                            type='default'
                            icon={<FilterOutlined />}
                            onClick={setOpenFilter}
                            tabIndex={4}
                            aria-label="Abrir filtros"
                        />
                    </Tooltip>
                </div>
            </div>

            {loading ? (
                <Spin size="large" fullscreen tip="Cargando..." />
            ) : (
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    className='w-full custom-table pb-16'
                    bordered
                    size="small"
                    pagination={{
                        position: ['bottomLeft'],
                        current: current,
                        pageSize: 10,
                        total: total,
                    }}
                    onChange={handleTableChange}
                    onRow={(record) => ({
                        onClick: () => handleRowClick(record),
                        onDoubleClick: () => handleEdit(),
                    })}
                    rowClassName={(record) =>
                        record.id === selectedRowKey ? 'bg-blue-100' : ''
                    }
                    locale={{ emptyText: <CustomEmpty onAddNew={handleNew} /> }}
                />
            )}

            <BottomMessage>
                {!selectedRowKey ? (
                    <>
                        Usa <Code>↓</Code> y <Code>↑</Code> para moverte.  
                        <Code>Enter</Code> para editar, <Code>Ctrl + N</Code> para agregar nuevo.
                    </>
                ) : (
                    <>
                        <Code fontWeight="bold">↓</Code> y <Code fontWeight="bold">↑</Code> para navegar,{" "}
                        <Code fontWeight="bold">Supr</Code> para eliminar,{" "}
                        <Code fontWeight="bold">Enter</Code> o doble click para modificar.
                    </>
                )}
            </BottomMessage>

            {/* Filtro lateral */}
            <Drawer title="Búsqueda avanzada" onClose={onClose} open={openFilter}>
                <Box as="form" className='flex flex-col h-[calc(100vh-105px)] justify-between' onSubmit={handleSubmitFilter}>
                    <div className='flex flex-col gap-4'>
                        <FormControl>
                            <FormLabel>Nombre</FormLabel>
                            <Input
                                name="company"
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Representante o compañía"
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>{label} archivados</FormLabel>
                            <RadioGroup value={isChecked} onChange={handleCheckboxChange}>
                                <Stack direction='column'>
                                    <Radio value="false">Activos</Radio>
                                    <Radio value="true">Archivados</Radio>
                                </Stack>
                            </RadioGroup>
                        </FormControl>
                    </div>
                </Box>
            </Drawer>
        </div>
    );
};

export default TableList;
