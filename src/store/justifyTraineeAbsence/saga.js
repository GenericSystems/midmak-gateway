import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_JUSTIFY_TRAINEES_ABSENCE,
  GET_JUSTIFY_TRAINEE_ABSENCE_DELETED_VALUE,
  ADD_NEW_JUSTIFY_TRAINEE_ABSENCE,
  DELETE_JUSTIFY_TRAINEE_ABSENCE,
  UPDATE_JUSTIFY_TRAINEE_ABSENCE,
} from "./actionTypes";

import {
  getJustifyTraineesAbsenceSuccess,
  getJustifyTraineesAbsenceFail,
  getJustifyTraineeAbsenceDeletedValueSuccess,
  getJustifyTraineeAbsenceDeletedValueFail,
  addJustifyTraineeAbsenceFail,
  addJustifyTraineeAbsenceSuccess,
  updateJustifyTraineeAbsenceSuccess,
  updateJustifyTraineeAbsenceFail,
  deleteJustifyTraineeAbsenceSuccess,
  deleteJustifyTraineeAbsenceFail,
} from "./actions";

import { getTraineesOptSuccess, getTraineesOptFail } from "../trainees/actions";

import {
  getEmployeesNamesSuccess,
  getEmployeesNamesFail,
} from "../HR/employees/actions";

//Include Both Helper File with needed methods
import {
  getJustifyTraineesAbsence,
  getJustifyTraineeAbsenceDeletedValue,
  addNewJustifyTraineeAbsence,
  updateJustifyTraineeAbsence,
  deleteJustifyTraineeAbsence,
  getEmployeesNames,
  getTraineesOpt,
} from "../../helpers/fakebackend_helper";

function* fetchJustifyTraineesAbsence() {
  const get_JustifyTraineeAbsence_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_Trainee",
  };
  try {
    const response = yield call(
      getJustifyTraineesAbsence,
      get_JustifyTraineeAbsence_req
    );
    console.log("fffffffffffffff", response);
    yield put(getJustifyTraineesAbsenceSuccess(response));
  } catch (error) {
    yield put(getJustifyTraineesAbsenceFail(error));
  }

  const get_trainee_opt = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_Trainee",
    fields: "Id,fullName",
  };
  try {
    const response = yield call(getTraineesOpt, get_trainee_opt);
    console.log("reeeeeeeeeeeeee", response);
    yield put(getTraineesOptSuccess(response));
  } catch (error) {
    yield put(getTraineesOptFail(error));
  }
}

function* getJustifyTraineeAbsenceProfile() {
  try {
    const response = yield call(getJustifyTraineeAbsenceDeletedValue);
    yield put(getJustifyTraineeAbsenceDeletedValueSuccess(response));
  } catch (error) {
    yield put(getJustifyTraineeAbsenceDeletedValueFail(error));
  }
}

function* onAddNewJustifyTraineeAbsence({ payload }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_JustifyTraineeAbsence";

  try {
    const response = yield call(addNewJustifyTraineeAbsence, payload);
    yield put(addJustifyTraineeAbsenceSuccess(response[0]));
  } catch (error) {
    yield put(addJustifyTraineeAbsenceFail(error));
  }
}

function* onUpdateJustifyTraineeAbsence({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_JustifyTraineeAbsence";

  try {
    const response = yield call(updateJustifyTraineeAbsence, payload);
    yield put(updateJustifyTraineeAbsenceSuccess(response[0]));
  } catch (error) {
    yield put(updateJustifyTraineeAbsenceFail(error));
  }
}

function* onDeleteJustifyTraineeAbsence({ payload, contractType }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_JustifyTraineeAbsence";

  try {
    const response = yield call(deleteJustifyTraineeAbsence, payload);
    yield put(deleteJustifyTraineeAbsenceSuccess(response[0]));
  } catch (error) {
    yield put(deleteJustifyTraineeAbsenceFail(error));
  }
}

function* JustifyTraineesAbsenceSaga() {
  yield takeEvery(GET_JUSTIFY_TRAINEES_ABSENCE, fetchJustifyTraineesAbsence);
  yield takeEvery(
    GET_JUSTIFY_TRAINEE_ABSENCE_DELETED_VALUE,
    getJustifyTraineeAbsenceProfile
  );
  yield takeEvery(
    ADD_NEW_JUSTIFY_TRAINEE_ABSENCE,
    onAddNewJustifyTraineeAbsence
  );
  yield takeEvery(
    UPDATE_JUSTIFY_TRAINEE_ABSENCE,
    onUpdateJustifyTraineeAbsence
  );
  yield takeEvery(
    DELETE_JUSTIFY_TRAINEE_ABSENCE,
    onDeleteJustifyTraineeAbsence
  );
}

export default JustifyTraineesAbsenceSaga;
