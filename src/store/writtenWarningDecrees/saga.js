import { call, put, takeEvery } from "redux-saga/effects";

// Redux Action Types
import {
  GET_WRITTEN_WARNING_DECREES,
  GET_WRITTEN_WARNING_DECREE_DELETED_VALUE,
  ADD_NEW_WRITTEN_WARNING_DECREE,
  DELETE_WRITTEN_WARNING_DECREE,
  UPDATE_WRITTEN_WARNING_DECREE,
} from "./actionTypes";

import {
  getWrittenWarningDecreesSuccess,
  getWrittenWarningDecreesFail,
  getWrittenWarningDecreeDeletedValueSuccess,
  getWrittenWarningDecreeDeletedValueFail,
  addWrittenWarningDecreeSuccess,
  addWrittenWarningDecreeFail,
  updateWrittenWarningDecreeSuccess,
  updateWrittenWarningDecreeFail,
  deleteWrittenWarningDecreeSuccess,
  deleteWrittenWarningDecreeFail,
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
  getWrittenWarningDecrees,
  getWrittenWarningDecreeDeletedValue,
  addNewWrittenWarningDecree,
  updateWrittenWarningDecree,
  deleteWrittenWarningDecree,
  getYears,
  getTraineesOpt,
  getTurnReasons,
  getDecreeReason,
  getCoursesOffering,
  getDecisionStatus,
  getEmployeesNames,
} from "../../helpers/fakebackend_helper";

function* fetchWrittenWarningDecrees() {
  const requestPayload = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_AbsenceWarnings",
  };
  try {
    const response = yield call(getWrittenWarningDecrees, requestPayload);
    yield put(getWrittenWarningDecreesSuccess(response));
  } catch (error) {
    yield put(getWrittenWarningDecreesFail(error));
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

function* getWrittenWarningDecreeProfile() {
  try {
    const response = yield call(getWrittenWarningDecreeDeletedValue);
    yield put(getWrittenWarningDecreeDeletedValueSuccess(response));
  } catch (error) {
    yield put(getWrittenWarningDecreeDeletedValueFail(error));
  }
}

function* onAddNewWrittenWarningDecree({ payload }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_WrittenWarningDecrees";

  try {
    const response = yield call(addNewWrittenWarningDecree, payload);
    yield put(addWrittenWarningDecreeSuccess(response[0]));
  } catch (error) {
    yield put(addWrittenWarningDecreeFail(error));
  }
}

function* onUpdateWrittenWarningDecree({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_WrittenWarningDecrees";

  try {
    const response = yield call(updateWrittenWarningDecree, payload);
    yield put(updateWrittenWarningDecreeSuccess(response[0]));
  } catch (error) {
    yield put(updateWrittenWarningDecreeFail(error));
  }
}

function* onDeleteWrittenWarningDecree({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_WrittenWarningDecrees";

  try {
    const response = yield call(deleteWrittenWarningDecree, payload);
    yield put(deleteWrittenWarningDecreeSuccess(response[0]));
  } catch (error) {
    yield put(deleteWrittenWarningDecreeFail(error));
  }
}

function* WrittenWarningDecreesSaga() {
  yield takeEvery(GET_WRITTEN_WARNING_DECREES, fetchWrittenWarningDecrees);
  yield takeEvery(
    GET_WRITTEN_WARNING_DECREE_DELETED_VALUE,
    getWrittenWarningDecreeProfile
  );
  yield takeEvery(ADD_NEW_WRITTEN_WARNING_DECREE, onAddNewWrittenWarningDecree);
  yield takeEvery(UPDATE_WRITTEN_WARNING_DECREE, onUpdateWrittenWarningDecree);
  yield takeEvery(DELETE_WRITTEN_WARNING_DECREE, onDeleteWrittenWarningDecree);
}

export default WrittenWarningDecreesSaga;
