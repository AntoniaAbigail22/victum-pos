import categoriesData from './categories.json';

export const indexCategories = async () => {
  try {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ 
          status: true, 
          data: categoriesData,
          total: categoriesData.length
        });
      }, 500);
    });
  } catch (error) {
    throw new Error('Error al obtener categorías');
  }
};

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
