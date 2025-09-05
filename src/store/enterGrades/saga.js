import { call, put, takeEvery } from "redux-saga/effects";

// Action Types
import {
  GET_ENTERED_GRADES,
  UPDATE_ENTERED_GRADE,
  GET_COURSE_CONTENTS_ENTERED_GRADES,
  GET_COURSE_STATISTICS,
} from "./actionTypes";

import { GET_FILTERED_SECTIONS } from "../classScheduling/actionTypes";
import { GET_COURSES_OPT } from "../courses/actionTypes";

// Course-related Actions
import { getCoursesOptSuccess, getCoursesOptFail } from "../courses/actions";

// Scheduling Actions
import {
  getFilteredSectionsSuccess,
  getFilteredSectionsFail,
} from "../classScheduling/actions";

// Grade-related Actions
import {
  getEnteredGradesSuccess,
  getEnteredGradesFail,
  getCourseStatisticsSuccess,
  getCourseStatisticsFail,
  updateEnteredGradeSuccess,
  updateEnteredGradeFail,
  getCourseContentsEnteredGradesSuccess,
  getCourseContentsEnteredGradesFail,
} from "./actions";

// API Helpers
import {
  getEnteredGrades,
  getCourseStatistics,
  updateEnteredGrade,
  getCoursesOpt,
  getCourseContentsEnteredGrades,
  getFilteredSections,
} from "../../helpers/fakebackend_helper";

function* fetchEnteredGrades({ payload }) {
  console.log("payloadpayloadpayloadpayload", payload);
  const request = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Current_Common_TrianeeCurriculalines",
    filter: payload.filter,
  };
  try {
    const response = yield call(getEnteredGrades, request);
    yield put(getEnteredGradesSuccess(response));
  } catch (error) {
    yield put(getEnteredGradesFail(error));
  }
}

function* fetchCourseStatistics({ payload }) {
  const request = {
    source: "db",
    procedure: "getCourseStatistics",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_Curriculalines",
    filter: `courseId = ${payload.courseId}`,
    flag: payload.flag,
  };
  try {
    const response = yield call(getCourseStatistics, request);
    yield put(getCourseStatisticsSuccess(response));
  } catch (error) {
    yield put(getCourseStatisticsFail(error));
  }
}

function* fetchCourseContentsEnteredGrades({ payload }) {
  const request = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_DistributingMethods",
    filter: `courseId = ${payload.courseId} `,
  };
  try {
    const response = yield call(getCourseContentsEnteredGrades, request);
    console.log("wwwwwwwwwwwww", response);
    yield put(getCourseContentsEnteredGradesSuccess(response));
  } catch (error) {
    yield put(getCourseContentsEnteredGradesFail(error));
  }
}

function* onUpdateEnteredGrade({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SC_SisApp_updateStudentGrade";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_Curriculalines";
  payload["queryname"] = "_Current_Common_TrianeeCurriculalines";

  try {
    const response = yield call(updateEnteredGrade, payload);
    yield put(updateEnteredGradeSuccess(response[0]));
  } catch (error) {
    yield put(updateEnteredGradeFail(error));
  }
}

function* fetchCoursesOpt() {
  const getCourseOptions = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_CourseOfferingOnly",
    fields: "courseId,Code,courseName",
  };
  try {
    const response = yield call(getCoursesOpt, getCourseOptions);
    console.log("reeeeeeeeeeees", response);
    yield put(getCoursesOptSuccess(response));
  } catch (error) {
    yield put(getCoursesOptFail(error));
  }
}

function* fetchFilteredSections({ payload }) {
  const request = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_Section",
    fields: "Id,SectionNumber,courseId",
    filter: `CourseId = ${payload.courseId} `,
  };
  try {
    const response = yield call(getFilteredSections, request);
    yield put(getFilteredSectionsSuccess(response));
  } catch (error) {
    yield put(getFilteredSectionsFail(error));
  }
}

function* enteredGradesSaga() {
  yield takeEvery(GET_ENTERED_GRADES, fetchEnteredGrades);
  yield takeEvery(UPDATE_ENTERED_GRADE, onUpdateEnteredGrade);
  yield takeEvery(
    GET_COURSE_CONTENTS_ENTERED_GRADES,
    fetchCourseContentsEnteredGrades
  );
  yield takeEvery(GET_COURSE_STATISTICS, fetchCourseStatistics);

  yield takeEvery(GET_COURSES_OPT, fetchCoursesOpt);
  yield takeEvery(GET_FILTERED_SECTIONS, fetchFilteredSections);
}

export default enteredGradesSaga;
