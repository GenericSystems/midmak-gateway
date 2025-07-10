import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_COURSES_OFFERING,
  GET_ALL_COURSES_OFFERING,
  GET_COURSE_OFFERING_PROFILE,
  ADD_NEW_COURSE_OFFERING,
  DELETE_COURSE_OFFERING,
  UPDATE_COURSE_OFFERING,
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
  GET_SECTOR_TIMINGS,
  GET_METHODS_OF_OFFERING_COURSES,
} from "./actionTypes";

import { GET_FILTERED_DEPARTMENTS } from "../departments/actionTypes";
import {
  getCoursesOfferingSuccess,
  getCoursesOfferingFail,
  getAllCoursesOfferingSuccess,
  getAllCoursesOfferingFail,
  getCourseOfferingProfileSuccess,
  getCourseOfferingProfileFail,
  addCourseOfferingFail,
  addCourseOfferingSuccess,
  updateCourseOfferingSuccess,
  updateCourseOfferingFail,
  deleteCourseOfferingSuccess,
  deleteCourseOfferingFail,
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
  getSectorTimingsFail,
  getMethodsOfOfferingCoursesSuccess,
  getMethodsOfOfferingCoursesFail,
} from "./actions";
import {
  getHallsSuccess,
  getHallsFail,
} from "../academyBuildingStructure/actions";

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

import { getYearsSuccess, getYearsFail } from "../years/actions";
// Include Both Helper File with needed methods
import {
  getCoursesOffering,
  getAllCoursesOffering,
  getCourseOfferingProfile,
  addNewCourseOffering,
  updateCourseOffering,
  deleteCourseOffering,
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
  getSectorTimings,
  getMethodsOfOfferingCourses,
  getYears,
  getHalls,
} from "../../helpers/fakebackend_helper";
import {
  getFacultiesSuccess,
  getFacultiesFail,
} from "../mob-app-faculty-accs/actions";

function* fetchMethodsOffering() {
  const get_methodsOffering_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_MethodOffering",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(
      getMethodsOfOfferingCourses,
      get_methodsOffering_req
    );
    yield put(getMethodsOfOfferingCoursesSuccess(response));
    console.log("pppppppppppppp", response);
  } catch (error) {
    yield put(getMethodsOfOfferingCoursesFail(error));
  }
}

function* fetchCoursesOffering() {
  const get_CoursesOffering_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_CourseOffering",
    filter: `isOffered = 1`,
  };
  try {
    const response = yield call(getCoursesOffering, get_CoursesOffering_req);
    console.log("QQQQQQQQQQQQQQQ", response);
    yield put(getCoursesOfferingSuccess(response));
  } catch (error) {
    yield put(getCoursesOfferingFail(error));
  }

  const get_years_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Years",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getYears, get_years_req);
    console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy", response);
    yield put(getYearsSuccess(response));
  } catch (error) {
    yield put(getYearsFail(error));
  }
}

function* fetchAllCoursesOffering(obj) {
  const get_allCoursesOffering_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_CourseOffering",
  };
  try {
    const response = yield call(
      getAllCoursesOffering,
      get_allCoursesOffering_req
    );
    yield put(getAllCoursesOfferingSuccess(response));
  } catch (error) {
    yield put(getAllCoursesOfferingFail(error));
  }
}

function* fetchCourseOfferingProfile() {
  try {
    const response = yield call(getCourseOfferingProfile);
    yield put(getCourseOfferingProfileSuccess(response));
  } catch (error) {
    yield put(getCourseOfferingProfileFail(error));
  }
}

function* onAddNewCourseOffering({ payload, courseOffering }) {
  console.log("payload", payload);
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_CourseOffering";

  try {
    const response = yield call(addNewCourseOffering, payload);
    yield put(addCourseOfferingSuccess(response[0]));
  } catch (error) {
    yield put(addCourseOfferingFail(error));
  }
}

