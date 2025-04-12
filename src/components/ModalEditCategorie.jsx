import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Button, 
  Select, 
  ColorPicker, 
  message,
  Tag,
  Space,
  Divider,
  DatePicker
} from 'antd';
import { 
  CheckOutlined,
  CloseOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

const ModalEditCategorie = ({ 
  visible = false,
  onCancel,
  onSubmit,
  initialValues = null,
  loading = false
}) => {
  const [form] = Form.useForm();
  const [color, setColor] = useState('#1890ff');

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          created_at: initialValues.created_at ? moment(initialValues.created_at) : null
        });
        setColor(initialValues.color || '#1890ff');
      } else {
        form.resetFields();
        setColor('#1890ff');
      }
    }
  }, [visible, initialValues]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const completeData = {
        ...values,
        color: color,
        created_at: values.created_at ? values.created_at.toISOString() : new Date().toISOString()
      };
      onSubmit(completeData);
    } catch (error) {
      message.error('Verifica los campos requeridos');
    }
  };

  const colorPresets = [
    '#FF6B6B',
    '#4ECDC4',
    '#FFD166',
    '#06D6A0',
    '#1890ff',
    '#722ED1',
    '#EB2F96',
    '#13C2C2',
    '#52C41A'
  ];

  return (
    <Modal
      title={initialValues ? "Editar Categoría" : "Nueva Categoría"}
      open={visible}
      onCancel={onCancel}
      width={650}
      footer={[
        <Button 
          key="cancel" 
          icon={<CloseOutlined />} 
          onClick={onCancel}
        >
          Cancelar
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          icon={<CheckOutlined />}
          loading={loading}
          onClick={handleOk}
        >
          {initialValues ? "Actualizar" : "Crear"}
        </Button>
      ]}
      destroyOnClose
    >
      <Divider orientation="left" style={{ marginTop: 0 }}></Divider>
      
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Nombre de la categoría"
          rules={[
            { required: true, message: 'Este campo es obligatorio' },
            { max: 50, message: 'Máximo 50 caracteres' }
          ]}
        >
          <Input placeholder="Ej: Electrónicos" />
        </Form.Item>

        <Form.Item label="Color de identificación" required>
          <Space>
            <ColorPicker
              value={color}
              onChange={(color) => setColor(color.toHexString())}
              presets={[
                {
                  label: 'Colores recomendados',
                  colors: colorPresets,
                }
              ]}
              showText
            />
            <Tag color={color} style={{ marginLeft: 8 }}>
              {color.toUpperCase()}
            </Tag>
          </Space>
        </Form.Item>

        <Form.Item
          name="description"
          label="Descripción"
          rules={[{ max: 200, message: 'Máximo 200 caracteres' }]}
        >
          <TextArea rows={3} placeholder="Descripción opcional..." />
        </Form.Item>

        <Form.Item
          name="status"
          label="Estado"
          initialValue="active"
        >
          <Select>
            <Option value="active">Activo</Option>
            <Option value="inactive">Inactivo</Option>
          </Select>
        </Form.Item>

        {initialValues && (
          <Form.Item name="created_at" label="Fecha de creación">
            <DatePicker style={{ width: '100%' }} disabled />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default ModalEditCategorie;