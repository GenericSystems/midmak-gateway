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
  ADD_NEW_SECTION_LAB_DETAIL,
  DELETE_SECTION_LAB,
  DELETE_SECTION_LAB_DETAIL,
  UPDATE_SECTION_LAB,
  UPDATE_SECTION_LAB_DETAIL,
  GET_SCHEDULE_TIMINGS,
  GET_SCHEDULE_TIMING_PROFILE,
  ADD_NEW_SCHEDULE_TIMING,
  DELETE_SCHEDULE_TIMING,
  GET_SCHEDULE_TIMING_DESCS,
  GET_SCHEDULE_MSG_VALUE,
  GET_HALL_TIMINGS,
  GET_METHODS_OF_OFFERING_COURSES,
  GET_SECTION_LAB_DETAILS,
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
  addSectionLabDetailFail,
  addSectionLabDetailSuccess,
  updateSectionLabSuccess,
  updateSectionLabFail,
  updateSectionLabDetailSuccess,
  updateSectionLabDetailFail,
  deleteSectionLabSuccess,
  deleteSectionLabFail,
  deleteSectionLabDetailSuccess,
  deleteSectionLabDetailFail,
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
  getHallTimingsSuccess,
  getHallTimingsFail,
  getMethodsOfOfferingCoursesSuccess,
  getMethodsOfOfferingCoursesFail,
  getSectionLabDetailsSuccess,
  getSectionLabDetailsFail,
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

import {
  getEmployeesNamesSuccess,
  getEmployeesNamesFail,
} from "../HR/employees/actions";

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
  addNewSectionLabDetail,
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
  getHallTimings,
  getMethodsOfOfferingCourses,
  getYears,
  getHalls,
  getEmployeesNames,
  updateSectionLabDetail,
  deleteSectionLabDetail,
  getSectionLabDetails,
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

