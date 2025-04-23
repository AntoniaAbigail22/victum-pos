import React, { useEffect, useState } from 'react';
import {
  Button, Modal,
  ModalOverlay, ModalContent,
  ModalHeader, ModalFooter,
  ModalBody, ModalCloseButton,
  FormControl, FormLabel, Input,
  Grid, GridItem, Box, Code,
  FormHelperText,
  InputLeftAddon,
  Stack
} from '@chakra-ui/react';
import { notification } from 'antd';
import BottomMessage from './BottomMessage';
import { HexColorPicker } from 'react-colorful'; // Importamos HexColorPicker

const ModalEditCategory = ({
  isOpen,
  onClose,
  selectedCategory,
  setSelectedCategory,
  category,
  setCategory,
  formData,
  setFormData,
  addCategory,
  updateCategory
}) => {

  const [api, contextHolder] = notification.useNotification();
  const [errors, setErrors] = useState({
    name: false,
    color: false
  });

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleKeyDown = (event) => {
    if (event.key == "Escape") {
      closeModal();
    }
    if (event.key === "F10" || (event.key === "F10" && event.ctrlKey)) {
      handleSubmit(event);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (color) => {
    setFormData((prev) => ({ ...prev, color }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación
    const newErrors = {
      name: !formData?.name,
      color: !formData?.color
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) {
      api.error({
        message: 'Error',
        description: 'Por favor complete los campos requeridos'
      });
      return;
    }

    if (selectedCategory) {
      updateCategory();
    } else {
      addCategory();
    }
  };

  const closeModal = () => {
    setCategory(null);
    setSelectedCategory(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg="blue.500" color="white">
          {selectedCategory ? "Editar" : "Crear"} Categoría
        </ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody>
          <Grid templateColumns="repeat(1, 1fr)" gap={4}>
            <GridItem colSpan={1}>
              <FormControl isInvalid={errors.name}>
                <FormLabel>Nombre <span className="text-red-500">*</span></FormLabel>
                <Input
                  name="name"
                  value={formData?.name}
                  onChange={handleChange}
                  placeholder="Nombre de la categoría"
                />
                {errors.name && (
                  <FormHelperText color="red.500">
                    El nombre es requerido
                  </FormHelperText>
                )}
              </FormControl>
            </GridItem>

            <GridItem colSpan={1}>
              <FormControl>
                <FormLabel>Descripción</FormLabel>
                <Input
                  name="description"
                  value={formData?.description}
                  onChange={handleChange}
                  placeholder="Descripción opcional"
                />
              </FormControl>
            </GridItem>

            <GridItem colSpan={1}>
              <FormControl isInvalid={errors.color}>
                <FormLabel>Color <span className="text-red-500">*</span></FormLabel>
                <Stack direction="row" align="center">
                  <Box
                    w="24px"
                    h="24px"
                    borderRadius="md"
                    bg={formData?.color}
                    border="1px solid #ccc"
                  />
                  <Input
                    value={formData?.color}
                    onChange={(e) => handleColorChange(e.target.value)}
                    maxWidth="120px"
                  />
                </Stack>
                <Box w="200px" mt={2}>
                  <HexColorPicker
                    color={formData?.color}
                    onChange={handleColorChange}
                  />
                </Box>
                {errors.color && (
                  <FormHelperText color="red.500">
                    Seleccione un color
                  </FormHelperText>
                )}
              </FormControl>
            </GridItem>
          </Grid>
        </ModalBody>

        <ModalFooter>
          <Button onClick={closeModal}>
            Cancelar (Esc)
          </Button>
          <Button
            colorScheme="blue"
            ml={3}
            onClick={handleSubmit}
          >
            Guardar (F10)
          </Button>
        </ModalFooter>
        <BottomMessage>
          <Code fontWeight="bold" colorScheme="blackAlpha">Tab</Code> para navegar entre campos
        </BottomMessage>
      </ModalContent>
    </Modal>
  );
};

export default ModalEditCategory;
