import React, { useState, useEffect } from 'react';
import {
    Button, Modal,
    ModalOverlay, ModalContent,
    ModalHeader, ModalFooter,
    ModalBody, ModalCloseButton,
    FormControl, FormLabel, Input,
    Grid, GridItem, Box, Code,
    Tabs, TabList, TabPanels, Tab,
    TabPanel,
    FormHelperText,
} from '@chakra-ui/react'
import { notification } from 'antd';
import Codes from '../Codes';
import FormErrorText from '../FormErrorText';
import FormInputField from '../FormInputField';
import { DATA_FORM_PROVIDERS, openNotification, validateEmail, validateErrors, skipHandleKeyDown, validateLabelErrors } from '../../libs/Extras';
import BottomMessage from '../BottomMessage';

const ModalEditProvider = ({
    type,
    isOpen,
    onClose,
    selectedElement,
    setSelectedElement,
    element,
    setElement,
    formPersonalData,
    setFormPersonalData,
    formBillingData,
    setFormBillingData,
    addElement,
    updateElement
}) => {

    const [api, contextHolder] = notification.useNotification();
    const sendNotification = (type, description) => openNotification(api, type, description)

    useEffect(() => {
        if (element) {
            setFormPersonalData({
                name: element.name || "",
                last_name: element.last_name || "",
                address: element.address || "",
                phone: element.phone || "",
                email: element?.email || "",
                company: element?.company || "",
                rfc: element?.rfc || "",
                curp: element?.curp || "",
                id_asiggned_me: element?.id_asiggned_me || "",
                created_at: element?.created_at || "",
                comment: element?.comment || ""
            });
            if (type == 1) {
                setFormBillingData({
                    company: element?.billing?.company || "",
                    rfc: element?.billing?.rfc || "",
                    curp: element?.billing?.curp || "",
                    address: element?.billing?.address || "",
                    no_e: element?.billing?.no_e || "",
                    no_i: element?.billing?.no_i || "",
                    cp: element?.billing?.cp || "",
                    col: element?.billing?.col || "",
                    municipio: element?.billing?.municipio || "",
                    local: element?.billing?.local || "",
                    state: element?.billing?.state || "",
                    pais: element?.billing?.pais || "",
                });
            }
        } else {
            setFormPersonalData(null);
            setFormBillingData(null);
        }
    }, [element]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const [tabIndex, setTabIndex] = useState(0);

    const handleKeyDown = event => {
        if (skipHandleKeyDown(event, ['ArrowLeft', 'ArrowRight', 'F10', 'Escape'], ['F10'])) return;
        event.preventDefault();
        if (event.key == "Escape") closeModal()
        if (event.key === 'ArrowLeft') setTabIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
        if (event.key === 'ArrowRight') setTabIndex((prevIndex) => (prevIndex < 1 ? prevIndex + 1 : prevIndex));
        if (event.key === "F10" || (event.key === "F10" && event.ctrlKey)) handleSubmit(event);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormPersonalData((prev) => ({ ...prev, [name]: value }));
    };
    const handleChange2 = (e) => {
        const { name, value } = e.target;
        setFormBillingData((prev) => ({ ...prev, [name]: value }));
    };

    const [validEmail, setValidEmail] = useState(false)

    const [errors, setErrors] = useState(DATA_FORM_PROVIDERS);

    const handleSubmit = (e) => {
        e.preventDefault();
        const keys = Object.keys(errors);

        if (!formPersonalData) {
            setErrors(validateErrors(keys));
            sendNotification("info", "Verifica los campos")
            return;
        }

        const newErrors = validateLabelErrors(keys, formPersonalData);
        setErrors(newErrors);

        console.log("🚀 ~ handleSubmit ~ errorsAux:", newErrors);

        const isValidEmail = validateEmail(formPersonalData?.email);
        setValidEmail(!isValidEmail);

        if (!isValidEmail) {
            sendNotification("info", "Verifica el correo electronico")
            return
        }
        if (Object.values(newErrors).some(Boolean)) {
            sendNotification("info", "Verifica los campos reuqeridos")
            return
        }
        if (selectedElement) updateElement()
        else addElement();
    };

    const closeModal = () => {
        setElement(null);
        setSelectedElement(0)
        onClose();
    }

    return (
        <Modal isOpen={isOpen} onClose={closeModal} isCentered size={'6xl'} scrollBehavior={'inside'}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader bg="blue.500" color="white" position="relative">
                    {selectedElement ? "Editar" : "Crear"} Proveedor
                </ModalHeader>
                <ModalCloseButton color="white" top={'15px'} onClick={closeModal} />
                <ModalBody minHeight={'450px'} maxHeight={'450px'}>
                    <Box as="form" onSubmit={handleSubmit} paddingTop={1}>
                        <Tabs index={tabIndex} onChange={(index) => setTabIndex(index)}>
                            <TabList>
                                <Tab>Datos generales<span className='text-red-500'>*</span></Tab>
                                <Tab>Facturación</Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel>
                                    <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                                        <GridItem colSpan={1}>
                                            <FormInputField
                                                label="Compañía"
                                                name="company"
                                                formData={formPersonalData}
                                                errors={errors}
                                                onChange={handleChange}
                                                label_error={'Nombre de la empresa requerida'}
                                            />
                                        </GridItem>
                                        <GridItem>
                                            <FormInputField
                                                label="ID Asignado"
                                                name="id_asiggned_me"
                                                formData={formPersonalData}
                                                errors={errors}
                                                onChange={handleChange}
                                                label_error={'El ID asignado es requerido'}
                                            />
                                        </GridItem>
                                        <GridItem>
                                            <FormInputField
                                                label="Nombre"
                                                name="name"
                                                formData={formPersonalData}
                                                errors={errors}
                                                onChange={handleChange}
                                                placeholder="Nombre(s)"
                                                label_error={'Nombre requerido'}
                                            />
                                        </GridItem>
                                        <GridItem colSpan={1}>
                                            <FormControl>
                                                <FormLabel>Apellidos<span className='text-red-500'>*</span></FormLabel>
                                                <Input
                                                    name="last_name"
                                                    value={formPersonalData?.last_name}
                                                    onChange={handleChange}
                                                    placeholder="Apellidos"
                                                />
                                                {errors?.last_name &&
                                                    <FormHelperText color={'red.500'}>
                                                        Apellidos requeridos
                                                    </FormHelperText>
                                                }
                                            </FormControl>
                                        </GridItem>


                                        <GridItem>
                                            <FormControl>
                                                <FormLabel>RFC<span className='text-red-500'>*</span></FormLabel>
                                                <Input
                                                    name="rfc"
                                                    value={formPersonalData?.rfc}
                                                    onChange={handleChange}
                                                    placeholder="RFC"
                                                    maxLength={13}
                                                />
                                                {errors?.rfc &&
                                                    <FormHelperText color={'red.500'}>
                                                        RFC requerido
                                                    </FormHelperText>
                                                }
                                            </FormControl>
                                        </GridItem>
                                        <GridItem colSpan={1}>
                                            <FormControl>
                                                <FormLabel>CURP</FormLabel>
                                                <Input
                                                    name="curp"
                                                    value={formPersonalData?.curp}
                                                    onChange={handleChange}
                                                    placeholder="CURP"
                                                    maxLength={20}
                                                />
                                                {errors?.curp &&
                                                    <FormHelperText color={'red.500'}>
                                                        CURP requerida
                                                    </FormHelperText>
                                                }
                                            </FormControl>
                                        </GridItem>

                                        <GridItem>
                                            <FormControl>
                                                <FormLabel>Teléfono<span className='text-red-500'>*</span></FormLabel>
                                                <Input
                                                    name="phone"
                                                    value={formPersonalData?.phone}
                                                    onChange={handleChange}
                                                    placeholder="Teléfono"
                                                    type='number'
                                                />
                                                {errors?.phone && <FormErrorText label={'Número telefónico requerido'} />}
                                            </FormControl>
                                        </GridItem>
                                        <GridItem colSpan={1}>
                                            <FormControl>
                                                <FormLabel>Email<span className='text-red-500'>*</span></FormLabel>
                                                <Input
                                                    name="email"
                                                    value={formPersonalData?.email}
                                                    onChange={handleChange}
                                                    placeholder="Email"
                                                    type="email"
                                                />
                                                {errors?.email ?
                                                    <FormHelperText color={'red.500'}>
                                                        Correo electrónico requerido
                                                    </FormHelperText>
                                                    : validEmail &&
                                                    <FormHelperText color={'red.500'}>
                                                        Correo electrónico inválido
                                                    </FormHelperText>
                                                }
                                            </FormControl>
                                        </GridItem>


                                        <GridItem colSpan={2}>
                                            <FormControl>
                                                <FormLabel>Comentarios</FormLabel>
                                                <Input
                                                    name="comment"
                                                    value={formPersonalData?.comment}
                                                    onChange={handleChange}
                                                />
                                            </FormControl>
                                        </GridItem>
                                        {element?.id &&
                                            <GridItem>
                                                <FormLabel className='italic font-bold' color={'gray.400'}>Fecha de Registro: {formPersonalData?.created_at}</FormLabel>
                                            </GridItem>
                                        }

                                    </Grid>
                                </TabPanel>
                                <TabPanel>
                                    <Grid templateColumns="repeat(4, 1fr)" gap={3}>
                                        <GridItem colSpan={4}>
                                            <FormControl>
                                                <FormLabel>Razón Social</FormLabel>
                                                <Input
                                                    name="company"
                                                    value={formBillingData?.company}
                                                    onChange={handleChange2}
                                                    placeholder="Razón Social"
                                                />
                                            </FormControl>
                                        </GridItem>
                                        <GridItem colSpan={2}>
                                            <FormControl>
                                                <FormLabel>RFC</FormLabel>
                                                <Input
                                                    name="rfc"
                                                    value={formBillingData?.rfc}
                                                    onChange={handleChange2}
                                                    placeholder="RFC"
                                                />
                                            </FormControl>
                                        </GridItem>
                                        <GridItem colSpan={2}>
                                            <FormControl>
                                                <FormLabel>CURP</FormLabel>
                                                <Input
                                                    name="curp"
                                                    value={formBillingData?.curp}
                                                    onChange={handleChange2}
                                                    placeholder="CURP"
                                                />
                                            </FormControl>
                                        </GridItem>

                                        <GridItem colSpan={2}>
                                            <FormControl>
                                                <FormLabel>Domicilio</FormLabel>
                                                <Input
                                                    name="address"
                                                    value={formBillingData?.address}
                                                    onChange={handleChange2}
                                                />
                                            </FormControl>
                                        </GridItem>
                                        <GridItem colSpan={1}>
                                            <FormControl>
                                                <FormLabel>No. Ext</FormLabel>
                                                <Input
                                                    name="no_e"
                                                    value={formBillingData?.no_e}
                                                    onChange={handleChange2}
                                                />
                                            </FormControl>
                                        </GridItem>
                                        <GridItem>
                                            <FormControl>
                                                <FormLabel>No. Int</FormLabel>
                                                <Input
                                                    name="no_i"
                                                    value={formBillingData?.no_i}
                                                    onChange={handleChange2}
                                                />
                                            </FormControl>
                                        </GridItem>
                                        <GridItem>
                                            <FormControl>
                                                <FormLabel>CP</FormLabel>
                                                <Input
                                                    name="cp"
                                                    value={formBillingData?.cp}
                                                    onChange={handleChange2}
                                                />
                                            </FormControl>
                                        </GridItem>
                                        <GridItem colSpan={3}>
                                            <FormControl>
                                                <FormLabel>Colonia</FormLabel>
                                                <Input
                                                    name="col"
                                                    value={formBillingData?.col}
                                                    onChange={handleChange2}
                                                />
                                            </FormControl>
                                        </GridItem>

                                        <GridItem colSpan={2}>
                                            <FormControl>
                                                <FormLabel>Municipio</FormLabel>
                                                <Input
                                                    name="municipio"
                                                    value={formBillingData?.municipio}
                                                    onChange={handleChange2}
                                                />
                                            </FormControl>
                                        </GridItem>
                                        <GridItem colSpan={2}>
                                            <FormControl>
                                                <FormLabel>Localidad</FormLabel>
                                                <Input
                                                    name="local"
                                                    value={formBillingData?.local}
                                                    onChange={handleChange2}
                                                />
                                            </FormControl>
                                        </GridItem>
                                        <GridItem colSpan={2}>
                                            <FormControl>
                                                <FormLabel>Estado</FormLabel>
                                                <Input
                                                    name="state"
                                                    value={formBillingData?.state}
                                                    onChange={handleChange2}
                                                />
                                            </FormControl>
                                        </GridItem>
                                        <GridItem colSpan={2}>
                                            <FormControl>
                                                <FormLabel>País</FormLabel>
                                                <Input
                                                    name="pais"
                                                    value={formBillingData?.pais}
                                                    onChange={handleChange2}
                                                />
                                            </FormControl>
                                        </GridItem>

                                    </Grid>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </Box>
                </ModalBody>
                <ModalFooter bg="white">
                    <Button onClick={closeModal}>
                        Cancelar (Esc)
                    </Button>
                    <Button
                        colorScheme="blue"
                        ml={3}
                        onClick={handleSubmit}>
                        Guardar (F10)
                    </Button>
                    <BottomMessage>
                        <Codes label={'Tab → '} sub={' para cambiar entre campo de texto, '} />
                        <Codes label={'→ '} /> o <Codes label={'←'} /> para cambiar entre pestañas.
                    </BottomMessage>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ModalEditProvider;