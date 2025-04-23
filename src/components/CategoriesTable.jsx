import React, { useState } from 'react';
import { 
  Badge, 
  Box,
  useToast,
  RadioGroup, 
  Radio, 
  Stack,
  FormControl,
  FormLabel
} from '@chakra-ui/react';
import { Table, Button, Input, Drawer } from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined, 
  FilterOutlined 
} from '@ant-design/icons';
import TableList from './TableList';

const initialCategories = [
  { id: 1, name: 'Electrónicos', color: '#FF6B6B', created_at: '2023-05-15T10:30:00Z', products: 24, archive: false },
  { id: 2, name: 'Ropa', color: '#4ECDC4', created_at: '2023-06-20T14:45:00Z', products: 18, archive: false },
  { id: 3, name: 'Hogar', color: '#FFD166', created_at: '2023-07-10T09:15:00Z', products: 32, archive: false },
  { id: 4, name: 'Alimentos', color: '#06D6A0', created_at: '2023-08-05T16:20:00Z', products: 15, archive: true }
];

const CategoriesTable = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [isChecked, setIsChecked] = useState("false");
  const toast = useToast();

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArchiveFilter = isChecked === "true" ? category.archive : !category.archive;
    return matchesSearch && matchesArchiveFilter;
  });

  const handleAdd = () => {
    const colors = ['#FF9A8B', '#4FD1C5', '#F6AD55', '#68D391', '#63B3ED'];
    const newCategory = {
      id: Math.max(...categories.map(c => c.id)) + 1,
      name: `Nueva Categoría ${categories.length + 1}`,
      color: colors[Math.floor(Math.random() * colors.length)],
      created_at: new Date().toISOString(),
      products: 0,
      archive: false
    };
    setCategories([...categories, newCategory]);
    toast({
      title: 'Categoría creada',
      status: 'success',
      duration: 2000,
      isClosable: true
    });
  };

  const handleEdit = () => {
    if (selectedCategory) {
      // Lógica para editar la categoría seleccionada
      console.log('Editando categoría:', selectedCategory);
      setIsModalOpen(true);
    }
  };

  const handleDelete = (id) => {
    setCategories(categories.filter(c => c.id !== id));
    setSelectedCategory(null);
    toast({
      title: 'Categoría eliminada',
      status: 'error',
      duration: 2000,
      isClosable: true
    });
  };

  const handleArchive = (id, archive) => {
    setCategories(categories.map(c => 
      c.id === id ? {...c, archive} : c
    ));
    toast({
      title: archive ? 'Categoría archivada' : 'Categoría activada',
      status: 'info',
      duration: 2000,
      isClosable: true
    });
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Box fontWeight="medium">
          {text}
          {record.archive && (
            <Badge ml={2} colorScheme="gray">
              Archivado
            </Badge>
          )}
        </Box>
      ),
    },
    {
      title: 'Productos',
      dataIndex: 'products',
      key: 'products',
      render: (count) => (
        <Badge colorScheme="green" borderRadius="full" px={2}>
          {count}
        </Badge>
      ),
      width: 120,
    },
    {
      title: 'Fecha de creación',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => new Date(date).toLocaleDateString(),
      width: 150,
    },
    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
      render: (color) => (
        <Box
          w="24px"
          h="24px"
          borderRadius="full"
          bg={color}
          border="1px solid #ccc"
        />
      ),
      width: 80,
    },
  ];

  return (
    <TableList
      columns={columns}
      data={filteredCategories}
      label="Categorías"
      loading={false}
      newItem={true}
      searchItem={setSearchTerm}
      search={searchTerm}
      current={1}
      total={filteredCategories.length}
      selectedProvider={selectedCategory}
      setSelectedProvider={setSelectedCategory}
      onOpen={() => setIsModalOpen(true)}
      setProvider={() => {}}
      isOpen={isModalOpen}
      deleteItem={handleDelete}
      openFilter={openFilter}
      setOpenFilter={setOpenFilter}
      isChecked={isChecked}
      setIsChecked={setIsChecked}
    />
  );
};

export default CategoriesTable;