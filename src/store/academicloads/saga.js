import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_ACADEMIC_LOADS,
  ADD_NEW_ACADEMIC_LOAD,
  DELETE_ACADEMIC_LOAD,
  UPDATE_ACADEMIC_LOAD,
  GET_ACADEMIC_LOAD_DELETED_VALUE,

} from "./actionTypes";

import {
  getAcademicLoadsSuccess,
  getAcademicLoadsFail,
  addAcademicLoadFail,
  addAcademicLoadSuccess,
  updateAcademicLoadSuccess,
  updateAcademicLoadFail,
  deleteAcademicLoadFail,
  deleteAcademicLoadSuccess,
  getAcademicLoadDeletedValueSuccess,
  getAcademicLoadDeletedValueFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getAcademicLoads,
  addNewAcademicLoad,
  updateAcademicLoad,
  deleteAcademicLoad,
  getWarnings,
  getAcademicLoadDeletedValue,
} from "../../helpers/fakebackend_helper";

import { getWarningsSuccess, getWarningsFail } from "../warning/actions";

function* fetchAcademicLoads() {
  //get warning
  const get_warning_opt = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_Warnings",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getWarnings, get_warning_opt);
    yield put(getWarningsSuccess(response));
  } catch (error) {
    yield put(getWarningsFail(error));
  }

  const get_academicLoad_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "settings_AcademicLoad",
  };

  try {
    const response = yield call(getAcademicLoads, get_academicLoad_req);
    yield put(getAcademicLoadsSuccess(response));
  } catch (error) {
    yield put(getAcademicLoadsFail(error));
  }
}

function* onAddNewAcademicLoad({ payload, academicLoad }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_AcademicLoad";

  try {
    const response = yield call(addNewAcademicLoad, payload);
    yield put(addAcademicLoadSuccess(response[0]));
  } catch (error) {
    yield put(addAcademicLoadFail(error));
  }
}

function* onUpdateAcademicLoad({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_AcademicLoad";
  try {
    const response = yield call(updateAcademicLoad, payload);
    yield put(updateAcademicLoadSuccess(response[0]));
  } catch (error) {
    yield put(updateAcademicLoadFail(error));
  }
}

function* onDeleteAcademicLoad({ payload, academicLoad }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "settings_AcademicLoad";
  try {
    const responsedelete = yield call(deleteAcademicLoad, payload);
    yield put(deleteAcademicLoadSuccess(responsedelete[0]));
  } catch (error) {
    yield put(deleteAcademicLoadFail(error));
  }
}

function* onGetAcademicLoadDeletedValue() {
  try {
    const response = yield call(getAcademicLoadDeletedValue)
    yield put(getAcademicLoadDeletedValueSuccess(response))
  } catch (error) {
    yield put(getAcademicLoadDeletedValueFail(error))
  }
  
}

function* academicLoadSaga() {
  yield takeEvery(GET_ACADEMIC_LOADS, fetchAcademicLoads);
  yield takeEvery(ADD_NEW_ACADEMIC_LOAD, onAddNewAcademicLoad);
  yield takeEvery(UPDATE_ACADEMIC_LOAD, onUpdateAcademicLoad);
  yield takeEvery(DELETE_ACADEMIC_LOAD, onDeleteAcademicLoad);
  yield takeEvery(GET_ACADEMIC_LOAD_DELETED_VALUE, onGetAcademicLoadDeletedValue);
}

export default academicLoadSaga;
