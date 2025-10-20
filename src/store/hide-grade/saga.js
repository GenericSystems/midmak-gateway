import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_HIDDEN_GRADES,
  GET_HIDDEN_GRADE_DELETED_VALUE,
  ADD_NEW_HIDDEN_GRADE,
  DELETE_HIDDEN_GRADE,
  UPDATE_HIDDEN_GRADE,
  GET_HIDE_REASONS,
} from "./actionTypes";

import {
  getHiddenGradesSuccess,
  getHiddenGradesFail,
  getHiddenGradeDeletedValueSuccess,
  getHiddenGradeDeletedValueFail,
  addHiddenGradeFail,
  addHiddenGradeSuccess,
  updateHiddenGradeSuccess,
  getHideReasonSuccess,
  getHideReasonFail,
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
  addNewHiddenGrade,
  updateHiddenGrade,
  deleteHiddenGrade,
  getCoursesOffering,
  getHideReasons,
} from "../../helpers/fakebackend_helper";

function* fetchhiddenGrades() {
  const get_settings_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_HiddenGrades ",
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
    fields: "Id,arTitle,Code",

    filter: `isOffered = 1`,
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

function* onAddNewHiddenGrade({ payload, hiddenGrade }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_HiddenGrades ";
  try {
    const response = yield call(addNewHiddenGrade, payload);
    console.log("payload", payload);
    console.log("response", response);
    yield put(addHiddenGradeSuccess(response[0]));
  } catch (error) {
    yield put(addHiddenGradeFail(error));
  }
}
function* onGetHideReasons() {
  const get_HideReasons_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_HidingReason",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getHideReasons, get_HideReasons_req);
    console.log(
      "responseresponseresponseresponseresponseresponseresponse",
      response
    );
    yield put(getHideReasonSuccess(response));
  } catch (error) {
    yield put(getHideReasonFail(error));
  }
}

function* onUpdatehiddenGrade({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_HiddenGrades";
  try {
    const respupdate = yield call(updateHiddenGrade, payload);
    console.log("999999999999999", respupdate);
    yield put(updateHiddenGradeSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateHiddenGradeFail(error));
  }
}

function* onDeletehiddenGrade({ payload, hiddenGrade }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_HiddenGrades";
  try {
    const respdelete = yield call(deleteHiddenGrade, payload);
    yield put(deleteHiddenGradeSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteHiddenGradeFail(error));
  }
}

function* hiddenGradesSaga() {
  yield takeEvery(GET_HIDDEN_GRADES, fetchhiddenGrades);
  yield takeEvery(GET_HIDDEN_GRADE_DELETED_VALUE, onGethiddenGradeDeletedValue);
  yield takeEvery(ADD_NEW_HIDDEN_GRADE, onAddNewHiddenGrade);
  yield takeEvery(UPDATE_HIDDEN_GRADE, onUpdatehiddenGrade);
  yield takeEvery(DELETE_HIDDEN_GRADE, onDeletehiddenGrade);
  yield takeEvery(GET_HIDE_REASONS, onGetHideReasons);
}

export default hiddenGradesSaga;
