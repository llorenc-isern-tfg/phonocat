import { createStore, combineReducers, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { composeWithDevTools } from 'redux-devtools-extension'
import { lpCollectionReducer, lpAddReducer, lpDetailsReducer, lpEditReducer } from './reducers/lpReducers'
import { userLoginReducer, userProfileReducer } from './reducers/userReducers'
import { userListReducer, userDetailReducer } from './reducers/socialReducers'
import {
    listedItemsReducer, listedItemOfferReducer,
    receivedOffersReducer, sendedOffersReducer
} from './reducers/marketReducers'
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
    lpCollection: lpCollectionReducer,
    lpAdd: lpAddReducer,
    lpDetails: lpDetailsReducer,
    lpEdit: lpEditReducer,
    userProfile: userProfileReducer,
    userList: userListReducer,
    userDetail: userDetailReducer,
    lpsForSale: listedItemsReducer,
    listedItemOffer: listedItemOfferReducer,
    receivedOffers: receivedOffersReducer,
    sendedOffers: sendedOffersReducer,
    alerts: alertReducer,
})

const saga = createSagaMiddleware()
const middlewares = [saga]

export const store = createStore(reducers, composeWithDevTools(applyMiddleware(...middlewares)))
saga.run(rootSaga)
export const persistor = persistStore(store)
