import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  fetchComplaintsRequest,
  fetchComplaintsSuccess,
  fetchComplaintsFailure,
  createComplaintRequest,
  createComplaintSuccess,
  createComplaintFailure,
} from '@/redux/slice/complaintsSlice';
import type { Complaint, ComplaintFilters } from '@/redux/slice/complaintsSlice';
import { complaintsService } from '@/redux/service/complaints.service';

function* handleFetchComplaints(action: PayloadAction<ComplaintFilters>): Generator {
  try {
    const res = (yield call(
      [complaintsService, complaintsService.getComplaints],
      action.payload
    )) as Record<string, unknown>;

    const data = (res?.data ?? res) as Record<string, unknown>;
    yield put(fetchComplaintsSuccess({
      items: (data?.items ?? []) as Complaint[],
      total: (data?.total ?? 0)  as number,
      pages: (data?.pages ?? 1)  as number,
    }));
  } catch (e) {
    yield put(fetchComplaintsFailure((e as Error).message));
  }
}

function* handleCreateComplaint(
  action: PayloadAction<{ parcelNo: string; status: string; remarks: string }>
): Generator {
  try {
    const res = (yield call(
      [complaintsService, complaintsService.createComplaint],
      action.payload
    )) as Record<string, unknown>;

    const complaint = (res?.data ?? res) as Complaint;
    yield put(createComplaintSuccess(complaint));

    // Re-fetch the full list so the new entry is confirmed from the server
    yield put(fetchComplaintsRequest({}));
  } catch (e) {
    yield put(createComplaintFailure((e as Error).message));
  }
}

export function* complaintsSaga() {
  yield takeLatest(fetchComplaintsRequest.type, handleFetchComplaints);
  yield takeLatest(createComplaintRequest.type, handleCreateComplaint);
}
