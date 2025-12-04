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
  GET_NON_ACTIVE_CURRS,
  UPDATE_NON_ACTIVE_CURR,
  DELETE_NON_ACTIVE_CURR,
  GET_TRAINEE_SCHEDULES,
  GET_ACHIEVED_COURSES,
  DELETE_ALL_NON_ACTIVE_CURR,
  SAVE_ALL_NON_ACTIVE_CURR,
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
  addAvailableCourseFail,
  addAvailableCourseSuccess,
  getNonActiveCurrSuccess,
  getNonActiveCurrFail,
  updateNonActiveCurrSuccess,
  updateNonActiveCurrFail,
  deleteNonActiveCurrSuccess,
  deleteNonActiveCurrFail,
  getTraineeSchedulesSuccess,
  getTraineeSchedulesFail,
  deleteAllNonActiveCurrSuccess,
  deleteAllNonActiveCurrFail,
  getAchievedCoursesFail,
  getAchievedCoursesSuccess,
  saveAllNonActiveCurrSuccess,
  saveAllNonActiveCurrFail,
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
  getNonActiveCurrs,
  updateNonActiveCurr,
  deleteNonActiveCurr,
  getTraineeSchedules,
  deleteAllNonActiveCurr,
  getAchievedCourses,
  getStudentRegisterInfo,
  saveAllNonActiveCurr,
} from "../../helpers/fakebackend_helper";
let theObj;

//first table
function* fetchAvailableCourses(obj) {
  theObj = obj;
  // let userType = obj.payload.userType;
  let traineeId = obj.payload.traineeId;
  const get_availablecourse_req = {
    source: "db",
    procedure: "RegistrationCourses_getTraineeOfferedCourses",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    traineeId: traineeId,
  };
  try {
    const response = yield call(getAvailableCourses, get_availablecourse_req);
    console.log("rrrrrrrrrrrrrrrrrrrre", response);
    yield put(getAvailableCourseSuccess(response));
  } catch (error) {
    yield put(getAvailableCourseFail(error));
  }
}

function* fetchTraineeSchedules(obj) {
  let traineeId = obj.payload.traineeId;
  console.log("''''''''''''''''ob", obj.payload.traineeId);

  const get_temp_schedule = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_TraineesSchedule",
    // filter: `traineeId =${traineeId} and type = ''''${type}'''' and sectionLabId=${sectionLabId} `,
    filter: `traineeId =${traineeId}`,
  };
  try {
    const response = yield call(getTraineeSchedules, get_temp_schedule);
    console.log("responseschedule", response);
    yield put(getTraineeSchedulesSuccess(response));
  } catch (error) {
    yield put(getTraineeSchedulesFail(error));
  }
}
//ruba cacelled that
// function* fetchAchievedCourses(obj) {
//   let traineeId = obj.payload.traineeId;

//   const get_achieved_courses = {
//     source: "db",
//     procedure: `Student_getPlanAchievements`,
//     apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
//     traineeId: traineeId,
//   };
//   try {
//     const response = yield call(getAchievedCourses, get_achieved_courses);

//     yield put(getAchievedCoursesSuccess(response));
//   } catch (error) {
//     yield put(getAchievedCoursesFail(error));
//   }
// }

