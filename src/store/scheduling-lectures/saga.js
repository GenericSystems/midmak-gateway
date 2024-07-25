import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_SCHEDULING_LECTURES,
  GET_ALL_SCHEDULING_LECTURES,
  GET_SCHEDULING_LECTURE_PROFILE,
  ADD_NEW_SCHEDULING_LECTURE,
  DELETE_SCHEDULING_LECTURE,
  UPDATE_SCHEDULING_LECTURE,
  GET_SECTION_LABS,
  GET_SECTION_LAB_PROFILE,
  ADD_NEW_SECTION_LAB,
  DELETE_SECTION_LAB,
  UPDATE_SECTION_LAB,
  GET_SCHEDULE_TIMINGS,
  GET_SCHEDULE_TIMING_PROFILE,
  ADD_NEW_SCHEDULE_TIMING,
  DELETE_SCHEDULE_TIMING,
  GET_SCHEDULE_TIMING_DESCS,
  GET_DEFAULT_SETTINGS,
  GET_SCHEDULE_MSG_VALUE,
  GET_SECTOR_TIMINGS
} from "./actionTypes";

import { GET_FILTERED_DEPARTMENTS } from "../departments/actionTypes";
import {
  getSchedulingLecturesSuccess,
  getSchedulingLecturesFail,
  getAllSchedulingLecturesSuccess,
  getAllSchedulingLecturesFail,
  getSchedulingLectureProfileSuccess,
  getSchedulingLectureProfileFail,
  addSchedulingLectureFail,
  addSchedulingLectureSuccess,
  updateSchedulingLectureSuccess,
  updateSchedulingLectureFail,
  deleteSchedulingLectureSuccess,
  deleteSchedulingLectureFail,
  getInstructorsFail,
  getInstructorsSuccess,
  getSectionLabsSuccess,
  getSectionLabsFail,
  getSectionLabProfileSuccess,
  getSectionLabProfileFail,
  addSectionLabFail,
  addSectionLabSuccess,
  updateSectionLabSuccess,
  updateSectionLabFail,
  deleteSectionLabSuccess,
  deleteSectionLabFail,
  getScheduleTimingsSuccess,
  getScheduleTimingsFail,
  getScheduleTimingProfileSuccess,
  getScheduleTimingProfileFail,
  addScheduleTimingFail,
  addScheduleTimingSuccess,
  deleteScheduleTimingSuccess,
  deleteScheduleTimingFail,
  getScheduleTimingDescsSuccess,
  getScheduleTimingDescsFail,
getScheduleMsgValueSuccess,
getScheduleMsgValueFail,
getSectorTimingsSuccess,
getSectorTimingsFail
} from "./actions";
import {
  getDepartmentsSuccess,
  getDepartmentsFail,
} from "../departments/actions";

import {
  getAcademicCertificatesSuccess,
  getAcademicCertificatesFail,
  getFilteredAcademicCertificatesSuccess,
  getFilteredAcademicCertificatesFail,
} from "../academicvertificates/actions";
import { getSectorsSuccess, getSectorsFail } from "../sectors/actions";
import { getWeekDaysSuccess, getWeekDaysFail } from "../weekdays/actions";
import { GET_FILTERED_ACADEMIC_CERTIFICATES } from "../academicvertificates/actionTypes";

