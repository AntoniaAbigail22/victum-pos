// Función global para actualizar el stock en localStorage
export function actualizarStockProducto(barcode, cantidad, operacion = 'restar') {
    const LOCAL_KEY = 'productos_local';
    let productosLocal = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
    productosLocal = productosLocal.map(p =>
        p.code === barcode
            ? {
                ...p,
                stock: operacion === 'restar'
                    ? Math.max((p.stock || p.quanty_whole || 0) - cantidad, 0)
                    : (p.stock || p.quanty_whole || 0) + cantidad
            }
            : p
    );
    localStorage.setItem(LOCAL_KEY, JSON.stringify(productosLocal));
}
import React, { useState, useEffect } from 'react';
import { Button, notification, Tag, Avatar } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import TableList from '../../components/TableList';
import { getTitleInventory, openNotification } from '../../libs/Extras';
import ModalAgregarProducto from '../../components/ModalAgregarProducto';
import { useSelector } from 'react-redux';
import productsJson from '../../api/products/products.json';

const ProductsPage = () => {
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
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedElement, setSelectedElement] = useState(null);
    const [visibleColumns, setVisibleColumns] = useState({
        department: true,
        price_cost: true,
        price_sale: true,
        utility: true,
        stock: true,
    });
    const label = getTitleInventory[1];


    
    const LOCAL_KEY = 'productos_local';
    
    const getDataList = () => {
        setLoading(true);
        try {
            let productosLocal = [];
            const local = localStorage.getItem(LOCAL_KEY);
            if (local) {
                productosLocal = JSON.parse(local);
            } else {
                
                productosLocal = productsJson.data.map(p => ({
                    ...p,
                    stock: p.quanty_whole,
                    image_url: p.image_url || null
                }));
                localStorage.setItem(LOCAL_KEY, JSON.stringify(productosLocal));
            }
            
            let filtered = productosLocal;
            if (search && search.trim() !== "") {
                const s = search.trim().toLowerCase();
                filtered = productosLocal.filter(p =>
                    (p.description && p.description.toLowerCase().includes(s)) ||
                    (p.code && p.code.toLowerCase().includes(s)) ||
                    (p.department?.name && p.department.name.toLowerCase().includes(s))
                );
            }
            setData(filtered);
            setTotal(filtered.length);
        } catch (error) {
            console.log("Error al cargar productos locales:", error);
        } finally {
            setLoading(false);
            setSelectedElement(null);
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
            title: "Producto",
            key: "image",
            render: ({ image_url, description, code }) => (
                <div className="flex items-center gap-4 p-0">
                    {image_url ? (
                        <Avatar shape="square" size={48} src={image_url} alt={`product-${code}-${description}`} />
                    ) : (
                        <Avatar shape="square" size={48} style={{ background: '#eee', color: '#888' }} icon={description?.[0] || '?'} />
                    )}
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
    ];

    const columns = [
        {
            title: "Departamento",
            key: "department",
            render: ({ department }) => department?.name,
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
            render: ({ stock }) => <span>{stock}</span>,
            width: 100,
            align: "right",
        },
    ];

    
    const actionsColumn = {
        title: 'Acciones',
        key: 'actions',
        width: 100,
        align: 'center',
        render: (record) => (
            <div className="flex gap-2 justify-center">
                <Button size="small" type="primary" onClick={() => onEditProduct(record)} icon={<EditOutlined />} title="Editar" />
                <Button size="small" danger onClick={() => handleDeleteProduct(record.id)} icon={<DeleteOutlined />} title="Eliminar" />
            </div>
        )
    };
    const onEditProduct = (record) => {
        
        setShowAddModal(true);
        
    };


    
    const handleAddProduct = (values) => {
        try {
            const local = localStorage.getItem(LOCAL_KEY);
            const productosLocal = local ? JSON.parse(local) : [];
            const existe = productosLocal.find(p => p.code === values.code);
            const cantidad = Number(values.stock);
            if (cantidad < 0) {
                sendNotification('error', 'La cantidad no puede ser negativa');
                return;
            }
            if (existe) {
                sendNotification('error', 'Ya existe un producto con ese código');
                return;
            }
            const newId = productosLocal.length > 0 ? Math.max(...productosLocal.map(p => p.id || 0)) + 1 : 1;
            productosLocal.push({
                ...values,
                id: newId,
                code: values.code || `PROD-${String(newId).padStart(3, '0')}`,
                department: { name: values.department },
                quanty_whole: cantidad,
                stock: cantidad,
                price_whole: values.price_sale,
                utility: values.price_cost && values.price_sale ? ((values.price_sale - values.price_cost) / values.price_cost) * 100 : 0,
                image_url: values.image_url || null
            });
            localStorage.setItem(LOCAL_KEY, JSON.stringify(productosLocal));
            sendNotification('success', `Producto agregado: ${values.description}`);
            setShowAddModal(false);
            getDataList();
        } catch (error) {
            sendNotification('error', 'Error al agregar producto');
        }
    };

    
    const handleDeleteProduct = (id) => {
        try {
            const local = localStorage.getItem(LOCAL_KEY);
            let productosLocal = local ? JSON.parse(local) : [];
            productosLocal = productosLocal.filter(p => p.id !== id);
            localStorage.setItem(LOCAL_KEY, JSON.stringify(productosLocal));
            sendNotification('success', 'Producto eliminado');
            getDataList();
        } catch (error) {
            sendNotification('error', 'Error al eliminar producto');
        }
    };

    
    useEffect(() => {
        if (!showAddModal) {
            getDataList();
        }
    }, [page, search, showAddModal]);

    return (
        <div className="w-full flex flex-col p-2">
            {contextHolder}
            <div className="flex justify-end mb-2">
                <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowAddModal(true)}>
                    Agregar producto
                </Button>
            </div>
            <TableList
                visibleColumns={visibleColumns}
                setVisibleColumns={setVisibleColumns}
                columns={[...fixedColumn, ...columns.filter(column => visibleColumns[column.key])]} 
                data={data}
                label={label}
                loading={loading}
                newItem={false}
                searchItem={setSearch}
                search={search}
                changePage={setPage}
                current={page}
                total={total}
                selectedElement={selectedElement}
                setSelectedElement={setSelectedElement}
                actionsColumn={actionsColumn}
            />
            <ModalAgregarProducto
                visible={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={handleAddProduct}
                showImageUpload={true}
            />
        </div>
    );
};

export default ProductsPage;
