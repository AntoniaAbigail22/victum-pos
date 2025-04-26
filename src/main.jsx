import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { CustomProvider } from 'rsuite';
import 'rsuite/styles/index.less';
import { store, persistor } from "./redux/store";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(
    <ChakraProvider>
      <BrowserRouter>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <CustomProvider theme='high'>
              <App />
            </CustomProvider>
          </PersistGate>
        </Provider>
      </BrowserRouter>
    </ChakraProvider>
  );
} else {
  console.error('No se encontró el elemento con id "root".');
}
