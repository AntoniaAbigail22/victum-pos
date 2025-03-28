import React, { useState, useEffect } from 'react';
import { Button, Modal, Space, notification } from 'antd';
import { ExclamationCircleFilled, EditOutlined, DeleteOutlined, InboxOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { Code, useDisclosure } from "@chakra-ui/react";
import TableList from '../components/TableList';
import ModalEditItem from '../components/ModalEditItem';
import { openNotification } from '../libs/Extras';
import { indexProviders, getBillingByProvider, deleteProvider, createProvider, upProvider, setArchiveProvider } from "../api/providers/providers"
import BreadcrumbHeader from '../components/BreadcrumbHeader';
import BottomMessage from '../components/BottomMessage';

const ProvidersPage = () => {

    const [api, contextHolder] = notification.useNotification();
    const sendNotification = (type, description) => openNotification(api, type, description)
    
    const store = 1;
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [provider, setProvider] = useState(null);
    const [isDelete, setIsDelete] = useState(false);
    const [formData01, setFormData01] = useState(null);
    const [formData02, setFormData02] = useState(null);
    const [openFilter, setOpenFilter] = useState(false);
    const [isChecked, setIsChecked] = useState("false");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [providerDelete, setProviderDelete] = useState(null);
    const [selectedProvider, setSelectedProvider] = useState(null);

    useEffect(() => {
        getProviders();
    }, [page, search, isChecked]);

    useEffect(() => {
        if (selectedProvider && provider?.id) getBilling()
    }, [selectedProvider, provider?.id]);


    const getProviders = async () => {
        try {
            const response = await indexProviders({ store, page, search, isChecked })
            if (response?.status) {
                setData(response?.data?.data)
                setTotal(response?.data?.total)
            }
        } catch (error) {
            console.log("🚀 ~ getProviders ~ error:", error)
        } finally {
            setLoading(false);
            setProviderDelete(null);
            setProvider(null);
            setSelectedProvider(null);
        }
    };

    const addProvider = async () => {
        try {
            const response = await createProvider({ provider: formData01, billing: formData02, store_id: store })
            if (response?.status) {
                sendNotification('success', `Se agrego al proveedor ${response?.data?.provider?.name} ${response?.data?.provider?.last_name} con éxito`)
                onClose()
            }
            else sendNotification('error')
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

    const archiverItem = async ({ id, archive }) => {
        try {
            let response = await setArchiveProvider({ id, archive })
            if (response?.status) sendNotification('success', 'Proveedor archivado con éxito')
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

    const handleModal = (id, mode) => {
        if (id) {
            let item = data.find((item) => item?.id === id)
            console.log("🚀 ~ handleModal ~ item:", item)
            setProviderDelete(item);
            setIsModalOpen(!isModalOpen);
            if (mode) setIsDelete(true)
            else setIsDelete(false)
        }
    };

    const handlePhoneClick = phone => {
        window.location.href = `tel:${phone}`;
    };

    const label = 'Proveedores';
    const links = [
        {
            href: '/directory',
            label: 'Directorio'
        },
        {
            label: label
        }
    ]

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
                        {phone} <Button color="primary" variant="outlined" icon={<PhoneOutlined />} size={'small'} onClick={() => handlePhoneClick(phone)}/>
                    </span> <br />
                    <span>
                        {email} {/*<Button color="primary" variant="outlined" icon={<MailOutlined />} size={'small'} onClick={() => handleEmailClick(email)}/>*/}
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
                        icon={!record?.archive ? <InboxOutlined /> : <DeleteOutlined />}
                        onClick={() => handleModal(record?.id, record?.archive)}
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
            <BreadcrumbHeader
                isChecked={isChecked}
                links={links}
                label={label}
            />
            <TableList
                columns={columns}
                data={data}
                label={label}
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
                openFilter={openFilter}
                setOpenFilter={setOpenFilter}
                isChecked={isChecked}
                setIsChecked={setIsChecked}
                isDelete={isDelete}
                setIsDelete={setIsDelete}
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
                    title={
                        <span><ExclamationCircleFilled style={{ color: '#faad14', marginRight: 8 }} />¿{`${isDelete ? 'Eliminar' : 'Archivar'}`} proveedor?</span>
                    }
                    open={isModalOpen}
                    onOk={() => {
                        if (isDelete) deleteItem({ id: providerDelete?.id });
                        else archiverItem({ id: providerDelete?.id, archive: !providerDelete?.archive });
                    }}
                    onCancel={() => setIsModalOpen(false)}
                    centered
                    okType={isDelete ? 'danger' : 'primary'}
                    okText={isDelete ? 'Eliminar' : 'Archivar'}
                >
                    <div className='px-6'>
                        <p>{`${isDelete ? '¿Estás seguro de que deseas eliminar al proveedor' : '¿Desea archivar al proveedor'} `}
                            <Code fontWeight="bold" colorScheme='blackAlpha'>{providerDelete?.name} {providerDelete?.last_name}</Code>?
                            {isDelete && <><br /> Esta acción no se puede deshacer.</>}
                        </p>
                    </div>
                    <BottomMessage>
                        <Code fontWeight="bold" colorScheme='blackAlpha'>Esc</Code> para cerrar ventana
                    </BottomMessage>
                </Modal>
            }
        </div>
    );
};

export default ProvidersPage;
