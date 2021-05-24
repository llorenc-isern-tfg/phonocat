import { all, fork } from 'redux-saga/effects'
import { userSaga } from './userSaga'
import { lpSaga } from './lpSaga'
import { socialSaga } from './socialSaga'
import { marketSaga } from './marketSaga'

//Combinar totes les sagas
export default function* rootSaga() {
    yield all([
        fork(userSaga),
        fork(lpSaga),
        fork(socialSaga),
        fork(marketSaga)
    ]);
}