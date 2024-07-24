import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_COURSE_CONTENTS,
  ADD_NEW_COURSE_CONTENT,
  DELETE_COURSE_CONTENT,
  UPDATE_COURSE_CONTENT,
  GET_COURSE_CONTENT_DELETED_VALUE,
} from "./actionTypes";

import {
  getCourseContentsSuccess,
  getCourseContentsFail,
  addCourseContentFail,
  addCourseContentSuccess,
  updateCourseContentSuccess,
  updateCourseContentFail,
  deleteCourseContentSuccess,
  deleteCourseContentFail,
  getCourseContentDeletedValueSuccess,
  getCourseContentDeletedValueFail,
} from "./actions";

// Include Both Helper File with needed methods
import {
  getCourseContents,
  addNewCourseContent,
  updateCourseContent,
  deleteCourseContent,
  getCourseContentDeletedValue,
} from "../../helpers/fakebackend_helper";

function* fetchCourseContents() {
  const get_settings_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_CourseContents",
  };
  try {
    const response = yield call(getCourseContents, get_settings_req);
    yield put(getCourseContentsSuccess(response));
  } catch (error) {
    yield put(getCourseContentsFail(error));
  }
}


function* onAddNewCourseContent({ payload, courseContent }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_CourseContents";
  try {
    const response = yield call(addNewCourseContent, payload);
    yield put(addCourseContentSuccess(response[0]));
  } catch (error) {
    yield put(addCourseContentFail(error));
  }
}

function* onUpdateCourseContent({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_CourseContents";
  try {
    const respupdate = yield call(updateCourseContent, payload);
    yield put(updateCourseContentSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateCourseContentFail(error));
  }
}

function* onDeleteCourseContent({ payload, courseContent }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_CourseContents";
  try {
    const respdelete = yield call(deleteCourseContent, payload);
    yield put(deleteCourseContentSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteCourseContentFail(error));
  }
}

function* onGetCourseContentDeletedValue() {
  try {
    const response = yield call(getCourseContentDeletedValue)
    yield put(getCourseContentDeletedValueSuccess(response))
  } catch (error) {
    yield put(getCourseContentDeletedValueFail(error))
  }
  
}

function* courseContentsSaga() {
  yield takeEvery(GET_COURSE_CONTENTS, fetchCourseContents);
  yield takeEvery(ADD_NEW_COURSE_CONTENT, onAddNewCourseContent);
  yield takeEvery(UPDATE_COURSE_CONTENT, onUpdateCourseContent);
  yield takeEvery(DELETE_COURSE_CONTENT, onDeleteCourseContent);
  yield takeEvery(GET_COURSE_CONTENT_DELETED_VALUE, onGetCourseContentDeletedValue);
}

export default courseContentsSaga;
