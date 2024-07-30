import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_MAJORS_TYPES,
  ADD_NEW_MAJOR_TYPE,
  DELETE_MAJOR_TYPE,
  UPDATE_MAJOR_TYPE,
  GET_MAJOR_TYPE_DELETED_VALUE,
} from "./actionTypes";

import { GET_USER_TYPES_OPT } from "../user-types/actionTypes";

import {
  getTrainersGradesSuccess,
  getTrainersGradesFail,
  addTrainerGradeFail,
  addTrainerGradeSuccess,
  updateTrainerGradeSuccess,
  updateTrainerGradeFail,
  deleteTrainerGradeSuccess,
  deleteTrainerGradeFail,
  getTrainerGradeDeletedValueSuccess,
  getTrainerGradeDeletedValueFail,
} from "./actions";

import {
  getUserTypesOptFail,
  getUserTypesOptSuccess,
} from "../user-types/actions";

import {
  getTrainersGrades,
  addNewTrainerGrade,
  updateTrainerGrade,
  deleteTrainerGrade,
  getTrainerGradeDeletedValue,
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

function* fetchTrainerGrades(obj) {
  const userTypeId = obj.payload.userTypeId;
  const get_TrainerGrades_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Grades",
    filter: `userTypeId = ${userTypeId}`,

  };
  try {
    const response = yield call(getTrainersGrades, get_TrainerGrades_req);

    yield put(getTrainersGradesSuccess(response));
  } catch (error) {
    yield put(getTrainersGradesFail(error));
  }
}

function* onAddNewTrainerGrade({ payload }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_Grades";
  try {
    const response = yield call(addNewTrainerGrade, payload);
    yield put(addTrainerGradeSuccess(response[0]));
  } catch (error) {
    yield put(addTrainerGradeFail(error));
  }
}

function* onUpdateTrainerGrade({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_Grades";
  try {
    const respupdate = yield call(updateTrainerGrade, payload);
    yield put(updateTrainerGradeSuccess(respupdate[0]));
  } catch (error) {
    yield put(updateTrainerGradeFail(error));
  }
}

function* onDeleteTrainerGrade({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_Grades";
  try {
    const respdelete = yield call(deleteTrainerGrade, payload);
    yield put(deleteTrainerGradeSuccess(respdelete[0]));
  } catch (error) {
    yield put(deleteTrainerGradeFail(error));
  }
}

function* onGetTrainerGradeDeletedValue() {
  try {
    const response = yield call(getTrainerGradeDeletedValue);
    yield put(getTrainerGradeDeletedValueSuccess(response));
  } catch (error) {
    yield put(getTrainerGradeDeletedValueFail(error));
  }
}

function* TrainersGradesSaga() {
  yield takeEvery(GET_USER_TYPES_OPT, fetchUsers);
  yield takeEvery(GET_MAJORS_TYPES, fetchTrainerGrades);
  yield takeEvery(ADD_NEW_MAJOR_TYPE, onAddNewTrainerGrade);
  yield takeEvery(UPDATE_MAJOR_TYPE, onUpdateTrainerGrade);
  yield takeEvery(DELETE_MAJOR_TYPE, onDeleteTrainerGrade);
  yield takeEvery(GET_MAJOR_TYPE_DELETED_VALUE, onGetTrainerGradeDeletedValue);
}

export default TrainersGradesSaga;
