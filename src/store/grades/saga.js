import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_GRADES,
  UPDATE_GRADE,
  GET_COURSE_CONTENTS_GRADES,
  GET_COURSE_STATISTICS,
} from "./actionTypes";

import { GET_FILTERED_SECTIONS } from "../scheduling-lectures/actionTypes";

import { GET_COURSES_OPT } from "../courses/actionTypes";

import { getCoursesOptSuccess, getCoursesOptFail } from "../courses/actions";

import {
  getFilteredSectionsSuccess,
  getFilteredSectionsFail,
} from "../scheduling-lectures/actions";

import {
  getCurrentSemesterSuccess,
  getCurrentSemesterFail,
} from "../semesters/actions";

import {
  getGradesSuccess,
  getGradesFail,
  getCourseStatisticsSuccess,
  getCourseStatisticsFail,
  updateGradeSuccess,
  updateGradeFail,
  getCourseContentsGradesSuccess,
  getCourseContentsGradesFail,
} from "./actions";

// Include Both Helper File with needed methods
import {
  getGrades,
  getCourseStatistics,
  updateGrade,
  getCoursesOpt,
  getCourseContentsGrades,
  getFilteredSections,
  getCurrentSemester,

} from "../../helpers/fakebackend_helper";

function* fetchGrades(obj) {
  let course = obj.payload;
  const get_grades_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Current_Common_StudentsCurriculalines",
    filter: course.filter,
  };
  try {
    const response = yield call(getGrades, get_grades_req);
    yield put(getGradesSuccess(response));
  } catch (error) {
    yield put(getGradesFail(error));
  }
}

function* fetchCourseStatistics(obj) {
  let course = obj.payload;
  const get_info = {
    source: "db",
    procedure: "getCourseStatistics",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_StudentsCurriculalines",
    filter: `courseId = ${course.courseId}`,
    flag: course.flag,
  };
  try {
    const response = yield call(getCourseStatistics, get_info);
    yield put(getCourseStatisticsSuccess(response));
  } catch (error) {
    yield put(getCourseStatisticsFail(error));
  }
}

function* fetchCoursesOpt() {
  //get rquired course options
  const get_preReqCourse_opt = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_courseOffering",
    fields: "CourseId,courseCode,courseName",
  };
  try {
    const response = yield call(getCoursesOpt, get_preReqCourse_opt);
    yield put(getCoursesOptSuccess(response));
  } catch (error) {
    yield put(getCoursesOptFail(error));
  }

  //get current semester
  const get_current_semester = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_SystemCurrentSemester",
   filter: "facultyNum = 0 or facultyNum is null",
  };
  try {
    const response = yield call(getCurrentSemester, get_current_semester);
    yield put(getCurrentSemesterSuccess(response[0]));
  } catch (error) {
    yield put(getCurrentSemesterFail(error));
  }
}

function* fetchCourseContentsGrades(obj) {
  let course = obj.payload;
  //get rquired course columns
  const get_courseContents = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_DistributingMethods",
    filter: `courseId = ${course.courseId} or courseId = 0`,
  };
  try {
    const response = yield call(getCourseContentsGrades, get_courseContents);
    yield put(getCourseContentsGradesSuccess(response));
  } catch (error) {
    yield put(getCourseContentsGradesFail(error));
  }
}

function* onUpdateGrade({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SC_SisApp_updateStudentGrade";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_StudentsCurriculalines";
  payload["queryname"] = "_Current_Common_StudentsCurriculalines";

  try {
    const respupdate = yield call(updateGrade, payload);
    yield put(updateGradeSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateGradeFail(error));
  }
}

function* fetchFilteredSections(obj) {
  let schedulingLec = obj.payload;
  const get_filtered_Sections = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_Section",
    fields: "Id,SectionNumber,CourseCode,yearSemesterId",
    filter: `CourseId = ${schedulingLec.courseId} and CourseCode = ''''${schedulingLec.CourseCode}'''' and  yearSemesterId = ${schedulingLec.yearSemesterId} `,
  };
  try {
    const response = yield call(getFilteredSections, get_filtered_Sections);
    yield put(getFilteredSectionsSuccess(response));
  } catch (error) {
    yield put(getFilteredSectionsFail(error));
  }
}

function* gradesSaga() {
  yield takeEvery(GET_COURSE_STATISTICS, fetchCourseStatistics);
  yield takeEvery(GET_GRADES, fetchGrades);
  yield takeEvery(GET_COURSES_OPT, fetchCoursesOpt);
  yield takeEvery(GET_COURSE_CONTENTS_GRADES, fetchCourseContentsGrades);
  yield takeEvery(UPDATE_GRADE, onUpdateGrade);
  yield takeEvery(GET_FILTERED_SECTIONS, fetchFilteredSections);
}

export default gradesSaga;
