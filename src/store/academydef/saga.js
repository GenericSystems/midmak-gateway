import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_ACADEMYINFO,
  UPDATE_ACADEMYINFO,
  ADD_ACADEMYINFO,
} from "./actionTypes";

// import{
//   GET_COUNTRIES_OPT,
//   GET_COUNTRIES_OPT_FAIL,
//   GET_CITIES_OPT_SUCCES
// } from "../HR/employees/actionTypes"

import {
  getCountriesOptSuccess,
  getCountriesOptFail,
} from "../HR/employees/actions";
import {
  getAcademyInfoSuccess,
  getAcademyInfoFail,
  updateAcademyInfoSuccess,
  updateAcademyInfoFail,
  addAcademyInfoSuccess,
  addAcademyInfoFail,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getAcademyInfo,
  addAcademyInfo,
  updateAcademyInfo,
  getCountriesOpt,
} from "../../helpers/fakebackend_helper";

function* fetchAcademyInfo() {
  const get_academyInfo_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "AcademyInfo",
  };

  try {
    const response = yield call(getAcademyInfo, get_academyInfo_req);
    console.log("RESPONSEEEEEE", response);
    yield put(getAcademyInfoSuccess(response));
  } catch (error) {
    yield put(getAcademyInfoFail(error));
  }

  const get_Countries_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Country",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getCountriesOpt, get_Countries_req);
    console.log("mmmmmmmmmmmmmmmmmm", response);
    yield put(getCountriesOptSuccess(response));
  } catch (error) {
    yield put(getCountriesOptFail(error));
  }
}

function* onUpdateAcademyInfo({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "AcademyInfo";
  try {
    const response = yield call(updateAcademyInfo, payload);
    console.log("UPDATEPAYLOADDDDD", payload);

    yield put(updateAcademyInfoSuccess(response[0]));
  } catch (error) {
    yield put(updateAcademyInfoFail(error));
  }
}

function* onAddAcademyInfo({ payload }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "AcademyInfo";
  try {
    const response = yield call(addAcademyInfo, payload);
    console.log("ADDPAYLOADDDDD", payload);
    yield put(addAcademyInfoSuccess(response[0]));
  } catch (error) {
    yield put(addAcademyInfoFail(error));
  }
}

function* academyInfoSaga() {
  yield takeEvery(GET_ACADEMYINFO, fetchAcademyInfo);
  yield takeEvery(UPDATE_ACADEMYINFO, onUpdateAcademyInfo);
  yield takeEvery(ADD_ACADEMYINFO, onAddAcademyInfo);
}

export default academyInfoSaga;
