import { call, put, takeEvery } from "redux-saga/effects";

// Redux Action Types
import {
  GET_ORAL_WARNING_DECREES,
  GET_ORAL_WARNING_DECREE_DELETED_VALUE,
  ADD_NEW_ORAL_WARNING_DECREE,
  DELETE_ORAL_WARNING_DECREE,
  UPDATE_ORAL_WARNING_DECREE,
} from "./actionTypes";

import {
  getOralWarningDecreesSuccess,
  getOralWarningDecreesFail,
  getOralWarningDecreeDeletedValueSuccess,
  getOralWarningDecreeDeletedValueFail,
  addOralWarningDecreeSuccess,
  addOralWarningDecreeFail,
  updateOralWarningDecreeSuccess,
  updateOralWarningDecreeFail,
  deleteOralWarningDecreeSuccess,
  deleteOralWarningDecreeFail,
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
  getOralWarningDecrees,
  getOralWarningDecreeDeletedValue,
  addNewOralWarningDecree,
  updateOralWarningDecree,
  deleteOralWarningDecree,
  getYears,
  getTraineesOpt,
  getTurnReasons,
  getDecreeReason,
  getCoursesOffering,
  getDecisionStatus,
  getEmployeesNames,
} from "../../helpers/fakebackend_helper";

function* fetchOralWarningDecrees() {
  const requestPayload = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_OralWarningDecrees",
  };
  try {
    const response = yield call(getOralWarningDecrees, requestPayload);
    yield put(getOralWarningDecreesSuccess(response));
  } catch (error) {
    yield put(getOralWarningDecreesFail(error));
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

function* getOralWarningDecreeProfile() {
  try {
    const response = yield call(getOralWarningDecreeDeletedValue);
    yield put(getOralWarningDecreeDeletedValueSuccess(response));
  } catch (error) {
    yield put(getOralWarningDecreeDeletedValueFail(error));
  }
}

function* onAddNewOralWarningDecree({ payload }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_OralWarningDecrees";

  try {
    const response = yield call(addNewOralWarningDecree, payload);
    yield put(addOralWarningDecreeSuccess(response[0]));
  } catch (error) {
    yield put(addOralWarningDecreeFail(error));
  }
}

function* onUpdateOralWarningDecree({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_OralWarningDecrees";

  try {
    const response = yield call(updateOralWarningDecree, payload);
    yield put(updateOralWarningDecreeSuccess(response[0]));
  } catch (error) {
    yield put(updateOralWarningDecreeFail(error));
  }
}

function* onDeleteOralWarningDecree({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_OralWarningDecrees";

  try {
    const response = yield call(deleteOralWarningDecree, payload);
    yield put(deleteOralWarningDecreeSuccess(response[0]));
  } catch (error) {
    yield put(deleteOralWarningDecreeFail(error));
  }
}

function* OralWarningDecreesSaga() {
  yield takeEvery(GET_ORAL_WARNING_DECREES, fetchOralWarningDecrees);
  yield takeEvery(
    GET_ORAL_WARNING_DECREE_DELETED_VALUE,
    getOralWarningDecreeProfile
  );
  yield takeEvery(ADD_NEW_ORAL_WARNING_DECREE, onAddNewOralWarningDecree);
  yield takeEvery(UPDATE_ORAL_WARNING_DECREE, onUpdateOralWarningDecree);
  yield takeEvery(DELETE_ORAL_WARNING_DECREE, onDeleteOralWarningDecree);
}

export default OralWarningDecreesSaga;
