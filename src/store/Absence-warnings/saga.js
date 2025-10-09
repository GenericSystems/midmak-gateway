import { call, put, takeEvery } from "redux-saga/effects";

// Redux Action Types
import {
  GET_ABSENCE_WARNINGS,
  GET_ABSENCE_WARNING_DELETED_VALUE,
  ADD_NEW_ABSENCE_WARNING,
  DELETE_ABSENCE_WARNING,
  UPDATE_ABSENCE_WARNING,
} from "./actionTypes";

import {
  getAbsenceWarningsSuccess,
  getAbsenceWarningsFail,
  getAbsenceWarningDeletedValueSuccess,
  getAbsenceWarningDeletedValueFail,
  addAbsenceWarningSuccess,
  addAbsenceWarningFail,
  updateAbsenceWarningSuccess,
  updateAbsenceWarningFail,
  deleteAbsenceWarningSuccess,
  deleteAbsenceWarningFail,
  getDecreeReasonSuccess,
  getDecreeReasonFail,
  getTurnReasonsSuccess,
  getTurnReasonsFail,
} from "./actions";

import { getYearsSuccess, getYearsFail } from "../years/actions";
import { getTraineesOptSuccess, getTraineesOptFail } from "../trainees/actions";
import {
  getCoursesOfferingSuccess,
  getCoursesOfferingFail,
} from "../classScheduling/actions";
import {
  getDecisionStatusSuccess,
  getDecisionStatusFail,
} from "../decisions/actions";
import {
  getEmployeesNamesSuccess,
  getEmployeesNamesFail,
} from "../HR/employees/actions";

// Helper API methods
import {
  getAbsenceWarnings,
  getAbsenceWarningDeletedValue,
  addNewAbsenceWarning,
  updateAbsenceWarning,
  deleteAbsenceWarning,
  getYears,
  getTraineesOpt,
  getTurnReasons,
  getDecreeReason,
  getCoursesOffering,
  getDecisionStatus,
  getEmployeesNames,
} from "../../helpers/fakebackend_helper";

function* fetchAbsenceWarnings() {
  const requestPayload = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_AbsenceWarnings",
  };
  try {
    const response = yield call(getAbsenceWarnings, requestPayload);
    yield put(getAbsenceWarningsSuccess(response));
  } catch (error) {
    yield put(getAbsenceWarningsFail(error));
  }

  const get_years_req = {
    source: "db",
    procedure: "Generic_Optiondatalist",
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
  const get_trainees_req = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_Trainee",
    fields: "Id,fullName",
  };
  try {
    const response = yield call(getTraineesOpt, get_trainees_req);
    yield put(getTraineesOptSuccess(response));
  } catch (error) {
    yield put(getTraineesOptFail(error));
  }
  const get_decreeReasons_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_Trainee",
    fields: "Id,fullName",
  };
  try {
    const response = yield call(getDecreeReason, get_decreeReasons_req);
    yield put(getDecreeReasonSuccess(response));
  } catch (error) {
    yield put(getDecreeReasonFail(error));
  }

  const get_courses_req = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_CourseOffering",
    filter: `isOffered = 1`,
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getCoursesOffering, get_courses_req);
    yield put(getCoursesOfferingSuccess(response));
  } catch (error) {
    yield put(getCoursesOfferingFail(error));
  }

  const get_decisionStatus_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_DecisionStatus",
  };
  try {
    const response = yield call(getDecisionStatus, get_decisionStatus_req);
    yield put(getDecisionStatusSuccess(response));
  } catch (error) {
    yield put(getDecisionStatusFail(error));
  }

  const get_turnReasons_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_DecisionStatus",
  };
  try {
    const response = yield call(getTurnReasons, get_turnReasons_req);
    yield put(getTurnReasonsSuccess(response));
  } catch (error) {
    yield put(getTurnReasonsFail(error));
  }

  const get_employeeName_req = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_EmployeeOption",
    fields: "Id,fullName",
  };
  try {
    const response = yield call(getEmployeesNames, get_employeeName_req);
    console.log("employeeName", response);
    yield put(getEmployeesNamesSuccess(response));
  } catch (error) {
    yield put(getEmployeesNamesFail(error));
  }
}

function* getAbsenceWarningProfile() {
  try {
    const response = yield call(getAbsenceWarningDeletedValue);
    yield put(getAbsenceWarningDeletedValueSuccess(response));
  } catch (error) {
    yield put(getAbsenceWarningDeletedValueFail(error));
  }
}

function* onAddNewAbsenceWarning({ payload }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_AbsenceWarnings";

  try {
    const response = yield call(addNewAbsenceWarning, payload);
    yield put(addAbsenceWarningSuccess(response[0]));
  } catch (error) {
    yield put(addAbsenceWarningFail(error));
  }
}

function* onUpdateAbsenceWarning({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_AbsenceWarnings";

  try {
    const response = yield call(updateAbsenceWarning, payload);
    yield put(updateAbsenceWarningSuccess(response[0]));
  } catch (error) {
    yield put(updateAbsenceWarningFail(error));
  }
}

function* onDeleteAbsenceWarning({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_AbsenceWarnings";

  try {
    const response = yield call(deleteAbsenceWarning, payload);
    yield put(deleteAbsenceWarningSuccess(response[0]));
  } catch (error) {
    yield put(deleteAbsenceWarningFail(error));
  }
}

function* AbsenceWarningsSaga() {
  yield takeEvery(GET_ABSENCE_WARNINGS, fetchAbsenceWarnings);
  yield takeEvery(GET_ABSENCE_WARNING_DELETED_VALUE, getAbsenceWarningProfile);
  yield takeEvery(ADD_NEW_ABSENCE_WARNING, onAddNewAbsenceWarning);
  yield takeEvery(UPDATE_ABSENCE_WARNING, onUpdateAbsenceWarning);
  yield takeEvery(DELETE_ABSENCE_WARNING, onDeleteAbsenceWarning);
}

export default AbsenceWarningsSaga;
