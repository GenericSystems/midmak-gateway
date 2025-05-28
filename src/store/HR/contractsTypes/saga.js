import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_CONTRACTS_TYPES,
  GET_CONTRACT_TYPE_DELETED_VALUE,
  ADD_NEW_CONTRACT_TYPE,
  DELETE_CONTRACT_TYPE,
  UPDATE_CONTRACT_TYPE,
} from "./actionTypes";

import {
  getContractsTypesSuccess,
  getContractsTypesFail,
  getContractTypeDeletedValueSuccess,
  getContractTypeDeletedValueFail,
  addContractTypeFail,
  addContractTypeSuccess,
  updateContractTypeSuccess,
  updateContractTypeFail,
  deleteContractTypeSuccess,
  deleteContractTypeFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getContractsTypes,
  getContractTypeDeletedValue,
  addNewContractType,
  updateContractType,
  deleteContractType,
} from "../../../helpers/fakebackend_helper";

function* fetchContractsTypes() {
  const get_contractType_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_ContractType",
  };
  try {
    const response = yield call(getContractsTypes, get_contractType_req);
    console.log("fffffffffffffff", response);
    yield put(getContractsTypesSuccess(response));
  } catch (error) {
    yield put(getContractsTypesFail(error));
  }
}

function* getContractTypeProfile() {
  try {
    const response = yield call(getContractTypeDeletedValue);
    yield put(getContractTypeDeletedValueSuccess(response));
  } catch (error) {
    yield put(getContractTypeDeletedValueFail(error));
  }
}

function* onAddNewContractType({ payload }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_ContractType";

  try {
    const response = yield call(addNewContractType, payload);
    yield put(addContractTypeSuccess(response[0]));
  } catch (error) {
    yield put(addContractTypeFail(error));
  }
}

function* onUpdateContractType({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_ContractType";

  try {
    const response = yield call(updateContractType, payload);
    yield put(updateContractTypeSuccess(response[0]));
  } catch (error) {
    yield put(updateContractTypeFail(error));
  }
}

function* onDeleteContractType({ payload, contractType }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_ContractType";

  try {
    const response = yield call(deleteContractType, payload);
    yield put(deleteContractTypeSuccess(response[0]));
  } catch (error) {
    yield put(deleteContractTypeFail(error));
  }
}

function* ContractsTypesSaga() {
  yield takeEvery(GET_CONTRACTS_TYPES, fetchContractsTypes);
  yield takeEvery(GET_CONTRACT_TYPE_DELETED_VALUE, getContractTypeProfile);
  yield takeEvery(ADD_NEW_CONTRACT_TYPE, onAddNewContractType);
  yield takeEvery(UPDATE_CONTRACT_TYPE, onUpdateContractType);
  yield takeEvery(DELETE_CONTRACT_TYPE, onDeleteContractType);
}

export default ContractsTypesSaga;
