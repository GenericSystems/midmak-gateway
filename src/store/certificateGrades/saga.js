import { call, put, takeEvery } from "redux-saga/effects";

import {
  GET_CERTIFICATE_GRADES,
  ADD_NEW_CERTIFICATE_GRADE,
  DELETE_CERTIFICATE_GRADE,
  UPDATE_CERTIFICATE_GRADE,
  GET_CERTIFICATE_GRADE_DELETED_VALUE,
} from "./actionTypes";

import { GET_USER_TYPES_OPT } from "../user-types/actionTypes";

import {
  getCertificateGradesSuccess,
  getCertificateGradesFail,
  addCertificateGradeFail,
  addCertificateGradeSuccess,
  updateCertificateGradeSuccess,
  updateCertificateGradeFail,
  deleteCertificateGradeSuccess,
  deleteCertificateGradeFail,
  getCertificateGradeDeletedValueSuccess,
  getCertificateGradeDeletedValueFail,
} from "./actions";

import {
  getUserTypesOptFail,
  getUserTypesOptSuccess,
} from "../user-types/actions";

import {
  getCertificateGrades,
  addNewCertificateGrade,
  updateCertificateGrade,
  deleteCertificateGrade,
  getCertificateGradeDeletedValue,
  getUserTypesOpt,
} from "../../helpers/fakebackend_helper";

// Fetch user types
function* fetchUsers() {
  const get_userTypes_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_UserType",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getUserTypesOpt, get_userTypes_req);
    yield put(getUserTypesOptSuccess(response));
  } catch (error) {
    yield put(getUserTypesOptFail(error));
  }
}

// Fetch certificate grades
function* fetchCertificateGrades({ payload }) {
  const userTypeId = payload.userTypeId;

  const get_CertificateGrades_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Grades",
    filter: `userTypeId = ${userTypeId}`,
  };

  try {
    const response = yield call(
      getCertificateGrades,
      get_CertificateGrades_req
    );
    yield put(getCertificateGradesSuccess(response));
  } catch (error) {
    yield put(getCertificateGradesFail(error));
  }
}

// Add new certificate grade
function* onAddNewCertificateGrade({ payload }) {
  delete payload.id;

  const request = {
    ...payload,
    source: "db",
    procedure: "SisApp_addData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Grades",
  };

  try {
    const response = yield call(addNewCertificateGrade, request);
    yield put(addCertificateGradeSuccess(response[0]));
  } catch (error) {
    yield put(addCertificateGradeFail(error));
  }
}

function* onUpdateCertificateGrade({ payload }) {
  const request = {
    ...payload,
    source: "db",
    procedure: "SisApp_updateData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Grades",
  };

  try {
    const response = yield call(updateCertificateGrade, request);
    yield put(updateCertificateGradeSuccess(response[0]));
  } catch (error) {
    yield put(updateCertificateGradeFail(error));
  }
}

function* onDeleteCertificateGrade({ payload }) {
  const request = {
    ...payload,
    source: "db",
    procedure: "SisApp_removeData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Grades",
  };

  try {
    const response = yield call(deleteCertificateGrade, request);
    yield put(deleteCertificateGradeSuccess(response[0]));
  } catch (error) {
    yield put(deleteCertificateGradeFail(error));
  }
}

function* onGetCertificateGradeDeletedValue() {
  try {
    const response = yield call(getCertificateGradeDeletedValue);
    yield put(getCertificateGradeDeletedValueSuccess(response));
  } catch (error) {
    yield put(getCertificateGradeDeletedValueFail(error));
  }
}

function* certificateGradesSaga() {
  yield takeEvery(GET_USER_TYPES_OPT, fetchUsers);
  yield takeEvery(GET_CERTIFICATE_GRADES, fetchCertificateGrades);
  yield takeEvery(ADD_NEW_CERTIFICATE_GRADE, onAddNewCertificateGrade);
  yield takeEvery(UPDATE_CERTIFICATE_GRADE, onUpdateCertificateGrade);
  yield takeEvery(DELETE_CERTIFICATE_GRADE, onDeleteCertificateGrade);
  yield takeEvery(
    GET_CERTIFICATE_GRADE_DELETED_VALUE,
    onGetCertificateGradeDeletedValue
  );
}

export default certificateGradesSaga;
