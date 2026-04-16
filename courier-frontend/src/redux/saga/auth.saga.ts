import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  fetchMeRequest,
  fetchMeSuccess,
  fetchMeFailure,
  loginRequest,
  loginSuccess,
  loginFailure,
  signupRequest,
  signupSuccess,
  signupFailure,
  logoutRequest,
  logoutSuccess,
  logoutFailure,
} from '@/redux/slice/authSlice';
import type { User } from '@/redux/slice/authSlice';
import { authService } from '@/redux/service/auth.service';

// NOTE: authClient (better-auth/react) is NOT used in the saga.
// better-auth exposes plain REST endpoints (/api/auth/sign-in/email, etc.)
// which we call directly with Axios. Using authClient inside a generator
// causes "[object Promise] is not a valid HTTP method" because its internal
// proxy methods are not plain async functions and break under yield call().

function* handleFetchMe(): Generator {
  console.log('[AuthSaga] handleFetchMe → GET /api/users/me');
  try {
    const data = (yield call([authService, authService.getMe])) as User;
    console.log('[AuthSaga] handleFetchMe ✅ user:', data);
    yield put(fetchMeSuccess(data));
  } catch (e) {
    console.warn('[AuthSaga] handleFetchMe ❌ no session:', (e as Error).message);
    yield put(fetchMeFailure((e as Error).message));
  }
}

function* handleLogin(action: PayloadAction<{ email: string; password: string }>): Generator {
  console.log('[AuthSaga] handleLogin → POST /api/auth/sign-in/email for:', action.payload.email);
  try {
    yield call([authService, authService.login], action.payload);
    console.log('[AuthSaga] handleLogin → sign-in done, fetching user...');
    const data = (yield call([authService, authService.getMe])) as User;
    console.log('[AuthSaga] handleLogin ✅ logged in as:', data);
    yield put(loginSuccess(data));
  } catch (e) {
    console.error('[AuthSaga] handleLogin ❌', (e as Error).message);
    yield put(loginFailure((e as Error).message));
  }
}

function* handleSignup(action: PayloadAction<{ name: string; email: string; password: string }>): Generator {
  console.log('[AuthSaga] handleSignup → POST /api/auth/sign-up/email for:', action.payload.email);
  try {
    yield call([authService, authService.signup], action.payload);
    console.log('[AuthSaga] handleSignup → sign-up done, fetching user...');
    const data = (yield call([authService, authService.getMe])) as User;
    console.log('[AuthSaga] handleSignup ✅ user created:', data);
    yield put(signupSuccess(data));
  } catch (e) {
    console.error('[AuthSaga] handleSignup ❌', (e as Error).message);
    yield put(signupFailure((e as Error).message));
  }
}

function* handleLogout(): Generator {
  console.log('[AuthSaga] handleLogout → POST /api/auth/sign-out');
  try {
    yield call([authService, authService.logout]);
    console.log('[AuthSaga] handleLogout ✅');
    yield put(logoutSuccess());
  } catch (e) {
    console.error('[AuthSaga] handleLogout ❌', (e as Error).message);
    yield put(logoutFailure((e as Error).message));
  }
}

export function* authSaga() {
  console.log('[AuthSaga] initialized');
  yield takeLatest(fetchMeRequest.type, handleFetchMe);
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(signupRequest.type, handleSignup);
  yield takeLatest(logoutRequest.type, handleLogout);
}
