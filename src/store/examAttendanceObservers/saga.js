import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_EXAM_ATTENDANCE_OBSERVERS,
  ADD_NEW_EXAM_ATTENDANCE_OBSERVER,
  DELETE_EXAM_ATTENDANCE_OBSERVER,
  UPDATE_EXAM_ATTENDANCE_OBSERVER,
  GET_EXAM_ATTENDANCE_OBSERVER_DELETED_VALUE,
} from "./actionTypes";

import { GET_USER_TYPES_OPT } from "../user-types/actionTypes";

import {
  getExamAttendanceObserversSuccess,
  getExamAttendanceObserversFail,
  addExamAttendanceObserverFail,
  addExamAttendanceObserverSuccess,
  updateExamAttendanceObserverSuccess,
  updateExamAttendanceObserverFail,
  deleteExamAttendanceObserverSuccess,
  deleteExamAttendanceObserverFail,
  getExamAttendanceObserverDeletedValueSuccess,
  getExamAttendanceObserverDeletedValueFail,
} from "./actions";

import {
  getAttendStatusSuccess,
  getAttendStatusFail,
} from "../examAttendance/actions";

import {
  getUserTypesOptFail,
  getUserTypesOptSuccess,
} from "../user-types/actions";

import { getSectorsFail, getSectorsSuccess } from "../sectors/actions";

// import {
//   getFilteredExamAttendanceObserverGradesFail,
//   getFilteredExamAttendanceObserverGradesSuccess,
// } from "../certificateGrades/actions";

import {
  getExamAttendanceObserverTypesFail,
  getExamAttendanceObserverTypesSuccess,
} from "../certificateTypes/actions";

import {
  getFilteredMembersFail,
  getFilteredMembersSuccess,
} from "../trainingMembers/actions";

import { getYearsFail, getYearsSuccess } from "../years/actions";

import {
  getExamAttendanceObservers,
  addNewExamAttendanceObserver,
  updateExamAttendanceObserver,
  deleteExamAttendanceObserver,
  getUserTypesOpt,
  getSectors,
  getFilteredGrades,
  getExamAttendanceObserverDeletedValue,
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

function* fetchExamsAttendanceObserver() {
  // console.log("in saga obj", obj);
  // const userTypeId = obj.payload.userTypeId;

  const get_ExamsAttendanceObserver_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_Certificates",
    // filter: `userTypeId = ${userTypeId}`,
  };
  try {
    const response = yield call(
      getExamAttendanceObservers,
      get_ExamsAttendanceObserver_req
    );
    /* response.map(resp => {
      resp["sector"] = JSON.parse(resp["sector"]);
    }); */
    yield put(getExamAttendanceObserversSuccess(response));
  } catch (error) {
    yield put(getExamAttendanceObserversFail(error));
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

  //   yield put(getFilteredExamAttendanceObserverGradesSuccess(response));
  // } catch (error) {
  //   yield put(getFilteredExamAttendanceObserverGradesFail(error));
  // }
}

function* onAddNewExamAttendanceObserver({ payload }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_ExamsAttendanceObserver";
  payload["queryname"] = "_Common_ExamsAttendanceObserver";

  try {
    const response = yield call(addNewExamAttendanceObserver, payload);
    yield put(addExamAttendanceObserverSuccess(response[0]));
  } catch (error) {
    yield put(addExamAttendanceObserverFail(error));
  }
}

function* onUpdateExamAttendanceObserver({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_ExamsAttendanceObserver";
  payload["queryname"] = "_Common_ExamsAttendanceObserver";

  try {
    const respupdate = yield call(updateExamAttendanceObserver, payload);
    yield put(updateExamAttendanceObserverSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateExamAttendanceObserverFail(error));
  }
}

function* onDeleteExamAttendanceObserver({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_ExamsAttendanceObserver";
  try {
    const respdelete = yield call(deleteExamAttendanceObserver, payload);
    yield put(deleteExamAttendanceObserverSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteExamAttendanceObserverFail(error));
  }
}

function* onGetExamAttendanceObserverDeletedValue() {
  try {
    const response = yield call(getExamAttendanceObserverDeletedValue);
    yield put(getExamAttendanceObserverDeletedValueSuccess(response));
  } catch (error) {
    yield put(getExamAttendanceObserverDeletedValueFail(error));
  }
}

function* ExamAttendanceObserverSaga() {
  yield takeEvery(GET_USER_TYPES_OPT, fetchUsers);
  yield takeEvery(GET_EXAM_ATTENDANCE_OBSERVERS, fetchExamsAttendanceObserver);
  yield takeEvery(
    ADD_NEW_EXAM_ATTENDANCE_OBSERVER,
    onAddNewExamAttendanceObserver
  );
  yield takeEvery(
    UPDATE_EXAM_ATTENDANCE_OBSERVER,
    onUpdateExamAttendanceObserver
  );
  yield takeEvery(
    DELETE_EXAM_ATTENDANCE_OBSERVER,
    onDeleteExamAttendanceObserver
  );
  yield takeEvery(
    GET_EXAM_ATTENDANCE_OBSERVER_DELETED_VALUE,
    onGetExamAttendanceObserverDeletedValue
  );
}

export default ExamAttendanceObserverSaga;
