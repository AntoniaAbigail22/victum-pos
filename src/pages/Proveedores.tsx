import React, { useState, useEffect } from 'react';
import { Button, Space } from 'antd';
import TableList from '../components/TableList';
import { indexProviders } from "../api/providers/providers"
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {useDisclosure} from "@chakra-ui/react";
import ModalEditItem from '../components/ModalEditItem';

const columns = [
    {
        title: 'Nombre',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Empresa',
        dataIndex: 'company',
        key: 'company',
    },
    {
        title: 'Teléfono',
        dataIndex: 'phone',
        key: 'phone',
    },
    {
        title: '',
        key: 'action',
        render: (_: any) => (
            <Space size="middle">
                <Button
                    type='default'
                    icon={<DeleteOutlined />}
                    onClick={() => { }}
                />
                <Button
                    type='default'
                    icon={<EditOutlined />}
                    onClick={() => { }}
                />
            </Space>
        ),
    },
];

const Proveedores: React.FC = () => {

    const [data, setData] = useState<[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1)
    const [total, setTotal] = useState<number>(0)
    const [search, setSearch] = useState<string>("")

    useEffect(() => {
        getProviders();
    }, [page, search]);

    const getProviders = async () => {
        try {
            const response = await indexProviders({ page, search })
            if (response?.status) {
                setData(response?.data?.data)
                setTotal(response?.data?.total)
            }
        } catch (error) {
            console.log("🚀 ~ getProviders ~ error:", error)
        } finally {
            setLoading(false);
        }
    };

    const deleteItem = async () => {
        try {
            const response = await deleteProvider({ id })
            console.log("🚀 ~ deleteProvider ~ response:", response)
        } catch (error) {
            console.log("🚀 ~ getProviders ~ error:", error)
        } finally {
            setLoading(false);
        }
    };

    const [provider, setProvider] = useState(null);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <div className="w-full flex flex-col p-1">
            <h1 className='bold'>Proveedores</h1>
            <TableList
                columns={columns}
                data={data}
                loading={loading}
                newItem={true}
                searchItem={setSearch}
                search={search}
                changePage={setPage}
                current={page}
                total={total}
                selectedProvider={selectedProvider}
                setSelectedProvider={setSelectedProvider}
                onOpen={onOpen}
                setProvider={setProvider}
            />
            <ModalEditItem
                isOpen={isOpen}
                onClose={onClose}
                selectedProvider={selectedProvider}
                provider={provider}
            />
        </div>
    );
};

export default Proveedores;
