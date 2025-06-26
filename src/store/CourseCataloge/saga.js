import { call, put, takeEvery } from "redux-saga/effects";

// Action Types
import {
  GET_COURSES_CATALOGS,
  ADD_NEW_COURSES_CATALOGS,
  UPDATE_COURSES_CATALOGS,
  DELETE_COURSES_CATALOGS,
  GET_COURSES_CATALOGS_DELETED_VALUE,
} from "./actionTypes";

// Actions
import {
  getCoursesCatalogsSuccess,
  getCoursesCatalogsFail,
  addCoursesCatalogSuccess,
  addCoursesCatalogFail,
  updateCoursesCatalogSuccess,
  updateCoursesCatalogFail,
  deleteCoursesCatalogSuccess,
  deleteCoursesCatalogFail,
  getCoursesCatalogDeletedValueSuccess,
  getCoursesCatalogDeletedValueFail,
} from "./actions";

import {
  getCoursesCatalogs,
  addNewCoursesCatalog,
  updateCoursesCatalog,
  deleteCoursesCatalog,
  getCoursesCatalogsDeletedValue,
} from "../../helpers/fakebackend_helper";

function* fetchCoursesCatalogs() {
  try {
    const payload = {};
    payload["source"] = "db";
    payload["procedure"] = "SisApp_getData";
    payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
    payload["tablename"] = "settings_CoursesCatalog";

    const response = yield call(getCoursesCatalogs, payload);
    yield put(getCoursesCatalogsSuccess(response));
  } catch (error) {
    yield put(getCoursesCatalogsFail(error));
  }
}

function* onAddNewCoursesCatalog({ payload }) {
  try {
    payload["source"] = "db";
    payload["procedure"] = "SisApp_addData";
    payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
    payload["tablename"] = "settings_CoursesCatalog";

    const response = yield call(addNewCoursesCatalog, payload);
    yield put(addCoursesCatalogSuccess(response[0]));
  } catch (error) {
    yield put(addCoursesCatalogFail(error));
  }
}

function* onUpdateCoursesCatalog({ payload }) {
  try {
    payload["source"] = "db";
    payload["procedure"] = "SisApp_updateData";
    payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
    payload["tablename"] = "settings_CoursesCatalog";

    const response = yield call(updateCoursesCatalog, payload);
    yield put(updateCoursesCatalogSuccess(response[0]));
  } catch (error) {
    yield put(updateCoursesCatalogFail(error));
  }
}

function* onDeleteCoursesCatalog({ payload }) {
  try {
    payload["source"] = "db";
    payload["procedure"] = "SisApp_removeData";
    payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
    payload["tablename"] = "settings_CoursesCatalog";

    const response = yield call(deleteCoursesCatalog, payload);
    yield put(deleteCoursesCatalogSuccess(response[0]));
  } catch (error) {
    yield put(deleteCoursesCatalogFail(error));
  }
}

function* onGetCoursesCatalogDeletedValue() {
  try {
    const response = yield call(getCoursesCatalogsDeletedValue);
    yield put(getCoursesCatalogDeletedValueSuccess(response));
  } catch (error) {
    yield put(getCoursesCatalogDeletedValueFail(error));
  }
}

function* coursesCatalogsSaga() {
  yield takeEvery(GET_COURSES_CATALOGS, fetchCoursesCatalogs);
  yield takeEvery(ADD_NEW_COURSES_CATALOGS, onAddNewCoursesCatalog);
  yield takeEvery(UPDATE_COURSES_CATALOGS, onUpdateCoursesCatalog);
  yield takeEvery(DELETE_COURSES_CATALOGS, onDeleteCoursesCatalog);
  yield takeEvery(GET_COURSES_CATALOGS_DELETED_VALUE, onGetCoursesCatalogDeletedValue);
}

export default coursesCatalogsSaga;
