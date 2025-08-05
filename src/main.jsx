import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import UserContextProvider from './redux/UserContextProvider';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import { CustomProvider } from 'rsuite';
import 'rsuite/styles/index.less';

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ChakraProvider>
          <BrowserRouter>
            <CustomProvider theme='high'>
              <UserContextProvider>
                <App />
              </UserContextProvider>
            </CustomProvider>
          </BrowserRouter>
        </ChakraProvider>
      </PersistGate>
    </Provider>
  );
} else {
  console.error('No se encontró el elemento con id "root".');
}
