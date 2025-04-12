import React, { useState } from 'react';
import {
  Box,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  useToast
} from '@chakra-ui/react';
import {
  SearchIcon,
  AddIcon,
  EditIcon,
  DeleteIcon
} from '@chakra-ui/icons';

const initialTargets = [
  { id: 1, name: 'Electrónicos', color: '#FF6B6B', created_at: '2023-05-15T10:30:00Z', products: 24 },
  { id: 2, name: 'Ropa', color: '#4ECDC4', created_at: '2023-06-20T14:45:00Z', products: 18 },
  { id: 3, name: 'Hogar', color: '#FFD166', created_at: '2023-07-10T09:15:00Z', products: 32 },
  { id: 4, name: 'Alimentos', color: '#06D6A0', created_at: '2023-08-05T16:20:00Z', products: 15 }
];

const TargetCategories = () => {
  const [targets, setTargets] = useState(initialTargets);
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();

  const filteredTargets = targets.filter(target =>
    target.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    const colors = ['#FF9A8B', '#4FD1C5', '#F6AD55', '#68D391', '#63B3ED'];
    const newTarget = {
      id: Math.max(...targets.map(t => t.id)) + 1,
      name: `Nueva Categoría ${targets.length + 1}`,
      color: colors[Math.floor(Math.random() * colors.length)],
      created_at: new Date().toISOString(),
      products: 0
    };
    setTargets([...targets, newTarget]);
  };

  const handleDelete = (id) => {
    setTargets(targets.filter(t => t.id !== id));
    toast({
      title: 'Categoría eliminada',
      status: 'error',
      duration: 2000,
      isClosable: true
    });
  };

  return (
    <Box p={6} bg="gray.50" minH="100vh">
      <Box bg="white" p={6} borderRadius="xl" boxShadow="sm" mb={6}>
        <Heading size="lg" mb={4}>Departamentos</Heading>

        <Box display="flex" flexDir={{ base: 'column', md: 'row' }} gap={4} mb={4}>
          <InputGroup flex="1">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Buscar categorías..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              bg="white"
            />
          </InputGroup>

          <Button leftIcon={<AddIcon />} colorScheme="blue" onClick={handleAdd} minW="200px">
            Nueva Categoría
          </Button>
        </Box>

        {filteredTargets.length === 0 ? (
          <Box textAlign="center" py={10}>
            <Heading size="md" mb={4}>No se encontraron categorías</Heading>
            <Button onClick={() => setSearchTerm('')} colorScheme="blue">
              Mostrar todas
            </Button>
          </Box>
        ) : (
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead bg="gray.100">
                <Tr>
                  <Th>#</Th>
                  <Th>Nombre</Th>
                  <Th>Productos</Th>
                  <Th>Fecha de creación</Th>
                  <Th>Color</Th>
                  <Th textAlign="right">Acciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredTargets.map((target, index) => (
                  <Tr key={target.id}>
                    <Td>{index + 1}</Td>
                    <Td fontWeight="medium">{target.name}</Td>
                    <Td>
                      <Badge colorScheme="green" borderRadius="full" px={2}>
                        {target.products}
                      </Badge>
                    </Td>
                    <Td>{new Date(target.created_at).toLocaleDateString()}</Td>
                    <Td>
                      <Box
                        w="24px"
                        h="24px"
                        borderRadius="full"
                        bg={target.color}
                        border="1px solid #ccc"
                      />
                    </Td>
                    <Td textAlign="right">
                      <IconButton
                        size="sm"
                        icon={<EditIcon />}
                        aria-label="Editar"
                        variant="ghost"
                        colorScheme="blue"
                        mr={2}
                      />
                      <IconButton
                        size="sm"
                        icon={<DeleteIcon />}
                        aria-label="Eliminar"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => handleDelete(target.id)}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default TargetCategories;
