import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_GRADES_VERSIONS,
  GET_GRADE_VERSION_DELETED_VALUE,
  ADD_NEW_GRADE_VERSION,
  DELETE_GRADE_VERSION,
  UPDATE_GRADE_VERSION,
} from "./actionTypes";

import {
  getGradesVersionsSuccess,
  getGradesVersionsFail,
  getGradeVersionDeletedValueSuccess,
  getGradeVersionDeletedValueFail,
  addGradeVersionFail,
  addGradeVersionSuccess,
  updateGradeVersionSuccess,
  updateGradeVersionFail,
  deleteGradeVersionSuccess,
  deleteGradeVersionFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getGradesVersions,
  getGradeVersionDeletedValue,
  addNewGradeVersion,
  updateGradeVersion,
  deleteGradeVersion,
} from "../../helpers/fakebackend_helper";

function* fetchGradesVersions() {
  console.log("4444444444444");
  const get_gradeVersion_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_GradeVersion",
  };
  try {
    const response = yield call(getGradesVersions, get_gradeVersion_req);
    console.log("fffffffffffggggggfsssffff", response);
    yield put(getGradesVersionsSuccess(response));
  } catch (error) {
    yield put(getGradesVersionsFail(error));
  }
}

function* getGradeVersionProfile() {
  try {
    const response = yield call(getGradeVersionDeletedValue);
    yield put(getGradeVersionDeletedValueSuccess(response));
  } catch (error) {
    yield put(getGradeVersionDeletedValueFail(error));
  }
}

function* onAddNewGradeVersion({ payload }) {
  console.log("payloadddddddd", payload);
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_GradeVersion";

  try {
    const response = yield call(addNewGradeVersion, payload);
    yield put(addGradeVersionSuccess(response[0]));
  } catch (error) {
    yield put(addGradeVersionFail(error));
  }
}

function* onUpdateGradeVersion({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_GradeVersion";

  try {
    const response = yield call(updateGradeVersion, payload);
    yield put(updateGradeVersionSuccess(response[0]));
  } catch (error) {
    yield put(updateGradeVersionFail(error));
  }
}

function* onDeleteGradeVersion({ payload, gradeVersion }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_GradeVersion";

  try {
    const response = yield call(deleteGradeVersion, payload);
    yield put(deleteGradeVersionSuccess(response[0]));
  } catch (error) {
    yield put(deleteGradeVersionFail(error));
  }
}

function* GradesVersionsSaga() {
  yield takeEvery(GET_GRADES_VERSIONS, fetchGradesVersions);
  yield takeEvery(GET_GRADE_VERSION_DELETED_VALUE, getGradeVersionProfile);
  yield takeEvery(ADD_NEW_GRADE_VERSION, onAddNewGradeVersion);
  yield takeEvery(UPDATE_GRADE_VERSION, onUpdateGradeVersion);
  yield takeEvery(DELETE_GRADE_VERSION, onDeleteGradeVersion);
}

export default GradesVersionsSaga;
