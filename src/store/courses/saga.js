import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_COURSES,
  ADD_NEW_COURSE,
  DELETE_COURSE,
  UPDATE_COURSE,
  GET_COURSE_REQUIRED_COURSES,
  GET_COURSES_OPT,
  ADD_NEW_COURSE_REQUIRED_COURSE,
  DELETE_COURSE_REQUIRED_COURSE,
  UPDATE_COURSE_REQUIRED_COURSE,
  GET_COURSE_DELETED_VALUE,
} from "./actionTypes";

import { GET_FILTERED_DEPARTMENTS } from "../departments/actionTypes";

import {
  getCourseContentsSuccess,
  getCourseContentsFail,
} from "../coursecontents/actions";

import {
  getPrereqsSuccess,
  getPrereqsFail,
} from "../prereq-conditions/actions";

import {
  getCourseTypesSuccess,
  getCourseTypesFail,
} from "../coursetypes/actions";

import {
  getFacultiesSuccess,
  getFacultiesFail,
} from "../mob-app-faculty-accs/actions";

import {
  getDepartmentsSuccess,
  getDepartmentsFail,
  getFilteredDepartmentsSuccess,
  getFilteredDepartmentsFail,
} from "../departments/actions";

import { getLevelsSuccess, getLevelsFail } from "../levels/actions";

import {
  getCoursesSuccess,
  getCoursesFail,
  addCourseFail,
  addCourseSuccess,
  updateCourseSuccess,
  updateCourseFail,
  deleteCourseSuccess,
  deleteCourseFail,
  getCourseContentsCourseSuccess,
  getCourseContentsCourseFail,
  addCourseContentCourseFail,
  addCourseContentCourseSuccess,
  updateCourseContentCourseSuccess,
  updateCourseContentCourseFail,
  deleteCourseContentCourseSuccess,
  deleteCourseContentCourseFail,
  getCourseRequiredCoursesSuccess,
  getCourseRequiredCoursesFail,
  getCoursesOptSuccess,
  getCoursesOptFail,
  addCourseRequiredCourseFail,
  addCourseRequiredCourseSuccess,
  updateCourseRequiredCourseSuccess,
  updateCourseRequiredCourseFail,
  deleteCourseRequiredCourseSuccess,
  deleteCourseRequiredCourseFail,
  getCourseDeletedValueSuccess,
  getCourseDeletedValueFail,
} from "./actions";

// Include Both Helper File with needed methods
import {
  getCourses,
  addNewCourse,
  updateCourse,
  deleteCourse,
  getCourseContentsCourse,
  addNewCourseContentCourse,
  updateCourseContentCourse,
  deleteCourseContentCourse,
  getCourseRequiredCourses,
  addNewCourseRequiredCourse,
  updateCourseRequiredCourse,
  deleteCourseRequiredCourse,
  getCourseContents,
  getPrereqs,
  getCoursesOpt,
  getCourseTypes,
  getLevels,
  getFaculties,
  getDepartments,
  getCourseDeletedValue,
  getFilteredDepartments,
} from "../../helpers/fakebackend_helper";

//import { GET_FILTERED_DEPARTMENTS } from "helpers/url_helper";

function* fetchCourses() {
  const get_courses_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_Course",
  };
  try {
    const response = yield call(getCourses, get_courses_req);
    response.map(resp => {
      resp["CoursesContents"] = JSON.parse(resp["CoursesContents"]);
      resp["CoursePrerequisites"] = JSON.parse(resp["CoursePrerequisites"]);
    });
    yield put(getCoursesSuccess(response));
  } catch (error) {
    yield put(getCoursesFail(error));
  }

  //get course type
  const get_course_courseType = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_courseTypes",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getCourseTypes, get_course_courseType);
    yield put(getCourseTypesSuccess(response));
  } catch (error) {
    yield put(getCourseTypesFail(error));
  }

  //get course level
  const get_course_courseLevel = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_Levels",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getLevels, get_course_courseLevel);
    yield put(getLevelsSuccess(response));
  } catch (error) {
    yield put(getLevelsFail(error));
  }

  //get contents options
  const get_courseContents_opt = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_CourseContents",
    fields: "Id,arTitle,defaultValue",
  };
  try {
    const response = yield call(getCourseContents, get_courseContents_opt);
    yield put(getCourseContentsSuccess(response));
  } catch (error) {
    yield put(getCourseContentsFail(error));
  }

  //get rquired course options
  const get_preReqCourse_opt = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_CourseOfferingOnly",
    fields: "Id,code,arCourseName",
  };
  try {
    const response = yield call(getCoursesOpt, get_preReqCourse_opt);
    yield put(getCoursesOptSuccess(response));
  } catch (error) {
    yield put(getCoursesOptFail(error));
  }

  //get rquired course conditions options
  const get_preReqConditions_opt = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_prerequisitesConditions",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getPrereqs, get_preReqConditions_opt);
    yield put(getPrereqsSuccess(response));
  } catch (error) {
    yield put(getPrereqsFail(error));
  }

  //get faculty
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
}
function* fetchFilteredDepartments(obj) {
  let faculty = obj.payload;
  console.log("faculty", faculty);
  const get_department_opt = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_Department",
    fields: "Id,arTitle,facultyId",
    filter: `facultyId = ${faculty.facultyId}`,
  };
  try {
    const response = yield call(getFilteredDepartments, get_department_opt);
    yield put(getFilteredDepartmentsSuccess(response));
  } catch (error) {
    yield put(getFilteredDepartmentsFail(error));
  }
}
function* onAddNewCourse({ payload, course }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "Course_Add";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_Course";
  payload["queryname"] = "_Common_Course";

  try {
    const response = yield call(addNewCourse, payload);
    response.map(resp => {
      resp["CoursesContents"] = JSON.parse(resp["CoursesContents"]);
      resp["CoursePrerequisites"] = JSON.parse(resp["CoursePrerequisites"]);
    });
    yield put(addCourseSuccess(response[0]));
  } catch (error) {
    yield put(addCourseFail(error));
  }
}

