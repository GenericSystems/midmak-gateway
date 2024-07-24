import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_GENERATE_SIDS,
  GET_GENERATE_SID_PROFILE,
  ADD_NEW_GENERATE_SID,
  DELETE_GENERATE_SID,
  UPDATE_GENERATE_SID,
  GET_TEMPSTD,
} from "./actionTypes";

import {
  getGenerateSIDsSuccess,
  getGenerateSIDsFail,
  getGenerateSIDProfileSuccess,
  getGenerateSIDProfileFail,
  addGenerateSIDFail,
  addGenerateSIDSuccess,
  updateGenerateSIDSuccess,
  updateGenerateSIDFail,
  deleteGenerateSIDSuccess,
  deleteGenerateSIDFail,
  getTempStudentsFail,
  getTempStudentsSuccess,
} from "./actions";
import {
  getFacultiesSuccess,
  getFacultiesFail,
} from "../mob-app-faculty-accs/actions";

import { getYearsSuccess, getYearsFail } from "../years/actions";
import { getSemestersSuccess, getSemestersFail } from "../semesters/actions";

import {
  getAcademicCertificatesSuccess,
  getAcademicCertificatesFail,
} from "../academicvertificates/actions";
// Include Both Helper File with needed methods
import {
  getGenerateSIDs,
  getGenerateSIDProfile,
  addNewGenerateSID,
  updateGenerateSID,
  deleteGenerateSID,
  getFaculties,
  getYears,
  getSemesters,
  getTempStudents,
  getAcademicCertificates,
} from "../../helpers/fakebackend_helper";

function* fetchTempStd() {
  const get_temp_students = {
    source: "db",
    procedure: "getStatisticSAccFaculty",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  };
  try {
    const response = yield call(getTempStudents, get_temp_students);
    yield put(getTempStudentsSuccess(response));
  } catch (error) {
    yield put(getTempStudentsFail(error));
  }
}

function* fetchGenerateSIDs() {
  // get semesters
  const get_semesters_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_Semesters",
  };
  try {
    const response = yield call(getSemesters, get_semesters_req);
    yield put(getSemestersSuccess(response));
  } catch (error) {
    yield put(getSemestersFail(error));
  }
  //get years
  const get_years_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_Years",
  };
  try {
    const response = yield call(getYears, get_years_req);
    yield put(getYearsSuccess(response));
  } catch (error) {
    yield put(getYearsFail(error));
  }

  //get faculty
  const get_faculty_opt = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_Faculty",
  };
  try {
    const response = yield call(getFaculties, get_faculty_opt);
    yield put(getFacultiesSuccess(response));
  } catch (error) {
    yield put(getFacultiesFail(error));
  }

  //get academicceritifates
  const get_academic_certificates = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_AcadmicCertificates",
  };
  try {
    const response = yield call(
      getAcademicCertificates,
      get_academic_certificates
    );
    yield put(getAcademicCertificatesSuccess(response));
  } catch (error) {
    yield put(getAcademicCertificatesFail(error));
  }
  //get sid
  const get_generateSIDs_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_CriteriaGenerateSID",
  };
  try {
    const response = yield call(getGenerateSIDs, get_generateSIDs_req);
    yield put(getGenerateSIDsSuccess(response));
  } catch (error) {
    yield put(getGenerateSIDsFail(error));
  }
}

function* fetchGenerateSIDProfile() {
  try {
    const response = yield call(getGenerateSIDProfile);
    yield put(getGenerateSIDProfileSuccess(response));
  } catch (error) {
    yield put(getGenerateSIDProfileFail(error));
  }
}

function* onAddNewGenerateSID({ payload, generateSID }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_CriteriaGenerateSID";

  try {
    const response = yield call(addNewGenerateSID, payload);
    yield put(addGenerateSIDSuccess(response[0]));
  } catch (error) {
    yield put(addGenerateSIDFail(error));
  }
}

function* onUpdateGenerateSID({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_CriteriaGenerateSID";

  try {
    const respupdate = yield call(updateGenerateSID, payload);
    yield put(updateGenerateSIDSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateGenerateSIDFail(error));
  }
}

function* onDeleteGenerateSID({ payload, generateSID }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_CriteriaGenerateSID";

  try {
    const respdelete = yield call(deleteGenerateSID, payload);
    yield put(deleteGenerateSIDSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteGenerateSIDFail(error));
  }
}

function* generateSIDsSaga() {
  yield takeEvery(GET_TEMPSTD, fetchTempStd);
  yield takeEvery(GET_GENERATE_SIDS, fetchGenerateSIDs);
  yield takeEvery(GET_GENERATE_SID_PROFILE, fetchGenerateSIDProfile);
  yield takeEvery(ADD_NEW_GENERATE_SID, onAddNewGenerateSID);
  yield takeEvery(UPDATE_GENERATE_SID, onUpdateGenerateSID);
  yield takeEvery(DELETE_GENERATE_SID, onDeleteGenerateSID);
}

export default generateSIDsSaga;
