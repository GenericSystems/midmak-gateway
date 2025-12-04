import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_LECTURE_PERIODS,
  GET_LECTURE_PERIOD_PROFILE,
  ADD_NEW_LECTURE_PERIOD,
  DELETE_LECTURE_PERIOD,
  UPDATE_LECTURE_PERIOD,
} from "./actionTypes";

import {
  getLecturePeriodsSuccess,
  getLecturePeriodsFail,
  getLecturePeriodProfileSuccess,
  getLecturePeriodProfileFail,
  addLecturePeriodFail,
  addLecturePeriodSuccess,
  updateLecturePeriodSuccess,
  updateLecturePeriodFail,
  deleteLecturePeriodSuccess,
  deleteLecturePeriodFail,
} from "./actions";

// Include Both Helper File with needed methods
import {
  getLecturePeriods,
  getLecturePeriodProfile,
  addNewLecturePeriod,
  updateLecturePeriod,
  deleteLecturePeriod,
} from "../../helpers/fakebackend_helper";

function* fetchLecturePeriods() {
  const get_lecturePeriods_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_LecturePeriods",
  };
  try {
    const response = yield call(getLecturePeriods, get_lecturePeriods_req);
    yield put(getLecturePeriodsSuccess(response));
  } catch (error) {
    yield put(getLecturePeriodsFail(error));
  }
}

function* fetchLecturePeriodProfile() {
  try {
    const response = yield call(getLecturePeriodProfile);
    yield put(getLecturePeriodProfileSuccess(response));
  } catch (error) {
    yield put(getLecturePeriodProfileFail(error));
  }
}

function* onAddNewLecturePeriod({ payload, lecturePeriod }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "get_GenericPeriod";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_LecturePeriods";

  try {
    const response = yield call(getLecturePeriods, payload);
    yield put(getLecturePeriodsSuccess(response));
  } catch (error) {
    yield put(getLecturePeriodsFail(error));
  }
}

function* onUpdateLecturePeriod({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_LecturePeriods";

  try {
    const respupdate = yield call(updateLecturePeriod, payload);
    yield put(updateLecturePeriodSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateLecturePeriodFail(error));
  }
}

function* onDeleteLecturePeriod({ payload, lecturePeriod }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_LecturePeriods";

  try {
    const respdelete = yield call(deleteLecturePeriod, payload);
    yield put(deleteLecturePeriodSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteLecturePeriodFail(error));
  }
}

function* lecturePeriodsSaga() {
  yield takeEvery(GET_LECTURE_PERIODS, fetchLecturePeriods);
  yield takeEvery(GET_LECTURE_PERIOD_PROFILE, fetchLecturePeriodProfile);
  yield takeEvery(ADD_NEW_LECTURE_PERIOD, onAddNewLecturePeriod);
  yield takeEvery(UPDATE_LECTURE_PERIOD, onUpdateLecturePeriod);
  yield takeEvery(DELETE_LECTURE_PERIOD, onDeleteLecturePeriod);
}

export default lecturePeriodsSaga;
