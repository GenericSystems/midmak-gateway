import { call, put, takeEvery } from "redux-saga/effects";
import {
  GET_DECREES,
  ADD_NEW_DECREE,
  DELETE_DECREE,
  UPDATE_DECREE,
  GET_DECREE_DELETED_VALUE,
  GET_DECREES_RULES_REASONS,
  ADD_NEW_DECREES_RULES_REASON,
  UPDATE_DECREES_RULES_REASON,
  DELETE_DECREES_RULES_REASON,
  GET_DECREES_RULES_REASON_DELETED_VALUE,
  GET_DECREES_RULES_CANCELED_REASONS,
  ADD_NEW_DECREES_RULES_CANCELED_REASON,
  UPDATE_DECREES_RULES_CANCELED_REASON,
  DELETE_DECREES_RULES_CANCELED_REASON,
  GET_DECREES_RULES_CANCELED_REASON_DELETED_VALUE,
  GET_DECREES_RULES_ROLES,
  ADD_NEW_DECREES_RULES_ROLES,
  UPDATE_DECREES_RULES_ROLES,
  DELETE_DECREES_RULES_ROLES,
  GET_DECREES_RULES_ROLES_DELETED_VALUE,
} from "./actionTypes";
import {
  getDecreesSuccess,
  getDecreesFail,
  addDecreeFail,
  addDecreeSuccess,
  updateDecreeSuccess,
  updateDecreeFail,
  deleteDecreeSuccess,
  deleteDecreeFail,
  getDecreeDeletedValueSuccess,
  getDecreeDeletedValueFail,
  getDecreeCategoriesFail,
  getDecreeCategoriesSuccess,
  getDecreesRulesReasonsSuccess,
  getDecreesRulesReasonsFail,
  addDecreesRulesReasonSuccess,
  addDecreesRulesReasonFail,
  updateDecreesRulesReasonSuccess,
  updateDecreesRulesReasonFail,
  deleteDecreesRulesReasonSuccess,
  deleteDecreesRulesReasonFail,
  getDecreesRulesReasonDeletedValueSuccess,
  getDecreesRulesReasonDeletedValueFail,
  getDecreesRulesCanceledReasonsSuccess,
  getDecreesRulesCanceledReasonsFail,
  addDecreesRulesCanceledReasonSuccess,
  addDecreesRulesCanceledReasonFail,
  updateDecreesRulesCanceledReasonSuccess,
  updateDecreesRulesCanceledReasonFail,
  deleteDecreesRulesCanceledReasonSuccess,
  deleteDecreesRulesCanceledReasonFail,
  getDecreesRulesCanceledReasonDeletedValueSuccess,
  getDecreesRulesCanceledReasonDeletedValueFail,
  getDecreesRulesRolesSuccess,
  getDecreesRulesRolesFail,
  addDecreesRulesRoleSuccess,
  addDecreesRulesRoleFail,
  updateDecreesRulesRoleSuccess,
  updateDecreesRulesRoleFail,
  deleteDecreesRulesRoleSuccess,
  deleteDecreesRulesRoleFail,
  getDecreesRulesRoleDeletedValueSuccess,
  getDecreesRulesRoleDeletedValueFail,
} from "./actions";
import {
  getDecrees,
  addNewDecree,
  updateDecree,
  deleteDecree,
  getDecreeDeletedValue,
  getDecreeCategories,
  getDecreesRulesCanceledReasons,
  addNewDecreesRulesCanceledReason,
  updateDecreesRulesCanceledReason,
  deleteDecreesRulesCanceledReason,
  getDecreesRulesCanceledReasonDeletedValue,
  getDecreesRulesReasons,
  addNewDecreesRulesReason,
  updateDecreesRulesReason,
  deleteDecreesRulesReason,
  getDecreesRulesReasonDeletedValue,
  getDecreesRulesRoles,
  addNewDecreesRulesRole,
  updateDecreesRulesRole,
  deleteDecreesRulesRole,
  getDecreesRulesRoleDeletedValue,
} from "../../helpers/fakebackend_helper";

function* fetchDecrees() {
  const get_decision_categories_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_DecreesRulesCategory",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(
      getDecreeCategories,
      get_decision_categories_req
    );
    yield put(getDecreeCategoriesSuccess(response));
  } catch (error) {
    yield put(getDecreeCategoriesFail(error));
  }
  const get_decisions_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_settings_DecreesRules",
  };
  try {
    const response = yield call(getDecrees, get_decisions_req);
    response.map(resp => {
      resp["AcceptRoles"] = JSON.parse(resp["AcceptRoles"]);
      resp["RefuseRoles"] = JSON.parse(resp["RefuseRoles"]);
    });
    yield put(getDecreesSuccess(response));
  } catch (error) {
    yield put(getDecreesFail(error));
  }
}

