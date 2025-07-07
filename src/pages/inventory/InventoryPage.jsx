import React, { useState, useEffect } from 'react';
import { Button, Modal, Space, notification } from 'antd';
import { ExclamationCircleFilled, EditOutlined, DeleteOutlined, InboxOutlined, PictureOutlined, ShoppingOutlined } from '@ant-design/icons';

import {
    Tag,
    InputNumber,
    Avatar,
} from "antd";

import { Code, useDisclosure } from "@chakra-ui/react";
import TableList from '../../components/TableList';
import { getLabelTypeDirectory, getTitleDirectory, getTitleInventory, openNotification } from '../../libs/Extras';
import { getBillingByProvider, deleteProvider, createProvider, upProvider, setArchiveProvider } from "../../api/providers/providers"
import BreadcrumbHeader from '../../components/BreadcrumbHeader';
import BottomMessage from '../../components/BottomMessage';
import Codes from '../../components/Codes';
import ModalEditProvider from '../../components/directory/ModalEditProvider';
import { indexDirectorys } from '../../api/providers/directorys';
import { indexProducts } from '../../api/inventory/inventory';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../App';
import ModalEditProduct from '../../components/ModalEditProduct';
import { useSelector } from 'react-redux';
import { createProduct } from '../../api/products/products';

