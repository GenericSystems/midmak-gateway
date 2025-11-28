import { call, put, takeEvery } from "redux-saga/effects";
import {
  GET_DECISIONS,
  ADD_NEW_DECISION,
  DELETE_DECISION,
  UPDATE_DECISION,
  GET_DECISION_DELETED_VALUE,
  GET_DECISION_MAKERS,
  GET_DECISION_STATUS,
} from "./actionTypes";
import {
  getDecisionsSuccess,
  getDecisionsFail,
  addDecisionFail,
  addDecisionSuccess,
  updateDecisionSuccess,
  updateDecisionFail,
  deleteDecisionSuccess,
  deleteDecisionFail,
  getDecisionDeletedValueSuccess,
  getDecisionDeletedValueFail,
  getDecisionMakersSuccess,
  getDecisionMakersFail,
  getDecisionStatusSuccess,
  getDecisionStatusFail,
} from "./actions";

import {
  getEmployeesNamesSuccess,
  getEmployeesNamesFail,
  getCorporateNodesOptSuccess,
  getCorporateNodesOptFail,
} from "../HR/employees/actions";

import {
  getDecisionsTypesSuccess,
  getDecisionsTypesFail,
} from "../HR/decisionsTypes/actions";

import {
  getDecisions,
  addNewDecision,
  updateDecision,
  deleteDecision,
  getDecisionDeletedValue,
  getDecisionMakers,
  getEmployeesNames,
  getCorporateNodesOpt,
  getDecisionsTypes,
  getDecisionStatus,
} from "../../helpers/fakebackend_helper";

function* fetchDecisions() {
  const get_decisions_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_Decision",
  };
  try {
    const response = yield call(getDecisions, get_decisions_req);
    response.map(resp => {
      resp["employees"] = JSON.parse(resp["employees"]);
    });
    console.log("732656", response);
    yield put(getDecisionsSuccess(response));
  } catch (error) {
    yield put(getDecisionsFail(error));
  }
  const get_employeeName_req = {
    source: "db",
    procedure: "Generic_getOptions",
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
  const get_CorporateNodes_req = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_AcadmeyOrgStructureNames",
    fields: "key,arTitle,strType",
  };
  try {
    const response = yield call(getCorporateNodesOpt, get_CorporateNodes_req);
    console.log("477777777777777777775454545454545454", response);
    yield put(getCorporateNodesOptSuccess(response));
  } catch (error) {
    yield put(getCorporateNodesOptFail(error));
  }

  const get_decisionType_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_DecisionType",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getDecisionsTypes, get_decisionType_req);
    console.log("fffffffffffffff", response);
    yield put(getDecisionsTypesSuccess(response));
  } catch (error) {
    yield put(getDecisionsTypesFail(error));
  }
}

function* fetchDecisionMakers() {
  const get_decisionMaker_req = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_JobTitles",
    fields: "Id,arJobTitle",
  };
  try {
    const response = yield call(getDecisionMakers, get_decisionMaker_req);
    console.log("45454545454545454", response);
    yield put(getDecisionMakersSuccess(response));
  } catch (error) {
    yield put(getDecisionMakersFail(error));
  }
}

function* fetchDecisionStatus() {
  const get_decisionStatus_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_DecisionStatus",
  };
  try {
    const response = yield call(getDecisionStatus, get_decisionStatus_req);
    console.log("0000000000000000000000000000000", response);
    yield put(getDecisionStatusSuccess(response));
  } catch (error) {
    yield put(getDecisionStatusFail(error));
  }
}

function* onAddNewDecision({ payload, decision }) {
  console.log("payloadpayloadpayloadpayloadpayload", payload);
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_Decision";
  payload["queryname"] = "_Common_Decision";
  try {
    const response = yield call(addNewDecision, payload);
    response.map(resp => {
      resp["employees"] = JSON.parse(resp["employees"]);
    });
    yield put(addDecisionSuccess(response[0]));
  } catch (error) {
    yield put(addDecisionFail(error));
  }
}

function* onUpdateDecision({ payload }) {
  console.log("payload", payload);
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_Decision";
  payload["queryname"] = "_Common_Decision";
  try {
    const response = yield call(updateDecision, payload);
    const cleanedResponse = response.map(resp => {
      return {
        ...resp,
        employees: resp.employees ? JSON.parse(resp.employees) : [],
      };
    });

    yield put(updateDecisionSuccess(cleanedResponse[0]));
  } catch (error) {
    yield put(updateDecisionFail(error));
  }
}
function* onDeleteDecision({ payload, decision }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_Decision";
  try {
    const respdelete = yield call(deleteDecision, payload);
    yield put(deleteDecisionSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteDecisionFail(error));
  }
}
function* onGetDecisionDeletedValue() {
  try {
    const response = yield call(getDecisionDeletedValue);
    yield put(getDecisionDeletedValueSuccess(response));
  } catch (error) {
    yield put(getDecisionDeletedValueFail(error));
  }
}
function* DecisionsSaga() {
  yield takeEvery(GET_DECISIONS, fetchDecisions);
  yield takeEvery(ADD_NEW_DECISION, onAddNewDecision);
  yield takeEvery(UPDATE_DECISION, onUpdateDecision);
  yield takeEvery(DELETE_DECISION, onDeleteDecision);
  yield takeEvery(GET_DECISION_DELETED_VALUE, onGetDecisionDeletedValue);
  yield takeEvery(GET_DECISION_MAKERS, fetchDecisionMakers);
  yield takeEvery(GET_DECISION_STATUS, fetchDecisionStatus);
}
export default DecisionsSaga;
