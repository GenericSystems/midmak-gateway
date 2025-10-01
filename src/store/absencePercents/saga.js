import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_ABSENCE_PERCENTS,
  GET_ABSENCE_PERCENT_DELETED_VALUE,
  ADD_NEW_ABSENCE_PERCENT,
  DELETE_ABSENCE_PERCENT,
  UPDATE_ABSENCE_PERCENT,
} from "./actionTypes";

import {
  getAbsencePercentsSuccess,
  getAbsencePercentsFail,
  getAbsencePercentDeletedValueSuccess,
  getAbsencePercentDeletedValueFail,
  addAbsencePercentFail,
  addAbsencePercentSuccess,
  updateAbsencePercentSuccess,
  updateAbsencePercentFail,
  deleteAbsencePercentSuccess,
  deleteAbsencePercentFail,
} from "./actions";

import {
  getCoursesOfferingSuccess,
  getCoursesOfferingFail,
} from "../classScheduling/actions";

// Include Both Helper File with needed methods
import {
  getAbsencePercents,
  getAbsencePercentDeletedValue,
  addNewAbsencePercent,
  updateAbsencePercent,
  deleteAbsencePercent,
  getCoursesOffering,
} from "../../helpers/fakebackend_helper";

function* fetchabsencePercents() {
  const get_settings_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Settings_AbsencePercent ",
  };
  try {
    const response = yield call(getAbsencePercents, get_settings_req);
    console.log("responseresponseEEEEEE", response);
    yield put(getAbsencePercentsSuccess(response));
  } catch (error) {
    yield put(getAbsencePercentsFail(error));
  }
  const get_courses_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_CourseOffering",
    fields: "Id,arTitle,Code,totalTrainingHours",
  };
  try {
    const response = yield call(getCoursesOffering, get_courses_req);
    console.log("responseresponse", response);
    yield put(getCoursesOfferingSuccess(response));
  } catch (error) {
    yield put(getCoursesOfferingFail(error));
  }
}

function* onGetabsencePercentDeletedValue() {
  try {
    const response = yield call(getAbsencePercentDeletedValue);
    yield put(getAbsencePercentDeletedValueSuccess(response));
  } catch (error) {
    yield put(getAbsencePercentDeletedValueFail(error));
  }
}

function* onAddNewAbsencePercent({ payload, absencePercent }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_AbsencePercent";
  try {
    const response = yield call(addNewAbsencePercent, payload);
    console.log("payload", payload);
    console.log("response", response);
    yield put(addAbsencePercentSuccess(response[0]));
  } catch (error) {
    yield put(addAbsencePercentFail(error));
  }
}

function* onUpdateabsencePercent({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_AbsencePercent";
  try {
    const respupdate = yield call(updateAbsencePercent, payload);
    console.log("999999999999999", respupdate);
    yield put(updateAbsencePercentSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateAbsencePercentFail(error));
  }
}

function* onDeleteabsencePercent({ payload, absencePercent }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_AbsencePercent";
  try {
    const respdelete = yield call(deleteAbsencePercent, payload);
    yield put(deleteAbsencePercentSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteAbsencePercentFail(error));
  }
}

function* absencePercentsSaga() {
  yield takeEvery(GET_ABSENCE_PERCENTS, fetchabsencePercents);
  yield takeEvery(
    GET_ABSENCE_PERCENT_DELETED_VALUE,
    onGetabsencePercentDeletedValue
  );
  yield takeEvery(ADD_NEW_ABSENCE_PERCENT, onAddNewAbsencePercent);
  yield takeEvery(UPDATE_ABSENCE_PERCENT, onUpdateabsencePercent);
  yield takeEvery(DELETE_ABSENCE_PERCENT, onDeleteabsencePercent);
}

export default absencePercentsSaga;
