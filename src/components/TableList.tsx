import React, { useState, useEffect, useRef } from 'react';
import { Table, Spin, Button, Input } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';

interface TableListProps {
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
}

interface DataType {
    id: string;
    company: string;
    phone: number;
}

const TableList: React.FC<TableListProps> = ({
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
}) => {

    const [selectedRowKey, setSelectedRowKey] = useState<React.Key | null>(null);
    const tableRef = useRef<HTMLDivElement>(null);

    const handleRowClick = (record: DataType) => {
        setSelectedRowKey(record.id);
        setSelectedProvider(record?.id)
    };

    const handleSearch = (value: string) => {
        searchItem(value);

        if (value === "") setSelectedRowKey(null);
        else setSelectedRowKey(data[0].id);
        //if (data.length > 0) 
    };

    const handleNew = () => {
        console.log('Nuevo');
    };

    const handleEdit = () => {
        if (selectedRowKey) {
            setSelectedProvider(selectedRowKey)
            setProvider(data.find((item) => item?.id === selectedRowKey));
            onOpen()
        } else {
            console.log('Selecciona una fila para editar');
        }
    };

    const handleDelete = () => {
        if (selectedRowKey) {
            console.log('Eliminar:', selectedRowKey);
        } else {
            console.log('Selecciona una fila para eliminar');
        }
    };


    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
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
            } else if (event.key === 'Enter') {
                if (selectedRowKey) {
                    console.log("🚀 ~ handleKeyDown ~ selectedRowKey:", selectedRowKey)
                    handleEdit();
                }
            } else if (event.key === 'Delete' || event.key === 'Backspace') {
                if (selectedRowKey) {
                    handleDelete();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedRowKey, data]);

    const handleTableChange = (pagination: any) => {
        if (pagination.current !== undefined) changePage(pagination.current);
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

            <Button
                type='primary'
                icon={<PlusOutlined />}
                onClick={handleNew}
                className='fixed bottom-4 right-4 shadow-lg rounded'
            >
                {!selectedRowKey && 'Nuevo'}
            </Button>

            {loading ?
                <div className='flex w-full h-screen items-center justify-center'>
                    <Spin size="large" />
                </div>
                : <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    className='w-full custom-table'
                    bordered
                    pagination={{
                        current: current,
                        pageSize: 10,
                        total: total,
                        showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} elementos`,
                    }}
                    onChange={handleTableChange}
                    onRow={(record) => ({
                        onClick: () => handleRowClick(record),
                        onDoubleClick: () => handleEdit(),
                    })}
                    rowClassName={(record) =>
                        record.id === selectedRowKey ? 'bg-blue-100' : ''
                    }
                />
            }
        </div>
    );
};

export default TableList;