import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_EXAMS_ATTENDANCE,
  ADD_NEW_EXAM_ATTENDANCE,
  DELETE_EXAM_ATTENDANCE,
  UPDATE_EXAM_ATTENDANCE,
  GET_EXAM_ATTENDANCE_DELETED_VALUE,
} from "./actionTypes";

import { GET_USER_TYPES_OPT } from "../user-types/actionTypes";

import {
  getExamsAttendanceSuccess,
  getExamsAttendanceFail,
  addExamAttendanceFail,
  addExamAttendanceSuccess,
  updateExamAttendanceSuccess,
  updateExamAttendanceFail,
  deleteExamAttendanceSuccess,
  deleteExamAttendanceFail,
  getExamAttendanceDeletedValueSuccess,
  getExamAttendanceDeletedValueFail,
  getAttendStatusSuccess,
  getAttendStatusFail,
} from "./actions";

import {
  getUserTypesOptFail,
  getUserTypesOptSuccess,
} from "../user-types/actions";

import { getSectorsFail, getSectorsSuccess } from "../sectors/actions";

// import {
//   getFilteredExamAttendanceGradesFail,
//   getFilteredExamAttendanceGradesSuccess,
// } from "../certificateGrades/actions";

import {
  getExamAttendanceTypesFail,
  getExamAttendanceTypesSuccess,
} from "../certificateTypes/actions";

import {
  getFilteredMembersFail,
  getFilteredMembersSuccess,
} from "../trainingMembers/actions";

import { getYearsFail, getYearsSuccess } from "../years/actions";

import {
  getExamsAttendance,
  addNewExamAttendance,
  updateExamAttendance,
  deleteExamAttendance,
  getUserTypesOpt,
  getSectors,
  getFilteredGrades,
  getExamAttendanceDeletedValue,
  getYears,
  getFilteredMembers,
  getAttendStatus,
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

function* fetchExamsAttendance(obj) {
  console.log("in saga obj", obj);
  const userTypeId = obj.payload.userTypeId;

  const get_ExamsAttendance_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_Certificates",
    filter: `userTypeId = ${userTypeId}`,
  };
  try {
    const response = yield call(getExamsAttendance, get_ExamsAttendance_req);
    /* response.map(resp => {
      resp["sector"] = JSON.parse(resp["sector"]);
    }); */
    console.log("responseresponse", response);
    yield put(getExamsAttendanceSuccess(response));
  } catch (error) {
    yield put(getExamsAttendanceFail(error));
  }

  const get_AttendStatus_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_AttendStatus",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getAttendStatus, get_AttendStatus_req);
    yield put(getAttendStatusSuccess(response));
  } catch (error) {
    yield put(getAttendStatusFail(error));
  }

  const get_trainer_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_TrainingMembers",
    fields: "Id,name",
    filter: `userTypeId = ${userTypeId}`,
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

  //   yield put(getFilteredExamAttendanceGradesSuccess(response));
  // } catch (error) {
  //   yield put(getFilteredExamAttendanceGradesFail(error));
  // }
}

function* onAddNewExamAttendance({ payload }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_ExamsAttendance";
  payload["queryname"] = "_Common_ExamsAttendance";

  try {
    const response = yield call(addNewExamAttendance, payload);
    yield put(addExamAttendanceSuccess(response[0]));
  } catch (error) {
    yield put(addExamAttendanceFail(error));
  }
}

function* onUpdateExamAttendance({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_ExamsAttendance";
  payload["queryname"] = "_Common_ExamsAttendance";

  try {
    const respupdate = yield call(updateExamAttendance, payload);
    yield put(updateExamAttendanceSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateExamAttendanceFail(error));
  }
}

function* onDeleteExamAttendance({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_ExamsAttendance";
  try {
    const respdelete = yield call(deleteExamAttendance, payload);
    yield put(deleteExamAttendanceSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteExamAttendanceFail(error));
  }
}

function* onGetExamAttendanceDeletedValue() {
  try {
    const response = yield call(getExamAttendanceDeletedValue);
    yield put(getExamAttendanceDeletedValueSuccess(response));
  } catch (error) {
    yield put(getExamAttendanceDeletedValueFail(error));
  }
}

function* ExamsAttendanceSaga() {
  yield takeEvery(GET_USER_TYPES_OPT, fetchUsers);
  yield takeEvery(GET_EXAMS_ATTENDANCE, fetchExamsAttendance);
  yield takeEvery(ADD_NEW_EXAM_ATTENDANCE, onAddNewExamAttendance);
  yield takeEvery(UPDATE_EXAM_ATTENDANCE, onUpdateExamAttendance);
  yield takeEvery(DELETE_EXAM_ATTENDANCE, onDeleteExamAttendance);
  yield takeEvery(
    GET_EXAM_ATTENDANCE_DELETED_VALUE,
    onGetExamAttendanceDeletedValue
  );
}

export default ExamsAttendanceSaga;
