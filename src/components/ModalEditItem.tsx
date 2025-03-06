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
    VStack,
    Box,
} from "@chakra-ui/react";

interface ModalEditItemProps {
    isOpen: boolean;
    onClose: any;
    selectedProvider: number;
    provider: any;
}
const ModalEditItem: React.FC<ModalEditItemProps> = ({
    isOpen,
    onClose,
    selectedProvider,
    provider,
}) => {

    const [formData, setFormData] = useState({})

    useEffect(() => {
        if (provider) {
            setFormData({
                name: provider.name || "",
                address: provider.address || "",
                phone: provider.phone || "",
                email: provider?.email || "",
                company: provider?.company || "",
                id_asiggned_me: provider?.id_asiggned_me || "",
                dateRegister: provider?.dateRegister || "",
            });
        } else {
            setFormData({
                name: "",
                address: "",
                phone: "",
                email: "",
                company: "",
                id_asiggned_me: "",
                dateRegister: "",
            });
        }
    }, [provider]);


    const handleOpen = () => {
        if (provider) {
            setFormData(provider);
        }
        //onOpen();
    };

    const handleSave = () => {
        console.log(formData);
        onClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Datos del formulario:", formData);
    };


    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered size={'6xl'}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader bg="blue.500" color="white" position="relative">
                    {selectedProvider ? "Editar Proveedor" : "Crear Proveedor"}
                </ModalHeader>
                <ModalCloseButton
                    color="white"
                    top={'15px'}
                />
                <ModalBody>
                    <Box as="form" onSubmit={handleSubmit} paddingTop={2}>
                        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Nombre</FormLabel>
                                    <Input
                                        name="lastName"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Apellidos"
                                    />
                                </FormControl>
                            </GridItem>

                            <GridItem>
                                <FormControl>
                                    <FormLabel>Teléfono</FormLabel>
                                    <Input
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Teléfono"
                                    />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Email</FormLabel>
                                    <Input
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Email"
                                    />
                                </FormControl>
                            </GridItem>

                            <GridItem colSpan={2}>
                                <FormControl>
                                    <FormLabel>Compañía</FormLabel>
                                    <Input
                                        name="company"
                                        value={formData.company}
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
                                        value={formData.id_asiggned_me}
                                        onChange={handleChange}
                                        placeholder="ID Asignado"
                                    />
                                </FormControl>
                            </GridItem>
                            <GridItem>
                                <FormControl>
                                    <FormLabel>Fecha de Registro</FormLabel>
                                    <Input
                                        name="dateRegister"
                                        type="date"
                                        value={formData.dateRegister}
                                        onChange={handleChange}
                                    />
                                </FormControl>
                            </GridItem>
                        </Grid>
                    </Box>
                </ModalBody>

                <ModalFooter bg="white">
                    <Button variant="ghost" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button colorScheme="blue" ml={3} onClick={handleSubmit}>
                        Guardar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ModalEditItem;