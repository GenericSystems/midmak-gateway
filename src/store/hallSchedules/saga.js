import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_HALL_SCHEDULES,
  ADD_NEW_HALL_SCHEDULE,
  DELETE_HALL_SCHEDULE,
  UPDATE_HALL_SCHEDULE,
  GET_HALL_SCHEDULE_DELETED_VALUE,
} from "./actionTypes";

import { GET_USER_TYPES_OPT } from "../user-types/actionTypes";

import {
  getHallSchedulesSuccess,
  getHallSchedulesFail,
  addHallScheduleFail,
  addHallScheduleSuccess,
  updateHallScheduleSuccess,
  updateHallScheduleFail,
  deleteHallScheduleSuccess,
  deleteHallScheduleFail,
  getHallScheduleDeletedValueSuccess,
  getHallScheduleDeletedValueFail,
} from "./actions";

import {
  getUserTypesOptFail,
  getUserTypesOptSuccess,
} from "../user-types/actions";

import { getSectorsFail, getSectorsSuccess } from "../sectors/actions";

// import {
//   getFilteredHallScheduleGradesFail,
//   getFilteredHallScheduleGradesSuccess,
// } from "../certificateGrades/actions";

import {
  getHallScheduleTypesFail,
  getHallScheduleTypesSuccess,
} from "../certificateTypes/actions";

import {
  getFilteredMembersFail,
  getFilteredMembersSuccess,
} from "../trainingMembers/actions";

import { getYearsFail, getYearsSuccess } from "../years/actions";

import {
  getHallSchedules,
  addNewHallSchedule,
  updateHallSchedule,
  deleteHallSchedule,
  getUserTypesOpt,
  getSectors,
  getFilteredGrades,
  getHallScheduleDeletedValue,
  getYears,
  getFilteredMembers,
} from "../../helpers/fakebackend_helper";

function* fetchUsers() {
  //user types
  const get_userTypes_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_UserType",
    fields: "Id,arTitle",
  };

  try {
    const response = yield call(getUserTypesOpt, get_userTypes_req);
    yield put(getUserTypesOptSuccess(response));
  } catch (error) {
    yield put(getUserTypesOptFail(error));
  }

  //Sectors
  const get_sectors_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Sector",
    fields: "Id,arTitle",
  };

  try {
    const response = yield call(getSectors, get_sectors_req);
    yield put(getSectorsSuccess(response));
  } catch (error) {
    yield put(getSectorsFail(error));
  }

  //years
  const get_years_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Years",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getYears, get_years_req);
    yield put(getYearsSuccess(response));
  } catch (error) {
    yield put(getYearsFail(error));
  }
}

function* fetchHallSchedules() {
  // console.log("in saga obj", obj);
  // const userTypeId = obj.payload.userTypeId;

  const get_HallSchedules_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_Certificates",
    // filter: `userTypeId = ${userTypeId}`,
  };
  try {
    const response = yield call(getHallSchedules, get_HallSchedules_req);
    /* response.map(resp => {
      resp["sector"] = JSON.parse(resp["sector"]);
    }); */
    yield put(getHallSchedulesSuccess(response));
  } catch (error) {
    yield put(getHallSchedulesFail(error));
  }

  // const get_AttendStatus_req = {
  //   source: "db",
  //   procedure: "Generic_getOptions",
  //   apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  //   tablename: "Settings_AttendStatus",
  //   fields: "Id,arTitle",
  // };
  // try {
  //   const response = yield call(getAttendStatus, get_AttendStatus_req);
  //   yield put(getAttendStatusSuccess(response));
  // } catch (error) {
  //   yield put(getAttendStatusFail(error));
  // }

  const get_trainer_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_TrainingMembers",
    fields: "Id,name",
    // filter: `userTypeId = ${userTypeId}`,
  };
  try {
    const response = yield call(getFilteredMembers, get_trainer_req);

    yield put(getFilteredMembersSuccess(response));
  } catch (error) {
    yield put(getFilteredMembersFail(error));
  }

  // // trainer grade
  // const get_TrainerGrades_req = {
  //   source: "db",
  //   procedure: "Generic_getOptions",
  //   apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  //   tablename: "Settings_Grades",
  //   fields: "Id,arTitle",
  //   filter: `userTypeId = ${userTypeId}`,
  // };
  // try {
  //   const response = yield call(getFilteredGrades, get_TrainerGrades_req);

  //   yield put(getFilteredHallScheduleGradesSuccess(response));
  // } catch (error) {
  //   yield put(getFilteredHallScheduleGradesFail(error));
  // }
}

function* onAddNewHallSchedule({ payload }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_HallSchedules";
  payload["queryname"] = "_Common_HallSchedules";

  try {
    const response = yield call(addNewHallSchedule, payload);
    yield put(addHallScheduleSuccess(response[0]));
  } catch (error) {
    yield put(addHallScheduleFail(error));
  }
}

function* onUpdateHallSchedule({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_HallSchedules";
  payload["queryname"] = "_Common_HallSchedules";

  try {
    const respupdate = yield call(updateHallSchedule, payload);
    yield put(updateHallScheduleSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateHallScheduleFail(error));
  }
}

function* onDeleteHallSchedule({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_HallSchedules";
  try {
    const respdelete = yield call(deleteHallSchedule, payload);
    yield put(deleteHallScheduleSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteHallScheduleFail(error));
  }
}

function* onGetHallScheduleDeletedValue() {
  try {
    const response = yield call(getHallScheduleDeletedValue);
    yield put(getHallScheduleDeletedValueSuccess(response));
  } catch (error) {
    yield put(getHallScheduleDeletedValueFail(error));
  }
}

function* HallSchedulesSaga() {
  yield takeEvery(GET_USER_TYPES_OPT, fetchUsers);
  yield takeEvery(GET_HALL_SCHEDULES, fetchHallSchedules);
  yield takeEvery(ADD_NEW_HALL_SCHEDULE, onAddNewHallSchedule);
  yield takeEvery(UPDATE_HALL_SCHEDULE, onUpdateHallSchedule);
  yield takeEvery(DELETE_HALL_SCHEDULE, onDeleteHallSchedule);
  yield takeEvery(
    GET_HALL_SCHEDULE_DELETED_VALUE,
    onGetHallScheduleDeletedValue
  );
}

export default HallSchedulesSaga;
