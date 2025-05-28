import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_EMPLOYMENT_CASES,
  GET_EMPLOYMENT_CASE_DELETED_VALUE,
  ADD_NEW_EMPLOYMENT_CASE,
  DELETE_EMPLOYMENT_CASE,
  UPDATE_EMPLOYMENT_CASE,
} from "./actionTypes";

import {
  getEmploymentCasesSuccess,
  getEmploymentCasesFail,
  getEmploymentCaseDeletedValueSuccess,
  getEmploymentCaseDeletedValueFail,
  addEmploymentCaseFail,
  addEmploymentCaseSuccess,
  updateEmploymentCaseSuccess,
  updateEmploymentCaseFail,
  deleteEmploymentCaseSuccess,
  deleteEmploymentCaseFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getEmploymentCases,
  getEmploymentCaseDeletedValue,
  addNewEmploymentCase,
  updateEmploymentCase,
  deleteEmploymentCase,
} from "../../../helpers/fakebackend_helper";

function* fetchEmploymentCases() {
  const get_employmentCase_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_EmploymentCases",
  };
  try {
    const response = yield call(getEmploymentCases, get_employmentCase_req);
    console.log("fffffffffffffff", response);
    yield put(getEmploymentCasesSuccess(response));
  } catch (error) {
    yield put(getEmploymentCasesFail(error));
  }
}

function* getEmploymentCaseProfile() {
  try {
    const response = yield call(getEmploymentCaseDeletedValue);
    yield put(getEmploymentCaseDeletedValueSuccess(response));
  } catch (error) {
    yield put(getEmploymentCaseDeletedValueFail(error));
  }
}

function* onAddNewEmploymentCase({ payload }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_EmploymentCases";

  try {
    const response = yield call(addNewEmploymentCase, payload);
    yield put(addEmploymentCaseSuccess(response[0]));
  } catch (error) {
    yield put(addEmploymentCaseFail(error));
  }
}

function* onUpdateEmploymentCase({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_EmploymentCases";

  try {
    const response = yield call(updateEmploymentCase, payload);
    yield put(updateEmploymentCaseSuccess(response[0]));
  } catch (error) {
    yield put(updateEmploymentCaseFail(error));
  }
}

function* onDeleteEmploymentCase({ payload, employmentCase }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_EmploymentCases";

  try {
    const response = yield call(deleteEmploymentCase, payload);
    yield put(deleteEmploymentCaseSuccess(response[0]));
  } catch (error) {
    yield put(deleteEmploymentCaseFail(error));
  }
}

function* employmentCasesSaga() {
  yield takeEvery(GET_EMPLOYMENT_CASES, fetchEmploymentCases);
  yield takeEvery(GET_EMPLOYMENT_CASE_DELETED_VALUE, getEmploymentCaseProfile);
  yield takeEvery(ADD_NEW_EMPLOYMENT_CASE, onAddNewEmploymentCase);
  yield takeEvery(UPDATE_EMPLOYMENT_CASE, onUpdateEmploymentCase);
  yield takeEvery(DELETE_EMPLOYMENT_CASE, onDeleteEmploymentCase);
}

export default employmentCasesSaga;
