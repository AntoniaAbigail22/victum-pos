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
import { openNotification } from '../libs/Extras';
import BottomMessage from './BottomMessage';

const ModalEditItem = ({
    isOpen,
    onClose,
    selectedProvider,
    setSelectedProvider,
    provider,
    setProvider,
    formData01,
    setFormData01,
    formData02,
    setFormData02,
    addProvider,
    updateProvider
}) => {

    const [api, contextHolder] = notification.useNotification();
    const sendNotification = (type, description) => openNotification(api, type, description)

    useEffect(() => {
        if (provider) {
            setFormData01({
                name: provider.name || "",
                last_name: provider.last_name || "",
                address: provider.address || "",
                phone: provider.phone || "",
                email: provider?.email || "",
                company: provider?.company || "",
                rfc: provider?.rfc || "",
                curp: provider?.curp || "",
                id_asiggned_me: provider?.id_asiggned_me || "",
                created_at: provider?.created_at || "",
                comment: provider?.comment || ""
            });
            setFormData02({
                company: provider?.billing?.company || "",
                rfc: provider?.billing?.rfc || "",
                curp: provider?.billing?.curp || "",
                address: provider?.billing?.address || "",
                no_e: provider?.billing?.no_e || "",
                no_i: provider?.billing?.no_i || "",
                cp: provider?.billing?.cp || "",
                col: provider?.billing?.col || "",
                municipio: provider?.billing?.municipio || "",
                local: provider?.billing?.local || "",
                state: provider?.billing?.state || "",
                pais: provider?.billing?.pais || "",
            });
        } else {
            setFormData01(null);
            setFormData02(null);
        }
    }, [provider]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const [tabIndex, setTabIndex] = useState(0);

    const handleKeyDown = (event) => {
        if (event.key == "Escape") {
            closeModal()
        }
        if (event.key === 'ArrowLeft') {
            setTabIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
        } else if (event.key === 'ArrowRight') {
            setTabIndex((prevIndex) => (prevIndex < 1 ? prevIndex + 1 : prevIndex));
        }
        if (event.key === "F10" || (event.key === "F10" && event.ctrlKey)) {
            handleSubmit(event);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData01((prev) => ({ ...prev, [name]: value }));
    };
    const handleChange2 = (e) => {
        const { name, value } = e.target;
        setFormData02((prev) => ({ ...prev, [name]: value }));
    };

    const [validEmail, setValidEmail] = useState(false)

    const [errors, setErrors] = useState({
        name: false,
        last_name: false,
        phone: false,
        email: false,
        company: false,
        rfc: false,
        id_asiggned_me: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const keys = Object.keys(errors);
        const errorsAux = {};

        if (!formData01) {
            const newErrors = keys.reduce((acc, key) => {
                acc[key] = true;
                return acc;
            }, {});
            setErrors(newErrors);
            sendNotification("info", "Verifica el")
            return;
        }

        const newErrors = keys.reduce((acc, key) => {
            acc[key] = !formData01[key];
            return acc;
        }, {});
        setErrors(newErrors);

        console.log("🚀 ~ handleSubmit ~ errorsAux:", newErrors);

        const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
        const isValidEmail = emailRegex.test(formData01?.email);
        setValidEmail(!isValidEmail);

        if (!isValidEmail) {
            sendNotification("info", "Verifica el correo electronico")
            return
        }

        if (Object.values(newErrors).some(Boolean)) {
            sendNotification("info", "Verifica los campos reuqeridos")
            return
        }

        if (selectedProvider) updateProvider()
        else addProvider();
    };

    const closeModal = () => {
        setProvider(null);
        setSelectedProvider(0)
        onClose();
    }

    return (
        <Modal isOpen={isOpen} onClose={closeModal} isCentered size={'6xl'} scrollBehavior={'inside'}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader bg="blue.500" color="white" position="relative">
                    {selectedProvider ? "Editar" : "Crear"} Proveedor
                </ModalHeader>
                <ModalCloseButton
                    color="white"
                    top={'15px'}
                    onClick={closeModal}
                />
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
                                            <FormControl>
                                                <FormLabel>Nombre de la empresa<span className='text-red-500'>*</span></FormLabel>
                                                <Input
                                                    name="company"
                                                    value={formData01?.company}
                                                    onChange={handleChange}
                                                    placeholder="Compañía"
                                                />
                                                {errors?.company &&
                                                    <FormHelperText color={'red.500'}>
                                                        Nombre de la empresa requerida
                                                    </FormHelperText>
                                                }
                                            </FormControl>
                                        </GridItem>
                                        <GridItem>
                                            <FormControl>
                                                <FormLabel>ID Asignado<span className='text-red-500'>*</span></FormLabel>
                                                <Input
                                                    name="id_asiggned_me"
                                                    value={formData01?.id_asiggned_me}
                                                    onChange={handleChange}
                                                    placeholder="ID Asignado"
                                                />
                                                {errors?.id_asiggned_me &&
                                                    <FormHelperText color={'red.500'}>
                                                        ID asignado es requerido
                                                    </FormHelperText>
                                                }
                                            </FormControl>
                                        </GridItem>
                                        <GridItem>
                                            <FormControl>
                                                <FormLabel>Nombre<span className='text-red-500'>*</span></FormLabel>
                                                <Input
                                                    name="name"
                                                    value={formData01?.name}
                                                    onChange={handleChange}
                                                    placeholder="Nombre(s)"
                                                />
                                                {errors?.name &&
                                                    <FormHelperText color={'red.500'}>
                                                        Nombre requerido
                                                    </FormHelperText>
                                                }
                                            </FormControl>
                                        </GridItem>
                                        <GridItem colSpan={1}>
                                            <FormControl>
                                                <FormLabel>Apellidos<span className='text-red-500'>*</span></FormLabel>
                                                <Input
                                                    name="last_name"
                                                    value={formData01?.last_name}
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
                                                    value={formData01?.rfc}
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
                                                    value={formData01?.curp}
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
                                                    value={formData01?.phone}
                                                    onChange={handleChange}
                                                    placeholder="Teléfono"
                                                    type='number'
                                                />
                                                {errors?.phone &&
                                                    <FormHelperText color={'red.500'}>
                                                        Número telefónico requerido
                                                    </FormHelperText>
                                                }
                                            </FormControl>
                                        </GridItem>
                                        <GridItem colSpan={1}>
                                            <FormControl>
                                                <FormLabel>Email<span className='text-red-500'>*</span></FormLabel>
                                                <Input
                                                    name="email"
                                                    value={formData01?.email}
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
                                                    value={formData01?.comment}
                                                    onChange={handleChange}
                                                />
                                            </FormControl>
                                        </GridItem>
                                        {provider?.id &&
                                            <GridItem>
                                                <FormLabel className='italic font-bold' color={'gray.400'}>Fecha de Registro: {formData01?.created_at}</FormLabel>
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
                                                    value={formData02?.company}
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
                                                    value={formData02?.rfc}
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
                                                    value={formData02?.curp}
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
                                                    value={formData02?.address}
                                                    onChange={handleChange2}
                                                />
                                            </FormControl>
                                        </GridItem>
                                        <GridItem colSpan={1}>
                                            <FormControl>
                                                <FormLabel>No. Ext</FormLabel>
                                                <Input
                                                    name="no_e"
                                                    value={formData02?.no_e}
                                                    onChange={handleChange2}
                                                />
                                            </FormControl>
                                        </GridItem>
                                        <GridItem>
                                            <FormControl>
                                                <FormLabel>No. Int</FormLabel>
                                                <Input
                                                    name="no_i"
                                                    value={formData02?.no_i}
                                                    onChange={handleChange2}
                                                />
                                            </FormControl>
                                        </GridItem>
                                        <GridItem>
                                            <FormControl>
                                                <FormLabel>CP</FormLabel>
                                                <Input
                                                    name="cp"
                                                    value={formData02?.cp}
                                                    onChange={handleChange2}
                                                />
                                            </FormControl>
                                        </GridItem>
                                        <GridItem colSpan={3}>
                                            <FormControl>
                                                <FormLabel>Colonia</FormLabel>
                                                <Input
                                                    name="col"
                                                    value={formData02?.col}
                                                    onChange={handleChange2}
                                                />
                                            </FormControl>
                                        </GridItem>

                                        <GridItem colSpan={2}>
                                            <FormControl>
                                                <FormLabel>Municipio</FormLabel>
                                                <Input
                                                    name="municipio"
                                                    value={formData02?.municipio}
                                                    onChange={handleChange2}
                                                />
                                            </FormControl>
                                        </GridItem>
                                        <GridItem colSpan={2}>
                                            <FormControl>
                                                <FormLabel>Localidad</FormLabel>
                                                <Input
                                                    name="local"
                                                    value={formData02?.local}
                                                    onChange={handleChange2}
                                                />
                                            </FormControl>
                                        </GridItem>
                                        <GridItem colSpan={2}>
                                            <FormControl>
                                                <FormLabel>Estado</FormLabel>
                                                <Input
                                                    name="state"
                                                    value={formData02?.state}
                                                    onChange={handleChange2}
                                                />
                                            </FormControl>
                                        </GridItem>
                                        <GridItem colSpan={2}>
                                            <FormControl>
                                                <FormLabel>País</FormLabel>
                                                <Input
                                                    name="pais"
                                                    value={formData02?.pais}
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
                        <Code fontWeight="bold" colorScheme='blackAlpha'>Tab → </Code> para cambiar entre campo de texto,{" "}
                        <Code fontWeight="bold" colorScheme='blackAlpha'>→</Code> o <Code fontWeight="bold" colorScheme='blackAlpha'>←</Code> para navegar entre las opciones.
                    </BottomMessage>
                </ModalFooter>
            </ModalContent>
        </Modal >
    );
};

export default ModalEditItem;