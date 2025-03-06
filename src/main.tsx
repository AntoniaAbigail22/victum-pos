import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container); 
  root.render(
    <StrictMode>
      <ChakraProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ChakraProvider>
    </StrictMode>
  );
} else {
  console.error('No se encontró el elemento con id "root".');
}