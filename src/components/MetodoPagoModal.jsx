import { Modal, Button } from 'antd';
import { useState } from 'react';
import { CreditCardOutlined, MoneyCollectOutlined, QrcodeOutlined } from '@ant-design/icons';

const paymentMethods = [
  {
    key: 'efectivo',
    name: 'Efectivo',
    icon: <MoneyCollectOutlined style={{ fontSize: 32, color: '#52c41a' }} />,
  },
  {
    key: 'tarjeta',
    name: 'Tarjeta',
    icon: <CreditCardOutlined style={{ fontSize: 32, color: '#1890ff' }} />,
  },
  {
    key: 'qr',
    name: 'QR',
    icon: <QrcodeOutlined style={{ fontSize: 32, color: '#faad14' }} />,
  },
];


import { Input, InputNumber } from 'antd';


const MetodoPagoModal = ({ visible, onClose, onSelect, total }) => {
  const [selected, setSelected] = useState(null);
  const [pagoCon, setPagoCon] = useState(total);
  const [nota, setNota] = useState('');
  const [referencia, setReferencia] = useState('');

  const handleSelect = (method) => {
    setSelected(method.key);
    setReferencia(''); 
  };

  const handleCobrar = () => {
    if (selected) {
      onSelect({ metodo: selected, pagoCon, cambio: pagoCon - total, nota, referencia });
      onClose();
    }
  };

  const cambio = pagoCon - total;

  
  const methodColors = {
    efectivo: 'border-green-500 bg-green-50',
    tarjeta: 'border-blue-500 bg-blue-50',
    qr: 'border-yellow-500 bg-yellow-50',
  };

  return (
    <Modal
      title={<span className="font-bold text-2xl text-gray-800">Cobrar venta</span>}
      visible={visible}
      onCancel={onClose}
      footer={null}
      centered
    >
      <div className="flex flex-col gap-6">
        {/* Métodos de pago */}
        <div>
          <span className="block mb-2 font-semibold text-gray-700">Método de pago</span>
          <div className="flex gap-4 justify-center">
            {paymentMethods.map((method) => (
              <div
                key={method.key}
                className={`flex flex-col items-center cursor-pointer p-3 border-2 rounded-xl shadow-sm transition-colors duration-150 text-center w-28 h-28 justify-center select-none text-base font-semibold ${selected === method.key ? methodColors[method.key] : 'border-gray-200 bg-white text-gray-700'}`}
                onClick={() => handleSelect(method)}
                tabIndex={0}
                role="button"
                aria-label={method.name}
              >
                {method.icon}
                <span className="mt-2 text-base font-semibold">{method.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Total a cobrar */}
        <div className="flex justify-between items-center bg-gray-100 p-4 rounded-xl shadow-sm">
          <span className="font-bold text-xl">Total a cobrar:</span>
          <span className="font-bold text-xl text-green-700">${total.toFixed(2)}</span>
        </div>

        {/* Pago con y cambio */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="block mb-1 text-base font-medium">Pago con</span>
            <InputNumber
              min={total}
              value={pagoCon}
              onChange={setPagoCon}
              className="w-full"
              step={1}
              stringMode
              formatter={value => `$ ${value}`}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </div>
          <div>
            <span className="block mb-1 text-base font-medium">Cambio</span>
            <Input
              value={cambio > 0 ? `$ ${cambio.toFixed(2)}` : '$ 0.00'}
              disabled
              className="w-full"
            />
          </div>
        </div>

        {/* Referencia para tarjeta y QR */}
        {(selected === 'tarjeta' || selected === 'qr') && (
          <div>
            <span className="block mb-1 text-base font-medium">Número de referencia</span>
            <Input
              value={referencia}
              onChange={e => setReferencia(e.target.value)}
              maxLength={40}
              placeholder={selected === 'tarjeta' ? 'Referencia de la terminal o banco' : 'Referencia QR o folio'}
              className="w-full"
            />
          </div>
        )}

        {/* Notas */}
        <div>
          <span className="block mb-1 text-base font-medium">Notas (opcional)</span>
          <Input.TextArea
            value={nota}
            onChange={e => setNota(e.target.value)}
            rows={2}
            maxLength={120}
            placeholder="Agregar una nota para el ticket o pedido..."
            className="w-full"
          />
        </div>

        {/* Botón Cobrar */}
        <Button
          type="primary"
          block
          size="large"
          style={{ fontSize: '1.5rem', height: '3.5rem', fontWeight: 'bold', letterSpacing: '0.05em' }}
          disabled={!selected || pagoCon < total || ((selected === 'tarjeta' || selected === 'qr') && !referencia)}
          onClick={handleCobrar}
        >
          Cobrar venta
        </Button>
      </div>
    </Modal>
  );
};

export default MetodoPagoModal;
