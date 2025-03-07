import React, { useState, useEffect } from 'react';
import TableList from '../components/TableList';
import { indexProviders, getBillingByProvider, deleteProvider } from "../api/providers/providers"
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Code, Text, useDisclosure } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import ModalEditItem from '../components/ModalEditItem';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Modal, Space } from 'antd';

const Proveedores: React.FC = () => {

    const [data, setData] = useState<[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1)
    const [total, setTotal] = useState<number>(0)
    const [search, setSearch] = useState<string>("")
    const store = 1;
    const [provider, setProvider] = useState(null);
    const [providerDelete, setProviderDelete] = useState(null);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleModal = (id) => {
        if (id) {
            let item = data.find((item) => item?.id === id)
            console.log("🚀 ~ handleModal ~ item:", item)
            setProviderDelete(item);
        }
        setIsModalOpen(!isModalOpen);
    };


    useEffect(() => {
        getProviders();
    }, [page, search]);

    useEffect(() => {
        if (selectedProvider && provider?.id) {
            getBilling()
        }
    }, [selectedProvider, provider?.id]);


    const getProviders = async () => {
        try {
            const response = await indexProviders({ store, page, search })
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


    const getBilling = async () => {
        try {
            const response = await getBillingByProvider({ id: selectedProvider })
            if (response?.status) {
                setProvider({ ...provider, billing: response?.data });
            }
        } catch (error) {
            console.log("🚀 ~ getProviders ~ error:", error)
        } finally {

        }
    };

    const deleteItem = async ({ id }) => {
        try {
            const response = await deleteProvider({ id })
            console.log("🚀 ~ deleteProvider ~ response:", response)
        } catch (error) {
            console.log("🚀 ~ deleteProvider ~ error:", error)
        }
    };

    const columns = [
        {
            title: 'Nombre',
            key: 'name',
            render: ({ name, last_name }: { name: string; last_name: string }) => (
                <span>
                    {name} {last_name}
                </span>
            ),
        },
        {
            title: 'Empresa',
            dataIndex: 'company',
            key: 'company',
        },
        {
            title: 'Contacto',
            key: 'contact',
            render: ({ phone, email }: { phone: string; email: string }) => (
                <span>
                    <span>
                        {phone}
                    </span> <br />
                    <span>
                        {email}
                    </span>
                </span>
            ),
        },
        {
            title: '',
            key: 'action',
            width: 1,
            render: (record: { id: number }) => (
                <Space size='small'>
                    <Button
                        type='default'
                        icon={<DeleteOutlined />}
                        onClick={() => handleModal(record?.id) /*deleteItem({ id: record?.id })*/}
                    />
                    <Button
                        type='default'
                        icon={<EditOutlined />}
                        onClick={() => {
                            setSelectedProvider(record?.id)
                            setProvider(record);
                            console.log("🚀 ~ handleEdit ~ item:", record)
                            onOpen()
                        }}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div className="w-full flex flex-col p-2">
            <Box width="100%">
                <Text as="h1" fontSize="xl" color="blue.700" p={1}>
                    Proveedores
                </Text>
            </Box>
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
                isOpen={isOpen}
                deleteItem={deleteItem}
            />
            <ModalEditItem
                isOpen={isOpen}
                onClose={onClose}
                selectedProvider={selectedProvider}
                setSelectedProvider={setSelectedProvider}
                provider={provider}
                setProvider={setProvider}
            />

            <Modal
                title={
                    <span>
                        <ExclamationCircleFilled style={{ color: '#faad14', marginRight: 8 }} />
                        ¿Eliminar proveedor?
                    </span>
                }
                open={isModalOpen}
                onOk={() => {
                    deleteItem({ id: providerDelete?.id })
                    handleModal()
                }}
                 onCancel={handleModal} centered okType='danger' okText='Eliminar'>
                <div className='px-6'>
                    <p>¿Estás seguro de que deseas eliminar al proveedor <Code fontWeight="bold" colorScheme='blackAlpha'>{providerDelete?.name} {providerDelete?.last_name}</Code>? 
                    <br/> Esta acción no se puede deshacer.</p>
                </div>

                <Box mt={2} width="full" position={'absolute'} left={10}>
                    <div className='fixed bottom-0 left-0 bg-slate-200 w-full p-1'>
                        <Text fontSize="sm" fontWeight="thin" color="gray.600">
                            <Text fontSize="xs" fontWeight="thin" color="gray.600">
                                <Code fontWeight="bold" colorScheme='blackAlpha'>Esc</Code> para cerrar ventana,{" "}
                                <Code fontWeight="bold" colorScheme='blackAlpha'>→</Code> o <Code fontWeight="bold" colorScheme='blackAlpha'>←</Code> para navegar entre las opciones{" "}
                            </Text>
                        </Text>
                    </div>
                </Box>
            </Modal>
        </div>
    );
};

export default Proveedores;
