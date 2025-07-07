import categoriesData from './categories.json';

// Obtener todas las categorías
export const indexCategories = async () => {
  let response = { status: false };
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: true,
          data: categoriesData,
          total: categoriesData.length,
        });
      }, 500);
    });

    /*let fetch = await Fetcher({
      method: 'GET',
      url: `/products/${id}`
  });

  if (fetch.status == 200) {
      response = { status: true, data: fetch.data };
  }*/
  } catch (error) {
    throw new Error('Error al obtener categorías');
  }
};

// Eliminar una categoría
export const deleteCategory = async ({ id }) => {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        const categoryIndex = categoriesData.findIndex((category) => category.id === id);
        if (categoryIndex >= 0) {
          categoriesData.splice(categoryIndex, 1);
          resolve({ status: true });
        } else {
          throw new Error('Categoría no encontrada');
        }
      }, 500);
    });
  } catch (error) {
    throw new Error('Error al eliminar categoría');
  }
};

// Crear una nueva categoría
export const createCategory = async (newCategory) => {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newId = categoriesData.length ? Math.max(...categoriesData.map(cat => cat.id)) + 1 : 1;
        const categoryToAdd = { id: newId, ...newCategory };
        categoriesData.push(categoryToAdd);
        resolve({ status: true, data: categoryToAdd });
      }, 500);
    });
  } catch (error) {
    throw new Error('Error al crear categoría');
  }
};
