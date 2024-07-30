import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_ACADEMICCERTIFICATES,
  ADD_NEW_ACADEMICCERTIFICATES,
  DELETE_ACADEMICCERTIFICATES,
  UPDATE_ACADEMICCERTIFICATE,
  GET_ACADEMICCERTIFICATE_DELETED_VALUE
} from "./actionTypes";

import {
  getAcademicCertificatesSuccess,
  getAcademicCertificatesFail,
  addAcademicCertificateFail,
  addAcademicCertificateSuccess,
  updateAcademicCertificateSuccess,
  updateAcademicCertificateFail,
  deleteAcademicCertificateSuccess,
  deleteAcademicCertificateFail,
  getAcademicCertificateDeletedValueSuccess,
  getAcademicCertificateDeletedValueFail,
  
} from "./actions";
import { GET_FILTERED_DEPARTMENTS } from "../departments/actionTypes";

import {
  getFilteredDepartmentsSuccess,
  getFilteredDepartmentsFail,
  getDepartmentsSuccess,
  getDepartmentsFail,
} from "../departments/actions";

import {
  getYearSemestersSuccess,
  getYearSemestersFail,
} from "../general-management/actions";
import {
  getFacultiesSuccess,
  getFacultiesFail,
} from "../mob-app-faculty-accs/actions";

import {
  getGradesSuccess,
  getGradesFail,
} from "../grades/actions";

// Include Both Helper File with needed methods
import {
  getAcademicCertificates,
  addNewAcademicCertificate,
  updateAcademicCertificate,
  deleteAcademicCertificate,
  getFaculties,
  getYearSemesters,
  getGrades,
  getDepartments,
  getAcademicCertificateDeletedValue,
  getFilteredDepartments
} from "../../helpers/fakebackend_helper";


function* fetchFilteredDepartments(obj) {
  let faculty = obj.payload;
  const get_department_opt = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_Department",
    fields: "Id,arTitle,facultyId",
    filter: `facultyId = ${faculty}`,
  };
  try {
    const response = yield call(getFilteredDepartments, get_department_opt);
    yield put(getFilteredDepartmentsSuccess(response));
  } catch (error) {
    yield put(getFilteredDepartmentsFail(error));
  }
}
function* fetchAcademicCertificates() {
  //get department
  const get_department_opt = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_Department",
    fields: "Id,arTitle,facultyId",
  };
  try {
    const response = yield call(getDepartments, get_department_opt);
    yield put(getDepartmentsSuccess(response));
  } catch (error) {
    yield put(getDepartmentsFail(error));
  }

  //get yearsemesters
  const get_year_sem = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_YearsSemesters",
  };
  try {
    const response = yield call(getYearSemesters, get_year_sem);
    yield put(getYearSemestersSuccess(response));
  } catch (error) {
    yield put(getYearSemestersFail(error));
  }
  
  
    //get majors_types
    const get_majors_types = {
      source: "db",
      procedure: "Generic_getOptions",
      apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
      tablename: "settings_Grades",
      fields: "Id,arTitle"
    };
    try {
      const response = yield call(getGrades, get_majors_types);
      
      yield put(getGradesSuccess(response));
    } catch (error) {
      yield put(getGradesFail(error));
    }

  //get faculty
  const get_faculty_opt = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_Faculty",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getFaculties, get_faculty_opt);
    yield put(getFacultiesSuccess(response));
  } catch (error) {
    yield put(getFacultiesFail(error));
  }

  //get academic certificates
  const get_settings_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_AcadmicCertificates",
  };
  try {
    const response = yield call(getAcademicCertificates, get_settings_req);
    yield put(getAcademicCertificatesSuccess(response));
  } catch (error) {
    yield put(getAcademicCertificatesFail(error));
  }
}

function* onAddNewAcademicCertificate({ payload, academiccertificate }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_AcadmicCertificates";
  payload["queryname"] = "_AcadmicCertificates";

  try {
    const response = yield call(addNewAcademicCertificate, payload);
    yield put(addAcademicCertificateSuccess(response[0]));
  } catch (error) {
    yield put(addAcademicCertificateFail(error));
  }
}

function* onUpdateAcademicCertificate({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_AcadmicCertificates";
  payload["queryname"] = "_AcadmicCertificates";
  try {
    const response = yield call(updateAcademicCertificate, payload);
    yield put(updateAcademicCertificateSuccess(response[0]));
  } catch (error) {
    yield put(updateAcademicCertificateFail(error));
  }
}

function* onDeleteAcademicCertificate({ payload, academiccertificate }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_AcadmicCertificates";

  try {
    const response = yield call(deleteAcademicCertificate, payload);
    yield put(deleteAcademicCertificateSuccess(response[0]));
  } catch (error) {
    yield put(deleteAcademicCertificateFail(error));
  }
}

function* onGetAcademicCertificateDeletedValue() {
  try {
    const response = yield call(getAcademicCertificateDeletedValue)
    yield put(getAcademicCertificateDeletedValueSuccess(response))
  } catch (error) {
    yield put(getAcademicCertificateDeletedValueFail(error))
  }
  
}


function* academiccertificatesSaga() {
  yield takeEvery(GET_ACADEMICCERTIFICATES, fetchAcademicCertificates);
  yield takeEvery(GET_FILTERED_DEPARTMENTS, fetchFilteredDepartments);
  yield takeEvery(ADD_NEW_ACADEMICCERTIFICATES, onAddNewAcademicCertificate);
  yield takeEvery(UPDATE_ACADEMICCERTIFICATE, onUpdateAcademicCertificate);
  yield takeEvery(DELETE_ACADEMICCERTIFICATES, onDeleteAcademicCertificate);
  yield takeEvery(GET_ACADEMICCERTIFICATE_DELETED_VALUE, onGetAcademicCertificateDeletedValue);
}

export default academiccertificatesSaga;
