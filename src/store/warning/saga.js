import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_WARNINGS,
  ADD_NEW_WARNING,
  DELETE_WARNING,
  UPDATE_WARNING,
  GET_WARNING_DELETED_VALUE,
} from "./actionTypes";

import {
  getWarningsSuccess,
  getWarningsFail,
  addWarningSuccess,
  addWarningFail,
  updateWarningSuccess,
  updateWarningFail,
  deleteWarningSuccess,
  deleteWarningFail,
  getWarningDeletedValueSuccess,
  getWarningDeletedValueFail,
} from "./actions";

// Include Both Helper File with needed methods
import {
  getWarnings,
  addNewWarning,
  updateWarning,
  deleteWarning,
  getWarningDeletedValue,
} from "../../helpers/fakebackend_helper";

function* fetchWarnings() {
  const get_warnings_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_Warnings",
  };
  try {
    const response = yield call(getWarnings, get_warnings_req);
    yield put(getWarningsSuccess(response));
  } catch (error) {
    yield put(getWarningsFail(error));
  }
}


function* onAddNewWarning({ payload, warning }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_Warnings";

  try {
    const response = yield call(addNewWarning, payload);
    yield put(addWarningSuccess(response[0]));
  } catch (error) {
    yield put(addWarningFail(error));
  }
}

function* onUpdateWarning({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_Warnings";

  try {
    const respupdate = yield call(updateWarning, payload);
    yield put(updateWarningSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateWarningFail(error));
  }
}

function* onDeleteWarning({ payload, warning }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_Warnings";

  try {
    const respdelete = yield call(deleteWarning, payload);
    yield put(deleteWarningSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteWarningFail(error));
  }
}

function* onGetWarningDeletedValue() {
  try {
    const response = yield call(getWarningDeletedValue)
    yield put(getWarningDeletedValueSuccess(response))
  } catch (error) {
    yield put(getWarningDeletedValueFail(error))
  }
  
}

function* warningsSaga() {
  yield takeEvery(GET_WARNINGS, fetchWarnings);
  yield takeEvery(ADD_NEW_WARNING, onAddNewWarning);
  yield takeEvery(DELETE_WARNING, onDeleteWarning);
  yield takeEvery(UPDATE_WARNING, onUpdateWarning);
  yield takeEvery(GET_WARNING_DELETED_VALUE, onGetWarningDeletedValue);
}

export default warningsSaga;
