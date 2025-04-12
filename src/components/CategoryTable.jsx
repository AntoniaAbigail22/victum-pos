import React, { useState } from 'react';
import {
  Table,
  Input,
  Button,
  Space,
  Typography,
  message,
  Popconfirm,
  Tag,
  Divider
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined
} from '@ant-design/icons';
import ModalEditCategorie from './ModalEditCategorie';

const { Title } = Typography;

const initialCategories = [
  { id: 1, name: 'Electrónicos', color: '#FF6B6B', status: 'active', description: 'Productos electrónicos', created_at: '2023-05-15T10:30:00Z' },
  { id: 2, name: 'Ropa', color: '#4ECDC4', status: 'active', description: 'Ropa para todas las edades', created_at: '2023-06-20T14:45:00Z' },
  { id: 3, name: 'Hogar', color: '#FFD166', status: 'active', description: 'Artículos para el hogar', created_at: '2023-07-10T09:15:00Z' },
  { id: 4, name: 'Alimentos', color: '#06D6A0', status: 'active', description: 'Productos alimenticios', created_at: '2023-08-05T16:20:00Z' }
];

const CategoryTable = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  // Filtrar categorías según término de búsqueda
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Manejar guardar categoría (crear o actualizar)
  const handleSaveCategory = async (categoryData) => {
    setLoading(true);
    try {
      if (categoryData.id) {
        // Actualizar categoría existente
        setCategories(categories.map(cat => 
          cat.id === categoryData.id ? categoryData : cat
        ));
        message.success('Categoría actualizada con éxito');
      } else {
        // Crear nueva categoría
        const newCategory = {
          ...categoryData,
          id: Math.max(...categories.map(c => c.id)) + 1
        };
        setCategories([...categories, newCategory]);
        message.success('Categoría creada con éxito');
      }
      setModalVisible(false);
    } catch (error) {
      message.error('Error al guardar la categoría');
    } finally {
      setLoading(false);
    }
  };

  // Manejar eliminar categoría
  const handleDelete = (id) => {
    setCategories(categories.filter(c => c.id !== id));
    message.success('Categoría eliminada con éxito');
  };

  // Manejar editar categoría
  const handleEdit = (category) => {
    setCurrentCategory(category);
    setModalVisible(true);
  };

  // Columnas de la tabla
  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      render: (text, record, index) => index + 1
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <div style={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            backgroundColor: record.color,
            marginRight: 8
          }} />
          <strong>{text}</strong>
        </Space>
      )
    },
    {
      title: 'Descripción',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Activo' : 'Inactivo'}
        </Tag>
      )
    },
    {
      title: 'Fecha de creación',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => new Date(date).toLocaleDateString('es-ES')
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="¿Confirmas que deseas eliminar esta categoría?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sí"
            cancelText="No"
          >
            <Button
              icon={<DeleteOutlined />}
              size="small"
              danger
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
          <Title level={4} style={{ margin: 0 }}>Gestión de Categorías</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              setCurrentCategory(null);
              setModalVisible(true);
            }}
          >
            Nueva Categoría
          </Button>
        </div>

        <Input
          placeholder="Buscar categoría por nombre..."
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: 24 }}
          allowClear
        />

        <Table
          columns={columns}
          dataSource={filteredCategories}
          rowKey="id"
          pagination={{ 
            pageSize: 5, 
            showSizeChanger: false,
            showTotal: (total) => `Total: ${total} categorías`
          }}
          locale={{ 
            emptyText: 'No se encontraron categorías' 
          }}
          bordered
        />

        {/* Modal para crear/editar categorías */}
        <ModalEditCategorie
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          onSubmit={handleSaveCategory}
          initialValues={currentCategory}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default CategoryTable;