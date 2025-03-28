import React, { useState, useEffect } from 'react';
import { Button, Modal, Space, notification } from 'antd';
import { ExclamationCircleFilled, EditOutlined, DeleteOutlined, InboxOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { Code, Text, useDisclosure } from "@chakra-ui/react";
import TableList from '../components/TableList';
import ModalEditItem from '../components/ModalEditItem';
import { openNotification } from '../libs/Extras';
import { indexProviders, getBillingByProvider, deleteProvider, createProvider, upProvider, setArchiveProvider } from "../api/providers/providers"
import BreadcrumbHeader from '../components/BreadcrumbHeader';
import BottomMessage from '../components/BottomMessage';

import { Table, IconButton, Input, DatePicker, InputNumber } from 'rsuite';
import { VscEdit, VscSave, VscRemove } from 'react-icons/vsc';
import { indexProducts } from '../api/products/products';

const { Column, HeaderCell, Cell } = Table;

const styles = `
    .table-cell-editing .rs-table-cell-content {
    padding: 4px;
    }
    .table-cell-editing .rs-input {
    width: 100%;
    }
`;

const InventoryPage = () => {

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
            const response = await indexProducts({ store, page, search })
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

    const label = 'Inventario';
    const links = [
        {
            label: 'Inventario'
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
                        {phone} <Button color="primary" variant="outlined" icon={<PhoneOutlined />} size={'small'} onClick={() => handlePhoneClick(phone)} />
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

    //const [data, setData] = React.useState(defaultData);

    const handleChange = (id, key, value) => {
        const nextData = Object.assign([], data);
        nextData.find(item => item.id === id)[key] = value;
        setData(nextData);
    };
    const handleEdit = id => {
        const nextData = Object.assign([], data);
        const activeItem = nextData.find(item => item.id === id);

        activeItem.status = activeItem.status ? null : 'EDIT';

        setData(nextData);
    };

    const handleRemove = id => {
        setData(data.filter(item => item.id !== id));
    };

    return (
        <div className="w-full flex flex-col p-2">
            {contextHolder}
            <style>{styles}</style>
            <Text as="h1" fontSize="xl" color="blue.700" p={1} pt={0} spacing='8px' px={1} >
                {label}
            </Text>

            <Button
                onClick={() => {
                    setData([
                        { id: data.length + 1, name: '', age: 0, birthdate: null, status: 'EDIT' },
                        ...data
                    ]);
                }}
            >
                Add record
            </Button>
            <hr />
            <Table height={420} data={data}>
                <Column flexGrow={1}>
                    <HeaderCell>Name</HeaderCell>
                    <EditableCell
                        dataKey="name"
                        dataType="string"
                        onChange={handleChange}
                        onEdit={handleEdit}
                    />
                </Column>

                <Column width={200}>
                    <HeaderCell>Age</HeaderCell>
                    <EditableCell
                        dataKey="age"
                        dataType="number"
                        onChange={handleChange}
                        onEdit={handleEdit}
                    />
                </Column>

                <Column width={200}>
                    <HeaderCell>Birthday</HeaderCell>
                    <EditableCell
                        dataKey="birthdate"
                        dataType="date"
                        onChange={handleChange}
                        onEdit={handleEdit}
                    />
                </Column>

                <Column width={100}>
                    <HeaderCell>Action</HeaderCell>
                    <ActionCell dataKey="id" onEdit={handleEdit} onRemove={handleRemove} />
                </Column>
            </Table>

        </div>
    );
};





function toValueString(value, dataType) {
    return dataType === 'date' ? value?.toLocaleDateString() : value;
}

const fieldMap = {
    string: Input,
    number: InputNumber,
    date: DatePicker
};

const EditableCell = ({ rowData, dataType, dataKey, onChange, onEdit, ...props }) => {
    const editing = rowData.status === 'EDIT';

    const Field = fieldMap[dataType];
    const value = rowData[dataKey];
    const text = toValueString(value, dataType);

    return (
        <Cell
            {...props}
            className={editing ? 'table-cell-editing' : ''}
            onDoubleClick={() => {
                onEdit?.(rowData.id);
            }}
        >
            {editing ? (
                <Field
                    defaultValue={value}
                    onChange={value => {
                        onChange?.(rowData.id, dataKey, value);
                    }}
                />
            ) : (
                text
            )}
        </Cell>
    );
};

const ActionCell = ({ rowData, dataKey, onEdit, onRemove, ...props }) => {
    return (
        <Cell {...props} style={{ padding: '6px', display: 'flex', gap: '4px' }}>
            <IconButton
                appearance="subtle"
                icon={rowData.status === 'EDIT' ? <VscSave /> : <VscEdit />}
                onClick={() => {
                    onEdit(rowData.id);
                }}
            />
            <IconButton
                appearance="subtle"
                icon={<VscRemove />}
                onClick={() => {
                    onRemove(rowData.id);
                }}
            />
        </Cell>
    );
};

export default InventoryPage;