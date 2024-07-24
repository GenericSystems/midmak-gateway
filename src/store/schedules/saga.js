import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_SCHEDULES,
  GET_SCHEDULE_PROFILE,
  ADD_NEW_SCHEDULE,
  DELETE_SCHEDULE,
  UPDATE_SCHEDULE,
} from "./actionTypes";

import {
  getSchedulesSuccess,
  getSchedulesFail,
  getScheduleProfileSuccess,
  getScheduleProfileFail,
  addScheduleFail,
  addScheduleSuccess,
  updateScheduleSuccess,
  updateScheduleFail,
  deleteScheduleSuccess,
  deleteScheduleFail,
} from "./actions";

// Include Both Helper File with needed methods
import {
  getSchedules,
  getScheduleProfile,
  addNewSchedule,
  updateSchedule,
  deleteSchedule,
} from "../../helpers/fakebackend_helper";

function* fetchSchedules() {
  const get_schedules_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Schedule",
  };
  try {
    const response = yield call(getSchedules, get_schedules_req);
    yield put(getSchedulesSuccess(response[0]));
  } catch (error) {
    yield put(getSchedulesFail(error));
  }
}

function* fetchScheduleProfile() {
  try {
    const response = yield call(getScheduleProfile);
    yield put(getScheduleProfileSuccess(response[0]));
  } catch (error) {
    yield put(getScheduleProfileFail(error));
  }
}

function* onAddNewSchedule({ payload, schedule }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_Schedule";

  try {
    const response = yield call(addNewSchedule, payload);
    yield put(addScheduleSuccess(response[0]));
  } catch (error) {
    yield put(addScheduleFail(error));
  }
}

function* onUpdateSchedule({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_Schedule";

  try {
    const respupdate = yield call(updateSchedule, payload);
    yield put(updateScheduleSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateScheduleFail(error));
  }
}

function* onDeleteSchedule({ payload, schedule }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_Schedule";

  try {
    const respdelete = yield call(deleteSchedule, payload);
    yield put(deleteScheduleSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteScheduleFail(error));
  }
}

function* schedulesSaga() {
  yield takeEvery(GET_SCHEDULES, fetchSchedules);
  yield takeEvery(GET_SCHEDULE_PROFILE, fetchScheduleProfile);
  yield takeEvery(ADD_NEW_SCHEDULE, onAddNewSchedule);
  yield takeEvery(UPDATE_SCHEDULE, onUpdateSchedule);
  yield takeEvery(DELETE_SCHEDULE, onDeleteSchedule);
}

export default schedulesSaga;
