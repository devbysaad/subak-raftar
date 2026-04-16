import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  fetchShipmentsRequest,
  fetchShipmentsSuccess,
  fetchShipmentsFailure,
  fetchShipmentRequest,
  fetchShipmentSuccess,
  fetchShipmentFailure,
  createShipmentRequest,
  createShipmentSuccess,
  createShipmentFailure,
  fetchShipmentHistoryRequest,
  fetchShipmentHistorySuccess,
  fetchShipmentHistoryFailure,
  updateShipmentStatusRequest,
  updateShipmentStatusSuccess,
  updateShipmentStatusFailure,
  cancelShipmentRequest,
  cancelShipmentSuccess,
  cancelShipmentFailure,
} from '@/redux/slice/shipmentsSlice';
import type { ShipmentFilters, ShipmentStatus, Shipment, ShipmentHistory } from '@/redux/slice/shipmentsSlice';
import { shipmentsService } from '@/redux/service/shipments.service';

function* handleFetchShipments(action: PayloadAction<Partial<ShipmentFilters>>): Generator {
  try {
    const data = (yield call(shipmentsService.getShipments, action.payload)) as {
      shipments: Shipment[];
      total: number;
    };
    yield put(fetchShipmentsSuccess(data));
  } catch (e) {
    yield put(fetchShipmentsFailure((e as Error).message));
  }
}

function* handleFetchShipment(action: PayloadAction<string>): Generator {
  try {
    const data = (yield call(shipmentsService.getShipment, action.payload)) as Shipment;
    yield put(fetchShipmentSuccess(data));
  } catch (e) {
    yield put(fetchShipmentFailure((e as Error).message));
  }
}

function* handleCreateShipment(action: PayloadAction<Partial<Shipment>>): Generator {
  try {
    const data = (yield call(
      shipmentsService.createShipment,
      action.payload as Record<string, unknown>
    )) as Shipment;
    yield put(createShipmentSuccess(data));
  } catch (e) {
    yield put(createShipmentFailure((e as Error).message));
  }
}

function* handleFetchShipmentHistory(action: PayloadAction<string>): Generator {
  try {
    const data = (yield call(shipmentsService.getShipmentHistory, action.payload)) as ShipmentHistory[];
    yield put(fetchShipmentHistorySuccess(data));
  } catch (e) {
    yield put(fetchShipmentHistoryFailure((e as Error).message));
  }
}

function* handleUpdateShipmentStatus(
  action: PayloadAction<{ id: string; status: ShipmentStatus; note?: string }>
): Generator {
  try {
    const data = (yield call(
      shipmentsService.updateShipmentStatus,
      action.payload.id,
      action.payload.status,
      action.payload.note
    )) as Shipment;
    yield put(updateShipmentStatusSuccess(data));
  } catch (e) {
    yield put(updateShipmentStatusFailure((e as Error).message));
  }
}

function* handleCancelShipment(action: PayloadAction<string>): Generator {
  try {
    const data = (yield call(shipmentsService.cancelShipment, action.payload)) as Shipment;
    yield put(cancelShipmentSuccess(data));
  } catch (e) {
    yield put(cancelShipmentFailure((e as Error).message));
  }
}

export function* shipmentsSaga() {
  yield takeLatest(fetchShipmentsRequest.type, handleFetchShipments);
  yield takeLatest(fetchShipmentRequest.type, handleFetchShipment);
  yield takeLatest(createShipmentRequest.type, handleCreateShipment);
  yield takeLatest(fetchShipmentHistoryRequest.type, handleFetchShipmentHistory);
  yield takeLatest(updateShipmentStatusRequest.type, handleUpdateShipmentStatus);
  yield takeLatest(cancelShipmentRequest.type, handleCancelShipment);
}
