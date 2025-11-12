import { call, put, takeEvery } from "redux-saga/effects";

// Crypto Redux States
import {
  GET_TRAINERS,
  GET_TRAINER_DELETED_VALUE,
  ADD_NEW_TRAINER,
  DELETE_TRAINER,
  UPDATE_TRAINER,
} from "./actionTypes";

import {
  getTrainersSuccess,
  getTrainersFail,
  getTrainerDeletedValueSuccess,
  getTrainerDeletedValueFail,
  addTrainerFail,
  addTrainerSuccess,
  updateTrainerSuccess,
  updateTrainerFail,
  deleteTrainerSuccess,
  deleteTrainerFail,
} from "./actions";

import {
  getGenderschSuccess,
  getGenderschFail,
  // getAdministrativeSupervisorsOptSuccess,
  // getAdministrativeSupervisorsOptFail,
  getJobRanksOptSuccess,
  getJobRanksOptFail,
  getJobTitlesOptSuccess,
  getJobTitlesOptFail,
  getCorporateNodesOptSuccess,
  getCorporateNodesOptFail,
  getPhysicalWorkLocationsOptSuccess,
  getPhysicalWorkLocationsOptFail,
  getAcademicYearsOptSuccess,
  getAcademicYearsOptFail,
} from "store/HR/employees/actions";

import {
  getWorkClassificationsFail,
  getWorkClassificationsSuccess,
} from "../HR/workClassifications/actions";

import {
  getNationalitiesSuccess,
  getNationalitiesFail,
} from "../nationality/actions";

import {
  getEmploymentCasesFail,
  getEmploymentCasesSuccess,
} from "../HR/employmentCases/actions";

import {
  getContractsTypesFail,
  getContractsTypesSuccess,
} from "../HR/contractsTypes/actions";
import { getCitiesSuccess, getCitiesFail } from "../cities/actions";

import { getCountriesSuccess, getCountriesFail } from "../country/actions";

import {
  getGovernoratesSuccess,
  getGovernoratesFail,
} from "../governorate/actions";

//Include Both Helper File with needed methods
import {
  getTrainers,
  getTrainerDeletedValue,
  addNewTrainer,
  updateTrainer,
  deleteTrainer,
  getNationalities,
  getGendersch,
  // getAdministrativeSupervisorsOpt,
  getJobRanksOpt,
  getContractsTypes,
  getJobTitlesOpt,
  getCorporateNodesOpt,
  getPhysicalWorkLocationsOpt,
  getWorkClassifications,
  getAcademicYearsOpt,
  getEmploymentCases,
  getCities,
  getCountries,
  getGovernorates,
} from "../../helpers/fakebackend_helper";

