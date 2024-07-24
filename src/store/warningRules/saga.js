import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_WARNING_RULES,
  ADD_NEW_WARNING_RULE,
  DELETE_WARNING_RULE,
  UPDATE_WARNING_RULE,
  GET_WARNING_RULE_DELETED_VALUE,
} from "./actionTypes";

import {
  getWarningRulesSuccess,
  getWarningRulesFail,
  addWarningRuleSuccess,
  addWarningRuleFail,
  updateWarningRuleSuccess,
  updateWarningRuleFail,
  deleteWarningRuleSuccess,
  deleteWarningRuleFail,
  getWarningRuleDeletedValueSuccess,
  getWarningRuleDeletedValueFail,
  getWarningRulesOptSuccess,
  getWarningRulesOptFail,
  getStudentStatesSuccess,
  getStudentStatesFail,
} from "./actions";

import { getSemestersSuccess, getSemestersFail } from "../semesters/actions";

// Include Both Helper File with needed methods
import {
  getWarningRules,
  addNewWarningRule,
  updateWarningRule,
  deleteWarningRule,
  getWarningRuleDeletedValue,
  getSemesters,
  getWarningRulesOpt,
  getStudentStates,
} from "../../helpers/fakebackend_helper";

function* fetchWarningRules() {
  const get_warningRules_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_WarningRules",
  };
  try {
    const response = yield call(getWarningRules, get_warningRules_req);
    response.map(resp => {
      resp["applyForSemester"] = JSON.parse(resp["applyForSemester"]);
      resp["applyStatus"] = JSON.parse(resp["applyStatus"]);
      resp["prevAcademicWarning"] = JSON.parse(resp["prevAcademicWarning"]);
      resp["prevStatusSemes"] = JSON.parse(resp["prevStatusSemes"]);
    });
    yield put(getWarningRulesSuccess(response));
  } catch (error) {
    yield put(getWarningRulesFail(error));
  }

  //get semester
  const get_semester_opt = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_Semesters",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getSemesters, get_semester_opt);
    yield put(getSemestersSuccess(response));
  } catch (error) {
    yield put(getSemestersFail(error));
  }

  //get student state
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

  // warning opts
  const get_warningRulesOpt_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_WarningRules",
    fields: "Id,arWarningStatus",
  };
  try {
    const response = yield call(getWarningRulesOpt, get_warningRulesOpt_req);
    yield put(getWarningRulesOptSuccess(response));
  } catch (error) {
    yield put(getWarningRulesOptFail(error));
  }
}

function* onAddNewWarningRule({ payload, warningRule }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "WarningRules_AddNew";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_WarningRules";
  payload["queryname"] = "_Common_WarningRules";

  try {
    const response = yield call(addNewWarningRule, payload);
    response.map(resp => {
      resp["applyForSemester"] = JSON.parse(resp["applyForSemester"]);
      resp["applyStatus"] = JSON.parse(resp["applyStatus"]);
      resp["prevAcademicWarning"] = JSON.parse(resp["prevAcademicWarning"]);
      resp["prevStatusSemes"] = JSON.parse(resp["prevStatusSemes"]);
    });
    yield put(addWarningRuleSuccess(response[0]));
  } catch (error) {
    yield put(addWarningRuleFail(error));
  }
}

function* onUpdateWarningRule({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "WarningRules_update";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_WarningRules";
  payload["queryname"] = "_Common_WarningRules";

  try {
    const respupdate = yield call(updateWarningRule, payload);
    respupdate.map(resp => {
      resp["applyForSemester"] = JSON.parse(resp["applyForSemester"]);
      resp["applyStatus"] = JSON.parse(resp["applyStatus"]);
      resp["prevAcademicWarning"] = JSON.parse(resp["prevAcademicWarning"]);
      resp["prevStatusSemes"] = JSON.parse(resp["prevStatusSemes"]);
    });
    yield put(updateWarningRuleSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateWarningRuleFail(error));
  }
}

function* onDeleteWarningRule({ payload, warningRule }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_WarningRules";

  try {
    const respdelete = yield call(deleteWarningRule, payload);
    yield put(deleteWarningRuleSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteWarningRuleFail(error));
  }
}

function* onGetWarningRuleDeletedValue() {
  try {
    const response = yield call(getWarningRuleDeletedValue);
    yield put(getWarningRuleDeletedValueSuccess(response));
  } catch (error) {
    yield put(getWarningRuleDeletedValueFail(error));
  }
}

function* warningRulesSaga() {
  yield takeEvery(GET_WARNING_RULES, fetchWarningRules);
  yield takeEvery(ADD_NEW_WARNING_RULE, onAddNewWarningRule);
  yield takeEvery(DELETE_WARNING_RULE, onDeleteWarningRule);
  yield takeEvery(UPDATE_WARNING_RULE, onUpdateWarningRule);
  yield takeEvery(GET_WARNING_RULE_DELETED_VALUE, onGetWarningRuleDeletedValue);
}

export default warningRulesSaga;
