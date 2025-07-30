import React, { useState, useEffect } from 'react';
import { Button, notification } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import TableList from '../../components/TableList';
import { getTitleInventory, openNotification } from '../../libs/Extras';
import ModalAgregarDepartamento from '../../components/ModalAgregarDepartamento';
import departmentsJson from '../../api/departments/departments.json';

const DepartmentsPage = () => {
    const [api, contextHolder] = notification.useNotification();
    const sendNotification = (type, description) => openNotification(api, type, description);
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedElement, setSelectedElement] = useState(null);
    const [visibleColumns, setVisibleColumns] = useState({
        name: true,
        description: true,
    });
    const label = 'Departamentos';

    
    const LOCAL_KEY = 'departamentos_local';
    const getDataList = () => {
        setLoading(true);
        try {
            let departamentosLocal = [];
            const local = localStorage.getItem(LOCAL_KEY);
            if (local) {
                departamentosLocal = JSON.parse(local);
            } else {
                departamentosLocal = departmentsJson.map(c => ({ ...c }));
                localStorage.setItem(LOCAL_KEY, JSON.stringify(departamentosLocal));
            }
            let filtered = departamentosLocal;
            if (search && search.trim() !== "") {
                const s = search.trim().toLowerCase();
                filtered = departamentosLocal.filter(c =>
                    (c.name && c.name.toLowerCase().includes(s)) ||
                    (c.description && c.description.toLowerCase().includes(s))
                );
            }
            setData(filtered);
        } catch (error) {
            console.log("Error al cargar departamentos locales:", error);
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
            title: "Descripción",
            dataIndex: "description",
            key: "description",
        },
    ];

    
    const actionsColumn = {
        title: 'Acciones',
        key: 'actions',
        width: 100,
        align: 'center',
        render: (record) => (
            <div className="flex gap-2 justify-center">
                <Button size="small" danger onClick={() => handleDeleteDepartment(record.id)} icon={<DeleteOutlined />} title="Eliminar" />
            </div>
        )
    };

    useEffect(() => {
        getDataList();
    }, [search]);

    
    const handleAddDepartment = (values) => {
        try {
            const local = localStorage.getItem(LOCAL_KEY);
            const departamentosLocal = local ? JSON.parse(local) : [];
            const newId = departamentosLocal.length > 0 ? Math.max(...departamentosLocal.map(c => c.id || 0)) + 1 : 1;
            departamentosLocal.push({
                ...values,
                id: newId,
            });
            localStorage.setItem(LOCAL_KEY, JSON.stringify(departamentosLocal));
            sendNotification('success', `Departamento agregado: ${values.name}`);
            setShowAddModal(false);
            getDataList();
        } catch (error) {
            sendNotification('error', 'Error al agregar departamento');
        }
    };

    
    const handleDeleteDepartment = (id) => {
        try {
            const local = localStorage.getItem(LOCAL_KEY);
            let departamentosLocal = local ? JSON.parse(local) : [];
            departamentosLocal = departamentosLocal.filter(c => c.id !== id);
            localStorage.setItem(LOCAL_KEY, JSON.stringify(departamentosLocal));
            sendNotification('success', 'Departamento eliminado');
            getDataList();
        } catch (error) {
            sendNotification('error', 'Error al eliminar departamento');
        }
    };

    return (
        <div className="w-full flex flex-col p-2">
            {contextHolder}
            <div className="flex justify-end mb-2">
                <Button type="primary" onClick={() => setShowAddModal(true)}>
                    Agregar departamento
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
            <ModalAgregarDepartamento
                visible={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={handleAddDepartment}
            />
        </div>
    );
};

export default DepartmentsPage;
