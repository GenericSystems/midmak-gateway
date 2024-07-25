import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_COURSES_REGISTRATIONS,
  GET_STUDENT_REGISTER_INFO,
  ADD_NEW_COURSES_REGISTRATION,
  DELETE_COURSES_REGISTRATION,
  UPDATE_COURSES_REGISTRATION,
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
  getCoursesRegistrationSuccess,
  getCoursesRegistrationFail,
  getStudentRegisterInfoSuccess,
  getStudentRegisterInfoFail,
  addCoursesRegistrationFail,
  addCoursesRegistrationSuccess,
  updateCoursesRegistrationSuccess,
  updateCoursesRegistrationFail,
  deleteCoursesRegistrationSuccess,
  deleteCoursesRegistrationFail,
  getAvailableCourseSuccess,
  getAvailableCourseFail,
  addAvailableCourseFail,
  addAvailableCourseSuccess,
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
saveAllNonActiveStdCurrFail
} from "./actions";
import {
  getLecturePeriodsSuccess,
  getLecturePeriodsFail,
} from "../lecture-periods/actions";
import { getWeekDaysSuccess, getWeekDaysFail } from "../weekdays/actions";
// Include Both Helper File with needed methods
import {
  getCoursesRegistration,
  addNewCoursesRegistration,
  updateCoursesRegistration,
  deleteCoursesRegistration,
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
  saveAllNonActiveStdCurr
  } from "../../helpers/fakebackend_helper";
let theObj
function* fetchAvailableCourses(obj) {
   theObj = obj
  let userType = obj.payload.userType;
  let studentId = obj.payload.studentId;
  const get_availablecourse_req = {
    source: "db",
    procedure: "RegistrationCourses_getStudentOfferedCourses",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    StudentId:studentId
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
    StudentId:studentId
  };
  try {
    const response = yield call(getAchievedCourses, get_achieved_courses);

    yield put(getAchievedCoursesSuccess(response));
  } catch (error) {
    yield put(getAchievedCoursesFail(error));
  }
}
function* fetchCoursesRegistration() {
  // lecture periods
  const get_lecturePeriods_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_lecturePeriods",
  };
  try {
    const response = yield call(getLecturePeriods, get_lecturePeriods_req);
    yield put(getLecturePeriodsSuccess(response));
  } catch (error) {
    yield put(getLecturePeriodsFail(error));
  }
  //get weekdays
  const get_weekDays_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_weekDays",
    filter: "active=1",
  };
  try {
    const response = yield call(getWeekDays, get_weekDays_req);
    yield put(getWeekDaysSuccess(response));
  } catch (error) {
    yield put(getWeekDaysFail(error));
  }

  const get_coursesRegistration_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_UniversityStudent",
  };
  try {
    const response = yield call(
      getCoursesRegistration,
      get_coursesRegistration_req
    );
    yield put(getCoursesRegistrationSuccess(response));
  } catch (error) {
    yield put(getCoursesRegistrationFail(error));
  }
}

function* fetchStudentRegisterInfo(obj) {
  let studentId = obj.payload;
  const get_student_info = {
    source: "db",
    procedure: "Student_getRegisterInfo",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    StudentId:studentId
  };
  try {
    const response = yield call(getStudentRegisterInfo,get_student_info);
    yield put(getStudentRegisterInfoSuccess(response));
  } catch (error) {
    yield put(getStudentRegisterInfoFail(error));
  }
}

function* onAddNewCoursesRegistration({ payload, coursesRegistration }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "get_GenericPeriod";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_coursesRegistration";

  try {
    const response = yield call(addNewCoursesRegistration, payload);
    yield put(addCoursesRegistrationSuccess(response[0]));
  } catch (error) {
    yield put(addCoursesRegistrationFail(error));
  }
}

function* onAddNewAvailableCourse({ payload }) {
  delete payload["id"];
  console.log("StudentId",payload)
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_StudentsCurriculalines";
  payload["queryname"] = "_Current_Common_StudentsCurriculalines";

  try {
    const response = yield call(addNewAvailableCourse, payload);
    yield put(addAvailableCourseSuccess(response[0]));
    yield (fetchAvailableCourses(theObj))
    yield call(fetchNonActiveStdCurr, {
      payload: { active: 0, studentId: payload.StudentId },
    });
  } catch (error) {
    yield put(addAvailableCourseFail(error));
  }
}

