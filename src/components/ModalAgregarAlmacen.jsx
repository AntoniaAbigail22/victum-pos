import React, { useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';

const ModalAgregarAlmacen = ({ visible, onClose, onAdd }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            onAdd(values);
            form.resetFields();
        } catch (error) {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Agregar almacén"
            open={visible}
            onOk={handleOk}
            onCancel={() => { form.resetFields(); onClose(); }}
            confirmLoading={loading}
            okText="Agregar"
            cancelText="Cancelar"
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Nombre"
                    name="name"
                    rules={[{ required: true, message: 'Ingrese el nombre del almacén' }]}
                >
                    <Input placeholder="Nombre del almacén" />
                </Form.Item>
                <Form.Item
                    label="Dirección"
                    name="address"
                >
                    <Input placeholder="Dirección (opcional)" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalAgregarAlmacen;
