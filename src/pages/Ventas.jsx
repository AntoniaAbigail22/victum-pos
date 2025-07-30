import { useState, useRef, useEffect } from 'react';
import { Table, Button, Tabs, InputNumber, Input, Card, AutoComplete } from 'antd';
import MetodoPagoModal from '../components/MetodoPagoModal';
import { DeleteOutlined, PlusOutlined, BarcodeOutlined } from '@ant-design/icons';
import { Col, Form, FormControl, ListGroup, Overlay, Popover } from 'react-bootstrap'

const { TabPane } = Tabs;

const Ventas = () => {
    const [activeOrder, setActiveOrder] = useState(0);
    const [showMetodoPago, setShowMetodoPago] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [orders, setOrders] = useState([
        {
            id: 0,
            name: 'Ticket #1',
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

    // Crear nuevo ticket (limitado a 6)
    const createNewOrder = () => {
        if (orders.length >= 6) {
            // Puedes mostrar una notificación al usuario
            console.warn("No se pueden crear más de 6 tickets");
            return;
        }

        const newId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 0;
        setOrders([...orders, {
            id: newId,
            name: `Ticket #${newId + 1}`,
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

    // Leer productos desde localStorage (productos_local)
    const [productosDB, setProductosDB] = useState([]);
    useEffect(() => {
        const local = localStorage.getItem('productos_local');
        if (local) {
            // Adaptar los campos para ventas
            const productos = JSON.parse(local).map(p => ({
                id: p.id,
                barcode: p.code,
                name: p.description,
                price: p.price_sale,
                discount: 0,
                originalPrice: p.price_cost,
                stock: p.stock || p.quanty_whole || 0
            }));
            setProductosDB(productos);
        } else {
            setProductosDB([]);
        }
    }, []);

    // Tickets generados (guardados en localStorage)
    const [tickets, setTickets] = useState([]);
    useEffect(() => {
        const local = localStorage.getItem('tickets_local');
        setTickets(local ? JSON.parse(local) : []);
    }, []);

    // Guardar ticket al cobrar
    const handleMetodoPagoSelect = (metodoPagoData) => {
        // Generar ticket
        const ticket = {
            id: Date.now(),
            fecha: new Date().toISOString(),
            productos: currentOrder.cart.map(({ id, barcode, name, price, quantity }) => ({ id, barcode, name, price, quantity })),
            total: subtotal,
            metodoPago: metodoPagoData.metodo,
            pagoCon: metodoPagoData.pagoCon,
            cambio: metodoPagoData.cambio,
            nota: metodoPagoData.nota,
            referencia: metodoPagoData.referencia || ''
        };
        // Guardar en localStorage
        const local = localStorage.getItem('tickets_local');
        const ticketsArr = local ? JSON.parse(local) : [];
        ticketsArr.push(ticket);
        localStorage.setItem('tickets_local', JSON.stringify(ticketsArr));
        setTickets(ticketsArr);
        // Limpiar carrito actual
        setOrders(orders.map(order =>
            order.id === activeOrder ? { ...order, cart: [] } : order
        ));
    };

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
                        defaultActiveKey="ventas"
                        type="card"
                        className="flex-1 flex flex-col overflow-hidden"
                    >
                        <TabPane tab="Ventas" key="ventas">
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
                                                    emptyText: ' '
                                                }}
                                                showHeader={true}
                                                sticky
                                            />
                                        </div>
                                    </TabPane>
                                ))}
                            </Tabs>
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
                                            onClick={() => setShowMetodoPago(true)}
                                        >
                                            Continuar compra
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            {/* Modal de método de pago */}
                            <MetodoPagoModal
                                visible={showMetodoPago}
                                onClose={() => setShowMetodoPago(false)}
                                onSelect={handleMetodoPagoSelect}
                                total={subtotal}
                            />
                        </TabPane>
                        <TabPane tab="Tickets generados" key="tickets">
                            <div className="p-4">
                                <h2 className="font-bold text-lg mb-4">Tickets generados</h2>
                                {tickets.length === 0 ? (
                                    <div className="text-gray-500">No hay tickets generados.</div>
                                ) : (
                                    <div style={{ maxHeight: 500, overflowY: 'auto' }} className="space-y-4">
                                        {tickets.slice().reverse().map(ticket => (
                                            <div key={ticket.id} className="border rounded-lg p-4 bg-gray-50 relative print-area">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="font-semibold">Ticket #{ticket.id}</span>
                                                    <span className="text-xs text-gray-500">{new Date(ticket.fecha).toLocaleString()}</span>
                                                </div>
                                                <div className="mb-2 text-center text-lg font-bold">NOMBRE DE LA TIENDA</div>
                                                <div className="mb-2 text-center text-xs">Dirección de la tienda, Ciudad, Estado, CP</div>
                                                <div className="mb-2 text-center text-xs">Caja: 1 &nbsp; | &nbsp; Referencia: {ticket.id}</div>
                                                <div className="mb-2 text-center text-xs">Fecha: {new Date(ticket.fecha).toLocaleDateString()} Hora: {new Date(ticket.fecha).toLocaleTimeString()}</div>
                                                <div className="mb-2 text-center text-xs font-semibold text-green-700">¡Gracias por su compra!</div>
                                                <div className="mb-2 text-xs">{ticket.productos.map(p => (
                                                    <div key={p.barcode} className="flex justify-between">
                                                        <span>{p.name} (x{p.quantity})</span>
                                                        <span>${p.price.toFixed(2)}</span>
                                                    </div>
                                                ))}</div>
                                                <div className="mb-2 text-xs">Total: <span className="font-bold">${ticket.total.toFixed(2)}</span></div>
                                                <div className="mb-2 text-xs">Pago: <span className="font-bold">{Number(ticket.pagoCon || 0).toFixed(2)}</span></div>
                                                <div className="mb-2 text-xs">Cambio: <span className="font-bold">{Number(ticket.cambio || 0).toFixed(2)}</span></div>
                                                <div className="mb-2 text-xs">Método de pago: {ticket.metodoPago}</div>
                                                {ticket.nota && (
                                                    <div className="mb-2 text-xs text-gray-600">Nota: {ticket.nota}</div>
                                                )}
                                                {ticket.referencia && (
                                                    <div className="mb-2 text-xs text-gray-600">Referencia: {ticket.referencia}</div>
                                                )}
                                                <div className="mb-2 text-xs text-center">Si requiere factura, solicítela hoy mismo.</div>
                                                <div className="mb-2 flex justify-center">
                                                    <img src={`https://barcode.tec-it.com/barcode.ashx?data=${ticket.id}&code=Code128&translate-esc=true`} alt="barcode" style={{ height: 40 }} />
                                                </div>
                                                <div className="flex justify-center mt-2">
                                                    <Button type="primary" onClick={() => {
                                                        const printArea = document.createElement('div');
                                                        printArea.innerHTML = document.querySelector('.print-area').innerHTML;
                                                        const win = window.open('', '', 'width=400,height=600');
                                                        win.document.write('<html><head><title>Ticket</title></head><body>' + printArea.innerHTML + '</body></html>');
                                                        win.document.close();
                                                        win.focus();
                                                        win.print();
                                                        win.close();
                                                    }}>Imprimir / PDF</Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default Ventas;