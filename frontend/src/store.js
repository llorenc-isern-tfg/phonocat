import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import createSagaMiddleware from 'redux-saga'
import { composeWithDevTools } from 'redux-devtools-extension'
import { lpCollectionReducer, lpAutocompleteReducer, lpPreloadReducer, lpAddReducer } from './reducers/lpReducers'
import { userLoginReducer } from './reducers/userReducers'
import { alertReducer } from './reducers/alertReducers'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import rootSaga from './sagas'
import { USER_LOGGGED_OUT } from './constants/userActionTypes'

const authPersistConfig = {
    key: 'auth',
    storage: storage,
    whitelist: ['userInfo'] //nomès persistim les dades de l'usuari autenticat
};

const reducers = combineReducers({
    auth: persistReducer(authPersistConfig, userLoginReducer),
    lpCollection: lpCollectionReducer,
    lpAutocomplete: lpAutocompleteReducer,
    lpPreload: lpPreloadReducer,
    lpAdd: lpAddReducer,
    alerts: alertReducer
})

const rootReducer = (state, action) => {
    if (action.type === USER_LOGGGED_OUT) {
        storage.removeItem('persist:auth')
        return reducers(undefined, action)
    }
    return reducers(state, action)
}

const saga = createSagaMiddleware()
const middlewares = [saga, thunk]

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middlewares)))
saga.run(rootSaga)
export const persistor = persistStore(store)
