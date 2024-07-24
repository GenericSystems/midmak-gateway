import { call, put, takeEvery } from "redux-saga/effects";
import {
  GET_STUDENTS_DECREES,
  ADD_NEW_STUDENTS_DECREES,
  DELETE_STUDENTS_DECREES,
  UPDATE_STUDENTS_DECREES,
  GET_STUDENTS_DECREES_DELETED_VALUE,
  GET_FILTERED_COURSES_PLANS,
  GET_UNIVERSITY_STUDENTS_DECREE,
  GET_COURSES_DECREES,
  GET_STUDENT_DECREES_DISMISS
} from "./actionTypes";
import {
  getStudentsDecreesSuccess,
  getStudentsDecreesFail,
  addStudentsDecreeFail,
  addStudentsDecreeSuccess,
  updateStudentsDecreeSuccess,
  updateStudentsDecreeFail,
  deleteStudentsDecreeSuccess,
  deleteStudentsDecreeFail,
  getStudentsDecreeDeletedValueSuccess,
  getStudentsDecreeDeletedValueFail,
  getFilteredCoursesPlansFail,
  getFilteredCoursesPlansSuccess,
  getUniversityStudentsDecreesFail,
  getUniversityStudentsDecreesSuccess,
  getCoursesDecreesFail,
  getCoursesDecreesSuccess,
  getDecreeStatusFail,
  getDecreeStatusSuccess,
  getStudentDecreesDismissFail,
  getStudentDecreesDismissSuccess,
} from "./actions";

import {
  getStudentsDecrees,
  addNewStudentsDecree,
  updateStudentsDecree,
  deleteStudentsDecree,
  getStudentsDecreeDeletedValue,
  getFilteredCourses,
  getUniversityStudents,
  getFilteredCoursesPlans,
  getUniversityStudentsDecrees,
  getCoursesDecrees,
  getDecreeStatus,
  getStudentDecreesDismiss
} from "../../helpers/fakebackend_helper";

function* fetchFilteredCoursesPlan(obj) {
  

const get_filteredCourses_req = {
 source: 'db',
 procedure: "SisApp_getData",
 apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
 tablename: "_Common_CoursePlan",
 filter: `PlanId = ${obj.payload}`,
  }  
try {
const response = yield call(getFilteredCoursesPlans,get_filteredCourses_req)
yield put(getFilteredCoursesPlansSuccess(response))
} catch (error) {
yield put(getFilteredCoursesPlansFail(error))
}

}

function* fetchCoursesDecrees() {
  

  const get_filteredCourses_req = {
   source: 'db',
   procedure: "SisApp_getData",
   apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
   tablename: "_Common_CoursePlan",
    }  
  try {
  const response = yield call(getCoursesDecrees,get_filteredCourses_req)
  yield put(getCoursesDecreesSuccess(response))
  } catch (error) {
  yield put(getCoursesDecreesFail(error))
  }
  
  }

function* fetchStudentsDecrees() {
  const get_studentsDecrees_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_StudentsDecrees",
  };
  try {
    const response = yield call(getStudentsDecrees, get_studentsDecrees_req);
    response.map(resp => {
      resp["StudentsDecreesCourses"] = JSON.parse(resp["StudentsDecreesCourses"]);
    });
    yield put(getStudentsDecreesSuccess(response));
  } catch (error) {
    yield put(getStudentsDecreesFail(error));
  }


}

function* fetchUniversityStudentsDecrees() {
  const get_studentsDecrees_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_UniversityStudent",
  };
  try {
    const response = yield call(getUniversityStudentsDecrees, get_studentsDecrees_req);
 
    yield put(getUniversityStudentsDecreesSuccess(response));
  } catch (error) {
    yield put(getUniversityStudentsDecreesFail(error));
  }

  const get_decreeStatus_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_DecreeStatus",
  };
  try {
    const response = yield call(getDecreeStatus, get_decreeStatus_req);
    yield put(getDecreeStatusSuccess(response));
  } catch (error) {
    yield put(getDecreeStatusFail(error));
  }
}
function* fetchStudentDecreesDismiss(obj) {
  
  const get_stdDecreeDismiss_req = {
   source: 'db',
   procedure: "SisApp_getData",
   apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
   tablename: "_Common_StudentsDecrees",
   filter: `StudentId = ${obj.payload.StudentId}`,
    }  
  try {
  const response = yield call(getStudentDecreesDismiss,get_stdDecreeDismiss_req)
  response.map(resp => {
    resp["StudentsDecreesCourses"] = JSON.parse(resp["StudentsDecreesCourses"]);
  });
  yield put(getStudentDecreesDismissSuccess(response))
  } catch (error) {
  yield put(getStudentDecreesDismissFail(error))
  }
  
  }
function* onAddNewStudentsDecree({ payload, studentsDecree }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "StudentsDecrees_AddNew";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_StudentsDecrees";
  payload["queryname"] = "_Common_StudentsDecrees";
  try {
    const response = yield call(addNewStudentsDecree, payload);
    yield put(addStudentsDecreeSuccess(response[0]));
  } catch (error) {
    yield put(addStudentsDecreeFail(error));
  }
}

function* onUpdateStudentsDecree({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "StudentsDecrees_Update";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_StudentsDecrees";
  payload["queryname"] = "_Common_StudentsDecrees";
  try {
    const respupdate = yield call(updateStudentsDecree, payload);
    yield put(updateStudentsDecreeSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateStudentsDecreeFail(error));
  }
}
function* onDeleteStudentsDecree({ payload, StudentsDecree }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_StudentsDecrees";
  try {
    const respdelete = yield call(deleteStudentsDecree, payload);
    yield put(deleteStudentsDecreeSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteStudentsDecreeFail(error));
  }
}
function* onGetStudentsDecreeDeletedValue() {
  try {
    const response = yield call(getStudentsDecreeDeletedValue)
    yield put(getStudentsDecreeDeletedValueSuccess(response))
  } catch (error) {
    yield put(getStudentsDecreeDeletedValueFail(error))
  }
  
}
function* studentsDecreesSaga() {
  yield takeEvery(GET_FILTERED_COURSES_PLANS, fetchFilteredCoursesPlan)
  yield takeEvery(GET_STUDENT_DECREES_DISMISS, fetchStudentDecreesDismiss)
  yield takeEvery(GET_COURSES_DECREES, fetchCoursesDecrees)
  yield takeEvery(GET_STUDENTS_DECREES, fetchStudentsDecrees);
  yield takeEvery(GET_UNIVERSITY_STUDENTS_DECREE, fetchUniversityStudentsDecrees);
  yield takeEvery(ADD_NEW_STUDENTS_DECREES, onAddNewStudentsDecree);
  yield takeEvery(UPDATE_STUDENTS_DECREES, onUpdateStudentsDecree);
  yield takeEvery(DELETE_STUDENTS_DECREES, onDeleteStudentsDecree);
  yield takeEvery(GET_STUDENTS_DECREES_DELETED_VALUE, onGetStudentsDecreeDeletedValue);
}
export default studentsDecreesSaga;
