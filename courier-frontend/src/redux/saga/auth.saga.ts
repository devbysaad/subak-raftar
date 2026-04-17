import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  fetchMeRequest, fetchMeSuccess, fetchMeFailure,
  loginRequest, loginSuccess, loginFailure,
  signupRequest, signupSuccess, signupFailure,
  logoutRequest, logoutSuccess, logoutFailure,
} from '@/redux/slice/authSlice';
import type { User } from '@/redux/slice/authSlice';
import { authService } from '@/redux/service/auth.service';

// On page load — read session cookie → get user from our DB
function* handleFetchMe(): Generator {
  try {
    const user = (yield call([authService, authService.getMe])) as User;
    yield put(fetchMeSuccess(user));
  } catch (e) {
    yield put(fetchMeFailure((e as Error).message));
  }
}

// Login: call better-auth → extract user from response → fallback to getMe
function* handleLogin(action: PayloadAction<{ email: string; password: string }>): Generator {
  try {
    const data = (yield call([authService, authService.login], action.payload)) as Record<string, unknown>;

    // Try to use the user data from the login response directly (avoids cookie timing issue)
    const fromResponse = authService.extractUser(data);
    if (fromResponse) {
      yield put(loginSuccess(fromResponse));
      return;
    }

    // Fallback: cookie should be set now, fetch from our endpoint
    const user = (yield call([authService, authService.getMe])) as User;
    yield put(loginSuccess(user));
  } catch (e) {
    yield put(loginFailure((e as Error).message));
  }
}

// Signup: same pattern as login
function* handleSignup(action: PayloadAction<{ name: string; email: string; password: string }>): Generator {
  try {
    const data = (yield call([authService, authService.signup], action.payload)) as Record<string, unknown>;

    const fromResponse = authService.extractUser(data);
    if (fromResponse) {
      yield put(signupSuccess(fromResponse));
      return;
    }

    const user = (yield call([authService, authService.getMe])) as User;
    yield put(signupSuccess(user));
  } catch (e) {
    yield put(signupFailure((e as Error).message));
  }
}

function* handleLogout(): Generator {
  try {
    yield call([authService, authService.logout]);
    yield put(logoutSuccess());
  } catch (e) {
    yield put(logoutFailure((e as Error).message));
  }
}

export function* authSaga() {
  yield takeLatest(fetchMeRequest.type, handleFetchMe);
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(signupRequest.type, handleSignup);
  yield takeLatest(logoutRequest.type, handleLogout);
}
