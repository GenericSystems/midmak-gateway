import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_CERTIFICATES,
  ADD_NEW_CERTIFICATE,
  DELETE_CERTIFICATE,
  UPDATE_CERTIFICATE,
  GET_CERTIFICATE_DELETED_VALUE,
  GET_FILTERED_COURSES_CERTIFICATES,
} from "./actionTypes";

import { GET_USER_TYPES_OPT } from "../user-types/actionTypes";

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
  getFilteredCoursesCertificatesSuccess,
  getFilteredCoursesCertificatesFail,
} from "./actions";

import {
  getUserTypesOptFail,
  getUserTypesOptSuccess,
} from "../user-types/actions";

import { getSectorsFail, getSectorsSuccess } from "../sectors/actions";

import {
  getFilteredCertificateGradesFail,
  getFilteredCertificateGradesSuccess,
} from "../certificateGrades/actions";

import {
  getCertificateTypesFail,
  getCertificateTypesSuccess,
} from "../certificateTypes/actions";

import {
  getFilteredMembersFail,
  getFilteredMembersSuccess,
} from "../trainingMembers/actions";

import { getYearsFail, getYearsSuccess } from "../years/actions";

import {
  getCertificates,
  addNewCertificate,
  updateCertificate,
  deleteCertificate,
  getUserTypesOpt,
  getSectors,
  getFilteredGrades,
  getCertificateTypes,
  getCertificateDeletedValue,
  getYears,
  getFilteredCoursesCertificates,
  getFilteredMembers,
} from "../../helpers/fakebackend_helper";

function* fetchUsers() {
  //user types
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

  //certificate Type
  const get_certificateType_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_CertificateType",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getCertificateTypes, get_certificateType_req);
    yield put(getCertificateTypesSuccess(response));
  } catch (error) {
    yield put(getCertificateTypesFail(error));
  }

  //years
  const get_years_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Years",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getYears, get_years_req);
    yield put(getYearsSuccess(response));
  } catch (error) {
    yield put(getYearsFail(error));
  }
}

function* fetchCertificates(obj) {
  console.log("in saga obj", obj);
  const userTypeId = obj.payload.userTypeId;

  const get_Certificates_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_Certificates",
    filter: `userTypeId = ${userTypeId}`,
  };
  try {
    const response = yield call(getCertificates, get_Certificates_req);
    /* response.map(resp => {
      resp["sector"] = JSON.parse(resp["sector"]);
    }); */
    yield put(getCertificatesSuccess(response));
  } catch (error) {
    yield put(getCertificatesFail(error));
  }

  let membersTableName = "";
  let membersFields = "";
  if (userTypeId === 1) {
    membersTableName = "Common_TrainingMembers";
    membersFields = "Id,name";
  } else if (userTypeId === 2) {
    membersTableName = "_Common_Trainee";
    membersFields = "Id,fullName";
  }

  const get_trainer_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: membersTableName,
    fields: membersFields,
    // filter: `userTypeId = ${userTypeId}`,
  };
  try {
    const response = yield call(getFilteredMembers, get_trainer_req);

    yield put(getFilteredMembersSuccess(response));
  } catch (error) {
    yield put(getFilteredMembersFail(error));
  }

  // trainer grade
  const get_TrainerGrades_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Grades",
    fields: "Id,arTitle",
    filter: `userTypeId = ${userTypeId}`,
  };
  try {
    const response = yield call(getFilteredGrades, get_TrainerGrades_req);

    yield put(getFilteredCertificateGradesSuccess(response));
  } catch (error) {
    yield put(getFilteredCertificateGradesFail(error));
  }
}

function* fetchFilteredCourses(obj) {
  console.log("111111111111111111", obj.payload);
  const traineeId = obj.payload;
  const get_filteredCourses_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Current_Common_TrianeeCurriculalines",
    filter: `traineeId = ${traineeId} and archived = 1 and totalGrade >= 49`,
  };
  try {
    const response = yield call(
      getFilteredCoursesCertificates,
      get_filteredCourses_req
    );
    yield put(getFilteredCoursesCertificatesSuccess(response));
  } catch (error) {
    yield put(getFilteredCoursesCertificatesFail(error));
  }
}

function* onAddNewCertificate({ payload }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_Certificates";
  payload["queryname"] = "_Common_Certificates";

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
  payload["queryname"] = "_Common_Certificates";

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
  yield takeEvery(GET_USER_TYPES_OPT, fetchUsers);
  yield takeEvery(GET_CERTIFICATES, fetchCertificates);
  yield takeEvery(GET_FILTERED_COURSES_CERTIFICATES, fetchFilteredCourses);
  yield takeEvery(ADD_NEW_CERTIFICATE, onAddNewCertificate);
  yield takeEvery(UPDATE_CERTIFICATE, onUpdateCertificate);
  yield takeEvery(DELETE_CERTIFICATE, onDeleteCertificate);
  yield takeEvery(GET_CERTIFICATE_DELETED_VALUE, onGetCountryDeletedValue);
}

export default CertificatesSaga;