function* onAddNewDecree({ payload, decision }) {
  delete payload["id"];
  console.log("payload in saga", payload);
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_DecreesRules";
  try {
    const response = yield call(addNewDecree, payload);
    yield put(addDecreeSuccess(response[0]));
  } catch (error) {
    yield put(addDecreeFail(error));
  }
}

function* onUpdateDecree({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_DecreesRules";
  try {
    const respupdate = yield call(updateDecree, payload);
    yield put(updateDecreeSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateDecreeFail(error));
  }
}
function* onDeleteDecree({ payload, Decree }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_DecreesRules";
  try {
    const respdelete = yield call(deleteDecree, payload);
    yield put(deleteDecreeSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteDecreeFail(error));
  }
}
function* onGetDecreeDeletedValue() {
  try {
    const response = yield call(getDecreeDeletedValue);
    yield put(getDecreeDeletedValueSuccess(response));
  } catch (error) {
    yield put(getDecreeDeletedValueFail(error));
  }
}
function* fetchDecreesRulesReasons(obj) {
  let decisionId = obj.payload;
  const get_decisions_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_DecreesRulesReasons",
    filter: `decisionsRulesId = ${decisionId}`,
  };
  try {
    const response = yield call(getDecreesRulesReasons, get_decisions_req);
    yield put(getDecreesRulesReasonsSuccess(response));
  } catch (error) {
    yield put(getDecreesRulesReasonsFail(error));
  }
}
function* onAddNewDecreesRulesReason({ payload, decision }) {
  delete payload["id"];

  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_DecreesRulesReasons";
  try {
    const response = yield call(addNewDecreesRulesReason, payload);
    yield put(addDecreesRulesReasonSuccess(response[0]));
  } catch (error) {
    yield put(addDecreesRulesReasonFail(error));
  }
}

function* onUpdateDecreesRulesReason({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_DecreesRulesReasons";
  try {
    const respupdate = yield call(updateDecreesRulesReason, payload);
    yield put(updateDecreesRulesReasonSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateDecreesRulesReasonFail(error));
  }
}
function* onDeleteDecreesRulesReason({ payload, DecreesRulesReason }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_DecreesRulesReasons";
  try {
    const respdelete = yield call(deleteDecreesRulesReason, payload);
    yield put(deleteDecreesRulesReasonSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteDecreesRulesReasonFail(error));
  }
}
function* onGetDecreesRulesReasonDeletedValue() {
  try {
    const response = yield call(getDecreesRulesReasonDeletedValue);
    yield put(getDecreesRulesReasonDeletedValueSuccess(response));
  } catch (error) {
    yield put(getDecreesRulesReasonDeletedValueFail(error));
  }
}
function* fetchDecreesRulesCanceledReasons(obj) {
  let decisionId = obj.payload;

  const get_decisions_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_DecreesRulesCanceledReasons",
    filter: `decisionsRulesId = ${decisionId}`,
  };
  try {
    const response = yield call(
      getDecreesRulesCanceledReasons,
      get_decisions_req
    );
    yield put(getDecreesRulesCanceledReasonsSuccess(response));
  } catch (error) {
    yield put(getDecreesRulesCanceledReasonsFail(error));
  }
}
function* onAddNewDecreesRulesCanceledReason({ payload, decision }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_DecreesRulesCanceledReasons";
  try {
    const response = yield call(addNewDecreesRulesCanceledReason, payload);
    yield put(addDecreesRulesCanceledReasonSuccess(response[0]));
  } catch (error) {
    yield put(addDecreesRulesCanceledReasonFail(error));
  }
}

function* onUpdateDecreesRulesCanceledReason({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_DecreesRulesCanceledReasons";
  try {
    const respupdate = yield call(updateDecreesRulesCanceledReason, payload);
    yield put(updateDecreesRulesCanceledReasonSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateDecreesRulesCanceledReasonFail(error));
  }
}
function* onDeleteDecreesRulesCanceledReason({
  payload,
  DecreesRulesCanceledReason,
}) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_DecreesRulesCanceledReasons";
  try {
    const respdelete = yield call(deleteDecreesRulesCanceledReason, payload);
    yield put(deleteDecreesRulesCanceledReasonSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteDecreesRulesCanceledReasonFail(error));
  }
}
function* onGetDecreesRulesCanceledReasonDeletedValue() {
  try {
    const response = yield call(getDecreesRulesCanceledReasonDeletedValue);
    yield put(getDecreesRulesCanceledReasonDeletedValueSuccess(response));
  } catch (error) {
    yield put(getDecreesRulesCanceledReasonDeletedValueFail(error));
  }
}
function* fetchDecreesRulesRoles(obj) {
  let decisionId = obj.payload;

  const get_decisions_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: decisionId.tablename,
    filter: `decisionsRulesId = ${decisionId.Id}`,
    fields: "Id,arTitle,decisionsRulesId,roleId",
  };

  try {
    const response = yield call(getDecreesRulesRoles, get_decisions_req);
    response.map(resp => {
      if (resp["multiArray"]) {
        resp["multiArray"] = JSON.parse(resp["multiArray"]);
      }
    });
    yield put(getDecreesRulesRolesSuccess(response));
  } catch (error) {
    yield put(getDecreesRulesRolesFail(error));
  }
}

