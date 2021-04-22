import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { lpCollectionReducer } from './reducers/lpReducers'
import { userLoginReducer } from './reducers/userReducers'

const reducers = combineReducers({
    auth: userLoginReducer,
    lpCollection: lpCollectionReducer
})


const userInfoFromStorage = localStorage.getItem('userInfo') ?
    JSON.parse(localStorage.getItem('userInfo')) : null

const initialState = {
    auth: { userInfo: userInfoFromStorage }
}

const store = createStore(reducers, initialState, composeWithDevTools(applyMiddleware(thunk)))

export default store