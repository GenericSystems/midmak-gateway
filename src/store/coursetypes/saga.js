import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_COURSETYPES,
  GET_COURSETYPE_DELETED_VALUE,
  ADD_NEW_COURSETYPE,
  DELETE_COURSETYPE,
  UPDATE_COURSETYPE,
} from "./actionTypes";

import {
  getCourseTypesSuccess,
  getCourseTypesFail,
  getCourseTypeDeletedValueSuccess,
  getCourseTypeDeletedValueFail,
  addCourseTypeFail,
  addCourseTypeSuccess,
  updateCourseTypeSuccess,
  updateCourseTypeFail,
  deleteCourseTypeSuccess,
  deleteCourseTypeFail,
} from "./actions";

// Include Both Helper File with needed methods
import {
  getCourseTypes,
  getCourseTypeDeletedValue,
  addNewCourseType,
  updateCourseType,
  deleteCourseType,
} from "../../helpers/fakebackend_helper";

function* fetchCourseTypes() {
  const get_settings_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_courseTypes",
  };
  try {
    const response = yield call(getCourseTypes, get_settings_req);
    yield put(getCourseTypesSuccess(response));
  } catch (error) {
    yield put(getCourseTypesFail(error));
  }
}

function* fetchCourseTypeDeletedValue() {
  try {
    const response = yield call(getCourseTypeDeletedValue);
    yield put(getCourseTypeDeletedValueSuccess(response));
  } catch (error) {
    yield put(getCourseTypeDeletedValueFail(error));
  }
}

function* onAddNewCourseType({ payload, courseType }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_courseTypes";
  try {
    const response = yield call(addNewCourseType, payload);
    yield put(addCourseTypeSuccess(response[0]));
  } catch (error) {
    yield put(addCourseTypeFail(error));
  }
}

function* onUpdateCourseType({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_courseTypes";
  try {
    const respupdate = yield call(updateCourseType, payload);
    yield put(updateCourseTypeSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateCourseTypeFail(error));
  }
}

function* onDeleteCourseType({ payload, courseType }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_courseTypes";
  try {
    const respdelete = yield call(deleteCourseType, payload);
    yield put(deleteCourseTypeSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteCourseTypeFail(error));
  }
}

function* courseTypesSaga() {
  yield takeEvery(GET_COURSETYPES, fetchCourseTypes);
  yield takeEvery(GET_COURSETYPE_DELETED_VALUE, fetchCourseTypeDeletedValue);
  yield takeEvery(ADD_NEW_COURSETYPE, onAddNewCourseType);
  yield takeEvery(UPDATE_COURSETYPE, onUpdateCourseType);
  yield takeEvery(DELETE_COURSETYPE, onDeleteCourseType);
}

export default courseTypesSaga;
