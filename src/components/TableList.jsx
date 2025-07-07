import React, { useState, useEffect, useRef } from 'react';
import { Table, Spin, Button, Input, Empty, Drawer, Tooltip } from 'antd';
import { Dropdown, Menu, Checkbox } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons';
import { Code, FormControl, FormLabel, Box, Text } from '@chakra-ui/react';
import { Radio, RadioGroup, Stack } from "@chakra-ui/react";
import BottomMessage from './BottomMessage';
import CustomEmpty from './CustomEmpty';
import Codes from './Codes';
import { skipHandleKeyDown } from '../libs/Extras';
import { Collapse } from 'antd';
import { parse } from 'date-fns';
const { Panel } = Collapse;

const TableList = ({
    columns,
    visibleColumns = [],
    setVisibleColumns,
    data,
    label,
    loading,
    newItem,
    searchItem,
    changePage,
    search,
    current,
    total,
    selectedElement,
    setSelectedElement,
    onOpen,
    setElement,
    isOpen,
    deleteItem,
    openFilter,
    setOpenFilter,
    isChecked,
    setIsChecked,
    expandexRow,
    columnsExtras
}) => {

    const [selectedRowKey, setSelectedRowKey] = useState(null);
    const [expandedRowKey, setExpandedRowKey] = useState(null);
    const tableRef = useRef(null);

    const handleRowClick = (record) => {
        console.log("🚀 ~ handleRowClick ~ record:", record)
        setSelectedRowKey(record?.id);
        setSelectedElement(record?.id);
        setExpandedRowKey(record?.id);
    };

    const handleSearch = (value) => {
        searchItem(value);
        if (value === "") setSelectedRowKey(null);
        else setSelectedRowKey(data[0]?.id);
    };

    const handleNew = () => {
        setSelectedRowKey(null);
        setSelectedElement(null);
        setElement(null);
        onOpen();
    };

    const handleEdit = (record) => {
        console.log("🚀 ~ handleEdit ~ selectedRowKey:", selectedRowKey, record)
        let id = selectedRowKey || record?.id;
        if (id) {
            setSelectedElement(id);
            const item = data.find((item) => item?.id === id);
            setElement(item);

            console.log("🚀 ~ handleEdit ~ item:", item)
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
        if (skipHandleKeyDown(event, ['ArrowDown', 'ArrowUp', 'Enter', 'Delete', 'Escape'], ['n', 'f'])) return;
        if (!tableRef.current) return;
        event.preventDefault();
        const currentIndex = data.findIndex((item) => item.id === selectedRowKey);

        switch (event?.key) {
            case 'ArrowDown':
                if (currentIndex + 1 < data.length) setSelectedRowKey(data[currentIndex + 1].id);
                break;
            case 'ArrowUp':
                if (currentIndex - 1 >= 0) setSelectedRowKey(data[currentIndex - 1].id);
                break;
            case 'Enter':
                if (selectedRowKey && !isOpen && data.length > 0) handleEdit();
                break;
            case 'Delete':
            case 'Backspace':
                if (selectedRowKey && selectedElement) handleDelete();
                break;
            case 'Escape':
                setSelectedRowKey(null);
                break;
        }
        if (event?.key) {
            let key = event?.key.toLowerCase();
            if (event.ctrlKey && key === 'n') handleNew();
            if (event.ctrlKey && key === 'f') setOpenFilter(true);
        }


    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedRowKey]);

    const handleTableChange = pagination => {
        if (pagination.current !== undefined) changePage(pagination.current);
    };

    const handleSubmitFilter = () => onClose();
    const onClose = () => setOpenFilter(false);

    const handleCheckboxChange = (e) => {
        setIsChecked(e);
        setSelectedRowKey(null);
    };

    const menu = (
        <Menu>
            {Object.keys(visibleColumns).map(key => (
                <Menu.Item key={key}>
                    <Checkbox
                        checked={visibleColumns[key]}
                        onChange={(e) => setVisibleColumns({
                            ...visibleColumns,
                            [key]: e.target.checked,
                        })}
                    >
                        {columns.find(col => col.key === key)?.title || key}
                    </Checkbox>
                </Menu.Item>
            ))}
        </Menu>
    );

    const expandedRowRender = (record) => {
        return (
            <div className="p-4 m-0 bg-gray-100 rounded">
                <Table
                    columns={columnsExtras}
                    dataSource={record?.movements}
                    rowKey="id"
                    className='w-full custom-table p-0'
                    size="small"
                    pagination={false}
                    onRow={(record) => ({
                        //console.log("🚀 ~ expandedRowRender ~ record:", record)
                        //onClick: () => handleRowClick(record),
                        //onDoubleClick: () => handleEdit(record),
                    })}
                    locale={{ emptyText: <CustomEmpty onAddNew={handleNew} /> }}
                />
                <h1></h1>
            </div>
        );
    };

    return (
        <div ref={tableRef} className='w-full min-h-[200px] flex flex-col'>
            <div ref={tableRef} className='w-full flex flex-row justify-between items-center pb-2'>
                {label &&
                    <Text as="h2" fontSize="xl" color="blue.700" px={1} py={0} className='leading-[1.2]'>
                        {label} {isChecked !== 'true' ? 'activos' : 'archivados'}
                    </Text>
                }
                {visibleColumns && (
                    <Dropdown overlay={menu} trigger={['click']}>
                        <Button
                            type='default'
                            icon={<SettingOutlined />}
                            tabIndex={6}
                        >
                            Columnas
                        </Button>
                    </Dropdown>
                )}
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch mb-4">
                <div className="w-full md:flex-1">
                    <Input
                        placeholder="Buscar..."
                        prefix={<SearchOutlined />}
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full"
                        tabIndex={0}
                        aria-label="Buscar elemento"
                    />
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                    <div className="flex flex-wrap gap-2">
                        {newItem && (
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleNew}
                                size="middle"
                                tabIndex={2}
                            >
                                Agregar
                            </Button>
                        )}
                        <Button
                            type="default"
                            icon={<EditOutlined />}
                            onClick={handleEdit}
                            disabled={!selectedRowKey}
                            tabIndex={3}
                        >
                            Editar
                        </Button>
                        <Button
                            type="default"
                            icon={<DeleteOutlined />}
                            onClick={handleDelete}
                            disabled={!selectedRowKey}
                            tabIndex={4}
                        />
                        <Button
                            type="default"
                            icon={<FilterOutlined />}
                            onClick={setOpenFilter}
                            tabIndex={5}
                        />

                    </div>
                </div>
            </div>

            {loading ? <Spin size="large" fullscreen tip="Cargando..." />
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
                    }}
                    onChange={handleTableChange}
                    expandedRowRender={expandexRow ? expandedRowRender : null}
                    expandedRowKeys={expandedRowKey ? [expandedRowKey] : []}
                    expandIcon={() => null}
                    expandIconColumnIndex={expandexRow ? -1 : 0}
                    onRow={(record) => ({
                        onClick: () => handleRowClick(record),
                        onDoubleClick: () => handleEdit(record),
                    })}
                    rowClassName={(record) =>
                        record.id === selectedRowKey ? 'bg-blue-100' : ''
                    }
                    locale={{ emptyText: <CustomEmpty onAddNew={handleNew} /> }}
                />
            }

            <BottomMessage>
                <Codes label={'↓ ↑ '} sub={' para moverte. '} />
                {!selectedRowKey ? <Codes label={'Ctrl + N'} sub={'para agregar nuevo.'} /> :
                    <>
                        <Codes label={'Supr'} sub={'para eliminar, '} />
                        <Codes label={'Enter'} /> o
                        <Codes label={'doble click'} sub={'para modificar.'} />
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
