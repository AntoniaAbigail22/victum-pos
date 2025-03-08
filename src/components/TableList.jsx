import React, { useState, useEffect, useRef } from 'react';
import { Table, Spin, Button, Input, Empty } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { Text, Code } from '@chakra-ui/react';

//import type { TableProps } from 'antd';
/*interface TableListProps {
    columns: TableProps<any>['columns'];
    data: any[];
    loading: boolean;
    newItem: boolean;
    searchItem: any;
    changePage: any;
    search: string;
    current: number;
    total: number;
    selectedProvider: any;
    setSelectedProvider: any;
    onOpen: any;
    setProvider: any;
    isOpen: boolean;
    deleteItem: any;
}

interface DataType {
    id: string;
    company: string;
    phone: number;
}*/

const TableList = ({
    columns,
    data,
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
        //if (data.length > 0) 
    };

    const handleNew = () => {
        console.log('Nuevo');
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
        } else {
            console.log('Selecciona una fila para editar');
        }
    };

    const handleDelete = () => {
        if (selectedRowKey) {
            console.log('Eliminar:', selectedRowKey);
            deleteItem(selectedRowKey)
        } else {
            console.log('Selecciona una fila para eliminar');
        }
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
            if (nextIndex < data.length) {
                setSelectedRowKey(data[nextIndex].id);
            }
        } else if (event.key === 'ArrowUp') {
            const prevIndex = currentIndex - 1;
            if (prevIndex >= 0) {
                setSelectedRowKey(data[prevIndex].id);
            }
        }
        if (event.key === 'Enter') {
            event.preventDefault();
            if (selectedRowKey) {
                console.log("🚀 🚀🚀🚀🚀 :", isOpen)
                if (isOpen == false && data.length > 0) {
                    handleEdit();
                    console.log("🚀 ~ handleKeyDown ~ selectedRowKey && isOpen:", selectedRowKey, isOpen)
                }
            }
        } else if (event.key === 'Delete' || event.key === 'Backspace') {
            if (selectedRowKey && selectedProvide) {
                handleDelete();
            }
        } else if (event.key == "Escape") {
            setSelectedRowKey(null)
        }
    };

    const handleTableChange = (pagination) => {
        if (pagination.current !== undefined) changePage(pagination.current);
    };

    const CustomEmpty = () => (
        <Empty
            image={'https://img.icons8.com/fluency/96/000000/nothing-found.png'}
            description="No hay datos disponibles"
            imageStyle={{ height: 100, justifyContent: 'center', display: 'flex' }}
            className='h-[250px] flex flex-col justify-center align-middle'
        >
            <Button type="primary" onClick={handleNew}>Agregar datos</Button>
        </Empty>
    );

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
                        tabIndex={0}
                    >
                        Editar
                    </Button>
                    <Button
                        type='default'
                        icon={<DeleteOutlined />}
                        onClick={handleDelete}
                        disabled={!selectedRowKey}
                        tabIndex={0}
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

            {loading ?
                <div className='flex w-full h-[80vh] items-center justify-center'>
                    <Spin size="large" />
                </div>
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
                    locale={{
                        emptyText: <CustomEmpty />
                    }}
                />
            }
            <div className='fixed bottom-0 left-0 bg-slate-100 w-full p-1'>
                <Text fontSize="sm" fontWeight="thin" color="gray.600">
                    <Text fontSize="xs" fontWeight="thin" color="gray.600">
                        {!selectedRowKey ? "Selecciona un elemento para ver las opciones disponibles" :
                            <>
                                <Code fontWeight="bold" colorScheme='blackAlpha'>↓</Code> para navegar hacia abajo,{" "}
                                <Code fontWeight="bold" colorScheme='blackAlpha'>↑</Code> para navegar hacia arriba,{" "}
                                <Code fontWeight="bold" colorScheme='blackAlpha'>Supr/Delete</Code> para eliminar,{" "}
                                <Code fontWeight="bold" colorScheme='blackAlpha'>Enter</Code> o <Code fontWeight="bold" colorScheme='blackAlpha'>Doble Click</Code> para modificar
                            </>
                        }
                    </Text>
                </Text>
            </div>
        </div>
    );
};

export default TableList;