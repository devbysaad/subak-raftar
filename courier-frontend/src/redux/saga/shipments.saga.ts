import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  fetchShipmentsRequest, fetchShipmentsSuccess, fetchShipmentsFailure,
  fetchShipmentRequest, fetchShipmentSuccess, fetchShipmentFailure,
  createShipmentRequest, createShipmentSuccess, createShipmentFailure,
  fetchShipmentHistoryRequest, fetchShipmentHistorySuccess, fetchShipmentHistoryFailure,
  updateShipmentStatusRequest, updateShipmentStatusSuccess, updateShipmentStatusFailure,
  cancelShipmentRequest, cancelShipmentSuccess, cancelShipmentFailure,
} from '@/redux/slice/shipmentsSlice';
import type { ShipmentFilters, ShipmentStatus, Shipment, ShipmentHistory } from '@/redux/slice/shipmentsSlice';
import { shipmentsService } from '@/redux/service/shipments.service';

// Backend response: { success, message, data: { shipments, total } } OR { success, message, data: Shipment }
// axios interceptor returns the full response.data object

function* handleFetchShipments(action: PayloadAction<Partial<ShipmentFilters> | Record<string, string>>): Generator {
  try {
    const res = (yield call([shipmentsService, shipmentsService.getShipments], action.payload as Partial<ShipmentFilters>)) as Record<string, unknown>;
    const payload = res?.data as Record<string, unknown> ?? res;
    const shipments = (payload?.shipments ?? payload?.data ?? []) as Shipment[];
    const total     = (payload?.total ?? 0) as number;
    yield put(fetchShipmentsSuccess({ shipments, total }));
  } catch (e) {
    yield put(fetchShipmentsFailure((e as Error).message));
  }
}

function* handleFetchShipment(action: PayloadAction<string>): Generator {
  try {
    const res = (yield call([shipmentsService, shipmentsService.getShipment], action.payload)) as Record<string, unknown>;
    const shipment = (res?.data ?? res) as Shipment;
    yield put(fetchShipmentSuccess(shipment));
  } catch (e) {
    yield put(fetchShipmentFailure((e as Error).message));
  }
}

function* handleCreateShipment(action: PayloadAction<Partial<Shipment>>): Generator {
  try {
    const res = (yield call(
      [shipmentsService, shipmentsService.createShipment],
      action.payload as Record<string, unknown>
    )) as Record<string, unknown>;
    const shipment = (res?.data ?? res) as Shipment;
    yield put(createShipmentSuccess(shipment));
  } catch (e) {
    yield put(createShipmentFailure((e as Error).message));
  }
}

function* handleFetchShipmentHistory(action: PayloadAction<string>): Generator {
  try {
    const res = (yield call([shipmentsService, shipmentsService.getShipmentHistory], action.payload)) as Record<string, unknown>;
    const history = ((res?.data ?? res) as ShipmentHistory[]) ?? [];
    yield put(fetchShipmentHistorySuccess(history));
  } catch (e) {
    yield put(fetchShipmentHistoryFailure((e as Error).message));
  }
}

function* handleUpdateShipmentStatus(
  action: PayloadAction<{ id: string; status: ShipmentStatus; note?: string }>
): Generator {
  try {
    const res = (yield call(
      [shipmentsService, shipmentsService.updateShipmentStatus],
      action.payload.id,
      action.payload.status,
      action.payload.note
    )) as Record<string, unknown>;
    const shipment = (res?.data ?? res) as Shipment;
    yield put(updateShipmentStatusSuccess(shipment));
  } catch (e) {
    yield put(updateShipmentStatusFailure((e as Error).message));
  }
}

function* handleCancelShipment(action: PayloadAction<string>): Generator {
  try {
    const res = (yield call([shipmentsService, shipmentsService.cancelShipment], action.payload)) as Record<string, unknown>;
    const shipment = (res?.data ?? res) as Shipment;
    yield put(cancelShipmentSuccess(shipment));
  } catch (e) {
    yield put(cancelShipmentFailure((e as Error).message));
  }
}

export function* shipmentsSaga() {
  yield takeLatest(fetchShipmentsRequest.type,  handleFetchShipments);
  yield takeLatest(fetchShipmentRequest.type,   handleFetchShipment);
  yield takeLatest(createShipmentRequest.type,  handleCreateShipment);
  yield takeLatest(fetchShipmentHistoryRequest.type,    handleFetchShipmentHistory);
  yield takeLatest(updateShipmentStatusRequest.type,    handleUpdateShipmentStatus);
  yield takeLatest(cancelShipmentRequest.type,  handleCancelShipment);
}
