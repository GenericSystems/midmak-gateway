import { call, put, takeEvery } from "redux-saga/effects";

// Redux Action Types
import {
  GET_ABSENCE_WARNINGS,
  GET_ABSENCE_WARNING_DELETED_VALUE,
  ADD_NEW_ABSENCE_WARNING,
  DELETE_ABSENCE_WARNING,
  UPDATE_ABSENCE_WARNING,
} from "./actionTypes";

import {
  getAbsenceWarningsSuccess,
  getAbsenceWarningsFail,
  getAbsenceWarningDeletedValueSuccess,
  getAbsenceWarningDeletedValueFail,
  addAbsenceWarningSuccess,
  addAbsenceWarningFail,
  updateAbsenceWarningSuccess,
  updateAbsenceWarningFail,
  deleteAbsenceWarningSuccess,
  deleteAbsenceWarningFail,
} from "./actions";

// Helper API methods
import {
  getAbsenceWarnings,
  getAbsenceWarningDeletedValue,
  addNewAbsenceWarning,
  updateAbsenceWarning,
  deleteAbsenceWarning,
} from "../../../helpers/fakebackend_helper";

function* fetchAbsenceWarnings() {
  const requestPayload = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_AbsenceWarnings",
  };
  try {
    const response = yield call(getAbsenceWarnings, requestPayload);
    yield put(getAbsenceWarningsSuccess(response));
  } catch (error) {
    yield put(getAbsenceWarningsFail(error));
  }
}

function* getAbsenceWarningProfile() {
  try {
    const response = yield call(getAbsenceWarningDeletedValue);
    yield put(getAbsenceWarningDeletedValueSuccess(response));
  } catch (error) {
    yield put(getAbsenceWarningDeletedValueFail(error));
  }
}

function* onAddNewAbsenceWarning({ payload }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_AbsenceWarnings";

  try {
    const response = yield call(addNewAbsenceWarning, payload);
    yield put(addAbsenceWarningSuccess(response[0]));
  } catch (error) {
    yield put(addAbsenceWarningFail(error));
  }
}

function* onUpdateAbsenceWarning({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_AbsenceWarnings";

  try {
    const response = yield call(updateAbsenceWarning, payload);
    yield put(updateAbsenceWarningSuccess(response[0]));
  } catch (error) {
    yield put(updateAbsenceWarningFail(error));
  }
}

function* onDeleteAbsenceWarning({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_AbsenceWarnings";

  try {
    const response = yield call(deleteAbsenceWarning, payload);
    yield put(deleteAbsenceWarningSuccess(response[0]));
  } catch (error) {
    yield put(deleteAbsenceWarningFail(error));
  }
}

function* AbsenceWarningsSaga() {
  yield takeEvery(GET_ABSENCE_WARNINGS, fetchAbsenceWarnings);
  yield takeEvery(GET_ABSENCE_WARNING_DELETED_VALUE, getAbsenceWarningProfile);
  yield takeEvery(ADD_NEW_ABSENCE_WARNING, onAddNewAbsenceWarning);
  yield takeEvery(UPDATE_ABSENCE_WARNING, onUpdateAbsenceWarning);
  yield takeEvery(DELETE_ABSENCE_WARNING, onDeleteAbsenceWarning);
}

export default AbsenceWarningsSaga;
