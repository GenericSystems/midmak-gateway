import { call, put, takeEvery } from "redux-saga/effects";
import {
  GET_DECISIONS,
  ADD_NEW_DECISION,
  DELETE_DECISION,
  UPDATE_DECISION,
  GET_DECISION_DELETED_VALUE,
  GET_DECISIONS_RULES_REASONS,
  ADD_NEW_DECISIONS_RULES_REASON,
  UPDATE_DECISIONS_RULES_REASON,
  DELETE_DECISIONS_RULES_REASON,
  GET_DECISIONS_RULES_REASON_DELETED_VALUE,
  GET_DECISIONS_RULES_CANCELED_REASONS,
  ADD_NEW_DECISIONS_RULES_CANCELED_REASON,
  UPDATE_DECISIONS_RULES_CANCELED_REASON,
  DELETE_DECISIONS_RULES_CANCELED_REASON,
  GET_DECISIONS_RULES_CANCELED_REASON_DELETED_VALUE,
  GET_DECISIONS_RULES_ROLES,
  ADD_NEW_DECISIONS_RULES_ROLES,
  UPDATE_DECISIONS_RULES_ROLES,
  DELETE_DECISIONS_RULES_ROLES,
  GET_DECISIONS_RULES_ROLES_DELETED_VALUE,
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
  getDecisionCategoriesFail,
  getDecisionCategoriesSuccess,
  getDecisionsRulesReasonsSuccess,
  getDecisionsRulesReasonsFail,
  addDecisionsRulesReasonSuccess,
  addDecisionsRulesReasonFail,
  updateDecisionsRulesReasonSuccess,
  updateDecisionsRulesReasonFail,
  deleteDecisionsRulesReasonSuccess,
  deleteDecisionsRulesReasonFail,
  getDecisionsRulesReasonDeletedValueSuccess,
  getDecisionsRulesReasonDeletedValueFail,
  getDecisionsRulesCanceledReasonsSuccess,
  getDecisionsRulesCanceledReasonsFail,
  addDecisionsRulesCanceledReasonSuccess,
  addDecisionsRulesCanceledReasonFail,
  updateDecisionsRulesCanceledReasonSuccess,
  updateDecisionsRulesCanceledReasonFail,
  deleteDecisionsRulesCanceledReasonSuccess,
  deleteDecisionsRulesCanceledReasonFail,
  getDecisionsRulesCanceledReasonDeletedValueSuccess,
  getDecisionsRulesCanceledReasonDeletedValueFail,
  getDecisionsRulesRolesSuccess,
  getDecisionsRulesRolesFail,
  addDecisionsRulesRoleSuccess,
  addDecisionsRulesRoleFail,
  updateDecisionsRulesRoleSuccess,
  updateDecisionsRulesRoleFail,
  deleteDecisionsRulesRoleSuccess,
  deleteDecisionsRulesRoleFail,
  getDecisionsRulesRoleDeletedValueSuccess,
  getDecisionsRulesRoleDeletedValueFail,
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
  getDecisionCategories,
  getDecisionsRulesCanceledReasons,
  addNewDecisionsRulesCanceledReason,
  updateDecisionsRulesCanceledReason,
  deleteDecisionsRulesCanceledReason,
  getDecisionsRulesCanceledReasonDeletedValue,
  getDecisionsRulesReasons,
  addNewDecisionsRulesReason,
  updateDecisionsRulesReason,
  deleteDecisionsRulesReason,
  getDecisionsRulesReasonDeletedValue,
  getDecisionsRulesRoles,
  addNewDecisionsRulesRole,
  updateDecisionsRulesRole,
  deleteDecisionsRulesRole,
  getDecisionsRulesRoleDeletedValue,
  getEmployeesNames,
  getCorporateNodesOpt,
  getDecisionsTypes,
  getDecisionStatus,
} from "../../helpers/fakebackend_helper";

