import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_GRADES,
  UPDATE_GRADE,
  GET_COURSE_CONTENTS_ENTERED_GRADES,
  GET_COURSES_OPT,
} from "./actionTypes";

import {
  getGradesSuccess,
  getGradesFail,
  updateGradeSuccess,
  updateGradeFail,
  getCourseContentsEnteredGradesSuccess,
  getCourseContentsEnteredGradesFail,
  getCoursesOptSuccess,
  getCoursesOptFail,
} from "./actions";

// Include Both Helper File with needed methods
import {
  getCourseContentsEnteredGrades,
  getGrades,
  updateGrade,
  getCoursesOpt,
} from "../../helpers/fakebackend_helper";

function* fetchGrades(obj) {
  const course = obj.payload;

  const get_grades_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_CurriculalinesWithCheck",
    filter: course.filter,
  };

  try {
    const response = yield call(getGrades, get_grades_req);
    yield put(getGradesSuccess(response));
  } catch (error) {
    yield put(getGradesFail(error));
  }
}
function* fetchCourses() {
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
}
function* fetchCoursesContents(obj) {
  const course = obj.payload;

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
}

function* onUpdateGrade({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_Curriculalines";
  payload["queryname"] = "_Common_CurriculalinesWithCheck";

  try {
    const response = yield call(updateGrade, payload);
    yield put(updateGradeSuccess(response[0]));
  } catch (error) {
    yield put(updateGradeFail(error));
  }
}

function* GradesSaga() {
  yield takeEvery(GET_GRADES, fetchGrades);
  yield takeEvery(UPDATE_GRADE, onUpdateGrade);
  yield takeEvery(GET_COURSES_OPT, fetchCourses);
  yield takeEvery(GET_COURSE_CONTENTS_ENTERED_GRADES, fetchCoursesContents);
}

export default GradesSaga;
