import { call, put, takeEvery } from "redux-saga/effects"

// Crypto Redux States
import {
GET_CERTIFICATES,
ADD_NEW_CERTIFICATE,
DELETE_CERTIFICATE,
UPDATE_CERTIFICATE,
GET_CERTIFICATE_DELETED_VALUE,
} from "./actionTypes"

import {
getCertificatesSuccess,
getCertificatesFail,
addCertificateFail,
addCertificateSuccess,
updateCertificateSuccess,
updateCertificateFail,
deleteCertificateSuccess,
deleteCertificateFail,
getCertificateDeletedValueSuccess,
getCertificateDeletedValueFail,
} from "./actions"

import {
    getCertificateLevelsFail,
    getCertificateLevelsSuccess,
  } from "../certificatelevels/actions";
// Include Both Helper File with needed methods
import {
getCertificates,
addNewCertificate,
updateCertificate,
deleteCertificate,
getCertificateLevels,
getCertificateDeletedValue,
} from "../../helpers/fakebackend_helper"

function* fetchCertificates() {

  const get_Certificates_req = {
    source: 'db',
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_CertificateType"
    } ;  
  try {
  const response = yield call(getCertificates, get_Certificates_req)

  yield put(getCertificatesSuccess(response))
  } catch (error) {
  yield put(getCertificatesFail(error))
  }
 
}

function* onAddNewCertificate({ payload, }) {
delete payload["id"];
payload["source"] = 'db';
payload["procedure"] = 'SisApp_addData';
payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
payload["tablename"] = 'Settings_CertificateType';
try {
        const response = yield call(addNewCertificate, payload)
        yield put(addCertificateSuccess(response[0]))
    } catch (error) {
        yield put(addCertificateFail(error))
    }
}

function* onUpdateCertificate({ payload }) {
    payload["source"] = 'db';
    payload["procedure"] = 'SisApp_updateData';
    payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
    payload["tablename"] = 'Settings_CertificateType';
    try {
        const respupdate = yield call(updateCertificate, payload)
        yield put(updateCertificateSuccess(respupdate[0]))
    } catch (error) {
        yield put(updateCertificateFail(error))
    }
}

function* onDeleteCertificate({ payload}) {
    payload["source"] = 'db';
    payload["procedure"] = 'SisApp_removeData';
    payload["apikey"] = '30294470-b4dd-11ea-8c20-b036fd52a43e';
    payload["tablename"] = 'Settings_CertificateType';
    try {
        const respdelete = yield call(deleteCertificate, payload)
        yield put(deleteCertificateSuccess(respdelete[0]))
    } catch (error) {
        yield put(deleteCertificateFail(error))
    }
}

function* onGetCountryDeletedValue() {
  try {
    const response = yield call(getCertificateDeletedValue)
    yield put(getCertificateDeletedValueSuccess(response))
  } catch (error) {
    yield put(getCertificateDeletedValueFail(error))
  }
  
}

function* CertificatesSaga() {
yield takeEvery(GET_CERTIFICATES, fetchCertificates)
yield takeEvery(ADD_NEW_CERTIFICATE, onAddNewCertificate)
yield takeEvery(UPDATE_CERTIFICATE, onUpdateCertificate)
yield takeEvery(DELETE_CERTIFICATE, onDeleteCertificate)
yield takeEvery(GET_CERTIFICATE_DELETED_VALUE, onGetCountryDeletedValue);
}

export default CertificatesSaga