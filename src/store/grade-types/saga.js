import { call, put, takeEvery } from "redux-saga/effects";

import {
  GET_GRADE_TYPES,
  GET_GRADE_TYPE_DELETED_VALUE,
  ADD_NEW_GRADE_TYPE,
  UPDATE_GRADE_TYPE,
  DELETE_GRADE_TYPE,
} from "./actionTypes";

import {
  getGradeTypesSuccess,
  getGradeTypesFail,
  getGradeTypeDeletedValueSuccess,
  getGradeTypeDeletedValueFail,
  addGradeTypeSuccess,
  addGradeTypeFail,
  updateGradeTypeSuccess,
  updateGradeTypeFail,
  deleteGradeTypeSuccess,
  deleteGradeTypeFail,
} from "./actions";

// Fake backend helpers
import {
  getGradeTypes,
  getGradeTypeDeletedValue,
  addNewGradeType,
  updateGradeType,
  deleteGradeType,
} from "../../helpers/fakebackend_helper";

// Fetch Grade Types
function* fetchGradeTypes() {
  const request = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_CourseContents",
  };

  try {
    const response = yield call(getGradeTypes, request);
    yield put(getGradeTypesSuccess(response));
  } catch (error) {
    yield put(getGradeTypesFail(error));
  }
}

// Add New Grade Type
function* onAddNewGradeType({ payload }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_CourseContents";

  try {
    const response = yield call(addNewGradeType, payload);
    yield put(addGradeTypeSuccess(response[0]));
  } catch (error) {
    yield put(addGradeTypeFail(error));
  }
}

// Update Grade Type
function* onUpdateGradeType({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_CourseContents";

  try {
    const response = yield call(updateGradeType, payload);
    yield put(updateGradeTypeSuccess(response[0]));
  } catch (error) {
    yield put(updateGradeTypeFail(error));
  }
}

// Delete Grade Type
function* onDeleteGradeType({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_CourseContents";

  try {
    const response = yield call(deleteGradeType, payload);
    yield put(deleteGradeTypeSuccess(response[0]));
  } catch (error) {
    yield put(deleteGradeTypeFail(error));
  }
}

// Get Deleted Grade Type Value
function* onGetGradeTypeDeletedValue() {
  try {
    const response = yield call(getGradeTypeDeletedValue);
    yield put(getGradeTypeDeletedValueSuccess(response));
  } catch (error) {
    yield put(getGradeTypeDeletedValueFail(error));
  }
}

// Root saga
function* gradeTypesSaga() {
  yield takeEvery(GET_GRADE_TYPES, fetchGradeTypes);
  yield takeEvery(ADD_NEW_GRADE_TYPE, onAddNewGradeType);
  yield takeEvery(UPDATE_GRADE_TYPE, onUpdateGradeType);
  yield takeEvery(DELETE_GRADE_TYPE, onDeleteGradeType);
  yield takeEvery(GET_GRADE_TYPE_DELETED_VALUE, onGetGradeTypeDeletedValue);
}

export default gradeTypesSaga;
