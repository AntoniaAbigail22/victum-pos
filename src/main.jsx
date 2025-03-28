import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { CustomProvider } from 'rsuite';
import 'rsuite/styles/index.less';

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(
    <ChakraProvider>
      <BrowserRouter>
        <CustomProvider theme='high'>
          <App />
        </CustomProvider>
      </BrowserRouter>
    </ChakraProvider>
  );
} else {
  console.error('No se encontró el elemento con id "root".');
}