import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_REGISTRATIONS,
  GET_STUDENT_REGISTER_INFO,
  ADD_NEW_REGISTRATION,
  DELETE_REGISTRATION,
  UPDATE_REGISTRATION,
  GET_ALL_COURSES_REGISTRATION,
  GET_AVAILABLE_COURSES,
  ADD_NEW_AVAILABLE_COURSE,
  GET_NON_ACTIVE_STD_CURRS,
  UPDATE_NON_ACTIVE_STD_CURR,
  DELETE_NON_ACTIVE_STD_CURR,
  GET_TEMP_STD_SCHEDULES,
  GET_ACHIEVED_COURSES,
  DELETE_ALL_NON_ACTIVE_STD_CURR,
  SAVE_ALL_NON_ACTIVE_STD_CURR,
} from "./actionTypes";

import {
  getRegistrationsSuccess,
  getRegistrationsFail,
  getStudentRegisterInfoSuccess,
  getStudentRegisterInfoFail,
  addRegistrationFail,
  addRegistrationSuccess,
  updateRegistrationSuccess,
  updateRegistrationFail,
  deleteRegistrationSuccess,
  deleteRegistrationFail,
  getAllRegistrationSuccess,
  getAllRegistrationFail,
  getAvailableCourseSuccess,
  getAvailableCourseFail,
  getNonActiveStdCurrSuccess,
  getNonActiveStdCurrFail,
  updateNonActiveStdCurrSuccess,
  updateNonActiveStdCurrFail,
  deleteNonActiveStdCurrSuccess,
  deleteNonActiveStdCurrFail,
  getTempStdSchedulesSuccess,
  getTempStdSchedulesFail,
  deleteAllNonActiveStdCurrSuccess,
  deleteAllNonActiveStdCurrFail,
  getAchievedCoursesFail,
  getAchievedCoursesSuccess,
  saveAllNonActiveStdCurrSuccess,
  saveAllNonActiveStdCurrFail,
} from "./actions";
import {
  getLecturePeriodsSuccess,
  getLecturePeriodsFail,
} from "../lecture-periods/actions";
import { getWeekDaysSuccess, getWeekDaysFail } from "../weekdays/actions";

import {
  getRegistrations,
  getAllRegistrations,
  addNewRegistration,
  updateRegistration,
  deleteRegistration,
  getWeekDays,
  getLecturePeriods,
  getAvailableCourses,
  addNewAvailableCourse,
  getNonActiveStdCurrs,
  updateNonActiveStdCurr,
  deleteNonActiveStdCurr,
  getTempStdSchedules,
  deleteAllNonActiveStdCurr,
  getAchievedCourses,
  getStudentRegisterInfo,
  saveAllNonActiveStdCurr,
} from "../../helpers/fakebackend_helper";
let theObj;
function* fetchAvailableCourses(obj) {
  theObj = obj;
  let userType = obj.payload.userType;
  let studentId = obj.payload.studentId;
  const get_availablecourse_req = {
    source: "db",
    procedure: "RegistrationCourses_getStudentOfferedCourses",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    StudentId: studentId,
  };
  try {
    const response = yield call(getAvailableCourses, get_availablecourse_req);
    yield put(getAvailableCourseSuccess(response));
  } catch (error) {
    yield put(getAvailableCourseFail(error));
  }
}

function* fetchTempStdSchedules(obj) {
  let studentId = obj.payload.studentId;
  const get_temp_schedule = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_TempStudentSchedule",
    // filter: `studentId =${studentId} and type = ''''${type}'''' and sectionLabId=${sectionLabId} `,
    filter: `studentId =${studentId}`,
  };
  try {
    const response = yield call(getTempStdSchedules, get_temp_schedule);

    yield put(getTempStdSchedulesSuccess(response));
  } catch (error) {
    yield put(getTempStdSchedulesFail(error));
  }
}
function* fetchAchievedCourses(obj) {
  let studentId = obj.payload.studentId;

  const get_achieved_courses = {
    source: "db",
    procedure: `Student_getPlanAchievements`,
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    StudentId: studentId,
  };
  try {
    const response = yield call(getAchievedCourses, get_achieved_courses);

    yield put(getAchievedCoursesSuccess(response));
  } catch (error) {
    yield put(getAchievedCoursesFail(error));
  }
}

