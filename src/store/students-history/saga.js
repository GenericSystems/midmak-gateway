import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_STUDENTS_HISTORY,
  ADD_NEW_STUDENT_HISTORY,
  CALCULATE_ALL_STUDENT_HISTORY,
  CALCULATE_STUDENT_HISTORY,
} from "./actionTypes";

import {
  getStudentsHistorySuccess,
  getStudentsHistoryFail,
  addStudentHistoryFail,
  addStudentHistorySuccess,
  calculateStudentHistorySuccess,
  calculateStudentHistoryFail,
  calculateAllStudentHistorySuccess,
  calculateAllStudentHistoryFail,
} from "./actions";

import {
  getStudentsHistory,
  addNewStudentHistory,
  calculateStudentHistory,
  calculateAllStudentHistory,
} from "../../helpers/fakebackend_helper";

function* fetchStudentsHistory(obj) {
  const payload = obj.payload;

  let filter = `yearSemesterId = ${payload.yearSemesterId}`;

  if (payload.studentId !== undefined) {
    filter += ` or studentId = ${payload.studentId}`;
  }
  const get_studentHistory_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_HistoryAllStudents",
    filter: filter,
  };
  try {
    const response = yield call(getStudentsHistory, get_studentHistory_req);

    yield put(getStudentsHistorySuccess(response));
  } catch (error) {
    yield put(getStudentsHistoryFail(error));
  }
}

function* onAddNewStudentHistory({ payload }) {
  /* delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "_SisApp_ActiveStudents";

  try {
    const response = yield call(addNewStudentHistory, payload);
    yield put(addStudentHistorySuccess(response[0]));
  } catch (error) {
    yield put(addStudentHistoryFail(error));
  } */
}

function* onCalculateStudentHistory(obj) {
  console.log("obj",obj)
  const payload = obj.payload
  const calculate_history = {
    source: "db",
    procedure: "Student_setAchHistory",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    StudentId: `${payload.StudentId}`,
    YearSemesterId: `${payload.YearSemesterId}`,
  };

  try {
    const response = yield call(calculateStudentHistory, calculate_history);
    yield put(calculateStudentHistorySuccess(response));
  } catch (error) {
    yield put(calculateStudentHistoryFail(error));
  }
}

function* onCalculateAllStudentHistory(obj) {
  console.log("obj",obj)
  const calculate_all_history = {
    source: "db",
    procedure: "Student_setAchHistory",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    StudentId: `${obj.payload}`
  };

  try {
    const response = yield call(calculateAllStudentHistory, calculate_all_history);
    yield put(calculateAllStudentHistorySuccess(response));
  } catch (error) {
    yield put(calculateAllStudentHistoryFail(error));
  }
}

function* StudentsHistorySaga() {
  yield takeEvery(GET_STUDENTS_HISTORY, fetchStudentsHistory);
  yield takeEvery(ADD_NEW_STUDENT_HISTORY, onAddNewStudentHistory);
  yield takeEvery(CALCULATE_STUDENT_HISTORY, onCalculateStudentHistory);
  yield takeEvery(CALCULATE_ALL_STUDENT_HISTORY, onCalculateAllStudentHistory);
}

export default StudentsHistorySaga;