function* onUpdateCoursesRegistration({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_coursesRegistration";

  try {
    const respupdate = yield call(updateCoursesRegistration, payload);
    yield put(updateCoursesRegistrationSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateCoursesRegistrationFail(error));
  }
}
function* onUpdateNonActiveStdCurr({ payload }) {
  payload.nonActiveStdCurr["source"] = "db";
  payload.nonActiveStdCurr["procedure"] = "SisApp_checkRegistrationConflic";
  payload.nonActiveStdCurr["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload.nonActiveStdCurr["tablename"] = "Common_StudentsCurriculalines";
  payload.nonActiveStdCurr["queryname"] = "_Current_Common_StudentsCurriculalines";
  console.log("payload update",payload)
  try {
    const respupdate = yield call(updateNonActiveStdCurr, payload.nonActiveStdCurr);
    yield put(updateNonActiveStdCurrSuccess(respupdate[0]));

  } catch (error) {
    yield put(updateNonActiveStdCurrFail(error));
  }
  if(payload.active==0){
  yield call(fetchTempStdSchedules, {
    payload: { studentId: payload.nonActiveStdCurr.studentId },
  });
}
  yield call(fetchNonActiveStdCurr, {
    payload: { active: payload.active, studentId: payload.nonActiveStdCurr.studentId },
  });
}


function* onDeleteCoursesRegistration({ payload, coursesRegistration }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_coursesRegistration";

  try {
    const respdelete = yield call(deleteCoursesRegistration, payload);
    yield put(deleteCoursesRegistrationSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteCoursesRegistrationFail(error));
  }
}
function* onDeleteNonActiveStdCurr({ payload, coursesRegistration }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_StudentsCurriculalines";

  try {
    const respdelete = yield call(deleteNonActiveStdCurr, payload);

    yield put(deleteNonActiveStdCurrSuccess(respdelete[0]));
    yield (fetchAvailableCourses(theObj))
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
  payload["flag"] = payload.flag
  payload["filter"] = `StudentId=${payload.studentId} and active=0 and YearSemesterId=${payload.semesterYearId}`
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
  if(payload.flag==="reset"){
  yield call(fetchTempStdSchedules, {
    payload: { studentId: payload.studentId },
  });
  yield call(fetchNonActiveStdCurr, {
    payload: { active: 0, studentId: payload.studentId },
  });
}
  else {
    yield (fetchAvailableCourses(theObj))
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
    yield (fetchAvailableCourses(theObj))
    yield call(fetchTempStdSchedules, {
      payload: { studentId: payload.studentId },
    });
    yield call(fetchNonActiveStdCurr, {
      payload: { active: 1, studentId: payload.studentId },
    });
}
function* coursesRegistrationSaga() {
  yield takeEvery(GET_NON_ACTIVE_STD_CURRS, fetchNonActiveStdCurr);
  yield takeEvery(UPDATE_NON_ACTIVE_STD_CURR, onUpdateNonActiveStdCurr);
  yield takeEvery(DELETE_NON_ACTIVE_STD_CURR, onDeleteNonActiveStdCurr);
  yield takeEvery(GET_COURSES_REGISTRATIONS, fetchCoursesRegistration);
  
  yield takeEvery(
    GET_STUDENT_REGISTER_INFO,
    fetchStudentRegisterInfo
  );
  yield takeEvery(ADD_NEW_COURSES_REGISTRATION, onAddNewCoursesRegistration);
  yield takeEvery(UPDATE_COURSES_REGISTRATION, onUpdateCoursesRegistration);
  yield takeEvery(DELETE_COURSES_REGISTRATION, onDeleteCoursesRegistration);
  yield takeEvery(ADD_NEW_AVAILABLE_COURSE, onAddNewAvailableCourse);
  yield takeEvery(GET_AVAILABLE_COURSES, fetchAvailableCourses);
  yield takeEvery(GET_TEMP_STD_SCHEDULES, fetchTempStdSchedules);
  yield takeEvery(GET_ACHIEVED_COURSES, fetchAchievedCourses);
  yield takeEvery(DELETE_ALL_NON_ACTIVE_STD_CURR, onDeleteAllNonActiveStdCurr);
  yield takeEvery(SAVE_ALL_NON_ACTIVE_STD_CURR, onSaveAllNonActiveStdCurr);

  
}

export default coursesRegistrationSaga;
