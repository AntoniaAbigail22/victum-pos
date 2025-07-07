import React, { useState, useEffect } from 'react';
import { Button, Modal, Space, notification } from 'antd';
import { ExclamationCircleFilled, EditOutlined, DeleteOutlined, InboxOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { Code, useDisclosure } from "@chakra-ui/react";
import TableList from '../components/TableList';
import { getLabelTypeDirectory, getTitleDirectory, openNotification } from '../libs/Extras';
import { getBillingByProvider, deleteProvider, createProvider, upProvider, setArchiveProvider } from "../api/providers/providers"
import BreadcrumbHeader from '../components/BreadcrumbHeader';
import BottomMessage from '../components/BottomMessage';
import Codes from '../components/Codes';
import ModalEditProvider from '../components/directory/ModalEditProvider';
import { indexDirectorys } from '../api/providers/directorys';
import { useSelector } from 'react-redux';

const DirectoryPage = ({ type }) => {

    const [api, contextHolder] = notification.useNotification();
    const sendNotification = (type, description) => openNotification(api, type, description)

    const information_user = useSelector(state => state.login.information_user);
    const { user } = information_user;
    const { store_id: store } = user;
    console.log("🚀 ~ DirectoryPage ~ information_user:", user)
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [element, setElement] = useState(null);
    const [isDelete, setIsDelete] = useState(false);
    const [formPersonalData, setFormPersonalData] = useState(null);
    const [formBillingData, setFormBillingData] = useState(null);
    const [openFilter, setOpenFilter] = useState(false);
    const [isChecked, setIsChecked] = useState("false");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [elementDelete, setElementDelete] = useState(null);
    const [selectedElement, setSelectedElement] = useState(null);
    const [visibleColumns, setVisibleColumns] = useState({})
    const label = getTitleDirectory[type];
    const links = [
        {
            href: '/directory',
            label: 'Directorio'
        },
        {
            label: label
        }
    ]

    const initialVisibleColumns = {
        contact: true,
        company: true,
    };

    

    useEffect(() => {
        if (type !== 1) delete initialVisibleColumns.company;
        if (type == 4) initialVisibleColumns.address = true;
        if (type == 2 || type == 3) initialVisibleColumns.position = true;
        setVisibleColumns(initialVisibleColumns)
    }, []);


    useEffect(() => {
        getDataList();
    }, [page, search, isChecked]);

    useEffect(() => {
        if (selectedElement && element?.id && type == 1) getBilling();
    }, [selectedElement, element?.id]);

    const getDataList = async () => {
        try {
            const response = await indexDirectorys({ store, type, page, search, isChecked })
            if (response?.status) {
                setData(response?.data?.data)
                setTotal(response?.data?.total)
            }
        } catch (error) {
            console.log("🚀 ~ getDataList ~ error:", error)
        } finally {
            setLoading(false);
            setElementDelete(null);
            setElement(null);
            setSelectedElement(null);
        }
    };

    const addElement = async () => {
        try {
            const response = await createProvider({ provider: formPersonalData, billing: formBillingData, store_id: store })
            if (response?.status) {
                sendNotification('success', `Se agrego al ${getLabelTypeDirectory[type]} ${response?.data?.provider?.name} ${response?.data?.provider?.last_name} con éxito`)
                onClose()
            }
            else sendNotification('error')
        } catch (error) {
            console.log("🚀 ~ getDataList ~ error:", error)
        } finally {
            getDataList()
        }
    };

    const updateElement = async () => {
        try {
            const response = await upProvider({ provider: formPersonalData, billing: formBillingData, id: selectedElement || element?.id, store_id: store })
            if (response?.status) {
                sendNotification('success', `Se actualizó al ${getLabelTypeDirectory[type]} ${element?.name} ${element?.last_name} con éxito`)
                onClose()
            }
            else sendNotification('error')
        } catch (error) {
            console.log("🚀 ~ updateElement ~ error:", error)
        } finally {
            getDataList()
        }
    };

    const getBilling = async () => {
        try {
            const response = await getBillingByProvider({ id: selectedElement })
            if (response?.status) setElement({ ...element, billing: response?.data });
        } catch (error) {
            console.log("🚀 ~ getDataList ~ error:", error)
        }
    };

    const archiverItem = async ({ id, archive }) => {
        try {
            let response = await setArchiveProvider({ id, archive })
            if (response?.status) sendNotification('success', `${getLabelTypeDirectory[type]} archivado con éxito`)
            else sendNotification('error')
        } catch (error) {
            console.error("🚀 ~ deleteProvider ~ error:", error)
        } finally {
            getDataList()
            setElement(null);
            setSelectedElement(null);
            setElementDelete(null)
            setIsModalOpen(false);
        }
    };

    const deleteItem = async ({ id }) => {
        try {
            let response = await deleteProvider({ id })
            if (response?.status) sendNotification('success', `${getLabelTypeDirectory[type]} eliminado con éxito`)
            else sendNotification('error')
        } catch (error) {
            console.error("🚀 ~ deleteProvider ~ error:", error)
        } finally {
            getDataList()
            setElement(null);
            setSelectedElement(null);
            setElementDelete(null)
            setIsModalOpen(false);
        }
    };

    const handleModal = (id, mode) => {
        if (id) {
            let item = data.find((item) => item?.id === id)
            console.log("🚀 ~ handleModal ~ item:", item)
            setElementDelete(item);
            setIsModalOpen(!isModalOpen);
            if (mode) setIsDelete(true)
            else setIsDelete(false)
        }
    };

    const handlePhoneClick = phone => {
        window.location.href = `tel:${phone}`;
    };

    const fixedColumn = [
        {
            title: '#',
            key: 'index',
            width: 1,
            render: (_, __, index) => <span className='font-bold italic'>{(page - 1) * 10 + index + 1}</span>,
        },
        {
            title: 'Nombre',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
            sortDirections: ['ascend', 'descend'],
            render: ({ name, last_name }) => <span>{name} {last_name}</span>,
        },
    ];

    const columns = [
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
            sorter: (a, b) => a.name.localeCompare(b.name),
            sortDirections: ['ascend', 'descend'],
            width: 1,
        },
    ];


    const filterColumns = () => {
        const fix = columns;
        if (type !== 1) fix.pop();
        if (type == 4) fix.unshift({
            title: 'Dirección',
            key: 'address',
            render: ({ street, cp, col, city }) => (
                <span>
                    <span>
                        {street}, {col} CP: {cp}
                    </span> <br />
                    <span>{city}</span>
                </span>
            ),
        });
        if (type == 2 || type || 3) fix.unshift({
            title: 'Puesto',
            key: 'position',
            render: ({ position }) => (
                <span>
                    <span>
                        {position}
                    </span>
                </span>
            ),
            width: 1,
        });

        const columnActions = [
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
                                setSelectedElement(record?.id);
                                setElement(record);
                                onOpen();
                            }}
                        />
                    </Space>
                )
            }
        ];
        return ([
            ...fixedColumn,
            ...fix.filter(column => visibleColumns[column.key]),
            ...columnActions
        ])
    }

    const renderTypeModal = () => {
        const propsType = {
            isOpen: isOpen,
            onClose: onClose,
            type: type,
            selectedElement: selectedElement,
            setSelectedElement: setSelectedElement,
            element: element,
            setElement: setElement,
            formPersonalData: formPersonalData,
            setFormPersonalData: setFormPersonalData,
            addElement: addElement,
            updateElement: updateElement,
        }
        //console.log("🚀 ~ renderTypeModal ~ propsType:", propsType)
        switch (type) {
            case 1:
                return (
                    <ModalEditProvider
                        {...propsType}
                        formBillingData={formBillingData}
                        setFormBillingData={setFormBillingData}
                    />
                );
            case 2:
                ;
            case 3:
                ;
            case 4:
                ;
        }
    }

    return (
        <div className="w-full flex flex-col p-2">
            {contextHolder}
            <BreadcrumbHeader
                isChecked={isChecked}
                links={links}
                label={label}
            />
            <TableList
                visibleColumns={visibleColumns}
                setVisibleColumns={setVisibleColumns}
                columns={filterColumns()}
                data={data}
                label={label}
                loading={loading}
                newItem={true}
                searchItem={setSearch}
                search={search}
                changePage={setPage}
                current={page}
                total={total}
                selectedElement={selectedElement}
                setSelectedElement={setSelectedElement}
                onOpen={onOpen}
                setElement={setElement}
                isOpen={isOpen}
                deleteItem={(id) => handleModal(id)}
                openFilter={openFilter}
                setOpenFilter={setOpenFilter}
                isChecked={isChecked}
                setIsChecked={setIsChecked}
                isDelete={isDelete}
                setIsDelete={setIsDelete}
            />

            {renderTypeModal()}

            {!isOpen &&
                <Modal
                    title={<span><ExclamationCircleFilled style={{ color: '#faad14', marginRight: 8 }} />¿{`${isDelete ? 'Eliminar' : 'Archivar'}`} {getLabelTypeDirectory[type]}?</span>}
                    open={isModalOpen}
                    onOk={() => {
                        if (isDelete) deleteItem({ id: elementDelete?.id });
                        else archiverItem({ id: elementDelete?.id, archive: !elementDelete?.archive });
                    }}
                    onCancel={() => setIsModalOpen(false)}
                    centered
                    okType={isDelete ? 'danger' : 'primary'}
                    okText={isDelete ? 'Eliminar' : 'Archivar'}
                >
                    <div className='px-6'>
                        <p>{`${isDelete ? `¿Estás seguro de que deseas eliminar al ${getLabelTypeDirectory[type]}` : `¿Desea archivar al ${getLabelTypeDirectory[type]}`} `}
                            <Codes label={elementDelete?.name} /> <Codes label={elementDelete?.last_name} /> ?
                            {isDelete && <><br /> Esta acción no se puede deshacer.</>}
                        </p>
                    </div>
                    <BottomMessage>
                        <Codes label={'Esc'} /> para cerrar ventana
                    </BottomMessage>
                </Modal>
            }
        </div>
    );
};

export default DirectoryPage;
