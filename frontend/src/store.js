import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import createSagaMiddleware from 'redux-saga'
import { composeWithDevTools } from 'redux-devtools-extension'
import { lpCollectionReducer, lpAutocompleteReducer } from './reducers/lpReducers'
import { userLoginReducer } from './reducers/userReducers'
import { alertReducer } from './reducers/alertReducers'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import rootSaga from './sagas'

const authPersistConfig = {
    key: 'auth',
    storage: storage,
    whitelist: ['userInfo'] //nomès persistim les dades de l'usuari autenticat
};

const reducers = combineReducers({
    auth: persistReducer(authPersistConfig, userLoginReducer),
    // lpCollection: lpCollectionReducer,
    lpAutocomplete: lpAutocompleteReducer,
    alerts: alertReducer
})

const saga = createSagaMiddleware()
const middlewares = [saga, thunk]

export const store = createStore(reducers, composeWithDevTools(applyMiddleware(...middlewares)))
saga.run(rootSaga)
export const persistor = persistStore(store)
