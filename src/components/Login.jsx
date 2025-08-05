import React, { useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import { connect } from "react-redux";
import {
    Box,
    VStack,
    Heading,
    Image,
    useToast,
    Text,
    Input,
    InputGroup,
    InputRightElement,
    Button,
    Checkbox
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import Context from '../redux/Context';
import { login } from '../api/login';

function Login({ openSession }) {
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const dispatch = useDispatch();
    const toast = useToast();

    const { signIn } = useContext(Context);
    const [isSubmitting, setSubmitting] = useState(false);

    const [data, setData] = useState({
        //email: 'eziocano23@hotmail.com', username: 'eziocano23', password: '1523',
        //email: 'rico@gmail.com', username: 'rico', password: '123',
        email: '', username: '', password: '',
    });

    const handleChange = (event) => {
        const { value, name } = event.currentTarget;
        setData({ ...data, [name]: value });
    }

    const handleLogin = async (e) => {
        try {
            e.preventDefault();
            setSubmitting(true)
            if (data?.email.trim() === '' || data?.password.trim() === '') {
                toast({
                    title: 'Campos vacíos',
                    description: 'Por favor, ingresa usuario y contraseña.',
                    status: 'warning',
                    duration: 3000,
                    isClosable: true,
                });
                return;
            }

            /*dispatch({
                type: 'OPEN_',
                data: {
                    nombre: email,
                    fecha_login: new Date().toISOString(),
                },
            });*/

            let response = await login({ data })
            console.log("🚀 ~ handleLogin ~ response:", response)
            if (response?.status) {
                openSession(response?.data.user);
                signIn();
                toast({
                    title: 'Bienvenido',
                    description: `Hola ${response?.data.user?.name || ''}, accediste a Victum POS.`,
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else console.error('error', response)


        } catch (error) {
            console.log("🚀 ~ handleLogin ~ error:", error)
        } finally {
            setSubmitting(false)
        }

    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <Box className="bg-white p-10 rounded-2xl shadow-xl" maxW="500px" >
                <VStack spacing={8}>
                    <Image
                        src="/logo1.png"
                        alt="Logo Victum POS"
                        boxSize="90px"
                        objectFit="contain"
                    />

                    <Heading
                        as="h2"
                        size="lg"
                        textAlign="center"
                        color="#0A2342"
                        fontWeight="extrabold"
                        letterSpacing="wide"
                    >
                        Bienvenido a Victum POS
                    </Heading>
                    <Input
                        id="email"
                        name="email"
                        placeholder="Usuario"
                        value={data.email}
                        onChange={handleChange}
                        size="md"
                        focusBorderColor="#0A2342"
                    />

                    <InputGroup size="md">
                        <Input
                            pr="4.5rem"
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Contraseña"
                            value={data.password}
                            onChange={handleChange}
                            focusBorderColor="#0A2342"
                        />
                        <InputRightElement width="3rem">
                            <Button
                                h="1.75rem"
                                size="sm"
                                onClick={() => setShowPassword(!showPassword)}
                                variant="ghost"
                            >
                                {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                            </Button>
                        </InputRightElement>
                    </InputGroup>

                    <Checkbox
                        isChecked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        alignSelf="start"
                        colorScheme="blue"
                    >
                        Recordar sesión
                    </Checkbox>

                    <Button
                        bg="#007BFF"
                        color="white"
                        _hover={{ bg: "#0069D9" }}
                        onClick={handleLogin}
                        w="100%"
                        size="lg"
                        borderRadius="md"
                    >
                        Iniciar sesión
                    </Button>

                    <Text fontSize="xs" color="gray.500" textAlign="center">
                        © 2025 Victum POS. Todos los derechos reservados.
                    </Text>
                </VStack>
            </Box>
        </div>
    );
};

const mapStateToProps = state => ({ information_user: state.login.information_user });

const mapDispatchToProps = dispatch => ({
    openSession: data => dispatch({ type: "OPEN_", data })
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);