function* onUpdateCourse({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "Course_Update";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_Course";
  payload["queryname"] = "_Common_Course";

  try {
    const respupdate = yield call(updateCourse, payload);
    respupdate.map(resp => {
      resp["CoursesContents"] = JSON.parse(resp["CoursesContents"]);
      resp["CoursePrerequisites"] = JSON.parse(resp["CoursePrerequisites"]);
    });
    yield put(updateCourseSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateCourseFail(error));
  }
}

function* onDeleteCourse({ payload, course }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_Course";
  //payload["queryname"] = "_Common_Course";

  try {
    const respdelete = yield call(deleteCourse, payload);
    yield put(deleteCourseSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteCourseFail(error));
  }
}

function* fetchCourseRequiredCourses(obj) {
  let course = obj.payload;
  let course_courseContent = obj.payload;

  const get_course_required_courses_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_CoursePrerequisitesNew",
    filter: `courseId = ${course.Id}  and  courseCode = ''''${course.code}'''' `,
  };
  try {
    const response = yield call(
      getCourseRequiredCourses,
      get_course_required_courses_req
    );
    yield put(getCourseRequiredCoursesSuccess(response));
  } catch (error) {
    yield put(getCourseRequiredCoursesFail(error));
  }
}

function* onAddNewCourseRequiredCourse({ payload, reqCourse }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_CoursePrerequisitesNew";

  try {
    const response = yield call(addNewCourseRequiredCourse, payload);
    yield put(addCourseRequiredCourseSuccess(response[0]));
  } catch (error) {
    yield put(addCourseRequiredCourseFail(error));
  }
}

function* onUpdateCourseRequiredCourse({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_CoursePrerequisitesNew";
  try {
    const respupdate = yield call(updateCourseRequiredCourse, payload);
    yield put(updateCourseRequiredCourseSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateCourseRequiredCourseFail(error));
  }
}

function* onDeleteCourseRequiredCourse({ payload, reqCourse }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_CoursePrerequisitesNew";

  try {
    const respdelete = yield call(deleteCourseRequiredCourse, payload);
    yield put(deleteCourseRequiredCourseSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteCourseRequiredCourseFail(error));
  }
}

function* onGetCourseDeletedValue() {
  try {
    const response = yield call(getCourseDeletedValue);
    yield put(getCourseDeletedValueSuccess(response));
  } catch (error) {
    yield put(getCourseDeletedValueFail(error));
  }
}

function* coursesSaga() {
  yield takeEvery(GET_COURSES, fetchCourses);
  yield takeEvery(ADD_NEW_COURSE, onAddNewCourse);
  yield takeEvery(UPDATE_COURSE, onUpdateCourse);
  yield takeEvery(DELETE_COURSE, onDeleteCourse);
  yield takeEvery(GET_FILTERED_DEPARTMENTS, fetchFilteredDepartments);
  yield takeEvery(GET_COURSE_REQUIRED_COURSES, fetchCourseRequiredCourses);
  yield takeEvery(ADD_NEW_COURSE_REQUIRED_COURSE, onAddNewCourseRequiredCourse);
  yield takeEvery(UPDATE_COURSE_REQUIRED_COURSE, onUpdateCourseRequiredCourse);
  yield takeEvery(DELETE_COURSE_REQUIRED_COURSE, onDeleteCourseRequiredCourse);
  yield takeEvery(GET_COURSE_DELETED_VALUE, onGetCourseDeletedValue);
}

export default coursesSaga;
