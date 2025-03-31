import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Grid,
  GridItem,
  Box,
  Code,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  FormHelperText,
} from "@chakra-ui/react";
import { notification } from "antd";
import { openNotification } from "../libs/Extras";
import BottomMessage from "./BottomMessage";

const ModalEditProduct = ({
  isOpen,
  onClose,
  selectedProduct,
  setSelectedProduct,
  product,
  setProduct,
  formData,
  setFormData,
  addProduct,
  updateProduct,
  categories = [],
}) => {
  const [api, contextHolder] = notification.useNotification();
  const sendNotification = (type, description) =>
    openNotification(api, type, description);

  useEffect(() => {
    if (product) {
      setFormData({
        code: product.code || "",
        description: product.description || "",
        mode_sale: product.mode_sale || 1,
        price_cost: product.price_cost || 0,
        price_sale: product.price_sale || 0,
        utility: product.utility || 0,
        price_whole: product.price_whole || 0,
        category_id: product.category_id || null,
        quanty_whole: product.quanty_whole || 0,
      });
    } else {
      setFormData({
        code: "",
        description: "",
        mode_sale: 1,
        price_cost: 0,
        price_sale: 0,
        utility: 0,
        price_whole: 0,
        category_id: null,
        quanty_whole: 0,
      });
    }
  }, [product]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [formData]);

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
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

  const handleNumberChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [errors, setErrors] = useState({
    code: false,
    description: false,
    price_cost: false,
    price_sale: false,
  });

  const calculateUtility = () => {
    if (formData?.price_cost && formData?.price_sale) {
      const utility =
        ((formData.price_sale - formData.price_cost) / formData.price_cost) *
        100;
      handleNumberChange("utility", utility.toFixed(2));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      code: !formData?.code,
      description: !formData?.description,
      price_cost: !formData?.price_cost || formData.price_cost <= 0,
      price_sale: !formData?.price_sale || formData.price_sale <= 0,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) {
      sendNotification("error", "Por favor completa los campos requeridos");
      return;
    }

    if (selectedProduct) {
      updateProduct();
    } else {
      addProduct();
    }
  };

  const closeModal = () => {
    setProduct(null);
    setSelectedProduct(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      isCentered
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader bg="blue.500" color="white" position="relative">
          {selectedProduct ? "Editar" : "Crear"} Producto
        </ModalHeader>
        <ModalCloseButton color="white" top="15px" onClick={closeModal} />

        <ModalBody minHeight="400px" maxHeight="500px">
          <Box as="form" onSubmit={handleSubmit} paddingTop={1}>
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <GridItem colSpan={1}>
                <FormControl isInvalid={errors.code}>
                  <FormLabel>
                    Código<span className="text-red-500">*</span>
                  </FormLabel>
                  <Input
                    name="code"
                    value={formData?.code || ""}
                    onChange={handleChange}
                    placeholder="Código del producto"
                  />
                  {errors.code && (
                    <FormHelperText color="red.500">
                      Código requerido
                    </FormHelperText>
                  )}
                </FormControl>
              </GridItem>

              <GridItem colSpan={2}>
                <FormControl isInvalid={errors.description}>
                  <FormLabel>
                    Descripción<span className="text-red-500">*</span>
                  </FormLabel>
                  <Input
                    name="description"
                    value={formData?.description || ""}
                    onChange={handleChange}
                    placeholder="Descripción del producto"
                  />
                  {errors.description && (
                    <FormHelperText color="red.500">
                      Descripción requerida
                    </FormHelperText>
                  )}
                </FormControl>
              </GridItem>

              <GridItem colSpan={1}>
                <FormControl>
                  <FormLabel>Categoría</FormLabel>
                  <Select
                    name="category_id"
                    value={formData?.category_id || ""}
                    onChange={handleChange}
                    placeholder="Selecciona una categoría"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </GridItem>

              <GridItem colSpan={1}>
                <FormControl>
                  <FormLabel>Tipo de Venta</FormLabel>
                  <Select
                    name="mode_sale"
                    value={formData?.mode_sale || 1}
                    onChange={handleChange}
                  >
                    <option value={1}>Venta Unitario</option>
                    <option value={2}>Venta por Mayoreo</option>
                  </Select>
                </FormControl>
              </GridItem>

              <GridItem colSpan={1}>
                <FormControl isInvalid={errors.price_cost}>
                  <FormLabel>
                    Precio Costo<span className="text-red-500">*</span>
                  </FormLabel>
                  <NumberInput
                    precision={2}
                    min={0}
                    value={formData?.price_cost || 0}
                    onChange={(value) =>
                      handleNumberChange("price_cost", value)
                    }
                    onBlur={calculateUtility}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  {errors.price_cost && (
                    <FormHelperText color="red.500">
                      Precio costo inválido
                    </FormHelperText>
                  )}
                </FormControl>
              </GridItem>

              <GridItem colSpan={1}>
                <FormControl isInvalid={errors.price_sale}>
                  <FormLabel>
                    Precio Venta<span className="text-red-500">*</span>
                  </FormLabel>
                  <NumberInput
                    precision={2}
                    min={0}
                    value={formData?.price_sale || 0}
                    onChange={(value) =>
                      handleNumberChange("price_sale", value)
                    }
                    onBlur={calculateUtility}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  {errors.price_sale && (
                    <FormHelperText color="red.500">
                      Precio venta inválido
                    </FormHelperText>
                  )}
                </FormControl>
              </GridItem>

              <GridItem colSpan={1}>
                <FormControl>
                  <FormLabel>Utilidad (%)</FormLabel>
                  <NumberInput
                    precision={2}
                    value={formData?.utility || 0}
                    isReadOnly
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
              </GridItem>

              <GridItem colSpan={1}>
                <FormControl>
                  <FormLabel>Precio Mayoreo</FormLabel>
                  <NumberInput
                    precision={2}
                    min={0}
                    value={formData?.price_whole || 0}
                    onChange={(value) =>
                      handleNumberChange("price_whole", value)
                    }
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </GridItem>

              <GridItem colSpan={1}>
                <FormControl>
                  <FormLabel>Cantidad para Mayoreo</FormLabel>
                  <NumberInput
                    precision={2}
                    min={0}
                    value={formData?.quanty_whole || 0}
                    onChange={(value) =>
                      handleNumberChange("quanty_whole", value)
                    }
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </GridItem>
            </Grid>
          </Box>
        </ModalBody>

        <ModalFooter bg="white">
          <Button onClick={closeModal}>Cancelar (Esc)</Button>
          <Button colorScheme="blue" ml={3} onClick={handleSubmit}>
            Guardar (F10)
          </Button>
          <BottomMessage>
            <Code fontWeight="bold" colorScheme="blackAlpha">
              Tab
            </Code>{" "}
            para navegar entre campos
          </BottomMessage>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalEditProduct;