function* onAddNewDecreesRulesRole({ payload, decision }) {
  delete payload["id"];

  payload["source"] = "db";
  payload["procedure"] = "SisApp_addMultiSelect";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["filter"] = `decisionsRulesId = ${payload.Id}`;
  payload["field"] = "roleId,decisionsRulesId";

  try {
    const response = yield call(addNewDecreesRulesRole, payload);
    yield put(addDecreesRulesRoleSuccess(response[0]));
  } catch (error) {
    yield put(addDecreesRulesRoleFail(error));
  }
}

function* onUpdateDecreesRulesRole({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_DecreesRulesRoles";
  try {
    const respupdate = yield call(updateDecreesRulesRole, payload);
    yield put(updateDecreesRulesRoleSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateDecreesRulesRoleFail(error));
  }
}
function* onDeleteDecreesRulesRole({ payload, DecreesRulesRole }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_DecreesRulesRoles";
  try {
    const respdelete = yield call(deleteDecreesRulesRole, payload);
    yield put(deleteDecreesRulesRoleSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteDecreesRulesRoleFail(error));
  }
}
function* onGetDecreesRulesRoleDeletedValue() {
  try {
    const response = yield call(getDecreesRulesRoleDeletedValue);
    yield put(getDecreesRulesRoleDeletedValueSuccess(response));
  } catch (error) {
    yield put(getDecreesRulesRoleDeletedValueFail(error));
  }
}
function* decisionsSaga() {
  yield takeEvery(GET_DECREES, fetchDecrees);
  yield takeEvery(ADD_NEW_DECREE, onAddNewDecree);
  yield takeEvery(UPDATE_DECREE, onUpdateDecree);
  yield takeEvery(DELETE_DECREE, onDeleteDecree);
  yield takeEvery(GET_DECREE_DELETED_VALUE, onGetDecreeDeletedValue);
  yield takeEvery(
    GET_DECREES_RULES_CANCELED_REASONS,
    fetchDecreesRulesCanceledReasons
  );
  yield takeEvery(
    ADD_NEW_DECREES_RULES_CANCELED_REASON,
    onAddNewDecreesRulesCanceledReason
  );
  yield takeEvery(
    UPDATE_DECREES_RULES_CANCELED_REASON,
    onUpdateDecreesRulesCanceledReason
  );
  yield takeEvery(
    DELETE_DECREES_RULES_CANCELED_REASON,
    onDeleteDecreesRulesCanceledReason
  );
  yield takeEvery(
    GET_DECREES_RULES_CANCELED_REASON_DELETED_VALUE,
    onGetDecreesRulesCanceledReasonDeletedValue
  );
  yield takeEvery(GET_DECREES_RULES_REASONS, fetchDecreesRulesReasons);
  yield takeEvery(ADD_NEW_DECREES_RULES_REASON, onAddNewDecreesRulesReason);
  yield takeEvery(UPDATE_DECREES_RULES_REASON, onUpdateDecreesRulesReason);
  yield takeEvery(DELETE_DECREES_RULES_REASON, onDeleteDecreesRulesReason);
  yield takeEvery(
    GET_DECREES_RULES_REASON_DELETED_VALUE,
    onGetDecreesRulesReasonDeletedValue
  );
  yield takeEvery(GET_DECREES_RULES_ROLES, fetchDecreesRulesRoles);
  yield takeEvery(ADD_NEW_DECREES_RULES_ROLES, onAddNewDecreesRulesRole);
  yield takeEvery(UPDATE_DECREES_RULES_ROLES, onUpdateDecreesRulesRole);
  yield takeEvery(DELETE_DECREES_RULES_ROLES, onDeleteDecreesRulesRole);
  yield takeEvery(
    GET_DECREES_RULES_ROLES_DELETED_VALUE,
    onGetDecreesRulesRoleDeletedValue
  );
}
export default decisionsSaga;
