import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import { GET_CHECKED_GRADES, UPDATE_CHECKED_GRADE } from "./actionTypes";

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
  getCheckedGradesSuccess,
  getCheckedGradesFail,
  updateCheckedGradeSuccess,
  updateCheckedGradeFail,
} from "./actions";

// Include Both Helper File with needed methods
import {
  getCheckedGrades,
  getCourseStatistics,
  updateCheckedGrade,
  getCoursesOpt,
  getCourseContentsEnteredGrades,
  getFilteredSections,
} from "../../helpers/fakebackend_helper";

function* fetchCheckedGrades(obj) {
  let course = obj.payload;
  const get_grades_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Current_Common_StudentsCurriculalinesCheck",
    filter: course.filter,
  };
  try {
    const response = yield call(getCheckedGrades, get_grades_req);
    yield put(getCheckedGradesSuccess(response));
  } catch (error) {
    yield put(getCheckedGradesFail(error));
  }

  const get_info = {
    source: "db",
    procedure: "getCourseStatistics",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_StudentsCurriculalinesCheck",
    filter: `courseId = ${course.courseId}`,
  };
  try {
    const response = yield call(getCourseStatistics, get_info);
    yield put(getCourseStatisticsSuccess(response[0]));
  } catch (error) {
    yield put(getCourseStatisticsFail(error));
  }

  // const get_preReqCourse_opt = {
  //   source: "db",
  //   procedure: "Generic_Optiondatalist",
  //   apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  //   tablename: "_Common_CourseOfferingOnly",
  //   fields: "CourseId,courseCode,courseName",
  // };
  // try {
  //   const response = yield call(getCoursesOpt, get_preReqCourse_opt);
  //   yield put(getCoursesOptSuccess(response));
  // } catch (error) {
  //   yield put(getCoursesOptFail(error));
  // }

  // const get_courseContents = {
  //   source: "db",
  //   procedure: "SisApp_getData",
  //   apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  //   tablename: "_Common_DistributingMethods",
  //   filter: `courseId = ${course.courseId} `,
  // };
  // try {
  //   const response = yield call(
  //     getCourseContentsEnteredGrades,
  //     get_courseContents
  //   );
  //   yield put(getCourseContentsEnteredGradesSuccess(response));
  // } catch (error) {
  //   yield put(getCourseContentsEnteredGradesFail(error));
  // }
}

function* onUpdateCheckedGrade({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SC_SisApp_updateStudentGrade";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_StudentsCurriculalinesCheck";
  payload["queryname"] = "_Current_Common_StudentsCurriculalinesCheck";

  try {
    const respupdate = yield call(updateCheckedGrade, payload);
    yield put(updateCheckedGradeSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateCheckedGradeFail(error));
  }
}

// function* fetchFilteredSections(obj) {
//   let schedulingLec = obj.payload;
//   const get_filtered_Sections = {
//     source: "db",
//     procedure: "Generic_getOptions",
//     apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
//     tablename: "Common_Section",
//     fields: "Id,SectionNumber,CourseCode",
//     filter: `CourseId = ${schedulingLec.courseId} and CourseCode = ''''${schedulingLec.CourseCode}'''' `,
//   };
//   try {
//     const response = yield call(getFilteredSections, get_filtered_Sections);
//     yield put(getFilteredSectionsSuccess(response));
//   } catch (error) {
//     yield put(getFilteredSectionsFail(error));
//   }
// }

function* checkedGradesSaga() {
  yield takeEvery(GET_CHECKED_GRADES, fetchCheckedGrades);
  yield takeEvery(UPDATE_CHECKED_GRADE, onUpdateCheckedGrade);
  // yield takeEvery(GET_FILTERED_SECTIONS, fetchFilteredSections);
}

export default checkedGradesSaga;
