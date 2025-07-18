import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_DISTRIBUTING_COURSES_METHODS,
  ADD_NEW_DISTRIBUTING_COURSES_METHOD,
  UPDATE_DISTRIBUTING_COURSES_METHOD,
  DELETE_DISTRIBUTING_COURSES_METHOD,
  GET_DISTRIBUTING_COURSES_METHODS_CONTENTS,
  ADD_NEW_DISTRIBUTING_COURSES_METHOD_CONTENT,
  UPDATE_DISTRIBUTING_COURSES_METHOD_CONTENT,
  DELETE_DISTRIBUTING_COURSES_METHOD_CONTENT,
  GET_DISTRIBUTING_COURSES,
  ADD_NEW_DISTRIBUTING_COURSE,
  DELETE_DISTRIBUTING_COURSE,
  COPY_DISTRIBUTING_METHODS,
  COPY_DISTRIBUTING_METHODS_SUCCESS,
  COPY_DISTRIBUTING_METHODS_FAIL,
} from "./actionTypes";

import {
  getDistributingCoursesMethodsSuccess,
  getDistributingCoursesMethodsFail,
  addDistributingCoursesMethodSuccess,
  addDistributingCoursesMethodFail,
  updateDistributingCoursesMethodSuccess,
  updateDistributingCoursesMethodFail,
  deleteDistributingCoursesMethodSuccess,
  deleteDistributingCoursesMethodFail,
  getDistributingCoursesMethodContentsSuccess,
  getDistributingCoursesMethodsContentsFail,
  addDistributingCoursesMethodContentSuccess,
  addDistributingCoursesMethodContentFail,
  updateDistributingCoursesMethodContentSuccess,
  updateDistributingCoursesMethodContentFail,
  deleteDistributingCoursesMethodContentSuccess,
  deleteDistributingCoursesMethodContentFail,
  getDistributingCoursesSuccess,
  getDistributingCoursesFail,
  addDistributingCourseSuccess,
  addDistributingCourseFail,
  deleteDistributingCourseSuccess,
  deleteDistributingCourseFail,
  copyDistributingMethodsSuccess,
  copyDistributingMethodsFail,
} from "./actions";

// Include Both Helper File with needed methods
import {
  getDistributingCoursesMethods,
  addDistributingCoursesMethod,
  updateDistributingCoursesMethod,
  deleteDistributingCoursesMethod,
  getCourseContents,
  getDistributingCoursesMethodsContents,
  addDistributingCoursesMethodsContent,
  updateDistributingCoursesMethodsContent,
  deleteDistributingCoursesMethodsContent,
  getCourses,
  getDistributingCourses,
  addDistributingCourse,
  deleteDistributingCourse,
  getCurrentSemester,
  copyDistributingMethods,
  getGradeTypes,
} from "../../helpers/fakebackend_helper";

import {
  getCourseContentsSuccess,
  getCourseContentsFail,
} from "../coursecontents/actions";

import {
  getGradeTypesSuccess,
  getGradeTypesFail,
} from "../grade-types/actions";

import { getCoursesSuccess, getCoursesFail } from "../courses/actions";

import {
  getCurrentSemesterSuccess,
  getCurrentSemesterFail,
} from "../semesters/actions";

function* fetchDistributingCoursesMethods() {
  /* const get_CourseContents = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_CourseContents",
    fields: "Id,arTitle,defaultValue",
  };
  try {
    const response = yield call(getCourseContents, get_CourseContents);

    yield put(getCourseContentsSuccess(response));
  } catch (error) {
    yield put(getCourseContentsFail(error));
  } */

  const get_grades_type_content = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_GradeType",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getGradeTypes, get_grades_type_content);

    yield put(getGradeTypesSuccess(response));
  } catch (error) {
    yield put(getGradeTypesFail(error));
  }

  /* const get_Coursesdatalist = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_Course",
    fields: "Id,arCourseName,code",
  };
  try {
    const response = yield call(getCourses, get_Coursesdatalist);

    yield put(getCoursesSuccess(response));
  } catch (error) {
    yield put(getCoursesFail(error));
  } */
  /* 
  const get_current_semester = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_SystemCurrentSemester",
    filter: "facultyNum = 0 or facultyNum is null",
  };
  let cursem = null
  try {
    const response = yield call(getCurrentSemester, get_current_semester);
    cursem = response
    yield put(getCurrentSemesterSuccess(response[0]));
  } catch (error) {
    yield put(getCurrentSemesterFail(error));
  }
 */

  const get_settings_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_DistributingMethods",
    // filter: `yearSemesterId = ${cursem[0].cuYearSemesterId}`,
  };
  try {
    const response = yield call(
      getDistributingCoursesMethods,
      get_settings_req
    );
    yield put(getDistributingCoursesMethodsSuccess(response));
  } catch (error) {
    yield put(getDistributingCoursesMethodsFail(error));
  }
}

function* onAddNewDistributingCoursesMethod({
  payload,
  distributingCoursesMethod,
}) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_DistributingMethods";
  try {
    const response = yield call(addDistributingCoursesMethod, payload);
    yield put(addDistributingCoursesMethodSuccess(response[0]));
  } catch (error) {
    yield put(addDistributingCoursesMethodFail(error));
  }
}

///updateDistributingCoursesMethod

