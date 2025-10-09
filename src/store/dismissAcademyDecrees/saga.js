import { call, put, takeEvery } from "redux-saga/effects";

// Redux Action Types
import {
  GET_DISMISS_ACADEMY_DECREES,
  GET_DISMISS_ACADEMY_DECREE_DELETED_VALUE,
  ADD_NEW_DISMISS_ACADEMY_DECREE,
  DELETE_DISMISS_ACADEMY_DECREE,
  UPDATE_DISMISS_ACADEMY_DECREE,
} from "./actionTypes";

import {
  getDismissAcademyDecreesSuccess,
  getDismissAcademyDecreesFail,
  getDismissAcademyDecreeDeletedValueSuccess,
  getDismissAcademyDecreeDeletedValueFail,
  addDismissAcademyDecreeSuccess,
  addDismissAcademyDecreeFail,
  updateDismissAcademyDecreeSuccess,
  updateDismissAcademyDecreeFail,
  deleteDismissAcademyDecreeSuccess,
  deleteDismissAcademyDecreeFail,
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
  getDismissAcademyDecrees,
  getDismissAcademyDecreeDeletedValue,
  addNewDismissAcademyDecree,
  updateDismissAcademyDecree,
  deleteDismissAcademyDecree,
  getYears,
  getTraineesOpt,
  getTurnReasons,
  getDecreeReason,
  getCoursesOffering,
  getDecisionStatus,
  getEmployeesNames,
} from "../../helpers/fakebackend_helper";

function* fetchDismissAcademyDecrees() {
  const requestPayload = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_AbsenceWarnings",
  };
  try {
    const response = yield call(getDismissAcademyDecrees, requestPayload);
    yield put(getDismissAcademyDecreesSuccess(response));
  } catch (error) {
    yield put(getDismissAcademyDecreesFail(error));
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

function* getDismissAcademyDecreeProfile() {
  try {
    const response = yield call(getDismissAcademyDecreeDeletedValue);
    yield put(getDismissAcademyDecreeDeletedValueSuccess(response));
  } catch (error) {
    yield put(getDismissAcademyDecreeDeletedValueFail(error));
  }
}

function* onAddNewDismissAcademyDecree({ payload }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_DismissAcademyDecrees";

  try {
    const response = yield call(addNewDismissAcademyDecree, payload);
    yield put(addDismissAcademyDecreeSuccess(response[0]));
  } catch (error) {
    yield put(addDismissAcademyDecreeFail(error));
  }
}

function* onUpdateDismissAcademyDecree({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_DismissAcademyDecrees";

  try {
    const response = yield call(updateDismissAcademyDecree, payload);
    yield put(updateDismissAcademyDecreeSuccess(response[0]));
  } catch (error) {
    yield put(updateDismissAcademyDecreeFail(error));
  }
}

function* onDeleteDismissAcademyDecree({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_DismissAcademyDecrees";

  try {
    const response = yield call(deleteDismissAcademyDecree, payload);
    yield put(deleteDismissAcademyDecreeSuccess(response[0]));
  } catch (error) {
    yield put(deleteDismissAcademyDecreeFail(error));
  }
}

function* DismissAcademyDecreesSaga() {
  yield takeEvery(GET_DISMISS_ACADEMY_DECREES, fetchDismissAcademyDecrees);
  yield takeEvery(
    GET_DISMISS_ACADEMY_DECREE_DELETED_VALUE,
    getDismissAcademyDecreeProfile
  );
  yield takeEvery(ADD_NEW_DISMISS_ACADEMY_DECREE, onAddNewDismissAcademyDecree);
  yield takeEvery(UPDATE_DISMISS_ACADEMY_DECREE, onUpdateDismissAcademyDecree);
  yield takeEvery(DELETE_DISMISS_ACADEMY_DECREE, onDeleteDismissAcademyDecree);
}

export default DismissAcademyDecreesSaga;
