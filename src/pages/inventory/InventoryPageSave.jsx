import React, { useState, useEffect } from 'react';
import { Button, Modal, Space, notification } from 'antd';
import { ExclamationCircleFilled, EditOutlined, DeleteOutlined, InboxOutlined, PictureOutlined, ShoppingOutlined, EyeOutlined } from '@ant-design/icons';
import {
    Tag,
    InputNumber,
    Avatar,
} from "antd";
import { useDisclosure } from "@chakra-ui/react";
import TableList from '../../components/TableList';
import { getLabelTypeDirectory, getTitleDirectory, getTitleInventory, openNotification, optionsDate, typeMovementsColor, typeMovementsLabel } from '../../libs/Extras';
import { getBillingByProvider, deleteProvider, createProvider, upProvider, setArchiveProvider } from "../../api/providers/providers"
import BreadcrumbHeader from '../../components/BreadcrumbHeader';
import BottomMessage from '../../components/BottomMessage';
import Codes from '../../components/Codes';
import ModalEditProvider from '../../components/directory/ModalEditProvider';
import { indexProducts } from '../../api/inventory/inventory';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { tr } from 'date-fns/locale';

const InventoryPageSave = ({ type = 5 }) => {

    const [api, contextHolder] = notification.useNotification();
    const sendNotification = (type, description) => openNotification(api, type, description)
    const navigate = useNavigate();
    const location = useLocation();
    const { id, labelBack, item } = location?.state || {};
    const store = 1;
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
    const [visibleColumns, setVisibleColumns] = useState([])
    const label = getTitleInventory[type];
    const links = [
        {
            href: '/inventory',
            label: 'Inventario'
        },
        {
            label: labelBack,
            goBack: true
        },
        {
            label: item?.name,
            goBack: true
        },
        {
            label: label
        }

    ]

    const initialVisibleColumns = {
        quanty_act: true,
        quanty_min: true,
        //quanty_whole
    };

    useEffect(() => {
        setVisibleColumns(initialVisibleColumns)
    }, []);


    useEffect(() => {
        getDataList();
    }, [page, search, isChecked]);

    const getDataList = async () => {
        try {
            const response = await indexProducts({ store, type, page, search, id })
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

    const fixedColumn = [
        {
            title: '#',
            key: 'index',
            width: 1,
            render: (_, __, index) => <span className='font-bold italic'>{(page - 1) * 10 + index + 1}</span>,
        },
        {
            title: "Nombre",
            dataIndex: "product_name",
            key: "product_name",
            //width: 1,
            sorter: (a, b) => a.product_name.localeCompare(b.product_name),
            sortDirections: ['ascend', 'descend'],
        },
        /*{
            title: "Tipo",
            dataIndex: "tipo",
            key: "tipo",
            //ellipsis: true,
            sorter: (a, b) => a.tipo.localeCompare(b.tipo),
            sortDirections: ['ascend', 'descend'],
        },*/
    ];

    const columns = [
        {
            title: "Cantidad Actual",
            key: "quanty_act",
            render: ({ quanty_act, product_metric }) => <span>{quanty_act?.toFixed(2) || 0} {product_metric} </span>,
        },
        {
            title: "Cantidad Mínima",
            key: "quanty_min",
            render: ({ quanty_min, product_metric }) => <span>{quanty_min?.toFixed(2) || 0} {product_metric} </span>,
        },
        /*{
            title: "gasto",
            dataIndex: "gasto",
            key: "gasto",
            render: (utility) => (
                <Tag color={utility >= 0 ? "green" : "red"}>{utility?.toFixed(2)}%</Tag>
            ),
            width: 100,
            align: "right",
        },
        {
            title: "Compras",
            dataIndex: "compras",
            key: "compras",
            render: (utility) => (
                <Tag color={utility >= 0 ? "green" : "red"}>{utility?.toFixed(2)}%</Tag>
            ),
            width: 100,
            align: "right",
        },

        {
            title: "Unidades",
            key: "unidades",
            render: ({ unidades, product_metric }) => <span>{unidades?.toFixed(2) || 0} {product_metric} </span>,
            width: 120,
            align: "right",
        }*/
    ];


    const filterColumns = () => {
        return ([
            ...fixedColumn,
            ...columns.filter(column => visibleColumns[column.key])
        ])
    }


    const columnsExtras = [
        {
            title: "Fecha",
            key: "created_at",
            render: ({ created_at }) => <span>{new Date(created_at).toLocaleString('es-MX', optionsDate)} </span>,
            align: 'center'
        },
        {
            title: "Proveedor",
            key: "provider",
            dataIndex: "provider",
            align: 'left'
        },
        {
            title: "Tipo",
            dataIndex: "tipo",
            key: "tipo",
            render: (tipo) => (
                <Tag color={typeMovementsColor[tipo]}>{typeMovementsLabel[tipo]}</Tag>
            ),
            align: 'left'
        },
        {
            title: "Cantidad",
            key: "compras",
            render: ({ compras, product_metric }) => <span>{compras?.toFixed(2) || 0} {product_metric}</span>,

            align: "right",
        },
        {
            title: "Precio por unidad",
            key: "price",
            render: ({ price }) => <span>$ {price?.toFixed(2)}</span>,
            align: "right",
        },
        {
            title: "Gasto",
            key: "gasto",
            render: ({ gasto }) => <span>$ {gasto?.toFixed(2) || 0}</span>,
            align: "right",
        },
         {
            title: "Monto",
            key: "monto",
            render: ({ monto }) => <span>$ {monto?.toFixed(2) || 0}</span>,
            align: "right",
        },
        {
            title: "Unidades",
            key: "unidades",
            render: ({ unidades, product_metric }) => <span>{unidades?.toFixed(2) || 0} {product_metric} </span>,
            width: 120,
            align: "right",
        }

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
                expandexRow={true}
                columnsExtras={columnsExtras}
            />


            {/*!isOpen &&
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
            */}
        </div>
    );
};

export default InventoryPageSave;
