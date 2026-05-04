import { all } from 'redux-saga/effects';
import { authSaga }       from './auth.saga';
import { shipmentsSaga }  from './shipments.saga';
import { usersSaga }      from './users.saga';
import { complaintsSaga } from './complaints.saga';

export function* rootSaga() {
  yield all([authSaga(), shipmentsSaga(), usersSaga(), complaintsSaga()]);
}
