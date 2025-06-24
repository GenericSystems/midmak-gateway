import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_DECISIONS_TYPES,
  GET_DECISION_TYPE_DELETED_VALUE,
  ADD_NEW_DECISION_TYPE,
  DELETE_DECISION_TYPE,
  UPDATE_DECISION_TYPE,
} from "./actionTypes";

import {
  getDecisionsTypesSuccess,
  getDecisionsTypesFail,
  getDecisionTypeDeletedValueSuccess,
  getDecisionTypeDeletedValueFail,
  addDecisionTypeFail,
  addDecisionTypeSuccess,
  updateDecisionTypeSuccess,
  updateDecisionTypeFail,
  deleteDecisionTypeSuccess,
  deleteDecisionTypeFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getDecisionsTypes,
  getDecisionTypeDeletedValue,
  addNewDecisionType,
  updateDecisionType,
  deleteDecisionType,
} from "../../../helpers/fakebackend_helper";

function* fetchDecisionsTypes() {
  const get_decisionType_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_ContractType",
  };
  try {
    const response = yield call(getDecisionsTypes, get_decisionType_req);
    console.log("fffffffffffffff", response);
    yield put(getDecisionsTypesSuccess(response));
  } catch (error) {
    yield put(getDecisionsTypesFail(error));
  }
}

function* getDecisionTypeProfile() {
  try {
    const response = yield call(getDecisionTypeDeletedValue);
    yield put(getDecisionTypeDeletedValueSuccess(response));
  } catch (error) {
    yield put(getDecisionTypeDeletedValueFail(error));
  }
}

function* onAddNewDecisionType({ payload }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_ContractType";

  try {
    const response = yield call(addNewDecisionType, payload);
    yield put(addDecisionTypeSuccess(response[0]));
  } catch (error) {
    yield put(addDecisionTypeFail(error));
  }
}

function* onUpdateDecisionType({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_ContractType";

  try {
    const response = yield call(updateDecisionType, payload);
    yield put(updateDecisionTypeSuccess(response[0]));
  } catch (error) {
    yield put(updateDecisionTypeFail(error));
  }
}

function* onDeleteDecisionType({ payload, decisionType }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_ContractType";

  try {
    const response = yield call(deleteDecisionType, payload);
    yield put(deleteDecisionTypeSuccess(response[0]));
  } catch (error) {
    yield put(deleteDecisionTypeFail(error));
  }
}

function* DecisionsTypesSaga() {
  yield takeEvery(GET_DECISIONS_TYPES, fetchDecisionsTypes);
  yield takeEvery(GET_DECISION_TYPE_DELETED_VALUE, getDecisionTypeProfile);
  yield takeEvery(ADD_NEW_DECISION_TYPE, onAddNewDecisionType);
  yield takeEvery(UPDATE_DECISION_TYPE, onUpdateDecisionType);
  yield takeEvery(DELETE_DECISION_TYPE, onDeleteDecisionType);
}

export default DecisionsTypesSaga;
