import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import authReducer       from './slice/authSlice';
import shipmentsReducer  from './slice/shipmentsSlice';
import usersReducer      from './slice/usersSlice';
import uiReducer         from './slice/uiSlice';
import complaintsReducer from './slice/complaintsSlice';
import { rootSaga }      from './saga/rootSaga';

const sagaMiddleware = createSagaMiddleware();

const customLogger = (store: any) => (next: any) => (action: any) => {
  return next(action);
};

export const store = configureStore({
  reducer: {
    auth:       authReducer,
    shipments:  shipmentsReducer,
    users:      usersReducer,
    ui:         uiReducer,
    complaints: complaintsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(sagaMiddleware, customLogger),
});

sagaMiddleware.run(rootSaga);

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
