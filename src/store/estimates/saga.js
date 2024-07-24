import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_ESTIMATES,
  GET_ESTIMATE_DELETED_VALUE,
  ADD_NEW_ESTIMATE,
  DELETE_ESTIMATE,
  UPDATE_ESTIMATE,
} from "./actionTypes";

import {
  getEstimatesSuccess,
  getEstimatesFail,
  getEstimateDeletedValueSuccess,
  getEstimateDeletedValueFail,
  addEstimateFail,
  addEstimateSuccess,
  updateEstimateSuccess,
  updateEstimateFail,
  deleteEstimateSuccess,
  deleteEstimateFail,
} from "./actions";

// Include Both Helper File with needed methods
import {
  getEstimates,
  getEstimateDeletedValue,
  addNewEstimate,
  updateEstimate,
  deleteEstimate,
} from "../../helpers/fakebackend_helper";

function* fetchEstimates() {
  const get_estimates_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_estimate",
  };
  try {
    const response = yield call(getEstimates, get_estimates_req);
    yield put(getEstimatesSuccess(response));
  } catch (error) {
    yield put(getEstimatesFail(error));
  }
}

function* fetchEstimateDeletedValue() {
  try {
    const response = yield call(getEstimateDeletedValue);
    yield put(getEstimateDeletedValueSuccess(response));
  } catch (error) {
    yield put(getEstimateDeletedValueFail(error));
  }
}

function* onAddNewEstimate({ payload, estimate }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_estimate";

  try {
    const response = yield call(addNewEstimate, payload);
    yield put(addEstimateSuccess(response[0]));
  } catch (error) {
    yield put(addEstimateFail(error));
  }
}

function* onUpdateEstimate({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_estimate";

  try {
    const respupdate = yield call(updateEstimate, payload);
    yield put(updateEstimateSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateEstimateFail(error));
  }
}

function* onDeleteEstimate({ payload, estimate }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_estimate";

  try {
    const respdelete = yield call(deleteEstimate, payload);
    yield put(deleteEstimateSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteEstimateFail(error));
  }
}

function* estimatesSaga() {
  yield takeEvery(GET_ESTIMATES, fetchEstimates);
  yield takeEvery(GET_ESTIMATE_DELETED_VALUE, fetchEstimateDeletedValue);
  yield takeEvery(ADD_NEW_ESTIMATE, onAddNewEstimate);
  yield takeEvery(UPDATE_ESTIMATE, onUpdateEstimate);
  yield takeEvery(DELETE_ESTIMATE, onDeleteEstimate);
}

export default estimatesSaga;
