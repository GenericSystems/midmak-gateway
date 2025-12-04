import { call, put, takeEvery } from "redux-saga/effects"

// Crypto Redux States
import {
  GET_NATIONALITIES,
  GET_NATIONALITY_DELETED_VALUE,
  ADD_NEW_NATIONALITY,
  DELETE_NATIONALITY,
  UPDATE_NATIONALITY,
  IMPORT_NATIONALITIES
} from "./actionTypes"

import {
  getNationalitiesSuccess,
  getNationalitiesFail,
  getNationalityDeletedValueSuccess,
  getNationalityDeletedValueFail,
  addNationalityFail,
  addNationalitySuccess,
  updateNationalitySuccess,
  updateNationalityFail,
  deleteNationalitySuccess,
  deleteNationalityFail,
  importNationalitiesSuccess,
  importNationalitiesFail,
} from "./actions"

//Include Both Helper File with needed methods
import {
  getNationalities,
  getNationalityDeletedValue,
  addNewNationality,
  updateNationality,
  deleteNationality,
  importNationalities
} from "../../helpers/fakebackend_helper"

function* fetchNationalities() {
  const get_nationalities_req = {
    source: 'db',
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Nationality"
     } 

  try {
    const response = yield call(getNationalities, get_nationalities_req)
    yield put(getNationalitiesSuccess(response))
  } catch (error) {
    yield put(getNationalitiesFail(error))
  }
}

function* fetchNationalityProfile() {
  try {
    const response = yield call(getNationalityDeletedValue)
    yield put(getNationalityDeletedValueSuccess(response))
  } catch (error) {
    yield put(getNationalityDeletedValueFail(error))
  }
}

function* onAddNewNationality({ payload, nationality }) {
  delete payload["id"];
  payload["source"] = 'db';
  payload["procedure"] = 'SisApp_addData';
  payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
  payload["tablename"] = 'Settings_Nationality';
  
  try {
    const response = yield call(addNewNationality, payload)
    console.log("add resp",response)

    yield put(addNationalitySuccess(response[0]))
  } catch (error) {

    yield put(addNationalityFail(error))
  }
}

function* onImportNationalities({ payload, nationality }) {
  delete payload["id"];
  payload["source"] = 'db';
  payload["procedure"] = 'SisApp_importFile';
  payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
  payload["tablename"] = 'Settings_Nationality';
  payload["field"] = "arTitle,enTitle";

  
  try {
    const response = yield call(importNationalities, payload)
    console.log("import resp",response)
    console.log("payload",payload)
    yield put(importNationalitiesSuccess(response))
  } catch (error) {

    yield put(importNationalitiesFail(error))
  }
}

function* onUpdateNationality({payload}) {
payload["source"] = 'db';
payload["procedure"] = 'SisApp_updateData';
payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
payload["tablename"] = 'Settings_Nationality';
try {
    const response = yield call(updateNationality, payload)
    yield put(updateNationalitySuccess(response[0]))
  } catch (error) {
    yield put(updateNationalityFail(error))
  }
}

function* onDeleteNationality({ payload, nationality }) {
  payload["source"] = 'db';
  payload["procedure"] = 'SisApp_removeData';
  payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
  payload["tablename"] = 'Settings_Nationality';
  try {
    const responsedelete = yield call(deleteNationality, payload)
    yield put(deleteNationalitySuccess(responsedelete[0]))
  } catch (error) {
    yield put(deleteNationalityFail(error))
  }
}

function* nationalitiesSaga() {
  yield takeEvery(GET_NATIONALITIES, fetchNationalities)
  yield takeEvery(GET_NATIONALITY_DELETED_VALUE, fetchNationalityProfile)
  yield takeEvery(ADD_NEW_NATIONALITY, onAddNewNationality)
  yield takeEvery(IMPORT_NATIONALITIES, onImportNationalities)
  yield takeEvery(UPDATE_NATIONALITY, onUpdateNationality)
  yield takeEvery(DELETE_NATIONALITY, onDeleteNationality)
}

export default nationalitiesSaga
