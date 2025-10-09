import { call, put, takeEvery } from "redux-saga/effects";

// Redux Action Types
import {
  GET_DISMISS_DECREES_EXAM,
  GET_DISMISS_DECREE_EXAM_DELETED_VALUE,
  ADD_NEW_DISMISS_DECREE_EXAM,
  DELETE_DISMISS_DECREE_EXAM,
  UPDATE_DISMISS_DECREE_EXAM,
} from "./actionTypes";

import {
  getDismissDecreesExamSuccess,
  getDismissDecreesExamFail,
  getDismissDecreeExamDeletedValueSuccess,
  getDismissDecreeExamDeletedValueFail,
  addDismissDecreeExamSuccess,
  addDismissDecreeExamFail,
  updateDismissDecreeExamSuccess,
  updateDismissDecreeExamFail,
  deleteDismissDecreeExamSuccess,
  deleteDismissDecreeExamFail,
} from "./actions";

import { getYearsSuccess, getYearsFail } from "../years/actions";
import {
  getDecreeReasonSuccess,
  getDecreeReasonFail,
  getTurnReasonsSuccess,
  getTurnReasonsFail,
} from "../Absence-warnings/actions";

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
  getDismissDecreesExam,
  getDismissDecreeExamDeletedValue,
  addNewDismissDecreeExam,
  updateDismissDecreeExam,
  deleteDismissDecreeExam,
  getYears,
  getTraineesOpt,
  getTurnReasons,
  getDecreeReason,
  getCoursesOffering,
  getDecisionStatus,
  getEmployeesNames,
} from "../../helpers/fakebackend_helper";

function* fetchDismissDecreeExams() {
  const requestPayload = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_AbsenceWarnings",
  };
  try {
    const response = yield call(getDismissDecreesExam, requestPayload);
    yield put(getDismissDecreesExamSuccess(response));
  } catch (error) {
    yield put(getDismissDecreesExamFail(error));
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
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_DecisionStatus",
    fields: "Id,arTitle",
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

function* getDismissDecreeExamProfile() {
  try {
    const response = yield call(getDismissDecreeExamDeletedValue);
    yield put(getDismissDecreeExamDeletedValueSuccess(response));
  } catch (error) {
    yield put(getDismissDecreeExamDeletedValueFail(error));
  }
}

function* onAddNewDismissDecreeExam({ payload }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_DismissDecreeExams";

  try {
    const response = yield call(addNewDismissDecreeExam, payload);
    yield put(addDismissDecreeExamSuccess(response[0]));
  } catch (error) {
    yield put(addDismissDecreeExamFail(error));
  }
}

function* onUpdateDismissDecreeExam({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_DismissDecreeExams";

  try {
    const response = yield call(updateDismissDecreeExam, payload);
    yield put(updateDismissDecreeExamSuccess(response[0]));
  } catch (error) {
    yield put(updateDismissDecreeExamFail(error));
  }
}

function* onDeleteDismissDecreeExam({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_DismissDecreeExams";

  try {
    const response = yield call(deleteDismissDecreeExam, payload);
    yield put(deleteDismissDecreeExamSuccess(response[0]));
  } catch (error) {
    yield put(deleteDismissDecreeExamFail(error));
  }
}

function* DismissDecreesExamSaga() {
  yield takeEvery(GET_DISMISS_DECREES_EXAM, fetchDismissDecreeExams);
  yield takeEvery(
    GET_DISMISS_DECREE_EXAM_DELETED_VALUE,
    getDismissDecreeExamProfile
  );
  yield takeEvery(ADD_NEW_DISMISS_DECREE_EXAM, onAddNewDismissDecreeExam);
  yield takeEvery(UPDATE_DISMISS_DECREE_EXAM, onUpdateDismissDecreeExam);
  yield takeEvery(DELETE_DISMISS_DECREE_EXAM, onDeleteDismissDecreeExam);
}

export default DismissDecreesExamSaga;