function* fetchRegistrations() {
  const get_Registration_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_Employee",
  };
  try {
    const response = yield call(getRegistrations, get_Registration_req);
    console.log("responnnnnnnnnnnnnnnnnnse", response);
    yield put(getRegistrationsSuccess(response));
  } catch (error) {
    yield put(getRegistrationsFail(error));
  }

  // //lecture periods
  // const get_lecturePeriods_req = {
  //   source: "db",
  //   procedure: "SisApp_getData",
  //   apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  //   tablename: "settings_lecturePeriods",
  // };
  // try {
  //   const response = yield call(getLecturePeriods, get_lecturePeriods_req);
  //   yield put(getLecturePeriodsSuccess(response));
  // } catch (error) {
  //   yield put(getLecturePeriodsFail(error));
  // }
  // //get weekdays
  // const get_weekDays_req = {
  //   source: "db",
  //   procedure: "SisApp_getData",
  //   apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  //   tablename: "settings_weekDays",
  //   filter: "active=1",
  // };
  // try {
  //   const response = yield call(getWeekDays, get_weekDays_req);
  //   yield put(getWeekDaysSuccess(response));
  // } catch (error) {
  //   yield put(getWeekDaysFail(error));
  // }
}

function* fetchStudentRegisterInfo(obj) {
  let studentId = obj.payload;
  const get_student_info = {
    source: "db",
    procedure: "Student_getRegisterInfo",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    StudentId: studentId,
  };
  try {
    const response = yield call(getStudentRegisterInfo, get_student_info);
    yield put(getStudentRegisterInfoSuccess(response));
  } catch (error) {
    yield put(getStudentRegisterInfoFail(error));
  }
}

function* onAddNewRegistration({ payload, registration }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "get_GenericPeriod";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_coursesRegistration";

  try {
    const response = yield call(addNewRegistration, payload);
    yield put(addRegistrationSuccess(response[0]));
  } catch (error) {
    yield put(addRegistrationFail(error));
  }
}

function* onAddNewAvailableCourse({ payload }) {
  delete payload["id"];
  console.log("StudentId", payload);
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_StudentsCurriculalines";
  payload["queryname"] = "_Current_Common_StudentsCurriculalines";

  try {
    const response = yield call(addNewAvailableCourse, payload);
    yield put(addAvailableCourseSuccess(response[0]));
    yield fetchAvailableCourses(theObj);
    yield call(fetchNonActiveStdCurr, {
      payload: { active: 0, studentId: payload.StudentId },
    });
  } catch (error) {
    yield put(addAvailableCourseFail(error));
  }
}

