import React, { useEffect, useState } from 'react';
import { Table, Space, Spin, message } from 'antd';
import type { TableProps } from 'antd';

export interface Main {
    name: string;
    phone: string;
    email: string;
    date_register: Date;
    store_id: string;
    company: string;
    id_asiggned_me: null | string;
}

const columns: TableProps<Main>['columns'] = [
    {
        title: 'Nombre',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Teléfono',
        dataIndex: 'phone',
        key: 'phone',
    },
    {
        title: 'Correo Electrónico',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Fecha de Registro',
        dataIndex: 'date_register',
        key: 'date_register',
        render: (date) => new Date(date).toLocaleDateString(),
    },
    {
        title: 'Tienda ID',
        dataIndex: 'store_id',
        key: 'store_id',
    },
    {
        title: 'Empresa',
        dataIndex: 'company',
        key: 'company',
    },
    {
        title: 'ID Asignado',
        dataIndex: 'id_asiggned_me',
        key: 'id_asiggned_me',
        render: (id) => id || 'N/A',
    },
    {
        title: 'Acciones',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <a href="#">Editar</a>
                <a href="#">Eliminar</a>
            </Space>
        ),
    },
];

const ProveedoresTable: React.FC = () => {
    const [data, setData] = useState<Main[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const headersList = {
                    Accept: '*/*',
                    "Content-Type": "application/json",
                };

                const response = await fetch('https://melody-back-sigma.vercel.app/api/provider/', {
                    method: 'GET',
                    headers: headersList,
                });

                if (!response.ok) {
                    throw new Error('Error al obtener los datos');
                }

                const result = await response.json();
                setData(result);
            } catch (error) {
                message.error('No se pudieron cargar los proveedores');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className='flex w-full'>
            {!loading ?
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                /> :
                <div className='flex w-full items-center justify-center'>
                    <Spin size="large" />
                </div>
            }
        </div>
    )
};

export default ProveedoresTable;
