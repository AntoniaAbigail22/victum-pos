import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
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

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const dispatch = useDispatch();
  const toast = useToast();

  const handleLogin = () => {
    if (username.trim() === '' || password.trim() === '') {
      toast({
        title: 'Campos vacíos',
        description: 'Por favor, ingresa usuario y contraseña.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    dispatch({
      type: 'OPEN_',
      data: {
        nombre: username,
        fecha_login: new Date().toISOString(),
      },
    });

    toast({
      title: 'Bienvenido',
      description: `Hola ${username}, accediste a Victum POS.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Box
        className="bg-white p-10 rounded-2xl shadow-xl"
        w="500px"  
      >
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
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            size="md"
            focusBorderColor="#0A2342"
          />

          <InputGroup size="md">
            <Input
              pr="4.5rem"
              type={showPassword ? 'text' : 'password'}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
    </Box>
  );
};

export default Login;