function* fetchRegistrations() {
  const get_Registration_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_Trainee",
  };
  try {
    const response = yield call(getRegistrations, get_Registration_req);
    console.log("responnnnnnnnnnnnnnnnnnse", response);
    yield put(getRegistrationsSuccess(response));
  } catch (error) {
    yield put(getRegistrationsFail(error));
  }

  // lecture periods
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
  //get weekdays
  const get_weekDays_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_WeekDays",
    filter: "active=1",
  };
  try {
    const response = yield call(getWeekDays, get_weekDays_req);
    yield put(getWeekDaysSuccess(response));
  } catch (error) {
    yield put(getWeekDaysFail(error));
  }
}
//ruba cancelled that
// function* fetchStudentRegisterInfo(obj) {
//   let traineeId = obj.payload;
//   const get_student_info = {
//     source: "db",
//     procedure: "Student_getRegisterInfo",
//     apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
//     traineeId: traineeId,
//   };
//   try {
//     const response = yield call(getStudentRegisterInfo, get_student_info);
//     yield put(getStudentRegisterInfoSuccess(response));
//   } catch (error) {
//     yield put(getStudentRegisterInfoFail(error));
//   }
// }

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
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_Curriculalines";
  payload["queryname"] = "_Current_Common_TrianeeCurriculalines";

  try {
    const response = yield call(addNewAvailableCourse, payload);
    console.log("responseresponseresponseresponse", response);
    yield put(addAvailableCourseSuccess(response[0]));
    console.log("theoiooooooooooo", theObj);
    yield fetchAvailableCourses(theObj);
    console.log("theoioooooo555555555555ooooo", {
      active: 0,
      traineeId: payload.traineeId,
    });
    yield call(fetchNonActiveCurr, {
      payload: { active: 0, traineeId: payload.traineeId },
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
function* onUpdateNonActiveCurr({ payload }) {
  console.log("im hereeeeeeeeeeeeeee");
  console.log("payload update before", payload.nonActiveCurr);
  payload.nonActiveCurr["source"] = "db";
  payload.nonActiveCurr["procedure"] = "SisApp_checkRegistrationConflic";
  payload.nonActiveCurr["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload.nonActiveCurr["tablename"] = "Common_Curriculalines";
  payload.nonActiveCurr["queryname"] = "_Current_Common_TrianeeCurriculalines";
  console.log("payload update", payload);
  try {
    const respupdate = yield call(updateNonActiveCurr, payload.nonActiveCurr);
    console.log("777777777777777", respupdate);
    yield put(updateNonActiveCurrSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateNonActiveCurrFail(error));
  }
  if (payload.active == 0) {
    yield call(fetchTraineeSchedules, {
      payload: { traineeId: payload.nonActiveCurr.traineeId },
    });
  }
  yield call(fetchNonActiveCurr, {
    payload: {
      active: payload.active,
      traineeId: payload.nonActiveCurr.traineeId,
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
function* onDeleteNonActiveCurr({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_Curriculalines";

  try {
    const respdelete = yield call(deleteNonActiveCurr, payload);

    yield put(deleteNonActiveCurrSuccess(respdelete[0]));
    yield fetchAvailableCourses(theObj);
  } catch (error) {
    yield put(deleteNonActiveCurrFail(error));
  }
}

//second table
function* fetchNonActiveCurr(obj) {
  console.log("objobjobjobjobj", obj);
  let traineeId = obj.payload.traineeId;
  let active = obj.payload.active;
  const get_availablecourse_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Current_Common_TrianeeCurriculalines",
    filter: `active = ${active}  and traineeId = ${traineeId} `,
  };
  try {
    const response = yield call(getNonActiveCurrs, get_availablecourse_req);
    response.map(resp => {
      resp["sections"] = JSON.parse(resp["sections"]);
    });
    response.map(resp => {
      resp["labs"] = JSON.parse(resp["labs"]);
    });
    console.log("rreeeeeeennnnon", response);
    yield put(getNonActiveCurrSuccess(response));
  } catch (error) {
    yield put(getNonActiveCurrFail(error));
  }
}
function* onDeleteAllNonActiveCurr({ payload }) {
  console.log("objobjobjobjobjpayloadpayload", payload);
  payload["source"] = "db";
  payload["procedure"] = "SisApp_DeleteAllTraineesRegistration";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_Curriculalines";
  payload["queryname"] = "_Current_Common_TrianeeCurriculalines";
  payload["flag"] = payload.flag;
  payload["filter"] = `traineeId=${payload.traineeId} and active=0`;
  try {
    const respupdate = yield call(deleteAllNonActiveCurr, payload);
    respupdate.map(resp => {
      resp["sections"] = JSON.parse(resp["sections"]);
    });
    respupdate.map(resp => {
      resp["labs"] = JSON.parse(resp["labs"]);
    });
    yield put(deleteAllNonActiveCurrSuccess(respupdate));
  } catch (error) {
    yield put(deleteAllNonActiveCurrFail(error));
  }
  if (payload.flag === "reset") {
    yield call(fetchTraineeSchedules, {
      payload: { traineeId: payload.traineeId },
    });
    yield call(fetchNonActiveCurr, {
      payload: { active: 0, traineeId: payload.traineeId },
    });
  } else {
    yield fetchAvailableCourses(theObj);
  }
}
function* onSaveAllNonActiveCurr({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "Registration_SubmitRegistration";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_Curriculalines";
  payload["queryname"] = "_Current_Common_TrianeeCurriculalines";
  try {
    const respupdate = yield call(saveAllNonActiveCurr, payload);
    respupdate.map(resp => {
      resp["sections"] = JSON.parse(resp["sections"]);
    });
    respupdate.map(resp => {
      resp["labs"] = JSON.parse(resp["labs"]);
    });
    yield put(saveAllNonActiveCurrSuccess(respupdate));
  } catch (error) {
    yield put(saveAllNonActiveCurrFail(error));
  }
  yield fetchAvailableCourses(theObj);
  yield call(fetchTraineeSchedules, {
    payload: { traineeId: payload.traineeId },
  });
  yield call(fetchNonActiveCurr, {
    payload: { active: 1, traineeId: payload.traineeId },
  });
}
function* RegistrationSaga() {
  yield takeEvery(GET_NON_ACTIVE_CURRS, fetchNonActiveCurr);
  yield takeEvery(UPDATE_NON_ACTIVE_CURR, onUpdateNonActiveCurr);
  yield takeEvery(DELETE_NON_ACTIVE_CURR, onDeleteNonActiveCurr);
  yield takeEvery(GET_REGISTRATIONS, fetchRegistrations);
  // yield takeEvery(GET_STUDENT_REGISTER_INFO, fetchStudentRegisterInfo);
  yield takeEvery(ADD_NEW_REGISTRATION, onAddNewRegistration);
  yield takeEvery(UPDATE_REGISTRATION, onUpdateRegistration);
  yield takeEvery(DELETE_REGISTRATION, onDeleteRegistration);
  yield takeEvery(ADD_NEW_AVAILABLE_COURSE, onAddNewAvailableCourse);
  yield takeEvery(GET_AVAILABLE_COURSES, fetchAvailableCourses);
  yield takeEvery(GET_TRAINEE_SCHEDULES, fetchTraineeSchedules);
  // yield takeEvery(GET_ACHIEVED_COURSES, fetchAchievedCourses);
  yield takeEvery(DELETE_ALL_NON_ACTIVE_CURR, onDeleteAllNonActiveCurr);
  yield takeEvery(SAVE_ALL_NON_ACTIVE_CURR, onSaveAllNonActiveCurr);
}

export default RegistrationSaga;
