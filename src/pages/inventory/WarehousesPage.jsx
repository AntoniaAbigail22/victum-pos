import React, { useState, useEffect } from 'react';
import { Button, notification } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import TableList from '../../components/TableList';
import { getTitleInventory, openNotification } from '../../libs/Extras';
import ModalAgregarAlmacen from '../../components/ModalAgregarAlmacen';
import warehousesJson from '../../api/inventory/inventory.json';
import { useSelector } from 'react-redux';


const WarehousesPage = () => {
    const [api, contextHolder] = notification.useNotification();
    const sendNotification = (type, description) => openNotification(api, type, description);
    const information_user = useSelector(state => state.login.information_user);
    const user = information_user?.user;
    if (!user) {
        return (
            <div className="w-full flex flex-col p-2">
                <div className="text-center text-red-500 font-bold mt-8">No hay información de usuario disponible. Por favor inicia sesión.</div>
            </div>
        );
    }
    const { store_id: store } = user;
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedElement, setSelectedElement] = useState(null);
    const [visibleColumns, setVisibleColumns] = useState({
        name: true,
        address: true,
        monto: true,
    });
    const label = getTitleInventory[2];

    
    const LOCAL_KEY = 'almacenes_local';
    const getDataList = () => {
        setLoading(true);
        try {
            let almacenesLocal = [];
            const local = localStorage.getItem(LOCAL_KEY);
            if (local) {
                almacenesLocal = JSON.parse(local);
            } else {
                almacenesLocal = warehousesJson.data.map(a => ({ ...a }));
                localStorage.setItem(LOCAL_KEY, JSON.stringify(almacenesLocal));
            }
            let filtered = almacenesLocal;
            if (search && search.trim() !== "") {
                const s = search.trim().toLowerCase();
                filtered = almacenesLocal.filter(a =>
                    (a.name && a.name.toLowerCase().includes(s)) ||
                    (a.address && a.address.toLowerCase().includes(s))
                );
            }
            setData(filtered);
            setTotal(filtered.length);
        } catch (error) {
            console.log("Error al cargar almacenes locales:", error);
        } finally {
            setLoading(false);
            setSelectedElement(null);
        }
    };

    const columns = [
        {
            title: "Nombre",
            dataIndex: "name",
            key: "name",
            sorter: (a, b) => a.name.localeCompare(b.name),
            sortDirections: ['ascend', 'descend'],
        },
        {
            title: "Dirección",
            dataIndex: "address",
            key: "address",
        },
        {
            title: "Monto",
            dataIndex: "monto",
            key: "monto",
            render: (monto) => monto !== undefined ? `$${monto?.toFixed(2)}` : '',
        },
    ];

    useEffect(() => {
        getDataList();
    }, [search]);

    
    const handleAddWarehouse = (values) => {
        try {
            const local = localStorage.getItem(LOCAL_KEY);
            const almacenesLocal = local ? JSON.parse(local) : [];
            const newId = almacenesLocal.length > 0 ? Math.max(...almacenesLocal.map(a => a.id || 0)) + 1 : 1;
            almacenesLocal.push({
                ...values,
                id: newId,
            });
            localStorage.setItem(LOCAL_KEY, JSON.stringify(almacenesLocal));
            sendNotification('success', `Almacén agregado: ${values.name}`);
            setShowAddModal(false);
            getDataList();
        } catch (error) {
            sendNotification('error', 'Error al agregar almacén');
        }
    };

    
    const handleDeleteWarehouse = (id) => {
        try {
            const local = localStorage.getItem(LOCAL_KEY);
            let almacenesLocal = local ? JSON.parse(local) : [];
            almacenesLocal = almacenesLocal.filter(a => a.id !== id);
            localStorage.setItem(LOCAL_KEY, JSON.stringify(almacenesLocal));
            sendNotification('success', 'Almacén eliminado');
            getDataList();
        } catch (error) {
            sendNotification('error', 'Error al eliminar almacén');
        }
    };

    
    const actionsColumn = {
        title: 'Acciones',
        key: 'actions',
        width: 100,
        align: 'center',
        render: (record) => (
            <div className="flex gap-2 justify-center">
                <Button size="small" danger onClick={() => handleDeleteWarehouse(record.id)} icon={<DeleteOutlined />} title="Eliminar" />
            </div>
        )
    };

    return (
        <div className="w-full flex flex-col p-2">
            {contextHolder}
            <div className="flex justify-end mb-2">
                <Button type="primary" onClick={() => setShowAddModal(true)}>
                    Agregar almacén
                </Button>
            </div>
            <TableList
                visibleColumns={visibleColumns}
                setVisibleColumns={setVisibleColumns}
                columns={columns.filter(column => visibleColumns[column.key])}
                data={data}
                label={label}
                loading={loading}
                newItem={false}
                searchItem={setSearch}
                search={search}
                selectedElement={selectedElement}
                setSelectedElement={setSelectedElement}
                actionsColumn={actionsColumn}
            />
            <ModalAgregarAlmacen
                visible={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={handleAddWarehouse}
            />
        </div>
    );
};

export default WarehousesPage;
