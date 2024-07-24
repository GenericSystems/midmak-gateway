import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_EXCEPTIONAL_PERIODS,
  ADD_NEW_EXCEPTIONAL_PERIOD,
  DELETE_EXCEPTIONAL_PERIOD,
  UPDATE_EXCEPTIONAL_PERIOD,
  GET_EXCEPTIONAL_PERIOD_DELETED_VALUE,
} from "./actionTypes";

import {
  getExceptionalPeriodsSuccess,
  getExceptionalPeriodsFail,
  addExceptionalPeriodSuccess,
  addExceptionalPeriodFail,
  updateExceptionalPeriodSuccess,
  updateExceptionalPeriodFail,
  deleteExceptionalPeriodSuccess,
  deleteExceptionalPeriodFail,
  getExceptionalPeriodDeletedValueSuccess,
  getExceptionalPeriodDeletedValueFail,
  getExceptionalPeriodsOptSuccess,
  getExceptionalPeriodsOptFail,

} from "./actions";

import { getStudentStatesSuccess, getStudentStatesFail ,getWarningRulesSuccess, getWarningRulesFail} from "../warningRules/actions";

import {   getRequestsSuccess, getRequestsFail,} from "../requests/actions";


// Include Both Helper File with needed methods
import {
  getExceptionalPeriods,
  addNewExceptionalPeriod,
  updateExceptionalPeriod,
  deleteExceptionalPeriod,
  getExceptionalPeriodDeletedValue,
  getStudentStates,
  getExceptionalPeriodsOpt,
  getWarningRules,
  getRequests
} from "../../helpers/fakebackend_helper";



function* fetchExceptionalPeriods() {
  const get_exceptionalPeriods_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_ExceptionalPeriods"
  };
  try {
    const response = yield call(getExceptionalPeriods, get_exceptionalPeriods_req);
    response.map(resp => {
      resp["ExceptionalPeriodsWarnings"] = JSON.parse(resp["ExceptionalPeriodsWarnings"]);
      resp["ExceptionalPeriodsStudentState"] = JSON.parse(resp["ExceptionalPeriodsStudentState"]);
      resp["ExceptionalPeriodsNotInclude"] = JSON.parse(resp["ExceptionalPeriodsNotInclude"]);
      resp["AllowedRequests"] = JSON.parse(resp["AllowedRequests"]);

  });
    yield put(getExceptionalPeriodsSuccess(response));
  } catch (error) {
    yield put(getExceptionalPeriodsFail(error));
  }

   //get stdState
   const get_stdState_opt = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_StudentState",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getStudentStates, get_stdState_opt);
    yield put(getStudentStatesSuccess(response));
  } catch (error) {
    yield put(getStudentStatesFail(error));
  }

  //get warnings
  const get_warnings_opt = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_WarningRules",
    fields: "Id,arWarningStatus",
  };
  try {
    const response = yield call(getWarningRules, get_warnings_opt);
    yield put(getWarningRulesSuccess(response));
  } catch (error) {
    yield put(getWarningRulesFail(error));
  }

  // stdwarning opts
  const get_exceptionalPeriodsOpt_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_ExceptionalPeriods",
    fields: "Id,arAddPeriod",

  };
  try {
    const response = yield call(getExceptionalPeriodsOpt, get_exceptionalPeriodsOpt_req);
    yield put(getExceptionalPeriodsOptSuccess(response));
  } catch (error) {
    yield put(getExceptionalPeriodsOptFail(error));
  }

  // requets
  const get_requets_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "financeSetting_requests",
    fields: "Id,arTitle",

  };
  try {
    const response = yield call(getRequests, get_requets_req);
    yield put(getRequestsSuccess(response));
  } catch (error) {
    yield put(getRequestsFail(error));
  }
  
}


function* onAddNewExceptionalPeriod({ payload, warningRule }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "ExceptionalPeriods_AddNew";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_ExceptionalPeriods";
  payload["queryname"] = "_Common_ExceptionalPeriods";

  try {
    const response = yield call(addNewExceptionalPeriod, payload);
    response.map(resp => {
      resp["ExceptionalPeriodsWarnings"] = JSON.parse(resp["ExceptionalPeriodsWarnings"]);
      resp["ExceptionalPeriodsStudentState"] = JSON.parse(resp["ExceptionalPeriodsStudentState"]);
      resp["ExceptionalPeriodsNotInclude"] = JSON.parse(resp["ExceptionalPeriodsNotInclude"]);
      resp["AllowedRequests"] = JSON.parse(resp["AllowedRequests"]);
  });
    yield put(addExceptionalPeriodSuccess(response[0]));
  } catch (error) {
    yield put(addExceptionalPeriodFail(error));
  }
}

function* onUpdateExceptionalPeriod({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "ExceptionalPeriods_Update";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_ExceptionalPeriods";
  payload["queryname"] = "_Common_ExceptionalPeriods";

  try {
    const respupdate = yield call(updateExceptionalPeriod, payload);
    respupdate.map(resp => {
      resp["ExceptionalPeriodsWarnings"] = JSON.parse(resp["ExceptionalPeriodsWarnings"]);
      resp["ExceptionalPeriodsStudentState"] = JSON.parse(resp["ExceptionalPeriodsStudentState"]);
      resp["ExceptionalPeriodsNotInclude"] = JSON.parse(resp["ExceptionalPeriodsNotInclude"]);
      resp["AllowedRequests"] = JSON.parse(resp["AllowedRequests"]);

  });
  
    yield put(updateExceptionalPeriodSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateExceptionalPeriodFail(error));
  }
}

function* onDeleteExceptionalPeriod({ payload, warningRule }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_ExceptionalPeriods";

  try {
    const respdelete = yield call(deleteExceptionalPeriod, payload);
    yield put(deleteExceptionalPeriodSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteExceptionalPeriodFail(error));
  }
}

function* onGetExceptionalPeriodDeletedValue() {
  try {
    const response = yield call(getExceptionalPeriodDeletedValue)
    yield put(getExceptionalPeriodDeletedValueSuccess(response))
  } catch (error) {
    yield put(getExceptionalPeriodDeletedValueFail(error))
  }
  
}

function* exceptionalPeriodsSaga() {
  yield takeEvery(GET_EXCEPTIONAL_PERIODS, fetchExceptionalPeriods);
  yield takeEvery(ADD_NEW_EXCEPTIONAL_PERIOD, onAddNewExceptionalPeriod);
  yield takeEvery(DELETE_EXCEPTIONAL_PERIOD, onDeleteExceptionalPeriod);
  yield takeEvery(UPDATE_EXCEPTIONAL_PERIOD, onUpdateExceptionalPeriod);
  yield takeEvery(GET_EXCEPTIONAL_PERIOD_DELETED_VALUE, onGetExceptionalPeriodDeletedValue);
}

export default exceptionalPeriodsSaga;
