import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, Button, Select, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;


import { getLocalDepartments, addLocalDepartment } from '../api/departments/departments.js';


// showImageUpload: permite mostrar el campo de imagen
const ModalAgregarProducto = ({ visible, onClose, onAdd, showImageUpload }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(undefined);
  const [departamentos, setDepartamentos] = useState(() => getLocalDepartments().map(dep => dep.name));
  const [showAddDept, setShowAddDept] = useState(false);
  const [newDept, setNewDept] = useState("");

  const handleOk = async () => {
    try {
      setLoading(true);
      // Si hay imageUrl, setearlo en el form antes de validar
      if (showImageUpload && imageUrl) {
        form.setFieldsValue({ image_url: imageUrl });
      }
      const values = await form.validateFields();
      let finalValues = { ...values };
      if (showImageUpload) {
        finalValues.image_url = imageUrl || values.image_url || null;
      }
      onAdd(finalValues);
      form.resetFields();
      setImageUrl(undefined);
      setLoading(false);
      onClose();
    } catch (e) {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Agregar producto"
      open={visible}
      onCancel={() => { form.resetFields(); onClose(); }}
      onOk={handleOk}
      footer={null}
      centered
    >
      <Form form={form} layout="vertical">
        {showImageUpload && (
          <Form.Item
            name="image_url"
            label="Imagen (URL o subir)"
            rules={[{ required: true, message: 'La imagen es obligatoria' }]}
          >
            <Input
              placeholder="Pega la URL de la imagen o usa el botón para subir"
              value={imageUrl !== undefined ? imageUrl : form.getFieldValue('image_url')}
              onChange={e => {
                setImageUrl(e.target.value);
                form.setFieldsValue({ image_url: e.target.value });
              }}
            />
            <Upload
              showUploadList={false}
              beforeUpload={file => {
                const reader = new FileReader();
                reader.onload = e => setImageUrl(e.target.result);
                reader.readAsDataURL(file);
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Subir imagen</Button>
            </Upload>
            {imageUrl && (
              <div style={{ marginTop: 8 }}>
                <img src={imageUrl} alt="preview" style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 8 }} />
              </div>
            )}
          </Form.Item>
        )}
        <Form.Item name="code" label="Código" rules={[{ required: true, message: 'Código requerido' }]}> 
          <Input placeholder="Ej: PROD-007" />
        </Form.Item>
        <Form.Item name="description" label="Descripción" rules={[{ required: true, message: 'Descripción requerida' }]}> 
          <Input placeholder="Nombre del producto" />
        </Form.Item>
        <Form.Item name="department" label="Departamento" rules={[{ required: true, message: 'Selecciona un departamento' }]}> 
          <Select
            placeholder="Selecciona un departamento"
            dropdownRender={menu => (
              <>
                {menu}
                <div style={{ display: 'flex', gap: 8, padding: 8 }}>
                  <Input
                    placeholder="Nuevo departamento"
                    value={newDept}
                    onChange={e => setNewDept(e.target.value)}
                    onPressEnter={() => {
                      if (newDept.trim()) {
                        addLocalDepartment({ name: newDept, description: '' });
                        setDepartamentos(getLocalDepartments().map(dep => dep.name));
                        setNewDept("");
                      }
                    }}
                  />
                  <Button
                    type="link"
                    onClick={() => {
                      if (newDept.trim()) {
                        addLocalDepartment({ name: newDept, description: '' });
                        setDepartamentos(getLocalDepartments().map(dep => dep.name));
                        setNewDept("");
                      }
                    }}
                  >Agregar</Button>
                </div>
              </>
            )}
          >
            {departamentos.map(dep => <Option key={dep} value={dep}>{dep}</Option>)}
          </Select>
        </Form.Item>
        <Form.Item name="price_cost" label="Costo" rules={[{ required: true, message: 'Costo requerido' }]}> 
          <InputNumber min={0} className="w-full" prefix="$" />
        </Form.Item>
        <Form.Item name="price_sale" label="Precio venta" rules={[{ required: true, message: 'Precio requerido' }]}> 
          <InputNumber min={0} className="w-full" prefix="$" />
        </Form.Item>
        <Form.Item name="stock" label="Stock inicial" rules={[{ required: true, message: 'Stock requerido' }]}> 
          <InputNumber min={0} className="w-full" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading} onClick={handleOk}>
            Agregar producto
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalAgregarProducto;