const InventoryPage = ({ type }) => {

    const navigate = useNavigate()
    const [api, contextHolder] = notification.useNotification();
    const sendNotification = (type, description) => openNotification(api, type, description)

    //const store = 1;
    const information_user = useSelector(state => state.login.information_user);
    const { user } = information_user;
    const { store_id: store, id } = user;
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [element, setElement] = useState(null);
    const [isDelete, setIsDelete] = useState(false);
    const [formData, setFormData] = useState(null);
    const [formBillingData, setFormBillingData] = useState(null);
    const [openFilter, setOpenFilter] = useState(false);
    const [isChecked, setIsChecked] = useState("false");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [elementDelete, setElementDelete] = useState(null);
    const [selectedElement, setSelectedElement] = useState(null);
    const [visibleColumns, setVisibleColumns] = useState([])
    const [warehouses, setWarehouses] = useState([])
    const [departments, setDepartments] = useState([])
    const label = getTitleInventory[type];
    const links = [
        {
            href: '/inventory',
            label: 'Inventario'
        },
        {
            label: label
        }
    ]

    const initialVisibleColumns = {
        category: true,
        inventory: true,
        provider_name: true,
        price_cost: true,
        price_sale: true,
        utility: true,
        stock: true,
        //quanty_whole
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
        if (type == 1) {
            getExtras();
        }
    }, []);

    const getExtras = async () => {
        try {
            const warehouses = await indexProducts({ store, type: 2 })
            const departments = await indexProducts({ store, type: 3 })
            console.log("🚀 ~ getExtras ~ warehouses:", warehouses)
            console.log("🚀 ~ getExtras ~ departments:", departments)
            setWarehouses(warehouses?.data?.data)
            setDepartments(departments?.data?.data)
        }
        catch (error) {
            console.log("🚀 ~ getDataList ~ error:", error)
        }
    }

    const getDataList = async () => {
        try {
            const response = await indexProducts({ store, type, page, search })
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

    const addElement = async (variants) => {
        console.log("🚀 ~ addElement ~ variants:", variants)
        try {
            const response = await createProduct({ product: formData, variants: variants, store_id: store, id })
            console.log("🚀 ~ addElement ~ response:", response)
            if (response?.status) {
                //sendNotification('success', `Se agrego al ${getLabelTypeDirectory[type]} ${response?.data?.provider?.name} ${response?.data?.provider?.last_name} con éxito`)
                onClose()
            }
            else sendNotification('error')
        } catch (error) {
            console.log("🚀 ~ getDataList ~ error:", error)
        } finally {
            //getDataList()
        }
    };

    const updateElement = async () => {
        try {
            const response = await upProvider({ provider: formData, billing: formBillingData, id: selectedElement || element?.id, store_id: store })
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
            title: "Producto",
            key: "image",
            render: ({ first_variant, description, code }) => (
                <div className="flex items-center gap-4 p-0">
                    <img
                        src={first_variant?.path}
                        alt={`product-${code}-${description}`}
                        style={{
                            width: '60px',
                            height: '40px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            //border: '1px solid #ccc',
                        }}
                    />
                    <div className="flex flex-col justify-center">
                        <span className="font-bold text-gray-800 text-sm">{description}</span>
                        <span className="text-gray-500 text-xs">{code}</span>
                    </div>
                </div>
            ),
            sorter: (a, b) => a.description.localeCompare(b.description),
            sortDirections: ['ascend', 'descend'],
            width: 200,
        },
        /*{
            title: "Nombre",
            dataIndex: "description",
            key: "description",
            //ellipsis: true,
            sorter: (a, b) => a.description.localeCompare(b.description),
            sortDirections: ['ascend', 'descend'],
        },*/
    ];


    const columns = [
        {
            title: "Categoría",
            key: "category",
            render: ({ category }) => category?.name,
            width: 120,
            align: "left",
        },
        {
            title: "Inventorio",
            key: "inventory",
            render: ({ inventory }) => inventory?.name,
            width: 120,
            align: "left",
        },

        {
            title: "Proveedor",
            dataIndex: "provider_name",
            key: "provider_name",
            width: 120,
            align: "left",
        },
        {
            title: "Costo",
            dataIndex: "price_cost",
            key: "price_cost",
            render: (price) => `$${price?.toFixed(2)}`,
            width: 120,
            align: "right",
        },
        {
            title: "Precio",
            dataIndex: "price_sale",
            key: "price_sale",
            render: (price) => `$${price?.toFixed(2)}`,
            width: 120,
            align: "right",
        },
        {
            title: "Utilidad",
            dataIndex: "utility",
            key: "utility",
            render: (utility) => (
                <Tag color={utility >= 0 ? "green" : "red"}>{utility?.toFixed(2)}%</Tag>
            ),
            width: 100,
            align: "right",
        },
        {
            title: "Stock",
            key: "stock",
            render: ({ current_stock, metric }) => <span>{current_stock} {metric}</span>,
            width: 100,
            align: "right",
        },
    ];


    const filterColumns = () => {
        const fix = columns;
        /*if (type !== 1) fix.pop();
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
        });*/


        const columnActions = [
            {
                title: '',
                key: 'action',
                width: 100,
                render: (record) => (
                    <Space size="small">
                        <Button
                            type="default"
                            icon={record?.archive ? <DeleteOutlined /> : <InboxOutlined />}
                            onClick={() => handleModal(record?.id, record?.archive)}
                        />
                        <Button
                            type="default"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                        />
                    </Space>
                ),
            }
        ];
        let fixedColumn_ = fixedColumn;
        if (type == 1) {
            fixedColumn_.shift();

        }

        /*i
        f (type == 1) {
            //products
        }
        if (type == 2) {
            //warehouses
            name
            direccion
            suma de productos en money
        }
        if (type == 3) {
            //departments
            name
        }
        if (type == 4) {
            //movement-report
            name
            tipo
            compras
            gasto
            saldo inicial
            saldo final
            unidades
        }
            */

        if (type == 2 || type == 3 || type == 4) {
            let finalColumns = []
            finalColumns.push({
                title: "Nombre",
                dataIndex: "name",
                key: "name",
                //ellipsis: true,
                sorter: (a, b) => a.name.localeCompare(b.name),
                sortDirections: ['ascend', 'descend'],
            })
            if (type == 2) {
                finalColumns.push({
                    title: "Dirección",
                    key: 'address',
                })
                finalColumns.push({
                    title: "Monto",
                    key: 'address',
                })
            }
            if (type == 4) {
                finalColumns.push({
                    title: "tipo",
                    key: 'tipo',
                })
                finalColumns.push({
                    title: "compras",
                    key: 'compras',
                })
                finalColumns.push({
                    title: "gasto",
                    key: 'gasto',
                })
                finalColumns.push({
                    title: "saldo inicial",
                    key: 'saldo_inicial',
                })
                finalColumns.push({
                    title: "saldo final",
                    key: 'saldo_final',
                })
                finalColumns.push({
                    title: "unidades",
                    key: 'unidades',
                })
            }
            return [...finalColumns, ...columnActions]

        }

        return ([
            ...fixedColumn_,
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
            formData: formData,
            setFormData: setFormData,

            updateElement: updateElement,
        }
        //console.log("🚀 ~ renderTypeModal ~ propsType:", propsType)
        switch (type) {
            case 1:
                return (
                    <ModalEditProduct
                        size="full"
                        categories={departments}
                        warehouses={warehouses}
                        {...propsType}
                        addElement={(variants) => addElement(variants)}
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

    const goNewList = () => {
        try {
            let item = data.find((item) => item?.id === selectedElement)
            navigate(`/${ROUTES.INVENTORY}/warehouses/saves`, { state: { item: item, id: selectedElement, labelBack: label } })
        } catch (error) {
            console.log("🚀 ~ goNewList ~ error:", error)
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
                onOpen={() => type == 2 ? goNewList() : onOpen()}
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

export default InventoryPage;
