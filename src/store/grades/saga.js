import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_GRADES,
  ADD_NEW_GRADE,
  DELETE_GRADE,
  UPDATE_GRADE,
  GET_GRADE_DELETED_VALUE,
} from "./actionTypes";

import { GET_USER_TYPES_OPT } from "../user-types/actionTypes";

import {
  getGradesSuccess,
  getGradesFail,
  addGradeFail,
  addGradeSuccess,
  updateGradeSuccess,
  updateGradeFail,
  deleteGradeSuccess,
  deleteGradeFail,
  getGradeDeletedValueSuccess,
  getGradeDeletedValueFail,
} from "./actions";

import {
  getUserTypesOptFail,
  getUserTypesOptSuccess,
} from "../user-types/actions";

import {
  getGrades,
  addNewGrade,
  updateGrade,
  deleteGrade,
  getGradeDeletedValue,
  getUserTypesOpt,
} from "../../helpers/fakebackend_helper";

function* fetchUsers() {
  //user types
  const get_userTypes_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_UserType",
    fields: "Id,arTitle",
  };

  try {
    const response = yield call(getUserTypesOpt, get_userTypes_req);
    yield put(getUserTypesOptSuccess(response));
  } catch (error) {
    yield put(getUserTypesOptFail(error));
  }
}

function* fetchGrades(obj) {
  const userTypeId = obj.payload.userTypeId;
  console.log("get grades obj ",obj)
  const get_Grades_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Grades",
    filter: `userTypeId = ${userTypeId}`,

  };
  try {
    const response = yield call(getGrades, get_Grades_req);

    yield put(getGradesSuccess(response));
  } catch (error) {
    yield put(getGradesFail(error));
  }
}

function* onAddNewGrade({ payload }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_Grades";
  try {
    const response = yield call(addNewGrade, payload);
    yield put(addGradeSuccess(response[0]));
  } catch (error) {
    yield put(addGradeFail(error));
  }
}

function* onUpdateGrade({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_Grades";
  try {
    const respupdate = yield call(updateGrade, payload);
    yield put(updateGradeSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateGradeFail(error));
  }
}

function* onDeleteGrade({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_Grades";
  try {
    const respdelete = yield call(deleteGrade, payload);
    yield put(deleteGradeSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteGradeFail(error));
  }
}

function* onGetGradeDeletedValue() {
  try {
    const response = yield call(getGradeDeletedValue);
    yield put(getGradeDeletedValueSuccess(response));
  } catch (error) {
    yield put(getGradeDeletedValueFail(error));
  }
}

function* gradesSaga() {
  yield takeEvery(GET_USER_TYPES_OPT, fetchUsers);
  yield takeEvery(GET_GRADES, fetchGrades);
  yield takeEvery(ADD_NEW_GRADE, onAddNewGrade);
  yield takeEvery(UPDATE_GRADE, onUpdateGrade);
  yield takeEvery(DELETE_GRADE, onDeleteGrade);
  yield takeEvery(GET_GRADE_DELETED_VALUE, onGetGradeDeletedValue);
}

export default gradesSaga;
