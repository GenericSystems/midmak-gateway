import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_GOVERNORATES,
  GET_GOVERNORATE_DELETED_VALUE,
  ADD_NEW_GOVERNORATE,
  DELETE_GOVERNORATE,
  UPDATE_GOVERNORATE,
  IMPORT_GOVERNORATES

} from "./actionTypes";

import {
  getGovernoratesSuccess,
  getGovernoratesFail,
  getGovernorateDeletedValueSuccess,
  getGovernorateDeletedValueFail,
  addGovernorateFail,
  addGovernorateSuccess,
  updateGovernorateSuccess,
  updateGovernorateFail,
  deleteGovernorateSuccess,
  deleteGovernorateFail,
  importGovernoratesSuccess,
  importGovernoratesFail,
} from "./actions";

// Include Both Helper File with needed methods
import {
  getGovernorates,
  getGovernorateDeletedValue,
  addNewGovernorate,
  updateGovernorate,
  deleteGovernorate,
  importGovernorates

} from "../../helpers/fakebackend_helper";

function* fetchGovernorates() {
  const get_governorates_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_governorate",
  };
  try {
    const response = yield call(getGovernorates, get_governorates_req);
    yield put(getGovernoratesSuccess(response));
  } catch (error) {
    yield put(getGovernoratesFail(error));
  }
}

function* getGovernorateDeletedvalue() {
  try {
    const response = yield call(getGovernorateDeletedValue);
    yield put(getGovernorateDeletedValueSuccess(response));
  } catch (error) {
    yield put(getGovernorateDeletedValueFail(error));
  }
}

function* onAddNewGovernorate({ payload, governorate }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_governorate";

  try {
    const response = yield call(addNewGovernorate, payload);
    yield put(addGovernorateSuccess(response[0]));
  } catch (error) {
    yield put(addGovernorateFail(error));
  }
}

function* onImportGovernorates({ payload, nationality }) {
  delete payload["id"];
  payload["source"] = 'db';
  payload["procedure"] = 'SisApp_importFile';
  payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
  payload["tablename"] = 'settings_governorate';
  payload["field"] = "arTitle,enTitle";

  
  try {
    const response = yield call(importGovernorates, payload)
    console.log("in saga import resp",response)
    console.log("in saga payload",payload)
    yield put(importGovernoratesSuccess(response))
  } catch (error) {

    yield put(importGovernoratesFail(error))
  }
}


function* onUpdateGovernorate({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_governorate";

  try {
    const response = yield call(updateGovernorate, payload);
    yield put(updateGovernorateSuccess(response[0]));
  } catch (error) {
    yield put(updateGovernorateFail(error));
  }
}

function* onDeleteGovernorate({ payload, governorate }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_governorate";

  try {
    const response = yield call(deleteGovernorate, payload);
    yield put(deleteGovernorateSuccess(response[0]));
  } catch (error) {
    yield put(deleteGovernorateFail(error));
  }
}

function* governoratesSaga() {
  yield takeEvery(GET_GOVERNORATES, fetchGovernorates);
  yield takeEvery(GET_GOVERNORATE_DELETED_VALUE, getGovernorateDeletedvalue);
  yield takeEvery(ADD_NEW_GOVERNORATE, onAddNewGovernorate);
  yield takeEvery(IMPORT_GOVERNORATES, onImportGovernorates)
  yield takeEvery(UPDATE_GOVERNORATE, onUpdateGovernorate);
  yield takeEvery(DELETE_GOVERNORATE, onDeleteGovernorate);
}

export default governoratesSaga;