function* onUpdateDistributingCoursesMethod({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_DistributingMethods";
  try {
    const respupdate = yield call(updateDistributingCoursesMethod, payload);

    yield put(updateDistributingCoursesMethodSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateDistributingCoursesMethodFail(error));
  }
}

function* onDeleteDistributingCoursesMethod({
  payload,
  distributingCoursesMethod,
}) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_DistributingMethods";
  try {
    const respdelete = yield call(deleteDistributingCoursesMethod, payload);
    yield put(deleteDistributingCoursesMethodSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteDistributingCoursesMethodFail(error));
  }
}

function* fetchDistributingCoursesMethodsContents(obj) {
  let distributingContent = obj.payload;
  const get_settings_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_DistributingMethodContents",
    filter: `distributingMethodId = ${distributingContent.Id}`,
  };
  try {
    const response = yield call(
      getDistributingCoursesMethodsContents,
      get_settings_req
    );
    yield put(getDistributingCoursesMethodContentsSuccess(response));
  } catch (error) {
    yield put(getDistributingCoursesMethodsContentsFail(error));
  }
}

function* onAddNewDistributingCoursesMethodContent({
  payload,
  distributingCoursesMethodContent,
}) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_DistributingMethodContents";
  try {
    const response = yield call(addDistributingCoursesMethodsContent, payload);
    yield put(addDistributingCoursesMethodContentSuccess(response[0]));
  } catch (error) {
    yield put(addDistributingCoursesMethodContentFail(error));
  }
}
function* onUpdateDistributingCoursesMethodContent({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_DistributingMethodContents";
  try {
    const respupdate = yield call(
      updateDistributingCoursesMethodsContent,
      payload
    );
    yield put(updateDistributingCoursesMethodContentSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateDistributingCoursesMethodContentFail(error));
  }
}

function* onDeleteDistributingCoursesMethodContent({
  payload,
  distributingCoursesMethodContent,
}) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_DistributingMethodContents";
  try {
    const respdelete = yield call(
      deleteDistributingCoursesMethodsContent,
      payload
    );
    yield put(deleteDistributingCoursesMethodContentSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteDistributingCoursesMethodContentFail(error));
  }
}

//

function* fetchDistributingCourses(obj) {
  let distCourse = obj.payload;
  const get_settings_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_DistributingCourses",
    filter: `distributingMethodId   = ${distCourse.Id}`,
  };
  try {
    const response = yield call(getDistributingCourses, get_settings_req);
    yield put(getDistributingCoursesSuccess(response));
  } catch (error) {
    yield put(getDistributingCoursesFail(error));
  }
}

function* onAddNewDistributingCourse({ payload, distributingCourse }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_DistributingCourses";
  try {
    const response = yield call(addDistributingCourse, payload);
    yield put(addDistributingCourseSuccess(response[0]));
  } catch (error) {
    yield put(addDistributingCourseFail(error));
  }
}

function* onDeleteDistributingCourse({ payload, distributingCourse }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_DistributingCourses";
  try {
    const respdelete = yield call(deleteDistributingCourse, payload);
    yield put(deleteDistributingCourseSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteDistributingCourseFail(error));
  }
}

function* onCopyDistributingMethods() {
  const copydistmeth = {
    source: "db",
    procedure: "copyDistributingMethods",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  };

  try {
    const response = yield call(copyDistributingMethods, copydistmeth);
    yield put(getDistributingCoursesMethodsSuccess(response));
  } catch (error) {
    yield put(getDistributingCoursesMethodsFail(error));
  }
}
function* DistributingCoursesMethodsSaga() {
  yield takeEvery(
    GET_DISTRIBUTING_COURSES_METHODS,
    fetchDistributingCoursesMethods
  );
  yield takeEvery(COPY_DISTRIBUTING_METHODS, onCopyDistributingMethods);
  yield takeEvery(
    ADD_NEW_DISTRIBUTING_COURSES_METHOD,
    onAddNewDistributingCoursesMethod
  );
  yield takeEvery(
    UPDATE_DISTRIBUTING_COURSES_METHOD,
    onUpdateDistributingCoursesMethod
  );
  yield takeEvery(
    DELETE_DISTRIBUTING_COURSES_METHOD,
    onDeleteDistributingCoursesMethod
  );
  //

  yield takeEvery(
    GET_DISTRIBUTING_COURSES_METHODS_CONTENTS,
    fetchDistributingCoursesMethodsContents
  );
  yield takeEvery(
    ADD_NEW_DISTRIBUTING_COURSES_METHOD_CONTENT,
    onAddNewDistributingCoursesMethodContent
  );
  yield takeEvery(
    UPDATE_DISTRIBUTING_COURSES_METHOD_CONTENT,
    onUpdateDistributingCoursesMethodContent
  );
  yield takeEvery(
    DELETE_DISTRIBUTING_COURSES_METHOD_CONTENT,
    onDeleteDistributingCoursesMethodContent
  );

  yield takeEvery(GET_DISTRIBUTING_COURSES, fetchDistributingCourses);
  yield takeEvery(ADD_NEW_DISTRIBUTING_COURSE, onAddNewDistributingCourse);

  yield takeEvery(DELETE_DISTRIBUTING_COURSE, onDeleteDistributingCourse);
}

export default DistributingCoursesMethodsSaga;
