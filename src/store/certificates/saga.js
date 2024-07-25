import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_CERTIFICATES,
  ADD_NEW_CERTIFICATE,
  DELETE_CERTIFICATE,
  UPDATE_CERTIFICATE,
  GET_CERTIFICATE_DELETED_VALUE,
} from "./actionTypes";

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
} from "./actions";

import { getUserTypesFail, getUserTypesSuccess } from "../user-types/actions";

import { getSectorsFail, getSectorsSuccess } from "../sectors/actions";

import {
  getTrainersGradesFail,
  getTrainersGradesSuccess,
} from "../trainersGrades/actions";


import {
  getCertificateTypesFail,
  getCertificateTypesSuccess,
} from "../certificateTypes/actions";

import {
  getCertificates,
  addNewCertificate,
  updateCertificate,
  deleteCertificate,
  getUserTypes,
  getSectors,
  getTrainersGrades,
  getCertificateTypes,
  getCertificateDeletedValue,
} from "../../helpers/fakebackend_helper";

function* fetchCertificates() {
  const get_Certificates_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_Certificates",
  };
  try {
    const response = yield call(getCertificates, get_Certificates_req);

    yield put(getCertificatesSuccess(response));
  } catch (error) {
    yield put(getCertificatesFail(error));
  }

  //user types
  const get_userTypes_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_UserType",
    fields: "Id,arTitle",
  };

  try {
    const response = yield call(getUserTypes, get_userTypes_req);
    yield put(getUserTypesSuccess(response));
  } catch (error) {
    yield put(getUserTypesFail(error));
  }

  //Sectors
  const get_sectors_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Sector",
    fields: "Id,arTitle",
  };

  try {
    const response = yield call(getSectors, get_sectors_req);
    yield put(getSectorsSuccess(response));
  } catch (error) {
    yield put(getSectorsFail(error));
  }

  // trainer grade
  const get_TrainerGrades_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_TrainerGrade",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getTrainersGrades, get_TrainerGrades_req);

    yield put(getTrainersGradesSuccess(response));
  } catch (error) {
    yield put(getTrainersGradesFail(error));
  }

  //certificate Type
  const get_certificateType_req = {
    source: 'db',
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_CertificateType",
    fields: "Id,arTitle",
     } 
  try {
    const response = yield call(getCertificateTypes, get_certificateType_req)
    yield put(getCertificateTypesSuccess(response))
  } catch (error) {
    yield put(getCertificateTypesFail(error))
  }
}

function* onAddNewCertificate({ payload }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_Certificates";
  try {
    const response = yield call(addNewCertificate, payload);
    yield put(addCertificateSuccess(response[0]));
  } catch (error) {
    yield put(addCertificateFail(error));
  }
}

function* onUpdateCertificate({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_Certificates";
  try {
    const respupdate = yield call(updateCertificate, payload);
    yield put(updateCertificateSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateCertificateFail(error));
  }
}

function* onDeleteCertificate({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_Certificates";
  try {
    const respdelete = yield call(deleteCertificate, payload);
    yield put(deleteCertificateSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteCertificateFail(error));
  }
}

function* onGetCountryDeletedValue() {
  try {
    const response = yield call(getCertificateDeletedValue);
    yield put(getCertificateDeletedValueSuccess(response));
  } catch (error) {
    yield put(getCertificateDeletedValueFail(error));
  }
}

function* CertificatesSaga() {
  yield takeEvery(GET_CERTIFICATES, fetchCertificates);
  yield takeEvery(ADD_NEW_CERTIFICATE, onAddNewCertificate);
  yield takeEvery(UPDATE_CERTIFICATE, onUpdateCertificate);
  yield takeEvery(DELETE_CERTIFICATE, onDeleteCertificate);
  yield takeEvery(GET_CERTIFICATE_DELETED_VALUE, onGetCountryDeletedValue);
}

export default CertificatesSaga;
