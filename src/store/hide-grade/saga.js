import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_HIDDEN_GRADES,
  GET_HIDDEN_GRADE_DELETED_VALUE,
  ADD_NEW_HIDDEN_GRADE,
  DELETE_HIDDEN_GRADE,
  UPDATE_HIDDEN_GRADE,
} from "./actionTypes";

import {
  getHiddenGradesSuccess,
  getHiddenGradesFail,
  getHiddenGradeDeletedValueSuccess,
  getHiddenGradeDeletedValueFail,
  addHiddenGradeFail,
  addHiddenGradeSuccess,
  updateHiddenGradeSuccess,
  updateHiddenGradeFail,
  deleteHiddenGradeSuccess,
  deleteHiddenGradeFail,
} from "./actions";

import {
  getCoursesOfferingSuccess,
  getCoursesOfferingFail,
} from "../classScheduling/actions";

// Include Both Helper File with needed methods
import {
  getHiddenGrades,
  getHiddenGradeDeletedValue,
  // addNewhiddenGrade,
  updateHiddenGrade,
  deleteHiddenGrade,
  getCoursesOffering,
} from "../../helpers/fakebackend_helper";

function* fetchhiddenGrades() {
  const get_settings_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_HiddenGrade",
  };
  try {
    const response = yield call(getHiddenGrades, get_settings_req);
    console.log("responseresponseEEEEEE", response);
    yield put(getHiddenGradesSuccess(response));
  } catch (error) {
    yield put(getHiddenGradesFail(error));
  }
  const get_courses_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_CourseOffering",
    // fields:"Id,arTitle",

    filter:`isOffered = 1`,
  };
  try {
    const response = yield call(getCoursesOffering, get_courses_req);
    console.log("responseresponse", response);
    yield put(getCoursesOfferingSuccess(response));
  } catch (error) {
    yield put(getCoursesOfferingFail(error));
  }
}

function* onGethiddenGradeDeletedValue() {
  try {
    const response = yield call(getHiddenGradeDeletedValue);
    yield put(getHiddenGradeDeletedValueSuccess(response));
  } catch (error) {
    yield put(getHiddenGradeDeletedValueFail(error));
  }
}

function* onAddNewhiddenGrade({ payload, hiddenGrade }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_RegDocType";
  try {
    const response = yield call(addNewhiddenGrade, payload);
    yield put(addHiddenGradeSuccess(response[0]));
  } catch (error) {
    yield put(addHiddenGradeFail(error));
  }
}

function* onUpdatehiddenGrade({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_RegDocType";
  try {
    const respupdate = yield call(updateHiddenGrade, payload);
    yield put(updateHiddenGradeSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateHiddenGradeFail(error));
  }
}

function* onDeletehiddenGrade({ payload, hiddenGrade }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_RegDocType";
  try {
    const respdelete = yield call(deletehiddenGrade, payload);
    yield put(deletehiddenGradeSuccess(respdelete[0]));
  } catch (error) {
    yield put(deletehiddenGradeFail(error));
  }
}

function* hiddenGradesSaga() {
  yield takeEvery(GET_HIDDEN_GRADES, fetchhiddenGrades);
  yield takeEvery(GET_HIDDEN_GRADE_DELETED_VALUE, onGethiddenGradeDeletedValue);
  yield takeEvery(ADD_NEW_HIDDEN_GRADE, onAddNewhiddenGrade);
  yield takeEvery(UPDATE_HIDDEN_GRADE, onUpdatehiddenGrade);
  yield takeEvery(DELETE_HIDDEN_GRADE, onDeletehiddenGrade);
}

export default hiddenGradesSaga;
