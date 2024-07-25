import { call, put, takeEvery } from "redux-saga/effects"

// Crypto Redux States
import {
  GET_CERTIFICATE_TYPES,
  GET_CERTIFICATE_TYPE_DELETED_VALUE,
  ADD_NEW_CERTIFICATE_TYPE,
  DELETE_CERTIFICATE_TYPE,
  UPDATE_CERTIFICATE_TYPE
} from "./actionTypes"

import {
  getCertificateTypesSuccess,
  getCertificateTypesFail,
  getCertificateTypeDeletedValueSuccess,
  getCertificateTypeDeletedValueFail,
  addCertificateTypeFail,
  addCertificateTypeSuccess,
  updateCertificateTypeSuccess,
  updateCertificateTypeFail,
  deleteCertificateTypeSuccess,
  deleteCertificateTypeFail,
} from "./actions"

//Include Both Helper File with needed methods
import {
  getCertificateTypes,
  getCertificateTypeDeletedValue,
  addNewCertificateType,
  updateCertificateType,
  deleteCertificateType
} from "../../helpers/fakebackend_helper"

function* fetchCertificateTypes() {
  
  const get_certificateType_req = {
    source: 'db',
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_CertificateType"
     } 
  try {
    const response = yield call(getCertificateTypes, get_certificateType_req)
    yield put(getCertificateTypesSuccess(response))
  } catch (error) {
    yield put(getCertificateTypesFail(error))
  }
}

function* getCertificateTypeProfile() {
  try {
    const response = yield call(getCertificateTypeDeletedValue)
    yield put(getCertificateTypeDeletedValueSuccess(response))
  } catch (error) {
    yield put(getCertificateTypeDeletedValueFail(error))
  }
}

function* onAddNewCertificateType({ payload, certificateType }) {
  delete payload["id"];
  payload["source"] = 'db';
  payload["procedure"] = 'SisApp_addData';
  payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
  payload["tablename"] = 'Settings_CertificateType';
  
  try {
    const response = yield call(addNewCertificateType, payload)
    yield put(addCertificateTypeSuccess(response[0]))
  } catch (error) {

    yield put(addCertificateTypeFail(error))
  }
}

function* onUpdateCertificateType({ payload }) {
  payload["source"] = 'db';
  payload["procedure"] = 'SisApp_updateData';
  payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
  payload["tablename"] = 'Settings_CertificateType';
  
  try {
    const response = yield call(updateCertificateType, payload)
    yield put(updateCertificateTypeSuccess(response[0]))
  } catch (error) {
    yield put(updateCertificateTypeFail(error))
  }
}

function* onDeleteCertificateType({ payload, certificateType }) {
  payload["source"] = 'db';
  payload["procedure"] = 'SisApp_removeData';
  payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
  payload["tablename"] = 'Settings_CertificateType';
  
  try {
    const response = yield call(deleteCertificateType, payload)
    yield put(deleteCertificateTypeSuccess(response[0]))
  } catch (error) {
    yield put(deleteCertificateTypeFail(error))
  }
}

function* CertificateTypeSaga() {
  yield takeEvery(GET_CERTIFICATE_TYPES, fetchCertificateTypes)
  yield takeEvery(GET_CERTIFICATE_TYPE_DELETED_VALUE, getCertificateTypeProfile)
  yield takeEvery(ADD_NEW_CERTIFICATE_TYPE, onAddNewCertificateType)
  yield takeEvery(UPDATE_CERTIFICATE_TYPE, onUpdateCertificateType)
  yield takeEvery(DELETE_CERTIFICATE_TYPE, onDeleteCertificateType)
}

export default CertificateTypeSaga
