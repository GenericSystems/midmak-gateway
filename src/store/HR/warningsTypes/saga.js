import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_WARNINGS_TYPES,
  GET_WARNING_TYPE_DELETED_VALUE,
  ADD_NEW_WARNING_TYPE,
  DELETE_WARNING_TYPE,
  UPDATE_WARNING_TYPE,
} from "./actionTypes";

import {
  getWarningsTypesSuccess,
  getWarningsTypesFail,
  getWarningTypeDeletedValueSuccess,
  getWarningTypeDeletedValueFail,
  addWarningTypeFail,
  addWarningTypeSuccess,
  updateWarningTypeSuccess,
  updateWarningTypeFail,
  deleteWarningTypeSuccess,
  deleteWarningTypeFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getWarningsTypes,
  getWarningTypeDeletedValue,
  addNewWarningType,
  updateWarningType,
  deleteWarningType,
} from "../../../helpers/fakebackend_helper";

function* fetchWarningsTypes() {
  const get_WarningType_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_ContractType",
  };
  try {
    const response = yield call(getWarningsTypes, get_WarningType_req);
    console.log("fffffffffffffff", response);
    yield put(getWarningsTypesSuccess(response));
  } catch (error) {
    yield put(getWarningsTypesFail(error));
  }
}

function* getWarningTypeProfile() {
  try {
    const response = yield call(getWarningTypeDeletedValue);
    yield put(getWarningTypeDeletedValueSuccess(response));
  } catch (error) {
    yield put(getWarningTypeDeletedValueFail(error));
  }
}

function* onAddNewWarningType({ payload }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_ContractType";

  try {
    const response = yield call(addNewWarningType, payload);
    yield put(addWarningTypeSuccess(response[0]));
  } catch (error) {
    yield put(addWarningTypeFail(error));
  }
}

function* onUpdateWarningType({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_ContractType";

  try {
    const response = yield call(updateWarningType, payload);
    yield put(updateWarningTypeSuccess(response[0]));
  } catch (error) {
    yield put(updateWarningTypeFail(error));
  }
}

function* onDeleteWarningType({ payload, warningType }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_ContractType";

  try {
    const response = yield call(deleteWarningType, payload);
    yield put(deleteWarningTypeSuccess(response[0]));
  } catch (error) {
    yield put(deleteWarningTypeFail(error));
  }
}

function* WarningsTypesSaga() {
  yield takeEvery(GET_WARNINGS_TYPES, fetchWarningsTypes);
  yield takeEvery(GET_WARNING_TYPE_DELETED_VALUE, getWarningTypeProfile);
  yield takeEvery(ADD_NEW_WARNING_TYPE, onAddNewWarningType);
  yield takeEvery(UPDATE_WARNING_TYPE, onUpdateWarningType);
  yield takeEvery(DELETE_WARNING_TYPE, onDeleteWarningType);
}

export default WarningsTypesSaga;
