import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_ABSENCES_JUSTIFICATIONS,
  GET_ABSENCE_JUSTIFICATION_DELETED_VALUE,
  ADD_NEW_ABSENCE_JUSTIFICATION,
  DELETE_ABSENCE_JUSTIFICATION,
  UPDATE_ABSENCE_JUSTIFICATION,
} from "./actionTypes";

import {
  getAbsencesJustificationsSuccess,
  getAbsencesJustificationsFail,
  getAbsenceJustificationDeletedValueSuccess,
  getAbsenceJustificationDeletedValueFail,
  addAbsenceJustificationFail,
  addAbsenceJustificationSuccess,
  updateAbsenceJustificationSuccess,
  updateAbsenceJustificationFail,
  deleteAbsenceJustificationSuccess,
  deleteAbsenceJustificationFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getAbsencesJustifications,
  getAbsenceJustificationDeletedValue,
  addNewAbsenceJustification,
  updateAbsenceJustification,
  deleteAbsenceJustification,
} from "../../helpers/fakebackend_helper";

function* fetchAbsencesJustifications() {
  const get_absenceJustification_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_AbsenceJustification",
  };
  try {
    const response = yield call(getAbsencesJustifications, get_absenceJustification_req);
    console.log("fffffffffffffff", response);
    yield put(getAbsencesJustificationsSuccess(response));
  } catch (error) {
    yield put(getAbsencesJustificationsFail(error));
  }
}

function* getAbsenceJustificationProfile() {
  try {
    const response = yield call(getAbsenceJustificationDeletedValue);
    yield put(getAbsenceJustificationDeletedValueSuccess(response));
  } catch (error) {
    yield put(getAbsenceJustificationDeletedValueFail(error));
  }
}

function* onAddNewAbsenceJustification({ payload }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_AbsenceJustification";

  try {
    const response = yield call(addNewAbsenceJustification, payload);
    yield put(addAbsenceJustificationSuccess(response[0]));
  } catch (error) {
    yield put(addAbsenceJustificationFail(error));
  }
}

function* onUpdateAbsenceJustification({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_AbsenceJustification";

  try {
    const response = yield call(updateAbsenceJustification, payload);
    yield put(updateAbsenceJustificationSuccess(response[0]));
  } catch (error) {
    yield put(updateAbsenceJustificationFail(error));
  }
}

function* onDeleteAbsenceJustification({ payload, absenceJustification }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_AbsenceJustification";

  try {
    const response = yield call(deleteAbsenceJustification, payload);
    yield put(deleteAbsenceJustificationSuccess(response[0]));
  } catch (error) {
    yield put(deleteAbsenceJustificationFail(error));
  }
}

function* AbsencesJustificationsSaga() {
  yield takeEvery(GET_ABSENCES_JUSTIFICATIONS, fetchAbsencesJustifications);
  yield takeEvery(GET_ABSENCE_JUSTIFICATION_DELETED_VALUE, getAbsenceJustificationProfile);
  yield takeEvery(ADD_NEW_ABSENCE_JUSTIFICATION, onAddNewAbsenceJustification);
  yield takeEvery(UPDATE_ABSENCE_JUSTIFICATION, onUpdateAbsenceJustification);
  yield takeEvery(DELETE_ABSENCE_JUSTIFICATION, onDeleteAbsenceJustification);
}

export default AbsencesJustificationsSaga;