import {
  getLecturePeriodsSuccess,
  getLecturePeriodsFail,
} from "../lecture-periods/actions";
// Include Both Helper File with needed methods
import {
  getSchedulingLectures,
  getAllSchedulingLectures,
  getSchedulingLectureProfile,
  addNewSchedulingLecture,
  updateSchedulingLecture,
  deleteSchedulingLecture,
  getSectors,
  getInstructors,
  getSectionLabs,
  getSectionLabProfile,
  addNewSectionLab,
  updateSectionLab,
  deleteSectionLab,
  getFaculties,
  getDepartments,
  getWeekDays,
  getLecturePeriods,
  getScheduleTimings,
  getScheduleTimingProfile,
  addNewScheduleTiming,
  deleteScheduleTiming,
  getScheduleTimingDescs,
  getFilteredDepartments,
  getFilteredAcademicCertificates,
  getScheduleMsgValue,
  getSectorTimings
} from "../../helpers/fakebackend_helper";
import {
  getFacultiesSuccess,
  getFacultiesFail,
} from "../mob-app-faculty-accs/actions";
function* fetchDefaultSettings() {
  const get_faculty_opt = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_Faculty",
    fields: "Id,arTitle",
    
  };
  try {
    const response = yield call(getFaculties, get_faculty_opt);
    yield put(getFacultiesSuccess(response));
  } catch (error) {
    yield put(getFacultiesFail(error));
  }
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

  //get department
  const get_department_opt = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_Department",
    fields: "Id,arTitle,facultyId",
  };
  try {
    const response = yield call(getDepartments, get_department_opt);
    yield put(getDepartmentsSuccess(response));
  } catch (error) {
    yield put(getDepartmentsFail(error));
  }

  //get instructor
  const get_instructor_opt = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_Instructor",
    fields: "Id,fullName",
  };
  try {
    const response = yield call(getInstructors, get_instructor_opt);
    yield put(getInstructorsSuccess(response));
  } catch (error) {
    yield put(getInstructorsFail(error));
  }

  
}
function* fetchFilteredAcademicCertificates(obj) {
  let facultyId = obj.payload;
  const get_filtered_academicCertificates = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_AcadmicCertificates",
    fields: "Id,AcadmicCertificatesArName,facultyId",
    filter: `facultyId = ${facultyId}  `,
  };
  try {
    const response = yield call(
      getFilteredAcademicCertificates,
      get_filtered_academicCertificates
    );
    yield put(getFilteredAcademicCertificatesSuccess(response));
  } catch (error) {
    yield put(getFilteredAcademicCertificatesFail(error));
  }
}


function* fetchSchedulingLectures(obj) {
  let yearSemesterId = obj.payload;
  //get faculty
  
  const get_schedulingLectures_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_courseOffering",
    filter:`yearSemesterId = ${yearSemesterId}`
  };
  try {
    const response = yield call(
      getSchedulingLectures,
      get_schedulingLectures_req
    );
    yield put(getSchedulingLecturesSuccess(response));
  } catch (error) {
    yield put(getSchedulingLecturesFail(error));
  }
}

function* fetcsectorschedulingLectures(obj) {
  let yearSemesterId = obj.payload;
  const get_allSchedulingLectures_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_courseOfferingAll",
    filter:`yearSemesterId = ${yearSemesterId} or yearSemesterId is null`
  };
  try {
    const response = yield call(
      getAllSchedulingLectures,
      get_allSchedulingLectures_req
    );
    yield put(getAllSchedulingLecturesSuccess(response));
  } catch (error) {
    yield put(getAllSchedulingLecturesFail(error));
  }
}

function* fetchSchedulingLectureProfile() {
  try {
    const response = yield call(getSchedulingLectureProfile);
    yield put(getSchedulingLectureProfileSuccess(response));
  } catch (error) {
    yield put(getSchedulingLectureProfileFail(error));
  }
}

function* onAddNewSchedulingLecture({ payload, schedulingLecture }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_courseOffering_setup";

  try {
    const response = yield call(addNewSchedulingLecture, payload);
    yield put(addSchedulingLectureSuccess(response[0]));
  } catch (error) {
    yield put(addSchedulingLectureFail(error));
  }
}