function* onUpdateRegistration({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_coursesRegistration";

  try {
    const respupdate = yield call(updateRegistration, payload);
    yield put(updateRegistrationSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateRegistrationFail(error));
  }
}
function* onUpdateNonActiveStdCurr({ payload }) {
  payload.nonActiveStdCurr["source"] = "db";
  payload.nonActiveStdCurr["procedure"] = "SisApp_checkRegistrationConflic";
  payload.nonActiveStdCurr["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload.nonActiveStdCurr["tablename"] = "Common_StudentsCurriculalines";
  payload.nonActiveStdCurr["queryname"] =
    "_Current_Common_StudentsCurriculalines";
  console.log("payload update", payload);
  try {
    const respupdate = yield call(
      updateNonActiveStdCurr,
      payload.nonActiveStdCurr
    );
    yield put(updateNonActiveStdCurrSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateNonActiveStdCurrFail(error));
  }
  if (payload.active == 0) {
    yield call(fetchTempStdSchedules, {
      payload: { studentId: payload.nonActiveStdCurr.studentId },
    });
  }
  yield call(fetchNonActiveStdCurr, {
    payload: {
      active: payload.active,
      studentId: payload.nonActiveStdCurr.studentId,
    },
  });
}

function* onDeleteRegistration({ payload, registration }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_coursesRegistration";

  try {
    const respdelete = yield call(deleteRegistration, payload);
    yield put(deleteRegistrationSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteRegistrationFail(error));
  }
}
function* onDeleteNonActiveStdCurr({ payload, registrations }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_StudentsCurriculalines";

  try {
    const respdelete = yield call(deleteNonActiveStdCurr, payload);

    yield put(deleteNonActiveStdCurrSuccess(respdelete[0]));
    yield fetchAvailableCourses(theObj);
  } catch (error) {
    yield put(deleteNonActiveStdCurrFail(error));
  }
}
function* fetchNonActiveStdCurr(obj) {
  let studentId = obj.payload.studentId;
  let active = obj.payload.active;
  const get_availablecourse_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Current_Common_StudentsCurriculalines",
    filter: `active = ${active}  and studentId =${studentId} `,
  };
  try {
    const response = yield call(getNonActiveStdCurrs, get_availablecourse_req);
    response.map(resp => {
      resp["sections"] = JSON.parse(resp["sections"]);
    });
    response.map(resp => {
      resp["labs"] = JSON.parse(resp["labs"]);
    });
    yield put(getNonActiveStdCurrSuccess(response));
  } catch (error) {
    yield put(getNonActiveStdCurrFail(error));
  }
}
function* onDeleteAllNonActiveStdCurr({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_DeleteAllStudentRegistration";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_StudentsCurriculalines";
  payload["queryname"] = "_Current_Common_StudentsCurriculalines";
  payload["flag"] = payload.flag;
  payload[
    "filter"
  ] = `StudentId=${payload.studentId} and active=0 and YearSemesterId=${payload.semesterYearId}`;
  try {
    const respupdate = yield call(deleteAllNonActiveStdCurr, payload);
    respupdate.map(resp => {
      resp["sections"] = JSON.parse(resp["sections"]);
    });
    respupdate.map(resp => {
      resp["labs"] = JSON.parse(resp["labs"]);
    });
    yield put(deleteAllNonActiveStdCurrSuccess(respupdate));
  } catch (error) {
    yield put(deleteAllNonActiveStdCurrFail(error));
  }
  if (payload.flag === "reset") {
    yield call(fetchTempStdSchedules, {
      payload: { studentId: payload.studentId },
    });
    yield call(fetchNonActiveStdCurr, {
      payload: { active: 0, studentId: payload.studentId },
    });
  } else {
    yield fetchAvailableCourses(theObj);
  }
}
function* onSaveAllNonActiveStdCurr({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "Registration_SubmitRegistration";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_StudentsCurriculalines";
  payload["queryname"] = "_Current_Common_StudentsCurriculalines";
  try {
    const respupdate = yield call(saveAllNonActiveStdCurr, payload);
    respupdate.map(resp => {
      resp["sections"] = JSON.parse(resp["sections"]);
    });
    respupdate.map(resp => {
      resp["labs"] = JSON.parse(resp["labs"]);
    });
    yield put(saveAllNonActiveStdCurrSuccess(respupdate));
  } catch (error) {
    yield put(saveAllNonActiveStdCurrFail(error));
  }
  yield fetchAvailableCourses(theObj);
  yield call(fetchTempStdSchedules, {
    payload: { studentId: payload.studentId },
  });
  yield call(fetchNonActiveStdCurr, {
    payload: { active: 1, studentId: payload.studentId },
  });
}
function* RegistrationSaga() {
  yield takeEvery(GET_NON_ACTIVE_STD_CURRS, fetchNonActiveStdCurr);
  yield takeEvery(UPDATE_NON_ACTIVE_STD_CURR, onUpdateNonActiveStdCurr);
  yield takeEvery(DELETE_NON_ACTIVE_STD_CURR, onDeleteNonActiveStdCurr);
  yield takeEvery(GET_REGISTRATIONS, fetchRegistrations);
  yield takeEvery(GET_STUDENT_REGISTER_INFO, fetchStudentRegisterInfo);
  yield takeEvery(ADD_NEW_REGISTRATION, onAddNewRegistration);
  yield takeEvery(UPDATE_REGISTRATION, onUpdateRegistration);
  yield takeEvery(DELETE_REGISTRATION, onDeleteRegistration);
  yield takeEvery(ADD_NEW_AVAILABLE_COURSE, onAddNewAvailableCourse);
  yield takeEvery(GET_AVAILABLE_COURSES, fetchAvailableCourses);
  yield takeEvery(GET_TEMP_STD_SCHEDULES, fetchTempStdSchedules);
  yield takeEvery(GET_ACHIEVED_COURSES, fetchAchievedCourses);
  yield takeEvery(DELETE_ALL_NON_ACTIVE_STD_CURR, onDeleteAllNonActiveStdCurr);
  yield takeEvery(SAVE_ALL_NON_ACTIVE_STD_CURR, onSaveAllNonActiveStdCurr);
}

export default RegistrationSaga;
