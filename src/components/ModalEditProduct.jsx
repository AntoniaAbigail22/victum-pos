import React, { useState, useEffect, useRef } from "react";
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
    Flex,
    Switch,
    Center,
    Collapse,
    Radio,
    RadioGroup,
    Stack,
    VStack,
    HStack,
    IconButton,
    Text,
    Tabs, TabList, TabPanels, Tab,
    TabPanel,
    useToast,
} from "@chakra-ui/react";
import { notification } from "antd";
import { DATA_FORM_PRODUCTS, openNotification, skipHandleKeyDown, supabase } from "../libs/Extras";
import BottomMessage from "./BottomMessage";
import FormInputField from "./FormInputField";
import { motion } from "framer-motion";
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { FaEquals, FaPlus } from 'react-icons/fa';
import { FiUpload } from "react-icons/fi";
import '../../src/extras.css';
import Codes from "./Codes";

const ProductForm = ({
    variant = false,
    onRemove,
    isLast,
    calculationMode,
    onPriceChange,
    onVariantChange,
    variantData
}) => {
    const [cost, setCost] = useState(variantData?.cost || 0);
    const [type, setType] = useState(variantData?.type || 0);
    const [marginValue, setMarginValue] = useState(variantData?.marginValue || 0);
    const [salePrice, setSalePrice] = useState(variantData?.salePrice || 0);
    const [name, setName] = useState(variantData?.name || '');
    const [code, setCode] = useState(variantData?.code || '');
    const [image, setImage] = useState(variantData?.image || null);
    const [hasWholesale, setHasWholesale] = useState(variantData?.hasWholesale || false);
    const [wholesaleQuantity, setWholesaleQuantity] = useState(variantData?.wholesaleQuantity || 0);
    const [wholesaleCost, setWholesaleCost] = useState(variantData?.wholesaleCost || cost);
    const [wholesaleMargin, setWholesaleMargin] = useState(variantData?.wholesaleMargin || 0);
    const [wholesalePrice, setWholesalePrice] = useState(variantData?.wholesalePrice || 0);
    const [currentStock, setCurrentStock] = useState(variantData?.currentStock || 0);
    const [minStock, setMinStock] = useState(variantData?.minStock || 0);
    const [maxStock, setMaxStock] = useState(variantData?.maxStock || 0);
    const fileInputRef = useRef(null);
    const toast = useToast();

    // Sincronizar costo mayoreo inicial con costo normal
    useEffect(() => {
        if (!variantData?.wholesaleCost) {
            setWholesaleCost(cost);
        }
    }, [cost]);

    useEffect(() => {
        calculatePrice();
        calculateWholesalePrice();
    }, [cost, marginValue, calculationMode, wholesaleMargin, wholesaleCost]);

    useEffect(() => {
        if (onVariantChange) {
            onVariantChange({
                name,
                code,
                image,
                cost,
                marginValue,
                salePrice,
                type,
                hasWholesale,
                wholesaleQuantity,
                wholesaleCost,
                wholesaleMargin,
                wholesalePrice,
                currentStock,
                minStock,
                maxStock
            });
        }
    }, [
        name, code, image, cost, marginValue, salePrice, type,
        hasWholesale, wholesaleQuantity, wholesaleCost, wholesaleMargin, wholesalePrice,
        currentStock, minStock, maxStock
    ]);

    // Validaciones
    useEffect(() => {
        if (hasWholesale) {
            if (parseFloat(wholesalePrice) >= parseFloat(salePrice)) {
                toast({
                    title: "Advertencia",
                    description: "El precio al mayoreo no debe ser mayor que el precio normal",
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                });
            }
            if (wholesaleCost > cost) {
                toast({
                    title: "Advertencia",
                    description: "El costo al mayoreo es mayor que el costo normal",
                    status: "warning",
                    duration: 3000,
                    isClosable: true,
                });
            }
        }
    }, [wholesalePrice, salePrice, wholesaleCost, cost, hasWholesale]);

    const calculatePrice = () => {
        let price = 0;
        if (calculationMode === 'percentage') {
            price = cost * (1 + (marginValue / 100));
        } else {
            price = cost + marginValue;
        }
        setSalePrice(price.toFixed(2));
        if (onPriceChange) onPriceChange(price);
    };

    const calculateWholesalePrice = () => {
        if (!hasWholesale) return;

        let price = 0;
        if (calculationMode === 'percentage') {
            price = wholesaleCost * (1 + (wholesaleMargin / 100));
        } else {
            price = wholesaleCost + wholesaleMargin;
        }

        setWholesalePrice(price.toFixed(2));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setImage(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setImage(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <Box borderWidth="1px" borderRadius="lg" p={4} mb={4} position="relative">
            {variant && (
                <FormControl mb={4}>
                    <FormLabel>Nombre de la variante</FormLabel>
                    <Input
                        placeholder="Ej: Talla, Color, etc."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </FormControl>
            )}

            <HStack spacing={4} mb={4}>
                <FormControl flex={2}>
                    <FormLabel>Código de barras</FormLabel>
                    <Input
                        placeholder="Código de barras"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="mb-4"
                    />
                    <FormInputField
                        label="Vendido en"
                        row={true}
                        name="type"
                        formData={{ type }}
                        onChange={(e) => setType(e.target.value)}
                        options={[
                            { id: 1, name: 'Barril' },
                            { id: 2, name: 'Botella' },
                            { id: 3, name: 'Caja' },
                            { id: 4, name: 'Cartón' },
                            { id: 6, name: 'Centímetro' },
                            { id: 7, name: 'Cuartillo' },
                            { id: 10, name: 'Galón' },
                            { id: 11, name: 'Garrafa' },
                            { id: 12, name: 'Gramo' },
                            { id: 13, name: 'Granel' },
                            { id: 14, name: 'Kilogramo' },
                            { id: 15, name: 'Kilómetro' },
                            { id: 16, name: 'Lata' },
                            { id: 17, name: 'Litro' },
                            { id: 18, name: 'Metro' },
                            { id: 19, name: 'Mililitro' },
                            { id: 20, name: 'Milímetro' },
                            { id: 21, name: 'Paquete' },
                            { id: 22, name: 'Pie' },
                            { id: 23, name: 'Pieza' },
                            { id: 24, name: 'Porcentaje' },
                            { id: 25, name: 'Pulgada' },
                            { id: 26, name: 'Sobre' },
                            { id: 28, name: 'Tonelada' },
                            { id: 29, name: 'Unidad' },
                            { id: 30, name: 'Otro' }
                        ]}
                    />
                </FormControl>

                <FormControl flex={1}>
                    <motion.div
                        whileHover={{ scale: 1.009 }}
                        whileTap={{ scale: 1 }}
                        className="relative border-2 border-dashed border-gray-300 rounded p-1 text-center cursor-pointer transition duration-300 ease-in-out hover:border-blue-500 mt-4"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*, .png, .jpeg, .jpg, .gif"
                            className="hidden"
                        />
                        {image ? (
                            <img
                                src={image}
                                className="h-[110px] mx-auto object-cover rounded w-auto"
                                loading="lazy"
                            />
                        ) : (
                            <div className="text-gray-500">
                                <FiUpload className="mx-auto text-3xl mb-2" />
                                <p>Arrastre y suelte una imagen o haga clic para cargar</p>
                            </div>
                        )}
                    </motion.div>
                </FormControl>
            </HStack>

            <Box mb={4} p={4} borderWidth="1px" borderRadius="lg">
                <HStack spacing={4} mb={4}>
                    <FormControl>
                        <FormLabel>Costo sin IVA $</FormLabel>
                        <NumberInput
                            precision={2}
                            value={cost}
                            onChange={(valueString) => setCost(parseFloat(valueString) || 0)}
                        >
                            <NumberInputField placeholder="0.00" />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </FormControl>

                    <Center height="40px" px={0} pt={8}>
                        <FaPlus color={'#B6B66B70'} />
                    </Center>

                    <FormControl>
                        <FormLabel>
                            {calculationMode === 'percentage' ? 'Margen (%)' : 'Margen ($)'}
                        </FormLabel>
                        <NumberInput
                            precision={2}
                            value={marginValue}
                            onChange={(valueString) => setMarginValue(parseFloat(valueString) || 0)}
                        >
                            <NumberInputField placeholder={calculationMode === 'percentage' ? '0.00%' : '0.00'} />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </FormControl>

                    <Center height="40px" px={0} pt={8}>
                        <FaEquals color={'#B6B66B70'} />
                    </Center>

                    <FormControl>
                        <FormLabel>Precio de venta</FormLabel>
                        <NumberInput precision={2} value={salePrice} isReadOnly>
                            <NumberInputField bg="gray.100" disabled />
                        </NumberInput>
                    </FormControl>
                </HStack>

                <Box mb={4}>
                    <Flex justify="space-between" align="center" mb={hasWholesale ? 4 : 0}>
                        <Text fontWeight="medium">¿Añadir precio por mayoreo para esta variante?</Text>
                        <Switch
                            colorScheme="teal"
                            isChecked={hasWholesale}
                            onChange={() => setHasWholesale(!hasWholesale)}
                        />
                    </Flex>

                    <Collapse in={hasWholesale} animateOpacity>
                        <VStack spacing={4}>
                            <HStack spacing={4} w="full">
                                <FormControl>
                                    <FormLabel>Cantidad mínima para mayoreo</FormLabel>
                                    <NumberInput
                                        min={1}
                                        value={wholesaleQuantity}
                                        onChange={(valueString) => {
                                            const value = parseInt(valueString) || 0;
                                            setWholesaleQuantity(Math.max(1, value));
                                        }}
                                    >
                                        <NumberInputField />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Costo mayoreo sin IVA $</FormLabel>
                                    <NumberInput
                                        precision={2}
                                        value={wholesaleCost}
                                        onChange={(valueString) => setWholesaleCost(parseFloat(valueString) || 0)}
                                    >
                                        <NumberInputField placeholder="0.00" />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </FormControl>
                                <Center height="40px" px={0} pt={8}>
                                    <FaPlus color={'#B6B66B70'} />
                                </Center>

                                <FormControl>
                                    <FormLabel>
                                        {calculationMode === 'percentage' ? 'Margen mayoreo (%)' : 'Margen mayoreo ($)'}
                                    </FormLabel>
                                    <NumberInput
                                        precision={2}
                                        value={wholesaleMargin}
                                        onChange={(valueString) => setWholesaleMargin(parseFloat(valueString) || 0)}
                                    >
                                        <NumberInputField />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper />
                                            <NumberDecrementStepper />
                                        </NumberInputStepper>
                                    </NumberInput>
                                </FormControl>

                                <Center height="40px" px={0} pt={8}>
                                    <FaEquals color={'#B6B66B70'} />
                                </Center>

                                <FormControl>
                                    <FormLabel>Precio mayoreo</FormLabel>
                                    <NumberInput precision={2} value={wholesalePrice} isReadOnly>
                                        <NumberInputField bg="gray.100" disabled />
                                    </NumberInput>
                                </FormControl>
                            </HStack>
                        </VStack>
                    </Collapse>
                </Box>
            </Box>

            <Box mb={4} p={4} borderWidth="1px" borderRadius="lg">
                <Text fontWeight="medium" mb={4}>Control de inventario</Text>
                <HStack spacing={4}>
                    <FormControl>
                        <FormLabel>Stock actual</FormLabel>
                        <NumberInput
                            min={0}
                            value={currentStock}
                            onChange={(valueString) => setCurrentStock(parseInt(valueString) || 0)}
                        >
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </FormControl>

                    <FormControl>
                        <FormLabel>Stock mínimo</FormLabel>
                        <NumberInput
                            min={0}
                            value={minStock}
                            onChange={(valueString) => setMinStock(parseInt(valueString) || 0)}
                        >
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </FormControl>

                    <FormControl>
                        <FormLabel>Stock máximo</FormLabel>
                        <NumberInput
                            min={0}
                            value={maxStock}
                            onChange={(valueString) => setMaxStock(parseInt(valueString) || 0)}
                        >
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </FormControl>
                </HStack>
            </Box>

            {variant && !isLast && (
                <Box textAlign="right">
                    <IconButton
                        aria-label="Eliminar variante"
                        icon={<MinusIcon />}
                        colorScheme="red"
                        size="sm"
                        onClick={onRemove}
                    />
                </Box>
            )}
        </Box>
    );
};

const ModalEditProduct = ({
    size,
    isOpen,
    onClose,
    selectedElement,
    setSelectedElement,
    element,
    setElement,
    formData,
    setFormData,
    addElement,
    updateProduct,
    categories = [],
    warehouses = [],
}) => {
    const [api, contextHolder] = notification.useNotification();
    const sendNotification = (type, description) => openNotification(api, type, description);
    const [tabIndex, setTabIndex] = useState(0);
    const toast = useToast();

    const [productType, setProductType] = useState('simple');
    const [variants, setVariants] = useState([{ id: 1, name: '', code: '', image: null, cost: 0, marginValue: 0, salePrice: 0 }]);
    const [calculationMode, setCalculationMode] = useState('percentage');
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        if (element) {
            setFormData({
                code: element.code || "",
                description: element.description || "",
                price_cost: element.price_cost || 0,
                price_sale: element.price_sale || 0,
                utility: element.utility || 0,
                price_whole: element.price_whole || 0,
                category_id: element.category_id || null,
                quanty_whole: element.quanty_whole || 0,
            });
        } else {
            setFormData({
                code: "",
                description: "",
                price_cost: 0,
                price_sale: 0,
                utility: 0,
                price_whole: 0,
                category_id: null,
                quanty_whole: 0,
                category: null,
                warehouses: null,
                mode: calculationMode
            });
        }
    }, [element]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleKeyDown = event => {
        if (skipHandleKeyDown(event, ['F10', 'Escape'], ['F10'])) return;
        event.preventDefault();
        if (event.key == "Escape") closeModal();
        if (event.key === "F10" || (event.key === "F10" && event.ctrlKey)) handleSubmit(event);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const [errors, setErrors] = useState(DATA_FORM_PRODUCTS);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {
            //code: !formData?.code,
            description: !formData?.description,
            //price_cost: !formData?.price_cost || formData.price_cost <= 0,
            //price_sale: !formData?.price_sale || formData.price_sale <= 0,
        };
        setErrors(newErrors);

        /*if (Object.values(newErrors).some(Boolean)) {
            alert("Por favor completa los campos requeridos");
            sendNotification("error", "Por favor completa los campos requeridos");
            
            return;
        }*/

        if (selectedElement) {
            updateProduct();
        } else {
            addElement(variants);
        }
    };

    const closeModal = () => {
        setElement(null);
        setSelectedElement(null);
        onClose();
    };

    const addVariant = () => {
        setVariants([...variants, {
            id: Date.now(),
            name: '',
            code: '',
            image: null,
            cost: 0,
            marginValue: 0,
            salePrice: 0,
            hasWholesale: false,
            wholesaleQuantity: 0,
            wholesaleCost: 0,
            wholesaleMargin: 0,
            wholesalePrice: 0
        }]);
    };

    const removeVariant = (id) => {
        if (variants.length > 1) {
            setVariants(variants.filter(v => v.id !== id));
        } else {
            toast({
                title: "Advertencia",
                description: "Debe haber al menos una variante",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handlePriceChange = (price) => {
        setTotalPrice(price);
    };

    const handleVariantChange = (index, data) => {
        const updatedVariants = [...variants];
        updatedVariants[index] = { ...updatedVariants[index], ...data };
        setVariants(updatedVariants);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={closeModal}
            isCentered
            size={size || "2xl"}
            scrollBehavior="inside"
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader bg="blue.500" color="white" position="relative">
                    {selectedElement ? "Editar" : "Añadir"} artículo
                </ModalHeader>
                <ModalCloseButton color="white" top="15px" onClick={closeModal} />

                <ModalBody>
                    <Box as="form" onSubmit={handleSubmit} padding={3} paddingTop={5} margin={0}>
                        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                            <GridItem colSpan={2}>
                                <FormInputField
                                    label="Nombre"
                                    name="description"
                                    formData={formData}
                                    errors={errors}
                                    onChange={handleChange}
                                    label_error={'Nombre del producto requerido'}
                                    row={true}
                                />
                            </GridItem>

                            <GridItem colSpan={2}>
                                <FormInputField
                                    label="Categorías"
                                    name="category"
                                    formData={formData}
                                    errors={errors}
                                    onChange={handleChange}
                                    label_error={'Categoría del producto requerida'}
                                    row={true}
                                    options={categories}
                                />
                            </GridItem>
                            <GridItem colSpan={2}>
                                <FormInputField
                                    label="Almacén"
                                    name="warehouses"
                                    formData={formData}
                                    errors={errors}
                                    onChange={handleChange}
                                    label_error={'Almacén del producto requerida'}
                                    row={true}
                                    options={warehouses}
                                />
                            </GridItem>
                            <GridItem colSpan={2}>
                                <div className="flex flex-row gap-1">
                                    <FormLabel className="text-sm font-semibold text-gray-700 flex flex-col min-w-[170px] pt-1">
                                        Código y precios
                                    </FormLabel>
                                    <Box borderWidth="1px" borderRadius="lg" p={4} style={{ width: "100%" }}>
                                        <Flex justify="space-between" align="center" mb={4}>
                                            <RadioGroup onChange={setProductType} value={productType}>
                                                <Stack direction="row">
                                                    <Radio value="simple">Sin variante</Radio>
                                                    <Radio value="variant">Con variantes</Radio>
                                                </Stack>
                                            </RadioGroup>
                                            <Flex align="center">
                                                <Text mr={2}>Cantidad $</Text>
                                                <Switch
                                                    colorScheme="teal"
                                                    isChecked={calculationMode === 'percentage'}
                                                    onChange={() => {
                                                        setCalculationMode(calculationMode === 'percentage' ? 'amount' : 'percentage');
                                                        handleChange({ target: { name: 'mode', value: calculationMode } });
                                                    }}
                                                />
                                                <Text ml={2}>% Porcentaje</Text>
                                            </Flex>
                                        </Flex>
                                        <Collapse in={productType === 'simple'} animateOpacity>
                                            <ProductForm
                                                calculationMode={calculationMode}
                                                onPriceChange={handlePriceChange}
                                                onVariantChange={(data) => handleVariantChange(0, data)}
                                            />
                                        </Collapse>
                                        <Collapse in={productType === 'variant'} animateOpacity>
                                            <VStack spacing={4} align="stretch">
                                                {variants.map((variant, index) => (
                                                    <ProductForm
                                                        key={variant.id}
                                                        variant
                                                        onRemove={() => removeVariant(variant.id)}
                                                        isLast={index === 0 && variants.length === 1}
                                                        calculationMode={calculationMode}
                                                        onPriceChange={handlePriceChange}
                                                        onVariantChange={(data) => handleVariantChange(index, data)}
                                                        variantData={variant}
                                                    />
                                                ))}
                                                <Button
                                                    leftIcon={<AddIcon />}
                                                    colorScheme="teal"
                                                    variant="outline"
                                                    onClick={addVariant}
                                                >
                                                    Añadir variante
                                                </Button>
                                                {variants.length === 1 && (
                                                    <Text fontSize="sm" color="gray.500" textAlign="center">
                                                        Añade todas las variantes necesarias
                                                    </Text>
                                                )}
                                            </VStack>
                                        </Collapse>
                                    </Box>
                                </div>
                            </GridItem>
                        </Grid>
                    </Box>
                </ModalBody>
                <ModalFooter bg="white" paddingBottom={10}>
                    <Button onClick={closeModal}>Cancelar (Esc)</Button>
                    <Button colorScheme="blue" ml={3} onClick={handleSubmit}>
                        Guardar (F10)
                    </Button>
                    <BottomMessage>
                        <Codes label={'TAB ↓ ↑ → ←'} /> para navegar entre campos
                    </BottomMessage>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ModalEditProduct;