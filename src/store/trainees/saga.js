import { call, put, takeEvery } from "redux-saga/effects";

// Trainee Redux States
import { GET_TRAINEES } from "./actionTypes";

import {
  getTraineesSuccess,
  getTraineesFail,
  getSocialStatusSuccess,
  getSocialStatusFail,
} from "./actions";

// Include helper functions
import {
  getTrainees,
  getGenders,
  getNationalities,
  getYears,
  getSocialStatus,
} from "../../helpers/fakebackend_helper";

import {
  getNationalitiesSuccess,
  getNationalitiesFail,
} from "../nationality/actions";

import { getYearsSuccess, getYearsFail } from "../years/actions";

import { getGendersSuccess, getGendersFail } from "../genders/actions";

// import {
//   getSocialStatusSuccess,
//   getSocialStatusFail,
// } from "../new-Trainee/actions";

function* fetchTrainees(selectedpayload) {
  let obj = selectedpayload.payload;
  console.log("lang", obj.lng);
  let lang = obj.lng;
  const titleField = lang === "en" ? "enTitle" : "arTitle";

  //years
  const get_years_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Years",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getYears, get_years_req);
    console.log("yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy", response);
    yield put(getYearsSuccess(response));
  } catch (error) {
    yield put(getYearsFail(error));
  }

  //get nationality
  const get_nationality_opt = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "AdmissionSettings_Nationality",
    fields: `Id,${titleField}`,
  };
  try {
    const response = yield call(getNationalities, get_nationality_opt);
    console.log("responsenationality", response);
    yield put(getNationalitiesSuccess(response));
  } catch (error) {
    yield put(getNationalitiesFail(error));
  }
  //get gender
  const get_gender = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Gender",
    fields: `Id,${titleField}`,
  };
  try {
    const response = yield call(getGenders, get_gender);
    yield put(getGendersSuccess(response));
  } catch (error) {
    yield put(getGendersFail(error));
  }

  //get SocialStatus
  const get_SocialStatus = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_SocialStatus",
    fields: `Id,${titleField}`,
  };
  try {
    const response = yield call(getSocialStatus, get_SocialStatus);
    console.log("ewsssssssssssssssss", response);
    yield put(getSocialStatusSuccess(response));
  } catch (error) {
    yield put(getSocialStatusFail(error));
  }

  //get trainees_req
  const get_trainees_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_Trainee",
    filter: `Id = ${obj.traineeId}`,
  };

  try {
    const response = yield call(getTrainees, get_trainees_req);
    // response.map(resp => {
    //   resp["ProfessionalExperiences"] = JSON.parse(
    //     resp["ProfessionalExperiences"]
    //   );
    // });
    // response.map(resp => {
    //   resp["RegReqDocTempTrainee"] = JSON.parse(resp["RegReqDocTempTrainee"]);
    // });
    console.log("experresponse", response);
    yield put(getTraineesSuccess(response));
  } catch (error) {
    yield put(getTraineesFail(error));
  }
}

function* traineesSaga() {
  yield takeEvery(GET_TRAINEES, fetchTrainees);
}

export default traineesSaga;
