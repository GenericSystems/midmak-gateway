import { call, put, takeEvery } from "redux-saga/effects"

// Crypto Redux States
import {
  GET_CERTIFICATELEVELS,
  GET_CERTIFICATELEVEL_DELETED_VALUE,
  ADD_NEW_CERTIFICATELEVEL,
  DELETE_CERTIFICATELEVEL,
  UPDATE_CERTIFICATELEVEL
} from "./actionTypes"

import {
  getCertificateLevelsSuccess,
  getCertificateLevelsFail,
  getCertificateLevelDeletedValueSuccess,
  getCertificateLevelDeletedValueFail,
  addCertificateLevelFail,
  addCertificateLevelSuccess,
  updateCertificateLevelSuccess,
  updateCertificateLevelFail,
  deleteCertificateLevelSuccess,
  deleteCertificateLevelFail,
} from "./actions"

//Include Both Helper File with needed methods
import {
  getCertificateLevels,
  getCertificateLevelDeletedValue,
  addNewCertificateLevel,
  updateCertificateLevel,
  deleteCertificateLevel
} from "../../helpers/fakebackend_helper"

function* fetchCertificateLevels() {
  
  const get_certificateLevel_req = {
    source: 'db',
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_certificateLevel"
     } 
  try {
    const response = yield call(getCertificateLevels, get_certificateLevel_req)
    yield put(getCertificateLevelsSuccess(response))
  } catch (error) {
    yield put(getCertificateLevelsFail(error))
  }
}

function* getCertificateLevelProfile() {
  try {
    const response = yield call(getCertificateLevelDeletedValue)
    yield put(getCertificateLevelDeletedValueSuccess(response))
  } catch (error) {
    yield put(getCertificateLevelDeletedValueFail(error))
  }
}

function* onAddNewCertificateLevel({ payload, certificateLevel }) {
  delete payload["id"];
  payload["source"] = 'db';
  payload["procedure"] = 'SisApp_addData';
  payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
  payload["tablename"] = 'settings_certificateLevel';
  
  try {
    const response = yield call(addNewCertificateLevel, payload)
    yield put(addCertificateLevelSuccess(response[0]))
  } catch (error) {

    yield put(addCertificateLevelFail(error))
  }
}

function* onUpdateCertificateLevel({ payload }) {
  payload["source"] = 'db';
  payload["procedure"] = 'SisApp_updateData';
  payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
  payload["tablename"] = 'settings_certificateLevel';
  
  try {
    const response = yield call(updateCertificateLevel, payload)
    yield put(updateCertificateLevelSuccess(response[0]))
  } catch (error) {
    yield put(updateCertificateLevelFail(error))
  }
}

function* onDeleteCertificateLevel({ payload, certificateLevel }) {
  payload["source"] = 'db';
  payload["procedure"] = 'SisApp_removeData';
  payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
  payload["tablename"] = 'settings_certificateLevel';
  
  try {
    const response = yield call(deleteCertificateLevel, payload)
    yield put(deleteCertificateLevelSuccess(response[0]))
  } catch (error) {
    yield put(deleteCertificateLevelFail(error))
  }
}

function* CertificateLevelSaga() {
  yield takeEvery(GET_CERTIFICATELEVELS, fetchCertificateLevels)
  yield takeEvery(GET_CERTIFICATELEVEL_DELETED_VALUE, getCertificateLevelProfile)
  yield takeEvery(ADD_NEW_CERTIFICATELEVEL, onAddNewCertificateLevel)
  yield takeEvery(UPDATE_CERTIFICATELEVEL, onUpdateCertificateLevel)
  yield takeEvery(DELETE_CERTIFICATELEVEL, onDeleteCertificateLevel)
}

export default CertificateLevelSaga
