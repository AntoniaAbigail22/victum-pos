import React, { useState, useEffect } from 'react';
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
    Text,
    Code,
} from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

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
}) => {


    useEffect(() => {
        if (provider) {
            setFormData01({
                //id: provider.id || "",
                name: provider.name || "",
                address: provider.address || "",
                phone: provider.phone || "",
                email: provider?.email || "",
                company: provider?.company || "",
                rfc: provider?.rfc || "",
                curp: provider?.curp || "",
                id_asiggned_me: provider?.id_asiggned_me || "",
                created_at: provider?.created_at || "",
            });
            setFormData02({
                //id: provider?.billing?.id || "",
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
    };

    const handleOpen = () => {
        if (provider) {
            setFormData01(provider);
        }
        //onOpen();
    };

    const handleSave = () => {
        console.log(formData01);
        onClose();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData01((prev) => ({ ...prev, [name]: value }));
    };
    const handleChange2 = (e) => {
        const { name, value } = e.target;
        setFormData02((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormData01((prev) => ({ ...prev, ['store_id']: 1 }));
        setFormData02((prev) => ({ ...prev, ['store_id']: 1 }));
        addProvider()
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
                    {selectedProvider ? "Editar Proveedor" : "Crear Proveedor"}
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
                                <Tab>Datos generales</Tab>
                                <Tab>Facturación</Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel>
                                    <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                                        <GridItem colSpan={1}>
                                            <FormControl>
                                                <FormLabel>Nombre de la empresa</FormLabel>
                                                <Input
                                                    name="company"
                                                    value={formData01?.company}
                                                    onChange={handleChange}
                                                    placeholder="Compañía"
                                                />
                                            </FormControl>
                                        </GridItem>
                                        <GridItem>
                                            <FormControl>
                                                <FormLabel>ID Asignado</FormLabel>
                                                <Input
                                                    name="id_asiggned_me"
                                                    value={formData01?.id_asiggned_me}
                                                    onChange={handleChange}
                                                    placeholder="ID Asignado"
                                                />
                                            </FormControl>
                                        </GridItem>
                                        <GridItem>
                                            <FormControl>
                                                <FormLabel>Nombre</FormLabel>
                                                <Input
                                                    name="name"
                                                    value={formData01?.name}
                                                    onChange={handleChange}
                                                    placeholder="Apellidos"
                                                />
                                            </FormControl>
                                        </GridItem>
                                        <GridItem colSpan={1}>
                                            <FormControl>
                                                <FormLabel>Apellidos</FormLabel>
                                                <Input
                                                    name="last_name"
                                                    value={formData01?.last_name}
                                                    onChange={handleChange}
                                                    placeholder="Apellidos"
                                                />
                                            </FormControl>
                                        </GridItem>


                                        <GridItem>
                                            <FormControl>
                                                <FormLabel>RFC</FormLabel>
                                                <Input
                                                    name="rfc"
                                                    value={formData01?.rfc}
                                                    onChange={handleChange}
                                                    placeholder="RFC"
                                                />
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
                                                />
                                            </FormControl>
                                        </GridItem>

                                        <GridItem>
                                            <FormControl>
                                                <FormLabel>Teléfono</FormLabel>
                                                <Input
                                                    name="phone"
                                                    value={formData01?.phone}
                                                    onChange={handleChange}
                                                    placeholder="Teléfono"
                                                />
                                            </FormControl>
                                        </GridItem>
                                        <GridItem colSpan={1}>
                                            <FormControl>
                                                <FormLabel>Email</FormLabel>
                                                <Input
                                                    name="email"
                                                    value={formData01?.email}
                                                    onChange={handleChange}
                                                    placeholder="Email"
                                                />
                                            </FormControl>
                                        </GridItem>
                                       
                                        {provider?.id &&
                                            <GridItem>
                                                <FormControl>
                                                    <FormLabel>Fecha de Registro</FormLabel>
                                                    <Input
                                                        name="created_at"
                                                        //type="date"
                                                        disabled
                                                        value={formData01?.created_at}
                                                        onChange={handleChange}
                                                    />
                                                </FormControl>
                                            </GridItem>
                                        }
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
                                                    placeholder="Compañía"
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
                                                    placeholder="Teléfono"
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
                                                    placeholder="Email"
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
                                                    placeholder="ID Asignado"
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
                    <Button
                        onClick={closeModal}
                        _focus={{
                            boxShadow: "outline",
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        colorScheme="blue"
                        ml={3}
                        onClick={handleSubmit}
                        onKeyDown={(e) => {
                            if (e.key === " ") {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}>
                        Guardar
                    </Button>

                    {/*<Text fontSize="sm" color="gray.500">
                            <strong>Esc</strong> = Cerrar ventana
                        </Text>*/}

                    <Box mt={2} width="full" position={'absolute'} left={10}>
                        <div className='fixed bottom-0 left-0 bg-slate-200 w-full p-1'>
                            <Text fontSize="sm" fontWeight="thin" color="gray.600">
                                <Text fontSize="xs" fontWeight="thin" color="gray.600">
                                    <Code fontWeight="bold" colorScheme='blackAlpha'>Esc</Code> para cerrar ventana,{" "}
                                    <Code fontWeight="bold" colorScheme='blackAlpha'>→</Code> o <Code fontWeight="bold" colorScheme='blackAlpha'>←</Code> para navegar entre las opciones{" "}
                                </Text>
                            </Text>
                        </div>
                    </Box>
                </ModalFooter>
            </ModalContent>
        </Modal >
    );
};

export default ModalEditItem;