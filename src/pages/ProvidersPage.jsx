import React, { useState, useEffect } from 'react';
import { Button, Modal, Space, notification } from 'antd';
import { ExclamationCircleFilled, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, Code, Text, useDisclosure, Box } from "@chakra-ui/react";
import { ChevronRightIcon } from '@chakra-ui/icons'
import TableList from '../components/TableList';
import ModalEditItem from '../components/ModalEditItem';
import { openNotification } from '../libs/Extras';
import { indexProviders, getBillingByProvider, deleteProvider, createProvider, upProvider } from "../api/providers/providers"

const ProvidersPage = () => {

    const [api, contextHolder] = notification.useNotification();
    const sendNotification = (type, description) => openNotification(api, type, description)

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [search, setSearch] = useState("")
    const store = 1;
    const [provider, setProvider] = useState(null);
    const [providerDelete, setProviderDelete] = useState(null);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [formData01, setFormData01] = useState(null);
    const [formData02, setFormData02] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        getProviders();
    }, [page, search]);

    useEffect(() => {
        if (selectedProvider && provider?.id) getBilling()
    }, [selectedProvider, provider?.id]);


    const getProviders = async () => {
        try {
            const response = await indexProviders({ store, page, search })
            if (response?.status) {
                setData(response?.data?.data)
                setTotal(response?.data?.total)
            }
            console.log("🚀 ~ getProviders ~ response:", response)
            if (response?.data?.total == 0 || response?.data?.data.length == 0) {
                setProvider(null);
                setSelectedProvider(null);
            }
        } catch (error) {
            console.log("🚀 ~ getProviders ~ error:", error)
        } finally {
            setLoading(false);
            setProviderDelete(null)
        }
    };

    const addProvider = async () => {
        try {
            const response = await createProvider({ provider: formData01, billing: formData02, store_id: store  })
            if (response?.status) {
                sendNotification('success', `Se agrego al proveedor ${response?.data?.provider?.name} ${response?.data?.provider?.last_name} con éxito`)
                onClose()
            }
            else sendNotification('error')
            console.log("🚀 ~ addProvider ~ response:", response)
        } catch (error) {
            console.log("🚀 ~ getProviders ~ error:", error)
        } finally {
            getProviders()
        }
    };

    const updateProvider = async () => {
        try {
            const response = await upProvider({ provider: formData01, billing: formData02, id: selectedProvider || provider?.id, store_id: store })
            if (response?.status) {
                sendNotification('success', `Se actualizó al proveedor ${provider?.name} ${provider?.last_name} con éxito`)
                onClose()
            }
            else sendNotification('error')
            console.log("🚀 ~ updateProvider ~ response:", response)
        } catch (error) {
            console.log("🚀 ~ updateProvider ~ error:", error)
        } finally {
            getProviders()
        }
    };

    const getBilling = async () => {
        try {
            const response = await getBillingByProvider({ id: selectedProvider })
            if (response?.status) setProvider({ ...provider, billing: response?.data });
        } catch (error) {
            console.log("🚀 ~ getProviders ~ error:", error)
        }
    };

    const deleteItem = async ({ id }) => {
        try {
            let response = await deleteProvider({ id })
            if (response?.status) sendNotification('success', 'Proveedor eliminado con éxito')
            else sendNotification('error')
        } catch (error) {
            console.error("🚀 ~ deleteProvider ~ error:", error)
        } finally {
            setProvider(null);
            setSelectedProvider(null);
            setProviderDelete(null)
            getProviders()
            setIsModalOpen(false);
        }
    };

    const handleModal = (id) => {
        if (id) {
            let item = data.find((item) => item?.id === id)
            console.log("🚀 ~ handleModal ~ item:", item)
            setProviderDelete(item);
            setIsModalOpen(!isModalOpen);
        }
    };

    const columns = [
        {
            title: '#',
            key: 'index',
            width: 1,
            render: (_, __, index) => (
                <span className='font-bold italic'>
                    {(page - 1) * 10 + index + 1}
                </span>
            ),
        },
        {
            title: 'Nombre',
            key: 'name',
            render: ({ name, last_name }) => (
                <span>
                    {name} {last_name}
                </span>
            ),
        },
        {
            title: 'Contacto',
            key: 'contact',
            width: 1,
            render: ({ phone, email }) => (
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
            title: 'Empresa',
            dataIndex: 'company',
            key: 'company',
            width: 1,
        },
        {
            title: '',
            key: 'action',
            width: 1,
            render: (record) => (
                <Space size='small'>
                    <Button
                        type='default'
                        icon={<DeleteOutlined />}
                        onClick={() => handleModal(record?.id)}
                    />
                    <Button
                        type='default'
                        icon={<EditOutlined />}
                        onClick={() => {
                            setSelectedProvider(record?.id)
                            setProvider(record);
                            onOpen()
                        }}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div className="w-full flex flex-col p-2">
            {contextHolder}
            <Box width="100%">
                <Breadcrumb spacing='8px' px={1} separator={<ChevronRightIcon color='gray.500' />}>
                    <BreadcrumbItem>
                        <BreadcrumbLink href='/directory'>Directorio</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        <BreadcrumbLink href='#'>Proveedores</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
                <Text as="h1" fontSize="xl" color="blue.700" p={1} pt={0}>
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
                deleteItem={(id) => handleModal(id)}
            />
            <ModalEditItem
                isOpen={isOpen}
                onClose={onClose}
                selectedProvider={selectedProvider}
                setSelectedProvider={setSelectedProvider}
                provider={provider}
                setProvider={setProvider}
                formData01={formData01}
                setFormData01={setFormData01}
                formData02={formData02}
                setFormData02={setFormData02}
                addProvider={addProvider}
                updateProvider={updateProvider}
            />

            {!isOpen &&
                <Modal
                    title={<span><ExclamationCircleFilled style={{ color: '#faad14', marginRight: 8 }} />¿Eliminar proveedor?</span>}
                    open={isModalOpen}
                    onOk={() => deleteItem({ id: providerDelete?.id })}
                    onCancel={() => setIsModalOpen(false)} centered okType='danger' okText='Eliminar'>
                    <div className='px-6'>
                        <p>¿Estás seguro de que deseas eliminar al proveedor
                            <Code fontWeight="bold" colorScheme='blackAlpha'>{providerDelete?.name} {providerDelete?.last_name}</Code>?
                            <br /> Esta acción no se puede deshacer.</p>
                    </div>
                    <Box mt={2} width="full" position={'absolute'} left={10}>
                        <div className='fixed bottom-0 left-0 bg-slate-200 w-full p-1'>
                            <Text fontSize="sm" fontWeight="thin" color="gray.600">
                                <Text fontSize="xs" fontWeight="thin" color="gray.600">
                                    <Code fontWeight="bold" colorScheme='blackAlpha'>Esc</Code> para cerrar ventana
                                </Text>
                            </Text>
                        </div>
                    </Box>
                </Modal>
            }
        </div>
    );
};

export default ProvidersPage;