function* fetchCoursesOffering(selectedpayload) {
  let lang = selectedpayload.payload;

  console.log("979898989898989898", lang);

  const titleField = lang === "en" ? "enTitle" : "arTitle";
  const payload = {};

  payload["source"] = "db";
  payload["procedure"] = "SisApp_getData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "_Common_CourseOffering";
  payload["filter"] = `isOffered = 1`;

  try {
    const response = yield call(getCoursesOffering, payload);
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

function* fetchAllCoursesOffering() {
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
  let lang = obj.payload.languageState;
  let dataobject = obj.payload;

  console.log("lannnnnnnnnnnnnnnnnnnnn", lang);

  const titleField = lang === "en" ? "enTitle" : "arTitle";
  let sectionLabCourse = dataobject.branchData;
  console.log("obj", sectionLabCourse);
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

  // form thisssssssssssss
  const payload = {};

  payload["source"] = "db";
  payload["procedure"] = "SisApp_getData";
  payload[" apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "_SectionsLabs";
  payload[
    "filter"
  ] = `courseId = ${sectionLabCourse.courseId} and courseOfferingId=''''${sectionLabCourse.Id}''''`;

  try {
    const response = yield call(getSectionLabs, payload);
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
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_Hall",
    fields: `Id,${titleField}`,
  };
  try {
    const response = yield call(getHalls, get_halls_req);
    console.log("hallllllllllllllls", response);
    yield put(getHallsSuccess(response));
  } catch (error) {
    yield put(getHallsFail(error));
  }

  //get instructor
  const get_instructor_opt = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_EmployeeOption",
    fields: "Id,fullName",
  };
  try {
    const response = yield call(getEmployeesNames, get_instructor_opt);
    console.log("employeeName", response);
    yield put(getEmployeesNamesSuccess(response));
  } catch (error) {
    yield put(getEmployeesNamesFail(error));
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
  console.log("in adddddddddddddddd", payload);

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
  console.log("objobjobjobj", obj);
  const get_schedule_timings = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_TeachingSchedule",
    filter: `SectionLabId = ${scheduleTimingSL.Id} and type=''''${scheduleTimingSL.type}''''`,
  };
  try {
    const response = yield call(getScheduleTimings, get_schedule_timings);
    console.log("reeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeep", response);

    yield put(getScheduleTimingsSuccess(response));
  } catch (error) {
    yield put(getScheduleTimingsFail(error));
  }
}

function* fetchHallTimings(obj) {
  let hallTimingSL = obj.payload;
  let filter;
  if (hallTimingSL.check == 0) {
    filter = `hallId = ${hallTimingSL.hallId} `;
  }
  const get_hall_timings = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_scheduleTimingsDescriptionDetails",
    filter: filter,
  };
  try {
    const response = yield call(getHallTimings, get_hall_timings);
    console.log("haaaaaal", response);
    yield put(getHallTimingsSuccess(response));
  } catch (error) {
    yield put(getHallTimingsFail(error));
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

function* fetchSectionLabDetails() {
  // let scheduleTimingD = obj.payload;
  const get_SectionLabDetail = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_TeachingSchedule",
    queryname: "_scheduleTimingsDescription",

    // filter: `SectionLabId = ${scheduleTimingD.Id} and type=''''${scheduleTimingD.type}''''`,
  };
  try {
    const response = yield call(getSectionLabDetails, get_SectionLabDetail);

    yield put(getSectionLabDetailsSuccess(response));
  } catch (error) {
    yield put(getSectionLabDetailsFail(error));
  }
}

function* onAddNewSectionLabDetail({ payload, scheduleTiming }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_TeachingSchedule";
  payload["queryname"] = "_scheduleTimingsDescription";

  try {
    const response = yield call(addNewSectionLabDetail, payload);
    console.log("reeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeaddddddddd", response);

    // response.map(resp => {
    //   resp["instructorsId"] = JSON.parse(resp["instructorsId"]);
    // });
    yield put(addSectionLabDetailSuccess(response[0]));
  } catch (error) {
    yield put(addSectionLabDetailFail(error));
  }
}

function* onUpdateSectionLabDetail({ payload }) {
  console.log("in update", payload);
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["queryname"] = "Common_TeachingSchedule";

  try {
    const respupdate = yield call(updateSectionLabDetail, payload);
    yield put(updateSectionLabDetailSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateSectionLabDetailFail(error));
  }
}

function* onDeleteSectionLabDetail({ payload, scheduleTiming }) {
  console.log("payloadDelete", payload);
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_TeachingSchedule";

  try {
    const respdelete = yield call(deleteSectionLabDetail, payload);
    console.log("reeeeeeeeeeeeeeewwwwwwwwwwdddd", respdelete);

    yield put(deleteSectionLabDetailSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteSectionLabDetailFail(error));
  }
}

function* onAddNewScheduleTiming({ payload, scheduleTiming }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
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
  console.log("payloadDelete", payload);
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
    console.log("aaaaaaaaaaaaaaaa99999999999999", response);
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
  yield takeEvery(ADD_NEW_SECTION_LAB_DETAIL, onAddNewSectionLabDetail);
  yield takeEvery(UPDATE_SECTION_LAB, onUpdateSectionLab);
  yield takeEvery(UPDATE_SECTION_LAB_DETAIL, onUpdateSectionLabDetail);
  yield takeEvery(DELETE_SECTION_LAB, onDeleteSectionLab);
  yield takeEvery(DELETE_SECTION_LAB_DETAIL, onDeleteSectionLabDetail);
  yield takeEvery(GET_SCHEDULE_TIMINGS, fetchScheduleTimings);
  yield takeEvery(GET_SCHEDULE_TIMING_PROFILE, fetchScheduleTimingProfile);
  yield takeEvery(ADD_NEW_SCHEDULE_TIMING, onAddNewScheduleTiming);
  yield takeEvery(DELETE_SCHEDULE_TIMING, onDeleteScheduleTiming);
  yield takeEvery(GET_SCHEDULE_TIMING_DESCS, fetchScheduleTimingDescs);
  yield takeEvery(GET_SECTION_LAB_DETAILS, fetchSectionLabDetails);

  yield takeEvery(GET_SCHEDULE_MSG_VALUE, onGetScheduleMsgValue);
  yield takeEvery(GET_HALL_TIMINGS, fetchHallTimings);
}

export default classSchedulingSaga;
