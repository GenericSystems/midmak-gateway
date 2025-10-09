import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_ARCHIVED_GRADES, UPDATE_ARCHIVED_GRADE } from "./actionTypes";

import { GET_COURSE_CONTENTS_ENTERED_GRADES } from "../enterGrades/actionTypes";

import { GET_FILTERED_SECTIONS } from "../classScheduling/actionTypes";

import { GET_COURSES_OPT } from "../courses/actionTypes";

import { getCoursesOptSuccess, getCoursesOptFail } from "../courses/actions";

import {
  getCourseStatisticsSuccess,
  getCourseStatisticsFail,
  getCourseContentsEnteredGradesFail,
  getCourseContentsEnteredGradesSuccess,
} from "../enterGrades/actions";

import {
  getFilteredSectionsSuccess,
  getFilteredSectionsFail,
} from "../classScheduling/actions";

import {
  getArchivedGradesSuccess,
  getArchivedGradesFail,
  updateArchivedGradeSuccess,
  updateArchivedGradeFail,
} from "./actions";

// Include Both Helper File with needed methods
import {
  getCourseStatistics,
  getCoursesOpt,
  getCourseContentsEnteredGrades,
  getFilteredSections,
  getArchivedGrades,
  updateArchivedGrade,
} from "../../helpers/fakebackend_helper";

function* fetchArchivedGrades(obj) {
  const course = obj.payload;

  const get_grades_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Current_Common_TrianeeCurriculalinesCheck",
    filter: course.filter,
  };

  try {
    const response = yield call(getArchivedGrades, get_grades_req);
    yield put(getArchivedGradesSuccess(response));
  } catch (error) {
    yield put(getArchivedGradesFail(error));
  }

  const get_info = {
    source: "db",
    procedure: "getCourseStatistics",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_CurriculalinesCheck",
    filter: `courseId = ${course.courseId}`,
  };
  try {
    const response = yield call(getCourseStatistics, get_info);
    yield put(getCourseStatisticsSuccess(response[0]));
  } catch (error) {
    yield put(getCourseStatisticsFail(error));
  }
  const get_preReqCourse_opt = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_CourseOfferingOnly",
    fields: "courseId,Code,courseName",
  };
  try {
    const response = yield call(getCoursesOpt, get_preReqCourse_opt);
    yield put(getCoursesOptSuccess(response));
  } catch (error) {
    yield put(getCoursesOptFail(error));
  }

  const get_courseContents = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_DistributingMethods",
    filter: `courseId = ${course.courseId} or courseId = 0 `,
  };
  try {
    const response = yield call(
      getCourseContentsEnteredGrades,
      get_courseContents
    );
    yield put(getCourseContentsEnteredGradesSuccess(response));
  } catch (error) {
    yield put(getCourseContentsEnteredGradesFail(error));
  }

  const request = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_Section",
    fields: "Id,SectionNumber,courseId",
    filter: `CourseId = ${course.courseId} `,
  };
  try {
    const response = yield call(getFilteredSections, request);
    yield put(getFilteredSectionsSuccess(response));
  } catch (error) {
    yield put(getFilteredSectionsFail(error));
  }
}

function* onUpdateArchivedGrade({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SC_SisApp_updateTraineeGrade";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_CurriculalinesCheck";
  payload["queryname"] = "_Current_Common_TrianeeCurriculalinesCheck";

  try {
    const response = yield call(updateArchivedGrade, payload);
    yield put(updateArchivedGradeSuccess(response[0]));
  } catch (error) {
    yield put(updateArchivedGradeFail(error));
  }
}

function* archiveGradesSaga() {
  yield takeEvery(GET_ARCHIVED_GRADES, fetchArchivedGrades);
  yield takeEvery(UPDATE_ARCHIVED_GRADE, onUpdateArchivedGrade);
}

export default archiveGradesSaga;
