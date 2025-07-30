import React, { useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';

const ModalAgregarDepartamento = ({ visible, onClose, onAdd }) => {
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
            title="Agregar departamento"
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
                    rules={[{ required: true, message: 'Ingrese el nombre del departamento' }]}
                >
                    <Input placeholder="Nombre del departamento" />
                </Form.Item>
                <Form.Item
                    label="Descripción"
                    name="description"
                >
                    <Input.TextArea placeholder="Descripción (opcional)" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalAgregarDepartamento;
