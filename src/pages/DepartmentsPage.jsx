import React, { useEffect, useState } from 'react';
import { Button, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { indexCategories, createCategory, deleteCategory } from '../api/categories/categories';

const DepartmentsPage = () => {
  const [categories, setCategories] = useState([]);  // Inicializar categories como un arreglo vacío
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });

  useEffect(() => {

    fetchCategories();
  }, []);

  // Obtener categorías al montar el componente
  const fetchCategories = async () => {
    try {
      const response = await indexCategories();
      console.log("🚀 ~ fetchCategories ~ response:", response)
      // Asegurarse de que response.data sea un arreglo
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        console.error('La respuesta no es un arreglo de categorías');
      }
    } catch (error) {
      console.error('Error al obtener las categorías:', error);
    }
  };

  const handleCreateCategory = async () => {
    try {
      const response = await createCategory(newCategory);
      setCategories((prevCategories) => [...prevCategories, response.data]);
      setNewCategory({ name: '', description: '' });
    } catch (error) {
      console.error('Error al crear categoría:', error);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategory({ id });
      setCategories((prevCategories) => prevCategories.filter((category) => category.id !== id));
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
    }
  };

  return (
    <div>
      <h1>Categorías</h1>

      {/* Formulario para crear una nueva categoría */}
      <div>
        <input
          type="text"
          value={newCategory.name}
          onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
          placeholder="Nombre de la categoría"
        />
        <input
          type="text"
          value={newCategory.description}
          onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
          placeholder="Descripción de la categoría"
        />
        <Button onClick={handleCreateCategory}>Crear Categoría</Button>
      </div>

      <Table>
        <Thead>
          <Tr>
            <Th>Nombre</Th>
            <Th>Descripción</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {Array.isArray(categories) && categories.map((category) => (
            <Tr key={category.id}>
              <Td>{category.name}</Td>
              <Td>{category.description}</Td>
              <Td>
                <Button onClick={() => handleDeleteCategory(category.id)} colorScheme="red">
                  Eliminar
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
};

export default DepartmentsPage;
