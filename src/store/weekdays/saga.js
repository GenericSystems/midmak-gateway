import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_WEEKDAYS,
  GET_WEEKDAY_PROFILE,
  ADD_NEW_WEEKDAY,
  DELETE_WEEKDAY,
  UPDATE_WEEKDAY,
} from "./actionTypes";

import {
  getWeekDaysSuccess,
  getWeekDaysFail,
  getWeekDayProfileSuccess,
  getWeekDayProfileFail,
  addWeekDayFail,
  addWeekDaySuccess,
  updateWeekDaySuccess,
  updateWeekDayFail,
  deleteWeekDaySuccess,
  deleteWeekDayFail,
} from "./actions";

// Include Both Helper File with needed methods
import {
  getWeekDays,
  getWeekDayProfile,
  addNewWeekDay,
  updateWeekDay,
  deleteWeekDay,
} from "../../helpers/fakebackend_helper";

function* fetchWeekDays() {
  const get_weekDays_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_WeekDays",
  };
  try {
    const response = yield call(getWeekDays, get_weekDays_req);
    yield put(getWeekDaysSuccess(response));
  } catch (error) {
    yield put(getWeekDaysFail(error));
  }
}

function* fetchWeekDayProfile() {
  try {
    const response = yield call(getWeekDayProfile);
    yield put(getWeekDayProfileSuccess(response));
  } catch (error) {
    yield put(getWeekDayProfileFail(error));
  }
}

function* onAddNewWeekDay({ payload, weekDay }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_WeekDays";

  try {
    const response = yield call(addNewWeekDay, payload);
    yield put(addWeekDaySuccess(response[0]));
  } catch (error) {
    yield put(addWeekDayFail(error));
  }
}

function* onUpdateWeekDay({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_WeekDays";

  try {
    const respupdate = yield call(updateWeekDay, payload);
    yield put(updateWeekDaySuccess(respupdate[0]));
  } catch (error) {
    yield put(updateWeekDayFail(error));
  }
}

function* onDeleteWeekDay({ payload, weekDay }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_WeekDays";

  try {
    const respdelete = yield call(deleteWeekDay, payload);
    yield put(deleteWeekDaySuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteWeekDayFail(error));
  }
}

function* weekDaysSaga() {
  yield takeEvery(GET_WEEKDAYS, fetchWeekDays);
  yield takeEvery(GET_WEEKDAY_PROFILE, fetchWeekDayProfile);
  yield takeEvery(ADD_NEW_WEEKDAY, onAddNewWeekDay);
  yield takeEvery(UPDATE_WEEKDAY, onUpdateWeekDay);
  yield takeEvery(DELETE_WEEKDAY, onDeleteWeekDay);
}

export default weekDaysSaga;
