import { call, put, takeEvery } from "redux-saga/effects"

// Crypto Redux States
import {
  GET_RELATIVES,
  GET_RELATIVE_DELETED_VALUE,
  ADD_NEW_RELATIVE,
  DELETE_RELATIVE,
  UPDATE_RELATIVE,
  IMPORT_RELATIVES
} from "./actionTypes"

import {
  getRelativesSuccess,
  getRelativesFail,
  getRelativeDeletedValueSuccess,
  getRelativeDeletedValueFail,
  addRelativeFail,
  addRelativeSuccess,
  updateRelativeSuccess,
  updateRelativeFail,
  deleteRelativeSuccess,
  deleteRelativeFail,
  importRelativesSuccess,
  importRelativesFail,
} from "./actions"

//Include Both Helper File with needed methods
import {
  getRelatives,
  getRelativeDeletedValue,
  addNewRelative,
  updateRelative,
  deleteRelative,
  importRelatives
} from "../../helpers/fakebackend_helper"

function* fetchRelatives() {
  const get_relatives_req = {
    source: 'db',
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_Relatives"
     } 

  try {
    const response = yield call(getRelatives, get_relatives_req)
    yield put(getRelativesSuccess(response))
  } catch (error) {
    yield put(getRelativesFail(error))
  }
}

function* fetchRelativeProfile() {
  try {
    const response = yield call(getRelativeDeletedValue)
    yield put(getRelativeDeletedValueSuccess(response))
  } catch (error) {
    yield put(getRelativeDeletedValueFail(error))
  }
}

function* onAddNewRelative({ payload, relative }) {
  delete payload["id"];
  payload["source"] = 'db';
  payload["procedure"] = 'SisApp_addData';
  payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
  payload["tablename"] = 'settings_Relatives';
  
  try {
    const response = yield call(addNewRelative, payload)
    console.log("add resp",response)

    yield put(addRelativeSuccess(response[0]))
  } catch (error) {

    yield put(addRelativeFail(error))
  }
}

function* onImportRelatives({ payload, relative }) {
  delete payload["id"];
  payload["source"] = 'db';
  payload["procedure"] = 'SisApp_importFile';
  payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
  payload["tablename"] = 'settings_Relatives';
  payload["field"] = "arTitle,enTitle";

  
  try {
    const response = yield call(importRelatives, payload)
    console.log("import resp",response)
    console.log("payload",payload)
    yield put(importRelativesSuccess(response))
  } catch (error) {

    yield put(importRelativesFail(error))
  }
}

function* onUpdateRelative({payload}) {
payload["source"] = 'db';
payload["procedure"] = 'SisApp_updateData';
payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
payload["tablename"] = 'settings_Relatives';
try {
    const response = yield call(updateRelative, payload)
    yield put(updateRelativeSuccess(response[0]))
  } catch (error) {
    yield put(updateRelativeFail(error))
  }
}

function* onDeleteRelative({ payload, relative }) {
  payload["source"] = 'db';
  payload["procedure"] = 'SisApp_removeData';
  payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
  payload["tablename"] = 'settings_Relatives';
  try {
    const responsedelete = yield call(deleteRelative, payload)
    yield put(deleteRelativeSuccess(responsedelete[0]))
  } catch (error) {
    yield put(deleteRelativeFail(error))
  }
}

function* relativesSaga() {
  yield takeEvery(GET_RELATIVES, fetchRelatives)
  yield takeEvery(GET_RELATIVE_DELETED_VALUE, fetchRelativeProfile)
  yield takeEvery(ADD_NEW_RELATIVE, onAddNewRelative)
  yield takeEvery(IMPORT_RELATIVES, onImportRelatives)
  yield takeEvery(UPDATE_RELATIVE, onUpdateRelative)
  yield takeEvery(DELETE_RELATIVE, onDeleteRelative)
}

export default relativesSaga
