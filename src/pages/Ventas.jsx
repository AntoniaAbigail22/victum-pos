import { useState, useRef, useEffect } from 'react';
import { Table, Button, Tabs, InputNumber, Input, Card, AutoComplete } from 'antd';
import { DeleteOutlined, PlusOutlined, BarcodeOutlined } from '@ant-design/icons';
import { Col, Form, FormControl, ListGroup, Overlay, Popover } from 'react-bootstrap'

const { TabPane } = Tabs;

const Ventas = () => {
    const [activeOrder, setActiveOrder] = useState(0);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [orders, setOrders] = useState([
        {
            id: 0,
            name: 'Pedido #1',
            status: 'active',
            cart: [
                {
                    id: 1,
                    barcode: '750123456789',
                    name: "Lancetas Universales Estériles On Call 30 G",
                    price: 178,
                    discount: 5,
                    originalPrice: 1690,
                    quantity: 1,
                    stock: 25
                }
            ]
        }
    ]);
    const [codigoInput, setCodigoInput] = useState('');
    const inputRef = useRef(null);

    const [options, setOptions] = useState([]);

    // Función para buscar coincidencias
    const handleSearch = (value) => {
        setCodigoInput(value);

        if (!value) {
            setOptions([]);
            return;
        }

        const filtered = productosDB.filter(product =>
            product.barcode.includes(value) ||
            product.name.toLowerCase().includes(value.toLowerCase())
        );

        setOptions(filtered.map(product => ({
            value: product.barcode,
            label: (
                <div className="flex justify-between">
                    <span>{product.name}</span>
                    <span className="text-gray-500">{product.barcode}</span>
                </div>
            ),
            product // Guardamos el objeto completo para usarlo al seleccionar
        })));
    };

    // Manejar selección
    const handleSelect = (value, option) => {
        setCodigoInput(value);
        // Agregar directamente el producto seleccionado
        agregarProducto(option.product);
    };

    // Función optimizada para agregar productos
    const agregarProducto = (producto, cantidad = 1) => {
        setOrders(orders.map(order => {
            if (order.id !== activeOrder) return order;

            const existe = order.cart.find(p => p.barcode === producto.barcode);
            if (existe) {
                return {
                    ...order,
                    cart: order.cart.map(p =>
                        p.barcode === producto.barcode
                            ? { ...p, quantity: p.quantity + cantidad }
                            : p
                    )
                };
            }

            return {
                ...order,
                cart: [...order.cart, { ...producto, quantity: cantidad }]
            };
        }));

        setCodigoInput('');
        setOptions([]);
        inputRef.current?.focus();
    };

    useEffect(() => {
        if (codigoInput.length > 0) {
            const filtered = productosDB.filter(product =>
                product.barcode.includes(codigoInput) ||
                product.name.toLowerCase().includes(codigoInput.toLowerCase())
            );
            setFilteredProducts(filtered);
            setShowSuggestions(filtered.length > 0);
        } else {
            setShowSuggestions(false);
        }
    }, [codigoInput]);

    // Crear nuevo pedido
    // Crear nuevo pedido (limitado a 6)
    const createNewOrder = () => {
        if (orders.length >= 6) {
            // Puedes mostrar una notificación al usuario
            console.warn("No se pueden crear más de 6 pedidos");
            return;
        }

        const newId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 0;
        setOrders([...orders, {
            id: newId,
            name: `Pedido #${newId + 1}`,
            status: 'active',
            cart: []
        }]);
        setActiveOrder(newId);
    };

    // Pausar pedido actual
    const pauseCurrentOrder = () => {
        setOrders(orders.map(order =>
            order.id === activeOrder ? { ...order, status: 'paused' } : order
        ));
        const availableOrder = orders.find(o => o.id !== activeOrder && o.status !== 'paused');
        if (availableOrder) {
            setActiveOrder(availableOrder.id);
        } else {
            createNewOrder();
        }
    };

    // Actualizar cantidad de producto
    const updateQuantity = (orderId, productId, newQuantity) => {
        if (newQuantity < 1) return;
        setOrders(orders.map(order => {
            if (order.id !== orderId) return order;
            return {
                ...order,
                cart: order.cart.map(item =>
                    item.id === productId ? { ...item, quantity: newQuantity } : item
                )
            };
        }));
    };

    // Eliminar producto
    const removeItem = (orderId, productId) => {
        setOrders(orders.map(order => {
            if (order.id !== orderId) return order;
            return {
                ...order,
                cart: order.cart.filter(item => item.id !== productId)
            };
        }));
    };

    const productosDB = [
        {
            id: 1,
            barcode: '750123456789',
            name: "Lancetas Universales Estériles On Call 30 G",
            price: 178,
            discount: 5,
            originalPrice: 1690,
            stock: 25
        },
        {
            id: 2,
            barcode: '750987654321',
            name: "Tiras Reactivas Contour Plus",
            price: 365,
            discount: 3,
            originalPrice: 351,
            stock: 50
        }
    ];

    // Buscar producto por código
    const buscarProductoPorCodigo = (codigo) => {
        return productosDB.find(p => p.barcode === codigo);
    };

    // Añadir producto por código (con soporte para cantidad en ambos formatos)
    const agregarPorCodigo = () => {
        if (!codigoInput) return;

        // Detectar patrones como "5*750123456789" o "750123456789*5"
        const match = codigoInput.match(/^(\d+)\*(.+)$/) || codigoInput.match(/^(.+)\*(\d+)$/);
        let cantidad = 1;
        let codigoProducto = codigoInput;

        if (match) {
            cantidad = parseInt(match[1]) || parseInt(match[2]) || 1;
            codigoProducto = match[2] || match[1];
        }

        const producto = buscarProductoPorCodigo(codigoProducto);
        if (!producto) {
            console.error("Producto no encontrado");
            setCodigoInput('');
            return;
        }

        setOrders(orders.map(order => {
            if (order.id !== activeOrder) return order;

            const existe = order.cart.find(p => p.barcode === codigoProducto);
            if (existe) {
                return {
                    ...order,
                    cart: order.cart.map(p =>
                        p.barcode === codigoProducto
                            ? { ...p, quantity: p.quantity + cantidad }
                            : p
                    )
                };
            }

            return {
                ...order,
                cart: [...order.cart, { ...producto, quantity: cantidad }]
            };
        }));

        setCodigoInput('');
        inputRef.current?.focus();
    };

    // Columnas de la tabla
    const columns = [
        {
            title: 'Código',
            dataIndex: 'barcode',
            key: 'barcode',
            width: 120,
            render: text => <span className="text-xs">{text}</span>
        },
        {
            title: 'Descripción',
            dataIndex: 'name',
            key: 'name',
            render: text => <span className="text-xs">{text}</span>
        },
        {
            title: 'P. Venta',
            dataIndex: 'price',
            key: 'price',
            width: 80,
            align: 'right',
            render: text => <span className="text-xs">${text.toFixed(2)}</span>
        },
        {
            title: 'Cantidad',
            key: 'quantity',
            width: 100,
            render: (_, record) => (
                <InputNumber
                    size="small"
                    min={1}
                    value={record.quantity}
                    onChange={(value) => updateQuantity(activeOrder, record.id, value)}
                    className="w-full text-xs"
                />
            )
        },
        {
            title: 'Importe',
            key: 'amount',
            width: 90,
            align: 'right',
            render: (_, record) => <span className="text-xs">${(record.price * record.quantity).toFixed(2)}</span>
        },
        {
            title: 'Existencia',
            dataIndex: 'stock',
            key: 'stock',
            width: 90,
            align: 'right',
            render: text => <span className="text-xs">{text}</span>
        },
        {
            title: '',
            key: 'action',
            width: 40,
            render: (_, record) => (
                <Button
                    type="text"
                    size="small"
                    danger
                    icon={<DeleteOutlined className="text-xs" />}
                    onClick={() => removeItem(activeOrder, record.id)}
                />
            )
        }
    ];

    const currentOrder = orders.find(o => o.id === activeOrder) || { cart: [], name: '' };
    const subtotal = currentOrder.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalQuantity = currentOrder.cart.reduce((sum, item) => sum + item.quantity, 0);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <div className="flex flex-col pt-4" style={{ height: 'calc(100vh - 65px)' }}>
            <div className="flex-1 overflow-hidden relative px-4">
                <div className="h-full flex flex-col">
                    <Tabs
                        activeKey={activeOrder.toString()}
                        onChange={(key) => setActiveOrder(parseInt(key))}
                        type="card"
                        tabBarExtraContent={
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={createNewOrder}
                                
                            >
                                Nuevo
                            </Button>
                        }
                        className="flex-1 flex flex-col overflow-hidden"
                    >
                        {orders.filter(o => o.status !== 'completed').map(order => (
                            <TabPane
                                tab={`${order.name} ${order.status === 'paused' ? '(Pausado)' : ''}`}
                                key={order.id}
                                className="flex-1 flex flex-col overflow-hidden"
                            >
                                <div className="flex gap-2 mb-4">
                                    <AutoComplete
                                        ref={inputRef}
                                        options={options}
                                        value={codigoInput}
                                        onSelect={handleSelect}
                                        onSearch={handleSearch}
                                        style={{ width: '100%', paddingLeft: 20 }}
                                        
                                        onKeyPress={(e) => e.key === 'Enter' && agregarPorCodigo()}
                                        
                                    >
                                        <Input
                                            prefix={<BarcodeOutlined />}
                                            allowClear
                                            autoFocus
                                            placeholder="Escanear código de barras"
                                        />
                                    </AutoComplete>

                                    <Button
                                        type="primary"
                                        onClick={agregarPorCodigo}
                                        icon={<PlusOutlined />}
                                    />
                                </div>
                                <div className="flex-1 overflow-y-auto">
                                    {/*<Table
                                        columns={columns}
                                        dataSource={order.cart}
                                        pagination={false}
                                        rowKey="id"
                                        size="small"
                                        bordered={false}
                                        className="compact-table"
                                        scroll={{ y: 'calc(100vh - 350px)' }}
                                        sticky
                                    />*/}
                                    <Table
                                        columns={columns}
                                        dataSource={order.cart}
                                        pagination={false}
                                        rowKey="id"
                                        size="small"
                                        bordered={false}
                                        className="compact-table"
                                        scroll={{ y: 'calc(100vh - 350px)' }}
                                        locale={{
                                            emptyText: ' ' // Espacio en blanco
                                        }}
                                        showHeader={true}
                                        sticky
                                        /*locale={{
                                            emptyText: (
                                                <div className="ant-empty ant-empty-normal">
                                                    <div className="ant-empty-image">
                                                        <svg width="64" height="41" viewBox="0 0 64 41">
                                                            <g transform="translate(0 1)" fill="none" fillRule="evenodd">
                                                                <ellipse fill="#F5F5F5" cx="32" cy="33" rx="32" ry="7"></ellipse>
                                                                <g fillRule="nonzero" stroke="#D9D9D9">
                                                                    <path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"></path>
                                                                    <path d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z" fill="#FAFAFA"></path>
                                                                </g>
                                                            </g>
                                                        </svg>
                                                    </div>
                                                    <p className="ant-empty-description">No hay productos en este pedido</p>
                                                </div>
                                            )
                                        }}*/
                                        //showHeader={true}
                                    />
                                </div>
                            </TabPane>
                        ))}
                    </Tabs>
                </div>
            </div>

            {/* Resumen fijo en la parte inferior */}
            <div className="w-full bg-white border-t border-gray-200 sticky bottom-0 z-10 px-4 py-2">
                <div className="flex justify-between items-center">
                    <div className="flex gap-4">
                        <span className="text-sm">Productos: {totalQuantity}</span>
                        <span className="text-sm">Envío: <span className="text-green-500">Gratis</span></span>
                    </div>
                    <div className="flex items-center gap-6">
                        <span className="font-bold text-lg">Total: ${subtotal.toFixed(2)}</span>
                        <Button
                            type="primary"
                            size="large"
                            disabled={!currentOrder.cart.length}
                        >
                            Continuar compra
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Ventas;