function* onUpdateCourseOffering({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_CourseOffering";
  try {
    const response = yield call(updateCourseOffering, payload);
    yield put(updateCourseOfferingSuccess(response[0]));
    if (payload.showAll == true) {
      yield fetchAllCoursesOffering({
        type: GET_ALL_COURSES_OFFERING,
      });
    } else {
      yield fetchCoursesOffering({
        type: GET_COURSES_OFFERING,
      });
    }
  } catch (error) {
    yield put(updateCourseOfferingFail(error));
  }
}

function* onDeleteCourseOffering({ payload, courseOffering }) {
  payload.delId["source"] = "db";
  payload.delId["procedure"] = "SisApp_removeData";
  payload.delId["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload.delId["tablename"] = "Common_CourseOffering";

  try {
    const respdelete = yield call(deleteCourseOffering, payload.delId);
    yield put(deleteCourseOfferingSuccess(respdelete[0]));
    if (payload.showAll == true) {
      yield fetchAllCoursesOffering({
        type: GET_ALL_COURSES_OFFERING,
        payload: payload.semester,
      });
    } else {
      yield fetchCoursesOffering({
        type: GET_COURSES_OFFERING,
        payload: payload.semester,
      });
    }
  } catch (error) {
    yield put(deleteCourseOfferingFail(error));
  }
}
function* fetchSectionLabs(obj) {
  // let sectionLabCourse = obj.payload;
  // console.log("obj", obj.payload);
  // const facultyId =
  //   sectionLabCourse.facultyId === null ? 0 : sectionLabCourse.facultyId;

  // const get_sectors_req = {
  //   source: "db",
  //   procedure: "Generic_Optiondatalist",
  //   apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  //   tablename: "settings_sectors",
  //   fields: "Id,hallName",
  //   filter: `facultyId = ${facultyId}`,
  // };

  // try {
  //   const response = yield call(getSectors, get_sectors_req);
  //   yield put(getSectorsSuccess(response));
  // } catch (error) {
  //   yield put(getSectorsFail(error));
  // }
  const get_sectionLabs_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_CourseOffering",
    // filter: `CourseId = ${sectionLabCourse.courseId} and CourseCode=''''${sectionLabCourse.courseCode}''''`,
  };

  try {
    const response = yield call(getSectionLabs, get_sectionLabs_req);
    console.log("wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww", response);
    yield put(getSectionLabsSuccess(response));
  } catch (error) {
    yield put(getSectionLabsFail(error));
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
    console.log("weeeeeeeeeeeeeeeeeeeeeeeeeeeeekday", response);
    yield put(getWeekDaysSuccess(response));
  } catch (error) {
    yield put(getWeekDaysFail(error));
  }

  //get halls
  const get_halls_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_AcadmeyBuildingStructure",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getHalls, get_halls_req);
    console.log("hallllllllllllllls", response);
    yield put(getHallsSuccess(response));
  } catch (error) {
    yield put(getHallsFail(error));
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

function* onAddNewSectionLab({ payload, SectionLab }) {
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
  console.log("in update", payload);
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

function* onDeleteSectionLab({ payload, SectionLab }) {
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
  const get_schedule_timings = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_TeachingSchedule",
    filter: `SectionLabId = ${scheduleTimingSL.Id} and type=''''${scheduleTimingSL.type}''''`,
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
  let filter;
  if (hallTimingSL.check == 0) {
    filter = `hallId = ${hallTimingSL.hallId} and yearSemesterId=''''${hallTimingSL.yearSemesterId}''''`;
  } else {
    filter = `yearSemesterId=''''${hallTimingSL.yearSemesterId}''''`;
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
    filter: `SectionLabId = ${scheduleTimingD.Id} and type=''''${scheduleTimingD.type}''''`,
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
    const response = yield call(getScheduleMsgValue);
    yield put(getScheduleMsgValueSuccess(response));
  } catch (error) {
    yield put(getScheduleMsgValueFail(error));
  }
}

function* classSchedulingSaga() {
  yield takeEvery(GET_ALL_COURSES_OFFERING, fetchAllCoursesOffering);

  yield takeEvery(GET_COURSES_OFFERING, fetchCoursesOffering);
  yield takeEvery(GET_COURSE_OFFERING_PROFILE, fetchCourseOfferingProfile);
  yield takeEvery(GET_METHODS_OF_OFFERING_COURSES, fetchMethodsOffering);
  yield takeEvery(ADD_NEW_COURSE_OFFERING, onAddNewCourseOffering);
  yield takeEvery(UPDATE_COURSE_OFFERING, onUpdateCourseOffering);
  yield takeEvery(DELETE_COURSE_OFFERING, onDeleteCourseOffering);
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

  yield takeEvery(GET_SCHEDULE_MSG_VALUE, onGetScheduleMsgValue);
  yield takeEvery(GET_SECTOR_TIMINGS, fetchSectorTimings);
}

export default classSchedulingSaga;