function* fetchDecisions() {
  // const get_decision_categories_req = {
  //   source: "db",
  //   procedure: "Generic_getOptions",
  //   apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  //   tablename: "settings_DecisionsRulesCategory",
  //   fields: "Id,arTitle",
  // };
  // try {
  //   const response = yield call(
  //     getDecisionCategories,
  //     get_decision_categories_req
  //   );
  //   yield put(getDecisionCategoriesSuccess(response));
  // } catch (error) {
  //   yield put(getDecisionCategoriesFail(error));
  // }
  const get_decisions_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_Decision",
  };
  try {
    const response = yield call(getDecisions, get_decisions_req);
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
    tablename: "Settings_Gender",
    fields: "Id,arTitle",
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
    tablename: "Settings_Country",
    fields: "Id,arTitle",
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
  try {
    const response = yield call(addNewDecision, payload);
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
  try {
    const response = yield call(updateDecision, payload);
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", response);

    yield put(updateDecisionSuccess(response));
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
// function* fetchDecisionsRulesReasons(obj) {
//   let decisionId = obj.payload;
//   const get_decisions_req = {
//     source: "db",
//     procedure: "SisApp_getData",
//     apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
//     tablename: "settings_DecisionsRulesReasons",
//     filter: `decisionsRulesId = ${decisionId}`,
//   };
//   try {
//     const response = yield call(getDecisionsRulesReasons, get_decisions_req);
//     yield put(getDecisionsRulesReasonsSuccess(response));
//   } catch (error) {
//     yield put(getDecisionsRulesReasonsFail(error));
//   }
// }
// function* onAddNewDecisionsRulesReason({ payload, decision }) {
//   delete payload["id"];

//   payload["source"] = "db";
//   payload["procedure"] = "SisApp_addData";
//   payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
//   payload["tablename"] = "settings_DecisionsRulesReasons";
//   try {
//     const response = yield call(addNewDecisionsRulesReason, payload);
//     yield put(addDecisionsRulesReasonSuccess(response[0]));
//   } catch (error) {
//     yield put(addDecisionsRulesReasonFail(error));
//   }
// }

// function* onUpdateDecisionsRulesReason({ payload }) {
//   payload["source"] = "db";
//   payload["procedure"] = "SisApp_updateData";
//   payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
//   payload["tablename"] = "settings_DecisionsRulesReasons";
//   try {
//     const respupdate = yield call(updateDecisionsRulesReason, payload);
//     yield put(updateDecisionsRulesReasonSuccess(respupdate[0]));
//   } catch (error) {
//     yield put(updateDecisionsRulesReasonFail(error));
//   }
// }
// function* onDeleteDecisionsRulesReason({ payload, DecisionsRulesReason }) {
//   payload["source"] = "db";
//   payload["procedure"] = "SisApp_removeData";
//   payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
//   payload["tablename"] = "settings_DecisionsRulesReasons";
//   try {
//     const respdelete = yield call(deleteDecisionsRulesReason, payload);
//     yield put(deleteDecisionsRulesReasonSuccess(respdelete[0]));
//   } catch (error) {
//     yield put(deleteDecisionsRulesReasonFail(error));
//   }
// }
// function* onGetDecisionsRulesReasonDeletedValue() {
//   try {
//     const response = yield call(getDecisionsRulesReasonDeletedValue);
//     yield put(getDecisionsRulesReasonDeletedValueSuccess(response));
//   } catch (error) {
//     yield put(getDecisionsRulesReasonDeletedValueFail(error));
//   }
// }
// function* fetchDecisionsRulesCanceledReasons(obj) {
//   let decisionId = obj.payload;

//   const get_decisions_req = {
//     source: "db",
//     procedure: "SisApp_getData",
//     apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
//     tablename: "settings_DecisionsRulesCanceledReasons",
//     filter: `decisionsRulesId = ${decisionId}`,
//   };
//   try {
//     const response = yield call(
//       getDecisionsRulesCanceledReasons,
//       get_decisions_req
//     );
//     yield put(getDecisionsRulesCanceledReasonsSuccess(response));
//   } catch (error) {
//     yield put(getDecisionsRulesCanceledReasonsFail(error));
//   }
// }
// function* onAddNewDecisionsRulesCanceledReason({ payload, decision }) {
//   delete payload["id"];
//   payload["source"] = "db";
//   payload["procedure"] = "SisApp_addData";
//   payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
//   payload["tablename"] = "settings_DecisionsRulesCanceledReasons";
//   try {
//     const response = yield call(addNewDecisionsRulesCanceledReason, payload);
//     yield put(addDecisionsRulesCanceledReasonSuccess(response[0]));
//   } catch (error) {
//     yield put(addDecisionsRulesCanceledReasonFail(error));
//   }
// }

// function* onUpdateDecisionsRulesCanceledReason({ payload }) {
//   payload["source"] = "db";
//   payload["procedure"] = "SisApp_updateData";
//   payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
//   payload["tablename"] = "settings_DecisionsRulesCanceledReasons";
//   try {
//     const respupdate = yield call(updateDecisionsRulesCanceledReason, payload);
//     yield put(updateDecisionsRulesCanceledReasonSuccess(respupdate[0]));
//   } catch (error) {
//     yield put(updateDecisionsRulesCanceledReasonFail(error));
//   }
// }
// function* onDeleteDecisionsRulesCanceledReason({
//   payload,
//   DecisionsRulesCanceledReason,
// }) {
//   payload["source"] = "db";
//   payload["procedure"] = "SisApp_removeData";
//   payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
//   payload["tablename"] = "settings_DecisionsRulesCanceledReasons";
//   try {
//     const respdelete = yield call(deleteDecisionsRulesCanceledReason, payload);
//     yield put(deleteDecisionsRulesCanceledReasonSuccess(respdelete[0]));
//   } catch (error) {
//     yield put(deleteDecisionsRulesCanceledReasonFail(error));
//   }
// }
// function* onGetDecisionsRulesCanceledReasonDeletedValue() {
//   try {
//     const response = yield call(getDecisionsRulesCanceledReasonDeletedValue);
//     yield put(getDecisionsRulesCanceledReasonDeletedValueSuccess(response));
//   } catch (error) {
//     yield put(getDecisionsRulesCanceledReasonDeletedValueFail(error));
//   }
// }
// function* fetchDecisionsRulesRoles(obj) {
//   let decisionId = obj.payload;

//   const get_decisions_req = {
//     source: "db",
//     procedure: "Generic_getOptions",
//     apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
//     tablename: decisionId.tablename,
//     filter: `decisionsRulesId = ${decisionId.Id}`,
//     fields: "Id,arTitle,decisionsRulesId,roleId",

//   };

//   try {
//     const response = yield call(getDecisionsRulesRoles, get_decisions_req);
//     response.map(resp => {
//       if (resp["multiArray"]) {
//         resp["multiArray"] = JSON.parse(resp["multiArray"]);
//       }
//     });
//     yield put(getDecisionsRulesRolesSuccess(response));
//   } catch (error) {
//     yield put(getDecisionsRulesRolesFail(error));
//   }
// }

// function* onAddNewDecisionsRulesRole({ payload, decision }) {
//   delete payload["id"];

//   payload["source"] = "db";
//   payload["procedure"] = "SisApp_addMultiSelect";
//   payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
//   payload["filter"] = `decisionsRulesId = ${payload.Id}`;
//   payload["field"] = "roleId,decisionsRulesId";

//   try {
//     const response = yield call(addNewDecisionsRulesRole, payload);
//     yield put(addDecisionsRulesRoleSuccess(response[0]));
//   } catch (error) {
//     yield put(addDecisionsRulesRoleFail(error));
//   }
// }

// function* onUpdateDecisionsRulesRole({ payload }) {
//   payload["source"] = "db";
//   payload["procedure"] = "SisApp_updateData";
//   payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
//   payload["tablename"] = "settings_DecisionsRulesRoles";
//   try {
//     const respupdate = yield call(updateDecisionsRulesRole, payload);
//     yield put(updateDecisionsRulesRoleSuccess(respupdate[0]));
//   } catch (error) {
//     yield put(updateDecisionsRulesRoleFail(error));
//   }
// }
// function* onDeleteDecisionsRulesRole({ payload, DecisionsRulesRole }) {
//   payload["source"] = "db";
//   payload["procedure"] = "SisApp_removeData";
//   payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
//   payload["tablename"] = "settings_DecisionsRulesRoles";
//   try {
//     const respdelete = yield call(deleteDecisionsRulesRole, payload);
//     yield put(deleteDecisionsRulesRoleSuccess(respdelete[0]));
//   } catch (error) {
//     yield put(deleteDecisionsRulesRoleFail(error));
//   }
// }
// function* onGetDecisionsRulesRoleDeletedValue() {
//   try {
//     const response = yield call(getDecisionsRulesRoleDeletedValue);
//     yield put(getDecisionsRulesRoleDeletedValueSuccess(response));
//   } catch (error) {
//     yield put(getDecisionsRulesRoleDeletedValueFail(error));
//   }
// }
function* DecisionsSaga() {
  yield takeEvery(GET_DECISIONS, fetchDecisions);
  yield takeEvery(ADD_NEW_DECISION, onAddNewDecision);
  yield takeEvery(UPDATE_DECISION, onUpdateDecision);
  yield takeEvery(DELETE_DECISION, onDeleteDecision);
  yield takeEvery(GET_DECISION_DELETED_VALUE, onGetDecisionDeletedValue);
  yield takeEvery(GET_DECISION_MAKERS, fetchDecisionMakers);
  yield takeEvery(GET_DECISION_STATUS, fetchDecisionStatus);

  // yield takeEvery(
  //   GET_DECISIONS_RULES_CANCELED_REASONS,
  //   fetchDecisionsRulesCanceledReasons
  // );
  // yield takeEvery(
  //   ADD_NEW_DECISIONS_RULES_CANCELED_REASON,
  //   onAddNewDecisionsRulesCanceledReason
  // );
  // yield takeEvery(
  //   UPDATE_DECISIONS_RULES_CANCELED_REASON,
  //   onUpdateDecisionsRulesCanceledReason
  // );
  // yield takeEvery(
  //   DELETE_DECISIONS_RULES_CANCELED_REASON,
  //   onDeleteDecisionsRulesCanceledReason
  // );
  // yield takeEvery(
  //   GET_DECISIONS_RULES_CANCELED_REASON_DELETED_VALUE,
  //   onGetDecisionsRulesCanceledReasonDeletedValue
  // );
  // yield takeEvery(GET_DECISIONS_RULES_REASONS, fetchDecisionsRulesReasons);
  // yield takeEvery(ADD_NEW_DECISIONS_RULES_REASON, onAddNewDecisionsRulesReason);
  // yield takeEvery(UPDATE_DECISIONS_RULES_REASON, onUpdateDecisionsRulesReason);
  // yield takeEvery(DELETE_DECISIONS_RULES_REASON, onDeleteDecisionsRulesReason);
  // yield takeEvery(
  //   GET_DECISIONS_RULES_REASON_DELETED_VALUE,
  //   onGetDecisionsRulesReasonDeletedValue
  // );
  // yield takeEvery(GET_DECISIONS_RULES_ROLES, fetchDecisionsRulesRoles);
  // yield takeEvery(ADD_NEW_DECISIONS_RULES_ROLES, onAddNewDecisionsRulesRole);
  // yield takeEvery(UPDATE_DECISIONS_RULES_ROLES, onUpdateDecisionsRulesRole);
  // yield takeEvery(DELETE_DECISIONS_RULES_ROLES, onDeleteDecisionsRulesRole);
  // yield takeEvery(
  //   GET_DECISIONS_RULES_ROLES_DELETED_VALUE,
  //   onGetDecisionsRulesRoleDeletedValue
  // );
}
export default DecisionsSaga;
