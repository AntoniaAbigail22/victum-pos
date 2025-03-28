import React, { useState, useEffect, useRef } from 'react';
import { Table, Spin, Button, Input, Empty, Drawer } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { Code, FormControl, FormLabel, Box } from '@chakra-ui/react'
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
        setSelectedProvider(record?.id)
    };

    const handleSearch = (value) => {
        searchItem(value);
        if (value === "") setSelectedRowKey(null);
        else setSelectedRowKey(data[0].id);
    };
    const handleNew = () => {
        console.log('Nuevo');
        setSelectedRowKey(null);
        setSelectedProvider(null)
        setProvider(null);
        onOpen()
    };

    const handleEdit = () => {
        if (selectedRowKey) {
            console.log("🚀 ~ handleEdit ~ selectedRowKey:", selectedRowKey)
            setSelectedProvider(selectedRowKey)
            let item = data.find((item) => item?.id === selectedRowKey)
            setProvider(item);
            console.log("🚀 ~ handleEdit ~ item:", item)
            onOpen()
        } else console.log('Selecciona una fila para editar');
    };

    const handleDelete = () => {
        if (selectedRowKey) {
            console.log('Eliminar:', selectedRowKey);
            deleteItem(selectedRowKey)
        } else console.log('Selecciona una fila para eliminar');
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedRowKey, data]);

    const handleKeyDown = (event) => {
        if (!tableRef.current) return;

        const currentIndex = data.findIndex((item) => item.id === selectedRowKey);

        if (event.key === 'ArrowDown') {
            const nextIndex = currentIndex + 1;
            if (nextIndex < data.length) setSelectedRowKey(data[nextIndex].id);
        } else if (event.key === 'ArrowUp') {
            const prevIndex = currentIndex - 1;
            if (prevIndex >= 0) setSelectedRowKey(data[prevIndex].id);
        }
        if (event.key === 'Enter') {
            event.preventDefault();
            if (selectedRowKey) {
                console.log("🚀 🚀🚀🚀🚀 :", isOpen)
                if (isOpen == false && data.length > 0) handleEdit();
            }
        } else if (event.key === 'Delete' || event.key === 'Backspace') {
            if (selectedRowKey && selectedProvider) handleDelete();
        } else if (event.key == "Escape") setSelectedRowKey(null)
    };

    const handleTableChange = (pagination) => {
        if (pagination.current !== undefined) changePage(pagination.current);
    };

    const handleSubmitFilter = () => onClose();
    const onClose = () => setOpenFilter(false);

    const handleCheckboxChange = (e) => {
        setIsChecked(e);
        setSelectedRowKey(null)
    };

    return (
        <div ref={tableRef} className='w-full min-h-[200px] flex flex-col'>
            <div className='flex justify-between items-center mb-4 gap-1'>
                <Input
                    placeholder='Buscar...'
                    prefix={<SearchOutlined />}
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    tabIndex={0}
                    className='w-full min-w-[400px]'
                />
                <div className='flex gap-1'>
                    <Button
                        type='default'
                        icon={<EditOutlined />}
                        onClick={handleEdit}
                        disabled={!selectedRowKey}
                        tabIndex={2}
                    >
                        Editar
                    </Button>
                    <Button
                        type='default'
                        icon={<DeleteOutlined />}
                        onClick={handleDelete}
                        disabled={!selectedRowKey}
                        tabIndex={3}
                    />
                    <Button
                        type='default'
                        icon={<FilterOutlined />}
                        onClick={setOpenFilter}
                        tabIndex={4}
                    />
                </div>
            </div>

            {newItem &&
                <Button
                    type='primary'
                    icon={<PlusOutlined />}
                    onClick={handleNew}
                    size='large'
                    className='fixed bottom-9 right-2 shadow-lg rounded z-10'
                >
                    {!selectedRowKey && 'Nuevo'}
                </Button>
            }

            {loading ? <Spin size="large" fullscreen tip={`Cargando...`}/>
                : <Table
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
                        //showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} elementos`,
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
            }
            <BottomMessage>
                {!selectedRowKey ? "Selecciona un elemento para ver las opciones disponibles" :
                    <>
                        <Code fontWeight="bold" colorScheme='blackAlpha'>↓</Code> para navegar hacia abajo,{" "}
                        <Code fontWeight="bold" colorScheme='blackAlpha'>↑</Code> para navegar hacia arriba,{" "}
                        <Code fontWeight="bold" colorScheme='blackAlpha'>Supr/Delete</Code> para eliminar,{" "}
                        <Code fontWeight="bold" colorScheme='blackAlpha'>Enter</Code> o <Code fontWeight="bold" colorScheme='blackAlpha'>Doble Click</Code> para modificar
                    </>
                }
            </BottomMessage>
            <Drawer title="Búsqueda avanzada" onClose={onClose} open={openFilter}>
                <Box as="form" className='flex flex-col h-[calc(100vh-105px)] justify-between' onSubmit={handleSubmitFilter}>
                    <div className='flex flex-col gap-4'>
                        <FormControl>
                            <FormLabel>Nombre</FormLabel>
                            <Input
                                name="company"
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Representante o compañia"
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