function* onUpdateSchedulingLecture({ payload }) {
  payload.newRow["source"] = "db";
  payload.newRow["procedure"] = "setOfferedCourse";
  payload.newRow["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload.newRow["tablename"] = "Common_courseOffering_setup";

  try {
    const respupdate = yield call(updateSchedulingLecture, payload.newRow);
    yield put(updateSchedulingLectureSuccess(respupdate[0]));
    if(payload.showAll==true){
      yield (fetcsectorschedulingLectures({type:GET_ALL_SCHEDULING_LECTURES,payload:payload.semester}))
    } 
    else {
      yield (fetchSchedulingLectures({type:GET_SCHEDULING_LECTURES,payload:payload.semester}))
    }
  } catch (error) {
    yield put(updateSchedulingLectureFail(error));
  }
}

function* onDeleteSchedulingLecture({ payload, schedulingLecture }) {
  payload.delId["source"] = "db";
  payload.delId["procedure"] = "SisApp_removeData";
  payload.delId["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload.delId["tablename"] = "Common_courseOffering_setup";

  try {
    const respdelete = yield call(deleteSchedulingLecture, payload.delId);
    yield put(deleteSchedulingLectureSuccess(respdelete[0]));
    if(payload.showAll==true){
      yield (fetcsectorschedulingLectures({type:GET_ALL_SCHEDULING_LECTURES,payload:payload.semester}))
    } 
    else {
      yield (fetchSchedulingLectures({type:GET_SCHEDULING_LECTURES,payload:payload.semester}))
    }
  } catch (error) {
    yield put(deleteSchedulingLectureFail(error));
  }
}
function* fetchSectionLabs(obj) {
  let sectionLabCourse = obj.payload;
  console.log("obj",obj.payload)
  const facultyId = sectionLabCourse.facultyId === null ? 0 : sectionLabCourse.facultyId;

  const get_sectors_req = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_sectors",
    fields: "Id,hallName",
    filter: `facultyId = ${facultyId}`
  };

  try {
    const response = yield call(getSectors, get_sectors_req);
    yield put(getSectorsSuccess(response));
  } catch (error) {
    yield put(getSectorsFail(error));
  }
  const get_sectionLabs_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_SectionsLabs",
    filter: `CourseId = ${sectionLabCourse.courseId} and CourseCode=''''${sectionLabCourse.courseCode}''''`,
  };

  try {
    const response = yield call(getSectionLabs, get_sectionLabs_req);

    yield put(getSectionLabsSuccess(response));
  } catch (error) {
    yield put(getSectionLabsFail(error));
  }
}

function* fetchSectionLabProfile() {
  try {
    const response = yield call(getSectionLabProfile);
    yield put(getSectionLabProfileSuccess(response));
  } catch (error) {
    yield put(getSectionLabProfileFail(error));
  }
}

function* onAddNewSectionLab({ payload, sectionLab }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["queryname"] = "_SectionsLabs";

  try {
    const response = yield call(addNewSectionLab, payload);
    yield put(addSectionLabSuccess(response[0]));
  } catch (error) {
    yield put(addSectionLabFail(error));
  }
}

function* onUpdateSectionLab({ payload }) {
  console.log("in update", payload)
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["queryname"] = "_SectionsLabs";

  try {
    const respupdate = yield call(updateSectionLab, payload);
    yield put(updateSectionLabSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateSectionLabFail(error));
  }
}

function* onDeleteSectionLab({ payload, sectionLab }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  //payload["tablename"] = 'Common_Section';

  try {
    const respdelete = yield call(deleteSectionLab, payload);
    yield put(deleteSectionLabSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteSectionLabFail(error));
  }
}
function* fetchScheduleTimings(obj) {
  let scheduleTimingSL = obj.payload;
  const get_schedule_timings = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_TeachingSchedule",
    filter: `sectionLabId = ${scheduleTimingSL.Id} and type=''''${scheduleTimingSL.type}''''`,
  };
  try {
    const response = yield call(getScheduleTimings, get_schedule_timings);

    yield put(getScheduleTimingsSuccess(response));
  } catch (error) {
    yield put(getScheduleTimingsFail(error));
  }
}

function* fetchSectorTimings(obj) {
  let hallTimingSL = obj.payload;
  let filter 
  if(hallTimingSL.check==0){
    filter = `hallId = ${hallTimingSL.hallId} and yearSemesterId=''''${hallTimingSL.yearSemesterId}''''`
  } else{
    filter = `yearSemesterId=''''${hallTimingSL.yearSemesterId}''''`
  }
  const get_hall_timings = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_scheduleTimingsDescriptionDetails",
    filter: filter,
  };
  try {
    const response = yield call(getSectorTimings, get_hall_timings);

    yield put(getSectorTimingsSuccess(response));
  } catch (error) {
    yield put(getSectorTimingsFail(error));
  }
}


