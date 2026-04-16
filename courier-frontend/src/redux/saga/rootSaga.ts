import { all } from 'redux-saga/effects';
import { authSaga } from './auth.saga';
import { shipmentsSaga } from './shipments.saga';

export function* rootSaga() {
  yield all([authSaga(), shipmentsSaga()]);
}