function* fetchTrainers(selectedpayload) {
  let lang = selectedpayload.payload;
  const titleField = lang === "en" ? "enTitle" : "arTitle";
  const get_trainer_req = {
    source: "db",
    procedure: "SisApp_getData",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "_Common_Trainer",
  };
  try {
    const response = yield call(getTrainers, get_trainer_req);
    yield put(getTrainersSuccess(response));
  } catch (error) {
    yield put(getTrainersFail(error));
  }

  const get_contractType_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_ContractType",
    fields: "Id,arTitle",
  };

  try {
    const response = yield call(getContractsTypes, get_contractType_req);
    yield put(getContractsTypesSuccess(response));
  } catch (error) {
    yield put(getContractsTypesFail(error));
  }

  const get_work_classification_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_JobClassifications",
    fields: "Id,arTitle",
  };

  try {
    const response = yield call(
      getWorkClassifications,
      get_work_classification_req
    );
    yield put(getWorkClassificationsSuccess(response));
  } catch (error) {
    yield put(getWorkClassificationsFail(error));
  }

  const get_employmentCase_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_EmploymentCases",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getEmploymentCases, get_employmentCase_req);
    yield put(getEmploymentCasesSuccess(response));
  } catch (error) {
    yield put(getEmploymentCasesFail(error));
  }

  const get_States_req = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Governorate",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getGovernorates, get_States_req);
    console.log("101000000000000000000000000000000000", response);
    yield put(getGovernoratesSuccess(response));
  } catch (error) {
    yield put(getGovernoratesFail(error));
  }

  const get_gender_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Gender",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getGendersch, get_gender_req);
    yield put(getGenderschSuccess(response));
  } catch (error) {
    yield put(getGenderschFail(error));
  }

  const get_Countries_req = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Country",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getCountries, get_Countries_req);
    console.log("mmmmmmmmmmmmmmmmmm", response);
    yield put(getCountriesSuccess(response));
  } catch (error) {
    yield put(getCountriesFail(error));
  }

  const get_Cities_req = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_City",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getCities, get_Cities_req);
    console.log("20200000000000000000000000000", response);
    yield put(getCitiesSuccess(response));
  } catch (error) {
    yield put(getCitiesFail(error));
  }

  const get_nationality_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Nationality",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getNationalities, get_nationality_req);
    yield put(getNationalitiesSuccess(response));
  } catch (error) {
    yield put(getNationalitiesFail(error));
  }

  const get_CorporateNodes_req = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Gender",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getCorporateNodesOpt, get_CorporateNodes_req);
    yield put(getCorporateNodesOptSuccess(response));
  } catch (error) {
    yield put(getCorporateNodesOptFail(error));
  }

  //   const get_AdministrativeSupervisors_req = {
  //     source: "db",
  //     procedure: "SisApp_getData",
  //     apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
  //     tablename: "Settings_AdministrativeSupervisors",
  //     fields: "Id,arTitle",
  //   };
  //   try {
  //     const response = yield call(
  //       getAdministrativeSupervisorsOpt,
  //       get_AdministrativeSupervisors_req
  //     );
  //     yield put(getAdministrativeSupervisorsOptSuccess(response));
  //   } catch (error) {
  //     yield put(getAdministrativeSupervisorsOptFail(error));
  //   }

  const get_AcademicYears_req = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_Years",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getAcademicYearsOpt, get_AcademicYears_req);
    yield put(getAcademicYearsOptSuccess(response));
  } catch (error) {
    yield put(getAcademicYearsOptFail(error));
  }

  const get_PhysicalWorkLocations_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_PhysicalWorkLocations",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(
      getPhysicalWorkLocationsOpt,
      get_PhysicalWorkLocations_req
    );
    yield put(getPhysicalWorkLocationsOptSuccess(response));
  } catch (error) {
    yield put(getPhysicalWorkLocationsOptFail(error));
  }

  const get_JobRanks_req = {
    source: "db",
    procedure: "Generic_getOptions",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_JobRanks",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getJobRanksOpt, get_JobRanks_req);
    yield put(getJobRanksOptSuccess(response));
  } catch (error) {
    yield put(getJobRanksOptFail(error));
  }

  const get_JobTitles_req = {
    source: "db",
    procedure: "Generic_Optiondatalist",
    apikey: "30294470-b4dd-11ea-8c20-b036fd52a43e",
    tablename: "Settings_JobTitles",
    fields: "Id,arTitle",
  };
  try {
    const response = yield call(getJobTitlesOpt, get_JobTitles_req);
    yield put(getJobTitlesOptSuccess(response));
  } catch (error) {
    yield put(getJobTitlesOptFail(error));
  }
}

function* getTrainerProfile() {
  try {
    const response = yield call(getTrainerDeletedValue);
    yield put(getTrainerDeletedValueSuccess(response));
  } catch (error) {
    yield put(getTrainerDeletedValueFail(error));
  }
}

function* onAddNewTrainer({ payload }) {
  delete payload["id"];
  payload["source"] = "db";
  payload["procedure"] = "SisApp_addData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_Trainer";
  payload["queryname"] = "_Common_Trainer";

  try {
    const response = yield call(addNewTrainer, payload);

    yield put(addTrainerSuccess(response[0]));
  } catch (error) {
    yield put(addTrainerFail(error));
  }
}

function* onUpdateTrainer({ payload }) {
  console.log("qqqqqqqqqqqqqqqq", payload);
  payload["source"] = "db";
  payload["procedure"] = "SisApp_updateData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_Trainer";
  payload["queryname"] = "_Common_Trainer";
  try {
    const response = yield call(updateTrainer, payload);
    yield put(updateTrainerSuccess(response[0]));
  } catch (error) {
    yield put(updateTrainerFail(error));
  }
}

function* onDeleteTrainer({ payload, trainer }) {
  payload["source"] = "db";
  payload["procedure"] = "SisApp_removeData";
  payload["apikey"] = "30294470-b4dd-11ea-8c20-b036fd52a43e";
  payload["tablename"] = "Common_Trainer";

  try {
    const response = yield call(deleteTrainer, payload);
    yield put(deleteTrainerSuccess(response[0]));
  } catch (error) {
    yield put(deleteTrainerFail(error));
  }
}

function* onGetTrainerDeletedValue() {
  try {
    const response = yield call(getTrainerDeletedValue);
    yield put(getTrainerDeletedValueSuccess(response));
  } catch (error) {
    yield put(getTrainerDeletedValueFail(error));
  }
}

function* trainersSaga() {
  yield takeEvery(GET_TRAINERS, fetchTrainers);
  yield takeEvery(GET_TRAINER_DELETED_VALUE, getTrainerProfile);
  yield takeEvery(ADD_NEW_TRAINER, onAddNewTrainer);
  yield takeEvery(UPDATE_TRAINER, onUpdateTrainer);
  yield takeEvery(DELETE_TRAINER, onDeleteTrainer);
  yield takeEvery(GET_TRAINER_DELETED_VALUE, onGetTrainerDeletedValue);
}

export default trainersSaga;
