import { createStore, combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import login from './reducers/login';

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['login'],
};

const appReducers = combineReducers({
    login,
});

const persistedReducer = persistReducer(persistConfig, appReducers);

const store = createStore(persistedReducer);
const persistor = persistStore(store);

export { store, persistor };