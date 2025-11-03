import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_EXAMS_ATTENDANCE,
  ADD_NEW_EXAM_ATTENDANCE,
  DELETE_EXAM_ATTENDANCE,
  UPDATE_EXAM_ATTENDANCE,
  GET_EXAM_ATTENDANCE_DELETED_VALUE,
  GET_EXAMS_NAMES,
} from "./actionTypes";

import {
  getHallsSuccess,
  getHallsFail,
} from "../academyBuildingStructure/actions";

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
  getExamsNamesSuccess,
  getExamsNamesFail,
  getExamsPeriodsSuccess,
  getExamsPeriodsFail,
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
  getEmployeesNamesSuccess,
  getEmployeesNamesFail,
} from "../HR/employees/actions";

import {
  getCoursesOfferingSuccess,
  getCoursesOfferingFail,
} from "../classScheduling/actions";

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
  getExamsNames,
  getExamsPeriods,
  getEmployeesNames,
  getHalls,
  getCoursesOffering,
} from "../../helpers/fakebackend_helper";

function* fetchExamName() {
  //user types
  const get_ExamsNames_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_DefineExamDates",
    fields: "Id,arTitle",
  };

  try {
    const response = yield call(getExamsNames, get_ExamsNames_req);
    yield put(getExamsNamesSuccess(response));
  } catch (error) {
    yield put(getExamsNamesFail(error));
  }
  const get_Examsper_req = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_DefineExamDates",
    fields: "Id,examPeriods",
  };

  try {
    const response = yield call(getExamsPeriods, get_Examsper_req);
    console.log("rrrrrrrrrrrrrre", response);
    yield put(getExamsPeriodsSuccess(response));
  } catch (error) {
    yield put(getExamsPeriodsFail(error));
  }

  const get_courses_req = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_CourseOffering",
    filter: `isOffered = 1`,
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getCoursesOffering, get_courses_req);
    yield put(getCoursesOfferingSuccess(response));
  } catch (error) {
    yield put(getCoursesOfferingFail(error));
  }
  const get_halls_req = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_Hall",
    fields: `Id,arTitle`,
  };
  try {
    const response = yield call(getHalls, get_halls_req);
    console.log("hallllllllllllllls", response);
    yield put(getHallsSuccess(response));
  } catch (error) {
    yield put(getHallsFail(error));
  }

  const get_observers_req = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_EmployeeOption",
    fields: "Id,fullName",
  };
  try {
    const response = yield call(getEmployeesNames, get_observers_req);
    console.log("employeeName", response);
    yield put(getEmployeesNamesSuccess(response));
  } catch (error) {
    yield put(getEmployeesNamesFail(error));
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
  // console.log("in saga obj", obj);
  // const userTypeId = obj.payload.userTypeId;

  // const get_ExamsAttendance_req = {
  //   source: "db",
  //   procedure: "SisApp_getData",
  //   apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  //   tablename: "_Common_Certificates",
  //   filter: `userTypeId = ${userTypeId}`,
  // };
  // try {
  //   const response = yield call(getExamsAttendance, get_ExamsAttendance_req);
  //   /* response.map(resp => {
  //     resp["sector"] = JSON.parse(resp["sector"]);
  //   }); */
  //   console.log("responseresponse", response);
  //   yield put(getExamsAttendanceSuccess(response));
  // } catch (error) {
  //   yield put(getExamsAttendanceFail(error));
  // }

  console.log("in saga obj", obj);

  const payload = obj.payload;

  let filter = Object.entries(payload)
    .map(([key, value]) => {
      if (typeof value === "number") {
        return `${key} = ${value}`;
      }
      return `${key} = '${value}'`;
    })
    .join(" and ");

  console.log(" 22222222222222:", filter);

  const get_ExamsAttendance_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_DefineExamDates",
    filter: filter || "1=1",
  };

  try {
    const response = yield call(getExamsAttendance, get_ExamsAttendance_req);
    console.log("response", response);
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
  yield takeEvery(GET_EXAMS_NAMES, fetchExamName);
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
