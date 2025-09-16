import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_ABSENCES_TYPES,
  GET_ABSENCE_TYPE_DELETED_VALUE,
  ADD_NEW_ABSENCE_TYPE,
  DELETE_ABSENCE_TYPE,
  UPDATE_ABSENCE_TYPE,
} from "./actionTypes";

import {
  getAbsencesTypesSuccess,
  getAbsencesTypesFail,
  getAbsenceTypeDeletedValueSuccess,
  getAbsenceTypeDeletedValueFail,
  addAbsenceTypeFail,
  addAbsenceTypeSuccess,
  updateAbsenceTypeSuccess,
  updateAbsenceTypeFail,
  deleteAbsenceTypeSuccess,
  deleteAbsenceTypeFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getAbsencesTypes,
  getAbsenceTypeDeletedValue,
  addNewAbsenceType,
  updateAbsenceType,
  deleteAbsenceType,
} from "../../helpers/fakebackend_helper";

function* fetchAbsencesTypes() {
  const get_absenceType_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_AbsenceType",
  };
  try {
    const response = yield call(getAbsencesTypes, get_absenceType_req);
    console.log("fffffffffffffff", response);
    yield put(getAbsencesTypesSuccess(response));
  } catch (error) {
    yield put(getAbsencesTypesFail(error));
  }
}

function* getAbsenceTypeProfile() {
  try {
    const response = yield call(getAbsenceTypeDeletedValue);
    yield put(getAbsenceTypeDeletedValueSuccess(response));
  } catch (error) {
    yield put(getAbsenceTypeDeletedValueFail(error));
  }
}

function* onAddNewAbsenceType({ payload }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_AbsenceType";

  try {
    const response = yield call(addNewAbsenceType, payload);
    console.log("addddddddddddd", response);

    yield put(addAbsenceTypeSuccess(response[0]));
  } catch (error) {
    yield put(addAbsenceTypeFail(error));
  }
}

function* onUpdateAbsenceType({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_AbsenceType";

  try {
    const response = yield call(updateAbsenceType, payload);
    yield put(updateAbsenceTypeSuccess(response[0]));
  } catch (error) {
    yield put(updateAbsenceTypeFail(error));
  }
}

function* onDeleteAbsenceType({ payload, absenceType }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Settings_AbsenceType";

  try {
    const response = yield call(deleteAbsenceType, payload);
    yield put(deleteAbsenceTypeSuccess(response[0]));
  } catch (error) {
    yield put(deleteAbsenceTypeFail(error));
  }
}

function* AbsencesTypesSaga() {
  yield takeEvery(GET_ABSENCES_TYPES, fetchAbsencesTypes);
  yield takeEvery(GET_ABSENCE_TYPE_DELETED_VALUE, getAbsenceTypeProfile);
  yield takeEvery(ADD_NEW_ABSENCE_TYPE, onAddNewAbsenceType);
  yield takeEvery(UPDATE_ABSENCE_TYPE, onUpdateAbsenceType);
  yield takeEvery(DELETE_ABSENCE_TYPE, onDeleteAbsenceType);
}

export default AbsencesTypesSaga;
