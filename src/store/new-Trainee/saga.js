import { call, put, takeEvery } from "redux-saga/effects";

// Trainee Redux States
import {
  GET_TRAINEES,
  GET_TRAINEE_DELETED_VALUE,
  ADD_NEW_TRAINEE,
  DELETE_TRAINEE,
  UPDATE_TRAINEE,
  GET_REGISTER_CERTIFICATES,
  GET_TRAINEE_DEFAULT_REGREQDOCS,
} from "./actionTypes";

import {
  getTraineesSuccess,
  getTraineesFail,
  getTraineeDeletedValueSuccess,
  getTraineeDeletedValueFail,
  addTraineeSuccess,
  addTraineeFail,
  updateTraineeSuccess,
  updateTraineeFail,
  deleteTraineeSuccess,
  deleteTraineeFail,
  getTraineeDefaultRegReqDocsSuccess,
  getTraineeDefaultRegReqDocsFail,
  getRegisterCertificatesSuccess,
  getRegisterCertificatesFail,
} from "./actions";

// Include helper functions
import {
  getTrainees,
  getTraineeDeletedValue,
  addNewTrainee,
  updateTrainee,
  deleteTrainee,
  getDefaultRegReqDocs,
  getNationalities,
  getCities,
  getCountries,
  getGenders,
  getTraineeRegCertificate,
  getEstimates,
  getGovernorates,
  getFaculties,
  getDiplomaLevels,
  getHighStudyTypes,
} from "../../helpers/fakebackend_helper";

import {
  getNationalitiesSuccess,
  getNationalitiesFail,
} from "../nationality/actions";

import { getCitiesSuccess, getCitiesFail } from "../cities/actions";

import { getCountriesSuccess, getCountriesFail } from "../country/actions";

import { getGendersSuccess, getGendersFail } from "../genders/actions";

import { getEstimatesFail, getEstimatesSuccess } from "../estimates/actions";

import {
  getGovernoratesSuccess,
  getGovernoratesFail,
} from "../governorate/actions";

import {
  getFacultiesSuccess,
  getFacultiesFail,
} from "../mob-app-faculty-accs/actions";

import {
  getDiplomaLevelsFail,
  getDiplomaLevelsSuccess,
} from "../diploma-level/actions";

import {
  getHighStudyTypesSuccess,
  getHighStudyTypesFail,
} from "../high-study-types/actions";

function* fetchTrainees(selectedpayload) {
  let lang = selectedpayload.payload;

  const titleField = lang === "en" ? "enTitle" : "arTitle";

  const get_faculty_opt = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_Faculty",
    fields: `Id,${titleField}`,
  };
  try {
    const response = yield call(getFaculties, get_faculty_opt);
    yield put(getFacultiesSuccess(response));
  } catch (error) {
    yield put(getFacultiesFail(error));
  }

  const getDiploma_opt = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_DiplomaLevels",
    fields: `Id,${titleField}`,
  };

  try {
    const response = yield call(getDiplomaLevels, getDiploma_opt);
    yield put(getDiplomaLevelsSuccess(response));
  } catch (error) {
    yield put(getDiplomaLevelsFail(error));
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
    yield put(getNationalitiesSuccess(response));
  } catch (error) {
    yield put(getNationalitiesFail(error));
  }

  //get country
  const get_country_opt = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Country",
    fields: `Id,${titleField}`,
  };
  try {
    const response = yield call(getCountries, get_country_opt);
    yield put(getCountriesSuccess(response));
  } catch (error) {
    yield put(getCountriesFail(error));
  }

  //get city
  const get_city_opt = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_City",
    fields: `Id,${titleField}`,
  };
  try {
    const response = yield call(getCities, get_city_opt);
    yield put(getCitiesSuccess(response));
  } catch (error) {
    yield put(getCitiesFail(error));
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
  // get estimates
  const get_estimates_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Estimate",
    fields: `Id,${titleField}`,
  };
  try {
    const response = yield call(getEstimates, get_estimates_req);
    yield put(getEstimatesSuccess(response));
  } catch (error) {
    yield put(getEstimatesFail(error));
  }

  //get governorate
  const get_governorate_opt = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Governorate",
    fields: `Id,${titleField}`,
  };
  try {
    const response = yield call(getGovernorates, get_governorate_opt);
    yield put(getGovernoratesSuccess(response));
  } catch (error) {
    yield put(getGovernoratesFail(error));
  }

  //get Settings_HighStudyType

  const requestPayload = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_HighStudyType",
    fields: `Id,${titleField}`,
  };
  try {
    const response = yield call(getHighStudyTypes, requestPayload);
    yield put(getHighStudyTypesSuccess(response));
  } catch (error) {
    yield put(getHighStudyTypesFail(error));
  }

  /* //get trainees_req
  const get_trainees_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Common_TempTrainee",
  };

  try {
    const response = yield call(getTrainees, get_trainees_req);
    yield put(getTraineesSuccess(response));
  } catch (error) {
    yield put(getTraineesFail(error));
  } */
}

function* onAddNewTrainee({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_TempTrainee";

  try {
    const response = yield call(addNewTrainee, payload);
    yield put(addTraineeSuccess(response[0]));
  } catch (error) {
    yield put(addTraineeFail(error));
  }
}

function* onUpdateTrainee({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_TempTrainee";

  try {
    const response = yield call(updateTrainee, payload);
    yield put(updateTraineeSuccess(response[0]));
  } catch (error) {
    yield put(updateTraineeFail(error));
  }
}

function* onDeleteTrainee({ payload }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_TempTrainee";

  try {
    const response = yield call(deleteTrainee, payload);
    yield put(deleteTraineeSuccess(response[0]));
  } catch (error) {
    yield put(deleteTraineeFail(error));
  }
}

function* onGetTraineeDeletedValue() {
  try {
    const response = yield call(getTraineeDeletedValue);
    yield put(getTraineeDeletedValueSuccess(response));
  } catch (error) {
    yield put(getTraineeDeletedValueFail(error));
  }
}

function* fetchTraineesRegisterCertificates() {
  const get_TraineeReg_Certificate = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "AdmissionSettings_RegisterUnderCertificates",
  };

  try {
    const response = yield call(
      getTraineeRegCertificate,
      get_TraineeReg_Certificate
    );
    yield put(getRegisterCertificatesSuccess(response));
  } catch (error) {
    yield put(getRegisterCertificatesFail(error));
  }
}

function* fetchTraineesReqDocs() {
  const get_TraineeReqDocs = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "AdmissionSettings_RegDocType",
  };

  try {
    const response = yield call(getDefaultRegReqDocs, get_TraineeReqDocs);
    yield put(getTraineeDefaultRegReqDocsSuccess(response));
  } catch (error) {
    yield put(getTraineeDefaultRegReqDocsFail(error));
  }
}

function* traineesSaga() {
  yield takeEvery(GET_TRAINEES, fetchTrainees);
  yield takeEvery(GET_REGISTER_CERTIFICATES, fetchTraineesRegisterCertificates);
  yield takeEvery(GET_TRAINEE_DEFAULT_REGREQDOCS, fetchTraineesReqDocs);
  yield takeEvery(ADD_NEW_TRAINEE, onAddNewTrainee);
  yield takeEvery(UPDATE_TRAINEE, onUpdateTrainee);
  yield takeEvery(DELETE_TRAINEE, onDeleteTrainee);
  yield takeEvery(GET_TRAINEE_DELETED_VALUE, onGetTraineeDeletedValue);
}

export default traineesSaga;