function* fetchScheduleTimingProfile() {
  try {
    const response = yield call(getScheduleTimingProfile);
    yield put(getScheduleTimingProfileSuccess(response));
  } catch (error) {
    yield put(getScheduleTimingProfileFail(error));
  }
}

function* fetchScheduleTimingDescs(obj) {
  let scheduleTimingD = obj.payload;
  const get_schedulingTimingDescs = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_scheduleTimingsDescription",
    filter: `sectionLabId = ${scheduleTimingD.Id} and type=''''${scheduleTimingD.type}''''`,
  };
  try {
    const response = yield call(
      getScheduleTimingDescs,
      get_schedulingTimingDescs
    );

    yield put(getScheduleTimingDescsSuccess(response));
  } catch (error) {
    yield put(getScheduleTimingDescsFail(error));
  }
}

function* onAddNewScheduleTiming({ payload, scheduleTiming }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "addTeachingSchedule";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_TeachingSchedule";

  try {
    const response = yield call(addNewScheduleTiming, payload);
    yield put(addScheduleTimingSuccess(response[0]));
  } catch (error) {
    yield put(addScheduleTimingFail(error));
  }
}
function* onDeleteScheduleTiming({ payload, scheduleTiming }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_TeachingSchedule";

  try {
    const respdelete = yield call(deleteScheduleTiming, payload);
    yield put(deleteScheduleTimingSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteScheduleTimingFail(error));
  }
}

function* onGetScheduleMsgValue() {
  try {
    const response = yield call(getScheduleMsgValue)
    yield put(getScheduleMsgValueSuccess(response))
  } catch (error) {
    yield put(getScheduleMsgValueFail(error))
  }
  
}

function* schedulingLecturesSaga() {
  yield takeEvery(GET_ALL_SCHEDULING_LECTURES, fetcsectorschedulingLectures);
  yield takeEvery(GET_SCHEDULING_LECTURES, fetchSchedulingLectures);
  yield takeEvery(
    GET_SCHEDULING_LECTURE_PROFILE,
    fetchSchedulingLectureProfile
  );

  yield takeEvery(ADD_NEW_SCHEDULING_LECTURE, onAddNewSchedulingLecture);
  yield takeEvery(UPDATE_SCHEDULING_LECTURE, onUpdateSchedulingLecture);
  yield takeEvery(DELETE_SCHEDULING_LECTURE, onDeleteSchedulingLecture);
  yield takeEvery(GET_SECTION_LABS, fetchSectionLabs);
  yield takeEvery(GET_SECTION_LAB_PROFILE, fetchSectionLabProfile);
  yield takeEvery(ADD_NEW_SECTION_LAB, onAddNewSectionLab);
  yield takeEvery(UPDATE_SECTION_LAB, onUpdateSectionLab);
  yield takeEvery(DELETE_SECTION_LAB, onDeleteSectionLab);
  yield takeEvery(GET_SCHEDULE_TIMINGS, fetchScheduleTimings);
  yield takeEvery(GET_SCHEDULE_TIMING_PROFILE, fetchScheduleTimingProfile);
  yield takeEvery(ADD_NEW_SCHEDULE_TIMING, onAddNewScheduleTiming);
  yield takeEvery(DELETE_SCHEDULE_TIMING, onDeleteScheduleTiming);
  yield takeEvery(GET_SCHEDULE_TIMING_DESCS, fetchScheduleTimingDescs);
  yield takeEvery(
    GET_FILTERED_ACADEMIC_CERTIFICATES,
    fetchFilteredAcademicCertificates
  );
  yield takeEvery(GET_DEFAULT_SETTINGS, fetchDefaultSettings);
  yield takeEvery(GET_SCHEDULE_MSG_VALUE, onGetScheduleMsgValue);
  yield takeEvery(GET_SECTOR_TIMINGS, fetchSectorTimings);
}

export default schedulingLecturesSaga;
