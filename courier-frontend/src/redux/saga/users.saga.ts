import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  fetchUsersRequest, fetchUsersSuccess, fetchUsersFailure,
  createUserRequest, createUserSuccess, createUserFailure,
  deactivateUserRequest, deactivateUserSuccess, deactivateUserFailure,
} from '@/redux/slice/usersSlice';
import type { User } from '@/redux/slice/authSlice';
import { usersService } from '@/redux/service/users.service';

function* handleFetchUsers(): Generator {
  try {
    const users = (yield call([usersService, usersService.getUsers])) as User[];
    yield put(fetchUsersSuccess(users));
  } catch (e) {
    yield put(fetchUsersFailure((e as Error).message));
  }
}

function* handleCreateUser(
  action: PayloadAction<{ name: string; email: string; password: string; role: string }>
): Generator {
  try {
    const user = (yield call([usersService, usersService.createUser], action.payload)) as User;
    yield put(createUserSuccess(user));
  } catch (e) {
    yield put(createUserFailure((e as Error).message));
  }
}

function* handleDeactivateUser(action: PayloadAction<string>): Generator {
  try {
    const user = (yield call([usersService, usersService.deactivateUser], action.payload)) as User;
    yield put(deactivateUserSuccess(user));
  } catch (e) {
    yield put(deactivateUserFailure((e as Error).message));
  }
}

export function* usersSaga() {
  yield takeLatest(fetchUsersRequest.type,  handleFetchUsers);
  yield takeLatest(createUserRequest.type,  handleCreateUser);
  yield takeLatest(deactivateUserRequest.type, handleDeactivateUser);
}
